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

    const equipment = await prisma.equipment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("📦 Equipment POST - Session:", session?.user);
    
    if (!session?.user?.id) {
      console.log("❌ Equipment POST - No session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("📦 Equipment POST - Body:", body);
    
    const { name, category, serialNumber, status, assignedTo } = body;

    console.log("📦 Equipment POST - Creating with data:", {
      name, category, serialNumber, status: status || "AVAILABLE", assignedTo, userId: session.user.id
    });

    const equipment = await prisma.equipment.create({
      data: {
        name,
        category,
        serialNumber,
        status: status || "AVAILABLE",
        assignedTo,
        userId: session.user.id,
      },
    });

    console.log("✅ Equipment created:", equipment.id);
    return NextResponse.json(equipment);
  } catch (error) {
    console.error("❌ Equipment POST Error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const equipment = await prisma.equipment.update({
      where: { id, userId: session.user.id },
      data: updates,
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error updating equipment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.equipment.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting equipment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
