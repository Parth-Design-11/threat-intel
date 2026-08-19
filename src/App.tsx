import { useState } from "react";
import {
  ENDPOINTS_BY_TYPE,
  buildKeyId,
  maskKeyId,
  resolveExpiryDate,
} from "./apiManagement";
import { AccessKeysPage } from "./components/AccessKeysPage";
import type { ApiTab } from "./components/ApiTabs";
import { AddUserModal } from "./components/AddUserModal";
import { CreateKeyModal } from "./components/CreateKeyModal";
import { ExplorePage } from "./components/ExplorePage";
import { KeyCreatedModal } from "./components/KeyCreatedModal";
import { PlaygroundPage } from "./components/PlaygroundPage";
import { SettingsPage } from "./components/SettingsPage";
import { Sidebar, type AppSection } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { UsageLogsPage } from "./components/UsageLogsPage";
import { INITIAL_KEYS, type ManagedApi } from "./data";
import { INITIAL_USERS, type ManagedUser } from "./usersData";

type Modal = "create" | "created" | "add-user" | "edit-user" | null;

export default function App() {
  const [section, setSection] = useState<AppSection>("api");
  const [tab, setTab] = useState<ApiTab>("keys");
  const [modal, setModal] = useState<Modal>(null);
  const [keys, setKeys] = useState<ManagedApi[]>(INITIAL_KEYS);
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [createdApi, setCreatedApi] = useState<ManagedApi | null>(null);

  return (
    <div className="shell">
      <TopBar />
      <div className="body">
        <Sidebar active={section} onSelect={setSection} />
        <main className="main">
          {section === "explore" ? <ExplorePage /> : null}
          {section === "settings" ? (
            <SettingsPage
              users={users}
              onAddUser={() => {
                setEditingUser(null);
                setModal("add-user");
              }}
              onEditUser={(user) => {
                setEditingUser(user);
                setModal("edit-user");
              }}
              onToggleStatus={(id) => {
                setUsers((current) =>
                  current.map((user) =>
                    user.id === id
                      ? { ...user, status: user.status === "INACTIVE" ? "Active" : "INACTIVE" }
                      : user,
                  ),
                );
              }}
              onRemoveUser={(id) => {
                setUsers((current) => current.filter((user) => user.id !== id));
              }}
            />
          ) : null}
          {section === "api" && tab === "keys" ? (
            <AccessKeysPage
              keys={keys}
              onCreate={() => setModal("create")}
              onUpdateKeys={setKeys}
              onChangeTab={setTab}
            />
          ) : null}
          {section === "api" && tab === "usage" ? (
            <UsageLogsPage
              keys={keys}
              onCreate={() => setModal("create")}
              onChangeTab={setTab}
            />
          ) : null}
          {section === "api" && tab === "playground" ? (
            <PlaygroundPage keys={keys} onCreate={() => setModal("create")} onChangeTab={setTab} />
          ) : null}
        </main>
      </div>

      {modal === "create" ? (
        <CreateKeyModal
          existingNames={keys.map((key) => key.name)}
          onClose={() => setModal(null)}
          onCreate={(payload) => {
            const keyId = buildKeyId(payload.environment, payload.name + Date.now().toString(36));
            const endpoint = ENDPOINTS_BY_TYPE[payload.type][0]?.path;
            const created: ManagedApi = {
              id: String(Date.now()),
              name: payload.name,
              keyId,
              maskedKeyId: maskKeyId(keyId),
              type: payload.type,
              environment: payload.environment,
              createdBy: "KD",
              createdOn: "19 Aug 2026",
              lastUsed: "Never",
              expiry: resolveExpiryDate(payload.expiry, new Date("2026-08-19T00:00:00.000Z")),
              status: "Active",
              description: payload.description,
              endpoint,
              secret: keyId.replace(/^ti_/, "ti_sk_") + "_9Qw7Lk2Pz8Mx4Nr6Vb1Hd5Yt0Ca3Ef9J",
            };
            setKeys((current) => [created, ...current]);
            setCreatedApi(created);
            setModal("created");
            setTab("keys");
          }}
        />
      ) : null}

      {modal === "created" && createdApi ? <KeyCreatedModal api={createdApi} onClose={() => setModal(null)} /> : null}

      {modal === "add-user" || modal === "edit-user" ? (
        <AddUserModal
          key={`${modal}-${editingUser?.id ?? "new"}`}
          title={modal === "edit-user" ? "Edit user" : "Add new user"}
          submitLabel={modal === "edit-user" ? "Save user" : "Add user"}
          initial={
            modal === "edit-user" && editingUser
              ? { name: editingUser.name, email: editingUser.email, role: editingUser.role }
              : undefined
          }
          onClose={() => {
            setEditingUser(null);
            setModal(null);
          }}
          onSubmit={(payload) => {
            if (modal === "edit-user" && editingUser) {
              setUsers((current) =>
                current.map((user) => (user.id === editingUser.id ? { ...user, ...payload } : user)),
              );
            } else {
              setUsers((current) => [
                {
                  id: String(Date.now()),
                  ...payload,
                  lastLoginDate: "—",
                  lastLoginTime: "",
                  status: "PENDING",
                },
                ...current,
              ]);
            }
            setEditingUser(null);
            setModal(null);
          }}
        />
      ) : null}
    </div>
  );
}
