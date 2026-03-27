import React from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Basic Plan",
    price: 599,
    yearly: 7188,
    active: true,
    features: [
      "Dashboard & Property Management",
      "Tenant & Room Management",
      "Asset and Expense Management",
      "Auto Recurring Invoices",
      "Complaint Management",
      "Due Reminders (In-App & Email)",
      "EB Calculation",
      "Rent Collection Tracking",
      "Reports & Insights",
    ],
  },
  {
    name: "Premium Plan",
    price: 999,
    yearly: 11988,
    active: true,
    features: [
      "Dashboard & Property Management",
      "Tenant & Room Management",
      "Asset and Expense Management",
      "Auto Recurring Invoices",
      "Complaint Management",
      "Due Reminders (In-App & Email)",
      "EB Calculation",
      "Rent Collection Tracking",
      "Reports & Insights",
      "Secure Cloud Storage",
      "Unlimited Staff Access",
    ],
  },
];

const ManagePlans = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="px-6 py-4 bg-white border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ArrowLeft size={18} onClick={() => navigate(-1)} className="cursor-pointer" />
            <div>
              <h1 className="text-lg font-semibold">Manage Plans</h1>
              <p className="text-xs text-gray-500">
                Subscriptions &gt; Manage Plans
              </p>
            </div>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            + Add New Plan
          </button>
        </div>

        <div className="p-6">

          {/* REVENUE CARD */}
          <div className="bg-white rounded-xl p-6 mb-6 border">
            <p className="text-xs text-gray-500 mb-2">
              TOTAL RECURRING REVENUE
            </p>
            <h2 className="text-2xl font-bold text-gray-800">
              ₹1,366,850.00
            </h2>

            <div className="flex gap-10 mt-4 text-sm text-gray-600">
              <div>
                <p>Active Subscribers</p>
                <p className="font-semibold text-gray-800">182</p>
              </div>
              <div>
                <p>Average Recurring/Month</p>
                <p className="font-semibold text-gray-800">₹109,018</p>
              </div>
            </div>
          </div>

          {/* ACTIVE PLANS */}
          <h2 className="text-lg font-semibold mb-4">Active Plans</h2>

          {/* TOGGLE */}
          <div className="flex mb-6">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button className="px-5 py-1 text-sm bg-blue-600 text-white rounded-full">
                Monthly
              </button>
              <button className="px-5 py-1 text-sm text-gray-600">
                Yearly -20%
              </button>
            </div>
          </div>

          {/* PLAN CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {plans.map((plan, index) => (
              <div key={index} className="bg-white border rounded-xl p-6 shadow-sm">

                {/* TITLE + BADGE */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">{plan.name}</h3>
                  {plan.active && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* PRICE */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{plan.price}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">/month</span>
                  <p className="text-xs text-gray-400">
                    billed yearly as ₹{plan.yearly}
                  </p>
                </div>

                {/* FEATURES */}
                <ul className="space-y-2 text-sm text-gray-600">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-blue-600">✔</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* BUTTONS */}
                <div className="mt-6 space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm">
                    Create Offer
                  </button>

                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm">
                    Edit Plan
                  </button>
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagePlans;