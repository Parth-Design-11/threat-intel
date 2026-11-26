import {
  resolveEvidenceBatch,
  resolveEvidenceMetrics,
  resolveEvidenceNumberBatch,
  resolveEvidencePairMetrics,
  SAMPLE_EVIDENCE_NUMBERS,
  SAMPLE_EVIDENCE_PAIRS,
  type EvidenceBatchRow,
  type EvidenceNumberBatchRow,
} from "./evidenceData";

export type EvidenceUploadKind = "multiple" | "combination";

export type EvidenceUploadRecord = {
  id: string;
  fileName: string;
  kind: EvidenceUploadKind;
  uploadedAt: number;
  rowsScanned: number;
  evidenceFound: number;
  spamMessages: number;
  scamMessages: number;
  combinationRows?: EvidenceBatchRow[];
  numberRows?: EvidenceNumberBatchRow[];
};

const STORAGE_KEY = "wisely.evidence-uploads";

function parseMetricNumber(value: string) {
  return Number(value.replace(/,/g, "")) || 0;
}

function formatUploadStamp(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function readStore(): EvidenceUploadRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EvidenceUploadRecord[];
  } catch {
    return [];
  }
}

function writeStore(records: EvidenceUploadRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function summarizeNumberBatch(rows: EvidenceNumberBatchRow[]) {
  const withEvidence = rows.filter((row) => row.status === "has-evidence");
  let spamMessages = 0;
  let scamMessages = 0;
  for (const row of withEvidence) {
    const metrics = resolveEvidenceMetrics(row.number);
    spamMessages += parseMetricNumber(metrics.spamMessages);
    scamMessages += parseMetricNumber(metrics.scamMessages);
  }
  return {
    rowsScanned: rows.length,
    evidenceFound: withEvidence.length,
    spamMessages,
    scamMessages,
  };
}

function summarizeCombinationBatch(rows: EvidenceBatchRow[]) {
  const withEvidence = rows.filter((row) => row.status === "has-evidence");
  let spamMessages = 0;
  let scamMessages = 0;
  for (const row of withEvidence) {
    const metrics = resolveEvidencePairMetrics(row.aParty, row.bParty);
    spamMessages += parseMetricNumber(metrics.spamMessages);
    scamMessages += parseMetricNumber(metrics.scamMessages);
  }
  return {
    rowsScanned: rows.length,
    evidenceFound: withEvidence.length,
    spamMessages,
    scamMessages,
  };
}

function buildSeedUploads(): EvidenceUploadRecord[] {
  const combinationRows = resolveEvidenceBatch(SAMPLE_EVIDENCE_PAIRS);
  const numberRows = resolveEvidenceNumberBatch(SAMPLE_EVIDENCE_NUMBERS);
  const comboSummary = summarizeCombinationBatch(combinationRows);
  const numberSummary = summarizeNumberBatch(numberRows);
  const now = Date.now();
  return [
    {
      id: "seed-upload-combo",
      fileName: "april-ab-party-batch.csv",
      kind: "combination",
      uploadedAt: now - 1000 * 60 * 60 * 26,
      combinationRows,
      ...comboSummary,
    },
    {
      id: "seed-upload-numbers",
      fileName: "b-party-receiver-list.csv",
      kind: "multiple",
      uploadedAt: now - 1000 * 60 * 60 * 52,
      numberRows,
      ...numberSummary,
    },
  ];
}

export function getEvidenceUploads(): EvidenceUploadRecord[] {
  const stored = readStore();
  if (stored.length > 0) return stored;
  return buildSeedUploads();
}

export function addEvidenceUpload(input: {
  fileName: string;
  kind: EvidenceUploadKind;
  combinationRows?: EvidenceBatchRow[];
  numberRows?: EvidenceNumberBatchRow[];
}): EvidenceUploadRecord {
  const summary =
    input.kind === "multiple" && input.numberRows
      ? summarizeNumberBatch(input.numberRows)
      : input.kind === "combination" && input.combinationRows
        ? summarizeCombinationBatch(input.combinationRows)
        : { rowsScanned: 0, evidenceFound: 0, spamMessages: 0, scamMessages: 0 };

  const record: EvidenceUploadRecord = {
    id: `upload-${Date.now()}`,
    fileName: input.fileName,
    kind: input.kind,
    uploadedAt: Date.now(),
    combinationRows: input.combinationRows,
    numberRows: input.numberRows,
    ...summary,
  };

  const stored = readStore();
  writeStore([record, ...stored].slice(0, 20));
  return record;
}

export function formatEvidenceUploadTime(timestamp: number) {
  return formatUploadStamp(timestamp);
}

export function uploadKindLabel(kind: EvidenceUploadKind) {
  return kind === "multiple" ? "Multiple B-party numbers" : "A-party · B-party pairs";
}

export function threatMessageTotal(record: EvidenceUploadRecord) {
  return record.spamMessages + record.scamMessages;
}

export function spamShare(record: EvidenceUploadRecord) {
  const total = threatMessageTotal(record);
  if (total === 0) return 0;
  return Math.round((record.spamMessages / total) * 100);
}

export function scamShare(record: EvidenceUploadRecord) {
  const total = threatMessageTotal(record);
  if (total === 0) return 0;
  return Math.round((record.scamMessages / total) * 100);
}