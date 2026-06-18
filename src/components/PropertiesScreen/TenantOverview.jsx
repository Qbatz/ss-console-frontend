import React from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import DashboardLayout from "../SidebarScreen/SidebarLayout";

const TenantOverview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tenantData =
    location.state?.tenantData;

  const hostelData =
    location.state?.hostelData;

  return (
    <DashboardLayout>

      <div className="p-6 bg-[#F8F9FC] min-h-screen">

        {/* Header */}
        <div className="flex items-center gap-3 mb-1">

          <button
            onClick={() => navigate(-1)}
            className="text-primaryBlue text-lg"
          >
            ←
          </button>

          <h1 className="text-[22px] font-semibold text-[#1F2937]">
            Tenant Info
          </h1>

        </div>

        <p className="text-[#9CA3AF] text-sm mb-6">
          Properties &gt; Tenant Overview
        </p>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">

          <div className="flex justify-between">

            <div className="flex gap-4">

              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">
                  👤
                </span>
              </div>

              {/* Name */}
              <div>

                <h2 className="text-[28px] font-semibold text-[#1F2937]">
                  {tenantData?.fullName}
                </h2>

                <p className="text-[#6B7280] mt-1">
                  Ground Floor |
                  Room 101 |
                  Bed A
                </p>

              </div>

            </div>

            <button>
              ⋮
            </button>

          </div>

          {/* Info Row */}
          <div className="grid grid-cols-3 gap-8 mt-8">

            <div>
              <p className="text-[#9CA3AF] text-sm">
                Mob No
              </p>

              <p className="font-medium mt-2">
                {tenantData?.mobile ||
                  tenantData?.phone}
              </p>
            </div>

            <div>
              <p className="text-[#9CA3AF] text-sm">
                Staying Hostel
              </p>

              <p className="text-primaryBlue font-medium mt-2">
                {hostelData?.hostelName}
              </p>
            </div>

            <div>
              <p className="text-[#9CA3AF] text-sm">
                Mail
              </p>

              <p className="font-medium mt-2">
                {tenantData?.emailId}
              </p>
            </div>

          </div>

        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-10 border-b">

          <button
            className="
              pb-3
              text-primaryBlue
              border-b-2
              border-primaryBlue
              font-medium
            "
          >
            Invoices
          </button>

          <button
            className="
              pb-3
              text-gray-400
              font-medium
            "
          >
            Transactions
          </button>

        </div>

        {/* Table */}
        <div className="bg-white mt-5 rounded-xl border border-gray-200 overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#F8F9FC]">

              <tr>

                <th className="px-4 py-3 text-left">
                  INVOICE NO
                </th>

                <th className="px-4 py-3 text-left">
                  STATUS
                </th>

                <th className="px-4 py-3 text-left">
                  DATE CREATED
                </th>

                <th className="px-4 py-3 text-left">
                  TYPE
                </th>

                <th className="px-4 py-3 text-left">
                  AMOUNT
                </th>

                <th className="px-4 py-3 text-left">
                  DUE AMOUNT
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>
                <td className="px-4 py-3 text-primaryBlue">
                  #FS-2025-001
                </td>

                <td className="px-4 py-3">
                  Pending
                </td>

                <td className="px-4 py-3">
                  02-Oct-2025
                </td>

                <td className="px-4 py-3">
                  Settlement
                </td>

                <td className="px-4 py-3">
                  ₹ 1,299
                </td>

                <td className="px-4 py-3">
                  ₹ 0
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default TenantOverview;