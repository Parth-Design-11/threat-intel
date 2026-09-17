export function currentPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export function isLandingPath(pathname = currentPath()) {
  return pathname === "/landing-page" || pathname.endsWith("/landing-page");
}

export function navigateTo(path: string) {
  const next = path.replace(/\/+$/, "") || "/";
  if (currentPath() === next) return;
  window.history.pushState({}, "", next === "/" ? "/" : next);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
