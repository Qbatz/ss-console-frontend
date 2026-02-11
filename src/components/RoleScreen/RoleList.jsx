import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import CreateRoleModal from "./CreateRoleModal";
import { useRole } from "../../Context/RoleContext";
import Circle from "../../assets/menucircle.png"
const Roles = () => {
  const { agentRoles, getAgentRoles } = useRole();
  console.log("agentRoles", agentRoles)
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const totalRecords = agentRoles?.length || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const paginatedData = agentRoles?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <DashboardLayout>

      {/* Page Header */}
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

      <div className="bg-white rounded-xl border border-gray-200 
                max-h-[350px] flex flex-col overflow-hidden">


        <div className="flex-1 overflow-y-auto overflow-x-auto">

          <table className="min-w-full text-sm">


            <thead className="bg-gray-50 text-xs text-gray-500 uppercase sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-xs whitespace-nowrap text-left font-sans">
                  Role Name
                </th>

                <th className="px-4 py-3 text-xs whitespace-nowrap font-sans">Description</th>
                <th className="px-4 py-3 text-xs whitespace-nowrap font-sans">Users Count</th>
                <th className="px-4 py-3 text-xs whitespace-nowrap font-sans">Created On</th>
                <th className="px-4 py-3 text-xs whitespace-nowrap font-sans">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">

              {paginatedData?.map((role, index) => (
                <tr key={index} className="hover:bg-gray-50 transition text-[12px]">
                  <td className="px-6 py-1 font-medium text-gray-800 text-start font-sans">
                    {role.name}
                  </td>

                  <td className="px-6 py-1 text-gray-600 font-sans">
                    {/* {role.description} */}
                    test
                  </td>

                  <td className="px-6 py-1 text-center font-sans">
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs font-sans">
                      👥 {role.users}
                    </span>
                  </td>

                  <td className="px-6 py-1 text-gray-600 font-sans">
                    {/* {role.created} */}
                    09-02-2026
                  </td>

                  <td className="px-6 py-1 text-center relative font-sans">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === index ? null : index);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <img
                        src={Circle}
                        alt="circle"
                        className=" w-5 h-5 "
                      />
                    </button>

                    {openMenu === index && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute right-6 w-32 bg-white border rounded-lg shadow-lg z-20 ${index >= agentRoles.length - 2
                          ? "bottom-8"
                          : "top-8"
                          }`}
                      >
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            setSelectedRole(role);
                            setOpen(true);
                            setOpenMenu(null);
                          }}
                        >
                          Edit
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>


                </tr>
              ))}

            </tbody>
          </table>
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


    </DashboardLayout>
  );
};



export default Roles;
