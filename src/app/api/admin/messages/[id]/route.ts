import { eq } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { badRequest, getCurrentUser, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { read?: boolean };
  if (typeof body.read !== "boolean") return badRequest("read must be a boolean");
  const [row] = await db
    .update(messages)
    .set({ read: body.read })
    .where(eq(messages.id, Number(id)))
    .returning();
  if (!row) return Response.json({ error: "Message not found" }, { status: 404 });
  return Response.json({ message: row });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await params;
  const [row] = await db
    .delete(messages)
    .where(eq(messages.id, Number(id)))
    .returning();
  if (!row) return Response.json({ error: "Message not found" }, { status: 404 });
  return Response.json({ ok: true });
}
