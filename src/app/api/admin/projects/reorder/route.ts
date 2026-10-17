import { projects } from "@/db/schema";
import { saveOrder } from "@/lib/reorder";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  return saveOrder(req, projects);
}
