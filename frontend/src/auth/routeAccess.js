export const getRouteAccess = ({ isLoading, isAuthenticated, userRole, requiredRole }) => {
  if (isLoading) return "loading";
  if (!isAuthenticated) return "unauthenticated";

  const allowedRoles = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
    ? [requiredRole]
    : [];

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return "forbidden";
  }

  return "allowed";
};
