import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { prototypeConfig, type PrototypeControl, type PrototypeScenario } from "./prototype.config";

const AUTO = "auto";
const STORAGE_KEY = "wisely.prototype-devtools";

type Control = PrototypeControl;
type Scenario = PrototypeScenario;
type OverrideMap = Record<string, string>;

type DevToolsContextValue = {
  values: OverrideMap;
  setValue: (id: string, value: string) => void;
  applyScenario: (id: string) => void;
  reset: () => void;
  activeScenario: string | null;
};

const DevToolsContext = createContext<DevToolsContextValue | null>(null);

function emptyOverrides(): OverrideMap {
  return Object.fromEntries(prototypeConfig.controls.map((control) => [control.id, AUTO]));
}

function controlById(id: string) {
  return prototypeConfig.controls.find((control) => control.id === id);
}

function fallbackFor(control: Control | undefined) {
  if (!control) return undefined;
  if ("fallback" in control) return control.fallback;
  if (control.kind === "flag") return false;
  return undefined;
}

function readStored(): OverrideMap {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyOverrides();
    const parsed = JSON.parse(raw) as OverrideMap;
    return { ...emptyOverrides(), ...parsed };
  } catch {
    return emptyOverrides();
  }
}

export function DevToolsProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<OverrideMap>(readStored);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [values]);

  const api = useMemo<DevToolsContextValue>(
    () => ({
      values,
      setValue(id, value) {
        setActiveScenario(null);
        setValues((current) => ({ ...current, [id]: value }));
      },
      applyScenario(id) {
        const scenario = prototypeConfig.scenarios.find((item) => item.id === id);
        if (!scenario) return;
        setActiveScenario(id);
        setValues({ ...emptyOverrides(), ...scenario.set });
      },
      reset() {
        setActiveScenario(null);
        setValues(emptyOverrides());
      },
      activeScenario,
    }),
    [activeScenario, values],
  );

  return <DevToolsContext.Provider value={api}>{children}</DevToolsContext.Provider>;
}

export function useDevOverride<T>(id: string, real: T): T {
  const ctx = useContext(DevToolsContext);
  if (!ctx) return real;
  const override = ctx.values[id];
  if (override === undefined || override === AUTO) return real;
  return override as T;
}

export function useDev<T = string>(id: string): T {
  const ctx = useContext(DevToolsContext);
  const control = controlById(id);
  const fallback = fallbackFor(control) as T;
  if (!ctx) return fallback;
  const override = ctx.values[id];
  if (override === undefined || override === AUTO) return fallback;
  if (control?.kind === "flag") return (override === "true") as T;
  return override as T;
}

function optionsFor(control: Control) {
  if (control.kind === "flow") return control.steps;
  if (control.kind === "flag") return ["true", "false"];
  return control.values;
}

function screenOf(control: Control) {
  return "screen" in control && control.screen ? control.screen : "app";
}

export function DevToolsPanel() {
  const ctx = useContext(DevToolsContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!ctx) return null;

  const groups = new Map<string, Control[]>();
  for (const control of prototypeConfig.controls) {
    const screen = screenOf(control);
    const list = groups.get(screen) ?? [];
    list.push(control);
    groups.set(screen, list);
  }

  return (
    <div className="devtools">
      {open ? (
        <div className="devtools-panel" role="dialog" aria-label="Prototype DevTools">
          <div className="devtools-panel-head">
            <p className="devtools-title">DevTools</p>
            <button type="button" className="devtools-text-btn" onClick={ctx.reset}>
              Reset
            </button>
          </div>

          <div className="devtools-scenarios">
            {prototypeConfig.scenarios.map((scenario: Scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={`devtools-chip${ctx.activeScenario === scenario.id ? " is-active" : ""}`}
                onClick={() => ctx.applyScenario(scenario.id)}
              >
                {scenario.label}
              </button>
            ))}
          </div>

          {[...groups.entries()].map(([screen, controls]) => (
            <section key={screen} className="devtools-group">
              <p className="devtools-group-label">{screen}</p>
              {controls.map((control) => {
                const current = ctx.values[control.id] ?? AUTO;
                const options = optionsFor(control);
                return (
                  <div key={control.id} className="devtools-row">
                    <span className="devtools-row-label">{control.label}</span>
                    <div className="devtools-pills">
                      <button
                        type="button"
                        className={`devtools-pill${current === AUTO ? " is-active" : ""}`}
                        onClick={() => ctx.setValue(control.id, AUTO)}
                      >
                        Auto
                      </button>
                      {options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`devtools-pill${current === option ? " is-active" : ""}`}
                          onClick={() => ctx.setValue(control.id, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        className={`devtools-fab${open ? " is-open" : ""}`}
        aria-label={open ? "Close DevTools" : "Open DevTools"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Dev
      </button>
    </div>
  );
}
