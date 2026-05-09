// import React, { useState } from "react";
// import Share from "../../assets/share.png";
// import LoginImg from "../../assets/LoginImg.png";
// import { usePermission } from "../../Utils/permissionHelper";

// const InvoicesScreen = () => {
// const { canRead, canWrite, canUpdate, canDelete } =
//       usePermission("Invoices");
//   const [step, setStep] = useState("restricted"); 
//   // restricted → verify → table

//   return (
//     <>
//     {canRead === false ? (

//       <div className="flex flex-col items-center justify-center h-[350px] gap-4">

//         <img
//           src={LoginImg}
//           alt="Access Restricted"
//           className="w-64 object-contain"
//         />

//         <p className="text-red-600 text-lg font-medium">
//           Access Restricted
//         </p>

//       </div>

//     ) : (
//     <div className="py-10">


//       {step === "restricted" && (
//         <div className="flex items-center justify-center py-16">

//           <div className="bg-white border border-[#E6E8F0] rounded-xl p-8 w-full max-w-xl text-center shadow-sm">

//             <h2 className="text-lg font-semibold text-gray-800 mb-2">
//               Financial Data Access Restricted
//             </h2>

//             <p className="text-sm text-gray-500 mb-6 leading-relaxed">
//               Invoice and billing records contain sensitive financial information
//               of this property. To protect proprietor data, access requires
//               verification approval.
//             </p>

//             <div className="flex items-center justify-center gap-4">

//               <button className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600">
//                 Cancel
//               </button>

//               <button
//                 onClick={() => setStep("verify")}
//                 className="px-5 py-2 rounded-lg bg-[#2563EB] text-white font-medium flex items-center gap-2"
//               >
//                 <img src={Share} width={18} height={18} />
//                 Request Access
//               </button>

//             </div>

//           </div>
//         </div>
//       )}



//       {step === "verify" && (
//         <div className="flex items-center justify-center py-16">

//           <div className="bg-white border border-[#E6E8F0] rounded-xl p-8 w-full max-w-md text-center shadow-sm">

//             <h2 className="text-lg font-semibold text-gray-800 mb-2">
//               Verify Access Code
//             </h2>

//             <p className="text-sm text-gray-500 mb-6">
//               A 6-digit verification code has been sent to the registered proprietor email.
//             </p>

//             {/* OTP BOXES */}
//             <div className="flex justify-center gap-3 mb-6">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <input
//                   key={i}
//                   maxLength={1}
//                   className="w-10 h-10 border border-gray-300 rounded-md text-center text-lg"
//                 />
//               ))}
//             </div>

//             <div className="flex justify-between text-sm">

//               <button
//                 className="text-gray-500"
//                 onClick={() => setStep("restricted")}
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={() => setStep("table")}
//                 className="text-[#2563EB] font-medium"
//               >
//                 Verify
//               </button>

//             </div>

//           </div>
//         </div>
//       )}



//       {step === "table" && (
//         <div className="bg-white border border-[#E6E8F0] rounded-xl p-4">

//           <div className="max-h-[300px] overflow-y-auto">

//             <table className="w-full text-sm">

//               <thead className="bg-[#F1F3F7] sticky top-0 z-10">
//                 <tr>
//                   <th className="px-4 py-3 text-left">INVOICE ID</th>
//                   <th className="px-4 py-3 text-left">TENANT NAME</th>
//                   <th className="px-4 py-3 text-left">AMOUNT</th>
//                   <th className="px-4 py-3 text-left">STATUS</th>
//                   <th className="px-4 py-3 text-left">CREATED DATE</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200">

//                 {Array.from({ length:1 }).map((_, i) => (
//                   <tr key={i} className="hover:bg-gray-50">
//                     <td className="px-4 py-3">INV-2025-00{i}</td>
//                     <td className="px-4 py-3">Ravi Kumar</td>
//                     <td className="px-4 py-3">₹ 5,000</td>
//                     <td className="px-4 py-3 text-green-600">Paid</td>
//                     <td className="px-4 py-3">27 Sep 2025</td>
//                   </tr>
//                 ))}

//               </tbody>

//             </table>

//           </div>

//         </div>
//       )}

//     </div>
//     )}
//     </>
//   );
// };

// export default InvoicesScreen;
import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useHostel } from "../../Context/HostelListContext";
import Circle from "../../assets/menucircle.png";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";
import { usePermission } from "../../Utils/permissionHelper";
import LoginImg from "../../assets/LoginImg.png";

