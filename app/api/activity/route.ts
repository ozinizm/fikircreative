import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Future: When ActivityLog model is added to schema
    // const activities = await prisma.activityLog.findMany({
    //   where: { userId: session.user.id },
    //   orderBy: { createdAt: "desc" },
    //   take: 50,
    // });

    // For now, return empty array
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, entity, entityId, details, metadata } = body;

    // Future: When ActivityLog model is added
    // const activity = await prisma.activityLog.create({
    //   data: {
    //     action,
    //     entity,
    //     entityId,
    //     details,
    //     metadata,
    //     userId: session.user.id,
    //   },
    // });

    // For now, just log to console
    console.log(`[ACTIVITY] ${action} ${entity} by ${session.user.id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating activity log:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
