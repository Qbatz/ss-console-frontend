import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronDown,
  MoreVertical,
  User,
  Building2,
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";
import { useSupportTickets } from "../../Context/SupportTicketsContext";
import { useSubscription } from "../../Context/SubscriptionContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";
import { useNavigate } from "react-router-dom";

const UpdateSupportStatusModal = ({
  open,
  onClose,
  ticketId, reFreshData,currentStatus,currentData
}) => {
  console.log("currentData", currentData)
  const {
    loading,
    updateSupportTicketStatus,
    getSupportTicketStatus,
    getSupportTicketPriority,
    searchOwners
  } = useSupportTickets();
  const {getAgentsDropdown} = useSubscription();
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [statusList, setStatusList] = useState([]);
  const navigate = useNavigate();
  const filteredStatuses =

  statusList.find(
    (item) =>
      item.key === currentStatus
  )?.allowedStatuses || [];
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [priority, setPriority] = useState("");
  const [priorityList, setPriorityList] = useState([]);

  const [openPriorityDropdown, setOpenPriorityDropdown] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState("");

  const [agentList, setAgentList] = useState([]);

  const [openAgentDropdown, setOpenAgentDropdown] = useState(false);

  const statusDropdownRef = useRef(null);
  const [statusError, setStatusError] = useState("");
  const [agentError, setAgentError] = useState("");
  const [priorityError, setPriorityError] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const handleClose = () => {

    onClose();

    // values
    setStatus("");
    setComments("");
    setPriority("");
    setSelectedAgent("");

    // dropdowns
    setOpenStatusDropdown(false);
    setOpenPriorityDropdown(false);
    setOpenAgentDropdown(false);

    // errors
    setStatusError("");
    setAgentError("");
    setPriorityError("");

  };
  useEffect(() => {

    const fetchPriority =
      async () => {

        const res =
          await getSupportTicketPriority();

        if (res.success) {

          setPriorityList(
            res.data || []
          );

        }

      };

    fetchPriority();

  }, []);

  useEffect(() => {

    const fetchAgents =
      async () => {

        const res =
          await getAgentsDropdown();

        if (res.success) {

          setAgentList(
            res.data || []
          );

        }

      };

    fetchAgents();

  }, []);
  useEffect(() => {

    const fetchStatus =
      async () => {

        const res =
          await getSupportTicketStatus();

        if (res.success) {

          setStatusList(
            res.data || []
          );

        }

      };

    fetchStatus();

  }, []);
  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(
          event.target
        )
      ) {

        setOpenStatusDropdown(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);
  const handleSubmit = async () => {

    let hasError = false;

    // STATUS VALIDATION
    if (!status) {

      setStatusError(
        "Please select status"
      );

      hasError = true;

    } else {

      setStatusError("");

    }

    // ASSIGNED VALIDATION
    if (status === "ASSIGNED") {

      if (!selectedAgent) {

        setAgentError(
          "Please select agent"
        );

        hasError = true;

      } else {

        setAgentError("");

      }

      if (!priority) {

        setPriorityError(
          "Please select priority"
        );

        hasError = true;

      } else {

        setPriorityError("");

      }

    } else {

      setAgentError("");

      setPriorityError("");

    }

    if (hasError) return;

    const payload = {

      ticketStatus: status,

      comments,

      agentId:
        status === "ASSIGNED"
          ? selectedAgent
          : null,

      priority:
        status === "ASSIGNED"
          ? priority
          : null,

    };

    const res =
      await updateSupportTicketStatus(
        ticketId,
        payload
      );

    if (res.success) {
      setModalType("success");

      setMessage(res?.data || "Status Updated Successfully");

      reFreshData();

      setShowSuccess(true);

      setTimeout(() => {

        setShowSuccess(false);

        handleClose();

      }, 1300);


    }
    else {
      setModalType("error");

      setMessage(res?.message);


      setShowSuccess(true);

      setTimeout(() => {

        setShowSuccess(false);



      }, 1300);
    }

  };

  if (!open) return null;

  return (
    <>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div className="fixed inset-0 z-[99999]">


        <div
          className="absolute inset-0 bg-black/40"
          onClick={handleClose}
        />


        <div className="fixed top-3 right-3 bottom-3 w-[420px] bg-white-common rounded-2xl shadow-2xl flex flex-col overflow-hidden">

          <div className="flex items-center justify-between px-6 py-5 border-b border-[#edf0f7]">

            <h2 className="text-[24px] font-semibold text-[#111827]">
              Update status
            </h2>

            <button
              onClick={handleClose}
              className="text-red-500"
            >
              <X size={22} />
            </button>

          </div>


          <div className="flex-1 overflow-y-auto px-6 py-5">


            <div
              className="
              border border-[#edf0f7]
              rounded-2xl
              p-5
              bg-[#fcfcfd]
            "
            >

              {/* TOP */}
              <div className="flex items-center justify-between mb-5">

                <h3 className="text-[13px] font-semibold text-[#6b7280] tracking-wide uppercase">
                  Property Info
                </h3>

                {/* <button className="text-gray-500">
                  <MoreVertical size={18} />
                </button> */}

              </div>

              {/* INFO LIST */}
              <div className="space-y-4">

                {/* CUSTOMER */}
                <div className="flex items-start gap-3">

                  <User
                    size={15}
                    className="text-gray-400 mt-[2px]"
                  />

                  <div className="flex gap-2 text-sm">

                    <span className="text-[#6b7280] min-w-[110px] text-left">
                      Customer Name
                    </span>

                    {/* <span className="font-medium text-[#111827]">
                      {currentData?.owner.fullName || "N/A"}
                    </span> */}
<p
  onClick={() => {

    if (
      currentData?.owner?.ownerId
    ) {

      navigate(
        `/ProprietorsOverview/${currentData.owner.ownerId}`
      );

    }

  }}
  className="
    text-[14px]
    font-medium
    text-[#315CEC]
    cursor-pointer
    hover:underline
  "
>

  {currentData?.owner?.fullName || "----"}

</p>
                  </div>

                </div>

                {/* PROPERTY */}
                <div className="flex items-start gap-3">

                  <Building2
                    size={15}
                    className="text-gray-400 mt-[2px]"
                  />

                  <div className="flex gap-2 text-sm">

                    <span className="text-[#6b7280] min-w-[110px] text-left">
                      Property Name
                    </span>

                    <div className="flex items-center gap-1">

                      {/* <span className="font-medium text-[#315CEC]">
                       {currentData?.hostelName}
                      </span> */}
                      <span
  onClick={() => {

    if (
      currentData?.hostelId
    ) {

      navigate(
        `/property-overview/${currentData.hostelId}`,
        {
          state: {
            from: "supportTickets"
          }
        }
      );

    }

  }}
  className="
    font-medium
    text-[#315CEC]
    cursor-pointer
    hover:underline
  "
>

  {currentData?.hostelName}

</span>

                      <ExternalLink
                        size={13}
                        className="text-[#315CEC]"
                      />

                    </div>

                  </div>

                </div>

                {/* LOCATION */}
                <div className="flex items-start gap-3">

                  <MapPin
                    size={15}
                    className="text-gray-400 mt-[2px]"
                  />

                <div className="flex gap-2 text-sm">

  <span className="text-[#6b7280] min-w-[110px] text-left">
    Location
  </span>

  <span
    title={currentData?.fullAddress || ""}
    className="
      font-medium
      text-[#111827]
      truncate
      max-w-[180px]
      cursor-pointer
    "
  >
    {currentData?.hostelCity}

    {currentData?.hostelCity &&
      currentData?.hostelState
      ? ", "
      : ""}

    {currentData?.hostelState}

  </span>

</div>

                </div>

                {/* MOBILE */}
                <div className="flex items-start gap-3">

                  <Phone
                    size={15}
                    className="text-gray-400 mt-[2px]"
                  />

                  <div className="flex gap-2 text-sm">

                    <span className="text-[#6b7280] min-w-[110px] text-left">
                      Mobile
                    </span>

                    <span className="font-medium text-[#111827]">
                      +91 {currentData?.hostelMobile}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* FORM */}
            <div className="mt-6 space-y-5">

              {/* STATUS */}
              <div className="flex flex-col md:flex-row md:gap-4">


                <label
                  className="
      w-full md:w-[110px]
      shrink-0
      text-sm
      text-[#374151]
      pt-3
      text-left
    "
                >
                  Update Lead Status

                  <span className="text-red-500 ml-1">
                    *
                  </span>

                </label>


                <div className="flex-1 relative">


                  <div
                    onClick={() => {

                      setOpenStatusDropdown(
                        !openStatusDropdown
                      );

                      setStatusError("");

                    }}
                    className="
        w-full
        h-[48px]
        border border-[#e5e7eb]
        rounded-xl
        px-4
        flex items-center
        justify-between
        text-sm
        bg-white-common
        cursor-pointer
      "
                  >

                    <span>

                     {
  filteredStatuses.find(
    (s) =>
      s.key === status
  )?.label ||
  "Select Status"
}

                    </span>

                    <ChevronDown size={18} />

                  </div>

                  {/* DROPDOWN */}
                  {openStatusDropdown && (

                    <div
                      className="
          absolute
          top-full
          left-0
          mt-2
          w-full
          bg-white-common
          border border-[#e5e7eb]
          rounded-xl
          shadow-xl
          z-[9999]
          max-h-[150px]
          overflow-y-auto
        "
                    >

                      {filteredStatuses.map((item) => (

                        <div
                          key={item.key}
                          onClick={() => {

                            setStatus(
                              item.key
                            );

                            setOpenStatusDropdown(
                              false
                            );

                          }}
                          className="
              px-4 py-3
              text-sm
              hover:bg-cardBg
              cursor-pointer
              text-left
            "
                        >

                          {item.label}

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              </div>
              <div className="md:pl-[124px] pl-0">
                {statusError && (
                  <ErrorMessage
                    message={statusError}
                    type="error"
                  />
                )}
              </div>
              {status === "ASSIGNED" && (

                <>

                  <div className="flex flex-col md:flex-row md:gap-4">

                    <label
                      className="
          w-full md:w-[110px]
          shrink-0
          text-sm
          text-[#374151]
          pt-3
          text-left
        "
                    >
                      Assign Agent

                      <span className="text-red-500 ml-1">
                        *
                      </span>

                    </label>

                    <div className="relative flex-1">

                      <div
                        onClick={() => {

                          setOpenAgentDropdown(
                            !openAgentDropdown
                          );

                          setAgentError("");

                        }}
                        className="
      w-full h-[48px]
      border border-[#e5e7eb]
      rounded-xl
      px-4
      flex items-center justify-between
      cursor-pointer
      bg-white-common
    "
                      >

                        <span>

                          {
                            agentList.find(
                              (a) =>
                                a.agentId === selectedAgent
                            )?.agentName ||
                            "Select Agent"
                          }

                        </span>

                        <ChevronDown size={18} />

                      </div>

                      {openAgentDropdown && (

                        <div
                          className="
        absolute top-full left-0
        mt-2 w-full
        bg-white-common
        border border-[#e5e7eb]
        rounded-xl
        shadow-xl
        z-[9999]
        max-h-[220px]
        overflow-y-auto
      "
                        >

                          {agentList.map((item) => (

                            <div
                              key={item.agentId}
                              onClick={() => {

                                setSelectedAgent(
                                  item.agentId
                                );

                                setOpenAgentDropdown(
                                  false
                                );

                              }}
                              className="
            px-4 py-3
            hover:bg-cardBg
            cursor-pointer
            text-sm
          "
                            >

                              {item.agentName}

                            </div>

                          ))}

                        </div>

                      )}

                    </div>

                  </div>
                  {agentError && (

                    <div className="md:pl-[124px] pl-0">

                      <ErrorMessage
                        message={agentError}
                        type="error"
                      />

                    </div>

                  )}

                  <div className="flex flex-col md:flex-row md:gap-4">

                    <label
                      className="
          w-full md:w-[110px]
          shrink-0
          text-sm
          text-[#374151]
          pt-3
          text-left
        "
                    >
                      Priority

                      <span className="text-red-500 ml-1">
                        *
                      </span>

                    </label>

                    <div className="relative flex-1">

                      <div
                        onClick={() => {

                          setOpenPriorityDropdown(
                            !openPriorityDropdown
                          );

                          setPriorityError("");

                        }}
                        className="
      w-full h-[48px]
      border border-[#e5e7eb]
      rounded-xl
      px-4
      flex items-center justify-between
      cursor-pointer
      bg-white-common
    "
                      >

                        <span>

                          {
                            priorityList.find(
                              (p) =>
                                p.key === priority
                            )?.label ||
                            "Select Priority"
                          }

                        </span>

                        <ChevronDown size={18} />

                      </div>

                      {openPriorityDropdown && (

                        <div
                          className="
        absolute top-full left-0
        mt-2 w-full
        bg-white-common
        border border-[#e5e7eb]
        rounded-xl
        shadow-xl
        z-[9999]
        max-h-[200px]
        overflow-y-auto
      "
                        >

                          {priorityList.map((item) => (

                            <div
                              key={item.key}
                              onClick={() => {

                                setPriority(
                                  item.key
                                );

                                setOpenPriorityDropdown(
                                  false
                                );

                              }}
                              className="
            px-4 py-3
            hover:bg-cardBg
            cursor-pointer
            text-sm
          "
                            >

                              {item.label}

                            </div>

                          ))}

                        </div>

                      )}

                    </div>

                  </div>
                  {priorityError && (

                    <div className="md:pl-[124px] pl-0">

                      <ErrorMessage
                        message={priorityError}
                        type="error"
                      />

                    </div>

                  )}

                </>

              )}

              <div className="flex flex-col md:flex-row md:gap-4">

                <label
                  className="
                  w-full md:w-[110px]
                  shrink-0
                  text-sm
                  text-[#374151]
                  pt-3
                  text-left
                "
                >
                  Additional Comments

                </label>

                <div className="flex-1">

                  <textarea
                    placeholder="..."
                    value={comments}
                    onChange={(e) =>
                      setComments(e.target.value)
                    }
                    className="
                    w-full
                    h-[110px]
                    border border-[#e5e7eb]
                    rounded-xl
                    p-4
                    resize-none
                    outline-none
                    text-sm
                  "
                  />

                </div>

              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div
            className="
    shrink-0
    px-6
    py-5
    border-t border-[#edf0f7]
    flex justify-end gap-3
    bg-white-common
  "
          >

            <button
              onClick={handleClose}
              className="
      h-[44px]
      px-6
      rounded-xl
      border border-[#e5e7eb]
      text-sm
      font-medium cursor-pointer
    "
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
      h-[44px]
      px-8
      rounded-xl
      bg-[#315CEC]
      text-white
      text-sm
      font-medium
      disabled:opacity-50 cursor-pointer
    "
            >
              {
                loading
                  ? "Submitting..."
                  : "Submit"
              }
            </button>

          </div>

        </div>

      </div>
    </>
  );
};

export default UpdateSupportStatusModal;