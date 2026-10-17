import { getCurrentUser, unauthorized } from "@/lib/auth";
import { getAdminOverview } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  return Response.json(await getAdminOverview());
}
