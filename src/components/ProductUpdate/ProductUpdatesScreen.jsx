import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../Context/RoleContext";
import { usePlan } from "../../Context/PlanContexts";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Circle from "../../assets/menucircle.png";
import Eye from "../../assets/eye.png";
import Edit from "../../assets/editIcon.png";
import Search from "../../assets/Search.png";
import { Trash2 } from "lucide-react";

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
  const [openActionId, setOpenActionId] = useState(null);
  const [actionMenuPosition, setActionMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showViewDrawer, setShowViewDrawer] = useState(false);
  const [viewProductUpdate, setViewProductUpdate] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const navigate = useNavigate();

  const { adminDetails } = useRole();
  const { getProductUpdates, archiveProductUpdate, getProductUpdateById, deleteProductUpdate } = usePlan();

  useEffect(() => {
    fetchProductUpdates();
  }, [search, type, activeTab, currentPage, pageSize]);

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

  const handleViewProductUpdate = async (productUpdateId) => {
    if (!productUpdateId) return;

    try {
      setViewLoading(true);
      setShowViewDrawer(true);
      setViewProductUpdate(null);

      const result = await getProductUpdateById(productUpdateId);

      console.log("GET PRODUCT UPDATE BY ID RESPONSE:", result);

      if (result?.success) {
        setViewProductUpdate(result?.data);
      } else {
        setShowViewDrawer(false);
        setModalType("error");
        setMessage(result?.message || "Failed to fetch product update details");
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Get Product Update By Id Error:", error);

      setShowViewDrawer(false);
      setModalType("error");
      setMessage("Failed to fetch product update details");
      setShowSuccess(true);
    } finally {
      setViewLoading(false);
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
  const handleArchive = async (productUpdateId) => {
    if (!productUpdateId) return;

    try {
      setArchiveLoading(true);

      const result = await archiveProductUpdate(productUpdateId);

      if (result.success) {

        setModalType("success");
        setMessage(result?.data);
        setShowSuccess(true);


        setTimeout(() => {
          setShowSuccess(false);
        }, 1200);
        setShowArchiveModal(false);
        setSelectedUpdate(null);


        fetchProductUpdates();


      } else {
        setModalType("error");
        setMessage(result?.message);
        setShowSuccess(true);


        setTimeout(() => {
          setShowSuccess(false);
        }, 1200);

      }

    } catch (error) {
      toast.error("Failed to archive product update");
    } finally {
      setArchiveLoading(false);
    }
  };
  const handleDelete = async (productUpdateId) => {
    if (!productUpdateId) return;

    try {
      setDeleteLoading(true);

      const result = await deleteProductUpdate(productUpdateId);

      if (result?.success) {
        setShowDeleteModal(false);
        setSelectedUpdate(null);

        setModalType("success");
        setMessage(
          result?.message || "Product update deleted successfully"
        );
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 1200);


        fetchProductUpdates();

      } else {
        setModalType("error");
        setMessage(
          result?.message || "Failed to delete product update"
        );
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 1200);
      }

    } catch (error) {
      console.error("Delete Product Update Error:", error);

      setModalType("error");
      setMessage("Failed to delete product update");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1200);

    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType} />
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
            onClick={() =>
              navigate(`/product-update-create/${adminDetails?.roleId}`)
            }
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

          {/* <SummaryCard
  title="Published"
  value={summary.publishedCount}
/> */}
          <SummaryCard
            title="Published"
            value={summary.publishedCount}
            active={activeTab === "PUBLISHED"}
            onClick={() => {
              setActiveTab("PUBLISHED");
              setCurrentPage(1);
            }}
          />

          <SummaryCard
            title="Drafts"
            value={summary.draftCount}
            active={activeTab === "DRAFT"}
            onClick={() => {
              setActiveTab("DRAFT");
              setCurrentPage(1);
            }}
          />

          <SummaryCard
            title="Scheduled"
            value={summary.scheduledCount}
            active={activeTab === "SCHEDULED"}
            onClick={() => {
              setActiveTab("SCHEDULED");
              setCurrentPage(1);
            }}
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
      text-[13px]
      font-medium
      cursor-pointer
      border-b-2
      ${activeTab === "ALL"
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
          text-[13px]
          font-medium
          cursor-pointer
          border-b-2
          ${activeTab === status.key
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
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]">
                  <img src={Search} className="w-3 h-3" />
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
    text-[12px]
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
    text-[12px]
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

            <span className="text-[13px] text-gray-400">
              {filteredUpdates.length} updates
            </span>

          </div>



          <div className="w-full max-h-[400px] overflow-auto relative bg-white">

            <table className="w-full min-w-[1100px] table-fixed">

              <colgroup>
                <col className="w-[5%]" />
                <col className="w-[10%]" />
                <col className="w-[8%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[13%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[9%]" />
                <col className="w-[11%]" />
              </colgroup>



              <thead className="relative z-[100]">
                <tr className="border-y border-gray-100">


                  <th
                    className="
            sticky
            left-0
            top-0
            z-40
            bg-[#FCFCFD]
            px-3
            py-2.5
            text-left
            text-[12px]
            font-medium
            text-gray-400
            uppercase
            shadow-[2px_0_4px_rgba(0,0,0,0.03)]
          "
                  >
                    ID
                  </th>

                  {/* UPDATE */}
                  <th
                    className="
            sticky
            top-0
            z-30
            bg-[#FCFCFD]
            px-3
            py-2.5
            text-left
            text-[12px]
            font-medium
            text-gray-400
            uppercase
          "
                  >
                    Update
                  </th>

                  {/* VERSION */}
                  <th
                    className="
            sticky
            top-0
            z-30
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[12px]
            font-medium
            text-gray-400
            uppercase
          "
                  >
                    Version
                  </th>

                  {/* TYPE */}
                  <th
                    className="
            sticky
            top-0
            z-30
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[12px]
            font-medium
            text-gray-400
            uppercase
          "
                  >
                    Type
                  </th>

                  {/* PLATFORM */}
                  <th
                    className="
            sticky
            top-0
            z-30
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[12px]
            font-medium
            text-gray-400
            uppercase
          "
                  >
                    Platform
                  </th>

                  {/* AUDIENCE */}
                  <th
                    className="
            sticky
            top-0
            z-30
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[12px]
            font-medium
            text-gray-400
            uppercase
          "
                  >
                    Audience
                  </th>

                  {/* STATUS */}
                  <th
                    className="
            sticky
            top-0
            z-30
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[12px]
            font-medium
            text-gray-400
            uppercase
          "
                  >
                    Status
                  </th>

                  {/* PUBLISHED DATE */}
                  <th
                    className="
            sticky
            top-0
            z-30
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[12px]
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
            z-30
            bg-[#FCFCFD]
            px-2
            py-2.5
            text-left
            text-[12px]
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
    z-[110]
    w-[120px]
    min-w-[120px]
    bg-[#FCFCFD]
    px-3
    py-2.5
    text-center
    text-[12px]
    font-medium
    text-gray-400
    uppercase
    whitespace-nowrap
    shadow-[-2px_0_4px_rgba(0,0,0,0.05)]
  "
                  >
                    Actions
                  </th>

                </tr>
              </thead>



              <tbody>

                {updates?.length > 0 ? (

                  updates.map((item, index) => {

                    const isHovered = hoveredRow === index;

                    return (
                      <tr
                        key={item.productUpdateId || index}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className="
                border-b
                border-gray-100
                transition
                text-[12px]
              "
                        style={{
                          backgroundColor: isHovered
                            ? "#FAFBFF"
                            : "#FFFFFF",
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
                  shadow-[2px_0_4px_rgba(0,0,0,0.03)]
                "
                          style={{
                            backgroundColor: isHovered
                              ? "#FAFBFF"
                              : "#FFFFFF",
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
                        text-[10px]
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



                        <td className="px-2 py-3 text-left">
                          {item.platform || "----"}
                        </td>



                        <td className="px-2 py-3 text-left">

                          <div
                            className="truncate"
                            title={item.audience}
                          >
                            {item.audience || "----"}
                          </div>

                        </td>



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
                        text-[10px]
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



                        <td
                          className="
                  px-2
                  py-3
                  text-left
                  whitespace-nowrap
                "
                        >
                          {item.publishDate || "N/A"}
                        </td>



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
    z-[50]
    w-[120px]
    min-w-[120px]
    px-3
    py-3
    text-center
    whitespace-nowrap
    shadow-[-2px_0_4px_rgba(0,0,0,0.05)]
  "
                          style={{
                            backgroundColor: isHovered
                              ? "#FAFBFF"
                              : "#FFFFFF",
                          }}
                        >
                          <div className="flex items-center justify-center gap-1">


                            <button
                              onClick={() => handleViewProductUpdate(item.productUpdateId)}
                              type="button"
                              title="View"
                              className="
        w-7 h-7
        shrink-0
        flex items-center justify-center
        rounded-md
        text-gray-500
        hover:bg-gray-100
        hover:text-gray-700
        transition
        cursor-pointer
      "
                            >
                              <img
                                src={Eye}
                                alt="View"
                                className="w-4 h-4 object-contain"
                              />
                            </button>


                            <button
                              type="button"
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  `/product-update-create/${adminDetails?.roleId}`,
                                  {
                                    state: {
                                      mode: "edit",
                                      productUpdateId: item.productUpdateId,
                                    },
                                  }
                                )
                              }
                              className="
    w-7 h-7
    shrink-0
    flex items-center justify-center
    rounded-md
    text-gray-500
    hover:bg-gray-100
    hover:text-gray-700
    transition
    cursor-pointer
  "
                            >
                              <img
                                src={Edit}
                                alt="Edit"
                                className="w-4 h-4 object-contain"
                              />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => {
                                setSelectedUpdate(item);
                                setShowDeleteModal(true);
                                setOpenActionId(null);
                              }}
                              className="
    w-7 h-7
    shrink-0
    flex items-center justify-center
    rounded-md
    text-red-500
    hover:bg-red-50
    hover:text-red-600
    transition
    cursor-pointer
  "
                            >
                              <Trash2
                                size={16}
                                strokeWidth={1.8}
                              />
                            </button>
                            {/* MORE */}
                            <button
                              type="button"
                              title="More"
                              onClick={(e) => {

                                const rect =
                                  e.currentTarget.getBoundingClientRect();

                                const menuWidth = 120;
                                const menuHeight = 40;

                                let top = rect.bottom + 4;
                                let left = rect.right - menuWidth;

                                if (
                                  top + menuHeight >
                                  window.innerHeight
                                ) {
                                  top =
                                    rect.top -
                                    menuHeight -
                                    4;
                                }

                                if (left < 8) {
                                  left = 8;
                                }

                                if (
                                  left + menuWidth >
                                  window.innerWidth - 8
                                ) {
                                  left =
                                    window.innerWidth -
                                    menuWidth -
                                    8;
                                }

                                setActionMenuPosition({
                                  top,
                                  left,
                                });

                                setOpenActionId(
                                  openActionId === item.productUpdateId
                                    ? null
                                    : item.productUpdateId
                                );
                              }}
                              className="
        w-7 h-7
        shrink-0
        flex items-center justify-center
        rounded-md
        text-gray-500
        hover:bg-gray-100
        hover:text-gray-700
        transition
        cursor-pointer
      "
                            >
                              <img
                                src={Circle}
                                alt="More"
                                className="w-4 h-4 object-contain"
                              />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );

                  })

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




            {openActionId && (
              <>

                <div
                  className="fixed inset-0 z-[90]"
                  onClick={() => setOpenActionId(null)}
                />

                <div
                  className="
          fixed
          z-[9999]
          w-[120px]
          bg-white
          border
          border-gray-200
          rounded-md
          shadow-lg
          overflow-hidden
        "
                  style={{
                    top: `${actionMenuPosition.top}px`,
                    left: `${actionMenuPosition.left}px`,
                  }}
                >

                  {updates
                    .filter(
                      (item) =>
                        item.productUpdateId ===
                        openActionId
                    )
                    .map((item) => (

                      <React.Fragment
                        key={item.productUpdateId}
                      >

                        {item.canArchive === true && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUpdate(item);
                              setShowArchiveModal(true);
                              setOpenActionId(null);
                            }}
                            className="
                    w-full
                    px-3
                    py-2
                    text-left
                    text-[10px]
                    text-gray-700
                    hover:bg-gray-50
                    hover:text-red-600
                    transition
                    cursor-pointer
                  "
                          >
                            Archive
                          </button>
                        )}

                      </React.Fragment>

                    ))}

                </div>

              </>
            )}

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

            <div className="text-[13px] text-gray-700">
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
      {showArchiveModal && (
        <div
          className="
      fixed inset-0
      z-[9999]
      bg-black/40
      flex
      items-center
      justify-center
      p-4
    "
        >

          <div
            className="
        w-[380px]
        max-w-full
        bg-white
        rounded-xl
        shadow-xl
        overflow-hidden
      "
          >

            {/* HEADER */}
            <div
              className="
          px-5 py-4
          border-b
          border-gray-100
        "
            >
              <h3 className="text-[13px] font-semibold text-gray-800">
                Archive Product Update
              </h3>
            </div>


            {/* CONTENT */}
            <div className="px-5 py-5">

              <p className="text-[11px] text-gray-500 leading-5">
                Are you sure you want to archive this product update?
              </p>

              {selectedUpdate?.title && (
                <p className="mt-2 text-[11px] font-medium text-gray-700 truncate">
                  "{selectedUpdate.title}"
                </p>
              )}

            </div>


            {/* FOOTER */}
            <div
              className="
          px-5 py-3
          border-t
          border-gray-100
          flex
          justify-end
          gap-2
        "
            >

              {/* CANCEL */}
              <button
                type="button"
                disabled={archiveLoading}
                onClick={() => {
                  setShowArchiveModal(false);
                  setSelectedUpdate(null);
                }}
                className="
            px-4 py-2
            rounded-md
            border
            border-gray-200
            text-[10px]
            text-gray-600
            hover:bg-gray-50
            disabled:opacity-50
          "
              >
                Cancel
              </button>


              {/* ARCHIVE */}
              <button
                type="button"
                disabled={archiveLoading}
                onClick={() =>
                  handleArchive(selectedUpdate?.productUpdateId)
                }
                className="
            px-4 py-2
            rounded-md
            bg-red-500
            text-white
            text-[10px]
            hover:bg-red-600
            disabled:opacity-50
            flex
            items-center
            gap-2
          "
              >

                {archiveLoading && (
                  <span
                    className="
                w-3 h-3
                border-2
                border-white/40
                border-t-white
                rounded-full
                animate-spin
              "
                  />
                )}

                {archiveLoading ? "Archiving..." : "Archive"}

              </button>

            </div>

          </div>

        </div>
      )}
      {showDeleteModal && (
        <div
          className="
      fixed inset-0
      z-[9999]
      bg-black/40
      flex
      items-center
      justify-center
      p-4
    "
          onMouseDown={() => {
            if (!deleteLoading) {
              setShowDeleteModal(false);
              setSelectedUpdate(null);
            }
          }}
        >
          <div
            className="
        w-[380px]
        max-w-full
        bg-white
        rounded-xl
        shadow-xl
        overflow-hidden
      "
            onMouseDown={(e) => e.stopPropagation()}
          >

            {/* HEADER */}
            <div
              className="
          px-5 py-4
          border-b
          border-gray-100
        "
            >
              <div className="flex items-center gap-2">

                <div
                  className="
              w-7 h-7
              rounded-md
              bg-red-50
              flex items-center justify-center
            "
                >
                  <Trash2
                    size={15}
                    className="text-red-500"
                  />
                </div>

                <h3 className="text-[13px] font-semibold text-gray-800">
                  Delete Product Update
                </h3>

              </div>
            </div>


            {/* CONTENT */}
            <div className="px-5 py-5">

              <p className="text-[11px] text-gray-500 leading-5">
                Are you sure you want to delete this product update?
              </p>

              {selectedUpdate?.title && (
                <p className="mt-2 text-[11px] font-medium text-gray-700 truncate">
                  "{selectedUpdate.title}"
                </p>
              )}

              <p className="mt-2 text-[10px] text-red-500">
                This action cannot be undone.
              </p>

            </div>


            {/* FOOTER */}
            <div
              className="
          px-5 py-3
          border-t
          border-gray-100
          flex
          justify-end
          gap-2
        "
            >

              {/* CANCEL */}
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUpdate(null);
                }}
                className="
            px-4 py-2
            rounded-md
            border
            border-gray-200
            text-[10px]
            text-gray-600
            hover:bg-gray-50
            disabled:opacity-50
          "
              >
                Cancel
              </button>


              {/* DELETE */}
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() =>
                  handleDelete(selectedUpdate?.productUpdateId)
                }
                className="
            px-4 py-2
            rounded-md
            bg-red-500
            text-white
            text-[10px]
            hover:bg-red-600
            disabled:opacity-50
            flex
            items-center
            gap-2
          "
              >

                {deleteLoading && (
                  <span
                    className="
                w-3 h-3
                border-2
                border-white/40
                border-t-white
                rounded-full
                animate-spin
              "
                  />
                )}

                {deleteLoading ? "Deleting..." : "Delete"}

              </button>

            </div>

          </div>
        </div>
      )}
      {showViewDrawer && (
        <>

          <div
            className="fixed inset-0 z-[9998] bg-black/30"
            onClick={() => {
              if (!viewLoading) {
                setShowViewDrawer(false);
                setViewProductUpdate(null);
              }
            }}
          />


          <div
            className="
    fixed
    top-4
    right-4
    bottom-4
    z-[9999]
    w-[520px]
    max-w-[90vw]
    bg-white
    rounded-xl
    shadow-2xl
    flex
    flex-col
    overflow-hidden
  "
          >

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-[15px] font-semibold text-gray-800">
                  Product Update Details
                </h2>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowViewDrawer(false);
                  setViewProductUpdate(null);
                }}
                className="
            w-7 h-7
            rounded-md
            flex items-center justify-center
            text-gray-500
            hover:bg-gray-100
            cursor-pointer
          "
              >
                ✕
              </button>
            </div>


            <div className="flex-1 overflow-y-auto px-5 py-5">

              {viewLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-3">
                  <div
                    className="
                w-10 h-10
                border-[3px]
                border-[#dbe2ff]
                border-t-[#2952F3]
                rounded-full
                animate-spin
              "
                  />

                  <p className="text-[12px] text-[#2952F3]">
                    Loading details...
                  </p>
                </div>
              ) : viewProductUpdate ? (
                <div className="space-y-5">


                  <div>
                    <h3 className="text-[12px] font-semibold text-gray-800 mb-3 text-left">
                      Basic Details
                    </h3>

                    <div className="grid grid-cols-2 gap-3">

                      <DetailItem
                        label="Title"
                        value={viewProductUpdate.title}
                      />

                      <DetailItem
                        label="Version"
                        value={viewProductUpdate.version}
                      />

                      <DetailItem
                        label="Update Type"
                        value={viewProductUpdate.updateType}
                      />

                      <DetailItem
                        label="Platform"
                        value={viewProductUpdate.platform}
                      />

                      <DetailItem
                        label="Audience"
                        value={viewProductUpdate.audience}
                      />

                      <DetailItem
                        label="Publish Status"
                        value={viewProductUpdate.publishStatus}
                      />

                      <DetailItem
                        label="Release Date"
                        value={viewProductUpdate.releaseDate}
                      />

                      <DetailItem
                        label="Publish Date"
                        value={viewProductUpdate.publishDate}
                      />

                      <DetailItem
                        label="Publish Time"
                        value={viewProductUpdate.publishTime}
                      />

                      <DetailItem
                        label="Expiry Date"
                        value={viewProductUpdate.expiryDate}
                      />

                    </div>
                  </div>


                  <div>
                    <h3 className="text-[12px] font-semibold text-gray-800 mb-2 text-left">
                      Description
                    </h3>

                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-[11px] text-gray-600 leading-5 whitespace-pre-wrap">
                        {viewProductUpdate.description || "----"}
                      </p>
                    </div>
                  </div>


                  {/* Audience */}
                  <div>
                    <h3 className="text-[12px] font-semibold text-gray-800 mb-3 text-left">
                      Audience
                    </h3>

                    <div className="border border-gray-100 rounded-lg px-3 py-3 bg-[#FCFCFD]">


                      <div className="mb-3">
                        <p className="text-[13px]  mb-1 text-left">
                          Audience Type : {viewProductUpdate.audience || "----"}
                        </p>

                        {/* <p className="text-[11px] font-medium text-gray-700">
        {viewProductUpdate.audience || "----"}
      </p> */}
                      </div>

                      {/* Hostels */}
                      {viewProductUpdate.audiences?.hostelAudiences?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[9px] text-gray-400 mb-2">
                            Hostels
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {viewProductUpdate.audiences.hostelAudiences.map(
                              (hostel, index) => (
                                <span
                                  key={hostel.hostelId || index}
                                  className="
                  px-2.5
                  py-1.5
                  rounded-md
                  bg-[#EEF3FF]
                  text-[#2952F3]
                  text-[10px]
                  font-medium
                "
                                >
                                  {hostel.hostelName || "----"}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Plans */}
                      {viewProductUpdate.audiences?.planAudiences?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[12px] text-gray-400 mb-2 text-left">
                            Plans
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {viewProductUpdate.audiences.planAudiences.map(
                              (plan, index) => (
                                <span
                                  key={plan.planId || index}
                                  className="
                  px-2.5
                  py-1.5
                  rounded-md
                  bg-[#EEF3FF]
                  text-[#2952F3]
                  text-[10px]
                  font-medium
                "
                                >
                                  {plan.planName || "----"}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Owners */}
                      {viewProductUpdate.audiences?.ownerAudiences?.length > 0 && (
                        <div>
                          <p className="text-[9px] text-gray-400 mb-2">
                            Owners
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {viewProductUpdate.audiences.ownerAudiences.map(
                              (owner, index) => (
                                <span
                                  key={owner.ownerId || index}
                                  className="
                  px-2.5
                  py-1.5
                  rounded-md
                  bg-[#EEF3FF]
                  text-[#2952F3]
                  text-[10px]
                  font-medium
                "
                                >
                                  {owner.ownerName || "----"}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Product Update Items */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[12px] font-semibold text-gray-800">
                        Update Items
                      </h3>

                      <span className="text-[10px] text-gray-400">
                        {viewProductUpdate.productUpdateItems?.length || 0} items
                      </span>
                    </div>

                    <div className="space-y-4">

                      {viewProductUpdate.productUpdateItems?.length > 0 ? (
                        viewProductUpdate.productUpdateItems.map((item, index) => (
                          <div
                            key={item.productUpdateItemId || index}
                            className="border border-gray-200 rounded-xl p-4"
                          >

                            <div className="flex items-start justify-between gap-3">

                              <div>
                                <p className="text-[12px] font-semibold text-gray-800">
                                  {item.title || "----"}
                                </p>

                                <p className="text-[10px] text-gray-400 mt-1">
                                  Item #{index + 1}
                                </p>
                              </div>

                              <span className="px-2 py-1 rounded-full bg-[#EEF3FF] text-[#2952F3] text-[9px] font-medium">
                                {item.updateType || "----"}
                              </span>

                            </div>

                            {/* Item details */}
                            <div className="grid grid-cols-2 gap-3 mt-4">

                              <DetailItem
                                label="Module"
                                value={item.module}
                              />

                              <DetailItem
                                label="CTA"
                                value={item.cta}
                              />

                              <DetailItem
                                label="CTA Link"
                                value={item.ctaLink}
                              />

                              <DetailItem
                                label="Show CTA Button"
                                value={item.showCtaButton ? "Yes" : "No"}
                              />

                            </div>

                            {/* Item Description */}
                            <div className="mt-4">
                              <p className="text-[9px] font-medium text-gray-400 mb-1">
                                Description
                              </p>

                              <p className="text-[11px] text-gray-600 leading-5 whitespace-pre-wrap">
                                {item.description || "----"}
                              </p>
                            </div>

                            {/* Images */}
                            {item.itemImages?.length > 0 && (
                              <div className="mt-4">
                                <p className="text-[9px] font-medium text-gray-400 mb-2">
                                  Images
                                </p>

                                <div className="grid grid-cols-3 gap-2">
                                  {item.itemImages.map((image, imageIndex) => (
                                    <div
                                      key={imageIndex}
                                      className="
                                  h-[100px]
                                  rounded-lg
                                  border
                                  border-gray-200
                                  overflow-hidden
                                  bg-gray-50
                                "
                                    >
                                      <img
                                        src={image}
                                        alt={`Product update ${imageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        ))
                      ) : (
                        <div className="border border-dashed border-gray-200 rounded-lg p-5 text-center">
                          <p className="text-[10px] text-gray-400">
                            No update items found
                          </p>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[11px] text-gray-400">
                    No details found
                  </p>
                </div>
              )}

            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};


const DetailItem = ({ label, value }) => {
  return (
    <div className="border border-gray-100 rounded-lg px-3 py-2.5 bg-[#FCFCFD]">
      <p className="text-[9px] text-gray-400 mb-1">
        {label}
      </p>

      <p
        className="text-[11px] font-medium text-gray-700 truncate"
        title={value || ""}
      >
        {value || "----"}
      </p>
    </div>
  );
};

const SummaryCard = ({
  title,
  value,
  icon,
  iconClass,
  active = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
    rounded-xl
    px-4 py-4
    shadow-sm
    border
    transition-all
    duration-200
    ${active
          ? "border-[#2952F3] bg-[#F5F8FF] shadow-md"
          : "border-gray-200 bg-white"
        }
    ${onClick ? "cursor-pointer" : ""}
  `}
    >

      <div className="flex items-center justify-between">

        <p className="text-[9px] text-gray-500 text-[13px]">
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