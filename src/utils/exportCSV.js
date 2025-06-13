export function exportToCSV(filename, rows) {
  const processRow = row => row.map(String).map(v => `"${v.replace(/"/g, '""')}"`).join(",");
  const csv = rows.map(processRow).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}