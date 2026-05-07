import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../../Context/SubscriptionContext";
import { useRole } from "../../Context/RoleContext";
import DemoRequests from "./DemoRequest";
import LoginImg from "../../assets/LoginImg.png";
import { usePermission } from "../../Utils/permissionHelper";
import Arrow from "../../assets/direction-down 01.png";
import ArrowRight from "../../assets/arrow-right.png";

const Subscription = () => {
  const { getSubscriptions, loading, errorMsg, accessError } = useSubscription();
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Subscriptions");

  const {adminDetails, agentRoles, getAgentRoles, getAgentRoleById, deleteAgentRole} = useRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [subscriptions, setSubscriptions] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);


  const fetchSubscriptions = async (pageNo = 1, searchText = "") => {



    const res = await getSubscriptions(pageNo, size, searchText);

    if (res.success) {
      setSubscriptions(res.data.content || []);
      setTotalItems(res.data.totalItems || 0);
      setTotalPages(res.data.totalPages || 0);
    }

  };
  // const fetchSubscriptions = async (pageNo = 1, searchText = "") => {

  //   const res = await getSubscriptions(pageNo, size, searchText);

  //   if(res.success){

  //     setSubscriptions(res.data.content || []);
  //     setTotalItems(res.data.totalItems || 0);
  //     setTotalPages(res.data.totalPages || 0);

  //   }

  // };
  const start = totalItems === 0 ? 0 : (page - 1) * size + 1;
  const end = Math.min(page * size, totalItems);
  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);   // 500ms delay

    return () => clearTimeout(timer);

  }, [search]);
  useEffect(() => {
    fetchSubscriptions(page, debouncedSearch);
  }, [page, size, debouncedSearch]);
  return (
    <DashboardLayout>
      <div className="p-6 pt-1">


        <div className="border-b border-gray-200 mb-3 pb-2">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">


            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">

              {/* Title */}
              <h1 className="text-lg font-semibold font-inter">
                Subscriptions
              </h1>

              {/* Tabs */}
              {/* <div className="flex gap-6 text-sm font-medium font-inter">
                 <button
                  onClick={() => setActiveTab("demo")}
                  className={`text-[13px] pb-2 ${activeTab === "demo"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                    }`}
                >
                  Demo Requests
                </button>
                <button
                  onClick={() => setActiveTab("subscriptions")}
                  className={`text-[13px] pb-2 ${activeTab === "subscriptions"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                    }`}
                >
                  Subscriptions
                </button>

               
              </div> */}

            </div>


            {/* <button
              onClick={() => navigate(`/manage-plans/${adminDetails?.roleId}`)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium font-inter w-full sm:w-fit cursor-pointer"
            >
              Manage Plans
            </button> */}
            <button
              onClick={() => navigate(`/manage-plans/${adminDetails?.roleId}`)}
             
              className="px-5 py-2 rounded-lg text-sm font-medium font-inter w-full sm:w-fit bg-blue-600 text-white cursor-pointer"
         >
              Manage Plans
            </button>

          </div>

        </div>



        {activeTab === "subscriptions" && (
          <>
            {(canRead === false || errorMsg === "Access Restricted") ? (

              <div className="flex flex-col items-center justify-center h-[400px] gap-4">

                <img
                  src={LoginImg}
                  alt="Access Restricted"
                  className="w-64 object-contain"
                />

                <p className="text-red-600 text-lg font-medium">
                  {accessError}
                </p>

              </div>

            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">

                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                    <p className="text-gray-500 text-sm font-gilroy">Active Properties</p>
                    <h2 className="text-2xl font-bold mt-2">0</h2>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                    <p className="text-gray-500 text-sm font-gilroy">Expired Properties</p>
                    <h2 className="text-2xl font-bold mt-2">0</h2>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                    <p className="text-gray-500 text-sm font-gilroy">Basic</p>
                    <h2 className="text-2xl font-bold mt-2">0</h2>
                  </div>

                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                    <p className="text-gray-500 text-sm font-gilroy">Trial</p>
                    <h2 className="text-2xl font-bold mt-2">0</h2>
                  </div>

                </div>


                <div className="mb-4 bg-white py-3">
                  <div className="flex justify-end items-center">
                    {/* <div className="flex gap-3">
              <select className="border border-gray-300 px-3 py-1 rounded-lg text-xs font-sans">
                <option>All</option>
                <option>Active</option>
                <option>Expired</option>
              </select>

              <select className="border border-gray-300 px-3 py-2 rounded-lg text-xs font-sans">
                <option>This Month</option>
                <option>Last Month</option>
              </select>

              <button className="border border-gray-300 px-4 py-2 rounded-lg text-xs font-sans">
                Filter
              </button>
            </div> */}

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search..."
                      className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-64"
                    />
                  </div>
                </div>


                <div className="bg-white rounded-xl shadow-sm border border-gray-300">

                  <div className="max-h-[320px] overflow-y-auto">

                    <table className="w-full text-sm">


                      <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10 font-Inter">
                        <tr>
                          <th className="px-4 py-3 text-left">ID</th>
                          <th className="px-4 py-3 text-left">Property Name</th>
                          {/* <th className="px-4 py-3 text-left">Proprietor</th>
                          <th className="px-4 py-3 text-left">Status</th> */}
                          <th className="px-4 py-3 text-left">Plan Type</th>
                          <th className="px-4 py-3 text-left">Start Date</th>
                          <th className="px-4 py-3 text-left">Expiry Date</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">

                        {loading ? (

                          // 🔥 Skeleton Loader
                          Array.from({ length: size }).map((_, i) => (
                            <tr key={i} className="animate-pulse text-[12px]">

                              <td className="px-4 py-2">
                                <div className="h-3 bg-gray-200 rounded w-6"></div>
                              </td>

                              <td className="px-4 py-2">
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                              </td>

                              <td className="px-4 py-2">
                                <div className="h-3 bg-gray-200 rounded w-20"></div>
                              </td>

                              <td className="px-4 py-2">
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                              </td>

                              <td className="px-4 py-2">
                                <div className="h-3 bg-gray-200 rounded w-20"></div>
                              </td>

                              <td className="px-4 py-2">
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                              </td>

                              <td className="px-4 py-2">
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                              </td>

                              <td className="px-4 py-2 text-center">
                                <div className="h-4 bg-gray-200 rounded w-6 mx-auto"></div>
                              </td>

                            </tr>
                          ))

                        ) : subscriptions.length > 0 ? (

                          subscriptions.map((item, index) => (
                            <tr key={item.subscriptionId} className="hover:bg-gray-50 text-[12px]">

                              <td className="px-4 py-2">
                                {(page - 1) * size + index + 1}
                              </td>

                              <td className="px-4 py-2 text-blue-600 text-left">
                                {item.hostelName}
                              </td>

                              {/* <td className="px-4 py-2">
                                {item.ownerName}
                              </td>

                              <td className="px-4 py-2">
                                {item.status}
                              </td> */}

                              <td className="px-4 py-2">
                                {item.planName}
                              </td>

                              <td className="px-4 py-2">
                                {item.planStartsAt}
                              </td>

                              <td className="px-4 py-2">
                                {item.planEndsAt}
                              </td>

                              <td className="px-4 py-2 text-center">
                                ⋮
                              </td>

                            </tr>
                          ))

                        ) : (

                          <tr>
                            <td colSpan="8" className="text-center py-6 text-gray-400">
                              No Data Found
                            </td>
                          </tr>

                        )}

                      </tbody>

                    </table>

                  </div>

                </div>









                {/* Footer Pagination */}
                <div className="flex justify-between items-center px-4 py-3 text-sm">

                  <span>
                    Total Record Count :{" "}
                    <span className="text-blue-600">{size}</span>
                  </span>

                  <div className="flex items-center gap-4">

                    <select
                      value={size}
                      onChange={(e) => {
                        setSize(Number(e.target.value));
                        setPage(1);
                      }}
                      className="border rounded px-2 py-1"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>

                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <img src={ArrowRight} alt="Arrow" className="w-[15px] h-[15px]" />
                    </button>

                    <span className="border px-3 py-1 rounded bg-gray-50">
                      {page}
                    </span>

                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <img src={ArrowRight} alt="Arrow" className="w-[15px] h-[15px] scale-x-[-1]" />
                    </button>

                    <span className="text-gray-400">
                      {start} - {end}
                    </span>

                  </div>

                </div>
              </>
            )}
          </>
        )}

        {activeTab === "demo" && (
          <DemoRequests />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
