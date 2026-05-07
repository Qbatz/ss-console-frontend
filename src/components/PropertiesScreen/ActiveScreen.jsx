import React, { useState, useEffect } from "react";
import { useHostel } from "../../Context/HostelListContext";
import LoginImg from "../../assets/LoginImg.png";
import { usePermission } from "../../Utils/permissionHelper";

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
  {isMore && (

        <div className="flex justify-end mb-3">

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


   

     <div className="bg-white border border-[#E6E8F0] rounded-xl overflow-hidden">

     
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

      </div>
  </>

            )}
      {/* More Button */}

     
      {!isMore && defaultActivities.length > 0 && (
  <div className="flex justify-end mt-2">
    <button
      onClick={handleMoreClick}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition"
    >
      More
      <span className="text-lg leading-none">›</span>
    </button>
  </div>
)}


     

      {isMore && (

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
              ◀
            </button>

            <span className="border px-3 py-1 rounded bg-gray-50">
              {page}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              ▶
            </button>

            <span className="text-gray-400">
              {start} - {end}
            </span>

          </div>

        </div>

      )}

    </>
  );
}

export default PropertyActive;