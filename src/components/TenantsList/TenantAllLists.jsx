import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useOwners } from "../../Context/OwnersContext";
import LoginImg from "../../assets/LoginImg.png";
import { usePermission } from "../../Utils/permissionHelper";
import Search from "../../assets/Search.png";
import Arrow from "../../assets/arrow-right.png";
import Circle from "../../assets/menucircle.png";
import Edit from "../../assets/editicon.png";

const TenantsList = () => {

  const { getTenantSummary, loading, deleteTenant, accessError } = useOwners();
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Tenant Summary");
  const menuRef = useRef(null);
  const [tenants, setTenants] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [openMenu, setOpenMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [phone, setPhone] = useState("");
  console.log("accessError", accessError)
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
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setOpenMenu(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  const handleEdit = (item) => {
    setSelectedTenant(item);
    setPhone(item.mobile);
    setShowEditModal(true);
    setOpenMenu(null);
  };
  const handleDeleteTenant = async () => {

    if (!selectedTenant) return;

    const res = await deleteTenant(
      selectedTenant.hostelId,
      selectedTenant.customerId,
      phone
    );

    if (res?.success) {

      setShowEditModal(false);
      setPhone("");

      // refresh list
      const refresh = await getTenantSummary({
        page,
        size,
        tenantName: search
      });

      if (refresh?.success) {
        setTenants(refresh.data.content || []);
        setTotalItems(refresh.data.totalItems || 0);
        setTotalPages(refresh.data.totalPages || 0);
      }

    } else {
      alert(res?.message || "Delete failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "BOOKED":
        return "text-sky-700 bg-sky-100";

      case "CANCELLED_BOOKING":
        return "text-red-700 bg-red-100";

      case "CHECK_IN":
        return "text-emerald-700 bg-emerald-100";

      case "SETTLEMENT_GENERATED":
        return "text-orange-700 bg-orange-200";

      case "INACTIVE":
        return "text-yellow-700 bg-yellow-200";

      case "NOTICE":
        return "text-rose-700 bg-rose-200";

      case "VACATED":
        return "text-red-700 bg-red-200";


      default:
        return "text-gray-600 bg-gray-100";
    }
  };


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
            Tenants Summary
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="border border-gray-300 rounded-xl p-4 bg-white-common">
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
                className="bg-blue-600 text-white p-2 rounded-md cursor-pointer"
              >
                ⟳
              </button>
              <div className="relative">
                <img
                  src={Search}
                  alt="Search"
                  className="absolute left-3 top-2.5 w-4 h-4"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder=" Search..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm font-medium leading-[150%] w-56"

                />
              </div>
            </div>
          </div>
          <div className="bg-white-common border border-gray-300 rounded-xl shadow-sm flex flex-col mt-4">

            <div className="max-h-[350px] overflow-y-auto">

              <table className="min-w-full text-sm">

                {/* <thead className="bg-gray-50 sticky top-0 z-10"> */}
                <thead className="bg-[#F5F7FB] text-black-500 text-xs sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Mobile</th>
                    <th className="px-4 py-3 text-left">Hostel</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Payable</th>
                    <th className="px-4 py-3 text-left">Paid</th>
                    <th className="px-4 py-3 text-left">Due</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">

                  {loading ? (

                    // 🔥 Skeleton Loader
                    Array.from({ length: size }).map((_, i) => (
                      <tr key={i} className="animate-pulse text-[12px]">

                        {/* ID */}
                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-6"></div>
                        </td>

                        {/* Name + Avatar */}
                        <td className="px-6 py-2 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </td>

                        {/* Mobile */}
                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </td>

                        {/* Hostel */}
                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-2">
                          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                        </td>

                        {/* Payable */}
                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </td>

                        {/* Paid */}
                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </td>

                        {/* Due */}
                        <td className="px-4 py-2">
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-2">
                          <div className="h-5 bg-gray-200 rounded w-6"></div>
                        </td>

                      </tr>
                    ))

                  ) : tenants.length > 0 ? (

                    tenants.map((item, index) => (
                      <tr key={item.customerId} className="border-b border-gray-300 hover:bg-gray-50 text-left whitespace-nowrap">
                        <td className="px-4 py-1">
                          {(page - 1) * size + index + 1}
                        </td>

                        {/* <td className="px-6 py-1 flex items-center gap-3 text-left">

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

                        </td> */}
                        <td className="px-6 py-1 text-left">
  <div className="flex items-center gap-3">
    {item.profilePic ? (
      <img
        src={item.profilePic}
        alt={item.fullName}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
    ) : (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs flex-shrink-0">
        {item.initials}
      </div>
    )}

    <div
      className="w-[180px] truncate"
      title={item?.fullName || "N/A"}
    >
      {item?.fullName || "N/A"}
    </div>
  </div>
</td>

                        <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap">
                          {item.mobile}
                        </td>

                        {/* <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap">
                          {item.hostelName}
                        </td> */}
                        <td className="px-4 py-2 text-[12px] text-left">
  <div
    className="w-[220px] truncate"
    title={item?.hostelName || "N/A"}
  >
    {item?.hostelName || "N/A"}
  </div>
</td>


                        <td className="px-4 py-2 text-left whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.currentStatus)}`}>
                            {item.currentStatus}
                          </span>
                        </td>

                        <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap">
                          ₹{item.payableAmount}
                        </td>

                        <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap">
                          ₹{item.paidAmount ?? 0}
                        </td>

                        <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap">
                          ₹{item.dueAmount}
                        </td>


                        <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap relative">
                          <div className="flex items-center gap-3" >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenu(openMenu === index ? null : index);
                              }}
                              className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                              <img src={Circle} alt="circle" className="w-5 h-5" />
                            </button>

                            {/* {openMenu === index && (
                              <div
                                ref={menuRef}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-19 mt-2 w-28 bg-white border rounded-lg border-gray-300 shadow-lg z-20"
                              >

                                <button
                                  disabled={canDelete === false}
                                  onClick={() => canDelete === true && handleEdit(item)}
                                  className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm 
      ${canDelete ? "hover:bg-sky-100 cursor-pointer" : "text-gray-400 cursor-not-allowed"}`}
                                >
                                  <img src={Edit} alt="Edit" className="w-4 h-4" />
                                  Delete
                                </button>

                              </div>
                            )} */}
                          </div>

                        </td>

                      </tr>
                    ))

                  ) : (

                    <tr>
                      <td colSpan="9" className="text-center py-6 text-gray-400">
                        No Data Found
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t text-sm text-gray-500 border-gray-300 ">

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
                  className="border rounded px-2 py-1 text-sm cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>

                {/* Prev */}
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-2 text-gray-600 disabled:opacity-40 cursor-pointer"
                >
                  <img src={Arrow} alt="Arrow" className="w-4 h-4" />
                </button>


                <span className="border px-2 py-1 rounded bg-gray-50 cursor-pointer">
                  {page}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="px-2 text-gray-600 disabled:opacity-40 cursor-pointer"
                >
                  <img src={Arrow} alt="Arrow" className="w-4 h-4 rotate-180" />
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

      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => {
            setShowEditModal(false);
            setPhone("");
          }}
        >

          <div
            className="bg-white-common rounded-xl shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => {
                setShowEditModal(false);
                setPhone("");
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-left">
              Phone Number <span className="text-red-400">*</span>
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />

              <button
                onClick={handleDeleteTenant}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
              >
                Submit
              </button>

            </div>

          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default TenantsList;