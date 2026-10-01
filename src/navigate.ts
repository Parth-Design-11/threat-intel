export function currentPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export function isLandingPath(pathname = currentPath()) {
  return pathname === "/landing-page" || pathname.endsWith("/landing-page");
}

export function isRegisterPath(pathname = currentPath()) {
  return pathname === "/register" || pathname.endsWith("/register");
}

export function isThreatPath(pathname = currentPath()) {
  return pathname === "/threat-intelligence" || pathname.endsWith("/threat-intelligence");
}

export function isFaqsPath(pathname = currentPath()) {
  return pathname === "/faqs" || pathname.endsWith("/faqs");
}

export function isSignInPath(pathname = currentPath()) {
  return pathname === "/sign-in" || pathname.endsWith("/sign-in");
}

export type PublicRoute = "landing" | "register" | "threat" | "faqs" | "sign-in" | "app";

export function publicRoute(pathname = currentPath()): PublicRoute {
  if (isLandingPath(pathname)) return "landing";
  if (isRegisterPath(pathname)) return "register";
  if (isThreatPath(pathname)) return "threat";
  if (isFaqsPath(pathname)) return "faqs";
  if (isSignInPath(pathname)) return "sign-in";
  return "app";
}

export function navigateTo(path: string) {
  const next = path.replace(/\/+$/, "") || "/";
  if (currentPath() === next) return;
  window.history.pushState({}, "", next === "/" ? "/" : next);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
