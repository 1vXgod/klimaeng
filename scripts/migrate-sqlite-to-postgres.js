/**
 * One-time data migration: prisma/dev.db (SQLite) → Neon PostgreSQL.
 *
 * Usage:  node scripts/migrate-sqlite-to-postgres.js
 *
 * Safety properties:
 *  - INSERT-only (createMany) — never updates or deletes existing Neon rows.
 *  - Preserves every ID, so all relations keep pointing to the right rows.
 *  - Idempotent: rows whose unique keys already exist (id, slug, email,
 *    orderNo, token) are skipped, so re-running is harmless and the 14
 *    products already in Neon are not duplicated.
 *  - Migrates parents before children (FK-safe order):
 *    User → Product → Address → Review → Order → OrderItem →
 *    Notification → ActivityLog → PasswordResetToken → ContactMessage
 *  - Verifies by counting rows in every table on both sides afterwards.
 *
 * Requires Node ≥ 22.13 (built-in node:sqlite) and the PostgreSQL-generated
 * @prisma/client (schema.prisma datasource = postgresql).
 */
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const { PrismaClient } = require("@prisma/client");

// --- minimal .env loader (dotenv is not a dependency) ---------------------
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)="?([^"]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
if (!/^postgres/.test(process.env.DATABASE_URL ?? "")) {
  console.error("DATABASE_URL is not a PostgreSQL URL — aborting to be safe.");
  process.exit(1);
}

// --- SQLite value conversions ----------------------------------------------
// Prisma stores DateTime as epoch-milliseconds and Boolean as 0/1 in SQLite.
const asDate = (v) => (v === null ? null : new Date(Number(v)));
const asBool = (v) => (v === null ? null : v === 1 || v === true);

/** Per-table column converters; anything not listed passes through as-is. */
const CONVERT = {
  User: { createdAt: asDate, updatedAt: asDate },
  Product: {
    wifi: asBool, inverter: asBool, featured: asBool,
    createdAt: asDate, updatedAt: asDate,
  },
  Address: { isDefault: asBool, createdAt: asDate },
  Review: { approved: asBool, createdAt: asDate },
  Order: { withInstallation: asBool, createdAt: asDate, updatedAt: asDate },
  OrderItem: {},
  Notification: { read: asBool, createdAt: asDate },
  ActivityLog: { createdAt: asDate },
  PasswordResetToken: { expiresAt: asDate, createdAt: asDate },
  ContactMessage: { read: asBool, createdAt: asDate },
};

/** FK-safe migration order: parents first. */
const ORDER = [
  ["User", (p) => p.user],
  ["Product", (p) => p.product],
  ["Address", (p) => p.address],
  ["Review", (p) => p.review],
  ["Order", (p) => p.order],
  ["OrderItem", (p) => p.orderItem],
  ["Notification", (p) => p.notification],
  ["ActivityLog", (p) => p.activityLog],
  ["PasswordResetToken", (p) => p.passwordResetToken],
  ["ContactMessage", (p) => p.contactMessage],
];

function readTable(db, table) {
  const rows = db.prepare(`SELECT * FROM "${table}"`).all();
  const convert = CONVERT[table];
  return rows.map((raw) => {
    const row = {};
    for (const [key, value] of Object.entries(raw)) {
      row[key] = convert[key] ? convert[key](value) : value;
    }
    return row;
  });
}

