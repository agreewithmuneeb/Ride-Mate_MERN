import { roleDashboards } from "./constants";

export const dashboardForRole = (role) => roleDashboards[role] || "/passenger/dashboard";

export const isAllowedRole = (user, allowedRoles) => Boolean(user && allowedRoles.includes(user.role));
