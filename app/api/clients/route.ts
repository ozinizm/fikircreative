import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { clientSchema } from "@/lib/validation";
import { logActivity } from "@/lib/activity-logger";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        projects: true,
        _count: {
          select: { projects: true, transactions: true }
        }
      }
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
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
    console.log("Client POST request body:", body);
    
    const { name, contact, email, phone, website, address, monthlyFee, status } = body;

    // Basic validation
    if (!name || !contact || !email) {
      return NextResponse.json(
        { error: "İsim, iletişim kişisi ve email zorunludur" },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir email adresi girin" },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        name,
        contact,
        email,
        phone,
        website,
        address,
        monthlyFee: monthlyFee ? parseFloat(monthlyFee) : null,
        status: status || "ACTIVE",
        userId: session.user.id,
      },
    });

    console.log("Client created:", client);

    // Aylık ücret varsa otomatik gelir kaydı oluştur
    if (monthlyFee && parseFloat(monthlyFee) > 0) {
      const transaction = await prisma.transaction.create({
        data: {
          title: `${name} - Aylık Ücret`,
          type: "INCOME",
          amount: parseFloat(monthlyFee),
          description: `${name} müşterisinden aylık hizmet ücreti`,
          status: "COMPLETED",
          clientId: client.id,
          userId: session.user.id,
        },
      });
      console.log("Transaction created:", transaction);
    }

    // Aktivite kaydı oluştur
    await logActivity({
      userId: session.user.id,
      action: "CREATE",
      entity: "CLIENT",
      entityId: client.id,
      details: `Yeni müşteri eklendi: ${name}`,
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message }, 
      { status: 500 }
    );
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

    // Önce müşteriye ait finans kayıtlarını sil
    await prisma.transaction.deleteMany({
      where: { clientId: id, userId: session.user.id },
    });

    // Sonra müşteriyi sil
    await prisma.client.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
