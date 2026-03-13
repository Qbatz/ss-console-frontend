import { useRole } from "../Context/RoleContext";
export const usePermission = (moduleName) => {

  const { modules, adminPermissions } = useRole();

  console.log("modules", modules);
  console.log("permissions", adminPermissions);
  console.log("checking module", moduleName);

  const module = modules?.find((m) => m.moduleName === moduleName);

  console.log("matched module", module);

  const permission = adminPermissions?.find(
    (p) => p.moduleId === module?.moduleId
  );

  console.log("matched permission", permission);

  return {
    canRead: !!permission?.canRead,
    canWrite: !!permission?.canWrite,
    canUpdate: !!permission?.canUpdate,
    canDelete: !!permission?.canDelete,
  };
};