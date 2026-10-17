import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { adminGuard } from "@/lib/guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = new Set(["jpeg", "png", "webp", "gif", "avif"]);

/**
 * Drag & drop uploads.
 * Every image is re-encoded with sharp to WebP (1600px + 640px versions). That strips metadata
 * (EXIF/GPS), neutralises disguised files, and makes the public pages MUCH lighter and faster.
 */
export async function POST(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Invalid upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file received." }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File is too large (max 12 MB)." }, { status: 413 });
  }

  const input = Buffer.from(await file.arrayBuffer());
  try {
    const meta = await sharp(input, { limitInputPixels: 40_000_000 }).metadata();
    if (!meta.format || !ALLOWED.has(meta.format)) {
      return Response.json({ error: "Please upload a JPG, PNG, WebP, GIF or AVIF image." }, { status: 415 });
    }
    const id = randomBytes(10).toString("hex");
    const base = sharp(input, { limitInputPixels: 40_000_000 }).rotate();
    const [main, thumb] = await Promise.all([
      base.clone().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true }),
      base.clone().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer(),
    ]);
    await mkdir(UPLOAD_DIR, { recursive: true });
    await Promise.all([
      writeFile(path.join(UPLOAD_DIR, `${id}-1600.webp`), main.data),
      writeFile(path.join(UPLOAD_DIR, `${id}-640.webp`), thumb),
    ]);
    return Response.json(
      {
        url: `/uploads/${id}-1600.webp`,
        thumbUrl: `/uploads/${id}-640.webp`,
        width: main.info.width,
        height: main.info.height,
        bytes: main.info.size,
        originalBytes: file.size,
      },
      { status: 201 },
    );
  } catch {
    return Response.json({ error: "That file could not be read as an image." }, { status: 415 });
  }
}
