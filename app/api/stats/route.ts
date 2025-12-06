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

    const userId = session.user.id;

    // Paralel sorgular
    const [
      clientCount,
      taskCount,
      pendingTaskCount,
      transactions,
      recentTasks
    ] = await Promise.all([
      prisma.client.count({ where: { userId } }),
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: "TODO" } }),
      prisma.transaction.findMany({
        where: { userId },
        select: { amount: true, type: true }
      }),
      prisma.task.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          project: {
            include: { client: true }
          }
        }
      })
    ]);

    // Gelir hesaplama
    const income = transactions
      .filter((t: any) => t.type === "INCOME")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const expense = transactions
      .filter((t: any) => t.type === "EXPENSE")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    return NextResponse.json({
      clientCount,
      taskCount,
      pendingTaskCount,
      revenue: income,
      expense,
      balance: income - expense,
      recentTasks
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
