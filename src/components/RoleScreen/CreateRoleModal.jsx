import React, { useState, useEffect,useRef  } from "react";
import RoleImg from "../../assets/RoleImg.png";
import Lock from "../../assets/lock.png"
import { useRole } from "../../Context/RoleContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";


const CreateRoleModal = ({ isOpen, onClose,selectedRole }) => {
  const { modules, loading, agentRoles, getAgentRoles, createAgentRole,updateAgentRole } = useRole();
  console.log("selectedRole", selectedRole)
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [rolenameError,setRoleNameError] = useState("")
  const [permissionError,setPermissionError] = useState("")
   const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  console.log("permissions",permissions)
  const roleInputRef = useRef(null);
const permissionRef = useRef(null);
const resetForm = () => {
  setRoleName("");
  setPermissions([]);
  setRoleNameError("");
  setPermissionError("");
};
const handleClose = () => {
  resetForm();
  onClose();
};

useEffect(() => {
  if (selectedRole) {
    setRoleName(selectedRole.name || "");

    if (selectedRole.rolesPermissionDetails) {
      const formattedPermissions =
        selectedRole.rolesPermissionDetails.map((p) => ({
          moduleId: p.moduleId,
          canRead: p.canRead || false,
          canWrite: p.canWrite || false,
          canUpdate: p.canUpdate || false,
          canDelete: p.canDelete || false,
        }));

      setPermissions(formattedPermissions);
    }
  } else {
    setRoleName("");
    setPermissions([]);
  }
}, [selectedRole]);
const handlePermissionChange = (moduleId, field, value) => {
  setPermissions((prev) => {
    const existing = prev.find((p) => p.moduleId === moduleId);

    let updatedPermission = existing
      ? { ...existing }
      : {
          moduleId,
          canRead: false,
          canWrite: false,
          canUpdate: false,
          canDelete: false,
        };

    updatedPermission[field] = value;

    // Rule 1: if Add/Edit/Delete checked → auto enable View
    if (
  (field === "canUpdate" || field === "canDelete") &&
  value === true
) {
  updatedPermission.canRead = true;
}

    // Rule 2: if View unchecked → disable all
    if (field === "canRead" && value === false) {
      updatedPermission.canWrite = false;
      updatedPermission.canUpdate = false;
      updatedPermission.canDelete = false;
    }

    const newPermissions = [
      ...prev.filter((p) => p.moduleId !== moduleId),
      updatedPermission,
    ];

    // 🔥 VERY IMPORTANT
    // Remove module if all permissions are false
    return newPermissions.filter(
      (p) =>
        p.canRead ||
        p.canWrite ||
        p.canUpdate ||
        p.canDelete
    );
  });
  setPermissionError("")
};


// const handlePermissionChange = (moduleId, field, value) => {
//   setPermissions((prev) => {
//     const existing = prev.find((p) => p.moduleId === moduleId);

//     let updatedPermission = existing
//       ? { ...existing }
//       : {
//           moduleId,
//           canRead: false,
//           canWrite: false,
//           canUpdate: false,
//           canDelete: false,
//         };

//     updatedPermission[field] = value;

//     // 🔥 RULE 1:
//     // If Add/Edit/Delete checked → auto enable View
//     if (
//       field !== "canRead" &&
//       value === true
//     ) {
//       updatedPermission.canRead = true;
//     }

//     // 🔥 RULE 2:
//     // If View unchecked → disable all
//     if (field === "canRead" && value === false) {
//       updatedPermission.canWrite = false;
//       updatedPermission.canUpdate = false;
//       updatedPermission.canDelete = false;
//     }

//     return [
//       ...prev.filter((p) => p.moduleId !== moduleId),
//       updatedPermission,
//     ];
//   });
 
// };

  // const handlePermissionChange = (moduleId, field, value) => {
  //   setPermissions((prev) => {
  //     const existing = prev.find((p) => p.moduleId === moduleId);

  //     if (existing) {
  //       return prev.map((p) =>
  //         p.moduleId === moduleId ? { ...p, [field]: value } : p
  //       );
  //     } else {
  //       return [
  //         ...prev,
  //         {
  //           moduleId: moduleId,
  //           canRead: false,
  //           canWrite: false,
  //           canUpdate: false,
  //           canDelete: false,
  //           [field]: value,
  //         },
  //       ];
  //     }
  //   });
  // };

  useEffect(() => {
    getAgentRoles();
  }, []);
const handleCreate = async () => {
  let hasError = false;

  setRoleNameError("");
  setPermissionError("");

  if (!roleName.trim()) {
    setRoleNameError("Role name is required");
    setTimeout(() => {
    roleInputRef.current?.focus(); 
    roleInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 0);

  hasError = true;
}

 if (!permissions.length) {
  setPermissionError("Select at least one permission");

  setTimeout(() => {
    permissionRef.current?.focus(); 
    permissionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 0);

  hasError = true;
}

  if (hasError) return;

  const payload = {
    roleName,
    isActive: true,
    permissionList: permissions,
  };

  let res;

  if (selectedRole) {
    res = await updateAgentRole(selectedRole.id, payload);
  } else {
    res = await createAgentRole(payload);
  }

  if (res.success) {

     setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
       
      }, 800);
   
    
  }

  else {
   
  setRoleNameError(res.message);
   setTimeout(() => {
    roleInputRef.current?.focus();
    roleInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 0);
  
    }
};



  // const handleCreate = async () => {
  //   if (!roleName.trim()) {
  //     alert("Role name is required");
  //     return;
  //   }

  //   if (permissions.length === 0) {
  //     alert("Select at least one permission");
  //     return;
  //   }

  //   const payload = {
  //     roleName,
  //     permissionList: permissions,
  //   };

  //   console.log("FINAL PAYLOAD 👉", payload);

  //   const res = await createAgentRole(payload);

  //   if (res.success) {
  //     onClose();
  //     setRoleName("");
  //     setPermissions([]);
  //   }
  // };

  return (
    <>
 <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={handleClose}
      />


      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-4 border-b">
          <div>
            <h2 className="text-[15px] font-semibold font-inter text-start">{selectedRole ? "Edit Role" : "Create New Role"}
</h2>
            <p className="text-sm text-gray-500">
              Fill in the details to create a new admin user
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-red-500 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-130px)]">

          {/* Basic Details */}
          <div className="border rounded-xl p-6 space-y-5">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <img src={RoleImg} alt="Role"
                className="w-5 h-5 object-contain" /> Basic Role Details
            </h3>


            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 text-left">
                Role Name <span className="text-red-500">*</span>
              </label>

         <input
  ref={roleInputRef}
  type="text"
  placeholder="e.g., Super Admin, Accountant"
  value={roleName}
  onChange={(e) => {
    setRoleName(e.target.value);
    setRoleNameError("");
  }}
  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
/>

            </div>
             {rolenameError && (
          <ErrorMessage message={rolenameError} type="error" />
        )}

            {/* Role Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 text-left">
                Role Description
              </label>

              <textarea
                rows="4"
                placeholder="e.g., Can manage Property, Billings, Subscriptions."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>
  

          <div className="border rounded-xl p-5">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <img src={Lock} alt="Lock"
                className="w-5 h-5 object-contain" /> Permissions
            </h3>

            <div className="grid grid-cols-6 text-xs font-medium text-gray-500 mb-3">
              <div>Module</div>
              <div className="text-center">View</div>
              <div className="text-center">Add</div>
              <div className="text-center">Edit</div>
              <div className="text-center">Delete</div>
              <div className="text-center">Extra</div>
            </div>

            {modules.map((mod, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center py-2 border-t text-sm"
              >
                <div>{mod.moduleName}</div>
                <div className="flex justify-center" ref={permissionRef}>
                 <input
  type="checkbox"
  checked={
    permissions.find(p => p.moduleId === mod.moduleId)?.canRead || false
  }
  onChange={(e) =>
    handlePermissionChange(
      mod.moduleId,
      "canRead",
      e.target.checked
    )
  }
/>

                </div>

                <div className="flex justify-center">
                 <input
  type="checkbox"
  checked={
    permissions.find(p => p.moduleId === mod.moduleId)?.canWrite || false
  }
  onChange={(e) =>
    handlePermissionChange(
      mod.moduleId,
      "canWrite",
      e.target.checked
    )
  }
/>

                </div>

                <div className="flex justify-center">
                 <input
  type="checkbox"
  checked={
    permissions.find(p => p.moduleId === mod.moduleId)?.canUpdate || false
  }
  onChange={(e) =>
    handlePermissionChange(
      mod.moduleId,
      "canUpdate",
      e.target.checked
    )
  }
/>

                </div>

                <div className="flex justify-center">
                 <input
  type="checkbox"
  checked={
    permissions.find(p => p.moduleId === mod.moduleId)?.canDelete || false
  }
  onChange={(e) =>
    handlePermissionChange(
      mod.moduleId,
      "canDelete",
      e.target.checked
    )
  }
/>

                </div>

                <div className="text-center text-blue-600 cursor-pointer text-xs">
                  More +
                </div>
              </div>
            ))}
          </div>
        {permissionError && (
          <ErrorMessage message={permissionError} type="error" />
        )}

        </div>
     
        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Cancel
          </button>
          <button className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleCreate}>
            Create Role
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateRoleModal;
