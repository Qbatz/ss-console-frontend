import React, { useEffect, useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useArchive } from "../../Context/DataArchiveContext";
import Toast from "../SuccessModal/ToastDesign";


const DataArchive = () => {
  const {
    loading,
    accessError,
    getDataArchive, RestoreArchive, getDataArchiveById
  } = useArchive();

  const [archiveList, setArchiveList] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [selectedArchiveId, setSelectedArchiveId] = useState(null);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [showArchiveDrawer, setShowArchiveDrawer] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState(null);

  const fetchDataArchive = async (
    currentPage = 1,
    currentSize = size
  ) => {
    const result = await getDataArchive(
      currentPage,
      currentSize
    );

    if (result?.success) {
      const data = result?.data;

      setArchiveList(data?.dataArchives || []);
      setTotalItems(data?.totalItems || 0);
      setTotalPages(data?.totalPages || 1);
      setPage(data?.currentPage || currentPage);
    } else {
      setArchiveList([]);
      setTotalItems(0);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchDataArchive(1);
  }, []);
  const handleRestore = async () => {
    if (!selectedArchiveId) return;

    setRestoreLoading(true);

    const result = await RestoreArchive(selectedArchiveId);

    console.log("Result", result);


    if (result?.success) {


      setShowSuccess(true);
      setModalType("success");
      setMessage("Data restored successfull")



      setRestoreLoading(false);
      // GET refresh later
      // setTimeout(() => {
      await fetchDataArchive(page, size);
      // }, 300);

      setTimeout(() => {
        setShowRestoreConfirm(false);
        setSelectedArchiveId(null);
        setShowSuccess(false);

      }, 1000);

    } else {
      setRestoreLoading(false);

      setModalType("error");
      setMessage(result?.message || "Restore failed");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }
  };
  const handleViewArchive = async (archiveId) => {
    setShowArchiveDrawer(true);
    setSelectedArchive(null);

    const result = await getDataArchiveById(archiveId);

    if (result?.success) {
      setSelectedArchive(result.data);
    }
  };
  return (
    <DashboardLayout>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div className="p-5 bg-[#F8F9FB] min-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[18px] font-semibold text-[#222]">
              Data Archive
            </h1>

            <p className="text-[11px] text-[#777] mt-1">
              Manage archived data
            </p>
          </div>


        </div>



        <div className="
  bg-white
  rounded-[10px]
  border
  border-[#E1E4EA]
  overflow-hidden
">
          {loading && (
            <div
              className="
        absolute
        inset-0
        bg-white/70
        backdrop-blur-[2px]
        z-[999]
        flex
        items-center
        justify-center
      "
            >
              <div className="flex flex-col items-center gap-3">

                <div
                  className="
            w-12
            h-12
            border-[4px]
            border-[#dbe2ff]
            border-t-[#2952F3]
            rounded-full
            animate-spin
          "
                />

                <p className="text-sm text-[#2952F3] font-medium">
                  Loading Archives...
                </p>

              </div>
            </div>
          )}
          <div className="overflow-auto max-h-[320px]">

            <table className="w-full min-w-[1600px] border-collapse table-fixed">

              <colgroup>
                <col className="w-[80px]" />
                <col className="w-[150px]" />
                <col className="w-[170px]" />
                <col className="w-[100px]" />
                <col className="w-[120px]" />
                <col className="w-[120px]" />
                <col className="w-[90px]" />
                <col className="w-[100px]" />
                <col className="w-[110px]" />
                <col className="w-[110px]" />
                <col className="w-[120px]" />
                <col className="w-[130px]" />
                <col className="w-[130px]" />
                <col className="w-[100px]" />
              </colgroup>

              <thead className="sticky top-0 z-30">
                <tr className="
    bg-[#F7F8FC]
    border-b
    border-[#E5E7EB]
  ">

                  <th
                    className="
    sticky left-0 z-20
    w-[80px]
    px-4 py-3
    text-left
    text-[11px]
    font-semibold
    text-[#596579]
    bg-[#F7F8FC]
  "
                  >
                    ID
                  </th>

                  <th
                    className="
    sticky left-[80px] z-20
    w-[150px]
    px-4 py-3
    text-left
    text-[11px]
    font-semibold
    text-[#596579]
    bg-[#F7F8FC]
  "
                  >
                    Table Name
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#596579]">
                    Type
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#596579]">
                    Source
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#596579]">
                    Criteria
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#596579]">
                    Cut Off Date
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#596579]">
                    Row Count
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#596579]">
                    File Format
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#596579]">
                    Compression
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#596579]">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#596579]">
                    Created By
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#596579]">
                    Created At
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#596579]">
                    Restored By
                  </th>

                  <th
                    className="
    sticky right-0 z-20
    w-[100px]
    px-4 py-3
    text-left
    text-[11px]
    font-semibold
    text-[#596579]
    bg-[#F7F8FC]
  "
                  >
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>
                {archiveList.map((item) => (
                  <tr
                    key={item.archiveId}
                    className="
    group
    border-b
    border-[#EEF0F3]
    hover:bg-[#FAFBFF]
  "
                  >

                    <td
                      className="
    sticky left-0 z-10
    w-[80px]
    px-4 py-4
    text-[11px]
    text-[#333]
    text-left
    bg-white
    group-hover:bg-[#FAFBFF]
  "
                    >
                      {item.archiveId}
                    </td>

                    <td
                      className="
    sticky left-[80px] z-10
    w-[150px]
    px-4 py-4
    text-left
    bg-white
    group-hover:bg-[#FAFBFF]
  "
                    >
                      <div
                        className="text-[11px] text-[#333] truncate"
                        title={item.tableName}
                      >
                        {item.tableName || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-left">
                      <div
                        className="text-[11px] text-[#333] truncate"
                        title={item.type}
                      >
                        {item.type || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-[11px] text-[#333] text-left">
                      {item.source || "-"}
                    </td>

                    <td className="px-4 py-4 text-[11px] text-[#333] text-left">
                      {item.criteria || "-"}
                    </td>

                    <td className="px-4 py-4 text-[11px] text-[#333] text-left">
                      {item.cutOffDate || "-"}
                    </td>

                    <td className="px-4 py-4 text-[11px] text-[#333] text-left">
                      {item.rowCount ?? 0}
                    </td>

                    <td className="px-4 py-4 text-[11px] text-[#333] text-left">
                      {item.fileFormat || "-"}
                    </td>

                    <td className="px-4 py-4 text-[11px] text-[#333] text-left">
                      {item.compression || "-"}
                    </td>

                    <td className="px-4 py-4 text-left">
                      <span className="
          inline-flex
          items-center
          px-2.5
          py-1
          rounded-full
          bg-[#E9F8F0]
          text-[#159447]
          text-[9px]
          font-medium
        ">
                        {item.status || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-left">
                      <div
                        className="text-[11px] text-[#333] truncate"
                        title={item.createdBy}
                      >
                        {item.createdBy || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-left">
                      <div className="text-[11px] text-[#333]">
                        {item.createdAtDate || "-"}
                      </div>

                      <div className="text-[9px] text-[#999] mt-0.5">
                        {item.createdAtTime || ""}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-left">
                      <div
                        className="text-[11px] text-[#333] truncate"
                        title={item.restoredBy}
                      >
                        {item.restoredBy || "-"}
                      </div>
                    </td>

                    <td
                      className="
    sticky right-0 z-10
    w-[100px]
    px-4 py-4
    text-left
    bg-white
    group-hover:bg-[#FAFBFF]
  "
                    >
                      <div className="flex items-center gap-2">

                        {/* Add Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedArchiveId(item.archiveId);
                            setShowRestoreConfirm(true);
                          }}
                          className="
    w-[24px]
    h-[24px]
    rounded-[5px]
    bg-[#2952F3]
    text-white
    flex
    items-center
    justify-center
    text-[12px]
    leading-none
    hover:bg-[#1F45D8]
    cursor-pointer
  "
                          title="Restore"
                        >
                          +
                        </button>

                        <button
                          type="button"
                          onClick={() => handleViewArchive(item.archiveId)}
                          className="text-[#2952F3] text-[12px] hover:underline cursor-pointer"
                        >
                          View
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="flex items-center justify-between px-6 py-3">


            <div className="text-[14px] text-[#222]">
              Total Record Count :{" "}
              <span className="text-[#2952F3] font-medium">
                {archiveList?.length}
              </span>
            </div>

            <div className="flex items-center gap-5">


              <select
                value={size}
                onChange={(e) => {
                  const newSize = Number(e.target.value);

                  setSize(newSize);
                  setPage(1);

                  fetchDataArchive(1, newSize);
                }}
                className="
        h-[40px]
        min-w-[92px]
        px-3
        rounded-[8px]
        border
        border-gray-300
        bg-white
        text-[14px]
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
                disabled={page <= 1 || loading}
                onClick={() => {
                  const newPage = page - 1;
                  setPage(newPage);
                  fetchDataArchive(newPage, size);
                }}
                className="
        text-[22px]
        text-[#C8D0DC]
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
              >
                ‹
              </button>


              <div className="
      w-[48px]
      h-[44px]
      rounded-[12px]
      bg-[#F3F5FA]
      border
      border-[#E3E7EF]
      flex
      items-center
      justify-center
      text-[14px]
      text-[#222]
    ">
                {page}
              </div>


              <span className="text-[14px] text-[#222]">

                {page} - {totalPages}
              </span>


              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => {
                  const newPage = page + 1;
                  setPage(newPage);
                  fetchDataArchive(newPage, size);
                }}
                className="
        text-[22px]
        text-[#222]
        disabled:opacity-40
        disabled:cursor-not-allowed
      "
              >
                ›
              </button>

            </div>
          </div>
        </div>
      </div>
      {showRestoreConfirm && (
        <div
          className="fixed inset-0 z-[2000] bg-black/40 flex items-center justify-center"
          onClick={() => {
            if (!restoreLoading) {
              setShowRestoreConfirm(false);
              setSelectedArchiveId(null);
            }
          }}
        >
          <div
            className="bg-white w-[380px] rounded-xl shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[16px] font-semibold text-[#222]">
              Restore Archive
            </h2>

            <p className="text-[13px] text-[#666] mt-3 leading-5">
              Are you sure you want to restore this archived data?
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                disabled={restoreLoading}
                onClick={() => {
                  setShowRestoreConfirm(false);
                  setSelectedArchiveId(null);
                }}
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
                disabled={restoreLoading}
                onClick={handleRestore}
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
                {restoreLoading ? "Restoring..." : "Confirm"}
              </button>

            </div>
          </div>
        </div>
      )}
      {showArchiveDrawer && (
        <div
          className="fixed inset-0 z-[3000] bg-black/40"
          onClick={() => setShowArchiveDrawer(false)}
        >
          <div
            className="
        fixed
        top-4
        right-4
        bottom-4
        w-[500px]
        bg-white
        rounded-2xl
        shadow-2xl
        overflow-hidden
      "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
              <div>
                <h2 className="text-[18px] font-semibold text-[#1F2937]">
                  Archive Details
                </h2>


              </div>

              <button
                type="button"
                onClick={() => setShowArchiveDrawer(false)}
                className="
            w-[32px]
            h-[32px]
            rounded-full
            bg-gray-100
            text-gray-500
            hover:bg-gray-200
            hover:text-black
            text-[20px]
            flex
            items-center
            justify-center
            cursor-pointer
          "
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="h-[calc(100%-73px)] overflow-y-auto p-6">

              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <p className="text-gray-500">
                    Loading...
                  </p>
                </div>
              ) : selectedArchive ? (
                <div className="space-y-5">


                  <div>
                    <h3 className="text-[14px] font-semibold text-[#111827] mb-3 text-left">
                      Basic Information
                    </h3>

                    <div className="grid grid-cols-2 gap-3">

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Table Name
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.tableName || "-"}
                        </p>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Type
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.type || "-"}
                        </p>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Source
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.source || "-"}
                        </p>
                      </div>



                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Criteria
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.criteria || "-"}
                        </p>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Cut Off Date
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.cutOffDate || "-"}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Archive Information */}
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#111827] mb-3 text-left">
                      Archive Information
                    </h3>

                    <div className="grid grid-cols-2 gap-3">

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Row Count
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.rowCount ?? "-"}
                        </p>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          File Format
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.fileFormat || "-"}
                        </p>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Compression
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.compression || "-"}
                        </p>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Status
                        </p>

                        <span
                          className={`
                      inline-flex
                      mt-1
                      px-2.5
                      py-1
                      rounded-full
                      text-[11px]
                      font-medium
                      ${selectedArchive.status === "RESTORED"
                              ? "bg-green-100 text-green-700"
                              : selectedArchive.status === "DELETED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                    `}
                        >
                          {selectedArchive.status || "-"}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Created Information */}
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#111827] mb-3 text-left">
                      Created Information
                    </h3>

                    <div className="grid grid-cols-2 gap-3">

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Created By
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.createdBy || "-"}
                        </p>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Created At
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.createdAtDate || "-"}{" "}
                          {selectedArchive.createdAtTime || ""}
                        </p>
                      </div>

                    </div>
                  </div>


                  <div>
                    <h3 className="text-[14px] font-semibold text-[#111827] mb-3 text-left">
                      Restore Information
                    </h3>

                    <div className="grid grid-cols-2 gap-3">

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Restored By
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.restoredBy || "-"}
                        </p>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <p className="text-[11px] text-gray-500">
                          Restored At
                        </p>
                        <p className="text-[13px] font-medium text-[#1F2937] mt-1">
                          {selectedArchive.restoredAtDate
                            ? `${selectedArchive.restoredAtDate} ${selectedArchive.restoredAtTime || ""
                            }`
                            : "-"}
                        </p>
                      </div>

                    </div>
                  </div>



                </div>
              ) : (
                <p className="text-gray-500 text-center py-10">
                  No archive details found.
                </p>
              )}

            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DataArchive;