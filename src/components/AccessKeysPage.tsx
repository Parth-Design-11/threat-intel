import { useMemo, useState } from "react";
import { assets } from "../assets";
import { ENDPOINTS_BY_TYPE, isExpiringSoon } from "../apiManagement";
import type { ManagedApi } from "../data";
import { Pagination } from "./Pagination";
import { ApiTabs, type ApiTab } from "./ApiTabs";

const COLUMNS = [
  "Key Name",
  "Type",
  "Created By",
  "Created On",
  "Last Used",
  "Expiry",
  "Status",
  "Actions",
];

type AccessKeysPageProps = {
  keys: ManagedApi[];
  onCreate: () => void;
  onUpdateKeys: (keys: ManagedApi[]) => void;
  onChangeTab: (tab: ApiTab) => void;
};

export function AccessKeysPage({ keys, onCreate, onUpdateKeys, onChangeTab }: AccessKeysPageProps) {
  const [menuId, setMenuId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Disabled" | "Expired">("All");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      total: keys.length,
      active: keys.filter((key) => key.status === "Active").length,
      disabled: keys.filter((key) => key.status === "Disabled").length,
      expired: keys.filter((key) => key.status === "Expired").length,
    }),
    [keys],
  );

  const filtered = useMemo(() => {
    return keys.filter((key) => {
      if (statusFilter !== "All" && key.status !== statusFilter) return false;
      const haystack = `${key.name} ${key.keyId}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [keys, query, statusFilter]);

  function copy(text: string) {
    void navigator.clipboard.writeText(text);
  }

  function updateStatus(id: string, status: ManagedApi["status"]) {
    onUpdateKeys(keys.map((key) => (key.id === id ? { ...key, status } : key)));
    setMenuId(null);
  }

  return (
    <div className="main-inner">
      <div className="page-header">
        <h1 className="page-title">API Management</h1>
        <button type="button" className="btn-access" onClick={onCreate}>
          <span className="icon" style={{ width: 20, height: 20 }}>
            <img src={assets.iconAdd} alt="" width={20} height={20} />
          </span>
          Create API Key
        </button>
      </div>

      <ApiTabs active="keys" onChange={onChangeTab} />

      <div className="metrics">
        <article className={`metric-card is-clickable${statusFilter === "All" ? " is-selected" : ""}`} onClick={() => setStatusFilter("All")}>
          <p className="metric-label">Total APIs</p>
          <p className="metric-value">{counts.total}</p>
        </article>
        <article className={`metric-card is-clickable${statusFilter === "Active" ? " is-selected" : ""}`} onClick={() => setStatusFilter("Active")}>
          <p className="metric-label">Active</p>
          <p className="metric-value">{counts.active}</p>
        </article>
        <article className={`metric-card is-clickable${statusFilter === "Disabled" ? " is-selected" : ""}`} onClick={() => setStatusFilter("Disabled")}>
          <p className="metric-label">Disabled</p>
          <p className="metric-value">{counts.disabled}</p>
        </article>
        <article className={`metric-card is-clickable${statusFilter === "Expired" ? " is-selected" : ""}`} onClick={() => setStatusFilter("Expired")}>
          <p className="metric-label">Expired</p>
          <p className="metric-value">{counts.expired}</p>
        </article>
      </div>

      <section className="table-card">
        <div className="table-toolbar">
          <input
            className="logs-filter"
            placeholder="Search by API name or Key ID"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="table-wrap">
          <div className="thead">
            {COLUMNS.map((column) => (
              <div key={column} className={`th${column === "Actions" ? " is-actions" : ""}`}>
                {column}
              </div>
            ))}
          </div>
          {filtered.map((key, index) => {
            const muted = key.status !== "Active";
            return (
              <div key={key.id} className="row-block">
                <div className="trow">
                  <div className="td">
                    <div className="key-cell">
                      <div className={`key-icon${muted ? " is-muted" : ""}`}>
                        <img
                          src={muted ? assets.iconKeyMuted : assets.iconKey}
                          alt=""
                          width={16}
                          height={16}
                        />
                      </div>
                      <div className="key-text">
                        <p className={`key-name${muted ? " is-muted" : ""}`}>{key.name}</p>
                        <button type="button" className={`key-mask key-id-btn${muted ? " is-muted" : ""}`} onClick={() => copy(key.keyId)}>
                          {key.maskedKeyId}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="td">
                    <span className="cell-ellipsis" title={ENDPOINTS_BY_TYPE[key.type].map((item) => `${item.method} ${item.path}`).join("\n")}>
                      {key.type}
                    </span>
                  </div>
                  <div className="td">
                    <span className="cell-ellipsis">{key.createdBy}</span>
                  </div>
                  <div className="td is-muted">
                    <span className="cell-ellipsis">{key.createdOn}</span>
                  </div>
                  <div className="td is-muted">
                    <span className="cell-ellipsis">{key.lastUsed}</span>
                  </div>
                  <div className={`td${key.status === "Expired" ? " is-expired" : isExpiringSoon(key.expiry) ? " is-soon" : " is-muted"}`}>
                    <span className="cell-ellipsis">{key.expiry}</span>
                  </div>
                  <div className="td">
                    <span
                      className={`badge is-${key.status.toLowerCase()}`}
                    >
                      {key.status}
                    </span>
                  </div>
                  <div className="td is-actions">
                    <div className="menu">
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Actions for ${key.name}`}
                        onClick={() => setMenuId(menuId === key.id ? null : key.id)}
                      >
                        <img src={assets.iconDots} alt="" width={20} height={20} />
                      </button>
                      {menuId === key.id ? (
                        <div className="menu-list">
                          <button type="button" className="menu-item">
                            View details
                          </button>
                          <button type="button" className="menu-item" onClick={() => copy(key.keyId)}>
                            Copy Key ID
                          </button>
                          {key.status === "Disabled" ? (
                            <button type="button" className="menu-item" onClick={() => updateStatus(key.id, "Active")}>
                              Enable
                            </button>
                          ) : null}
                          {key.status === "Active" ? (
                            <button type="button" className="menu-item" onClick={() => updateStatus(key.id, "Disabled")}>
                              Disable
                            </button>
                          ) : null}
                          {key.status !== "Expired" ? <button type="button" className="menu-item">Edit</button> : null}
                          <button type="button" className="menu-item is-danger">
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                {index < filtered.length - 1 ? (
                  <div className="divider">
                    <span />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <Pagination page={1} totalPages={Math.max(1, Math.ceil(filtered.length / 25))} pageSize={25} />
      </section>
    </div>
  );
}
