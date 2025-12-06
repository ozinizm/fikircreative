import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportData {
  [key: string]: any;
}

export function exportToExcel(data: ExportData[], filename: string) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    
    // Auto-width columns
    const maxWidth = data.reduce((w, r) => Math.max(w, ...Object.keys(r).map(k => k.length)), 10);
    worksheet["!cols"] = [{ wch: maxWidth }];
    
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
}

export function exportToPDF(
  data: ExportData[],
  filename: string,
  title: string,
  columns: string[]
) {
  try {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`, 14, 30);
    
    // Table
    const tableData = data.map(row => columns.map(col => row[col] || ""));
    
    autoTable(doc, {
      head: [columns],
      body: tableData,
      startY: 40,
      styles: { font: "helvetica", fontSize: 9 },
      headStyles: { fillColor: [239, 68, 68] }, // Red color
    });
    
    doc.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    return false;
  }
}

export function exportToCSV(data: ExportData[], filename: string) {
  try {
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          return typeof value === "string" && value.includes(",")
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(",")
      ),
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    return false;
  }
}

// Format data for export
export function formatClientsForExport(clients: any[]) {
  return clients.map(client => ({
    "Müşteri Adı": client.name,
    "İletişim Kişisi": client.contact,
    "Email": client.email,
    "Telefon": client.phone || "-",
    "Website": client.website || "-",
    "Durum": client.status,
    "Aylık Ücret": client.monthlyFee ? `₺${client.monthlyFee.toLocaleString("tr-TR")}` : "-",
    "Kayıt Tarihi": new Date(client.createdAt).toLocaleDateString("tr-TR"),
  }));
}

export function formatTransactionsForExport(transactions: any[]) {
  return transactions.map(t => ({
    "Başlık": t.title,
    "Tutar": `₺${t.amount.toLocaleString("tr-TR")}`,
    "Tip": t.type === "INCOME" ? "Gelir" : "Gider",
    "Durum": t.status,
    "Açıklama": t.description || "-",
    "Tarih": new Date(t.date).toLocaleDateString("tr-TR"),
  }));
}

export function formatTasksForExport(tasks: any[]) {
  return tasks.map(task => ({
    "Görev": task.title,
    "Durum": task.status,
    "Öncelik": task.priority,
    "Proje": task.project?.name || "-",
    "Müşteri": task.project?.client?.name || "-",
    "Son Tarih": task.deadline ? new Date(task.deadline).toLocaleDateString("tr-TR") : "-",
    "Oluşturulma": new Date(task.createdAt).toLocaleDateString("tr-TR"),
  }));
}

export function formatReportsForExport(reports: any[]) {
  return reports.map(report => ({
    "Başlık": report.title,
    "Tip": report.type,
    "Durum": report.status,
    "Oluşturan": report.user?.name || "-",
    "Tarih": new Date(report.createdAt).toLocaleDateString("tr-TR"),
  }));
}
