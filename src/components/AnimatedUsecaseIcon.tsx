export type UsecaseKind =
  | "fingerprint"
  | "lock-shield"
  | "coupon-block"
  | "list-flag"
  | "globe-x"
  | "badge-star"
  | "network"
  | "magnifier"
  | "sync"
  | "signal"
  | "device-check";

interface Props {
  kind: UsecaseKind;
}

const size = 28;
const stroke = "#256dec";
const accent = "#0fae27";
const danger = "#e5484d";

export function AnimatedUsecaseIcon({ kind }: Props) {
  return (
    <span className={`aui aui-${kind}`} aria-hidden="true">
      {render(kind)}
    </span>
  );
}

function render(kind: UsecaseKind) {
  switch (kind) {
    case "fingerprint":
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <g stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none" className="aui-fp">
            <path d="M14 4c-4.4 0-8 3.6-8 8v3" />
            <path d="M9 12a5 5 0 0 1 10 0v3.5c0 1.8-.5 3.5-1.3 5" />
            <path d="M12 12a2 2 0 0 1 4 0v4c0 1.8-.5 3.5-1.3 5" />
            <path d="M14 15v3c0 .9-.2 1.8-.5 2.7" />
            <path d="M22 12v3c0 2.2-.6 4.3-1.6 6.2" />
          </g>
          <path
            className="aui-tick"
            d="M8 14.5l4 4L21 9"
            stroke={accent}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    case "lock-shield":
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <path
            className="aui-shield"
            d="M14 3l8 3v6c0 5.2-3.4 9.5-8 11-4.6-1.5-8-5.8-8-11V6l8-3z"
            fill="#eef4ff"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            className="aui-shackle"
            d="M11 13v-2a3 3 0 0 1 6 0v2"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="10" y="13" width="8" height="6" rx="1.2" fill={stroke} />
          <circle cx="14" cy="16" r="0.9" fill="#fff" />
        </svg>
      );

    case "coupon-block":
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <g className="aui-coupon">
            <path
              d="M4 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.2a2 2 0 0 0 0 3.6V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.2a2 2 0 0 0 0-3.6V9z"
              fill="#eef4ff"
              stroke={stroke}
              strokeWidth="1.5"
            />
            <circle cx="11" cy="14" r="1.2" fill={stroke} />
            <circle cx="17" cy="14" r="1.2" fill={stroke} />
          </g>
          <line
            className="aui-strike"
            x1="5"
            y1="6"
            x2="23"
            y2="22"
            stroke={danger}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );

    case "list-flag":
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <rect x="4" y="5" width="20" height="18" rx="2" fill="#eef4ff" stroke={stroke} strokeWidth="1.4" />
          <g stroke={stroke} strokeWidth="1.4" strokeLinecap="round">
            <line x1="8" y1="10" x2="17" y2="10" />
            <line x1="8" y1="14" x2="17" y2="14" />
            <line x1="8" y1="18" x2="17" y2="18" />
          </g>
          <g fill={danger} className="aui-flags">
            <circle cx="20" cy="10" r="1.6" className="aui-flag aui-flag-1" />
            <circle cx="20" cy="14" r="1.6" className="aui-flag aui-flag-2" />
            <circle cx="20" cy="18" r="1.6" className="aui-flag aui-flag-3" />
          </g>
        </svg>
      );

    case "globe-x":
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <g className="aui-globe">
            <circle cx="14" cy="14" r="9" fill="#eef4ff" stroke={stroke} strokeWidth="1.5" />
            <ellipse cx="14" cy="14" rx="4" ry="9" stroke={stroke} strokeWidth="1.2" fill="none" />
            <line x1="5" y1="14" x2="23" y2="14" stroke={stroke} strokeWidth="1.2" />
          </g>
          <g className="aui-x" stroke={danger} strokeWidth="2.4" strokeLinecap="round">
            <line x1="10" y1="10" x2="18" y2="18" />
            <line x1="18" y1="10" x2="10" y2="18" />
          </g>
        </svg>
      );

    case "badge-star":
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <path
            d="M14 3l4 3h4v4l3 4-3 4v4h-4l-4 3-4-3H6v-4l-3-4 3-4V6h4l4-3z"
            fill="#eef4ff"
            stroke={stroke}
            strokeWidth="1.4"
          />
          <path
            className="aui-star"
            d="M14 8.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6L14 16.7l-3.2 1.7.6-3.6-2.6-2.5 3.6-.5L14 8.5z"
            fill={stroke}
          />
        </svg>
      );

    case "network":
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <line
            className="aui-edge aui-edge-1"
            x1="6"
            y1="8"
            x2="14"
            y2="14"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            className="aui-edge aui-edge-2"
            x1="22"
            y1="8"
            x2="14"
            y2="14"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            className="aui-edge aui-edge-3"
            x1="6"
            y1="22"
            x2="14"
            y2="14"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            className="aui-edge aui-edge-4"
            x1="22"
            y1="22"
            x2="14"
            y2="14"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="6" cy="8" r="2.4" fill={stroke} className="aui-node aui-node-1" />
          <circle cx="22" cy="8" r="2.4" fill={stroke} className="aui-node aui-node-2" />
          <circle cx="6" cy="22" r="2.4" fill={stroke} className="aui-node aui-node-3" />
          <circle cx="22" cy="22" r="2.4" fill={stroke} className="aui-node aui-node-4" />
          <circle cx="14" cy="14" r="3" fill={accent} className="aui-node aui-node-c" />
        </svg>
      );

    case "magnifier":
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <g stroke={stroke} strokeWidth="1.4">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
            <line x1="4" y1="22" x2="14" y2="22" />
          </g>
          <g className="aui-mag">
            <circle cx="18" cy="18" r="5" fill="#fff" stroke={stroke} strokeWidth="1.8" />
            <line x1="22" y1="22" x2="25" y2="25" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "sync":
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <g className="aui-sync" stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round">
            <path d="M6 14a8 8 0 0 1 13.7-5.6" />
            <polyline points="16,6 20,8.5 17.5,12.5" />
            <path d="M22 14a8 8 0 0 1-13.7 5.6" />
            <polyline points="12,22 8,19.5 10.5,15.5" />
          </g>
        </svg>
      );

    case "signal":
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <g className="aui-signal" fill={stroke}>
            <rect x="4" y="16" width="4" height="8" rx="1" className="aui-bar aui-bar-1" />
            <rect x="10" y="12" width="4" height="12" rx="1" className="aui-bar aui-bar-2" />
            <rect x="16" y="8" width="4" height="16" rx="1" className="aui-bar aui-bar-3" />
            <rect x="22" y="4" width="4" height="20" rx="1" className="aui-bar aui-bar-4" />
          </g>
        </svg>
      );

    case "device-check":
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <rect
            x="7"
            y="3"
            width="14"
            height="22"
            rx="2.5"
            fill="#eef4ff"
            stroke={stroke}
            strokeWidth="1.6"
            className="aui-phone"
          />
          <line x1="12" y1="22" x2="16" y2="22" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path
            className="aui-tick"
            d="M10 14l3 3 5-6"
            stroke={accent}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );
  }
}
