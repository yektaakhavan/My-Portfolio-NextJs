import { head } from "@vercel/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NAME = /^[a-f0-9]{20}-(640|1600)\.webp$/;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await params;
  const name = parts.length === 1 ? parts[0] : "";

  if (!name || !NAME.test(name)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const blob = await head(name);

    return Response.redirect(blob.url, 307);
  } catch (error) {
    console.error("Image lookup failed:", error);
    return new Response("Not found", { status: 404 });
  }
}
