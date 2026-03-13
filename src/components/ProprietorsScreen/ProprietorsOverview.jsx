import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useNavigate } from "react-router-dom";
import SubscriptionsTab from "./SubscriptionTab";
import ProductSupportTab from "./ProductSupportTab ";
import ActivityLogsTab from "./ActivityLogsTab ";
import Arrow from "../../assets/arrow-up.png";
import { useOwners } from "../../Context/OwnersContext";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
const ProprietorsOverview = () => {
const navigate = useNavigate();
 const location = useLocation();
 const ownerData = location.state?.ownerData;
    const { owners, totalItems, totalPages, loading, getOwners,accessError,getOwnerById,updateOwnerEmail} = useOwners();
  

  const [activeTab, setActiveTab] = useState("properties");
  const [showEmailModal, setShowEmailModal] = useState(false);
const [newEmail, setNewEmail] = useState("");
const [emailError,setEmailError] = useState("")
const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
console.log("ownerData",ownerData)
const formatDateTime = (date, time) => {
  if (!date) return "-";
  const d = new Date(date.split("/").reverse().join("-"));
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }) + " " + (time || "");
};

const handleEmailUpdate = async () => {

  if (!newEmail) {
    setEmailError("Email is required");
    return;
  }

  // optional email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(newEmail)) {
    setEmailError("Enter valid email");
    return;
  }

  setEmailError("");

  const res = await updateOwnerEmail(ownerData?.ownerId, {
    newEmail: newEmail
  });

  if (res.success) {
     setModalType("success");
      setMessage(res?.message);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setShowEmailModal(false);
        setNewEmail("");
      }, 1500);

  } else {
    alert(res.message);
  }

};
// const handleEmailUpdate = async () => {

//   const res = await updateOwnerEmail(ownerData?.ownerId, {
//     newEmail: newEmail
//   });

//   if (res.success) {
//     alert("Email updated successfully");
//     setShowEmailModal(false);
//     setNewEmail("");
//   } else {
//     alert(res.message);
//   }

