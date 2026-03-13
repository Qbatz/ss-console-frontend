import React, { useState } from "react";
import Share from "../../assets/share.png";
import LoginImg from "../../assets/LoginImg.png";
import { usePermission } from "../../Utils/permissionHelper";

const InvoicesScreen = () => {
const { canRead, canWrite, canUpdate, canDelete } =
      usePermission("Invoices");
  const [step, setStep] = useState("restricted"); 
  // restricted → verify → table

  return (
    <>
    {canRead === false ? (
    
      <div className="flex flex-col items-center justify-center h-[350px] gap-4">
    
        <img
          src={LoginImg}
          alt="Access Restricted"
          className="w-64 object-contain"
        />
    
        <p className="text-red-600 text-lg font-medium">
          Access Restricted
        </p>
    
      </div>
    
    ) : (
    <div className="py-10">

      
      {step === "restricted" && (
        <div className="flex items-center justify-center py-16">

          <div className="bg-white border border-[#E6E8F0] rounded-xl p-8 w-full max-w-xl text-center shadow-sm">

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Financial Data Access Restricted
            </h2>

            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Invoice and billing records contain sensitive financial information
              of this property. To protect proprietor data, access requires
              verification approval.
            </p>

            <div className="flex items-center justify-center gap-4">

              <button className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600">
                Cancel
              </button>

              <button
                onClick={() => setStep("verify")}
                className="px-5 py-2 rounded-lg bg-[#2563EB] text-white font-medium flex items-center gap-2"
              >
                <img src={Share} width={18} height={18} />
                Request Access
              </button>

            </div>

          </div>
        </div>
      )}


      
      {step === "verify" && (
        <div className="flex items-center justify-center py-16">

          <div className="bg-white border border-[#E6E8F0] rounded-xl p-8 w-full max-w-md text-center shadow-sm">

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Verify Access Code
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              A 6-digit verification code has been sent to the registered proprietor email.
            </p>

            {/* OTP BOXES */}
            <div className="flex justify-center gap-3 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  maxLength={1}
                  className="w-10 h-10 border border-gray-300 rounded-md text-center text-lg"
                />
              ))}
            </div>

            <div className="flex justify-between text-sm">

              <button
                className="text-gray-500"
                onClick={() => setStep("restricted")}
              >
                Cancel
              </button>

              <button
                onClick={() => setStep("table")}
                className="text-[#2563EB] font-medium"
              >
                Verify
              </button>

            </div>

          </div>
        </div>
      )}


     
      {step === "table" && (
        <div className="bg-white border border-[#E6E8F0] rounded-xl p-4">

          <div className="max-h-[300px] overflow-y-auto">

            <table className="w-full text-sm">

              <thead className="bg-[#F1F3F7] sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left">INVOICE ID</th>
                  <th className="px-4 py-3 text-left">TENANT NAME</th>
                  <th className="px-4 py-3 text-left">AMOUNT</th>
                  <th className="px-4 py-3 text-left">STATUS</th>
                  <th className="px-4 py-3 text-left">CREATED DATE</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">

                {Array.from({ length:1 }).map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3">INV-2025-00{i}</td>
                    <td className="px-4 py-3">Ravi Kumar</td>
                    <td className="px-4 py-3">₹ 5,000</td>
                    <td className="px-4 py-3 text-green-600">Paid</td>
                    <td className="px-4 py-3">27 Sep 2025</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
    )}
    </>
  );
};

export default InvoicesScreen;