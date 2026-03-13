import React, { useEffect, useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useOwners } from "../../Context/OwnersContext";
import LoginImg from "../../assets/LoginImg.png";
import { usePermission } from "../../Utils/permissionHelper";

const TenantsList = () => {

  const { getTenantSummary,accessError } = useOwners();
 const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Tenant Summary");
  const [tenants, setTenants] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
const [totalPages, setTotalPages] = useState(0);
console.log("accessError",accessError)
useEffect(() => {

  const fetchData = async () => {

    const res = await getTenantSummary({
      page,
      size,
      tenantName: search
    });

    if (res.success) {
      setTenants(res.data.content || []);
      setTotalItems(res.data.totalItems || 0);
      setTotalPages(res.data.totalPages || 0);
    }

  };

  fetchData();

}, [page, size, search]);

// useEffect(() => {

//   const fetchData = async () => {

//     const res = await getTenantSummary({
//       page,
//       size,
//       tenantName: ""
//     });

//     if (res.success) {

//       setTenants(res.data.content || []);
//       setTotalItems(res.data.totalItems || 0);
//       setTotalPages(res.data.totalPages || 0);

//     }

//   };

//   fetchData();

// }, [page, size]);
const start = (page - 1) * size + 1;
const end = Math.min(page * size, totalItems);

  return (

    <DashboardLayout>
      {(canRead === false || accessError === "Access Restricted") ? (
      
        <div className="flex flex-col items-center justify-center h-[350px] gap-4">
      
          <img
            src={LoginImg}
            alt="Access Restricted"
            className="w-64 object-contain"
          />
      
          <p className="text-red-600 text-lg font-medium">
            Access Restricted
          </p>
      
        </div>
      
      ) : (
         
<>

      <h1 className="text-xl font-semibold mb-6 text-left">
        Tenants
      </h1>
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="border border-gray-300 rounded-xl p-4 bg-white">
            <p className="text-gray-500 text-sm">Total Proprietors</p>
            <p className="text-xl font-semibold mt-1">{totalItems}</p>
          </div>

         

        </div>


        {/* Filter Row */}
      <div className="flex justify-end items-center">

  <div className="flex items-center gap-2">
    <button
  onClick={() => {
    setSearch("");
    setPage(1);
  }}
  className="bg-blue-600 text-white p-2 rounded-md"
>
  ⟳
</button>

    <input
      type="text"
      value={search}
  onChange={(e) => {
    setPage(1);
    setSearch(e.target.value);
  }}
      placeholder="Search..."
      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
    />

  </div>

</div>
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm flex flex-col mt-4">

          <div className="max-h-[350px] overflow-y-auto">

        <table className="min-w-full text-sm">

              <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                 <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Mobile</th>
                <th className="px-6 py-3 text-left">Hostel</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Payable</th>
                <th className="px-6 py-3 text-left">Paid</th>
                <th className="px-6 py-3 text-left">Due</th>
              </tr>
            </thead>

            <tbody>

              {tenants.map((item,i) => (

                <tr key={item.customerId} className="border-b border-gray-300 hover:bg-gray-50">
<td className="px-4 py-1">
          {(page - 1) * size + i + 1}
        </td>
                 
                  <td className="px-6 py-1 flex items-center gap-3">

  {item.profilePic ? (
    <img
      src={item.profilePic}
      alt={item.fullName}
      className="w-8 h-8 rounded-full object-cover"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
      {item.initials}
    </div>
  )}

  {item.fullName}

</td>

                  <td className="px-6 py-1">
                    {item.mobile}
                  </td>

                  <td className="px-6 py-1">
                    {item.hostelName}
                  </td>

                  <td className="px-6 py-1">
                    {item.currentStatus}
                  </td>

                  <td className="px-6 py-1">
                    ₹{item.payableAmount}
                  </td>

                  <td className="px-6 py-1">
                    ₹{item.paidAmount ?? 0}
                  </td>

                  <td className="px-6 py-1">
                    ₹{item.dueAmount}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Footer */}
       <div className="flex items-center justify-between px-6 py-3 border-t text-sm text-gray-500">

  <span>
    Total Record Count : <span className="text-blue-600">{size}</span>
  </span>

  <div className="flex items-center gap-4">

    {/* Page size */}
    <select
      value={size}
      onChange={(e) => {
        setSize(Number(e.target.value));
        setPage(1);
      }}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>

    {/* Prev */}
   <button
  onClick={() => setPage((p) => Math.max(p - 1, 1))}
  disabled={page === 1}
  className="px-2 text-gray-600 disabled:opacity-40"
>
  ◀
</button>

<span className="border px-2 py-1 rounded bg-gray-50">
  {page}
</span>

<button
  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
  disabled={page >= totalPages}
  className="px-2 text-gray-600 disabled:opacity-40"
>
  ▶
</button>

    {/* Showing range */}
    <span className="text-gray-400">
      {start} - {end}
    </span>

  </div>

</div>

      </div>
</>
      )}
    </DashboardLayout>
  );
};

export default TenantsList;