// };
  return (
    <DashboardLayout>
 <Toast
              show={showSuccess}
              message={message}
              type={modalType}

            />
      <div className="p-6 space-y-6">

      
        <div
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 text-sm  cursor-pointer hover:text-gray-700"
>
  <img src={Arrow} width={20} height={20} /><span>Proprietor Detail</span>
</div>

      
<div className="bg-[#F6F8FE] border border-gray-300 rounded-2xl px-8 py-6">

 
  <div className="flex items-center gap-4">

    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">

  {ownerData?.profileUrl ? (
    <img
      src={ownerData.profileUrl}
      alt="profile"
      className="w-full h-full object-cover"
    />
  ) : (
    ownerData?.initials
  )}

</div>

    <div>
      <h2 className="font-semibold text-lg text-gray-800 text-left">
        {ownerData?.fullName}
      </h2>

      <p className="text-sm text-gray-500">
{ownerData?.ownerId?.slice(-8)} | {formatDateTime(ownerData?.lastActivityDate, ownerData?.lastActivityTime)}
</p>
    </div>

  </div>


  
  <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-6 text-sm">

    <div>
      <p className="text-gray-900 text-left">Mobile No</p>
      <p className="font-medium text-gray-500 text-left">+91 {ownerData?.mobileNo}</p>
    </div>

    <div>
      <p className="text-gray-900 text-left">Props</p>
      <p className="font-medium text-blue-500 text-left">
        {ownerData?.noOfProperties}
      </p>
    </div>

    <button className="text-gray-900 border rounded border-gray-300   text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white cursor-pointer "  onClick={() => setShowEmailModal(true)}>
  Change Email
</button>

   

  </div>

</div>

       
   <div className="flex items-center justify-between">

  {/* Tabs */}
  <div className="border-b border-[#E6E8F0] flex gap-6 text-sm">

    <button
      onClick={() => setActiveTab("properties")}
      className={`pb-2 ${
        activeTab === "properties"
          ? "border-b-2 border-blue-600 font-medium"
          : "text-gray-500"
      }`}
    >
      Properties
    </button>

    <button
      onClick={() => setActiveTab("subscriptions")}
      className={`pb-2 ${
        activeTab === "subscriptions"
          ? "border-b-2 border-blue-600 font-medium"
          : "text-gray-500"
      }`}
    >
      Subscriptions
    </button>

    <button
      onClick={() => setActiveTab("support")}
      className={`pb-2 ${
        activeTab === "support"
          ? "border-b-2 border-blue-600 font-medium"
          : "text-gray-500"
      }`}
    >
      Product Support
    </button>

    <button
      onClick={() => setActiveTab("logs")}
      className={`pb-2 ${
        activeTab === "logs"
          ? "border-b-2 border-blue-600 font-medium"
          : "text-gray-500"
      }`}
    >
      History
    </button>

  </div>

  {/* Search + Filter */}
  {/* <div className="flex items-center gap-3">

    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="border border-[#E6E8F0] rounded-md pl-8 pr-3 py-2 text-sm"
      />
      <span className="absolute left-2 top-2 text-gray-400"></span>
    </div>

    <select className="border border-[#E6E8F0] rounded-md px-3 py-2 text-sm">
      <option>This Month</option>
    </select>

  </div> */}

</div>
        {/* Tab Content */}

        {activeTab === "properties" && 
    <div className="bg-white border border-[#E6E8F0] rounded-xl max-h-[300px] overflow-y-auto">

  <table className="min-w-full text-sm">

   
    <thead className="bg-[#F8F9FF] sticky top-0 z-20">
      <tr>
        <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ID</th>
        <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">NAME</th>
        <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">TYPE</th>
        <th className="px-4 py-3 text-left whitespace-nowrap font-semibold text-[12px] uppercase text-[#6B7280] font-inter">REGION / CITY</th>
        <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">SUB PLAN</th>
        <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ADDED ON</th>
        {/* <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ACTIONS</th> */}
      </tr>
    </thead>

  
   <tbody className="divide-y divide-gray-200">

      {ownerData?.properties?.length > 0 ? (

        ownerData.properties.map((property, index) => (

          <tr key={property.hostelId} className="hover:bg-gray-50">

            <td className="px-4 py-3 text-left font-medium text-[12px]">{index + 1}</td>

            <td className="px-4 py-3 text-left font-medium text-[12px]">
              {property.hostelName}
            </td>

            <td className="px-4 py-3 text-left font-medium text-[12px]">
            {property?.hostelType}
            </td>

            <td className="px-4 py-3 text-left font-medium text-[12px]">
              {property.city},{property.state}
            </td>

            <td className="px-4 py-3 text-left font-medium text-[12px]">
              {property?.hostelPlan?.planName}
            </td>

            <td className="px-4 py-3 text-left font-medium text-[12px]">
              {property.createdAt}
            </td>

            {/* <td className="px-4 py-3 text-left font-medium text-[12px]">
              ⋮
            </td> */}

          </tr>

        ))

      ) : (

        <tr>
          <td colSpan="7" className="text-center py-10 text-gray-500">
            No Data Found
          </td>
        </tr>

      )}

    </tbody>

  </table>

</div>
        }
        {activeTab === "subscriptions" && <SubscriptionsTab properties={ownerData?.properties}/>}
        {activeTab === "support" && <ProductSupportTab />}
        {activeTab === "logs" && <ActivityLogsTab activities={ownerData}/>}

      </div>
 {showEmailModal && (
  <div
    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    onClick={() => {
      setShowEmailModal(false);
      setEmailError("");
      setNewEmail("");
    }}
  >

    {/* Modal Box */}
    <div
      className="bg-white rounded-xl shadow-lg w-[400px] p-6"
      onClick={(e) => e.stopPropagation()}
    >

      <h2 className="text-lg font-semibold mb-4 text-left">
        Change Email
      </h2>

      <input
        type="email"
        placeholder="Enter new email"
        value={newEmail}
        onChange={(e) => {
          setNewEmail(e.target.value);
          setEmailError("");
        }}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
      />

      {emailError && (
        <ErrorMessage message={emailError} type="error" />
      )}

      <div className="flex justify-end gap-3 mt-4">

        <button
          onClick={() => {
            setShowEmailModal(false);
            setEmailError("");
            setNewEmail("");
          }}
          className="px-4 py-2 text-sm border rounded-md"
        >
          Cancel
        </button>

        <button
          onClick={handleEmailUpdate}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}

    </DashboardLayout>
  );
};

export default ProprietorsOverview;