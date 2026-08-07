export function matchPermission(userPermission: string, requiredPermission: string): boolean {
  if (userPermission === '*:*' || userPermission === '*') {
    return true;
  }
  if (userPermission === requiredPermission) {
    return true;
  }

  const [userCategory, userAction] = userPermission.split(':');
  const [reqCategory, reqAction] = requiredPermission.split(':');

  if (!userCategory || !reqCategory) {
    return false;
  }

  if (userCategory === reqCategory && (userAction === '*' || userAction === reqAction)) {
    return true;
  }

  return false;
}

export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  if (!userPermissions || userPermissions.length === 0) {
    return false;
  }
  return userPermissions.some((perm) => matchPermission(perm, requiredPermission));
}

export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }
  return requiredPermissions.every((req) => hasPermission(userPermissions, req));
}

export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }
  return requiredPermissions.some((req) => hasPermission(userPermissions, req));
}
