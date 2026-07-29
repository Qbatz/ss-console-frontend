import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import {
  FiArrowLeft,
  FiPhone,
  FiExternalLink,
  FiMoreVertical,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import InvoiceOverviewDrawer from "./InvoiceOverviewDrawer";
import { useHostel } from "../../Context/HostelListContext";
import TenantDeductions from "./TenantDeductions";
import { useSubscription } from "../../Context/SubscriptionContext";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import LoginImg from "../../assets/permission.svg";
import { usePermission } from "../../Utils/permissionHelper";

// const invoices = [
//   {
//     invoiceNo: "#FS-2025-001",
//     status: "Pending",
//     date: "02-Oct-2025",
//     type: "Settlement",
//     amount: "₹ 1,299",
//     due: "₹ 0",
//   },
//   {
//     invoiceNo: "#ST-2025-002",
//     status: "Partially Paid",
//     date: "01-Oct-2025",
//     type: "Rental",
//     amount: "₹ 6,000",
//     due: "₹ 3,000",
//   },
//   {
//     invoiceNo: "#ST-2025-003",
//     status: "Unpaid",
//     date: "01-Oct-2025",
//     type: "Rental",
//     amount: "₹ 1,900",
//     due: "₹ 1,900",
//   },
//   {
//     invoiceNo: "#ST-2025-004",
//     status: "Partially Paid",
//     date: "01-Oct-2025",
//     type: "Rental",
//     amount: "₹ 12,000",
//     due: "₹ 6,000",
//   },
// ];

const getStatusColor = (status) => {
  switch (status) {
    case "Paid":
      return "bg-green-500";
    case "Pending":
      return "bg-red-500";
    case "Unpaid":
      return "bg-red-400";
    case "Partially Paid":
      return "bg-amber-500";
    default:
      return "bg-gray-400";
  }
};

const TenantOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTenantById, deleteInvoice, updateInvoiceRedemption, deleteInvoiceRedemption, updateAdvanceAmount } = useHostel();
  const { deleteTransaction } = useSubscription();
  // const tenantData = location.state?.tenantData;
  const hostelData = location.state?.hostelData;
  const { customerId } = useParams();
  //  const { canRead, canWrite, canUpdate, canDelete } =
  //     usePermission("Tenants");
  const {
  canRead: canReadTenant,
  canWrite: canWriteTenant,
  canUpdate: canUpdateTenant,
  canDelete: canDeleteTenant,
} = usePermission("Tenants");

const {
  canRead: canReadInvoice,
  canWrite: canWriteInvoice,
  canUpdate: canUpdateInvoice,
  canDelete: canDeleteInvoice,
} = usePermission("Invoices");

