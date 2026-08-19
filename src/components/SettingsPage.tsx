import { useMemo, useState } from "react";
import { assets } from "../assets";
import { Pagination } from "./Pagination";
import { SettingsTabs, type SettingsTab } from "./SettingsTabs";
import {
  USER_ROLES,
  USER_STATUSES,
  type ManagedUser,
  type UserRole,
  type UserStatus,
} from "../usersData";

const COLUMNS = ["Name", "Email", "Role", "Last Log-in", "Status", "Actions"];

type SettingsPageProps = {
  users: ManagedUser[];
  onAddUser: () => void;
  onEditUser: (user: ManagedUser) => void;
  onToggleStatus: (id: string) => void;
  onRemoveUser: (id: string) => void;
};

function statusClass(status: UserStatus) {
  if (status === "PENDING") return "is-pending";
  if (status === "INACTIVE") return "is-disabled";
  return "is-active";
}

export function SettingsPage({
  users,
  onAddUser,
  onEditUser,
  onToggleStatus,
  onRemoveUser,
}: SettingsPageProps) {
  const [tab, setTab] = useState<SettingsTab>("users");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"All" | UserRole>("All");
  const [status, setStatus] = useState<"All" | UserStatus>("All");
  const [openFilter, setOpenFilter] = useState<"role" | "status" | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        needle === "" ||
        user.name.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle);
      const matchesRole = role === "All" || user.role === role;
      const matchesStatus = status === "All" || user.status === status;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, role, status]);

  return (
    <div className="main-inner">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <SettingsTabs active={tab} onChange={setTab} />

      {tab === "audit" ? (
        <p className="explore-hint" style={{ marginTop: 32 }}>
          Audit Trail will appear here.
        </p>
      ) : (
        <>
          <div className="users-toolbar">
            <form
              className="users-search"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="users-search-field">
                <span className="users-search-icon">
                  <img src={assets.iconExplore} alt="" width={20} height={20} />
                </span>
                <input
                  className="users-search-input"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search..."
                  aria-label="Search users"
                />
              </label>
              <button type="submit" className="users-search-btn" aria-label="Search">
                <img src={assets.iconExplore} alt="" width={20} height={20} />
              </button>
            </form>

            <div className="users-toolbar-end">
              <div className="select-menu">
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setOpenFilter(openFilter === "role" ? null : "role")}
                >
                  {role === "All" ? "Role" : role}
                  <img src={assets.iconChevron} alt="" width={16} height={16} />
                </button>
                {openFilter === "role" ? (
                  <div className="select-list">
                    {(["All", ...USER_ROLES] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`select-option${option === role ? " is-active" : ""}`}
                        onClick={() => {
                          setRole(option);
                          setOpenFilter(null);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="select-menu">
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setOpenFilter(openFilter === "status" ? null : "status")}
                >
                  {status === "All" ? "Status" : status}
                  <img src={assets.iconChevron} alt="" width={16} height={16} />
                </button>
                {openFilter === "status" ? (
                  <div className="select-list">
                    {(["All", ...USER_STATUSES] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`select-option${option === status ? " is-active" : ""}`}
                        onClick={() => {
                          setStatus(option);
                          setOpenFilter(null);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <button type="button" className="btn-access" onClick={onAddUser}>
                <span className="icon" style={{ width: 20, height: 20 }}>
                  <img src={assets.iconAdd} alt="" width={20} height={20} />
                </span>
                New user
              </button>
            </div>
          </div>

          <section className="table-card">
            <div className="table-wrap">
              <div className="thead users-head">
                {COLUMNS.map((column) => (
                  <div key={column} className={`th${column === "Actions" ? " is-actions" : ""}`}>
                    {column}
                  </div>
                ))}
              </div>
              {filtered.map((user, index) => (
                <div key={user.id} className="row-block">
                  <div className="trow users-row">
                    <div className="td">
                      <span className="key-name">{user.name}</span>
                    </div>
                    <div className="td is-muted">
                      <span className="cell-ellipsis">{user.email}</span>
                    </div>
                    <div className="td">{user.role}</div>
                    <div className="td is-muted">
                      <div className="login-cell">
                        <span>{user.lastLoginDate}</span>
                        <span>{user.lastLoginTime}</span>
                      </div>
                    </div>
                    <div className="td">
                      <span className={`badge ${statusClass(user.status)}`}>{user.status}</span>
                    </div>
                    <div className="td is-actions">
                      <div className="user-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          aria-label={`Edit ${user.name}`}
                          onClick={() => onEditUser(user)}
                        >
                          <img src={assets.iconEdit} alt="" width={20} height={20} />
                        </button>
                        <div className="menu">
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label={`More actions for ${user.name}`}
                            onClick={() => setMenuId(menuId === user.id ? null : user.id)}
                          >
                            <img src={assets.iconDots} alt="" width={20} height={20} />
                          </button>
                          {menuId === user.id ? (
                            <div className="menu-list">
                              <button
                                type="button"
                                className="menu-item"
                                onClick={() => {
                                  onToggleStatus(user.id);
                                  setMenuId(null);
                                }}
                              >
                                {user.status === "INACTIVE" ? "Activate" : "Deactivate"}
                              </button>
                              <button
                                type="button"
                                className="menu-item is-danger"
                                onClick={() => {
                                  onRemoveUser(user.id);
                                  setMenuId(null);
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < filtered.length - 1 ? (
                    <div className="divider">
                      <span />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <Pagination page={1} totalPages={9} pageSize={7} />
          </section>
        </>
      )}
    </div>
  );
}
