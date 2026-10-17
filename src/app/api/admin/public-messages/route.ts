import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { publicMessages } from "@/db/schema";
import { getCurrentUser, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const status = new URL(req.url).searchParams.get("status");
  const q = db.select().from(publicMessages);
  const rows =
    status === "pending" || status === "approved" || status === "rejected"
      ? await q.where(eq(publicMessages.status, status)).orderBy(desc(publicMessages.createdAt)).limit(300)
      : await q.orderBy(desc(publicMessages.createdAt)).limit(300);
  return Response.json({
    items: rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      reviewedAt: r.reviewedAt?.toISOString() ?? null,
    })),
  });
}
