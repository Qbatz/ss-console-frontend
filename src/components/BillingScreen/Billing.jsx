import React from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Group from "../../assets/Group.png";

const Billing = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between border-b border-gray-200">
        <h1 className="text-[20px] font-sans font-medium p-3">
          Billing
        </h1>

        <div className="text-blue-500 text-[12px] rounded-xl bg-[#F8F9FF] p-2 pr-3 ">
          <button 
          className="flex items-center gap-2">
            <img src={Group} alt="group" className="w-3 h-3" />
            Tax & Charges Configuration
          </button>
        </div>
      </div>




      <div className="">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-230px)] ">
          <div className="flex-1 overflow-x-auto overflow-y-auto font-sans ">

            <table className="w-max min-w-full table-fixed text-sm text-left">
              <thead className="bg-[#F8F9FF] text-gray-600 text-xs uppercase sticky top-0 z-40">
                <tr>
                  <th className="px-4 py-3 sticky left-0 bg-[#F8F9FF] z-50 w-[80px]">
                    RECEIPT
                  </th>
                  <th className="px-4 py-3 sticky left-0 bg-[#F8F9FF] z-50 w-[80px]">
                    PROPERTY NAME
                  </th>
                  <th className="px-4 py-3 sticky left-0 bg-[#F8F9FF] z-50 w-[80px]">
                    NAME
                  </th>
                  <th className="px-4 py-3 sticky left-0 bg-[#F8F9FF] z-50 w-[80px]">
                    AMOUNT
                  </th>
                  <th className="px-4 py-3 sticky left-0 bg-[#F8F9FF] z-50 w-[80px]">
                    DATE
                  </th>

                  <th className="px-4 py-3 sticky left-0 bg-[#F8F9FF] z-50 w-[80px]">
                    STATUS
                  </th>
                  <th className="px-4 py-3 sticky left-0 bg-[#F8F9FF] z-50 w-[80px]">
                    ACTION
                  </th>

                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
