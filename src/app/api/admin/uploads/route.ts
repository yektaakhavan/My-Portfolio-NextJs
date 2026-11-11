import { randomBytes } from "node:crypto";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { adminGuard } from "@/lib/guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = new Set(["jpeg", "png", "webp", "gif", "avif"]);

/**
 * Uploads optimized WebP images to Vercel Blob.
 * Creates 1600px and 640px versions.
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

  if (!(file instanceof File)) {
    return Response.json({ error: "No file received." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: "File is too large (max 12 MB)." },
      { status: 413 },
    );
  }

  const input = Buffer.from(await file.arrayBuffer());

  try {
    const meta = await sharp(input, {
      limitInputPixels: 40_000_000,
    }).metadata();

    if (!meta.format || !ALLOWED.has(meta.format)) {
      return Response.json(
        { error: "Please upload a JPG, PNG, WebP, GIF or AVIF image." },
        { status: 415 },
      );
    }

    const id = randomBytes(10).toString("hex");
    const base = sharp(input, {
      limitInputPixels: 40_000_000,
    }).rotate();

    const [main, thumb] = await Promise.all([
      base
        .clone()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true }),

      base
        .clone()
        .resize({ width: 640, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toBuffer(),
    ]);

    const [mainBlob, thumbBlob] = await Promise.all([
      put(`${id}-1600.webp`, main.data, {
        access: "public",
        addRandomSuffix: false,
        contentType: "image/webp",
        cacheControlMaxAge: 31536000,
      }),

      put(`${id}-640.webp`, thumb, {
        access: "public",
        addRandomSuffix: false,
        contentType: "image/webp",
        cacheControlMaxAge: 31536000,
      }),
    ]);

    return Response.json(
      {
        url: mainBlob.url,
        thumbUrl: thumbBlob.url,
        width: main.info.width,
        height: main.info.height,
        bytes: main.info.size,
        originalBytes: file.size,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Image upload failed:", error);

    return Response.json(
      { error: "Image upload failed. Please try again." },
      { status: 500 },
    );
  }
}
