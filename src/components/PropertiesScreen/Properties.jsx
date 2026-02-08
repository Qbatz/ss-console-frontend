import React, { useState, useEffect, useContext } from "react";
import AddBtn from "../../assets/add.png"
import Search from "../../assets/Search.png";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useHostel } from "../../Context/HostelListContext";

const Properties = () => {
  const { hostels, getHostels, loading } = useHostel();
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");


  useEffect(() => {
    const delay = setTimeout(() => {
      getHostels(page, pageSize, searchText);
    }, 500);

    return () => clearTimeout(delay);
  }, [page, pageSize, searchText]);


  // useEffect(() => {
  //   getHostels();
  // }, []);
  useEffect(() => {
    getHostels(page, pageSize, searchText);
  }, [page, pageSize, searchText]);

  console.log("hostels", hostels)

  return (
    <DashboardLayout>
      <div className="p-2 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold font-Inter">Properties</h1>

          <button className="flex items-center gap-2 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-700 font-Inter">
            <img src={AddBtn} alt="add" className="w-4 h-4 object-contain" />
            Add Property
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-xs font-Gilroy">Total Properties</p>
            <h2 className="text-2xl font-bold text-base mt-1 font-Gilroy">{hostels?.totalHostels}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Active Properties</p>
            <h2 className="text-2xl text-base font-bold mt-1">{hostels?.activeHostels}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">InActive Properties</p>
            <h2 className="text-2xl text-base font-bold mt-1">{hostels?.inactiveHostels}</h2>
          </div>
        </div>


        <div className="flex flex-wrap justify-between items-center gap-2 mb-4 font-inter">

          <div className="flex gap-3">

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
              className="border rounded-lg px-3 py-2 text-xs font-medium text-gray-700"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>


            <select className="border rounded-lg px-3 py-2 text-xs font-medium leading-[150%] text-gray-700">
              <option className="text-[#1E45E1] font-medium font-inter ">This Month</option>
              <option>Last Month</option>
            </select>

            <button className="border px-4 py-2 rounded-lg text-xs font-medium leading-[150%] text-gray-700 font-inter">
              Filter
            </button>

          </div>

          <div className="relative">
            <img
              src={Search}
              alt="Search"
              className="absolute left-3 top-2.5 w-4 h-4"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(0);
              }}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm font-medium leading-[150%] w-56"
            />
          </div>
        </div>



        <div className="bg-white rounded-xl shadow-sm border flex-1 flex flex-col overflow-hidden">



          <div className="flex-1 overflow-y-auto">

            <table className="w-full text-sm text-left border-collapse">

              <thead className="bg-gray-100 text-gray-600 text-xs uppercase sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 whitespace-nowrap">Region / City</th>
                  <th className="px-4 py-3 whitespace-nowrap">Sub Plan</th>
                  <th className="px-4 py-3 whitespace-nowrap">Created On</th>
                  <th className="px-4 py-3 whitespace-nowrap">Last Action</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {/* {hostels?.hostels?.map((item, index) => ( */}
                {hostels?.hostels
                  ?.filter((item) => {
                    if (statusFilter === "") return true;
                    if (statusFilter === "active") return item.subscriptionIsActive;
                    if (statusFilter === "inactive") return !item.subscriptionIsActive;
                    return true;
                  })
                  ?.map((item, index) => (

                    <tr key={item.hostelId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 text-blue-600 font-medium">
                        {item.hostelName}
                      </td>
                      <td className="px-4 py-3">
                        {item.ownerInfo?.fullName}
                      </td>
                      <td className="px-4 py-3">
                        {item.hostelPlan?.currentPlan}
                      </td>
                      <td className="px-4 py-3">
                        {item.joinedOn}
                      </td>
                      <td className="px-4 py-3">
                        {item.expiredOn}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap w-fit ${item.subscriptionIsActive
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                            }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${item.subscriptionIsActive
                                ? "bg-green-500"
                                : "bg-red-500"
                              }`}
                          ></span>
                          {item.subscriptionIsActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">⋮</td>
                    </tr>
                  ))}
              </tbody>

            </table>
          </div>


          <div className="flex justify-between items-center px-4 py-3 text-sm border-t bg-white">


            <span className="text-gray-600">
              Total Record Count :{" "}
              <span className="text-blue-600 font-medium">
                {hostels?.totalElements ?? 0}
              </span>
            </span>


            <div className="flex items-center gap-4">


              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>


              <button
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
                className="text-gray-500 disabled:opacity-40"
              >
                &#8249;
              </button>


              <span className="border px-3 py-1 rounded-md bg-gray-100">
                {(hostels?.currentPage ?? 0) + 1}
              </span>

              <span className="text-gray-500">
                {page * pageSize + 1} -{" "}
                {Math.min(
                  (page + 1) * pageSize,
                  hostels?.totalElements ?? 0
                )}
              </span>


              <button
                disabled={hostels?.last}
                onClick={() => setPage((prev) => prev + 1)}
                className="text-gray-500 disabled:opacity-40"
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

export default Properties;
