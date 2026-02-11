import React from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


const plans = [
  {
    name: "Basic Plan",
    price: "₹599",
    features: [
      "30h Fast generations",
      "Unlimited Relaxed generations",
      "General commercial terms",
      "Access to member gallery",
      "Optional credit top ups",
      "3 concurrent fast jobs",
    ],
  },
  {
    name: "Premium Plan",
    price: "₹999",
    features: [
      "30h Fast generations",
      "Unlimited Relaxed generations",
      "General commercial terms",
      "Access to member gallery",
      "Optional credit top ups",
      "3 concurrent fast jobs",
      "12 concurrent fast jobs",
    ],
  },
  {
    name: "Pro Plan",
    price: "₹1299",
    features: [
      "30h Fast generations",
      "Unlimited Relaxed generations",
      "General commercial terms",
      "Access to member gallery",
      "Optional credit top ups",
      "3 concurrent fast jobs",
    ],
  },
];

const ManagePlans = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div className="font-inter">

        {/* HEADER SECTION */}
        <div className="px-8 py-2 border-b bg-white">
          <div className="flex justify-between items-center">

            <div className="flex items-center gap-3">
              <ArrowLeft size={18} className="cursor-pointer" onClick={() => navigate(-1)} />
              <div>
                <h1 className="text-l font-medium font-sans text-gray-800 text-start">
                  Subscription Plans
                </h1>
                <p className="text-xs text-gray-500 mt-1 font-sans">
                  Subscriptions &gt; Manage Plans
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition font-sans">
              + Add New Plan
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6  min-h-screen">

          {/* Toggle */}
          <div className="flex justify-start mb-8">
            <div className="inline-flex bg-gray-100 p-1 rounded-full">

              <button className="px-6 py-1 text-sm font-medium text-gray-600 rounded-full">
                Monthly
              </button>

              <button className="px-6 py-1 text-sm font-medium text-white bg-blue-600 rounded-full shadow-sm">
                Yearly <span className="text-xs font-normal">-20% off</span>
              </button>

            </div>
          </div>



          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {plans.map((plan, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 font-inter text-start">
                    {plan.name}
                  </h2>

                  <div className="mb-6  text-start">
                    <span className="text-3xl  text-gray-900 font-bold font-inter">
                      {plan.price}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      per editor/month
                    </span>
                  </div>

                  <ul className="space-y-3 text-sm text-gray-600">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-green-500 mt-1">✔</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="mt-8 bg-gray-100 hover:bg-gray-200 text-sm font-medium py-2 rounded-lg transition">
                  Edit Plan
                </button>
              </div>
            ))}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagePlans;
