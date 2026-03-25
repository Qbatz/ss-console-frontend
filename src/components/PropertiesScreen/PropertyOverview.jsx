import React, { useState } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import OverviewSubscriptions from "./OverviewSubscription";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Mobile from "../../assets/mobile.png";
import locationImg from "../../assets/location.png";
import Arrow from "../../assets/maximize.png";
import Crown from "../../assets/crown.png";
import refresh from "../../assets/refresh.png";
import arrowleft from "../../assets/arrow-up.png";
import ViewImg from "../../assets/View.png";
import ProductSupport from "./ProductSupport";
import StaffScreen from "./StaffScreen";
import InvoicesScreen from "./InvoicesScreen";
import PropertyActive from "./ActiveScreen";
import swap from "../../assets/arrowswap.png";
import PropertyAmenities from "./PropertyAmenities";
import { useHostel } from "../../Context/HostelListContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";
import { usePermission } from "../../Utils/permissionHelper";
import LoginImg from "../../assets/LoginImg.png";
import ReccuringBill from "./ReccuringBill";
import { useOwners } from "../../Context/OwnersContext";
const PropertyOverview = () => {
  const { hostels, getHostels, loading, getHostelById, hardResetHostel, errorMsg, accessError } = useHostel();
  const { owners, totalItems, totalPages, getOwners, getOwnerById } = useOwners();

  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Tenants");

  const { canWrite: canResetWrite } = usePermission("Reset hostel");
  console.log("canWrite", canRead)
  const [activeTab, setActiveTab] = useState("tenants");
  const [showSharing, setShowSharing] = useState(false);
  const [showBillingRule, setShowBillingRule] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);

  const [hostelerror, setHostelError] = useState("")
  const [noteText, setNoteText] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const loginType = localStorage.getItem("login_type");
  const showInvoices = loginType === "normal";


  const hostelData = location.state?.hostelData;
  console.log("hostelData", hostelData)

  const handleHardReset = async () => {

    if (!hostelData.hostelId) return;

    const enteredId = noteText.trim();

    if (!enteredId) {
      setHostelError("Please Enter Hostel ID");
      return;
    }

    const res = await hardResetHostel(
      hostelData.hostelId,
      enteredId
    );

    if (res?.success) {
      setModalType("success");
      setMessage(res?.message);


      setShowNoteModal(false);
      setShowSuccess(true);
      setNoteText("");
      setHostelError("");

      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);

    } else {
      setHostelError(res?.message || "Please Enter Valid Hostel ID");
    }
  };
  const handleOwnerClick = async (item) => {

    const res = await getOwnerById(item.ownerInfo.ownerId);

    if (res?.success) {

      navigate(`/ProprietorsOverview/${item.ownerInfo.ownerId}`, {
        state: { ownerData: res.data }
      });

    }

  };

  if (!hostelData) return <div className="p-5">Loading...</div>;

  return (
    <DashboardLayout>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div className="pl-2 pr-2 min-h-screen">


        <div className="flex items-center ">
          {/* <span className="text-xl cursor-pointer"  onClick={() => navigate(-1)}> ←  </span> */}
          <img src={arrowleft} height={20} width={20} className="text-xl cursor-pointer" 
          // onClick={() => navigate(-1)}
            onClick={() =>navigate(`/properties/${hostelData?.roleId}`, {
  state: { skipApi: true }
})}
           />
          <p className="text-[20px] leading-[48px] font-medium text-[#1F2937] font-sans ml-2">
            Property Overview
          </p>
        </div>


        <div className="bg-[#F6F8FC] border border-[#E6E8F0] rounded-xl p-5">

          {/* Top Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            {/* Left */}
            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
                {hostelData.initials}
              </div>

              <div>
                <h2 className="text-[24px] font-semibold text-gray-900 text-left font-sans" >
                  {hostelData.hostelName}
                </h2>

                <p className="text-sm text-gray-500 flex items-center gap-1">
                  {hostelData.hostelId} |
                  <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => handleOwnerClick(hostelData)}>
                    {hostelData.ownerInfo?.fullName}
                  </span>

                  <img src={Arrow} className="w-3 h-3 ml-1" />
                </p>
              </div>
            </div>


            {/* Right */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <img src={refresh} className="w-8 h-8" />
              <span>
                {hostelData.createdAtDate}
              </span>

              {/* Menu */}
              <img src={ViewImg} width={18} height={18} />
              <div className="text-gray-400 cursor-pointer text-xl">⋮</div>
            </div>

          </div>


          {/* Bottom Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">

            {/* Mobile */}
            <div className="flex items-start gap-3">


              <div>
                <p className="  text-[#1D1D1D] text-left font-sans font-medium text-sm">Mob No</p>
                <div className="flex items-center gap-2 mt-1">
                  <img src={Mobile} className="w-4 h-4" />
                  <p className="text-sm font-medium font-sans">
                    +91 {hostelData.mobile}
                  </p>
                </div>
              </div>
            </div>


            {/* Location */}
            <div className="flex items-start gap-3">


              <div>
                <p className="text-[#1D1D1D] text-left font-sans font-medium text-sm">Region / City</p>
                <div className="flex items-center gap-2 mt-1">
                  <img src={locationImg} className="w-4 h-4" />
                  <p className="text-sm font-medium text-blue-600 flex items-center">
                    {hostelData.city}, {hostelData.state}
                    <img src={Arrow} className="w-3 h-3" />
                  </p>
                </div>
              </div>
            </div>


            {/* Subscription */}
            <div className="flex items-start gap-3">


              <div>
                <p className="  text-[#1D1D1D] text-left font-sans font-medium text-sm">Subscription Plan</p>
                <div className="flex items-center gap-2 mt-1">
                  <img src={Crown} className="w-4 h-4 " />
                  <p className="text-sm font-medium ">
                    {/* {hostelData.hostelPlan?.currentPlan} */}
                    {hostelData?.currentSubscription?.planName || "N/A"}
                  </p>
                </div>
              </div>
            </div>


            {/* Status */}
            <div className="flex items-start gap-3">


              <div>
                <p className="  text-[#1D1D1D] text-left font-sans font-medium text-sm">Status</p>

                <p className="text-sm font-medium flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${hostelData?.subscriptionStatus?.toLowerCase() === "active"
                      ? "bg-green-500"
                      : "bg-red-500"
                      }`}
                  ></span>

                  <span
                    className={`font-medium ${hostelData?.subscriptionStatus === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    {hostelData?.subscriptionStatus || "N/A"}
                  </span>

                  {/* <span className="text-gray-400 text-xs">
                    22 Days Left to Renew
                  </span> */}
                </p>
              </div>

            </div>
            <div className="flex items-start gap-3">


              <button
                disabled={!canResetWrite}
                onClick={() => {
                  if (canResetWrite === true) {
                    setShowNoteModal(true);
                  }
                }}
                className={`px-3 py-[2px] rounded text-[12px] font-medium 
  ${canResetWrite === true
                    ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Reset
              </button>

            </div>
          </div>

        </div>



        <div className="bg-white border border-gray-300 rounded-xl p-4 mt-4">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:divide-x lg:divide-gray-300">

            {/* Active Tenants */}
            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">Active Tenants</p>
                {/* <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" /> */}
              </div>

              <p className="text-lg  text-start font-semibold mt-1">
                {hostelData.noOfActiveTenants}
              </p>
            </div>


            {/* Rooms & Beds */}
            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">Rooms & Beds</p>
                <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" onClick={() => setShowSharing(true)} />
              </div>

              <p className="text-lg text-start font-semibold mt-1">
                {hostelData.noOfRooms} | {hostelData.noOfBeds}
              </p>
            </div>



            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">Revenue Generated</p>
                {/* <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" /> */}
              </div>

              <p className="text-lg text-start font-semibold mt-1">₹0</p>
            </div>


            {/* Invoices */}
            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">Total Invoices</p>
                <img src={ViewImg} className="w-3.5 h-3.5 opacity-70" onClick={() => setShowBillingRule(true)} />
              </div>

              <p className="text-lg  text-start font-semibold mt-1">0</p>
            </div>


            {/* Support */}
            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">Support Tickets</p>

              </div>

              <p className="text-lg text-start font-semibold mt-1">0</p>
            </div>

          </div>
        </div>



        <div className="bg-white rounded-xl pt-4 flex flex-col">


          {/* <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-5 pt-4 gap-3"> */}
          <div className="sticky top-0 z-40 bg-white flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-5 pt-0 pb-3 gap-3  border-gray-200">
            <div className="flex gap-6 border-b border-[#E6E8F0] overflow-x-auto">

              {[
                "tenants",
                "subscriptions",
                "Product Support",
                "staffs",
                "invoices",
                "activity",
                "Amenities",
                // "Billing Control"
              ]
                .map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium font-sans capitalize border-b-2 whitespace-nowrap ${activeTab === tab
                      ? "border-[#2563EB] text-[#2563EB]"
                      : "border-transparent text-gray-500"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
            </div>


            {/* <div className="flex items-center gap-3 pb-3 lg:pb-4">

              <input
                placeholder="Search..."
                className="border border-[#E6E8F0] rounded-lg px-4 py-2 text-sm w-40 lg:w-56"
              />

              <select className="border border-[#E6E8F0] rounded-lg px-3 py-2 text-sm">
                <option>Active</option>
              </select>

            </div> */}
          </div>


          {activeTab === "tenants" && (
            canRead === true ? (
              <div className="overflow-x-auto">


                <div className="max-h-[300px] overflow-y-auto border border-[#E6E8F0] rounded-xl">

                  <table className="w-full text-sm">

                    <thead className="bg-[#F8F9FF] sticky top-0 z-10">
                      <tr>

                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-sans">
                            ID
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>

                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-sans">
                            Name
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>

                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-sans">
                            Mail
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>

                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-sans">
                            Mobile No
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>

                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-sans">
                            Status
                            <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                          </div>
                        </th>

                      </tr>
                    </thead>


                    <tbody className="divide-y divide-gray-200">

                      {hostelData?.tenantList && hostelData?.tenantList?.length > 0 ? (
                        hostelData?.tenantList?.map((item, index) => (
                          <tr key={item.customerId || index} className="hover:bg-gray-50">

                            <td className="px-4 py-2 text-left font-medium text-[12px]">
                              {index + 1}
                            </td>

                            <td className="px-4 py-2 text-[#2563EB] text-left font-medium text-[12px]">
                              {item.fullName || item.firstName || "N/A"}
                            </td>

                            <td className="px-4 py-2 text-left font-medium text-[12px]">
                              {item.emailId || "N/A"}
                            </td>

                            <td className="px-4 py-2 text-left font-medium text-[12px]">
                              {item.mobile || "N/A"}
                            </td>

                            <td className="px-4 py-2 text-left font-medium text-[12px]">
                              <span className="text-green-600">
                                {item.currentStatus || "N/A"}
                              </span>
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-gray-400">
                            No Data Found
                          </td>
                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>
              </div>
            ) : (

              <div className="flex flex-col items-center justify-center py-10">
                <img
                  src={LoginImg}
                  alt="Access Restricted"
                  className="w-48 mb-3"
                />

                <p className="text-red-500 font-medium">
                  Access Restricted
                </p>
              </div>

            )

          )}


          {activeTab === "subscriptions" && (
            <OverviewSubscriptions hostelData={hostelData} />
          )}
          {activeTab === "Product Support" && (
            <ProductSupport hostelData={hostelData} />
          )}
          {activeTab === "staffs" && (
            <StaffScreen hostelData={hostelData} />
          )}
          {activeTab === "invoices" && (
            <InvoicesScreen hostelData={hostelData} />
          )}
          {activeTab === "activity" && (
            <PropertyActive hostelData={hostelData} />
          )}
          {activeTab === "Amenities" && (
            <PropertyAmenities hostelData={hostelData} />
          )}
          {activeTab === "Billing Control" && (
            <ReccuringBill hostelData={hostelData} />
          )}


        </div>

      </div>
      {showSharing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-[80vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Detailed Sharing Breakdown
              </h2>

              <button
                onClick={() => setShowSharing(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Sharing Cards */}
            {hostelData?.sharingBreakdown?.length > 0 ? (

              [...hostelData.sharingBreakdown]
                .sort((a, b) => a.sharingType - b.sharingType)
                .map((item, index) => (

                  <div key={index} className="border rounded-xl p-4 mb-4">

                    <div className="flex justify-between mb-2">
                      <p className="font-semibold">
                        {item.sharingTypeDisplay || "N/A"}
                      </p>

                      <span className="text-sm text-gray-500">
                        {item.noOfRoomsAvailable ?? 0} Rooms Available
                      </span>
                    </div>

                    <div className="grid grid-cols-3 text-sm">

                      <div>
                        <p className="text-gray-500">Rooms</p>
                        <p className="font-semibold text-lg">
                          {item.noOfRooms ?? 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Total Beds</p>
                        <p className="font-semibold text-lg">
                          {item.noOfBeds ?? 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Occupied</p>
                        <p
                          className={`font-semibold text-lg ${item.noOfOccupiedBeds > 0
                            ? "text-green-600"
                            : "text-gray-400"
                            }`}
                        >
                          {item.noOfOccupiedBeds ?? 0}
                        </p>
                      </div>

                    </div>

                  </div>

                ))

            ) : (
              <div className="text-center py-6 text-gray-400">
                No Sharing Data Found
              </div>
            )}

          </div>
        </div>
      )}
      {/* {showSharing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">

           
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                Detailed Sharing Breakdown
              </h2>

              <button
                onClick={() => setShowSharing(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>


        
            <div className="border rounded-xl p-4 mb-4">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">1-Sharing</p>
                <span className="text-sm text-gray-500">2 Rooms Available</span>
              </div>

              <div className="grid grid-cols-3 text-sm">
                <div>
                  <p className="text-gray-500">Rooms</p>
                  <p className="font-semibold text-lg">7</p>
                </div>

                <div>
                  <p className="text-gray-500">Total Beds</p>
                  <p className="font-semibold text-lg">7</p>
                </div>

                <div>
                  <p className="text-gray-500">Occupied</p>
                  <p className="font-semibold text-lg text-green-600">5</p>
                </div>
              </div>
            </div>


          
            <div className="border rounded-xl p-4 mb-4">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">2-Sharing</p>
                <span className="text-sm text-gray-500">1 Room Available</span>
              </div>

              <div className="grid grid-cols-3 text-sm">
                <div>
                  <p className="text-gray-500">Rooms</p>
                  <p className="font-semibold text-lg">5</p>
                </div>

                <div>
                  <p className="text-gray-500">Total Beds</p>
                  <p className="font-semibold text-lg">10</p>
                </div>

                <div>
                  <p className="text-gray-500">Occupied</p>
                  <p className="font-semibold text-lg text-green-600">8</p>
                </div>
              </div>
            </div>


           
            <div className="border rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">3-Sharing</p>
                <span className="text-sm text-gray-500">2 Rooms Available</span>
              </div>

              <div className="grid grid-cols-3 text-sm">
                <div>
                  <p className="text-gray-500">Rooms</p>
                  <p className="font-semibold text-lg">12</p>
                </div>

                <div>
                  <p className="text-gray-500">Total Beds</p>
                  <p className="font-semibold text-lg">36</p>
                </div>

                <div>
                  <p className="text-gray-500">Occupied</p>
                  <p className="font-semibold text-lg text-green-600">30</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      )} */}
      {showBillingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-xl w-[360px] shadow-lg p-6 relative">

            {/* Close */}
            <button
              onClick={() => setShowBillingRule(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Billing Rule
            </h2>

            <div className="border-t pt-4 space-y-4">

              <div className="flex justify-between">
                <span className="text-gray-500">Billing Start Date</span>
                <span className="font-semibold text-gray-800">{hostelData?.billingRules[0]?.billingStartDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Bill Due Days</span>
                <span className="font-semibold text-gray-800">{hostelData?.billingRules[0]?.billDueDays}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Notice Period</span>
                <span className="font-semibold text-gray-800">{hostelData?.billingRules[0]?.noticePeriod}</span>
              </div>

            </div>

          </div>
        </div>
      )}
      {showNoteModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => {
            setShowNoteModal(false);
            setNoteText("");
            setHostelError("");
          }}
        >

          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => {
                setShowNoteModal(false);
                setNoteText("");
                setHostelError("");
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-left ">
              Enter Hostel ID <span className="text-red-400">*</span>
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Enter Hostel ID"
                value={noteText}
                onChange={(e) => {
                  setNoteText(e.target.value);
                  setHostelError("");
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />

              {hostelerror && (
                <ErrorMessage message={hostelerror} type="error" />
              )}

              <button
                onClick={handleHardReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
              >
                Submit
              </button>

            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PropertyOverview;
