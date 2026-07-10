import React, { useState, useEffect, useRef } from "react";
import {
    Calendar,
    ReceiptItem,
    Profile2User,
    MoneyRecive,
    TickCircle,
    CloseCircle,
} from "iconsax-react";
import ArrowDown2 from "../../assets/direction-down 01.png";
import { useHostel } from "../../Context/HostelListContext";
import Circle from "../../assets/menucircle.png";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";
import Arrow from "../../assets/arrow-right.png";
import { useNavigate } from "react-router-dom";


const InvoiceView = ({ hostelData, refreshHostel }) => {
    const navigate = useNavigate();
    const { getInvoicesByHostelId, deleteInvoice, updateAdvanceAmount } = useHostel();
    const defaultInvoices = hostelData?.invoices || [];
    const [expandedInvoice, setExpandedInvoice] = useState(null);
    const [invoiceData, setInvoiceData] = useState([]);

    const [isMore, setIsMore] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [openMenu, setOpenMenu] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [deletePhone, setDeletePhone] = useState("");

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [amountError, setAmountError] = useState("")
    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [showFilterDrawer, setShowFilterDrawer] = useState(false);
const [activeFilter, setActiveFilter] = useState("All");
    const [menuPosition, setMenuPosition] = useState({
        top: 0,
        left: 0,
    });
    const [showAmountModal, setShowAmountModal] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setOpenMenu(null);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);
    const invoices = isMore
        ? invoiceData
        : defaultInvoices;

    const fetchInvoices = async (pageNo = 0) => {

        console.log("PAGE NO", pageNo);

        const res = await getInvoicesByHostelId(
            hostelData?.hostelId,
            pageNo,
            size
        );

        console.log("API RESPONSE", res);

        setInvoiceData(res?.invoiceList || []);

        setTotalItems(res?.totalItems || 0);

        setTotalPages(res?.totalPages || 0);

    };

    // MORE BUTTON
    const handleMoreClick = () => {

        setIsMore(true);

        // FIRST PAGE -> API PAGE 0
        setPage(1);

    };

    // API CALL
    useEffect(() => {

        if (isMore) {
            fetchInvoices(page);
        }

    }, [page, size, isMore]);
    const handleDeleteInvoice = async () => {
        if (!deletePhone) {
            setAmountError("Mobile number is required");
            return;
        }

        // 10 digit validation
        if (deletePhone.length !== 10) {
            setAmountError("Mobile number must be 10 digits");
            return;
        }

        const payload = [
            {
                invoiceId: selectedInvoice?.invoiceId,
                tenantMobile: Number(deletePhone)
            }
        ];

        const res = await deleteInvoice(payload);

        if (res?.success) {


            setModalType("success");
            setMessage(res.data);
            setShowSuccess(true);
            refreshHostel()

            setTimeout(() => {

                setShowSuccess(false);
                setShowDeleteModal(false);
                setDeletePhone("");

                setSelectedInvoice(null);

                fetchInvoices(page);

            }, 800);

        }
        else {
            setAmountError(res.message)
        }

    };

    const handleUpdateAmount = async () => {
        const res = await updateAdvanceAmount(
            hostelData?.hostelId,
            selectedInvoice?.invoiceId,

        );

        if (res?.success) {

            setModalType("success");
            setMessage(res.data);
            setShowSuccess(true);


            setTimeout(() => {
                setShowSuccess(false);
                setShowAmountModal(false);
            }, 800);


            fetchInvoices(page);
        }
        else {
            setModalType("error");
            setMessage(res.message);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);

            }, 800);
        }
    };
    return (
        <>
            <Toast
                show={showSuccess}
                message={message}
                type={modalType}

            />
            <div className="p-5">

                <div
                    className="
          bg-white-common
          rounded-3xl
          border border-gray-100
          overflow-hidden
          shadow-sm
        "
                >

                    <div
                        className="
            overflow-y-auto
            max-h-[300px]
          "
                    >

                        <table className="w-full">

                            <thead
                                className="
    bg-[#f8fafc]
    border-b border-gray-100
    sticky top-0 z-20
  "
                            >

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Invoice
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Tenant
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Type
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Generated
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Due Date
                                    </th>

                                    <th className="px-3 py-4 w-[140px] text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>
                                    <th
                                        className="
    px-1 py-4
    w-[50px]
    text-center
    text-[11px]
    font-semibold
    uppercase
    tracking-wide
    text-gray-500
  "
                                    >
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            {/* BODY */}
                            <tbody>

                                {invoices?.map((item) => (

                                    <React.Fragment key={item.invoiceId}>

                                        <tr
                                            className="
                      border-b border-gray-100
                      hover:bg-blue-50/30
                      transition-all duration-200
                    "
                                        >

                                            {/* INVOICE */}
                                            <td className="px-5 py-2">

                                                <div className="flex items-center gap-3">

                                                    {/* DROPDOWN */}
                                                    {/* <div
                                                        onClick={() =>
                                                            setExpandedInvoice(
                                                                expandedInvoice === item.invoiceId
                                                                    ? null
                                                                    : item.invoiceId
                                                            )
                                                        }
                                                        className="
                            w-7 h-7
                            rounded-full
                            bg-gray-100
                            hover:bg-blue-100
                            flex items-center justify-center
                            cursor-pointer
                            transition-all duration-200
                          "
                                                    >

                                                        <div
                                                            className={`
                              transition-transform duration-300
                              ${expandedInvoice === item.invoiceId
                                                                    ? "rotate-180"
                                                                    : ""
                                                                }
                            `}
                                                        >
                                                            <img src={ArrowDown2} className="w-3 h-3" />
                                                        </div>

                                                    </div> */}


                                                    <div
                                                        className="
                            w-9 h-9
                            rounded-2xl
                            bg-blue-100
                            flex items-center justify-center
                          "
                                                    >
                                                        <ReceiptItem
                                                            size="18"
                                                            color="#2563eb"
                                                        />
                                                    </div>

                                                    {/* INFO */}
                                                    <div>

                                                        <p
                                                            className="
                              text-xs
                              font-semibold
                              text-gray-800 text-start
                            "
                                                        >
                                                            {item.invoiceNumber}
                                                        </p>

                                                        <p
                                                            className="
                              text-xs
                              text-gray-400
                            "
                                                        >
                                                            {item.invoiceMode}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* TENANT */}
                                            <td className="px-5 py-2 text-xs text-start">
                                                {item.tenantName}
                                            </td>

                                            {/* TYPE */}
                                            <td className="px-5 py-2 text-xs text-start">
                                                {item.invoiceType}
                                            </td>

                                            {/* GENERATED */}
                                            <td className="px-5 py-2 text-xs text-start">
                                                {item.invoiceGeneratedDate}
                                            </td>

                                            {/* DUE */}
                                            <td className="px-5 py-2 text-xs text-start">
                                                {item.invoiceDueDate}
                                            </td>

                                            {/* STATUS */}
                                            {/* <td className="px-5 py-2 text-xs text-start">

                                            <span
                                                className={`
                          px-3 py-1 rounded-full text-xs font-semibold
                          ${item.paymentStatus === "PAID"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-red-50 text-red-700"
                                                    }
                        `}
                                            >
                                                {item.paymentStatus}
                                            </span>

                                        </td> */}
                                            {/* <td className="w-[270px] py-1 px-2 whitespace-nowrap overflow-hidden">
          {(item?.paymentStatus === "PENDING" ||
        item?.paymentStatus === "PARTIAL_PAYMENT") && (
            <span className="bg-[#FFD9D9] rounded-[13px] px-3 py-1">
              {item?.paymentStatus}
            </span>
          )}

          {item?.paymentStatus === "PAID" && (
            <span className="cursor-pointer bg-[#B3E5BB4D] rounded-[14px] px-3 py-1">
              {item?.paymentStatus}
            </span>
          )}

          {(item?.paymentStatus === "Refunded" ||
            item?.paymentStatus === "Partially Refunded") && (
            <span className="bg-[#FFF3CD] rounded-[14px] px-3 py-1">
              {item?.paymentStatus}
            </span>
          )}

          {item?.paymentStatus === "PENDING_REFUND" && (
            <span className="bg-[#FFE6B3] rounded-[14px] px-3 py-1">
              {item?.paymentStatus}
            </span>
          )}
          {item?.isCancelled && (
            <span className="bg-[#FFE6B3] rounded-[14px] px-3 py-1">
              Cancelled
            </span>
          )}
        </td> */}
                                            {/* <td className="w-[270px] py-1 px-2 ">
  <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto scrollbar-hide">

    {item?.isCancelled ? (

      <span className="bg-[#FFE5E5] text-[#C62828] rounded-[14px] px-3 py-1 shrink-0 font-[11px]">
        Cancelled
      </span>

    ) : item?.paymentStatus === "PENDING" ||
      item?.paymentStatus === "PARTIAL_PAYMENT" ? (

      <span className="bg-[#FFD9D9] text-[#D32F2F] rounded-[13px] px-3 py-1 shrink-0 font-[11px]">
        {item?.paymentStatus}
      </span>

    ) : item?.paymentStatus === "PAID" ? (

      <span className="bg-[#E6F7EA] text-[#1B8A3D] rounded-[14px] px-3 py-1 shrink-0 font-[11px]">
        PAID
      </span>

    ) : item?.paymentStatus === "PENDING_REFUND" ? (

      <span className="bg-[#FFF3CD] text-[#B78103] rounded-[14px] px-3 py-1 shrink-0 font-[11px]">
        PENDING_REFUND
      </span>

    ) : null}

  </div>
</td> */}
                                            <td className="w-[270px] py-1 px-2 whitespace-nowrap overflow-hidden text-[11px] font-medium text-start">

                                                {item?.paymentStatus === "PAID" && (
                                                    <span className="bg-[#B3E5BB4D] text-green-700 rounded-[14px] px-3 py-1 text-[11px] font-medium">
                                                        Paid
                                                    </span>
                                                )}

                                                {item?.paymentStatus === "PENDING" && (
                                                    <span className="bg-[#FFD9D9] text-red-600 rounded-[14px] px-3 py-1 text-[11px] font-medium">
                                                        Pending
                                                    </span>
                                                )}

                                                {item?.paymentStatus === "PARTIAL_PAYMENT" && (
                                                    <span className="bg-[#FFE5B4] text-orange-600 rounded-[14px] px-3 py-1 text-[11px] font-medium">
                                                        Partial Payment
                                                    </span>
                                                )}

                                                {item?.paymentStatus === "ADVANCE_IN_HAND" && (
                                                    <span className="bg-[#D9E8FF] text-blue-700 rounded-[14px] px-3 py-1 text-[11px] font-medium">
                                                        Advance in hand
                                                    </span>
                                                )}

                                                {item?.paymentStatus === "CANCELLED" && (
                                                    <span className="bg-[#FFE6B3] text-yellow-700 rounded-[14px] px-3 py-1 text-[11px] font-medium">
                                                        Cancelled
                                                    </span>
                                                )}

                                                {item?.paymentStatus === "PENDING_REFUND" && (
                                                    <span className="bg-[#FFF3CD] text-amber-700 rounded-[14px] px-3 py-1 text-[11px] font-medium">
                                                        Refund
                                                    </span>
                                                )}

                                                {item?.paymentStatus === "PARTIAL_REFUND" && (
                                                    <span className="bg-[#FDE2FF] text-pink-700 rounded-[14px] px-3 py-1 text-[11px] font-medium">
                                                        Partial Refund
                                                    </span>
                                                )}

                                                {item?.paymentStatus === "REFUNDED" && (
                                                    <span className="bg-[#E2F7E1] text-green-700 rounded-[14px] px-3 py-1 text-[11px] font-medium">
                                                        Refunded
                                                    </span>
                                                )}

                                            </td>
                                            <td
                                                className="
    px-1 py-3
    w-[50px]
    text-center
    relative
  "
                                                ref={openMenu === item.invoiceId ? menuRef : null}
                                            >

                                                <div className="flex items-center justify-start">

                                                    <img
                                                        src={Circle}
                                                        className="w-4 h-4 cursor-pointer"
                                                        alt="menu"
                                                        // onClick={() =>
                                                        //     setOpenMenu(
                                                        //         openMenu === item.invoiceId
                                                        //             ? null
                                                        //             : item.invoiceId
                                                        //     )
                                                        // }
                                                        onClick={(e) => {

                                                            e.stopPropagation();

                                                            const rect = e.currentTarget.getBoundingClientRect();

                                                            const viewportHeight = window.innerHeight;

                                                            const menuHeight = 100;

                                                            const spaceBelow = window.innerHeight - rect.bottom;

                                                            setMenuPosition({
                                                                top:
                                                                    spaceBelow < menuHeight
                                                                        ? rect.top - menuHeight
                                                                        : rect.bottom + 5,

                                                                left: rect.left - 120,
                                                            });

                                                            setOpenMenu(
                                                                openMenu === item.invoiceId
                                                                    ? null
                                                                    : item.invoiceId
                                                            );

                                                        }}
                                                    />

                                                </div>

                                                {openMenu === item.invoiceId && (

                                                    <div
                                                        className="
    fixed
    bg-white-common border border-gray-200
    rounded-lg shadow-lg z-[99999]
    max-w-[120px]
  "
                                                        style={{
                                                            top: menuPosition.top,
                                                            left: menuPosition.left + 10,
                                                        }}
                                                    >


                                                        {item?.canShowReceipts === true && (
                                                            <button
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/invoice-receipt/${hostelData?.hostelId}/${item.invoiceId}`,
                                                                        {
                                                                            state: {
                                                                                hostelData,
                                                                                invoiceData: item,
                                                                            },
                                                                        }
                                                                    )
                                                                }
                                                                className="w-full text-left px-3 py-2 text-sm cursor-pointer whitespace-nowrap"
                                                            >
                                                                Invoice Receipt
                                                            </button>
                                                        )}
                                                        {/* <button  onClick={() =>
    navigate(
      `/invoice-receipt/${hostelData?.hostelId}/${item.invoiceId}`,
      {
        state: {
          hostelData,
          invoiceData: item,
        },
      }
    )
  }
                                                            className="
          w-full text-left
          px-3 py-2 text-sm
          
           cursor-pointer whitespace-nowrap
        "

                                                        >
                                                            Invoice Receipt
                                                        </button> */}
                                                        <button
                                                            className="
          w-full text-left
          px-3 py-2 text-sm
          hover:bg-red-50
          text-red-600 cursor-pointer
        "
                                                            onClick={() => {

                                                                setSelectedInvoice(item);

                                                                setShowDeleteModal(true);

                                                                setOpenMenu(null);

                                                            }}
                                                        >
                                                            Delete
                                                        </button>



                                                        {/* <button
                                                            className="w-full text-left px-3 py-2 text-sm cursor-pointer whitespace-nowrap"
                                                            onClick={() => {
                                                                setSelectedInvoice(item);

                                                                setShowAmountModal(true);
                                                                setOpenMenu(null);
                                                            }}
                                                        >
                                                            Update Amount
                                                        </button> */}
                                                        {item?.canUpdateAmount === true && (
                                                            <button
                                                                className="w-full text-left px-3 py-2 text-sm cursor-pointer whitespace-nowrap"
                                                                onClick={() => {
                                                                    setSelectedInvoice(item);
                                                                    setShowAmountModal(true);
                                                                    setOpenMenu(null);
                                                                }}
                                                            >
                                                                Update Amount
                                                            </button>
                                                        )}
                                                    </div>

                                                )}

                                            </td>

                                        </tr>

                                        {/* INNER TABLE */}
                                        {expandedInvoice === item.invoiceId && (

                                            <tr>

                                                <td
                                                    colSpan={6}
                                                    className="bg-[#fafcff] px-10 py-2 text-xs text-start"
                                                >

                                                    <div
                                                        className="
                            rounded-2xl
                            border border-gray-100
                            overflow-hidden
                            bg-white-common
                          "
                                                    >

                                                        <table className="w-full">

                                                            {/* INNER HEADER */}
                                                            <thead className="bg-violet-50">

                                                                <tr>

                                                                    <th
                                                                        className="
                                    px-4 py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    text-violet-700
                                  "
                                                                    >
                                                                        ID
                                                                    </th>

                                                                    <th
                                                                        className="
                                    px-4 py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    text-violet-700
                                  "
                                                                    >
                                                                        Item Name
                                                                    </th>

                                                                    <th
                                                                        className="
                                    px-4 py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    text-violet-700
                                  "
                                                                    >
                                                                        Other Item
                                                                    </th>

                                                                </tr>

                                                            </thead>

                                                            {/* INNER BODY */}
                                                            <tbody>

                                                                {item.invoiceItems?.length > 0 ? (

                                                                    item.invoiceItems.map((invoice, i) => (

                                                                        <tr
                                                                            key={invoice.invoiceItemId}
                                                                            className="
        border-t border-gray-100
        hover:bg-violet-50/30
      "
                                                                        >

                                                                            <td className="px-4 py-3">

                                                                                <div className="flex items-center gap-2">

                                                                                    <div
                                                                                        className="
              w-2 h-2
              rounded-full
              bg-violet-500
            "
                                                                                    />

                                                                                    <span
                                                                                        className="
              text-sm
              font-medium
              text-gray-700 text-left
            "
                                                                                    >
                                                                                        {i + 1}
                                                                                    </span>

                                                                                </div>

                                                                            </td>

                                                                            <td className="px-4 py-3 text-left">

                                                                                <div className="flex items-center gap-2">

                                                                                    <div
                                                                                        className="
              w-2 h-2
              rounded-full
              bg-violet-500
            "
                                                                                    />

                                                                                    <span
                                                                                        className="
              text-sm
              font-medium
              text-gray-700
            "
                                                                                    >
                                                                                        {invoice.invoiceItem}
                                                                                    </span>

                                                                                </div>

                                                                            </td>

                                                                            <td
                                                                                className="
          px-4 py-3
          text-sm
          text-gray-600 text-left
        "
                                                                            >
                                                                                {invoice.otherItem || "N/A"}
                                                                            </td>


                                                                        </tr>

                                                                    ))

                                                                ) : (

                                                                    <tr>

                                                                        <td
                                                                            colSpan={3}
                                                                            className="
        py-6
        text-center
        text-sm
        text-gray-400
        font-medium
      "
                                                                        >
                                                                            No Data Found
                                                                        </td>

                                                                    </tr>

                                                                )}

                                                            </tbody>

                                                        </table>

                                                    </div>

                                                </td>

                                            </tr>

                                        )}

                                    </React.Fragment>

                                ))}

                            </tbody>

                        </table>

                    </div>


                    {!isMore && defaultInvoices.length >= 50 && (

                        <div className="flex justify-end mt-3 px-4 pb-4">

                            <button
                                onClick={handleMoreClick}
                                className="
                flex items-center gap-2
                px-3 py-1.5
                text-sm font-medium
                text-blue-600
                bg-blue-50
                border border-blue-200
                rounded-md
                hover:bg-blue-100
              "
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
                                    {invoices.length}
                                </span>
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
                                        invoices?.length === 0
                                    }
                                    onClick={() => setPage((p) => p - 1)}
                                    className={`
    ${page === 1 ||
                                            invoices?.length === 0
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

                                <span className="text-textDark/60 text-cardTitle">
                                    {page} - {totalPages}
                                </span>
                                <button
                                    disabled={
                                        page >= totalPages ||
                                        invoices?.length === 0
                                    }
                                    onClick={() => setPage((p) => p + 1)}
                                    className={`
    ${page >= totalPages ||
                                            invoices?.length === 0
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

                            </div>

                        </div>

                    )}

                </div>

            </div>
            {showDeleteModal && (

                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30"
                    onClick={() => {
                        setShowDeleteModal(false);
                        setAmountError("");
                        setDeletePhone("")

                    }}
                >

                    <div
                        className="bg-white-common rounded-2xl w-[350px] p-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <h2 className="text-lg font-semibold mb-4 text-left">
                            Delete Invoice
                        </h2>

                        <label className="text-sm text-gray-600 block mb-2 text-left">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            value={deletePhone}
                            maxLength={10}
                            onChange={(e) => {
                                const value = e.target.value;

                                // numbers மட்டும் allow
                                if (/^\d*$/.test(value)) {
                                    setDeletePhone(value);
                                    setAmountError("");
                                }
                            }}
                            placeholder="Enter phone number"
                            className="
    w-full border border-gray-300
    rounded-lg px-3 py-2 text-sm
    outline-none
  "
                        />

                        {amountError && (
                            <ErrorMessage message={amountError} type="error" />
                        )}

                        <div className="flex justify-end gap-2 mt-2">

                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletePhone("");
                                    setAmountError("")
                                }}
                                className="
            px-4 py-2 border border-gray-300
            rounded-lg text-sm cursor-pointer
          "
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteInvoice}
                                className="
            px-4 py-2 bg-red-600
            text-white rounded-lg text-sm cursor-pointer
          "
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {showAmountModal && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30"
                    onClick={() => {
                        setShowAmountModal(false);
                    }}
                >
                    <div
                        className="bg-white-common rounded-2xl w-[350px] p-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-3 text-left">
                            Update Amount
                        </h2>

                        <p className="text-sm text-gray-600 mb-5">
                            Are you sure you want to update the advance amount?
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowAmountModal(false);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdateAmount}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm cursor-pointer"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>


    );

};

export default InvoiceView;