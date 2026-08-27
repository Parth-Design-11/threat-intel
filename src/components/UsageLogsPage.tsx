import { useMemo, useState } from "react";
import { assets } from "../assets";
import { REQUEST_LOGS, VOLUME_POINTS, type ManagedApi } from "../data";
import { ApiTabs, type ApiTab } from "./ApiTabs";
import { Pagination } from "./Pagination";

type UsageLogsPageProps = {
  keys: ManagedApi[];
  onCreate: () => void;
  onChangeTab: (tab: ApiTab) => void;
};

function methodClass(method: string) {
  if (method === "GET") return "is-get";
  return "is-post";
}

function statusClass(status: number) {
  return status >= 400 ? "is-status-err" : "is-status-ok";
}

export function UsageLogsPage({ keys, onCreate, onChangeTab }: UsageLogsPageProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [apiFilter, setApiFilter] = useState("All APIs");
  const [statusFilter, setStatusFilter] = useState("All status");

  const filteredLogs = useMemo(() => {
    return REQUEST_LOGS.filter((log) => {
      if (apiFilter !== "All APIs" && log.apiName !== apiFilter) return false;
      if (statusFilter !== "All status" && String(log.status) !== statusFilter) return false;
      return true;
    });
  }, [apiFilter, statusFilter]);

  return (
    <div className="main-inner is-usage">
      <div className="page-header">
        <h1 className="page-title">API Management</h1>
        <button type="button" className="btn-access is-usage" onClick={onCreate}>
          <span className="icon" style={{ width: 18, height: 18 }}>
            <img src={assets.iconPlus} alt="" width={18} height={18} />
          </span>
          Create API
        </button>
      </div>

      <ApiTabs active="usage" onChange={onChangeTab} />

      <div className="metrics">
        <article className="metric-card">
          <p className="metric-label">Total Requests</p>
          <div className="metric-row">
            <p className="metric-value">8,540</p>
            <div className="metric-trend is-up">
              <img src={assets.iconTrendUp} alt="" width={12} height={12} />
              <span>12.3% vs previous 24h</span>
            </div>
          </div>
        </article>
        <article className="metric-card">
          <p className="metric-label">Success Rate</p>
          <div className="metric-row">
            <p className="metric-value">99.2%</p>
            <div className="metric-trend is-up">
              <img src={assets.iconTrendUp} alt="" width={12} height={12} />
              <span>0.4%</span>
            </div>
          </div>
        </article>
        <article className="metric-card">
          <p className="metric-label">Avg Response Time</p>
          <div className="metric-row">
            <p className="metric-value">142ms</p>
            <div className="metric-trend is-up">
              <img src={assets.iconTrendDown} alt="" width={12} height={12} />
              <span>p95 228ms</span>
            </div>
          </div>
        </article>
        <article className="metric-card">
          <p className="metric-label">Errors (24h)</p>
          <div className="metric-row">
            <p className="metric-value">18</p>
            <div className="metric-trend is-down">
              <img src={assets.iconTrendUp} alt="" width={12} height={12} />
              <span>4xx: 12 · 5xx: 6</span>
            </div>
          </div>
        </article>
      </div>

      <section className="chart-card">
        <div className="chart-header">
          <p className="chart-title">API Request Volume (Last 7 Days)</p>
          <p className="chart-range">May 18 - May 24, 2026</p>
        </div>
        <div className="chart-body">
          {[0, 40, 80, 120, 160].map((top) => (
            <div key={top} className="gridline" style={{ top }} />
          ))}
          <div className="trend-line">
            <img src={assets.chartTrendLine} alt="" />
          </div>
          {VOLUME_POINTS.map((point) => (
            <img
              key={`${point.date}-dot`}
              className="chart-dot"
              src={assets.chartDot}
              alt=""
              style={{
                left: `${(point.dotLeft / 1079) * 100}%`,
                top: point.dotTop,
              }}
            />
          ))}
          {VOLUME_POINTS.map((point) => (
            <p
              key={`${point.date}-value`}
              className="chart-value"
              style={{ left: `${(point.left / 1079) * 100}%`, top: point.top }}
            >
              {point.value}
            </p>
          ))}
          {VOLUME_POINTS.map((point) => (
            <p
              key={`${point.date}-label`}
              className="chart-date"
              style={{ left: `${(point.dateLeft / 1079) * 100}%` }}
            >
              {point.date}
            </p>
          ))}
        </div>
      </section>

      <section className="logs-card">
        <div className="logs-header">
          <p className="logs-title">Request Logs</p>
          <div className="logs-filters">
            <select className="logs-filter" value={apiFilter} onChange={(event) => setApiFilter(event.target.value)}>
              <option>All APIs</option>
              {keys.map((key) => (
                <option key={key.id}>{key.name}</option>
              ))}
            </select>
            <select className="logs-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>All status</option>
              {[200, 201, 400, 401, 403, 404, 500, 503].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="logs-thead">
          {["Timestamp", "Endpoint", "Method", "Status", "Response Time", "API", "Request ID"].map(
            (column) => (
              <div key={column} className="th">
                {column}
              </div>
            ),
          )}
        </div>
        {filteredLogs.map((log, index) => (
          <div key={log.id} className="row-block">
            <div className="logs-row" onClick={() => setExpanded(expanded === log.id ? null : log.id)}>
              <div className="logs-td">{log.timestamp}</div>
              <div className="logs-td logs-api">{log.endpoint}</div>
              <div className="logs-td">
                <span className={`badge ${methodClass(log.method)}`}>{log.method}</span>
              </div>
              <div className="logs-td">
                <span className={`badge ${statusClass(log.status)}`}>{log.status}</span>
              </div>
              <div className="logs-td">{log.responseTime}</div>
              <div className="logs-td logs-key">{log.apiName}</div>
              <div className="logs-td logs-key">{log.requestId}</div>
            </div>
            {expanded === log.id ? (
              <div className="log-detail">
                <div>
                  <span className="field-label">Source IP</span>
                  <p>203.110.24.18</p>
                </div>
                <div>
                  <span className="field-label">Request payload</span>
                  <pre>{`{"identifier":{"type":"phone","value":"+91••••••3210"}}`}</pre>
                </div>
                <div>
                  <span className="field-label">Response payload</span>
                  <pre>{log.status >= 400 ? `{"error":{"code":"${log.status === 401 ? "UNAUTHORIZED" : "UPSTREAM_ERROR"}","message":"Request failed."}}` : `{"request_id":"${log.requestId}","status":"ok"}`}</pre>
                </div>
              </div>
            ) : null}
            {index < filteredLogs.length - 1 ? (
              <div className="divider">
                <span />
              </div>
            ) : null}
          </div>
        ))}
        <Pagination page={1} totalPages={Math.max(1, Math.ceil(filteredLogs.length / 25))} pageSize={25} />
      </section>
    </div>
  );
}
