import { useEffect, useState } from "react";
import { assets } from "../assets";
import { USER_ROLES, type UserRole } from "../usersData";

type AddUserModalProps = {
  title: string;
  submitLabel: string;
  initial?: { name: string; email: string; role: UserRole };
  onClose: () => void;
  onSubmit: (payload: { name: string; email: string; role: UserRole }) => void;
};

export function AddUserModal({ title, submitLabel, initial, onClose, onSubmit }: AddUserModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [role, setRole] = useState<UserRole>(initial?.role ?? "Admin");
  const [openRole, setOpenRole] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const valid = name.trim().length > 0 && email.includes("@") && email.trim().length > 3;

  return (
    <>
      <button type="button" className="overlay" aria-label="Close modal" onClick={onClose} />
      <div className="modal is-user" role="dialog" aria-labelledby="user-modal-title">
        <div className="modal-header">
          <h2 id="user-modal-title" className="modal-title">
            {title}
          </h2>
          <button type="button" className="close-btn" aria-label="Close" onClick={onClose}>
            <img src={assets.iconClose} alt="" width={16} height={16} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            <span className="field-label">
              Name <span className="req">*</span>
            </span>
            <input
              className="field-input"
              placeholder="Enter name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">
              Email <span className="req">*</span>
            </span>
            <input
              className="field-input"
              placeholder="Enter user’s email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <div className="field">
            <span className="field-label">
              Role <span className="req">*</span>
            </span>
            <div className="select-menu">
              <button
                type="button"
                className="field-select"
                onClick={() => setOpenRole((open) => !open)}
              >
                {role}
                <img src={assets.iconChevron} alt="" width={16} height={16} />
              </button>
              {openRole ? (
                <div className="select-list">
                  {USER_ROLES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`select-option${option === role ? " is-active" : ""}`}
                      onClick={() => {
                        setRole(option);
                        setOpenRole(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="info-banner">
            <span className="info-banner-icon">
              <img src={assets.iconInfo} alt="" width={24} height={24} />
            </span>
            <p>An email with the log-in details will be sent to the user</p>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Back
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!valid}
            onClick={() => onSubmit({ name: name.trim(), email: email.trim(), role })}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </>
  );
}
