import { useRole } from "../Context/RoleContext";

export const usePermission = (moduleName) => {

  const { modules, adminPermissions, loading } = useRole();

  const module = modules?.find((m) => m.moduleName === moduleName);

  const permission = adminPermissions?.find(
    (p) => p.moduleId === module?.moduleId
  );

  
  const isReady = modules && modules.length > 0 && adminPermissions;

  return {
    canRead: !isReady ? undefined : !!permission?.canRead,
    canWrite: !isReady ? undefined : !!permission?.canWrite,
    canUpdate: !isReady ? undefined : !!permission?.canUpdate,
    canDelete: !isReady ? undefined : !!permission?.canDelete,
  };
};