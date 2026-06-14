import React, { useState, useEffect } from "react";
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
import { usePermission } from "../../Utils/permissionHelper";
import { useHostel } from "../../Context/HostelListContext";
import { useRole } from "../../Context/RoleContext";
import { useParams } from "react-router-dom";

const ProprietorsOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminDetails, agentRoles, getAgentRoles, getAgentRoleById, deleteAgentRole, } = useRole();

  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Owners");
  //  const ownerData = location.state?.ownerData;
  const [ownerData, setOwnerData] = useState(null);
  const { ownerId } = useParams();
  const { owners, totalItems, totalPages, loading, getOwners, accessError, getOwnerById, updateOwnerEmail } = useOwners();
  const { hostels, getHostels, getHostelById, hardResetHostel, errorMsg, deleteHostelExpense } = useHostel();


  const [activeTab, setActiveTab] = useState("properties");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showAgentModal, setShowAgentModal] = useState(false);
  useEffect(() => {
    const fetchOwner = async () => {
      if (!ownerId) return;

      const res = await getOwnerById(ownerId);

      if (res?.success) {
        setOwnerData(res.data);
      }
    };

    fetchOwner();
  }, [ownerId]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  console.log("ownerData", ownerData)
  const formatDateTime = (date, time) => {
    if (!date) return "-";
    const d = new Date(date.split("/").reverse().join("-"));
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    }) + " " + (time || "");
  };
  const handlePropertyClick = async (item) => {
    console.log("handlePropertyClick", item)
    const res = await getHostelById(item.hostelId);
    console.log("res", res)
    if (res?.success) {
      navigate(`/property-overview/${item.hostelId}`, {
        state: { hostelData: res.data }
      });

    }
  };

  const handleEmailUpdate = async () => {

   const trimmedEmail = newEmail.trim();

  if (!trimmedEmail) {
    setEmailError("Email is required");
    return;
  }

  // Proper email format
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(trimmedEmail)) {
    setEmailError(
      "Please enter a valid email address"
    );
    return;
  }

  // Prevent consecutive dots
  if (trimmedEmail.includes("..")) {
    setEmailError(
      "Email address is invalid"
    );
    return;
  }

  setEmailError("");

  const res = await updateOwnerEmail(
    ownerData?.ownerId,
    {
      newEmail: trimmedEmail
    }
  );

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
      setEmailError(res.message);
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
          onClick={() =>
            navigate(location.state?.from || -1)
          }
          className="
    flex
    items-center
    gap-2
    text-sm
    cursor-pointer
    hover:text-gray-700
  "
        >
          <img src={Arrow} width={20} height={20} />

          <span>Proprietor Detail</span>
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

            <button
              onClick={() => setShowEmailModal(true)}
              disabled={canWrite === false}
              className={`px-4 py-2 text-[12px] font-medium rounded border
  ${canWrite
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 cursor-pointer"
                  : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                }`}
            >
              Change Email
            </button>
 <div>

  <p
    className="
      text-label
      text-textDark
      text-left
      font-inter
      font-medium
    "
  >
    Current Agent
  </p>

  <div className="flex items-center gap-2 mt-1">

    <p
      onClick={() => {

        const agentId =
          ownerData?.relationalAgents?.[0]?.agentId;

        if (agentId) {

          navigate(`/iam-user/${agentId}`);

        }

      }}
      className="
        text-cardTitle
        font-medium
        text-primaryBlue
        truncate
        max-w-[120px]
        cursor-pointer
        hover:underline
      "
    >
      {
        ownerData?.relationalAgents?.[0]?.agentName
        || "N/A"
      }
    </p>

    {ownerData?.relationalAgents?.length > 0 && (

      <button
        onClick={() => setShowAgentModal(true)}
        className="
          text-[10px]
          px-2
          py-[2px]
          bg-primarySoft
          text-primaryBlue
          rounded-pill
          whitespace-nowrap
          cursor-pointer
        "
      >
        View
      </button>

    )}

  </div>

