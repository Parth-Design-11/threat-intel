import { REPORT_EXPORTS, type ReportExport } from "../insightsData";

type ReportsPageProps = {
  exports: ReportExport[];
};

const STATUS_LABEL: Record<ReportExport["status"], string> = {
  ready: "Ready to download",
  preparing: "Preparing",
  failed: "Failed",
};

function downloadStubReport(report: ReportExport) {
  const body = [
    "Wisely Threat Intelligence export",
    `Name: ${report.name}`,
    `Type: ${report.type}`,
    `Created: ${report.createdAt}`,
    `Created by: ${report.createdBy}`,
    "",
    "Prototype stub — replace with live CDR file when API is connected.",
  ].join("\n");
  const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.name.replace(/[^\w.-]+/g, "_").toLowerCase()}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ReportsPage({ exports }: ReportsPageProps) {
  const rows = exports.length > 0 ? exports : REPORT_EXPORTS;

  return (
    <div className="main-inner is-reports">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="insights-subtitle">
            CDR and summary exports prepared for your team. Ready files can be downloaded here.
          </p>
        </div>
      </div>

      <section className="table-card insights-table-card insights-reports-card" aria-label="Exports">
        <div className="table-wrap">
          <div className="thead insights-reports-row is-head">
            <div className="th">Export</div>
            <div className="th">Status</div>
            <div className="th">Created</div>
            <div className="th">Created by</div>
            <div className="th is-actions">Download</div>
          </div>
          {rows.map((row) => (
            <div key={row.id} className="trow insights-reports-row">
              <div className="td">
                <span className="insights-report-name">{row.name}</span>
                <span className="insights-report-type">{row.type}</span>
              </div>
              <div className="td">
                <span className={`insights-report-status is-${row.status}`}>
                  {STATUS_LABEL[row.status]}
                </span>
              </div>
              <div className="td">{row.createdAt}</div>
              <div className="td">{row.createdBy}</div>
              <div className="td is-actions">
                {row.status === "ready" ? (
                  <button
                    type="button"
                    className="insights-link-btn"
                    onClick={() => downloadStubReport(row)}
                  >
                    Download
                  </button>
                ) : (
                  <span className="insights-report-pending">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
