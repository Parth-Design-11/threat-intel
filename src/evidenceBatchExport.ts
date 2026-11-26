import type { EvidenceBatchRow, EvidenceNumberBatchRow } from "./evidenceData";

function csvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function triggerDownload(fileName: string, body: string) {
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const base = fileName.replace(/\.[^.]+$/, "") || "evidence-export";
  link.href = url;
  link.download = `${base}-results.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadCombinationBatchCsv(
  fileName: string,
  rows: EvidenceBatchRow[],
  onlyWithEvidence: boolean,
) {
  const filtered = onlyWithEvidence ? rows.filter((row) => row.status === "has-evidence") : rows;
  const lines = [
    "a_party,b_party,status,messages,scam",
    ...filtered.map((row) =>
      [
        csvCell(row.aParty),
        csvCell(row.bParty),
        csvCell(row.status === "has-evidence" ? "Evidence available" : "No evidence"),
        csvCell(row.messageCount),
        csvCell(row.scamCount),
      ].join(","),
    ),
  ];
  triggerDownload(fileName, lines.join("\n"));
}

export function downloadNumberBatchCsv(
  fileName: string,
  rows: EvidenceNumberBatchRow[],
  onlyWithEvidence: boolean,
) {
  const filtered = onlyWithEvidence ? rows.filter((row) => row.status === "has-evidence") : rows;
  const lines = [
    "b_party,status,messages,scam",
    ...filtered.map((row) =>
      [
        csvCell(row.number),
        csvCell(row.status === "has-evidence" ? "Evidence available" : "No evidence"),
        csvCell(row.messageCount),
        csvCell(row.scamCount),
      ].join(","),
    ),
  ];
  triggerDownload(fileName, lines.join("\n"));
}