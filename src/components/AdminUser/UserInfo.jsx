import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { useRole } from "../../Context/RoleContext";
import Arrow from "../../assets/arrow-up.png";
import UserBlack from "../../assets/userblack.png";
import Location from "../../assets/locationyellow.png";
import Crown from "../../assets/crown.png";
import Mail from "../../assets/Mail.png";
import Mobile from "../../assets/mobile.png";
import Message from "../../assets/message-2.png";
import downArrow from "../../assets/direction-down 01.png";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useHostel } from "../../Context/HostelListContext";
import ArrowDown from "../../assets/direction-down 01.png";
import Toast from "../SuccessModal/ToastDesign";

const UserInfo = () => {
  const navigate = useNavigate();
  console.log()

  const { agentId } = useParams();
  const { getAgentDetails, getUnAssignedOwners } = useRole();
  const { assignRelationalAgent, getRelationalReasons} = useHostel();
  const [agentDetails, setAgentDetails] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [activeTab, setActiveTab] = useState("activity");
  const [menuDirection, setMenuDirection] = useState("top");
  const [expandedOwners, setExpandedOwners] = useState([]);
  const [showAddClientDrawer, setShowAddClientDrawer] = useState(false);
  const [ownerList, setOwnerList] = useState([]);
  const [ownerName, setOwnerName] = useState("");

  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

  const [ownerSearch, setOwnerSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [reasonError, setReasonError] = useState("");
  const [reasonList, setReasonList] = useState([]);
  const [ownerError, setOwnerError] = useState("");
  const [modalType, setModalType] = useState("success");
      const [showSuccess, setShowSuccess] = useState(false);
      const [message, setMessage] = useState("");
  const [menuPos, setMenuPos] = useState({
    top: 0,
    left: 0
  });
  console.log("agentDetails", agentDetails)

  const fetchReasons = async () => {
    const res = await getRelationalReasons();

    if (res?.success) {
      setReasonList(res.data);
    }
  };
  useEffect(() => {
    if (showAddClientDrawer) {
      fetchReasons();

    }
  }, [showAddClientDrawer]);
  useEffect(() => {
    const fetchDetails = async () => {
      const res = await getAgentDetails(agentId);
      if (res?.success) {
        setAgentDetails(res.data);
      }
    };

    fetchDetails();
  }, [agentId]);
  console.log("agentDetails", agentDetails)
  useEffect(() => {
    const handleClick = () => setOpenMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const fetchOwners = async () => {
      const res = await getUnAssignedOwners(ownerSearch);

      if (res.success) {
        setOwnerList(res.data || []);
        console.log("(res.data", res.data)
      } else {
        setOwnerList([]);
      }
    };

    fetchOwners();
  }, [ownerSearch]);
  const subscriptions = agentDetails?.subscriptions || [];
  const trial = agentDetails?.trials || [];
  const toggleOwner = (id) => {

    setExpandedOwners((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );

  };
  const resetAddClientForm = () => {
    setOwnerName("");
    setOwnerSearch("");
    setSelectedOwner("");
    setReason("");
    setComments("");

    setOwnerError("");
    setReasonError("");

    setShowOwnerDropdown(false);
    setShowReasonDropdown(false);
  };
  const validateAddClient = () => {
    let isValid = true;


    if (!selectedOwner) {
      setOwnerError("Please select an owner");
      isValid = false;
    } else {
      setOwnerError("");
    }


    if (!reason) {
      setReasonError("Please select a reason");
      isValid = false;
    } else {
      setReasonError("");
    }

    return isValid;
  };
  const openAddClientDrawer = () => {
    resetAddClientForm();
    setShowAddClientDrawer(true);
  };

  const closeAddClientDrawer = () => {
    setShowAddClientDrawer(false);
    resetAddClientForm();
  };

const handleAddClient = async () => {
  if (!validateAddClient()) {
    return;
  }

  const payload = {
    agentId: agentId,
    reason: reason,
    comments: comments,
  };

  console.log("Assign Relational Agent Payload:", {
    parentId: selectedOwner,
    payload,
  });

  const res = await assignRelationalAgent(selectedOwner, payload);

  if (res?.success) {
    closeAddClientDrawer();

    setModalType("success");
    setMessage(res.message || "Staff assigned successfully");
    setShowSuccess(true);

    const details = await getAgentDetails(agentId);

    if (details?.success) {
      setAgentDetails(details.data);
    }

    setTimeout(() => {
      setShowSuccess(false);
    }, 1000);
  } else {
    setModalType("error");
    setMessage(res.message);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1000);
  }
};
  return (
    <DashboardLayout>
        <Toast
                show={showSuccess}
                message={message}
                type={modalType}

            />
      <div className="w-full min-h-screen bg-white-common">
        <div className="sticky top-0 z-50 bg-white-common flex items-center gap-4 px-4 sm:px-8 py-3 border-b border-gray-200">

          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 text-xl cursor-pointer"
          >
            <img src={Arrow} alt="Arrow" className="w-4 h-4" />
          </button>

          <div>
            <h2 className="text-[18px] font-semibold text-gray-900 leading-6 text-start">
              User Info
            </h2>
            <p className="text-[12px] text-gray-500">
              <span className="text-gray-800">IAM Users</span> › Overview
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[455px_1fr] min-h-[calc(100vh-61px)]">

          <div className="px-4 sm:px-5 py-6 border-b lg:border-b-0 lg:border-r border-gray-200">

            <div className="bg-[#FAFBFF] border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-white-common border border-gray-200 rounded-xl flex items-center justify-center text-sm font-semibold text-gray-700">
                    {agentDetails?.initials || "NA"}
                  </div>

                  <div>
                    <h3 className="text-[16px] font-semibold text-gray-900 text-left">
                      {agentDetails?.fullName || "N/A"}
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-1">
                      {agentDetails?.roleName || "Support Agent"}
                    </p>
                  </div>
                </div>

                <button className="text-gray-700 text-xl cursor-pointer">⋮</button>
              </div>

              <div className="mt-5 space-y-3 text-[13px]">
                <p className="text-blue-600 flex items-center gap-2">
                  <img src={Mail} className="w-4 h-4" />
                  {agentDetails?.email || "susi.r5@gmail.com"}
                </p>
                <p className="text-blue-600 flex items-center gap-2">
                  <img src={Mobile} className="w-4 h-4" />
                  {agentDetails?.mobile || "+91 95782 34961"}
                </p>
              </div>

              {/* <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-white border border-gray-200 rounded-md p-3 h-[72px]">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                    Onboarded
                  </p>
                  <p className="text-blue-600 font-bold text-[22px] mt-2">05</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-md p-3 h-[72px]">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Trial Conv.
                  </p>
                  <p className="text-blue-600 font-bold text-[22px] mt-2">80%</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-md p-3 h-[72px]">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Avg. Support
                  </p>
                  <p className="text-blue-600 font-bold text-[22px] mt-2">2h</p>
                </div>
              </div> */}

              {/* <p className="text-[11px] text-blue-600 mt-3 text-start">
                ⓘ Based upon last 30 Days
              </p> */}
            </div>


            <div className="flex items-center justify-between mt-5 mb-3">
              <h4 className="text-[13px] font-medium text-gray-800 text-start">
                Managing Clients
              </h4>

              <button
                onClick={openAddClientDrawer}
                type="button"

                className="
      px-4 py-2
      bg-[#2952F3]
      hover:bg-[#1E40D0]
      text-white
      text-[12px]
      font-medium
      rounded-lg
      cursor-pointer
      mr-2
    "
              >
                + Add
              </button>
            </div>
            <div className="border border-gray-200 rounded-2xl bg-white-common max-h-[400px] flex flex-col overflow-visible">


              <div
                className="overflow-y-auto flex-1 pr-1 overflow-x-visible"
                style={{
                  scrollbarColor: "#D9E9FF transparent"
                }}
              >
                {agentDetails?.hostelRelations?.length > 0 ? (

                  agentDetails.hostelRelations.map((relation, relationIndex) => {

                    const isExpanded =
                      expandedOwners.includes(relation.id);

                    return (

                      <div
                        key={relation.id}
                        className={`
          px-5 py-5
          ${relationIndex !==
                            agentDetails.hostelRelations.length - 1
                            ? "border-b border-gray-100"
                            : ""
                          }
        `}
                      >

                        {/* OWNER HEADER */}
                        <div
                          onClick={() => toggleOwner(relation.id)}
                          className="
            flex items-center justify-between
            cursor-pointer
            group
          "
                        >

                          <div className="flex items-center gap-3">

                            {/* INITIAL */}
                            <div
                              className="
                w-8 h-8
                rounded-2xl
                bg-gradient-to-br
                from-blue-100
                to-blue-50
                flex items-center justify-center
                border border-blue-100
                shrink-0
              "
                            >
                              <span className="text-[13px] font-bold text-[#2563EB] uppercase">
                                {relation?.owner?.initials || "NA"}
                              </span>
                            </div>

                            {/* INFO */}
                            <div className="text-left">

                              {/* <p className="text-[15px] font-semibold text-gray-900">
                {relation?.owner?.fullName || "N/A"}
              </p> */}
                              <p
                                onClick={(e) => {

                                  e.stopPropagation();

                                  navigate(
                                    `/ProprietorsOverview/${relation?.owner?.ownerId}`,
                                    {
                                      state: {
                                        from: location.pathname
                                      }
                                    }
                                  );

                                }}
                                className="
    text-[15px]
    font-semibold
    text-primaryBlue
    cursor-pointer
    hover:underline
  "
                              >
                                {relation?.owner?.fullName || "N/A"}
                              </p>

                              <p className="text-[12px] text-gray-500">
                                {relation?.hostels?.length || 0} Properties
                              </p>

                            </div>

                          </div>


                          <div
                            className={`
              text-gray-400 text-lg transition-transform duration-200
              ${isExpanded ? "rotate-180" : ""}
            `}
                          >
                            <img src={downArrow} className="w-4 h-4" />
                          </div>

                        </div>


                        {isExpanded && (

                          <div className="mt-4 ml-4 border-l-2 border-gray-100 pl-5 space-y-4">

                            {relation.hostels?.map((item) => (

                              <div
                                key={item.hostelId}
                                className="
    bg-[#FCFCFD]
    border border-gray-100
    rounded-2xl
    px-4 py-4
    hover:border-blue-100
    hover:shadow-sm
    transition-all duration-200
  "
                              >

                                <div className="flex gap-3">

                                  {/* INITIAL */}
                                  <div
                                    className="
        w-8 h-8
        rounded-2xl
        bg-[#EAF2FF]
        flex items-center justify-center
        shrink-0
      "
                                  >
                                    <span className="text-[12px] font-bold text-[#2563EB] uppercase">
                                      {item.initials}
                                    </span>
                                  </div>


                                  <div className="flex-1 min-w-0 text-left">


                                    <div className="flex items-center justify-between gap-2 w-full">


                                      <p
                                        title={item.hostelName}
                                        onClick={(e) => {

                                          e.stopPropagation();

                                          navigate(
                                            `/property-overview/${item.hostelId}`,
                                            {
                                              state: {
                                                from: location.pathname
                                              }
                                            }
                                          );

                                        }}
                                        className="
    text-[14px]
    font-semibold
    text-primaryBlue
    w-[150px]
    truncate
    whitespace-nowrap
    overflow-hidden
    cursor-pointer
    hover:underline
  "
                                      >
                                        {item.hostelName}
                                      </p>


                                      <span
                                        title={item.planName}
                                        className={`
      shrink-0
      text-[10px]
      px-3 py-[4px]
      rounded-full
      font-medium
      whitespace-nowrap

      ${item.planName === "Premium"
                                            ? "bg-orange-50 text-orange-600"
                                            : item.planName === "Trial"
                                              ? "bg-yellow-50 text-yellow-700"
                                              : "bg-blue-50 text-blue-600"
                                          }
    `}
                                      >
                                        {item.planName || "N/A"}
                                      </span>

                                    </div>

                                    {/* CITY */}
                                    <div className="mt-2 flex items-center gap-2">

                                      <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0"></div>

                                      <div className="relative group w-fit">

                                        <p className="text-[13px] text-gray-500 cursor-pointer">
                                          {item.city}
                                        </p>

                                        {/* TOOLTIP */}
                                        <div
                                          className="
              absolute
              bottom-full
              left-0
              mb-2
              hidden
              group-hover:block
              bg-gray-900
              text-white
              text-[10px]
              px-3 py-2
              rounded-xl
              shadow-xl
              whitespace-nowrap
              z-[99999]
            "
                                        >
                                          {item.fullAddress}
                                        </div>

                                      </div>

                                    </div>

                                    {/* EXPIRE */}
                                    {item.aboutToExpire && (

                                      <div className="mt-3 text-left">

                                        <span
                                          className="
              inline-flex items-center gap-1
              text-[9px]
              px-3 py-[4px]
              rounded-full
              bg-red-50
              text-red-600
              font-medium
            "
                                        >
                                          ⚠️

                                          {item.expiringInDays === 0
                                            ? "Expires today"
                                            : `Expires in ${item.expiringInDays} day${item.expiringInDays !== 1
                                              ? "s"
                                              : ""
                                            }`
                                          }

                                        </span>

                                      </div>

                                    )}

                                  </div>

                                </div>

                              </div>

                            ))}

                          </div>

                        )}

                      </div>

                    );

                  })

                ) : (

                  <div className="py-14 text-center">

                    <p className="text-sm text-gray-400">
                      No Properties Found
                    </p>

                  </div>

                )}

              </div>

            </div>
          </div>


          <div className="px-8 py-6">


            <div className="flex gap-10 mb-8">


              <button
                onClick={() => setActiveTab("activity")}
                className={`pb-2 text-[13px] font-semibold border-b-2 cursor-pointer ${activeTab === "activity"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent"
                  }`}
              >
                Recent Activity
              </button>

              {/* Subscriptions */}
              <button
                onClick={() => setActiveTab("subscription")}
                className={`pb-2 text-[13px] font-semibold border-b-2  cursor-pointer ${activeTab === "subscription"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent"
                  }`}
              >
                Subscriptions
              </button>
              <button
                onClick={() => setActiveTab("trial")}
                className={`pb-2 text-[13px] font-semibold border-b-2 cursor-pointer ${activeTab === "trial"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent"
                  }`}
              >
                Trial
              </button>
            </div>


            {activeTab === "activity" ? (

              <div className="relative pl-5 max-h-[400px] overflow-y-auto pr-2 text-left">
                {agentDetails?.agentActivities?.length > 0 ? (

                  agentDetails.agentActivities.map((activity, index, arr) => (
                    <div key={index} className="relative flex gap-5 pb-8">

                      {index !== arr.length - 1 && (
                        <div className="absolute left-[15px] top-9 w-px h-full bg-gray-200"></div>
                      )}

                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-gray-200 flex items-center justify-center z-10">
                        <img src={Message} className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="pt-1">
                          <h4 className="text-[14px] font-semibold text-gray-900">
                            {activity.activityType}
                          </h4>
                          <p className="text-[13px] text-gray-700 mt-2">
                            {activity.description}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-2">
                            {activity.createdAtDate}, {activity.createdAtTime}
                          </p>
                        </div>
                      </div>

                    </div>
                  ))

                ) : (
                  <p className="text-gray-400 text-sm">No Activity Found</p>
                )}
              </div>
            ) : activeTab === "subscription" ? (
              <div className="border border-gray-300 rounded-lg overflow-hidden">

                <table className="w-full text-sm table-fixed">
                  <thead>
                    <tr className="text-gray-500 text-[12px] text-left border-b border-gray-300 bg-white-common">
                      <th className="py-3 px-4 w-[26%]">Property Name</th>
                      <th className="py-3 px-4 w-[28%] text-left">Plan Type</th>
                      <th className="py-3 px-4 w-[23%]">Start Date</th>
                      <th className="py-3 px-4 w-[23%]">Expiry Date</th>
                    </tr>
                  </thead>
                </table>

                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full text-sm table-fixed">
                    <tbody className="text-gray-700">

                      {subscriptions.length > 0 ? (
                        subscriptions.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-300 last:border-0 text-[12px]"
                          >
                            <td
                              className="py-4 px-4 w-[26%] text-left truncate"
                              title={item?.hostelName}
                            >
                              {item?.hostelName}
                            </td>

                            <td className="py-4 px-4 w-[28%] text-left overflow-hidden">
                              <span
                                className={`inline-block text-[10px] font-medium px-2 py-[3px] rounded whitespace-nowrap
                  ${item.planType === "STANDARD"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-orange-100 text-orange-600"
                                  }`}
                              >
                                {item.planType?.replace(/_/g, " ")}
                              </span>
                            </td>

                            <td className="px-4 w-[23%] text-left">
                              {item.planStartsAt}
                            </td>

                            <td className="px-4 w-[23%] text-left">
                              {item.planEndsAt}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center py-8 text-gray-400"
                          >
                            🚫 No Trial Available
                          </td>
                        </tr>
                      )}

                    </tbody>
                  </table>
                </div>

              </div>
            ) : (
              <>
                <div className="border border-gray-300 rounded-lg overflow-hidden">

                  <table className="w-full text-sm table-fixed">
                    <thead>
                      <tr className="text-gray-500 text-[12px] text-left border-b border-gray-300 bg-white-common">
                        <th className="py-3 px-4 w-[26%]">Property Name</th>
                        <th className="py-3 px-4 w-[28%] text-left">Plan Type</th>
                        <th className="py-3 px-4 w-[23%]">Start Date</th>
                        <th className="py-3 px-4 w-[23%]">Expiry Date</th>
                      </tr>
                    </thead>
                  </table>

                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-sm table-fixed">
                      <tbody className="text-gray-700">

                        {trial.length > 0 ? (
                          trial.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-gray-300 last:border-0 text-[12px]"
                            >
                              <td
                                className="py-4 px-4 w-[26%] text-left truncate"
                                title={item?.hostelName}
                              >
                                {item?.hostelName}
                              </td>

                              <td className="py-4 px-4 w-[28%] text-left overflow-hidden">
                                <span
                                  className={`inline-block text-[10px] font-medium px-2 py-[3px] rounded whitespace-nowrap
                  ${item.planType === "STANDARD"
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-orange-100 text-orange-600"
                                    }`}
                                >
                                  {item.planType?.replace(/_/g, " ")}
                                </span>
                              </td>

                              <td className="px-4 w-[23%] text-left">
                                {item.planStartsAt}
                              </td>

                              <td className="px-4 w-[23%] text-left">
                                {item.planEndsAt}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="text-center py-8 text-gray-400"
                            >
                              🚫 No Trial Available
                            </td>
                          </tr>
                        )}

                      </tbody>
                    </table>
                  </div>

                </div>
              </>
            )}


          </div>
        </div>
      </div>
      {showAddClientDrawer && (
        <>

          <div
            className="fixed inset-0 bg-black/30 z-[90]"
            onClick={closeAddClientDrawer}
          />


          <div
            className="
    fixed
    top-4
    right-4
    bottom-4
    w-[420px]
    bg-white
    z-[100]
    shadow-2xl
    rounded-xl
    flex
    flex-col
    overflow-hidden
  "
          >

         
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

              <div>
                <h2 className="text-[16px] font-semibold text-gray-900 text-left">
                  Add Client
                </h2>

                <p className="text-[11px] text-gray-500 mt-1">
                  Assign an owner and add details
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddClientDrawer}
                className="
            w-8 h-8
            rounded-lg
            flex items-center justify-center
            text-gray-500
            hover:bg-gray-100
            text-xl
            cursor-pointer
          "
              >
                ×
              </button>

            </div>



            <div className="flex-1 overflow-y-auto px-6 py-6">


              {/* <div className="mb-5 relative">
                <label className="block text-[12px] font-medium text-gray-700 mb-2 text-left">
                  Owner Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => {
                    const value = e.target.value;

                    setOwnerName(value);
                    setOwnerSearch(value);
                    setSelectedOwner("");
                    setOwnerError("")
                    setShowOwnerDropdown(value.trim().length > 0);
                  }}
                  placeholder="Search owner..."
                  className="
      w-full
      h-11
      border border-gray-300
      rounded-lg
      px-3
      text-[12px]
      text-gray-700
      outline-none
      focus:border-[#2952F3]
    "
                />

               
                {showOwnerDropdown && ownerSearch.trim() !== "" && (
                  <div
                    className="
        absolute
        left-0
        right-0
        top-[72px]
        bg-white
        border border-gray-200
        rounded-lg
        shadow-lg
        z-[200]
        max-h-[220px]
        overflow-y-auto
      "
                  >
                    {ownerList?.length > 0 ? (
                      ownerList.map((owner) => (
                        <button
                          key={owner.ownerId}
                          type="button"
                          onClick={() => {
                            setOwnerName(owner.fullName);
                            setSelectedOwner(owner.parentId);


                            setShowOwnerDropdown(false);
                          }}
                          className="
              w-full
              px-4 py-3
              flex items-center gap-3
              text-left
              hover:bg-[#F5F7FF]
              cursor-pointer
              border-b border-gray-100
              last:border-0
            "
                        >
                          <div
                            className="
                w-8 h-8 rounded-full
                bg-[#EAF2FF]
                text-[#2952F3]
                flex items-center justify-center
                text-[11px] font-semibold
                shrink-0
              "
                          >
                            {owner?.fullName
                              ?.split(" ")
                              .map((name) => name[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-gray-800 truncate">
                              {owner?.fullName}
                            </p>

                            {owner?.email && (
                              <p className="text-[10px] text-gray-400 truncate">
                                {owner.email}
                              </p>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-center text-[12px] text-gray-400">
                        No owners found
                      </div>
                    )}
                  </div>
                )}
                {ownerError && <ErrorMessage message={ownerError} type="error" />}
              </div> */}
              <div className="mb-5 relative">
  <label className="block text-[12px] font-medium text-gray-700 mb-2 text-left">
    Owner Name <span className="text-red-500">*</span>
  </label>

  <input
    type="text"
    value={ownerName}
    onFocus={() => {
      // Click/focus pannumbothu existing owners show aaganum
      if (ownerList?.length > 0) {
        setShowOwnerDropdown(true);
      }
    }}
    onChange={(e) => {
      const value = e.target.value;

      setOwnerName(value);
      setOwnerSearch(value);
      setSelectedOwner("");
      setOwnerError("");

      // Type pannina dropdown open
      setShowOwnerDropdown(value.trim().length > 0);
    }}
    placeholder="Search owner..."
    className="
      w-full
      h-11
      border border-gray-300
      rounded-lg
      px-3
      text-[12px]
      text-gray-700
      outline-none
      focus:border-[#2952F3]
    "
  />

  {/* Owner Dropdown */}
  {showOwnerDropdown && (
    <div
      className="
        absolute
        left-0
        right-0
        top-[72px]
        bg-white
        border border-gray-200
        rounded-lg
        shadow-lg
        z-[200]
        max-h-[220px]
        overflow-y-auto
      "
    >
      {ownerList?.length > 0 ? (
        ownerList.map((owner) => (
          <button
            key={owner.ownerId}
            type="button"
            onClick={() => {
              setOwnerName(owner.fullName);
              setSelectedOwner(owner.parentId);
              setOwnerSearch(owner.fullName);

              setOwnerError("");
              setShowOwnerDropdown(false);
            }}
            className="
              w-full
              px-4 py-3
              flex items-center gap-3
              text-left
              hover:bg-[#F5F7FF]
              cursor-pointer
              border-b border-gray-100
              last:border-0
            "
          >
            <div
              className="
                w-8 h-8 rounded-full
                bg-[#EAF2FF]
                text-[#2952F3]
                flex items-center justify-center
                text-[11px] font-semibold
                shrink-0
              "
            >
              {owner?.fullName
                ?.split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-[12px] font-medium text-gray-800 truncate">
                {owner?.fullName}
              </p>

              {owner?.email && (
                <p className="text-[10px] text-gray-400 truncate">
                  {owner.email}
                </p>
              )}
            </div>
          </button>
        ))
      ) : (
        <div className="px-4 py-4 text-center text-[12px] text-gray-400">
          No owners found
        </div>
      )}
    </div>
  )}

  {ownerError && (
    <ErrorMessage message={ownerError} type="error" />
  )}
</div>



              <div className="mb-4 text-left">
                <label className="block text-[12px] font-medium text-gray-700 mb-2 text-left">
                  Select Reason <span className="text-red-500">*</span>
                </label>
                <div className="relative">


                  <div
                    onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer"
                  >
                    <span className="text-sm">
                      {reasonList.find(r => r.key === reason)?.label || "Select"}
                    </span>

                    <img src={ArrowDown} className="w-5 h-5" />

                  </div>

                
                  {showReasonDropdown && (
                    <div className="absolute w-full mt-1 bg-white-common border rounded-lg shadow-md max-h-40 overflow-y-auto z-50">

                      {reasonList.map((item) => (
                        <div
                          key={item.key}
                          onClick={() => {
                            setReason(item.key);
                            setReasonError("");
                            setShowReasonDropdown(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {reasonError && <ErrorMessage message={reasonError} type="error" />}
              </div>


            
              <div className="mb-5">

                <label className="block text-[12px] font-medium text-gray-700 mb-2 text-left">
                  Comments
                </label>

                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter comments..."
                  rows={5}
                  className="
              w-full
              border border-gray-300
              rounded-lg
              px-3 py-2.5
              text-[12px]
              outline-none
              resize-none
              focus:border-[#2952F3]
            "
                />

              </div>

            </div>


           
            <div
              className="
          border-t border-gray-200
          px-6 py-4
          flex justify-end gap-3
        "
            >

              <button
                type="button"
                onClick={closeAddClientDrawer}
                className="
            px-4 py-2
            border border-gray-300
            rounded-lg
            text-[12px]
            text-gray-700
            hover:bg-gray-50
            cursor-pointer
          "
              >
                Cancel
              </button>

              <button
                type="button"
               onClick={handleAddClient}
                className="
            px-5 py-2
            bg-[#2952F3]
            hover:bg-[#1E40D0]
            text-white
            rounded-lg
            text-[12px]
            font-medium
            cursor-pointer
          "
              >
                Add Client
              </button>

            </div>

          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default UserInfo;