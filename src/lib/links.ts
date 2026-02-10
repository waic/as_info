const RELATIVE_LINKS = (() => {
  const value = (import.meta.env.PUBLIC_RELATIVE_LINKS ?? '').toString().toLowerCase();
  return value === '1' || value === 'true' || value === 'yes';
})();

function stripBase(pathname: string): string {
  const baseUrl = import.meta.env.BASE_URL ?? '';
  if (!baseUrl) {
    return pathname;
  }
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  if (normalizedBase === '/') {
    return pathname;
  }
  if (pathname.startsWith(normalizedBase)) {
    return `/${pathname.slice(normalizedBase.length)}`;
  }
  return pathname;
}

export function getLinkBase(pathname: string): string {
  if (!RELATIVE_LINKS) {
    return import.meta.env.BASE_URL;
  }
  const normalizedPath = stripBase(pathname);
  if (
    normalizedPath.startsWith('/criteria/') ||
    normalizedPath.startsWith('/techs/') ||
    normalizedPath.startsWith('/results/')
  ) {
    return '../';
  }
  return '';
}
