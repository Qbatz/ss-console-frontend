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
import React, { useEffect, useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useHostel } from "../../Context/HostelListContext";

const InvoicesScreen = ({ hostelData}) => {
  console.log("hostelData",hostelData)
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
  hostelData?.hostelName
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
   
      <div className="p-6 space-y-6">

        {/* HEADER */}
       

        {/* SEARCH */}
        {/* <div className="flex justify-end">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="w-[250px] border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div> */}

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
  
  );
};

export default InvoicesScreen;