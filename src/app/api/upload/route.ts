import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);

/**
 * Admin-only product image upload. Files land in /public/uploads.
 * Note: on serverless hosts this storage is ephemeral — wire an S3/Blob
 * provider for production; the client contract (POST → { url }) stays the same.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Nuk keni qasje." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Asnjë skedar i dërguar." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Format i palejuar. Pranohen PNG, JPG, WEBP, SVG." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Skedari është mbi 4MB." }, { status: 400 });
  }

  const ext =
    file.type === "image/png" ? "png"
    : file.type === "image/webp" ? "webp"
    : file.type === "image/svg+xml" ? "svg"
    : "jpg";
  const name = `${crypto.randomBytes(8).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${name}` });
}
