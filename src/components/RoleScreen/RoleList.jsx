import React,{useState} from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import CreateRoleModal from "./CreateRoleModal";

const Roles = () => {
  const [open, setOpen] = useState(false);
  return (
    <DashboardLayout>

      {/* Page Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Roles</h2>

        <button className="flex items-center gap-2 text-blue-600 font-medium text-sm" onClick={() => setOpen(true)}>
          <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-md text-xs">
            +
          </span>
          Create Role
        </button>
      </div>

      {/* Table Box */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">

            {/* Table Head */}
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Role Name</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-center">Users Count</th>
                <th className="px-6 py-3 text-left">Created On</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">

              {rolesData.map((role, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {role.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {role.description}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs">
                      👥 {role.users}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {role.created}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-gray-700">
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

      </div>


       <CreateRoleModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />

    </DashboardLayout>
  );
};

const rolesData = [
  { name: "Super Admin", description: "Full Access", users: 2, created: "2025 Oct 01" },
  { name: "Support Agent", description: "Handle Tickets", users: 5, created: "2025 Sep 01" },
  { name: "Billing Agent", description: "Handle tickets", users: 3, created: "2025 Aug 21" },
  { name: "Property Manager", description: "Check Property Listings", users: 1, created: "2025 Feb 21" },
];

export default Roles;
