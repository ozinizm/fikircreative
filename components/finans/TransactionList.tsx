import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const transactions = [
  {
    id: "1",
    title: "Tasarım Projesi Ödemesi",
    client: "TechCorp Inc.",
    amount: 15000,
    type: "income",
    date: "15 May 2024",
    status: "completed",
  },
  {
    id: "2",
    title: "Yazılım Aboneliği",
    client: "Adobe Creative Cloud",
    amount: 2500,
    type: "expense",
    date: "18 Ara",
    status: "completed",
  },
  {
    id: "3",
    title: "Ekran Alıntısı Aracı",
    client: "Snagit License",
    amount: 850,
    type: "expense",
    date: "20 Ara",
    status: "pending",
  },
];

const statusColors = {
  completed: "text-green-500 bg-green-500/20 border-green-500/30",
  pending: "text-yellow-500 bg-yellow-500/20 border-yellow-500/30",
  overdue: "text-red-500 bg-red-500/20 border-red-500/30",
};

const statusLabels = {
  completed: "Tamamlandı",
  pending: "Beklemede",
  overdue: "Gecikmiş",
};

export function TransactionList() {
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-[#252525] border border-[#2a2a2a] rounded-lg p-4 hover:border-[#3a3a3a] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${transaction.type === "income" 
                  ? "bg-green-500/20" 
                  : "bg-red-500/20"
                }
              `}>
                {transaction.type === "income" ? (
                  <ArrowUpRight size={24} className="text-green-500" />
                ) : (
                  <ArrowDownRight size={24} className="text-red-500" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">{transaction.title}</h3>
                <p className="text-sm text-gray-400">{transaction.client}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  transaction.type === "income" ? "text-green-500" : "text-red-500"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}₺{transaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">{transaction.date}</p>
              </div>

              <span className={`
                px-3 py-1.5 text-sm rounded-lg border
                ${statusColors[transaction.status as keyof typeof statusColors]}
              `}>
                {statusLabels[transaction.status as keyof typeof statusLabels]}
              </span>
            </div>
          </div>
        </div>
      ))}

      <button className="w-full py-3 text-sm text-gray-400 hover:text-white transition-all border border-[#2a2a2a] rounded-lg hover:border-[#3a3a3a]">
        Tüm İşlemleri Görüntüle →
      </button>
    </div>
  );
}
