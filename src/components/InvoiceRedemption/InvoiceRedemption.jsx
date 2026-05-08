import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useHostel } from "../../Context/HostelListContext";
import Circle from "../../assets/menucircle.png";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";
import { usePermission } from "../../Utils/permissionHelper";
import LoginImg from "../../assets/LoginImg.png";

const InvoiceRedemption = () => {
  const { getInvoiceRedemption, loading, updateInvoiceRedemption,deleteInvoiceRedemption } = useHostel();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [editAmount, setEditAmount] = useState("");
const [amountError, setAmountError] = useState("");
const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const fetchData = async () => {
    const res = await getInvoiceRedemption(
      page,
      rowsPerPage,
      search
    );

    if (res.success) {
      const list = res.data?.invoiceRedemptionList;
      setData(list);
      setTotalRecords(res.data?.totalItems || 0);
    }
  };


  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, search]);
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);
  const handleUpdateInvoiceRedemption = async () => {

  if (!editAmount) {
    setAmountError("Amount is required");
    return;
  }

  const res = await updateInvoiceRedemption(
    selectedItem?.id,
    Number(editAmount)
  );

  if (res.success) {
  setModalType("success");
      setMessage(res?.data);
      setShowSuccess(true);
    setShowEditModal(false);
   

    fetchData();
     setTimeout(() => {
        setShowSuccess(false);
        setAmountError("");
        setSelectedItem(null);
      }, 1500);

  } else {

    setAmountError(res.message);

  }

};
const handleDeleteInvoiceRedemption = async () => {

  const res = await deleteInvoiceRedemption(deleteId);

  if (res.success) {
setModalType("success");
      setMessage(res?.data);
      setShowSuccess(true);
    setShowDeleteModal(false);
    setDeleteId(null);

    fetchData();
      setTimeout(() => {
        setShowSuccess(false);
        setAmountError("");
        setSelectedItem(null);
      }, 1500);

  } else {

    setAmountError(res.message);

  }

};
  console.log("data", data)
  return (
    <DashboardLayout>
       <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <h1 className="text-left">Invoice Redemption</h1>

        {/* SEARCH */}
        <div className="flex justify-end">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="w-[250px] border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">

          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">

              <thead className="bg-[#F8F9FF] sticky top-0 z-10 text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left whitespace-nowrap">Source Invoice</th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">Target Invoice</th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">Hostel</th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">Amount</th>
                  {/* <th className="px-3 py-2 text-left whitespace-nowrap">Reference</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Reason</th> */}
                  <th className="px-3 py-2 text-left whitespace-nowrap">Redeemed At</th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">Created At</th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">Created By</th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">Action</th>

                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(rowsPerPage)].map((_, i) => (
                    <tr key={i} className="border-t  border-gray-300">
                      {[...Array(9)].map((_, j) => (
                        <td key={j} className="px-3 py-3">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-400">
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((item, i) => (
                    <tr key={i} className="border-t border-gray-300 hover:bg-gray-50">

                      <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.sourceInvoiceNumber}</td>
                      <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.targetInvoiceNumber}</td>
                      <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.hostelName}</td>
                      <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.redemptionAmount}</td>
                      {/* <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.referenceNumber}</td>
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.reason}</td> */}
                      <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                        {item.redeemedAtDate} {item.redeemedAtTime}
                      </td>
                      <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                        {item.createdAtDate} {item.createdAtTime}
                      </td>
                      <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.createdBy}</td>
                      <td className="px-4 py-2">

                        <div className="relative flex justify-center">

                          <img
                            src={Circle}
                            className="w-5 h-5 cursor-pointer"
                            onClick={(e) => {

                              const rect = e.currentTarget.getBoundingClientRect();

                              setOpenMenuId(
                                openMenuId?.id === item.id
                                  ? null
                                  : {
                                    id: item.id,
                                    top: rect.bottom + 5,
                                    left: rect.left - 90
                                  }
                              );
                            }}
                          />

                        </div>

                        {openMenuId?.id === item.id && (
                          <div
                            ref={menuRef}
                            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg w-28 z-[99999]"
                            style={{
                              top: openMenuId.top,
                              left: openMenuId.left
                            }}
                          >

                          <button
  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
  onClick={() => {
    setSelectedItem(item);
    setEditAmount(item.redemptionAmount);
    setShowEditModal(true);
    setOpenMenuId(null);
  }}
>
  Edit
</button>

                           <button
  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
  onClick={() => {
    setDeleteId(item.id);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  }}
>
  Delete
</button>

                          </div>
                        )}

                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center bg-white px-4 py-3">

          <div className="text-sm text-gray-600">
            Total Record Count :{" "}
            <span className="text-blue-600 font-semibold">
              {totalRecords}
            </span>
          </div>

          <div className="flex items-center gap-3">

            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-2 text-lg"
            >
              ‹
            </button>

            <div className="border px-3 py-1 rounded-md text-sm">
              {page}
            </div>

            <button
              onClick={() =>
                setPage(prev => Math.min(prev + 1, totalPages))
              }
              disabled={page === totalPages}
              className="px-2 text-lg"
            >
              ›
            </button>

          </div>
        </div>

      </div>
      {showEditModal && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]"
    onClick={() => {
      setShowEditModal(false);
      setSelectedItem(null);
      setAmountError("");
    }}
  >

    <div
      className="bg-white rounded-xl w-[400px] p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >

      <h2 className="text-lg font-semibold mb-4 text-left">
        Edit Redemption Amount
      </h2>

      <div className="mb-4">

        <label className="block text-sm text-gray-600 mb-1 text-left">
          Amount
          <span className="text-red-600 pl-1">*</span>
        </label>

        <input
          type="number"
          value={editAmount}
          placeholder="Please Enter Amount"
          onChange={(e) => {
            setEditAmount(e.target.value);
            setAmountError("");
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
        />

        {amountError && (
          <ErrorMessage
            message={amountError}
            type="error"
          />
        )}

      </div>

      <div className="flex justify-end gap-3">

        <button
          onClick={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          className="px-4 py-2 border rounded-lg cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdateInvoiceRedemption}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}
{showDeleteModal && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]"
    onClick={() => {
      setShowDeleteModal(false);
      setDeleteId(null);
      setAmountError("");
    }}
  >

    <div
      className="bg-white rounded-xl w-[400px] p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >

      <h2 className="text-lg font-semibold text-left mb-3">
        Delete Confirmation
      </h2>

      <p className="text-sm text-gray-600 text-left mb-5">
        Are you sure you want to delete this invoice redemption?
      </p>

      {amountError && (
        <ErrorMessage
          message={amountError}
          type="error"
        />
      )}

      <div className="flex justify-end gap-3">

        <button
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteId(null);
            setAmountError("");
          }}
          className="px-4 py-2 border rounded-lg cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteInvoiceRedemption}
          className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
        >
          Delete
        </button>

      </div>

    </div>

  </div>
)}
    </DashboardLayout>
  );
};

export default InvoiceRedemption;