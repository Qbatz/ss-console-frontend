import React, { useState, useEffect } from "react";
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

const InvoiceView = ({ hostelData }) => {

    const { getInvoicesByHostelId } = useHostel();

    // DEFAULT 50 RECORDS
    const defaultInvoices = hostelData?.invoices || [];

    const [expandedInvoice, setExpandedInvoice] = useState(null);

    // API DATA
    const [invoiceData, setInvoiceData] = useState([]);

    // MORE CLICK
    const [isMore, setIsMore] = useState(false);

    // API PAGE -> 0 BASED
    const [page, setPage] = useState(1);

    // PAGE SIZE
    const [size, setSize] = useState(10);

    // PAGINATION INFO
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // TABLE DATA
    const invoices = isMore
        ? invoiceData
        : defaultInvoices;

    // FETCH API DATA
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

    return (

        <div className="p-5">

            <div
                className="
          bg-white
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

                        {/* HEADER */}
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

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Status
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
                                                <div
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

                                                </div>

                                                {/* ICON */}
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
                                        <td className="px-5 py-2 text-xs text-start">

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
                            bg-white
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
                                {totalItems}
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
                            </select>


                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                ◀
                            </button>


                            <span className="border px-3 py-1 rounded bg-gray-50">
                                {page}
                            </span>


                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                ▶
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};

export default InvoiceView;