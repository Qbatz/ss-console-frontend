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
import { usePermission } from "../../Utils/permissionHelper";


const InvoiceView = ({ hostelData, refreshHostel, onSearch }) => {
    const navigate = useNavigate();
    const { getInvoicesByHostelId, deleteInvoice, updateAdvanceAmount } = useHostel();
    const defaultInvoices = hostelData?.invoices || [];
    const [expandedInvoice, setExpandedInvoice] = useState(null);
    const [invoiceData, setInvoiceData] = useState([]);
    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const { canRead, canWrite, canUpdate, canDelete } =
        usePermission("Invoices");
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
    const invoiceSearchTimer = useRef(null);

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
    const invoices = isMore ? invoiceData : defaultInvoices;
    const handleSearch = () => {
        const value = search.trim();

        if (isMore) {
            setPage(1);
            setAppliedSearch(value);
        } else {
            onSearch?.(value);
        }
    };

    const fetchInvoices = async (pageNo = 0, searchValue = search) => {
        const res = await getInvoicesByHostelId(
            hostelData?.hostelId,
            pageNo,
            size,
            searchValue
        );

        console.log("Search response:", res);

        setInvoiceData(res?.invoiceList || []);
        setTotalItems(res?.totalItems || 0);
        setTotalPages(res?.totalPages || 0);
    };

    // const fetchInvoices = async (pageNo = 0) => {

    //     console.log("PAGE NO", pageNo);

    //     const res = await getInvoicesByHostelId(
    //         hostelData?.hostelId,
    //         pageNo,
    //         size
    //     );

    //     console.log("API RESPONSE", res);

    //     setInvoiceData(res?.invoiceList || []);

    //     setTotalItems(res?.totalItems || 0);

    //     setTotalPages(res?.totalPages || 0);

    // };

    // MORE BUTTON
    const handleMoreClick = () => {

        setIsMore(true);

        // FIRST PAGE -> API PAGE 0
        setPage(1);

    };

    useEffect(() => {
        if (!isMore) return;

        fetchInvoices(page - 1, appliedSearch);
    }, [page, size, isMore, appliedSearch, hostelData?.hostelId]);

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
            <div className="flex justify-end px-5 pt-4">
                <div className="relative w-full sm:w-[280px]">
                    <input
                        type="text"
                        placeholder="Search invoice..."
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearch(value);

                            clearTimeout(invoiceSearchTimer.current);

                            invoiceSearchTimer.current = setTimeout(() => {
                                if (isMore) {
                                    setPage(1);
                                    setAppliedSearch(value.trim());
                                } else {
                                    onSearch?.(value.trim());
                                }
                            }, 500);
                        }}
                        className="
        w-full
        h-10
        pl-10 pr-4
        text-sm
        border border-gray-200
        rounded-xl
        bg-white
        shadow-sm
        outline-none
        transition-all
        focus:border-blue-400
        focus:ring-2
        focus:ring-blue-100
      "
                    />

                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                    </svg>
                </div>
            </div>
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

                                    <th className="px-5 py-3 text-left text-xs font-semibold w-[120px] min-w-[120px] max-w-[120px] text-gray-500">
                                        TENANT
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

                                    <th className="px-5 py-4 text-left text-[12px] font-semibold text-[#6b7280] w-[150px] min-w-[150px] max-w-[150px]">
                                        STATUS
                                    </th>
                                    <th
                                        className="
    px-1 py-4
    w-[100px]
    text-left
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
 {invoices?.length > 0 ? (
    invoices.map((item) => (

                                    <React.Fragment key={item.invoiceId}>

                                        <tr
                                            className="
                      border-b border-gray-100
                      hover:bg-blue-50/30
                      transition-all duration-200
                    "
                                        >

                                            
                                            <td className="px-5 py-2">

                                                <div className="flex items-center gap-3">




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

                                         
                                            <td className="px-5 py-2 text-left text-sm w-[120px] min-w-[120px] max-w-[120px]">
                                                <div
                                                    className="w-full truncate"
                                                    title={item?.tenantName || "N/A"}
                                                >
                                                    {item?.tenantName || "N/A"}
                                                </div>
                                            </td>

                                            
                                            <td className="px-5 py-2 text-xs text-start">
                                                {item.invoiceType}
                                            </td>

                                            
                                            <td className="px-5 py-2 text-xs text-start">
                                                {item.invoiceStartDate}
                                            </td>

                                            
                                            <td className="px-5 py-2 text-xs text-start">
                                                {item.invoiceDueDate}
                                            </td>

                                            <td className="w-[150px] py-1 px-2 whitespace-nowrap overflow-hidden text-[11px] font-medium text-start">

                                                {item?.isCancelled === true ? (
                                                    <span className="bg-[#FFE6B3] text-yellow-700 rounded-[14px] px-3 py-1 text-[11px] font-medium">
                                                        Cancelled
                                                    </span>
                                                ) : (
                                                    <>
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
                                                    </>
                                                )}

                                            </td>
                                            <td
                                                className="
    px-1 py-3
   w-[100px] min-w-[100px] max-w-[100px]
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
                  
                                                        <button
                                                            disabled={!canDelete}
                                                            onClick={() => {
                                                                if (!canDelete) return;

                                                                setSelectedInvoice(item);
                                                                setShowDeleteModal(true);
                                                                setOpenMenu(null);
                                                            }}
                                                            className={`w-full text-left px-3 py-2 text-sm ${canDelete
                                                                    ? "text-red-600 hover:bg-red-50 cursor-pointer"
                                                                    : "text-gray-400 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            Delete
                                                        </button>



                                                      
                                                        {item?.canUpdateAmount === true && (
                                                           
                                                            <button
                                                                disabled={!canUpdate}
                                                                onClick={() => {
                                                                    if (!canUpdate) return;

                                                                    setSelectedInvoice(item);
                                                                    setShowAmountModal(true);
                                                                    setOpenMenu(null);
                                                                }}
                                                                className={`w-full text-left px-3 py-2 text-sm whitespace-nowrap ${canUpdate
                                                                        ? "cursor-pointer hover:bg-gray-100"
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

                                ))): (<tr>
      <td
        colSpan={7}
        className="py-10 text-center text-sm font-medium text-gray-400"
      >
        No Data Found
      </td>
    </tr> )}

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