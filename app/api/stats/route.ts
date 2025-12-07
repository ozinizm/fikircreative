import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Tarih hesaplamaları
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Paralel sorgular
    const [
      clientCount,
      lastMonthClientCount,
      taskCount,
      lastMonthTaskCount,
      pendingTaskCount,
      lastMonthPendingTaskCount,
      transactions,
      lastMonthTransactions,
      recentTasks
    ] = await Promise.all([
      prisma.client.count({ where: { userId } }),
      prisma.client.count({ 
        where: { 
          userId, 
          createdAt: { lte: endOfLastMonth } 
        } 
      }),
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ 
        where: { 
          userId, 
          createdAt: { lte: endOfLastMonth } 
        } 
      }),
      prisma.task.count({ where: { userId, status: "TODO" } }),
      prisma.task.count({ 
        where: { 
          userId, 
          status: "TODO",
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } 
        } 
      }),
      prisma.transaction.findMany({
        where: { userId },
        select: { amount: true, type: true, date: true }
      }),
      prisma.transaction.findMany({
        where: { 
          userId,
          date: { gte: startOfLastMonth, lte: endOfLastMonth }
        },
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

    // Gelir hesaplama (bu ay)
    const income = transactions
      .filter((t: any) => new Date(t.date) >= startOfMonth)
      .filter((t: any) => t.type === "INCOME")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const expense = transactions
      .filter((t: any) => new Date(t.date) >= startOfMonth)
      .filter((t: any) => t.type === "EXPENSE")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    // Geçen ay gelir
    const lastMonthIncome = lastMonthTransactions
      .filter((t: any) => t.type === "INCOME")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    // Yüzde hesaplamaları
    const clientChange = lastMonthClientCount > 0 
      ? ((clientCount - lastMonthClientCount) / lastMonthClientCount * 100).toFixed(1)
      : clientCount > 0 ? "100" : "0";

    const taskChange = lastMonthTaskCount > 0 
      ? ((taskCount - lastMonthTaskCount) / lastMonthTaskCount * 100).toFixed(1)
      : taskCount > 0 ? "100" : "0";

    const pendingChange = lastMonthPendingTaskCount > 0 
      ? ((pendingTaskCount - lastMonthPendingTaskCount) / lastMonthPendingTaskCount * 100).toFixed(1)
      : pendingTaskCount > 0 ? "100" : "0";

    const revenueChange = lastMonthIncome > 0 
      ? ((income - lastMonthIncome) / lastMonthIncome * 100).toFixed(1)
      : income > 0 ? "100" : "0";

    return NextResponse.json({
      clientCount,
      clientChange,
      taskCount,
      taskChange,
      pendingTaskCount,
      pendingChange,
      revenue: income,
      revenueChange,
      expense,
      balance: income - expense,
      recentTasks
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
