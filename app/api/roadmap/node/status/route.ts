import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { updateNodeProgress } from "@/lib/dal/roadmap";

export async function POST(req: Request) {
  try {
    await requireUser();
    const body = await req.json();

    const { nodeId, status } = body;
    if (!nodeId || !["in_progress", "completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status update payload" }, { status: 400 });
    }

    await updateNodeProgress(nodeId, status);

    return NextResponse.json({
      success: true,
      message: "Node status updated.",
    });
  } catch (error: any) {
    console.error("Update node status error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update node status." },
      { status: 500 }
    );
  }
}
