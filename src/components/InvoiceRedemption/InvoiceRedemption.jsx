import React, { useEffect, useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useHostel } from "../../Context/HostelListContext";

const InvoiceRedemption = () => {
   const { getInvoiceRedemption, loading } = useHostel();
  
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState("");
  
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
  console.log("data",data)
    return (
     <DashboardLayout>
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
                    <th className="px-3 py-2 text-left whitespace-nowrap">Reference</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Reason</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Redeemed At</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Created At</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Created By</th>
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
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.referenceNumber}</td>
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.reason}</td>
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                          {item.redeemedAtDate} {item.redeemedAtTime}
                        </td>
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                          {item.createdAtDate} {item.createdAtTime}
                        </td>
                        <td className="px-4 py-2 text-left font-medium text-[12px] whitespace-nowrap">{item.createdBy}</td>
  
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
          </div>
  
        </div>
    </DashboardLayout>
    );
  };

export default InvoiceRedemption;