async function main() {
  const sqlitePath = path.join(__dirname, "..", "prisma", "dev.db");
  const db = new DatabaseSync(sqlitePath, { readOnly: true });
  const prisma = new PrismaClient();

  console.log(`SQLite source: ${sqlitePath}`);
  console.log(`Postgres target: ${process.env.DATABASE_URL.replace(/:[^:@/]+@/, ":****@")}\n`);

  try {
    // Products already in Neon: build slug → id map so we could remap child
    // rows if the manually-migrated products had been given new IDs.
    const existingProducts = await prisma.product.findMany({ select: { id: true, slug: true } });
    const neonProductIdBySlug = new Map(existingProducts.map((p) => [p.slug, p.id]));

    const sqliteProducts = db.prepare(`SELECT id, slug FROM "Product"`).all();
    const productIdMap = new Map(); // sqlite id → neon id
    for (const p of sqliteProducts) {
      productIdMap.set(p.id, neonProductIdBySlug.get(p.slug) ?? p.id);
    }
    const remapped = [...productIdMap.entries()].filter(([a, b]) => a !== b).length;
    console.log(
      `Product ID map: ${productIdMap.size} products, ${remapped} need remapping` +
        (remapped === 0 ? " (IDs match — nothing to remap)" : "")
    );

    // --- migrate, parents first ------------------------------------------
    console.log("\nMigrating…");
    for (const [table, model] of ORDER) {
      let rows = readTable(db, table);

      // Remap product references on child tables (identity when IDs match).
      if (table === "Review" || table === "OrderItem") {
        rows = rows.map((r) => ({
          ...r,
          productId: r.productId === null ? null : (productIdMap.get(r.productId) ?? null),
        }));
      }

      if (rows.length === 0) {
        console.log(`  ${table.padEnd(20)} 0 rows in SQLite — skipped`);
        continue;
      }
      const { count } = await model(prisma).createMany({
        data: rows,
        skipDuplicates: true,
      });
      console.log(
        `  ${table.padEnd(20)} inserted ${String(count).padStart(3)} / ${rows.length}` +
          (count < rows.length ? `  (${rows.length - count} already existed — skipped)` : "")
      );
    }

    // --- verification ------------------------------------------------------
    console.log("\nVerification — row counts:");
    console.log(`  ${"Table".padEnd(20)} ${"SQLite".padStart(7)} ${"Neon".padStart(7)}  Status`);
    let allOk = true;
    for (const [table, model] of ORDER) {
      const sqliteCount = db.prepare(`SELECT COUNT(*) n FROM "${table}"`).get().n;
      const neonCount = await model(prisma).count();
      const ok = neonCount >= sqliteCount;
      if (!ok) allOk = false;
      console.log(
        `  ${table.padEnd(20)} ${String(sqliteCount).padStart(7)} ${String(neonCount).padStart(7)}  ${ok ? "OK" : "MISSING ROWS"}`
      );
    }

    // Relation spot-checks: no orphaned foreign keys (raw LEFT JOINs).
    const orphan = async (sql) => Number((await prisma.$queryRawUnsafe(sql))[0].n);
    const orphanItems = await orphan(
      `SELECT COUNT(*)::int n FROM "OrderItem" oi LEFT JOIN "Order" o ON oi."orderId" = o.id WHERE o.id IS NULL`
    );
    const orphanAddresses = await orphan(
      `SELECT COUNT(*)::int n FROM "Address" a LEFT JOIN "User" u ON a."userId" = u.id WHERE u.id IS NULL`
    );
    const orphanNotifications = await orphan(
      `SELECT COUNT(*)::int n FROM "Notification" nf LEFT JOIN "User" u ON nf."userId" = u.id WHERE u.id IS NULL`
    );
    const orphanProductRefs = await orphan(
      `SELECT COUNT(*)::int n FROM "OrderItem" oi LEFT JOIN "Product" p ON oi."productId" = p.id WHERE oi."productId" IS NOT NULL AND p.id IS NULL`
    );
    const linkedItems = await prisma.orderItem.count({ where: { productId: { not: null } } });
    console.log("\nRelation checks:");
    console.log(`  OrderItems without an Order:        ${orphanItems} (expected 0)`);
    console.log(`  Addresses without a User:           ${orphanAddresses} (expected 0)`);
    console.log(`  Notifications without a User:       ${orphanNotifications} (expected 0)`);
    console.log(`  OrderItems pointing to a missing Product: ${orphanProductRefs} (expected 0)`);
    console.log(`  OrderItems linked to a Product:     ${linkedItems}`);

    const success =
      allOk &&
      orphanItems === 0 &&
      orphanAddresses === 0 &&
      orphanNotifications === 0 &&
      orphanProductRefs === 0;
    console.log(success ? "\n✔ Migration complete — all tables verified." : "\n✖ Verification found problems — see above.");
    process.exitCode = success ? 0 : 1;
  } finally {
    await prisma.$disconnect();
    db.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
