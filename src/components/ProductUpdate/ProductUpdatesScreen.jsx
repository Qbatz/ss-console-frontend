import React, { useState,useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../Context/RoleContext";
import { usePlan } from "../../Context/PlanContexts";

const ProductUpdate = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [typeFilters, setTypeFilters] = useState([]);
const [type, setType] = useState("ALL");
const [publishStatusFilters, setPublishStatusFilters] = useState([]);

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
  totalItems: 0,
  draftCount: 0,
  scheduledCount: 0,
  publishedCount: 0,
});
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

const [totalCount, setTotalCount] = useState(0);
const [totalPages, setTotalPages] = useState(1);
const [hoveredRow, setHoveredRow] = useState(null);

  const navigate = useNavigate();

  const { adminDetails } = useRole();
  const { getProductUpdates } = usePlan();

 useEffect(() => {
  fetchProductUpdates();
}, [search, type, activeTab,currentPage,pageSize]);

const fetchProductUpdates = async () => {
  try {
    setLoading(true);

    const result = await getProductUpdates({
      page: currentPage,
      size: pageSize,
      name: search,
      publishStatus: activeTab,
      type: type,
    });

    console.log("API REQUEST:", {
      page: currentPage,
      size: pageSize,
      name: search,
      publishStatus: activeTab,
      type: type,
    });

    console.log("API RESPONSE:", result);

    if (result?.success) {
      const data = result.data;

      setUpdates(data?.productUpdateList || []);

      setTypeFilters(data?.typeFilters || []);

      setPublishStatusFilters(
        data?.publishStatusFilters || []
      );

      setTotalCount(
        data?.totalCount || 0
      );

      setTotalPages(
        data?.totalPages || 1
      );

      setSummary({
        totalItems: data?.totalItems || 0,
        draftCount: data?.draftCount || 0,
        scheduledCount: data?.scheduledCount || 0,
        publishedCount: data?.publishedCount || 0,
      });

    } else {
      setUpdates([]);
      setTotalCount(0);
      setTotalPages(1);
    }

  } catch (error) {
    console.error(
      "Fetch Product Updates Error:",
      error
    );

    setUpdates([]);
    setTotalCount(0);
    setTotalPages(1);

  } finally {
    setLoading(false);
  }
};



