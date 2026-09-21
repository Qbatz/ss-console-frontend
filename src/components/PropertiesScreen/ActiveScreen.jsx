import React, { useState, useEffect } from "react";
import { useHostel } from "../../Context/HostelListContext";
import LoginImg from "../../assets/LoginImg.png";
import { usePermission } from "../../Utils/permissionHelper";
import msgBox from "../../assets/message-2.png";
import Arrow from "../../assets/arrow-right.png";
import { useArchive } from "../../Context/DataArchiveContext";
import Toast from "../../components/SuccessModal/ToastDesign";

function PropertyActive({ hostelData }) {

  const { getHostelActivities } = useHostel();
  const { ArchiveActivities } = useArchive();
 const { canRead, canWrite, canUpdate, canDelete } =
      usePermission("Hostel Activities");
  const defaultActivities = hostelData?.activities || [];
console.log("canRead",canRead)
  const [activities, setActivities] = useState([]);
  const [isMore, setIsMore] = useState(false);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
const [archiveLoading, setArchiveLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");

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

 const handleArchiveActivities = async () => {
  if (!hostelData?.hostelId) return;

  try {
    setArchiveLoading(true);

    const res = await ArchiveActivities(
      hostelData.hostelId
    );

    if (res?.success) {
      setShowArchiveConfirm(false);

      setModalType("success");
      setMessage(
        res?.data?.message ||
        res?.data ||
        "Activities archived successfully"
      );
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 800);

      await fetchActivities(1, "");
    } else {
      setModalType("error");
      setMessage(
        res?.message ||
        "Failed to archive activities"
      );
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 800);
    }
  } catch (error) {
    console.error(
      "Archive activities error:",
      error
    );

    setModalType("error");
    setMessage(
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong"
    );
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 800);
  } finally {
    setArchiveLoading(false);
  }
};

  return (
    <>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
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
  
    <div className="flex justify-end mb-3">
      <button
      onClick={() => setShowArchiveConfirm(true)}
        type="button"
       
        className="
          h-[30px]
          px-4
          rounded-[5px]
          bg-[#2952F3]
          text-white
          text-[11px]
          font-medium
          hover:bg-[#1F45D8]
          transition
          cursor-pointer
          mt-3
        "
      >
       Archive Activities
      </button>
    </div>
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
      <div className="bg-white-common rounded-xl px-4 py-2">

  <div className="max-h-[350px] overflow-y-auto y-8">

    {tableData.length > 0 ? (

      tableData.map((item, i) => (

        <div
          key={item.activityId}
          className="flex gap-4"
        >

          {/* Timeline */}
          <div className="flex flex-col items-center">

            <div className="w-10 h-10 rounded-full bg-[#EEF3FF] border border-[#D8E3FF] flex items-center justify-center">

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

            <h3 className="text-[15px] font-semibold text-gray-800">
              {item.userName}
            </h3>

            <p className="text-[13px] text-gray-600 mt-1 leading-6">
              {item.description}
            </p>
 <div className="flex items-center gap-2 mt-2 flex-wrap">

  <span className="px-2 py-[2px] text-[11px] font-medium bg-blue-50 text-blue-600 rounded-full">
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
    className="w-full bg-[#EEF2FF] hover:bg-[#E4E9FF] text-[#2563EB] text-sm font-medium py-3 rounded-md transition cursor-pointer"
  >
    See More
  </button>

</div>
)}


     

      {isMore && (

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
  className={`
    w-8
    h-8
    rounded-full
    flex
    items-center
    justify-center

    ${
      page === 1 ||
      tableData.length === 0
        ? " cursor-not-allowed opacity-70"
        : " hover:bg-gray-200 cursor-pointer"
    }
  `}
  disabled={
    page === 1 ||
    tableData.length === 0
  }
  onClick={() =>
    setPage((p) => p - 1)
  }
>
  <img
    src={Arrow}
    className="w-4 h-4"
  />
</button>

            <span className="border px-3 py-1 rounded bg-gray-50">
              {page}
            </span>
                 <span className="text-textDark/60 text-cardTitle">
  {page} - {totalPages}
</span>
       <button
  className={`
    w-8
    h-8
    rounded-full
    flex
    items-center
    justify-center

    ${
      page >= totalPages ||
      tableData.length === 0
        ? "cursor-not-allowed opacity-70"
        : "hover:bg-gray-200 cursor-pointer"
    }
  `}
  disabled={
    page >= totalPages ||
    tableData.length === 0
  }
  onClick={() =>
    setPage((p) => p + 1)
  }
>
  <img
    src={Arrow}
    className="
      w-4
      h-4
      rotate-[-180deg]
    "
  />
</button>

            {/* <span className="text-gray-400">
              {start} - {end}
            </span> */}

          </div>

        </div>

      )}
{showArchiveConfirm && (
  <div
    className="fixed inset-0 z-[2000] bg-black/40 flex items-center justify-center"
    onClick={() => {
      if (!archiveLoading) {
        setShowArchiveConfirm(false);
      }
    }}
  >
    <div
      className="bg-white w-[380px] rounded-xl shadow-xl p-5"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-[16px] font-semibold text-[#222]">
        Archive Activities
      </h2>

      <p className="text-[13px] text-[#666] mt-3 leading-5">
  Are you sure you want to archive the hostel activities?
</p>


  

<p className="text-[11px] text-red-600 mt-2">⚠️ Data over 60 days will be deleted.</p>


      <div className="flex justify-end gap-3 mt-6">

        <button
          type="button"
          disabled={archiveLoading}
          onClick={() => setShowArchiveConfirm(false)}
          className="
            h-[32px]
            px-4
            rounded-[5px]
            border
            border-[#D9DDE5]
            text-[11px]
            text-[#555]
            hover:bg-[#F5F6F8]
            cursor-pointer
          "
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={archiveLoading}
          onClick={handleArchiveActivities}
          className="
            h-[32px]
            px-4
            rounded-[5px]
            bg-[#2952F3]
            text-white
            text-[11px]
            font-medium
            hover:bg-[#1F45D8]
            disabled:opacity-60
            disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          {archiveLoading ? "Processing..." : "Confirm"}
        </button>

      </div>
    </div>
  </div>
)}
    </>
  );
}

export default PropertyActive;