import React, { useState, useEffect } from "react";
import { useHostel } from "../../Context/HostelListContext";
import LoginImg from "../../assets/LoginImg.png";
import { usePermission } from "../../Utils/permissionHelper";
import msgBox from "../../assets/message-2.png";
import Arrow from "../../assets/arrow-right.png"

function PropertyActive({ hostelData }) {

  const { getHostelActivities } = useHostel();
 const { canRead, canWrite, canUpdate, canDelete } =
      usePermission("Hostel Activities");
  const defaultActivities = hostelData?.activities || [];
console.log("canRead",canRead)
  const [activities, setActivities] = useState([]);
  const [isMore, setIsMore] = useState(false);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchActivities = async (page = 1, searchText = "") => {

    const res = await getHostelActivities(
      hostelData?.hostelId,
      page,
      size,
      searchText
    );

    if (res.success) {

      setActivities(res.data.content || []);
      setTotalItems(res.data.totalItems || 0);
      setTotalPages(res.data.totalPages || 0);

    }

  };

  const handleMoreClick = () => {

    setIsMore(true);
    setPage(1);
    fetchActivities(1, "");

  };

useEffect(() => {

  if (isMore) {
    fetchActivities(page, debouncedSearch);
  }

}, [page, size, debouncedSearch]);
useEffect(() => {

  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 1000); 

  return () => clearTimeout(timer);

}, [search]);

  const tableData = isMore ? activities : defaultActivities;

  const start = (page - 1) * size + 1;
  const end = Math.min(page * size, totalItems);

  return (
    <>
{canRead === false ? (

 <div className="flex-center-col h-[350px] gap-4">

    <img
      src={LoginImg}
      alt="Access Restricted"
      className="w-64 object-contain"
    />

    <p className="error-title">
      Access Restricted
    </p>

  </div>

) : (
   

      
  <>
  {isMore && (

        <div className="flex-end mt-5 mb-3">

          <input
            type="text"
            placeholder="Search..."
            value={search}
           onChange={(e) => {
  setSearch(e.target.value);
  setPage(1);
}}
            className="border px-3 py-2 rounded-md text-sm"
          />

        </div>

      )}


   

     {/* <div className="bg-white border border-[#E6E8F0] rounded-xl overflow-hidden">

     
      <div className="max-h-[350px] overflow-y-auto">

          <table className="w-full text-sm">

            <thead className="bg-[#F5F7FB] text-gray-500 text-xs sticky top-0">

              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Activity</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Platform</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Type</th>
              </tr>

            </thead>

             <tbody className="divide-y divide-gray-200">

              {tableData.length > 0 ? (

                tableData.map((item,i) => (

                  <tr key={item.activityId} className="hover:bg-gray-50">
  <td className="px-4 py-1">
          {(page - 1) * size + i + 1}
        </td>
                    <td className="px-4 py-2 text-[12px] text-left whitespace-nowrap">{item.description}</td>
                    <td className="px-4 py-2 text-[12px] text-left">{item.userName}</td>
                    <td className="px-4 py-2 text-[12px] text-left">{item.activityDate}</td>
                    <td className="px-4 py-2 text-[12px] text-left">{item.activityTime}</td>
                      <td className="px-4 py-2 text-[12px] text-left">{item?.platform || "N/A"}</td>
                    <td className="px-4 py-2 text-[12px] text-left">{item.source}</td>
                    <td className="px-4 py-2 text-[12px] text-left">{item.activityType}</td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No Data Found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div> */}
      <div className="card-common px-4 py-2">

  <div className="scroll-container max-h-[350px]">

    {tableData.length > 0 ? (

      tableData.map((item, i) => (

        <div
          key={item.activityId}
          className="flex gap-4"
        >

          {/* Timeline */}
          <div className="flex-center-col">

          <div
  className="
  
    flex-center
    w-10
    h-10
    rounded-full
    bg-[#EEF3FF]
    border
    border-[#D8E3FF]
  "
>

              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#2563EB]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h8M8 14h5m-9 5h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg> */}
              <img src={msgBox} className="w-4 h-4"/>

            </div>

            {i !== tableData.length - 1 && (
              <div className="w-[1px] flex-1 bg-gray-200 mt-1"></div>
            )}

          </div>

          {/* Content */}
          <div className="pb-6 text-left">

            <h3 className="title-sm">
              {item.userName}
            </h3>

            <p className="text-[13px] text-gray-600 mt-1 leading-6">
              {item.description}
            </p>
 <div className="flex items-center gap-2 mt-2 flex-wrap">

  <span className="badge-primary">
    {item.activityType}
  </span>

  <span className="px-2 py-[2px] text-[11px] font-medium bg-gray-100 text-gray-600 rounded-full">
    {item.platform}
  </span>

</div>
            <p className="text-[12px] text-gray-400 mt-2">
              Added at {item.activityDate}, {item.activityTime}
            </p>

          </div>

        </div>

      ))

    ) : (

      <div className="text-center py-10 text-gray-400">
        No Activities Found
      </div>

    )}

  </div>

</div>
  </>

            )}
     

     
      {!isMore && defaultActivities?.length >= 50 && (
 <div className="mt-4">

  <button
    onClick={handleMoreClick}
   className="btn-soft-primary"
  >
    See More
  </button>

</div>
)}


     

      {/* {isMore && (

        <div className="flex justify-between items-center px-4 py-3 text-sm">

          <span>
            Total Record Count :{" "}
            <span className="text-blue-600">{tableData.length || 0}</span>
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
<button
  disabled={
    page === 1 ||
    tableData?.length === 0
  }
  onClick={() => setPage((p) => p - 1)}
  className={`
    ${
      page === 1 ||
      tableData?.length === 0
        ? "opacity-40 cursor-not-allowed"
        : "cursor-pointer"
    }
  `}
>
  <img
    src={Arrow}
    className="w-4 h-4"
  />
</button>

            <span className="border px-3 py-1 rounded bg-gray-50">
              {page}
            </span>

           <button
  disabled={
    page >= totalPages ||
    tableData?.length === 0
  }
  onClick={() => setPage((p) => p + 1)}
  className={`
    ${
      page >= totalPages ||
      tableData?.length === 0
        ? "opacity-40 cursor-not-allowed"
        : "cursor-pointer"
    }
  `}
>
  <img
    src={Arrow}
    className="w-4 h-4 rotate-[-180deg]"
  />
</button>

            <span className="text-gray-400">
              {start} - {end}
            </span>

          </div>

        </div>

      )} */}
      {isMore && (

  <div className="flex-between px-4 py-3 text-sm">

    <span>
      Total Record Count :{" "}

      <span className="text-primary">
        {tableData.length || 0}
      </span>

    </span>

    <div className="flex items-center gap-4">

      <select
        value={size}
        onChange={(e) => {
          setSize(Number(e.target.value));
          setPage(1);
        }}
        className="input-bordered"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>

      <button
        disabled={
          page === 1 ||
          tableData?.length === 0
        }
        onClick={() => setPage((p) => p - 1)}
        className={`
          ${
            page === 1 ||
            tableData?.length === 0
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer"
          }
        `}
      >
        <img
          src={Arrow}
          className="w-4 h-4"
        />
      </button>

      <span className="input-bordered bg-gray-50">
        {page}
      </span>

      <button
        disabled={
          page >= totalPages ||
          tableData?.length === 0
        }
        onClick={() => setPage((p) => p + 1)}
        className={`
          ${
            page >= totalPages ||
            tableData?.length === 0
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer"
          }
        `}
      >
        <img
          src={Arrow}
          className="w-4 h-4 rotate-[-180deg]"
        />
      </button>

      <span className="text-muted">
        {start} - {end}
      </span>

    </div>

  </div>

)}

    </>
  );
}

export default PropertyActive;