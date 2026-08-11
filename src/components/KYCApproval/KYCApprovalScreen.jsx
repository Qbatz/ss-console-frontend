import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useKyc } from "../../Context/KYCContext";
import User from "../../assets/userblack.png";
import Toast from "../SuccessModal/ToastDesign";
import Share from "../../assets/share.png";
import Maxmize from "../../assets/maximize.png"

const KycApproval = () => {
  const { getKYCList, loading, approveKYC } = useKyc();

  const [totalPages, setTotalPages] = useState(4);
  const [kycList, setKycList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTenant, setSelectedTenant] = useState(null);
  console.log("selectedTenant", selectedTenant)
  const fetchKycList = async () => {
    const res = await getKYCList(
      currentPage,
      pageSize,
      searchValue
    );

    if (res.success) {
      setKycList(res.data.tenantList || []);
      setTotalPages(res.data.totalPages || 1);
    }
  };

  useEffect(() => {
    fetchKycList();
  }, [currentPage, pageSize, searchValue]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(searchText);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleApproveKYC = async () => {

    if (
      approveLoading ||
      !selectedTenant?.customerId
    ) {
      return;
    }

    try {

      setApproveLoading(true);

      const res = await approveKYC(
        selectedTenant.customerId
      );

      if (res?.success) {
        setModalType("success");
        setMessage(res?.data);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);


        }, 800);
        setShowApproveModal(false);

        await fetchKycList();

      } else {

        setModalType("error");
        setMessage(res?.message);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);


        }, 800);

      }

    } finally {

      setApproveLoading(false);

    }

  };
  return (
    <DashboardLayout>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div className="p-5">

        {/* Header */}
        <div className="border-b border-gray-200 pb-3 mb-4">
          <h1 className="text-[20px] font-semibold text-left">
            KYC Pending Approval
          </h1>
        </div>

        {/* Filters */}
        <div className="flex-end justify-between  mb-4">
          {/* <div className="flex gap-3">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>All Properties</option>
            </select>

            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>This Month</option>
            </select>
          </div> */}

          <div className="flex gap-2">
            <button
              onClick={fetchKycList}

              className="bg-blue-600 text-white px-3 py-2 rounded-md"
            >
              ↻
            </button>

            <input
              value={searchText}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              placeholder="Search Tenants..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white-common rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs">ID</th>
                <th className="px-4 py-3 text-left text-xs">NAME</th>
                <th className="px-4 py-3 text-left text-xs">MOBILE NO</th>
                <th className="px-4 py-3 text-left text-xs">KYC STATUS</th>
                <th className="px-4 py-3 text-left text-xs">HOSTEL NAME</th>
                <th className="px-4 py-3 text-left text-xs">CREATED AT</th>
                <th className="px-4 py-3 text-left text-xs">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (

                [...Array(pageSize > 10 ? 10 : pageSize)].map((_, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100 animate-pulse"
                  >
                    <td className="px-4 py-4">
                      <div className="h-4 w-8 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
                    </td>
                  </tr>
                ))

              ) : kycList.length > 0 ? (

                kycList.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-100"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-left">
                      {index + 1}
                    </td>

                    {/* <td className="px-4 py-4 text-sm text-blue-600 text-xs text-left">
                      {item.fullName}
                    </td> */}
                    <td className="px-4 py-4 text-sm text-blue-600 text-xs text-left">
                      <div
                        className="w-[180px] truncate"
                        title={item?.fullName || "N/A"}
                      >
                        {item?.fullName || "N/A"}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs text-left">
                      {item.mobile}
                    </td>

                    <td className="px-4 py-4 text-xs text-orange-500 text-left">
                      {item.kycStatus}
                    </td>

                    {/* <td className="px-4 py-4 text-xs text-left">
                      {item.hostelName}
                    </td> */}
                    <td className="px-4 py-4 text-xs text-left">
  <div
    className="w-[220px] truncate"
    title={item?.hostelName || "N/A"}
  >
    {item?.hostelName || "N/A"}
  </div>
</td>
                    <td className="px-4 py-4 text-xs text-left">
                      {item.createdAtDate}
                    </td>

                    <td className="px-4 py-4 text-left">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-xs" onClick={() => {
                        setSelectedTenant(item);
                        setShowApproveModal(true);
                      }}>
                        Approve KYC
                      </button>
                    </td>
                  </tr>
                ))

              ) : (

                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    No records found
                  </td>
                </tr>

              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-4">

          <p className="text-[15px] text-gray-600">
            Total Record Count :{" "}
            <span className="text-blue-600 font-medium">
              {kycList.length}
            </span>
          </p>

          <div className="flex items-center gap-4">

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-10 w-24 border border-gray-300 rounded-xl px-3 outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`text-xl ${currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500"
                }`}
            >
              ‹
            </button>

            <button className="w-10 h-10 border border-gray-300 rounded-xl font-medium">
              {currentPage}
            </button>

            <span className="text-[16px] text-gray-700">
              {currentPage} - {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`text-xl ${currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500"
                }`}
            >
              ›
            </button>

          </div>
        </div>
      </div>


      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white-common rounded-2xl w-[500px] p-6 shadow-xl">

            <h2 className="text-[20px] font-medium text-[#1f2937] text-left">
              Do you wanna approve KYC for this Tenant ?
            </h2>

            <p className="text-gray-500 mt-2 text-sm text-left">
              Upon your approval, the KYC process will be completed.
            </p>

            <div className="bg-[#f5f7fb] rounded-xl p-4 mt-6 flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-white-common flex items-center justify-center">
                <img src={User} className="w-5 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[20px]">
                    {selectedTenant?.fullName}
                  </h3>

                  <img src={Maxmize} className="w-4 h-4" />
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  SM{selectedTenant?.kycDetailsId} |
                  {" "}
                  +91 {selectedTenant?.mobile}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() =>
                  setShowApproveModal(false)
                }
                className="border border-gray-300 px-8 py-3 rounded-xl text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleApproveKYC}
                disabled={approveLoading}
                className={`
    px-8 py-3 rounded-xl
    flex items-center gap-2 text-white
    ${approveLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2952F3]"
                  }
  `}
              >
                <img src={Share} className="w-4 h-4" />

                {approveLoading
                  ? "Approving..."
                  : "Confirm"}
              </button>

            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default KycApproval;