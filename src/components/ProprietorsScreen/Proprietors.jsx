import React, { useEffect, useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import swap from "../../assets/arrowswap.png";
import { useOwners } from "../../Context/OwnersContext";

const Proprietors = () => {

  const { owners, totalItems, totalPages, loading, getOwners } = useOwners();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [expiryFilter, setExpiryFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("JOINING_DATE");
  const [direction, setDirection] = useState("desc");


  console.log("owners", owners)


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const filters = getFilterParams();

    getOwners({
      page,
      size,
      name: debouncedSearch,
      sortBy,
      direction,
      ...filters
    });
  }, [page, size, debouncedSearch, sortBy, direction, expiryFilter]);


  const getFilterParams = () => {
    if (expiryFilter === "EXPIRED") {
      return { isPropertiesExpired: true, isAboutToExpire: undefined };
    }

    if (expiryFilter === "ABOUT_TO_EXPIRE") {
      return { isPropertiesExpired: undefined, isAboutToExpire: true };
    }

    return { isPropertiesExpired: undefined, isAboutToExpire: undefined };
  };


  console.log("page", page);
  console.log("owners", owners);
  const handleSort = (key) => {
    if (sortBy === key) {
      setDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setDirection("asc");
    }
    setPage(1);
  };


  return (
    <DashboardLayout>

      <div className="p-4 space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Proprietors</h2>

          <button className="text-blue-600 flex items-center gap-1 text-sm font-medium">
            ➕ Add Proprietor
          </button>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="border border-gray-300 rounded-xl p-4 bg-white">
            <p className="text-gray-500 text-sm">Total Proprietors</p>
            <p className="text-xl font-semibold mt-1">{totalItems}</p>
          </div>

          <div className="border border-gray-300 rounded-xl p-4 bg-white">
            <p className="text-gray-500 text-sm">Active</p>
            <p className="text-xl font-semibold mt-1">--</p>
          </div>

        </div>


        {/* Filter Row */}
        <div className="flex justify-between items-center">

          <div className="flex gap-2">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-[14px]">
              <option>All</option>
            </select>
            <select
              value={expiryFilter}
              onChange={(e) => {
                setPage(1);
                setExpiryFilter(e.target.value);
              }}
              className="border border-gray-300 px-3 py-2 rounded-lg text-xs font-sans"
            >
              <option value="ALL">ALL</option>
              <option value="EXPIRED">isProperties expired</option>
              <option value="ABOUT_TO_EXPIRE">About to expire</option>
            </select>

            <button className="border border-gray-300 px-3 py-2 rounded-md text-[14px]">
              Filter
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPage(1);

                const filters = getFilterParams();

                getOwners({
                  page: 1,
                  size,
                  name: search,
                  sortBy,
                  direction,
                  ...filters
                });
              }}


              className="bg-blue-600 text-white p-2 rounded-md"
            >
              ⟳
            </button>


            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />


          </div>

        </div>


        {/* Table Card */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm flex flex-col">

          <div className="max-h-[350px] overflow-y-auto">

            <table className="min-w-full text-sm">

              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>

                  <th className="px-4 py-3  text-[12px] font-semibold text-left">
                    <div className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("JOINING_DATE")}>
                      ID
                      <img src={swap} className="w-3 h-3" />
                    </div>
                  </th>

                  <th className="px-4 py-3 text-left text-[12px] font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("OWNER_NAME")}>
                      Name
                      <img src={swap} className="w-3 h-3" />
                    </div>
                  </th>

                  <th className="px-4 py-3 text-left text-[12px] font-semibold">
                    <div className="flex items-center gap-1">
                      Mail
                      <img src={swap} className="w-3 h-3" />
                    </div>
                  </th>

                  <th className="px-4 py-3 text-left text-[12px] font-semibold">
                    <div className="flex items-center gap-1">
                      Mobile
                      <img src={swap} className="w-3 h-3" />
                    </div>
                  </th>

                  <th className="px-4 py-3 text-left text-[12px] font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("HOSTEL_COUNT")}>
                      Props
                      <img src={swap} className="w-3 h-3" />
                    </div>
                  </th>

                  {/* <th className="px-4 py-3 text-left text-[12px] font-semibold">
      Plan Status
    </th> */}

                  <th className="px-4 py-3 text-left text-[12px] font-semibold">
                    <div className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("LATEST_ACTIVITY")}>
                      Last Action
                      <img src={swap} className="w-3 h-3" />
                    </div>
                  </th>

                  {/* <th className="px-4 py-3 text-left text-[12px] font-semibold">
      Status
    </th> */}

                  <th className="px-4 py-3 text-left text-[12px] font-semibold">
                    Actions
                  </th>

                </tr>
              </thead>



              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-6">
                      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : owners?.map((item, i) => (

                  <tr key={i} className="border-b border-gray-300 hover:bg-gray-50">

                    <td className="px-4 py-1 text-[12px] text-left">
                      {item.ownerId?.slice(0, 6)}
                    </td>

                    <td className="px-4 py-1 text-blue-600 text-[12px] text-left">
                      {item.fullName}
                    </td>

                    <td className="px-4 py-1 text-[12px] text-left">
                      -
                    </td>

                    <td className="px-4 py-1 text-[12px] text-left">
                      {item.mobileNo}
                    </td>

                    <td className="px-4 py-1 text-blue-600 text-[12px] text-left">
                      {item.noOfProperties}
                    </td>

                    {/* <td className="px-4 py-1 text-[12px]">
                      Active
                    </td> */}

                    <td className="px-4 py-1 text-[12px] text-left">
                      {item.lastActivityDate}
                      {/* {item.lastActivityTime} */}
                    </td>

                    {/* <td className="px-4 py-1 text-[12px]">
                      <span className="text-green-600 font-medium">
                        Active
                      </span>
                    </td> */}

                    <td className="px-4 py-1">⋮</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-300 text-sm">

            <span className="text-gray-600">
              Total Record Count :
              <span className="text-blue-600 font-medium"> {size}</span>
            </span>

            <div className="flex items-center gap-3">

              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>


              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                &#8249;
              </button>

              <span className="border px-3 py-1 rounded-md bg-gray-100">
                {page}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                &#8250;
              </button>


            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Proprietors;
