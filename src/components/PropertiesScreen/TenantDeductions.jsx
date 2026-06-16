import React from "react";
import {
  useLocation
} from "react-router-dom";

import DashboardLayout
from "../SidebarScreen/SidebarLayout";

const TenantDeductions = () => {

  const { state } =
    useLocation();

  const tenantData =
    state?.tenantData;

  // dummy data
  const deductions = [
    {
      type: "Electricity",
      amount: 2500,
      paidAmount: 1500
    },
    {
      type: "Maintenance",
      amount: 1200,
      paidAmount: 1200
    },
    {
      type: "Damage",
      amount: 3000,
      paidAmount: 0
    }
  ];

  return (

    <DashboardLayout>

      <div
        className="
          p-6
          bg-[#F8FAFC]
          min-h-screen
        "
      >

        {/* PAGE TITLE */}
        <div className="mb-6">

          <h1
            className="
              text-[28px]
              font-bold
              text-gray-800
            "
          >
            Tenant Deductions
          </h1>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            Manage tenant deduction details
          </p>

        </div>


        {/* TENANT DETAILS CARD */}
        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            shadow-sm
            p-6
            mb-6
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-5
            "
          >

            <h2
              className="
                text-xl
                font-semibold
                text-gray-800
              "
            >
              Tenant Details
            </h2>

            <span
              className="
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                bg-green-100
                text-green-700
              "
            >
              CHECK_IN
            </span>

          </div>


          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
            "
          >

            {/* NAME */}
            <div>

              <p
                className="
                  text-xs
                  text-gray-500
                  mb-1
                "
              >
                Tenant Name
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                {tenantData?.fullName}
              </p>

            </div>


            {/* MOBILE */}
            <div>

              <p
                className="
                  text-xs
                  text-gray-500
                  mb-1
                "
              >
                Mobile Number
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                +91 {tenantData?.mobile}
              </p>

            </div>


            {/* CUSTOMER ID */}
            <div>

              <p
                className="
                  text-xs
                  text-gray-500
                  mb-1
                "
              >
                Customer ID
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                {tenantData?.customerId}
              </p>

            </div>

          </div>

        </div>


        {/* TABLE GRID */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
          "
        >

          {/* LEFT TABLE */}
          <div
            className="
              bg-white
              rounded-2xl
              border
              border-gray-200
              shadow-sm
              overflow-hidden
            "
          >

            {/* HEADER */}
            <div
              className="
                px-6
                py-5
                border-b
                border-gray-200
                bg-gray-50
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                "
              >
                Deduction List
              </h2>

              <button
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-600
                  text-white
                  text-sm
                  hover:bg-blue-700
                  cursor-pointer
                "
              >
                + Add
              </button>

            </div>


            {/* TABLE */}
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead
                  className="
                    bg-gray-50
                  "
                >

                  <tr>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                      "
                    >
                      Type
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                      "
                    >
                      Amount
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                      "
                    >
                      Paid Amount
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {deductions.map(
                    (item, index) => (

                      <tr
                        key={index}
                        className="
                          border-t
                          border-gray-100
                          hover:bg-gray-50
                        "
                      >

                        <td
                          className="
                            px-6
                            py-4
                            text-sm
                            font-medium
                            text-gray-800
                          "
                        >
                          {item.type}
                        </td>

                        <td
                          className="
                            px-6
                            py-4
                            text-sm
                            text-gray-700
                          "
                        >
                          ₹ {item.amount}
                        </td>

                        <td
                          className="
                            px-6
                            py-4
                            text-sm
                            font-semibold
                            text-green-600
                          "
                        >
                          ₹ {item.paidAmount}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* RIGHT TABLE */}
          <div
            className="
              bg-white
              rounded-2xl
              border
              border-gray-200
              shadow-sm
              overflow-hidden
            "
          >

            {/* HEADER */}
            <div
              className="
                px-6
                py-5
                border-b
                border-gray-200
                bg-gray-50
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                "
              >
                Paid Deductions
              </h2>

              <button
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-600
                  text-white
                  text-sm
                  hover:bg-blue-700
                  cursor-pointer
                "
              >
                + Add
              </button>

            </div>


            {/* TABLE */}
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead
                  className="
                    bg-gray-50
                  "
                >

                  <tr>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                      "
                    >
                      Type
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                      "
                    >
                      Amount
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                      "
                    >
                      Paid Amount
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {deductions.map(
                    (item, index) => (

                      <tr
                        key={index}
                        className="
                          border-t
                          border-gray-100
                          hover:bg-gray-50
                        "
                      >

                        <td
                          className="
                            px-6
                            py-4
                            text-sm
                            font-medium
                            text-gray-800
                          "
                        >
                          {item.type}
                        </td>

                        <td
                          className="
                            px-6
                            py-4
                            text-sm
                            text-gray-700
                          "
                        >
                          ₹ {item.amount}
                        </td>

                        <td
                          className="
                            px-6
                            py-4
                            text-sm
                            font-semibold
                            text-blue-600
                          "
                        >
                          ₹ {item.paidAmount}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );
};

export default TenantDeductions;