export const isNestedRoute = (pathname: string) =>
  pathname.split('/').filter(Boolean).length > 1;