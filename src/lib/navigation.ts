'use client';

const NAV_STACK_KEY = 'mf_nav_stack';

export function recordNavPath(pathname: string) {
  if (typeof window === 'undefined' || !pathname) return;
  try {
    const raw = sessionStorage.getItem(NAV_STACK_KEY);
    const stack: string[] = raw ? JSON.parse(raw) : [];
    const safeStack = Array.isArray(stack) ? stack : [];
    if (safeStack[safeStack.length - 1] !== pathname) {
      safeStack.push(pathname);
      if (safeStack.length > 25) safeStack.shift();
      sessionStorage.setItem(NAV_STACK_KEY, JSON.stringify(safeStack));
    }
  } catch {}
}

export function navigateBack(
  router: { back: () => void; push: (href: string) => void },
  fallbackHref = '/'
) {
  if (typeof window === 'undefined') {
    router.push(fallbackHref);
    return;
  }

  try {
    const raw = sessionStorage.getItem(NAV_STACK_KEY);
    const stack: string[] = raw ? JSON.parse(raw) : [];
    if (Array.isArray(stack) && stack.length > 1) {
      stack.pop();
      sessionStorage.setItem(NAV_STACK_KEY, JSON.stringify(stack));
      router.back();
      return;
    }

    if (document.referrer && document.referrer.startsWith(window.location.origin)) {
      router.back();
      return;
    }
  } catch {}

  router.push(fallbackHref);
}
