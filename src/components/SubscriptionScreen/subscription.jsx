import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../../Context/SubscriptionContext";
import { useRole } from "../../Context/RoleContext";
import DemoRequests from "./DemoRequest";
import LoginImg from "../../assets/permission.svg";
import { usePermission } from "../../Utils/permissionHelper";
import Arrow from "../../assets/direction-down 01.png";
import ArrowRight from "../../assets/arrow-right.png";
import Circle from "../../assets/menucircle.png";

const Subscription = () => {
  const { getSubscriptions, loading, errorMsg, accessError } = useSubscription();
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Subscriptions");

  const { adminDetails, agentRoles, getAgentRoles, getAgentRoleById, deleteAgentRole } = useRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [subscriptions, setSubscriptions] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [responseCard, setResponseCard] = useState([])
  const [filterBy, setFilterBy] = useState("ALL");
  const [openFilter, setOpenFilter] = useState(false);
  const filterRef = useRef(null);
  const [isActive, setIsActive] = useState(null);

  const fetchSubscriptions = async (
    pageNo = 1,
    searchText = "",
    filterType = "ALL"
  ) => {

    const res = await getSubscriptions(
      pageNo,
      size,
      searchText,
      filterType,
       isActive
    );

    if (res.success) {
      setSubscriptions(res.data.content || []);
      setTotalItems(res.data.totalItems || 0);
      setTotalPages(res.data.totalPages || 0);
      setResponseCard(res.data || []);
    }
  };


  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setOpenFilter(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  // const fetchSubscriptions = async (pageNo = 1, searchText = "") => {



  //   const res = await getSubscriptions(pageNo, size, searchText);

  //   if (res.success) {
  //     setSubscriptions(res.data.content || []);
  //     setTotalItems(res.data.totalItems || 0);
  //     setTotalPages(res.data.totalPages || 0);
  //     setResponseCard(res.data || [])
  //   }

  // };



  const start = totalItems === 0 ? 0 : (page - 1) * size + 1;
  const end = Math.min(page * size, totalItems);
  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);

  }, [search]);
  // useEffect(() => {
  //   fetchSubscriptions(page, debouncedSearch);
  // }, [page, size, debouncedSearch]);
  useEffect(() => {
    fetchSubscriptions(page, debouncedSearch, filterBy);
  }, [page, size, debouncedSearch, filterBy,isActive]);
  return (
    <DashboardLayout>
      <div className="p-6 pt-1">


        <div className="border-b border-gray-200 mb-3 pb-2">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">


            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">

              
              <h1 className="text-lg font-semibold font-inter">
                Subscriptions
              </h1>

             

            </div>


           
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
                                        className="w-[170px] sm:w-[140px] md:w-[150px] object-contain"
                                   />
               
                         <h1 className="mt-1 text-[24px]  font-semibold text-[#101828]">
                         Permission Restricted !
                       </h1>
               
                       <p className="mt-1 text-sm md:text-base text-[#4A5565] max-w-md">
                         Your permission is restricted for this module
                       </p>

              </div>

            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">

                  <div className="bg-white-common p-5 rounded-xl shadow-sm border border-gray-300">
                    <p className="text-gray-500 text-sm font-gilroy">Active Properties</p>
                    <h2 className="text-2xl font-bold mt-2">{responseCard?.activePropertiesCount || 0}</h2>
                  </div>

                  <div className="bg-white-common p-5 rounded-xl shadow-sm border border-gray-300">
                    <p className="text-gray-500 text-sm font-gilroy">Expired Properties</p>
                    <h2 className="text-2xl font-bold mt-2">{responseCard?.expiredPropertiesCount || 0}</h2>
                  </div>

                  <div className="bg-white-common p-5 rounded-xl shadow-sm border border-gray-300">



                    <div className="flex items-center justify-between gap-4">


                      <div className="flex-1 text-center  rounded-lg py-1">

                        <p className="text-gray-500 text-sm font-gilroy">
                          Basic
                        </p>

                        <h2 className="text-2xl font-bold mt-1 text-gray-900">
                          {responseCard?.basicPlansCount || 0}
                        </h2>

                      </div>



                    </div>

                  </div>

                  <div className="bg-white-common p-5 rounded-xl shadow-sm border border-gray-300">
                    <p className="text-gray-500 text-sm font-gilroy">Advance</p>
                    <h2 className="text-2xl font-bold mt-2">{responseCard?.advancePlansCount || 0}</h2>
                  </div>
                    <div className="bg-white-common p-5 rounded-xl shadow-sm border border-gray-300">
                    <p className="text-gray-500 text-sm font-gilroy">Others</p>
                    <h2 className="text-2xl font-bold mt-2">{responseCard?.otherPlansCount || 0}</h2>
                  </div>

                </div>
              <div className="mb-4 bg-white-common py-3">
  <div className="flex justify-between items-center">
    
    {/* Left Side */}
    <div className="flex items-center gap-3">
      {/* Filter */}
      <div className="relative w-[220px]" ref={filterRef}>
    <button
      onClick={() => setOpenFilter(!openFilter)}
      className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm bg-white-common flex items-center justify-between"
    >
      {filterBy
        ?.replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())}

      <img src={Arrow} className="w-4 h-4 cursor-pointer" />
    </button>

    {openFilter && (
      <div className="absolute top-full left-0 mt-1 w-full bg-white-common border border-gray-300 rounded-lg shadow-lg z-50 max-h-[180px] overflow-y-auto">
        {responseCard?.filterOptions?.map((item) => (
          <div
            key={item}
            onClick={() => {
              setFilterBy(item);
              setPage(1);
              setOpenFilter(false);
            }}
            className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
              filterBy === item ? "bg-blue-600 text-white" : ""
            }`}
          >
            {item
              .replaceAll("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </div>
        ))}
      </div>
    )}
  </div>

      {/* Status */}
     <select
  value={isActive === null ? "" : isActive.toString()}
  onChange={(e) => {
    const value = e.target.value;

    setIsActive(
      value === ""
        ? null
        : value === "true"
    );

    setPage(1);
  }}
  className="border border-gray-300 px-4 py-2 pr-3 rounded-lg text-sm bg-white-common min-w-[120px]"
>
  <option value="">All Status</option>
  <option value="true">Active</option>
  <option value="false">Inactive</option>
</select>
    </div>

    {/* Right Side Search */}
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

                {/* <div className="mb-4 bg-white py-3">
                  <div className="flex justify-end items-center">
                    <div className="flex gap-3">
              <select
    value={filterBy}
    onChange={(e) => {
      setFilterBy(e.target.value);
      setPage(1);
    }}
    className="border border-gray-300 px-4 py-2 rounded-lg text-sm min-w-[220px] bg-white cursor-pointer outline-none"
  >
    {responseCard?.filterOptions?.map((item) => (
      <option key={item} value={item}>
        {item
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())}
      </option>
    ))}
  </select>
            </div>

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
                </div> */}


                <div
                  className="
    bg-white-common
    rounded-xl
    shadow-sm
    border
    border-gray-300

    overflow-hidden
  "
                >

                  <div
                    className="
    max-h-[320px]
    overflow-y-auto
    overflow-x-auto

    pl-[1px]

    [&::-webkit-scrollbar]:w-[10px]
    [&::-webkit-scrollbar]:h-[10px]

    [&::-webkit-scrollbar-track]:bg-[#EEF4FF]
    [&::-webkit-scrollbar-track]:rounded-full

    [&::-webkit-scrollbar-thumb]:bg-[#C9DAFF]
    [&::-webkit-scrollbar-thumb]:rounded-full

    [&::-webkit-scrollbar-thumb]:border-[2px]
    [&::-webkit-scrollbar-thumb]:border-solid
    [&::-webkit-scrollbar-thumb]:border-[#EEF4FF]

    hover:[&::-webkit-scrollbar-thumb]:bg-[#B7CCFF]
  "
                  >

                    <table className="w-full text-sm">


                      <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10 font-Inter">
                        <tr>
                          <th className="px-4 py-3 text-left">ID</th>
                          {/* <th className="px-4 py-3 text-left">Property Name</th> */}
                          <th className="px-4 py-3 text-left w-[120px] min-w-[120px]">
  Property Name
</th>

                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Plan Name</th>
                          <th className="px-4 py-3 text-left">Start Date</th>
                          <th className="px-4 py-3 text-left">Expiry Date</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">

                        {loading ? (


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

                              <td className="px-4 py-2 text-left">
                                {(page - 1) * size + index + 1}
                              </td>

                              {/* <td className="px-4 py-2 text-blue-600 text-left">
                                {item.hostelName}
                              </td> */}
                              {/* <td className="px-4 py-2 text-left">
  <div
    className="w-[180px] truncate text-blue-600"
    title={item.hostelName || "N/A"}
  >
    {item.hostelName || "N/A"}
  </div>
</td> */}
<td className="px-4 py-2 text-left w-[120px] min-w-[120px]">
  <div
    className="w-[120px] truncate text-blue-600"
    title={item.hostelName || "N/A"}
  >
    {item.hostelName || "N/A"}
  </div>
</td>

                              {/* <td className="px-4 py-2">
                                {item.ownerName}
                              </td> */}

                              {/* <td className="px-4 py-2">
                                {item.isExpired}
                              </td> */}
                              <td className="px-4 py-2 text-left">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${item.isExpired
                                      ? "bg-red-100 text-red-600"
                                      : "bg-green-100 text-green-600"
                                    }`}
                                >
                                  {item.isExpired ? "Expired" : "Active"}
                                </span>
                              </td>

                              <td className="px-4 py-2 text-left">
                                {item.planName}
                              </td>

                              <td className="px-4 py-2 text-left">
                                {item.planStartsAt}
                              </td>

                              <td className="px-4 py-2 text-left">
                                {item.planEndsAt}
                              </td>

                              <td className="px-4 py-2 text-center">
                                <img src={Circle} className="w-4 h-4 cursor-pointer" />
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
                    <span className="text-blue-600">{subscriptions?.length || 0}</span>
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
                      <option value={100}>100</option>
                    </select>

                    {/* <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <img src={ArrowRight} alt="Arrow" className="w-[15px] h-[15px]" />
                    </button> */}
                    <button
                      disabled={
                        page === 1 ||
                        subscriptions.length === 0
                      }
                      onClick={() => setPage((p) => p - 1)}
                      className={`
    ${page === 1 ||
                          subscriptions.length === 0
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer"
                        }
  `}
                    >
                      <img
                        src={ArrowRight}
                        alt="Arrow"
                        className="w-[15px] h-[15px]"
                      />
                    </button>

                    <span className="border px-3 py-1 rounded bg-gray-50">
                      {page}
                    </span>

                    {/* <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <img src={ArrowRight} alt="Arrow" className="w-[15px] h-[15px] scale-x-[-1]" />
                    </button> */}
                    <button
                      disabled={
                        page >= totalPages ||
                        subscriptions.length === 0
                      }
                      onClick={() => setPage((p) => p + 1)}
                      className={`
    ${page >= totalPages ||
                          subscriptions.length === 0
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer"
                        }
  `}
                    >
                      <img
                        src={ArrowRight}
                        alt="Arrow"
                        className="w-[15px] h-[15px] scale-x-[-1]"
                      />
                    </button>

                    <span className="text-gray-400">
                      {page} - {totalPages}
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
