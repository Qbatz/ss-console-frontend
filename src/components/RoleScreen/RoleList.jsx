import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import CreateRoleModal from "./CreateRoleModal";
import { useRole } from "../../Context/RoleContext";
import Circle from "../../assets/menucircle.png"
const Roles = () => {
  const { agentRoles, getAgentRoles,getAgentRoleById,loading,deleteAgentRole} = useRole();
  console.log("agentRoles", agentRoles)
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const totalRecords = agentRoles?.length || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const [deleteRole, setDeleteRole] = useState(null);
const [deleteLoading, setDeleteLoading] = useState(false);


  useEffect(() => {
  getAgentRoles();
}, []);


  const paginatedData = agentRoles?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
console.log("paginatedData",paginatedData)
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const handleEditClick = async (role) => {
  try {
    const response = await getAgentRoleById(role.id);

    if (response.success) {
      setSelectedRole(response.data);
      setOpen(true);
    } else {
      alert(response.message || "Failed to fetch role details");
    }
  } catch (err) {
    console.log("Edit fetch error:", err);
    alert("Something went wrong");
  } finally {
    setOpenMenu(null);
  }
};
const handleConfirmDelete = async () => {
  if (!deleteRole) return;

  try {
    // setDeleteLoading(true);

    const res = await deleteAgentRole(deleteRole.id);

    if (!res.success) {
      alert(res.message || "Delete failed");
      return;
    }

    // success
    setDeleteRole(null);

  } catch (err) {
    console.log("Delete error:", err);
    alert("Something went wrong");
  } finally {
    setDeleteLoading(false);
  }
};


  return (
    <DashboardLayout>

      
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-6 p-3 ">
        <h2 className="text-lg font-semibold text-gray-800 font-sans">Roles</h2>

        <button className="flex items-center gap-2 text-blue-600 font-medium text-sm" onClick={() => setOpen(true)}>
          <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-md text-xs font-sans">
            +
          </span>
          Create Role
        </button>
      </div>

      {/* Table Box */}


    <div className="bg-white rounded-xl border border-gray-200 max-h-[350px] flex flex-col overflow-hidden">

  <div className="flex-1 overflow-y-auto overflow-x-auto">

    {loading ? (
      <div className="flex justify-center items-center h-[300px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : (
      <table className="min-w-full text-sm">

        <thead className="bg-gray-50 text-xs text-gray-500 uppercase sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left">Role Name</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Users Count</th>
            <th className="px-4 py-3">Created On</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {paginatedData?.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-10 text-center text-gray-400">
                No roles found
              </td>
            </tr>
          ) : (
            paginatedData.map((role, index) => (
              <tr key={index} className="hover:bg-gray-50 text-[12px]">
                <td className="px-6 py-1 font-medium text-gray-800 text-start">
                  {role.name}
                </td>

                <td className="px-6 py-1 text-gray-600">
                  {role.description || "N/A"}
                </td>

                <td className="px-6 py-1 text-center">
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs">
                    👥 {role.userCount}
                  </span>
                </td>

                <td className="px-6 py-1 text-gray-600">
                  {role.created || "N/A"}
                </td>

                <td className="px-6 py-1 text-center relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(openMenu === index ? null : index);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <img src={Circle} alt="circle" className="w-5 h-5" />
                  </button>

                  {openMenu === index && role.editable !== false && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute right-6 w-32 bg-white border rounded-lg shadow-lg z-20 ${
                        index >= agentRoles.length - 2
                          ? "bottom-8"
                          : "top-8"
                      }`}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => handleEditClick(role)}
                      >
                        Edit
                      </button>

                     <button
  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
  onClick={() => {
    setDeleteRole(role);
    setOpenMenu(null);
  }}
>
  Delete
</button>

                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>
    )}

  </div>
</div>



      <div className="flex justify-between items-center px-4 py-3 border-t bg-white text-sm">


        <span className="text-gray-600">
          Total Record Count :{" "}
          <span className="text-blue-600 font-medium">
            {totalRecords.toString().padStart(2, "0")}
          </span>
        </span>


        <div className="flex items-center gap-4">

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>


          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="text-gray-500 disabled:opacity-40"
          >
            &#8249;
          </button>


          <span className="border px-3 py-1 rounded-md bg-gray-100">
            {page}
          </span>


          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="text-gray-500 disabled:opacity-40"
          >
            &#8250;
          </button>

        </div>
      </div>


      <CreateRoleModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelectedRole(null);
        }}
        selectedRole={selectedRole}
      />
{deleteRole && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8 text-center">

      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
        Delete Role?
      </h2>

      <p className="text-gray-500 text-sm sm:text-base mb-6">
        Are you sure you want to delete "{deleteRole.name}"?
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">

        <button
          onClick={() => setDeleteRole(null)}
          disabled={deleteLoading}
          className="w-full sm:w-1/2 border border-blue-600 text-blue-600 py-2.5 rounded-xl font-medium hover:bg-blue-50 transition"
        >
          Cancel
        </button>

       <button
  disabled={deleteLoading}
  onClick={handleConfirmDelete}
  className="w-full sm:w-1/2 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
>
  {deleteLoading ? (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    "Delete"
  )}
</button>


      </div>

    </div>
  </div>
)}


    </DashboardLayout>
  );
};



export default Roles;