const {
  canRead: canReadPlan,
  canWrite: canWritePlan,
  canUpdate: canUpdatePlan,
  canDelete: canDeletePlan,
} = usePermission("Plans");
  const [activeTab, setActiveTab] = useState("invoice");
  const [showInvoiceDrawer, setShowInvoiceDrawer] = useState(false);
  const menuRef = useRef(null);
  const transactionMenuRef = useRef(null);
  const invoiceMenuRef = useRef(null);
  const redemptionMenuRef = useRef(null);
  const [tenantData, setTenantData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [sourceInvoice, setSourceInvoice] = useState([])
  const [openMenu, setOpenMenu] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [openInvoiceMenu, setOpenInvoiceMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [deletePhone, setDeletePhone] = useState("");


  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [amountError, setAmountError] = useState("");
  console.log("deleteItem", deleteItem)
  const [openRedemptionMenu, setOpenRedemptionMenu] = useState(null);

  const [showRedemptionEditModal, setShowRedemptionEditModal] = useState(false);
  const [showRedemptionDeleteModal, setShowRedemptionDeleteModal] = useState(false);
  const [selectedRedemption, setSelectedRedemption] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showAmountModal, setShowAmountModal] = useState(false);
  console.log("selectedRedemption", selectedRedemption)
  const fetchTenant = async () => {
    const res = await getTenantById(customerId);

    if (res?.success) {
      setTenantData(res.data);
      setInvoices(res?.data?.invoices)
      setTransactions(res?.data?.transactions || []);
      setSourceInvoice(res?.data?.invoiceRedemptions || [])
    }
  };
  useEffect(() => {
    fetchTenant();
  }, [customerId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        redemptionMenuRef.current &&
        !redemptionMenuRef.current.contains(
          event.target
        )
      ) {
        setOpenRedemptionMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        transactionMenuRef.current &&
        !transactionMenuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }

      if (
        invoiceMenuRef.current &&
        !invoiceMenuRef.current.contains(event.target)
      ) {
        setOpenInvoiceMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);
  const handleDelete = async (
  transactionId,
  tenantMobile
) => {

  if (!tenantMobile) {
    setModalType("error");
    setMessage("Mobile number is required");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

    return;
  }

  if (tenantMobile.length !== 10) {
    setModalType("error");
    setMessage("Mobile number must be 10 digits");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

    return;
  }

  const res = await deleteTransaction(
    transactionId,
    tenantMobile
  );

  if (res?.success) {
    setModalType("success");
    setMessage(res?.data);

    setShowSuccess(true);
    setDeleteItem(null);
    setDeletePhone("");

    fetchTenant();

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

  } else {
    setModalType("error");
    setMessage(res?.message);

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);
  }
};
  // const handleDelete = async (transactionId) => {
  //   const res = await deleteTransaction(transactionId);

  //   if (res?.success) {

  //     setModalType("success");
  //     setMessage(res?.data);

  //     setShowSuccess(true);
  //     setDeleteItem(null);

  //     fetchTenant();

  //     setTimeout(() => {
  //       setShowSuccess(false);

  //     }, 1500);

  //   }
  //   else {
  //     setModalType("error");
  //     setMessage(res?.message);

  //     setShowSuccess(true);


  //     setTimeout(() => {
  //       setShowSuccess(false);

  //     }, 1500);
  //   }
  // };
  const handleInvoiceReceipt = (item) => {
    navigate(`/invoice-receipt/${item.invoiceId}`);
  };
  const handleDeleteInvoice = async () => {
    if (!deletePhone) {
      setAmountError("Mobile number is required");
      return;
    }

    if (deletePhone.length !== 10) {
      setAmountError("Mobile number must be 10 digits");
      return;
    }

    const payload = [
      {
        invoiceId: selectedInvoice?.invoiceId,
        tenantMobile: Number(deletePhone),
      },
    ];

    const res = await deleteInvoice(payload);

    if (res?.success) {
      fetchTenant();

      setShowDeleteModal(false);
      setDeletePhone("");
      setAmountError("");
      setSelectedInvoice(null);

      setModalType("success");
      setMessage(res?.message || "Invoice deleted successfully");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    } else {
      setAmountError(res?.message || "Unable to delete invoice");
    }
  };

  const handleUpdateInvoiceRedemption = async () => {
     if (!editAmount) {
    setAmountError("Amount is required");
    return;
  }

  if (
    Number(editAmount) ===
    Number(selectedRedemption?.redemptionAmount)
  ) {
    setModalType("error");
    setMessage("No changes detected");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

    return;
  }

  const res = await updateInvoiceRedemption(
    selectedRedemption?.id,
    Number(editAmount)
  );


    if (res.success) {
      setModalType("success");
      setMessage(res?.data);
      setShowSuccess(true);
      setShowRedemptionEditModal(false);
      fetchTenant()
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

    if (isDeleting) return;

    setIsDeleting(true);
    setAmountError("");

    try {

      const res = await deleteInvoiceRedemption(id);

      if (res.success) {

        setModalType("success");
        setMessage(res?.data);
        setShowSuccess(true);

        fetchTenant();
        setShowRedemptionDeleteModal(false)
        setTimeout(() => {
          setShowSuccess(false);

        }, 1500);
        if (isMore) {
          fetchInvoiceRedemptions(page);
        }





      } else {

        setModalType("error");
        setMessage(res.message);
        setAmountError(res.message);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 1500);

      }

    } finally {

      setIsDeleting(false);

    }

  };

  const handleUpdateAmount = async () => {
    const res = await updateAdvanceAmount(
      tenantData?.hostelDetails?.hostelId,
      selectedInvoice?.invoiceId
    );

    if (res?.success) {
      fetchTenant();

      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setShowAmountModal(false);
      }, 800);
    } else {
      setModalType("error");
      setMessage(res.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 800);
    }
  };
  return (
    <DashboardLayout>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div className="min-h-screen">


        <div className="bg-white-common border-b border-[#E5E7EB] px-6 py-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(-1)}
              className="mt-1 text-[#2563EB]"
            >
              <FiArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-[24px] font-semibold text-[#1F2937] text-left">
                Tenant Info
              </h1>

              <p className="text-[13px] text-[#6B7280] mt-1">
                Properties &gt; Tenant Overview
              </p>
            </div>
          </div>
        </div>


        <div className="bg-white-common px-8 py-4 border-b border-[#E5E7EB]">

          <div className="flex justify-between">

            <div className="flex gap-4">

              <div
                className="
    w-[50px]
    h-[50px]
    rounded-[16px]
    border
    border-[#E5E7EB]
    flex
    items-center
    justify-center
    overflow-hidden
    bg-white-common
  "
              >
                {tenantData?.profileImage ? (
                  <img
                    src={tenantData.profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="
        text-[20px]
        font-semibold
        text-[#374151]
      "
                  >
                    {tenantData?.initials || "--"}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-[20px] leading-none font-semibold text-[#1F2937] text-left">
                  {tenantData?.fullName || "N/A"}
                </h2>

                <p className="mt-3 text-[15px] text-[#6B7280] text-left">
                  {tenantData?.hostelDetails?.floorName} |  {tenantData?.hostelDetails?.roomName} | {tenantData?.hostelDetails?.bedName}
                </p>
              </div>

            </div>

            <button>
              <FiMoreVertical size={20} />
            </button>

          </div>

          {/* Info Row */}
          <div className="grid grid-cols-3 gap-20 mt-5 text-left">

            <div>
              <p className="text-[#9CA3AF] text-sm">
                Mob No
              </p>

              <div className="flex items-center gap-2 mt-2">
                <FiPhone className="text-[#2563EB]" />
                <span className="font-medium text-[#1F2937]">
                  {tenantData?.mobile || "N/A"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[#9CA3AF] text-sm text-left">
                Staying Hostel
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="font-medium text-[#2563EB]">
                  {tenantData?.hostelDetails?.hostelName || "N/A"}
                </span>

                <FiExternalLink
                  size={14}
                  className="text-[#2563EB]"
                />
              </div>
            </div>

            <div className="text-left">
              <p className="text-[#9CA3AF] text-sm">
                Mail
              </p>

              <p className="mt-2 font-medium text-[#1F2937]">
                {tenantData?.emailId ||
                  "N/A"}
              </p>
            </div>

          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white-common px-6">

          <div className="flex gap-10 border-b border-[#E5E7EB]">

            <button
              onClick={() =>
                setActiveTab("invoice")
              }
              className={`
                py-4
                text-sm
                font-medium
                border-b-2
                ${activeTab === "invoice"
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#9CA3AF]"
                }
              `}
            >
              Invoices
            </button>

            <button
              onClick={() =>
                setActiveTab("transaction")
              }
              className={`
                py-4
                text-sm
                font-medium
                border-b-2
                ${activeTab === "transaction"
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#9CA3AF]"
                }
              `}
            >
              Transactions
            </button>
            <button
              onClick={() =>
                setActiveTab("redemption")
              }
              className={`
                py-4
                text-sm
                font-medium
                border-b-2
                ${activeTab === "redemption"
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#9CA3AF]"
                }
              `}
            >
              Invoice Redemption
            </button>

            <button
              onClick={() => setActiveTab("deduction")}
              className={`
    py-4 text-sm font-medium border-b-2
    ${activeTab === "deduction"
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#9CA3AF]"
                }
  `}
            >
              Deductions
            </button>
          </div>
        </div>

        {
          activeTab === "invoice" && (
            <div className="bg-white-common px-6 py-5">

              <div className="max-h-[250px] overflow-auto">

                <table className="w-full">

                  <thead className="sticky top-0 bg-[#F5F7FB] z-10">
                    <tr className="text-[#6B7280] text-[11px]">
                      <th className="px-4 py-4 text-left">INVOICE NO</th>
                      <th className="px-4 py-4 text-left">STATUS</th>
                      <th className="px-4 py-4 text-left whitespace-nowrap">
                        INVOICE MODE
                      </th>
                      <th className="px-4 py-4 text-left whitespace-nowrap">
                        DATE CREATED
                      </th>
                      <th className="px-4 py-4 text-left">TYPE</th>
                      <th className="px-4 py-4 text-left">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoices.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#F1F5F9] text-[12px]"
                      >
                        <td className="px-4 py-4 text-[#2563EB] font-medium text-left">
                          {item.invoiceNumber}
                        </td>

                        <td className="px-4 py-4 text-left">
                          {item.paymentStatus}
                        </td>

                        <td className="px-4 py-4 text-left">
                          {item.invoiceMode}
                        </td>

                        <td className="px-4 py-4 text-left">
                          <div>
                            <div>{item.createdAtDate || "----"}</div>
                            <div className="text-[11px] text-gray-400">
                              {item.createdAtTime}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-left">
                          {item.invoiceType}
                        </td>

                        <td className="px-4 py-4 text-left relative overflow-visible ">
                          <button
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();

                              const menuHeight = 100;
                              const spaceBelow = window.innerHeight - rect.bottom;

                              setMenuPosition({
                                top:
                                  spaceBelow > menuHeight
                                    ? rect.bottom + 5
                                    : rect.top - menuHeight,
                                left: rect.left - 120,
                              });

                              setOpenInvoiceMenu(
                                openInvoiceMenu === item.invoiceId
                                  ? null
                                  : item.invoiceId
                              );
                            }}
                          >
                            <FiMoreVertical className="cursor-pointer" />
                          </button>

                          {openInvoiceMenu === item.invoiceId && (
                            <div ref={invoiceMenuRef}
                              className="fixed w-40 bg-white-common border rounded-lg shadow-lg z-[99999]"
                              style={{
                                top: menuPosition.top,
                                left: menuPosition.left,
                              }}
                            >

                              {item?.canShowReceipts === true && (
                                <button className="px-4 py-2 cursor-pointer"
                                  onClick={() =>
                                    navigate(
                                      `/invoice-receipt/${tenantData?.hostelDetails?.hostelId}/${item.invoiceId}`,
                                      {
                                        state: {
                                          tenantData,
                                          invoiceData: item,
                                        },
                                      }
                                    )
                                  }
                                >
                                  Invoice Receipt
                                </button>
                              )}

                              {/* <button
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setSelectedInvoice(item);
                                  setShowDeleteModal(true);
                                  setDeletePhone("");
                                  setAmountError("");
                                  setOpenInvoiceMenu(null);
                                }}
                              >
                                Delete
                              </button> */}
                              <button
  disabled={!canDeleteInvoice}
  onClick={() => {
    if (!canDeleteInvoice) return;

    setSelectedInvoice(item);
    setShowDeleteModal(true);
    setDeletePhone("");
    setAmountError("");
    setOpenInvoiceMenu(null);
  }}
  className={`w-full text-left px-4 py-2 ${
    canDeleteInvoice
      ? "text-red-600 hover:bg-gray-100 cursor-pointer"
      : "text-gray-400 cursor-not-allowed"
  }`}
>
  Delete
</button>
                              {/* {item?.canUpdateAmount === true && (
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setSelectedInvoice(item);
                                    setShowAmountModal(true);
                                    setOpenInvoiceMenu(null);
                                  }}
                                >
                                  Update Amount
                                </button>
                              )} */}
                              {item?.canUpdateAmount === true && (
  <button
    disabled={!canUpdateInvoice}
    onClick={() => {
      if (!canUpdateInvoice) return;

      setSelectedInvoice(item);
      setShowAmountModal(true);
      setOpenInvoiceMenu(null);
    }}
    className={`w-full text-left px-4 py-2 ${
      canUpdateInvoice
        ? "hover:bg-gray-100 cursor-pointer"
        : "text-gray-400 cursor-not-allowed"
    }`}
  >
    Update Amount
  </button>
)}

                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

            </div>
          )}
        {activeTab === "transaction" && (
          <div className="bg-white-common px-6 py-5">

            <div className="max-h-[250px] overflow-auto">

              <table className="w-full">

                <thead className="sticky top-0 bg-[#F5F7FB] z-10">
                  <tr className="text-[#6B7280] text-[11px]">

                    <th className="px-4 py-4 text-left">
                      INVOICE NO
                    </th>

                    <th className="px-4 py-4 text-left">
                      PAID AMOUNT
                    </th>

                    <th className="px-4 py-4 text-left">
                      STATUS
                    </th>

                    <th className="px-4 py-4 text-left">
                      PAYMENT DATE
                    </th>

                    <th className="px-4 py-4 text-left">
                      MODE
                    </th>

                    <th className="px-4 py-4 text-left">
                      REFERENCE ID
                    </th>
                    <th className="px-4 py-4 text-left">
                      ACTION
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white-common">

                  {transactions?.length > 0 ? (

                    transactions.map((item) => (

                      <tr
                        key={item.transactionId}
                        className="border-b border-[#F1F5F9] text-[12px]"
                      >

                        <td className="px-4 py-4 text-left text-[#2563EB] font-medium">
                          {item.invoiceNumber || "--"}
                        </td>

                        <td className="px-4 py-4 text-left">
                          ₹{item.paidAmount || 0}
                        </td>

                        <td className="px-4 py-4 text-left">
                          <span
                            className={`px-2 py-1 rounded-full text-[11px] font-medium
                      ${item.status === "SUCCESS"
                                ? "bg-green-100 text-green-700"
                                : item.status === "FAILED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {item.status || "--"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-left">
                          <div>
                            <div>
                              {item.paymentDate || "--"}
                            </div>

                            {item.paymentTime && (
                              <div className="text-[11px] text-gray-400">
                                {item.paymentTime}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-left">
                          {item.transactionMode || "--"}
                        </td>

                        <td className="px-4 py-4 text-left">
                          {item.transactionReferenceId || "--"}
                        </td>

                        <td className="px-4 py-4 text-left relative overflow-visible ">
                          <div ref={transactionMenuRef}>
                            <button
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === item.transactionId
                                    ? null
                                    : item.transactionId
                                )
                              }
                            >
                              <FiMoreVertical className="cursor-pointer" />
                            </button>

                            {openMenu === item.transactionId && (
                              <div ref={transactionMenuRef}
                                className="
        absolute right-0 bottom-full mb-2
        w-32 bg-white-common border rounded-lg shadow-lg z-[9999]
      "
                              >
                                <button
                                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setDeleteItem(item);
                                    setOpenMenu(null);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-10 text-gray-500"
                      >
                        No Transactions Found
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {
          activeTab === "redemption" && (
            <div className="bg-white-common px-6 py-5">

              <div className="max-h-[250px] overflow-auto">

                <table className="w-full">

                  <thead className="sticky top-0 bg-[#F5F7FB] z-10">
                    <tr className="text-[#6B7280] text-[11px]">
                      <th className="px-4 py-4 text-left">
                        SOURCE INVOICE
                      </th>

                      <th className="px-4 py-4 text-left">
                        TARGET INVOICE
                      </th>
                      <th className="px-4 py-4 text-left">
                        REDEMPTION AMOUNT
                      </th>
                      <th className="px-4 py-4 text-left">
                        CREATED AT
                      </th>

                      <th className="px-4 py-4 text-left">
                        CREATED BY
                      </th>

                      <th className="px-4 py-4 text-left">
                        ACTION
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sourceInvoice?.length > 0 ? (
                      sourceInvoice.map((item) => (
                        <tr
                          key={item.transactionId}
                          className="border-b border-[#F1F5F9] text-[12px]"
                        >
                          <td className="px-4 py-4 text-left">
                            {item.sourceInvoiceNumber}
                          </td>

                          <td className="px-4 py-4 text-left">
                            {item.targetInvoiceNumber}
                          </td>
                          <td className="px-4 py-4 text-left">
                            {item.redemptionAmount}
                          </td>
                          {/* <td className="px-4 py-4 text-left">
                {item.createdAtDate}
              </td> */}
                          <td className="px-4 py-4 text-left">
                            <p className="font-medium">
                              {item.createdAtDate}
                            </p>

                            <p className="text-[11px] text-gray-400">
                              {item.createdAtTime}
                            </p>
                          </td>

                          <td className="px-4 py-4 text-left">
                            {item.createdBy}
                          </td>
                          <td className="px-4 py-4 text-left">
                            <button
                              onClick={(e) => {
                                const rect =
                                  e.currentTarget.getBoundingClientRect();

                                const menuHeight = 100;
                                const spaceBelow =
                                  window.innerHeight - rect.bottom;

                                setMenuPosition({
                                  top:
                                    spaceBelow > menuHeight
                                      ? rect.bottom + 5
                                      : rect.top - menuHeight,
                                  left: rect.left - 120,
                                });

                                setOpenRedemptionMenu(
                                  openRedemptionMenu === item.redemptionId
                                    ? null
                                    : item.redemptionId
                                );
                              }}
                            >
                              <FiMoreVertical className="cursor-pointer" />
                            </button>

                            {openRedemptionMenu === item.redemptionId && (
                              <div
                                className="fixed w-25 bg-white-common border rounded-lg shadow-lg z-[99999]"
                                style={{
                                  top: menuPosition.top,
                                  left: menuPosition.left,
                                }}
                              >
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                  onClick={() => {
                                    setSelectedRedemption(item);
                                    setEditAmount(item.redemptionAmount);
                                    setShowRedemptionEditModal(true);
                                    setOpenRedemptionMenu(null);
                                  }}
                                >
                                  Edit
                                </button>

                                <button
                                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                  onClick={() => {
                                    setSelectedRedemption(item);
                                    setShowRedemptionDeleteModal(true);
                                    setOpenRedemptionMenu(null);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-6 text-gray-500"
                        >
                          No Transactions Found
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>

              </div>

            </div>
          )}


        {
          activeTab === "deduction" && (
            <TenantDeductions
              tenantData={tenantData}
              hostelData={hostelData}
            />
          )
        }

        {/* {deleteItem && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setDeleteItem(null)}
          >
            <div
              className="bg-white rounded-lg p-6 w-[350px]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-3">
                Delete Transaction
              </h3>

              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to delete this transaction?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setDeleteItem(null)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={() => {
                    handleDelete(deleteItem.transactionId);

                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )} */}
        {deleteItem && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => {
      setDeleteItem(null);
      setDeletePhone("");
    }}
  >
    <div
      className="bg-white-common rounded-lg p-6 w-[400px]"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold mb-3 text-left">
        Delete Transaction
      </h3>

      <p className="text-sm text-gray-600 mb-4 text-left">
        Enter tenant mobile number to confirm transaction deletion.
      </p>

      <input
        type="text"
        value={deletePhone}
        maxLength={10}
        placeholder="Enter mobile number"
        onChange={(e) => {
          const value = e.target.value;

          if (/^\d*$/.test(value)) {
            setDeletePhone(value);
          }
        }}
        className="
          w-full
          border
          border-gray-300
          rounded-lg
          px-3
          py-2
          mb-5
          outline-none
          focus:border-blue-500
        "
      />

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 border rounded cursor-pointer"
          onClick={() => {
            setDeleteItem(null);
            setDeletePhone("");
          }}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
          onClick={() => {
            handleDelete(
              deleteItem.transactionId,
              deletePhone
            );
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
      </div>
      <InvoiceOverviewDrawer
        show={showInvoiceDrawer}
        onClose={() =>
          setShowInvoiceDrawer(false)
        }
        invoice={selectedInvoice}
      />

      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowDeleteModal(false);
            setDeletePhone("");
            setAmountError("");
          }}
        >
          <div
            className="bg-white-common rounded-xl p-6 w-[420px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-left">
              Delete Invoice
            </h3>

            <p className="text-sm text-gray-500 mt-2 text-left">
              Enter tenant mobile number to confirm invoice deletion.
            </p>

            <div className="mt-5">
              <label className="block text-sm font-medium text-left mb-2">
                Mobile Number
              </label>

              <input
                type="text"
                value={deletePhone}
                maxLength={10}
                placeholder="Enter mobile number"
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d*$/.test(value)) {
                    setDeletePhone(value);
                    setAmountError("");
                  }
                }}
                className="
            w-full
            border
            border-gray-300
            rounded-lg
            px-3
            py-2
            outline-none
            focus:border-blue-500
          "
              />

              {amountError && (
                <p className="text-red-500 text-sm mt-2 text-left">
                  {amountError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 border rounded-lg"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePhone("");
                  setAmountError("");
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={handleDeleteInvoice}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showRedemptionEditModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]"
          onClick={() => {
            setShowRedemptionEditModal(false);
            setSelectedItem(null);
            setAmountError("")
          }}
        >

          <div
            className="bg-white-common rounded-xl w-[400px] p-6 shadow-xl"
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
                  setShowRedemptionEditModal(false)
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
      {showRedemptionDeleteModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]"
          onClick={() => {
            setShowRedemptionDeleteModal(false);
            setDeleteId(null);
            setAmountError("")
          }}
        >

          <div
            className="bg-white-common rounded-xl w-[400px] p-6 shadow-xl"
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
                  setShowRedemptionDeleteModal(false);
                  setDeleteId(null);
                  setAmountError("")
                }}
                className="px-4 py-2 border rounded-lg cursor-pointer"
              >
                Cancel
              </button>

              {/* <button
                onClick={async () => {
      
                  await handleDeleteInvoiceRedemption(deleteId);
                  setDeleteId(null);
      
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
              >
                Delete
              </button> */}
              <button
                onClick={async () => {

                  await handleDeleteInvoiceRedemption(selectedRedemption?.id);
                  setDeleteId(null);

                }}
                disabled={isDeleting}
                className={`
          px-4 py-2 rounded-lg text-white
      
          ${isDeleting
                    ? "delete-btn-disabled"
                    : "delete-btn-active"
                  }
        `}
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          </div>

        </div>
      )}
      {showAmountModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAmountModal(false)}
        >
          <div
            className="bg-white-common rounded-xl p-6 w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">
              Update Amount
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to update the advance amount?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 border rounded-lg"
                onClick={() => setShowAmountModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={handleUpdateAmount}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TenantOverview;