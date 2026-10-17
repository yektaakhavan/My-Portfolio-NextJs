import { eq } from "drizzle-orm";
import { db } from "@/db";
import { publicMessages } from "@/db/schema";
import { adminGuard, revalidatePublic } from "@/lib/guard";
import { badRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Approve / reject / move back to pending. Only "approved" messages are public. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: string };
  if (body.status !== "approved" && body.status !== "rejected" && body.status !== "pending") {
    return badRequest("status must be approved, rejected or pending");
  }
  const [row] = await db
    .update(publicMessages)
    .set({ status: body.status, reviewedAt: new Date() })
    .where(eq(publicMessages.id, Number(id)))
    .returning();
  if (!row) return Response.json({ error: "Message not found" }, { status: 404 });
  revalidatePublic();
  return Response.json({
    item: { ...row, createdAt: row.createdAt.toISOString(), reviewedAt: row.reviewedAt?.toISOString() ?? null },
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await params;
  const [row] = await db.delete(publicMessages).where(eq(publicMessages.id, Number(id))).returning();
  if (!row) return Response.json({ error: "Message not found" }, { status: 404 });
  revalidatePublic();
  return Response.json({ ok: true });
}
