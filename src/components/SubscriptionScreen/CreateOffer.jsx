import React, { useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "../../assets/Container.png";
import Background from "../../assets/Background.png";
import Icon from "../../assets/Icon.png";
import Direction from "../../assets/direction-down 01.png"

const CreateOffer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;

  const [whatsapp, setWhatsapp] = useState(true);
  const [kyc, setKyc] = useState(false);

  const basePrice = plan?.price || 599;
  const whatsappPrice = whatsapp ? 99 : 0;
  const kycPrice = kyc ? 59 : 0;

  const total = basePrice + whatsappPrice + kycPrice;

  return (
    <DashboardLayout>
      <div className="bg-[#F8FAFC] min-h-screen p-6">

        {/* HEADER */}
        <div className="flex items-start sm:items-center gap-3 mb-6">
          <ArrowLeft
            size={18}
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className="text-lg font-semibold">
              Create Custom Plan Offer
            </h1>
            <p className="text-xs text-gray-400">
              Design a bespoke offer for customers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="col-span-1 lg:col-span-2 space-y-6">

            {/* STEP 1 */}
            <div className="bg-white p-5 rounded-xl border border-gray-200">

              <h2 className="flex items-center gap-2 mb-4 text-left font-semibold">

                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs">
                  1
                </span>

                <span>Offer Setup</span>

              </h2>

              {/* BASE PLAN */}
              <div className="border rounded-lg p-4 mb-4 flex justify-between items-center border-[#002DB8] border-2 bg-[#EFECFF]">
                <div>
                  <p className="text-sm font-medium">{plan?.planName}</p>
                  <p className="text-blue-600 font-bold">
                    ₹{basePrice}/mo
                  </p>
                </div>
                <input type="radio" checked readOnly />
              </div>

              {/* ADDONS */}

              <p className="text-sm text-gray-400 mb-2 text-left">Select Add-ons</p>

              <div className="space-y-3">


                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border p-3 rounded-lg">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-3">

                    {/* ICON */}
                    <img src={Container} alt="Container" className="w-5 h-5" />

                    {/* TEXT */}
                    <div>
                      <p className="text-sm font-medium">
                        WhatsApp Integration
                      </p>
                      <p className="text-xs text-gray-400">
                        Automated alerts and support
                      </p>
                    </div>

                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 font-medium">₹99</span>
                    <input
                      type="checkbox"
                      checked={whatsapp}
                      onChange={() => setWhatsapp(!whatsapp)}
                    />
                  </div>

                </div>
                <div className="flex justify-between items-center border p-3 rounded-lg border-gray-200">

                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-3">

                    {/* ICON */}
                    <img src={Background} alt="Background" className="w-7 h-7" />

                    {/* TEXT */}
                    <div>
                      <p className="text-sm font-medium">
                        KYC Verification
                      </p>
                      <p className="text-xs text-gray-400">
                        Real-time tracking
                      </p>
                    </div>

                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 font-medium">₹59</span>
                    <input
                      type="checkbox"
                      checked={kyc}
                      onChange={() => setKyc(!kyc)}
                    />
                  </div>

                </div>

              </div>
            </div>

            {/* STEP 2 */}
            <h2 className="flex items-center gap-2 mb-4 text-left font-semibold">

              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs">
                2
              </span>

              <span> Target Customer Filter</span>

            </h2>

            <div className="border rounded-lg p-4 mb-4 border-gray-200">
              <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-600"
              />

              <span className="text-sm">
                Customer Type
              </span>
            </div>
            <div className="mt-4 text-sm justify-between flex">
           <div>
             <p>Contains</p>
           </div>
           <div>
             <img src={Direction} alt="Down" className="w-5 h-5"/>
           </div>
            </div>
            
            </div>

            <div className="space-y-3">

              {/* ITEM 1 */}
              <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">

                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-gray-700">
                  Plan Type
                </span>

              </label>

              {/* ITEM 2 */}
              <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">

                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-gray-700">
                  Supcription Status
                </span>

              </label>

              {/* ITEM 3 */}
              <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">

                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-gray-700">
                  Payment Due Date
                </span>

              </label>
              <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">

                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-gray-700">
                  Payment Mode
                </span>

              </label>
              <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">

                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-gray-700">
                  Region / Location
                </span>

              </label>
              <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">

                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-gray-700">
                  Joined Date
                </span>

              </label>
              <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">

                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-gray-700">
                  Last Active Date
                </span>

              </label>
              <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">

                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-gray-700">
                  Plan Expiry Date
                </span>

              </label>

            </div>

          </div>

          {/* RIGHT SIDE (SUMMARY) */}
          <div className="flex flex-col gap-3 lg:sticky lg:top-6">
            <div className="bg-[#1E3A8A] text-white p-5 rounded-xl h-fit">

              <p className="text-xs mb-2">LIVE PREVIEW</p>

              <h3 className="font-semibold mb-4">
                Summary of Custom Offer
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Plan</span>
                  <span>₹{basePrice}</span>
                </div>

                {whatsapp && (
                  <div className="flex justify-between">
                    <span>WhatsApp</span>
                    <span>₹99</span>
                  </div>
                )}

                {kyc && (
                  <div className="flex justify-between">
                    <span>KYC</span>
                    <span>₹59</span>
                  </div>
                )}
              </div>

              <div className="border-t my-4"></div>

              <div className="flex justify-between font-inter font-thin">
                <span>TOTAL MONTHLY</span>
                <span>₹{total}</span>
              </div>

            </div>
            <div className="w-full">
              <button className="mt-6 w-full flex items-center justify-center gap-3 bg-blue-500 py-2 rounded-lg bg-[#1E45E1] text-white">
                Create Offer
                <img src={Icon} alt="Flight" className="w-4 h-4" />
              </button>
            </div>
            <p className="font-inter">By Creating this offer,it will immediately avalible to the filltered 42 eligible customers in your database.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateOffer;