import { eq } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { adminGuard, revalidatePublic } from "./guard";

/**
 * Shared handler for "save the new drag & drop order".
 * Body: { ids: number[] } — the full list of ids in the order they should appear.
 * Position i gets sort = i + 1 (the same scheme new items already use).
 */
export async function saveOrder(
  req: Request,
  table: PgTable & { id: PgColumn; sort: PgColumn },
): Promise<Response> {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as { ids?: unknown } | null;
  const ids = body?.ids;
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > 500 ||
    !ids.every((n) => Number.isInteger(n)) ||
    new Set(ids).size !== ids.length
  ) {
    return Response.json({ error: "ids must be a list of unique numbers." }, { status: 400 });
  }

  await db.transaction(async (tx) => {
    for (let i = 0; i < ids.length; i++) {
      await tx.update(table).set({ sort: i + 1 }).where(eq(table.id, ids[i] as number));
    }
  });
  revalidatePublic();
  return Response.json({ ok: true });
}