const InvoicesScreen = ({ hostelData, refreshHostel }) => {
  const { canRead, canWrite, canUpdate, canDelete } =
      usePermission("Invoices");
  const defaultInvoiceRedemptions = hostelData?.invoiceRedemptions || [];
  console.log("hostelData", hostelData)
  const { getInvoiceRedemption, loading, getHostelInvoiceRedemption, updateInvoiceRedemption,deleteInvoiceRedemption } = useHostel();
  const [invoiceData, setInvoiceData] = useState([]);
  const [isMore, setIsMore] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [data, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const menuRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [amountError, setAmountError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");



  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const fetchInvoiceRedemptions = async (page = 0) => {

    const res = await getHostelInvoiceRedemption(
      hostelData?.hostelId,
      page,
      size
    );

    if (res.success) {

      setInvoiceData(res.data?.invoiceRedemptionList || []);
      setTotalItems(res.data?.totalItems || 0);
      setTotalPages(res.data?.totalPages || 0);

    }

  };

  const handleMoreClick = () => {

    setIsMore(true);
    setPage(0);

    fetchInvoiceRedemptions(0);

  };

  useEffect(() => {

    if (isMore) {
      fetchInvoiceRedemptions(page);
    }

  }, [page, size]);
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

  const tableData = isMore
    ? invoiceData
    : defaultInvoiceRedemptions;
  console.log("data", data)
  const handleUpdateInvoiceRedemption = async () => {
    console.log("...........?")
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
      refreshHostel()
      setTimeout(() => {
        setShowSuccess(false);
        setAmountError("");
        setSelectedItem(null);
      }, 1500);

      if (isMore) {
        fetchInvoiceRedemptions(page);
      }

    } else {
      setAmountError(res.message);
    }

  };
  const handleDeleteInvoiceRedemption = async (id) => {

  const res = await deleteInvoiceRedemption(id);

  if (res.success) {

    setModalType("success");
    setMessage(res?.data);
    setShowSuccess(true);

    refreshHostel();

    if (isMore) {
      fetchInvoiceRedemptions(page);
    }

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

  } else {

    setModalType("error");
    setMessage(res.message);
    setAmountError(res.message)
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

  }

};
  return (
    <>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div className="p-6 space-y-6">

        <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-visible">

          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">

              <thead className="bg-[#F8F9FF] sticky top-0 z-10 text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left whitespace-nowrap">Source Invoice</th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">Target Invoice</th>
                  {/* <th className="px-3 py-2 text-left whitespace-nowrap">Hostel</th> */}
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
                    <tr key={i} className="border-t">
                      {[...Array(9)].map((_, j) => (
                        <td key={j} className="px-3 py-3">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : hostelData?.invoiceRedemptions?.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-400">
                      No data found
                    </td>
                  </tr>
                ) : (
                  tableData?.map((item, i) => (
                    <tr key={i} className="border-t border-gray-300 hover:bg-gray-50">

                      <td className="px-4 py-2 text-left font-medium text-[11px] whitespace-nowrap">{item.sourceInvoiceNumber}</td>
                      <td className="px-4 py-2 text-left font-medium text-[11px] whitespace-nowrap">{item.targetInvoiceNumber}</td>
                      {/* <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.hostelName}</td> */}
                      <td className="px-4 py-2 text-left font-medium text-[11px] whitespace-nowrap">{item.redemptionAmount}</td>
                      {/* <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.referenceNumber}</td>
                      <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.reason}</td> */}
                      <td className="px-4 py-2 text-left font-medium text-[11px] whitespace-nowrap">
                        {item.redeemedAtDate} {item.redeemedAtTime}
                      </td>
                      <td className="px-4 py-2 text-left font-medium text-[11px] whitespace-nowrap">
                        {item.createdAtDate} {item.createdAtTime}
                      </td>
                      <td className="px-4 py-2 text-left font-medium text-[11px] whitespace-nowrap">{item.createdBy}</td>
                      <td className="px-4 py-2">

                        <div className="relative flex justify-center">

                          <img
                            src={Circle}
                            className="w-5 h-5 cursor-pointer"
                            onClick={(e) => {

                              const rect = e.currentTarget.getBoundingClientRect();

                              setOpenMenuId(
                                openMenuId === item.id
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
        {!isMore && defaultInvoiceRedemptions.length >= 50 && (
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
              Total Record Count :
              <span className="text-blue-600 ml-1">
                {totalItems}
              </span>
            </span>

            <div className="flex items-center gap-4">

              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(0);
                }}
                className="border rounded px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                ◀
              </button>

              <span className="border px-3 py-1 rounded bg-gray-50">
                {page + 1}
              </span>

              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ▶
              </button>

            </div>

          </div>
        )}

        {/* PAGINATION */}
        {/* <div className="flex justify-between items-center bg-white px-4 py-3">

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
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
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
        </div> */}

      </div>
     {showEditModal && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]"
    onClick={() => {
      setShowEditModal(false);
      setSelectedItem(null);
      setAmountError("")
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
          Amount<span className="text-red-600 pl-1">*</span>
        </label>

        <input
          type="number"
          value={editAmount}
          placeholder="Please Amount"
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
      setAmountError("")
    }}
  >

    <div
      className="bg-white rounded-xl w-[400px] p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >

      <h2 className="text-lg font-semibold text-left mb-3">
        Delete Confirmation
      </h2>

      <p className="text-sm text-gray-600 text-left mb-6">
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
             setAmountError("")
          }}
          className="px-4 py-2 border rounded-lg cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={async () => {

            await handleDeleteInvoiceRedemption(deleteId);
            setDeleteId(null);

          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
        >
          Delete
        </button>

      </div>

    </div>

  </div>
)}
    </>

  );
};

export default InvoicesScreen;