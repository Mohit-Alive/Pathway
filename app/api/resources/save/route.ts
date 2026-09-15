import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { toggleSaveResource } from "@/lib/dal/resources";

export async function POST(req: Request) {
  try {
    await requireUser();
    const body = await req.json();

    const { resourceId } = body;
    if (!resourceId) {
      return NextResponse.json({ error: "Missing resourceId" }, { status: 400 });
    }

    const result = await toggleSaveResource(resourceId);

    return NextResponse.json({
      success: true,
      isSaved: result.isSaved,
    });
  } catch (error: any) {
    console.error("Save resource error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to toggle saved resource." },
      { status: 500 }
    );
  }
}