</div>

          </div>

        </div>


        <div className="flex items-center justify-between">

          {/* Tabs */}
          <div className="border-b border-[#E6E8F0] flex gap-6 text-sm">

            <button
              onClick={() => setActiveTab("properties")}
              className={`pb-2 ${activeTab === "properties"
                  ? "border-b-2 border-blue-600 font-medium"
                  : "text-gray-500"
                }`}
            >
              Properties
            </button>

            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`pb-2 ${activeTab === "subscriptions"
                  ? "border-b-2 border-blue-600 font-medium"
                  : "text-gray-500"
                }`}
            >
              Subscriptions
            </button>

            <button
              onClick={() => setActiveTab("support")}
              className={`pb-2 ${activeTab === "support"
                  ? "border-b-2 border-blue-600 font-medium"
                  : "text-gray-500"
                }`}
            >
              Product Support
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`pb-2 ${activeTab === "logs"
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
                        <span
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => handlePropertyClick(property)}
                        >
                          {property.hostelName}
                        </span>
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
        {activeTab === "subscriptions" && <SubscriptionsTab properties={ownerData?.properties} />}
        {activeTab === "support" && <ProductSupportTab />}
        {activeTab === "logs" && <ActivityLogsTab activities={ownerData} />}

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
                className="px-4 py-2 text-sm border rounded-md cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleEmailUpdate}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Save
              </button>

            </div>

          </div>
          

        </div>
      )}
 {showAgentModal && (

  <div
    className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      px-4
    "
  >

    {/* OVERLAY */}
    <div
      className="
        absolute
        inset-0
        bg-black/40
      "
      onClick={() => setShowAgentModal(false)}
    />

    
    <div
      className="
        relative
        bg-white
        rounded-modal
        shadow-modal
        w-full
        max-w-[700px]
        max-h-[80vh]
        overflow-hidden
        z-[10000]
        animate-fadeIn
        border
        border-borderSoft
      "
    >

     
      <div
        className="
          flex
          items-center
          justify-between
          px-5
          py-4
          border-b
          border-borderSoft
        "
      >

        <h2
          className="
            text-sectionTitle
            font-semibold
            text-headingDark
          "
        >
          Agent Details
        </h2>

        <button
          onClick={() => setShowAgentModal(false)}
          className="
            text-textDark/40
            hover:text-dangerRed
            text-xl
            cursor-pointer
          "
        >
          ✕
        </button>

      </div>

      
      <div
        className="
          overflow-x-auto
          overflow-y-auto
          max-h-[65vh]
        "
      >

        <table className="w-full">

         
          <thead
            className="
              bg-cardBg
              sticky
              top-0
              z-10
            "
          >

            <tr>

              {[
                "Agent Name",
                "Reason",
                "Created By",
                "Date"
              ].map((header) => (

                <th
                  key={header}
                  className="
                    px-4
                    py-3
                    text-left
                    whitespace-nowrap
                  "
                >

                  <div
                    className="
                      text-tableHeader
                      uppercase
                      font-semibold
                      text-textDark/60
                      tracking-wide
                    "
                  >
                    {header}
                  </div>

                </th>

              ))}

            </tr>

          </thead>

          
          <tbody className="divide-y divide-borderSoft">

            {ownerData?.relationalAgents?.length > 0 ? (

              ownerData.relationalAgents.map((item, i) => (

                <tr
                  key={i}
                  className="
                    hover:bg-cardBg
                    transition-all
                  "
                >

                  {/* AGENT NAME */}
                  {/* <td
                    className="
                      px-4
                      py-3
                      text-cardTitle
                      font-small
                      text-headingDark
                      whitespace-nowrap text-left
                    "
                  >
                    {item.agentName || "N/A"}
                  </td> */}
                  <td
  onClick={() => {
    if (item.agentId) {
      navigate(`/iam-user/${item.agentId}`);
    }
  }}
  className="
    px-4
    py-3
    text-cardTitle
    font-small
    text-primaryBlue
    whitespace-nowrap
    text-left
    cursor-pointer
    hover:underline
  "
>
  {item.agentName || "N/A"}
</td>

                  
                  <td
                    className="
                      px-4
                      py-3
                      text-cardTitle
                      text-textDark/70
                      min-w-[180px] text-left
                    "
                  >
                    {item.reason || "N/A"}
                  </td>

                  {/* CREATED BY */}
                  <td
                    className="
                      px-4
                      py-3
                      text-cardTitle
                      text-textDark/70
                      whitespace-nowrap text-left
                    "
                  >
                    {item.createdBy || "N/A"}
                  </td>

                  {/* DATE */}
                  <td
  className="
    px-4
    py-3
    text-cardTitle
    text-textDark/70 text-start
  "
>

  <div className="flex flex-col">

    <span className="whitespace-nowrap">
      {item.createdAtDate || "N/A"}
    </span>

    <span
      className="
        text-[11px]
        text-textDark/50
        mt-[2px]
      "
    >
      {item.createdAtTime || ""}
    </span>

  </div>

</td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="4"
                  className="
                    text-center
                    py-8
                    text-textDark/40
                    text-cardTitle
                  "
                >
                  No Data Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  </div>

)}
    </DashboardLayout>
  );
};

export default ProprietorsOverview;