const filteredUpdates = updates.filter((item) => {
  const searchMatch =
    item.title
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    item.description
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const typeMatch =
    type === "ALL" ||
    item.updateType === type;

  const statusMatch =
    activeTab === "ALL" ||
    item.publishStatus === activeTab;

  return searchMatch && typeMatch && statusMatch;
});


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F8F9FB] px-5 py-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[18px] font-semibold text-[#202938] text-left">
              Product Updates
            </h1>

            <p className="text-[11px] text-gray-500 mt-1">
              Create and manage product updates shown to SmartStay owners.
            </p>
          </div>

          <button
          onClick={() => navigate("/product-update-create/${adminDetails?.roleId}")}
            type="button"
            className="
              bg-[#2952F3]
              hover:bg-[#1E40D0]
              text-white
              px-4
              py-2
              rounded-lg
              text-[11px]
              font-medium
              cursor-pointer
              shadow-sm
            "
          >
            + Create Update
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-5">

          <SummaryCard
  title="Total Updates"
  value={summary.totalItems}
/>

<SummaryCard
  title="Published"
  value={summary.publishedCount}
/>

<SummaryCard
  title="Drafts"
  value={summary.draftCount}
/>

<SummaryCard
  title="Scheduled"
  value={summary.scheduledCount}
/>

        </div>

        {/* Main Card */}
       <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">

          {loading && (
    <div
      className="
        absolute inset-0
        bg-white/70
        backdrop-blur-[2px]
        z-[999]
        flex items-center justify-center
      "
    >
      <div className="flex flex-col items-center gap-3">

        <div
          className="
            w-12 h-12
            border-[4px]
            border-[#dbe2ff]
            border-t-[#2952F3]
            rounded-full
            animate-spin
          "
        />

        <p className="text-sm text-[#2952F3] font-medium">
          Loading Updates...
        </p>

      </div>
    </div>
  )}
          <div className="px-5 pt-4 border-b border-gray-100">

          <div className="flex items-center gap-7">

  <button
    type="button"
    onClick={() => setActiveTab("ALL")}
    className={`
      pb-3
      text-[10px]
      font-medium
      cursor-pointer
      border-b-2
      ${
        activeTab === "ALL"
          ? "text-[#2952F3] border-[#2952F3]"
          : "text-gray-500 border-transparent"
      }
    `}
  >
    All Updates

    {/* <span
      className={`
        ml-1.5
        px-1.5
        py-[1px]
        rounded-full
        text-[8px]
        ${
          activeTab === "ALL"
            ? "bg-[#EAF0FF] text-[#2952F3]"
            : "bg-gray-100 text-gray-400"
        }
      `}
    >
      {summary.totalItems}
    </span> */}
  </button>


  {publishStatusFilters.map((status) => {

    const count =
      status.key === "DRAFT"
        ? summary.draftCount
        : status.key === "SCHEDULED"
        ? summary.scheduledCount
        : status.key === "PUBLISHED"
        ? summary.publishedCount
        : updates.filter(
            (item) =>
              item.publishStatus === status.key
          ).length;

    const label =
      status.key === "DRAFT"
        ? "Drafts"
        : status.key === "SCHEDULED"
        ? "Scheduled"
        : status.key === "PUBLISHED"
        ? "Published"
        : status.key === "ARCHIVED"
        ? "Archived"
        : status.value;

    return (
      <button
        key={status.key}
        type="button"
        onClick={() => setActiveTab(status.key)}
        className={`
          pb-3
          text-[10px]
          font-medium
          cursor-pointer
          border-b-2
          ${
            activeTab === status.key
              ? "text-[#2952F3] border-[#2952F3]"
              : "text-gray-500 border-transparent"
          }
        `}
      >
        {label}

        {/* <span
          className={`
            ml-1.5
            px-1.5
            py-[1px]
            rounded-full
            text-[8px]
            ${
              activeTab === status.key
                ? "bg-[#EAF0FF] text-[#2952F3]"
                : "bg-gray-100 text-gray-400"
            }
          `}
        >
          {count}
        </span> */}
      </button>
    );
  })}

</div>
          </div>

          {/* Search / Filter */}
          <div className="px-5 py-4 flex items-center justify-between">

            <div className="flex gap-2">

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">
                  ⌕
                </span>

               <input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search updates..."
  className="
    w-[220px]
    h-8
    border border-gray-200
    rounded-md
    pl-8 pr-3
    text-[10px]
    outline-none
    focus:border-[#2952F3]
  "
/>
              </div>

              <select
  value={type}
  onChange={(e) => setType(e.target.value)}
  className="
    w-[120px]
    h-8
    border border-gray-200
    rounded-md
    px-2
    text-[10px]
    text-gray-600
    outline-none
    cursor-pointer
  "
>
  <option value="ALL">All Types</option>

  {typeFilters.map((item) => (
    <option
      key={item.key}
      value={item.key}
    >
      {item.value}
    </option>
  ))}
</select>

            </div>

            <span className="text-[9px] text-gray-400">
              {filteredUpdates.length} updates
            </span>

          </div>

       
    
<div className="w-full max-h-[400px] overflow-auto">

  <table className="w-full min-w-[1100px] table-fixed">

    <colgroup>
      <col className="w-[5%]" />
      <col className="w-[20%]" />
      <col className="w-[8%]" />
      <col className="w-[11%]" />
      <col className="w-[10%]" />
      <col className="w-[13%]" />
      <col className="w-[10%]" />
      <col className="w-[10%]" />
      <col className="w-[8%]" />
      <col className="w-[5%]" />
    </colgroup>

   

    <thead>
      <tr className="border-y border-gray-100">

      
        <th
          className="
            sticky
            left-0
            top-0
            z-30
            bg-[#FCFCFD]
            px-3
            py-2.5
            text-left
            text-[10px]
            font-medium
            text-gray-400
            uppercase
          "
        >
          ID
        </th>

       
        <th
          className="
            sticky
            top-0
            z-20
            bg-[#FCFCFD]
            px-3
            py-2.5
            text-left
            text-[10px]
            font-medium
            text-gray-400
            uppercase
          "
        >
          Update
        </th>

       
        <th
          className="
            sticky
            top-0
            z-20
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[10px]
            font-medium
            text-gray-400
            uppercase
          "
        >
          Version
        </th>

       
        <th
          className="
            sticky
            top-0
            z-20
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[10px]
            font-medium
            text-gray-400
            uppercase
          "
        >
          Type
        </th>

      
        <th
          className="
            sticky
            top-0
            z-20
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[10px]
            font-medium
            text-gray-400
            uppercase
          "
        >
          Platform
        </th>

       
        <th
          className="
            sticky
            top-0
            z-20
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[10px]
            font-medium
            text-gray-400
            uppercase
          "
        >
          Audience
        </th>

       
        <th
          className="
            sticky
            top-0
            z-20
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[10px]
            font-medium
            text-gray-400
            uppercase
          "
        >
          Status
        </th>

        
        <th
          className="
            sticky
            top-0
            z-20
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[10px]
            font-medium
            text-gray-400
            uppercase
            whitespace-nowrap
          "
        >
          Published Date
        </th>

        {/* CREATED BY */}
        <th
          className="
            sticky
            top-0
            z-20
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[10px]
            font-medium
            text-gray-400
            uppercase
          "
        >
          Created By
        </th>

   
        <th
          className="
            sticky
            right-0
            top-0
            z-30
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-center
            text-[10px]
            font-medium
            text-gray-400
            uppercase
          "
        >
          Actions
        </th>

      </tr>
    </thead>


   

    <tbody>

      {updates?.length > 0 ? (

        updates.map((item, index) => (

       <tr
  key={item.productUpdateId || index}
  onMouseEnter={() => setHoveredRow(index)}
  onMouseLeave={() => setHoveredRow(null)}
  className="border-b border-gray-100 transition text-[10px]"
  style={{
    backgroundColor:
      hoveredRow === index ? "#FAFBFF" : "white",
  }}
>

            

   <td
  className="
    sticky
    left-0
    z-20
    px-3
    py-3
    text-left
    text-gray-600
    whitespace-nowrap
  "
  style={{
    backgroundColor:
      hoveredRow === index ? "#FAFBFF" : "white",
  }}
>
  {(currentPage - 1) * pageSize + index + 1}
</td>


           

            <td className="px-3 py-3 text-left">

              <div
                className="truncate"
                title={item.title}
              >
                {item.title || "----"}
              </div>

            </td>


          

            <td className="px-2 py-3 text-left">

              {item.version || "----"}

            </td>


            {/* ================= TYPE ================= */}

            <td className="px-2 py-3 text-left">

              {(() => {

                const type = item.updateType;

                let badgeClass =
                  "bg-gray-100 text-gray-500";

                if (type === "NEW_FEATURE") {
                  badgeClass =
                    "bg-[#EEF3FF] text-[#2952F3]";
                }

                if (type === "BUG_FIX") {
                  badgeClass =
                    "bg-[#FFF0F0] text-[#F04444]";
                }

                if (type === "IMPROVEMENT") {
                  badgeClass =
                    "bg-[#F3EEFF] text-[#7C3AED]";
                }

                if (type === "IMPORTANT_UPDATE") {
                  badgeClass =
                    "bg-[#FFF5E6] text-[#D97706]";
                }

                const label =
                  type === "NEW_FEATURE"
                    ? "New Feature"
                    : type === "BUG_FIX"
                    ? "Bug Fix"
                    : type === "IMPROVEMENT"
                    ? "Improvement"
                    : type === "IMPORTANT_UPDATE"
                    ? "Important Update"
                    : type || "----";

                return (
                  <span
                    className={`
                      inline-flex
                      items-center
                      rounded-full
                      px-2
                      py-1
                      text-[8px]
                      font-medium
                      whitespace-nowrap
                      ${badgeClass}
                    `}
                  >
                    {label}
                  </span>
                );

              })()}

            </td>


            {/* ================= PLATFORM ================= */}

            <td className="px-2 py-3 text-left">

              {item.platform || "----"}

            </td>


            {/* ================= AUDIENCE ================= */}

            <td className="px-2 py-3 text-left">

              <div
                className="truncate"
                title={item.audience}
              >
                {item.audience || "----"}
              </div>

            </td>


            {/* ================= STATUS ================= */}

            <td className="px-2 py-3 text-left">

              {(() => {

                const status = item.publishStatus;

                let badgeClass =
                  "bg-gray-100 text-gray-500";

                if (status === "PUBLISHED") {
                  badgeClass =
                    "bg-[#E8F8F0] text-[#16A34A]";
                }

                if (status === "SCHEDULED") {
                  badgeClass =
                    "bg-[#FFF5E6] text-[#D97706]";
                }

                if (status === "DRAFT") {
                  badgeClass =
                    "bg-[#F1F3F5] text-[#6B7280]";
                }

                if (status === "ARCHIVED") {
                  badgeClass =
                    "bg-[#F3F4F6] text-[#6B7280]";
                }

                const label =
                  status === "PUBLISHED"
                    ? "Published"
                    : status === "SCHEDULED"
                    ? "Scheduled"
                    : status === "DRAFT"
                    ? "Draft"
                    : status === "ARCHIVED"
                    ? "Archived"
                    : status || "----";

                return (
                  <span
                    className={`
                      inline-flex
                      items-center
                      rounded-full
                      px-2
                      py-1
                      text-[8px]
                      font-medium
                      whitespace-nowrap
                      ${badgeClass}
                    `}
                  >
                    {label}
                  </span>
                );

              })()}

            </td>


            {/* ================= PUBLISHED DATE ================= */}

            <td
              className="
                px-2
                py-3
                text-left
                whitespace-nowrap
              "
            >
              {item.publishDate ||
                item.releaseDate ||
                "-"}
            </td>


            {/* ================= CREATED BY ================= */}

            <td className="px-2 py-3 text-left">

              <div
                className="truncate"
                title={item.createdBy}
              >
                {item.createdBy || "----"}
              </div>

            </td>


           

    <td
  className="
    sticky
    right-0
    z-20
    px-2
    py-3
    text-center
  "
  style={{
    backgroundColor:
      hoveredRow === index ? "#FAFBFF" : "white",
  }}
>
  <div className="flex items-center justify-center gap-2">
    ...
  </div>
</td>

          </tr>

        ))

      ) : (

        <tr>

          <td
            colSpan={10}
            className="
              px-4
              py-10
              text-center
              text-[10px]
              text-gray-400
            "
          >
            No data found
          </td>

        </tr>

      )}

    </tbody>

  </table>

</div>

<div
  className="
    flex
    items-center
    justify-between
    px-5
    py-4
    border-t
    border-gray-100
    bg-white
  "
>

  <div className="text-[12px] text-gray-700">
    Total Record Count :
    <span className="text-[#2952F3] ml-1 font-medium">
      {updates?.length}
    </span>
  </div>

  <div className="flex items-center gap-5">

    <select
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="
        w-[92px]
        h-10
        border
        border-gray-300
        rounded-lg
        px-3
        text-[12px]
        outline-none
        cursor-pointer
      "
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>

    <button
      type="button"
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage((prev) =>
          Math.max(prev - 1, 1)
        )
      }
      className="text-[20px]"
    >
      ‹
    </button>

    <div
      className="
        w-10
        h-10
        rounded-full
        bg-[#F5F7FB]
        flex
        items-center
        justify-center
        text-[12px]
      "
    >
      {currentPage}
    </div>

    <span className="text-[12px]">
     {currentPage} - {totalPages}
    </span>

    <button
      type="button"
      disabled={currentPage >= totalPages}
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, totalPages)
        )
      }
      className="text-[20px]"
    >
      ›
    </button>

  </div>

</div>
        </div>
      </div>
    </DashboardLayout>
  );
};


/* Summary Card */

const SummaryCard = ({
  title,
  value,
  icon,
  iconClass,
}) => {
  return (
    <div
      className="
        bg-white
        border border-gray-200
        rounded-xl
        px-4 py-4
        shadow-sm
      "
    >

      <div className="flex items-center justify-between">

        <p className="text-[9px] text-gray-500">
          {title}
        </p>

        <div
          className={`
            w-6 h-6
            rounded-md
            flex items-center justify-center
            text-[10px]
            ${iconClass}
          `}
        >
          {icon}
        </div>

      </div>

      <p className="text-[20px] font-semibold text-gray-800 mt-3">
        {value}
      </p>

    </div>
  );
};

export default ProductUpdate;