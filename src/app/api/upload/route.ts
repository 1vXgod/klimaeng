import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { BlobError, put } from "@vercel/blob";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);

const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Admin-only product image upload. POST multipart/form-data with a `file`
 * field → { url }.
 *
 * Storage: Vercel Blob. `put()` resolves its own credentials — either
 * BLOB_READ_WRITE_TOKEN, or (when the store is connected to the project)
 * VERCEL_OIDC_TOKEN + BLOB_STORE_ID auto-injected by Vercel — so we must
 * not pre-gate on BLOB_READ_WRITE_TOKEN specifically; doing so blocks the
 * OIDC path entirely. We only fall back to local disk (dev only — the
 * serverless filesystem is read-only and ephemeral in production, so
 * writing to /public can never work there) once Blob itself reports it
 * has no usable credentials.
 *
 * Every outcome, including unexpected failures, returns JSON so the client
 * never has to parse an empty or HTML error body.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return jsonError("Nuk keni qasje.", 403);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return jsonError("Kërkesa nuk është multipart/form-data e vlefshme.", 400);
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return jsonError("Asnjë skedar i dërguar.", 400);
    }
    if (!ALLOWED.has(file.type)) {
      return jsonError("Format i palejuar. Pranohen PNG, JPG, WEBP, SVG.", 400);
    }
    if (file.size > MAX_SIZE) {
      return jsonError("Skedari është mbi 4MB.", 400);
    }

    const name = `${crypto.randomBytes(8).toString("hex")}.${EXT[file.type]}`;

    try {
      const blob = await put(`products/${name}`, file, {
        access: "public",
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    } catch (e) {
      if (!(e instanceof BlobError)) throw e;

      if (process.env.NODE_ENV !== "production") {
        const dir = path.join(process.cwd(), "public", "uploads");
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
        return NextResponse.json({ url: `/uploads/${name}` });
      }

      console.error("[upload] Vercel Blob unavailable:", e.message);
      return jsonError(
        `Ruajtja e imazheve nuk është e konfiguruar në server (${e.message}).`,
        503
      );
    }
  } catch (e) {
    console.error("[upload] failed:", e);
    return jsonError("Ngarkimi dështoi nga një gabim i brendshëm. Provoni përsëri.", 500);
  }
}
