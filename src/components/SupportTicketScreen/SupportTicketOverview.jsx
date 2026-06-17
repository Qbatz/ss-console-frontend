import React,{useState,useEffect} from "react";
import {
  X,
  MessageSquare,
  MapPin,
  Phone,
  User,
  Building2,
  ChevronRight,
} from "lucide-react";
import CommentBox from "../../assets/message-2.png";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../../Context/SubscriptionContext";
import { useSupportTickets } from "../../Context/SupportTicketsContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";

const SupportTicketOverview = ({
  open,
  onClose,
  selectedTicket,onAssignClick
}) => {
  const navigate = useNavigate();
 const {getSupportTicketNotes} = useSupportTickets();
  const {addSupportTicketNotes } = useSubscription();
  const [commentText,setCommentText] = useState("");

const [allComments,setAllComments] = useState([]);

const [notesError,setNotesError] = useState("");

const [addNotesLoading,setAddNotesLoading] = useState(false);
const [showAllComments,setShowAllComments] = useState(false);
const handleGetNotes =
  async () => {

    if (
      !selectedTicket?.ticketId
    ) return;

    const res =
      await getSupportTicketNotes(
        selectedTicket.ticketId
      );

    if (res?.success) {

      setAllComments(
        res.data || []
      );

    } else {

      setAllComments([]);

    }

};
useEffect(() => {

  if (open) {

    handleGetNotes();

  }

}, [open]);
const handleAddComment =
  async () => {

    if (addNotesLoading)
      return;

    if (
      !commentText.trim()
    ) {

      setNotesError(
        "Please enter notes"
      );

      return;

    }

    try {

      setAddNotesLoading(true);

      setNotesError("");

      const res =
        await addSupportTicketNotes(
          selectedTicket?.ticketId,
          commentText
        );

      if (res?.success) {

        setCommentText("");

        handleGetNotes();

      }

    } finally {

      setAddNotesLoading(false);

    }

};
const handleCloseDrawer =
  () => {

    setCommentText("");

    setNotesError("");

    setAllComments([]);

    setShowAllComments(false);

    onClose();

};
  if (!open) return null;

  return (
<>
    <div className="fixed inset-0 z-[999999]">

      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleCloseDrawer}
      
      />

      {/* DRAWER */}
      <div
  className="
    fixed
    top-3
    right-3
    bottom-3
    w-full
    flex
    justify-end
    pointer-events-none
  "
>

        <div
          className="
    pointer-events-auto
    w-full
    max-w-[520px]
    h-full
    bg-white
    rounded-[24px]
    shadow-2xl
    border border-[#E5E7EB]
    overflow-hidden
    flex
    flex-col
  "
          onClick={(e) =>
            e.stopPropagation()
          }
        >

          {/* HEADER */}
          <div
            className="
              flex items-center justify-between
              px-6 py-5
              border-b border-[#E5E7EB]
            "
          >

            <div className="flex items-center gap-2">

              <div
                className="
                  w-8 h-8
                  rounded-full
                  bg-[#EEF4FF]
                  flex items-center justify-center
                "
              >

                <img src={CommentBox}
                 
                  className="w-5 h-5"
                />

              </div>

              <h2
                className="
                  text-[18px]
                  font-semibold
                  text-[#111827]
                "
              >
                Support Ticket Overview
              </h2>

            </div>

            <button
              onClick={handleCloseDrawer}
              className="
                text-red-500
                hover:opacity-80 cursor-pointer
              "
            >

              <X size={22} />

            </button>

          </div>

          {/* BODY */}
          <div
  className="
    flex-1
    overflow-y-auto
    p-6
    space-y-6
  "
>

            {/* PROPERTY INFO */}
            <div
              className="
                border border-[#E5E7EB]
                rounded-2xl
                p-5
                bg-[#FCFCFD]
              "
            >

              <div className="flex items-center justify-between mb-5">

                <h3
                  className="
                    text-[11px]
                    uppercase
                    tracking-[1px]
                    font-semibold
                    text-[#6B7280]
                  "
                >
                  Property Info
                </h3>

                <button className="text-gray-400">
                  ⋮
                </button>

              </div>

              <div className="space-y-4">

                {/* CUSTOMER */}
                <div className="flex items-center gap-3 text-left">

                  <User
                    size={15}
                    className="text-[#9CA3AF]"
                  />

                  <p className="w-[120px] text-[13px] text-[#9CA3AF]">
                    Customer Name
                  </p>
<span className="mr-5 text-[#9CA3AF]">
                    :
                  </span>
                  {/* <p className="text-[14px] font-medium">
                    {selectedTicket?.owner?.fullName || "----"}
                  </p> */}
                  <p
  onClick={() => {

    if (
      selectedTicket?.owner?.ownerId
    ) {

      navigate(
        `/ProprietorsOverview/${selectedTicket.owner.ownerId}`
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

  {selectedTicket?.owner?.fullName || "----"}

</p>

                </div>

                {/* PROPERTY */}
                <div className="flex items-center gap-3 text-left">

                  <Building2
                    size={15}
                    className="text-[#9CA3AF]"
                  />

                  <p className="w-[120px] text-[13px] text-[#9CA3AF]">
                    Property Name
                  </p>
<span className="mr-5 text-[#9CA3AF]">
                    :
                  </span>
                  <div
  onClick={() => {

    if (
      selectedTicket?.hostelId
    ) {

     navigate(
  `/property-overview/${selectedTicket.hostelId}`,
  {
    state: {
      from: "supportTickets",

      currentPage:
        location.state?.currentPage,

      currentSearch:
        location.state?.currentSearch,

      currentStatusFilter:
        location.state?.currentStatusFilter,
    },
  }
);

    }

  }}
  className="
    flex
    items-center
    gap-1
    text-[#315CEC]
    font-semibold
    text-[14px]
    cursor-pointer
    hover:underline
  "
>

  {selectedTicket?.hostelName}

  <ChevronRight size={14} />

</div>

                </div>

                {/* LOCATION */}
                <div className="flex items-center gap-3 text-left">

                  <MapPin
                    size={15}
                    className="text-[#9CA3AF]"
                  />

                  <p className="w-[120px] text-[13px] text-[#9CA3AF]">
                    Location
                  </p>
<span className="mr-5 text-[#9CA3AF]">
                    :
                  </span>
                  <p
  title={
    selectedTicket?.fullAddress || "N/A"
  }
  className="
    text-[14px]
    font-medium
    cursor-pointer
  "
>
  {selectedTicket?.hostelCity}

  {selectedTicket?.hostelCity &&
    selectedTicket?.hostelState
      ? ", "
      : ""}

  {selectedTicket?.hostelState || ""}

  {!selectedTicket?.hostelCity &&
    !selectedTicket?.hostelState &&
    "N/A"}
</p>

                </div>

                {/* MOBILE */}
                <div className="flex items-center gap-3 text-left">

                  <Phone
                    size={15}
                    className="text-[#9CA3AF]"
                  />

                  <p className="w-[120px] text-[13px] text-[#9CA3AF]">
                    Mobile
                  </p>
<span className="mr-5 text-[#9CA3AF]">
                    :
                  </span>
                  <p className="text-[14px] font-medium">
                    {selectedTicket?.hostelMobile || "N/A"}
                  </p>

                </div>

              </div>

            </div>

            {/* TICKET INFO */}
            <div
              className="
                border border-[#E5E7EB]
                rounded-2xl
                p-5
              "
            >

              <div className="space-y-5 text-left">

                {/* SUBJECT */}
                <div className="flex items-start">

                  <p className="w-[120px] text-[13px] text-[#9CA3AF]">
                    Subject
                  </p>
<span className="mr-5 text-[#9CA3AF]">
                    :
                  </span>
                  <p className="text-[14px] text-[#111827] leading-6">
                    {selectedTicket?.subject}
                  </p>

                </div>

                {/* TICKET ID */}
                <div className="flex items-center">

                  <p className="w-[120px] text-[13px] text-[#9CA3AF]">
                    Ticket ID
                  </p>

                  <span className="mr-5 text-[#9CA3AF]">
                    :
                  </span>

                  <p className="font-semibold text-[14px]">
                    {selectedTicket?.ticketNumber}
                  </p>

                </div>

                {/* STATUS */}
                <div className="flex items-center">

                  <p className="w-[120px] text-[13px] text-[#9CA3AF]">
                    Ticket Status
                  </p>

                  <span className="mr-5 text-[#9CA3AF]">
                    :
                  </span>

                  <p className="text-[#F59E0B] font-medium text-[14px]">
                    {selectedTicket?.ticketStatus}
                  </p>

                </div>

                {/* PRIORITY */}
                <div className="flex items-center">

                  <p className="w-[120px] text-[13px] text-[#9CA3AF]">
                    Priority
                  </p>

                  <span className="mr-5 text-[#9CA3AF]">
                    :
                  </span>

                  <div
                    className="
                      bg-[#EEF4FF]
                      text-[#2563EB]
                      text-[13px]
                      px-3 py-1
                      rounded-full
                      flex items-center gap-2
                    "
                  >

                    <div className="w-2 h-2 rounded-full bg-[#2563EB] text-[14px]" />

                    {selectedTicket?.priority || "Priority Not Set"}

                  </div>

                </div>

                {/* TYPE */}
                <div className="flex items-center">

                  <p className="w-[120px] text-[13px] text-[#9CA3AF]">
                    Query Type
                  </p>

                  <span className="mr-5 text-[#9CA3AF]">
                    :
                  </span>

                  <p className="text-[14px]">
                    {selectedTicket?.queryType}
                  </p>

                </div>

{/* <div className="flex items-center">

  <p className="w-[120px] text-[13px] text-[#9CA3AF]">
    Assigned Staff
  </p>

  <span className="mr-5 text-[#9CA3AF]">
    :
  </span>

  <button
    onClick={() => {

      if (
        !selectedTicket?.canAssignStaff
      ) return;

      onAssignClick?.(
        selectedTicket
      );

    }}

    disabled={
      !selectedTicket?.canAssignStaff
    }

    className={`
      text-[14px]
      font-semibold
      transition-all

      ${
        selectedTicket?.canAssignStaff
          ? `
            text-[#315CEC]
            hover:underline
            cursor-pointer
          `
          : `
            text-[#9CA3AF]
            cursor-not-allowed
          `
      }
    `}
  >

    {selectedTicket?.assignedTo
      ? selectedTicket.assignedTo
      : selectedTicket?.canAssignStaff
      ? "Assign +"
      : "Assignment Locked"}

  </button>

</div> */}
{/* ASSIGNED STAFF */}
<div className="flex items-center">

  <p className="w-[120px] text-[13px] text-[#9CA3AF]">
    Assigned Staff
  </p>

  <span className="mr-5 text-[#9CA3AF]">
    :
  </span>

  <div
    onClick={() => {

      if (
        selectedTicket?.assignedToId
      ) {

        navigate(
          `/iam-user/${selectedTicket?.assignedToId}`
        );

      }

    }}
    className="
      bg-[#EEF4FF]
      text-[#2563EB]
      text-[13px]
      px-3
      py-1
      rounded-full
      flex
      items-center
      gap-1
      w-fit
      cursor-pointer
      hover:bg-[#DCE7FF]
      transition-all
    "
  >

    <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>

    {
      selectedTicket?.assignedTo ||
      "N/A"
    }

  </div>

</div>


{
  selectedTicket?.canAssignStaff === true && (

    <div className="flex items-center">

      <p className="w-[120px] text-[13px] text-[#9CA3AF]">
                 {selectedTicket?.assignedTo
          ? "ReAssign Staff"
          : "Assign Staff"}

      </p>

      <span className="mr-5 text-[#9CA3AF]">
        :
      </span>

      <button
        onClick={() =>
          onAssignClick?.(
            selectedTicket
          )
        }
        className="
    px-3 py-1.5
    rounded-lg
    bg-[#315CEC]
    text-white
    text-[13px]
    font-medium
    cursor-pointer
    hover:bg-[#2648C9]
    transition-all
  "
      >
        {selectedTicket?.assignedTo
    ? "↻ Reassign"
    : "+ Assign"}
      </button>

    </div>

  )
}

 <div className="pt-2 text-left">

      <label className="text-[14px] font-medium text-[#1D1D1D] ">
        Add Notes 
      </label>

      <div className="mt-3 border border-[#E5E7EB] rounded-xl overflow-hidden">

<textarea
  placeholder="Comment here"
  value={commentText}
  onChange={(e) => {

    setCommentText(
      e.target.value
    );

    setNotesError("");

  }}
  className="
    w-full
    h-[110px]
    resize-none
    outline-none
    p-4
    text-[13px]
    placeholder:text-[#9CA3AF]
  "
/>

        {/* BOTTOM TOOLBAR */}
        <div className="flex justify-end px-3 pb-3">

          <div className="bg-[#F5F7FF] rounded-lg px-3 py-1 flex items-center gap-3 text-[12px] text-[#6B7280]">

            <span className="font-semibold">B</span>

            <span className="italic">I</span>

            <span className="underline">U</span>

          </div>

        </div>

      </div>
{notesError && (

  <ErrorMessage
    message={notesError}
    type="error"
  />

)}
 <div className="flex items-center justify-between mt-3">

      {/* LEFT */}
    <button
  onClick={() =>
    setShowAllComments(true)
  }
  className="
    text-[11px]
    font-medium
    text-[#315CEC]
    uppercase
    hover:underline
  "
>
  SEE ALL COMMENTS
</button>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* TOOLBAR */}
        

        {/* BUTTON */}
        <button
  onClick={handleAddComment}
  disabled={addNotesLoading}
  className={`
    px-6 py-2
    rounded-lg
    text-sm
    flex items-center
    gap-2
    transition-all
    text-white

    ${
      addNotesLoading
        ? `
          bg-[#9db2ff]
          cursor-not-allowed
        `
        : `
          bg-[#315CEC]
          hover:bg-[#2648C9]
          cursor-pointer
        `
    }
  `}
>

  {
    addNotesLoading
      ? "Adding..."
      : "➤ Add"
  }

</button>

      </div>

    </div>
  

    </div>
              </div>

            </div>

            
<div>

  <h2
    className="
      text-[18px]
      font-semibold
      text-[#111827]
      mb-5 text-left
    "
  >
    Activity Timeline:
  </h2>

 <div
  className="
    space-y-6
    max-h-[250px]
    overflow-y-auto
    pr-2
    timeline-scroll
  "
>

   {selectedTicket?.activities?.map(
  (item, index) => (

    <div
      key={index}
      className="
        flex gap-4
        relative
      "
    >

      {/* LEFT SIDE */}
      <div
        className="
          flex flex-col items-center
        "
      >

        {/* ICON */}
        <div
          className="
            w-11 h-11
            rounded-full
            bg-[#EEF4FF]
            border border-[#DCE7FF]
            flex items-center justify-center
            shrink-0
            z-10
          "
        >

            <img src={CommentBox}
                 
                  className="w-5 h-5"
                />

        </div>

        {/* LINE */}
        {index !==
          selectedTicket.activities.length - 1 && (

          <div
            className="
              w-[2px]
              flex-1
              bg-[#E5E7EB]
              min-h-[55px]
              mt-2
            "
          />

        )}

      </div>

      {/* RIGHT CONTENT */}
      <div
        className="
          flex-1
          pb-6
          text-left
        "
      >

        {/* TITLE */}
        <div
          className="
            flex items-center
            justify-between
            gap-3
            flex-wrap
          "
        >

          <h3
            className="
              text-[16px]
              font-semibold
              text-[#111827]
            "
          >
            {item.description}
          </h3>

          {/* STATUS BADGE */}
          <div
            className={`
              px-3 py-1
              rounded-full
              text-[11px]
              font-semibold
              uppercase

              ${
                item.status ===
                "ASSIGNED"
                  ? "bg-[#EEF4FF] text-[#315CEC]"

                  : item.status ===
                    "WAITING"
                  ? "bg-[#FEF3C7] text-[#D97706]"

                  : item.status ===
                    "RESOLVED"
                  ? "bg-[#DCFCE7] text-[#16A34A]"

                  : "bg-[#F3F4F6] text-[#6B7280]"
              }
            `}
          >

            {item.status}

          </div>

        </div>

        {/* COMMENT */}
        {item.comment && (

          <div
            className="
              mt-3
              bg-[#F9FAFB]
              border border-[#E5E7EB]
              rounded-xl
              px-4 py-3
            "
          >

            <p
              className="
                text-[13px]
                text-[#4B5563]
                leading-6
              "
            >
              {item.comment}
            </p>

          </div>

        )}

        {/* USER */}
        <div
          className="
            mt-3
            flex items-center gap-2
            flex-wrap
          "
        >

          {/* <div
            className="
              w-7 h-7
              rounded-full
              bg-[#315CEC]
              text-white
              text-[11px]
              font-semibold
              flex items-center justify-center
            "
          >

            {item.createdBy
              ?.charAt(0)}

          </div> */}

          <p
            className="
              text-[13px]
              font-medium
              text-[#374151]
            "
          >
            {item.createdBy}
          </p>

          <span
            className="
              text-[12px]
              text-[#9CA3AF]
            "
          >
            •
          </span>

          <p
            className="
              text-[12px]
              text-[#6B7280]
            "
          >
            {item.createdByUserType}
          </p>

        </div>

        {/* DATE */}
        <p
          className="
            text-[12px]
            text-[#9CA3AF]
            mt-2
          "
        >

          {item.createdAtDate}
          {" "}
          •
          {" "}
          {item.createdAtTime}

        </p>

      </div>

    </div>

  )
)}

  </div>

</div>

          </div>

        </div>

      </div>

    </div>
    {/* ALL COMMENTS POPUP */}
{
  showAllComments && (

    <div className="fixed inset-0 z-[9999999]">

      {/* OVERLAY */}
      <div
        className="
          absolute inset-0
          bg-black/40
        "
        onClick={() => {

  setShowAllComments(false);

  setNotesError("");

}}
      />

      {/* MODAL */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          bg-white
          w-full
          max-w-[650px]
          rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
            flex items-center
            justify-between
            px-6 py-5
            border-b border-[#E5E7EB]
          "
        >

          <h2
            className="
              text-[18px]
              font-semibold
              text-[#111827]
            "
          >
            All Comments
          </h2>

          <button
            onClick={() => {

  setShowAllComments(false);

  setNotesError("");
  

}}
            className="
              text-red-500
              cursor-pointer
            "
          >

            <X size={22} />

          </button>

        </div>

        {/* COMMENTS */}
        <div
          className="
            max-h-[500px]
            overflow-y-auto
            p-6
            space-y-4
          "
        >

          {
            allComments.length > 0
              ? (
                allComments.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="
                        border
                        border-[#E5E7EB]
                        rounded-2xl
                        p-4
                        text-left
                      "
                    >

                      <p
                        className="
                          text-[14px]
                          text-[#111827]
                          break-words
                          leading-6
                        "
                      >
                        {item.notes}
                      </p>

                      <div
                        className="
                          mt-3
                          flex items-center
                          justify-between
                          flex-wrap
                          gap-2
                        "
                      >

                        <p
                          className="
                            text-[12px]
                            text-[#6B7280]
                          "
                        >
                          Added by
                          {" "}
                          <span className="font-medium">
                            {item.createdBy}
                          </span>
                        </p>

                        <p
                          className="
                            text-[12px]
                            text-[#9CA3AF]
                          "
                        >
                          {
                            item.createdAtDate
                          }
                          {" "}
                          •
                          {" "}
                          {
                            item.createdAtTime
                          }
                        </p>

                      </div>

                    </div>

                  )
                )
              ) : (

                <div
                  className="
                    text-center
                    text-sm
                    text-[#9CA3AF]
                    py-10
                  "
                >
                  No comments found
                </div>

              )
          }

        </div>

      </div>

    </div>

  )
}
    </>

  );

};

export default SupportTicketOverview;