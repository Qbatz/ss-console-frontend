import React,{useState} from "react";
import Notes from "../../assets/notes.png";
import CommentBox from "../../assets/message-2.png";
import Messagequestion from "../../assets/messagequestion.png";
import single from "../../assets/single.png";
import Group from "../../assets/team.png";
import Location from "../../assets/locationGrey.png";
import Phone from "../../assets/call.png";
import { useNavigate } from "react-router-dom";


const SupportTicketOverview = ({
  open,
  onClose,
  selectedItem,
  commentText,
  setCommentText,
  handleAddComment,onAssignStaff,allComments,
  fetchAllComments
}) => {
  if (!open) return null;
console.log("selectedItem",selectedItem)
const [showAllComments, setShowAllComments] =
  useState(false);
  const navigate = useNavigate();
  const handleSeeAllComments = async () => {

  console.log(
    "CLICKED",
    selectedItem
  );

  await fetchAllComments(
    selectedItem?.requestId
  );

  setShowAllComments(true);

};
  return (
    <>
<div
  className="fixed inset-0 z-[999999]"
  onClick={() => {
    setShowAllComments(false);
    setCommentText("")
  }}
>

    {/* OVERLAY */}
    <div
      className="absolute inset-0 bg-black/30"
    onClick={() => {
  onClose();
  setCommentText("");
}}
    />

    {/* DRAWER */}
 <div
  className="absolute inset-0 flex justify-end p-2"
  onClick={onClose}
>

  <div
  className="
    h-full
    w-full
    max-w-[520px]
    bg-white
    shadow-2xl
    rounded-[24px]
    border border-[#E5E7EB]
    overflow-hidden
    flex
    flex-col
  "
  onClick={(e) => e.stopPropagation()}
>
<div
  className="flex-1 overflow-y-auto"
  style={{
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  }}
>
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 sticky top-0 bg-white z-50">

          <div className="flex items-center text-center gap-2">
            <img src={Messagequestion} className="w-5 h-5" />

          <h2 className="text-[20px] leading-[20px] font-semibold text-[#1D1D1D] font-sans">
  Demo Overview
</h2>
          </div>

          <button
               onClick={() => {
  onClose();
  setCommentText("");
}}
            className="text-red-500 text-m cursor-pointer"
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

       {/* <div className="border border-[#E5E7EB] rounded-2xl p-5 text-left bg-[#FCFCFD]">

  
  <div className="flex items-center justify-between mb-5">

    <h3 className="text-[11px] font-semibold tracking-[1px] text-[#6B7280] uppercase">
      Property Info
    </h3>

    <button className="text-gray-400 text-lg">
      ⋮
    </button>

  </div>

  
  <div className="space-y-4">

    
    <div className="flex items-center gap-3">

      
      <div className="w-4 flex justify-center text-[#9CA3AF]">
      <img src={single} className="w-4 h-4"/>
      </div>

      
      <p className="w-[110px] text-[12px] text-[#9CA3AF]">
        Customer Name
      </p>

     
      <p className="text-[13px] font-medium text-[#1D1D1D]">
        {selectedItem?.name || "----"}
      </p>

    </div>

   
    <div className="flex items-center gap-3">

      <div className="w-4 flex justify-center text-[#9CA3AF]">
        <img src={Group} className="w-4 h-4"/>
      </div>

      <p className="w-[110px] text-[12px] text-[#9CA3AF]">
        Property Name
      </p>

      <p className="text-[13px] font-semibold text-[#2563EB] cursor-pointer flex items-center gap-1">
        {selectedItem?.organization || "----"}

        <span className="text-[11px]">↗</span>
      </p>

    </div>

    
    <div className="flex items-center gap-3">

      <div className="w-4 flex justify-center text-[#9CA3AF]">
         <img src={Location} className="w-4 h-4"/>
      </div>

      <p className="w-[110px] text-[12px] text-[#9CA3AF]">
        Location
      </p>

      <p className="text-[13px] font-medium text-[#1D1D1D]">
        Solinganallur, Chennai
      </p>

    </div>

   
    <div className="flex items-center gap-3">

      <div className="w-4 flex justify-center text-[#9CA3AF]">
       <img src={Phone} className="w-4 h-4"/>

      </div>

      <p className="w-[110px] text-[12px] text-[#9CA3AF]">
        Mobile
      </p>

      <p className="text-[13px] font-medium text-[#1D1D1D]">
        {selectedItem?.contactNo || "----"}
      </p>

    </div>

  </div>
</div> */}

         
         <div className="border border-[#E5E7EB] rounded-2xl p-5">

  <div className="space-y-6 text-left">

   
    <div className="flex items-start">

    


    </div>

    {/* REQUEST ID */}
  

    {/* STATUS */}
    <div className="flex items-center">

      <p className="w-[100px] text-[12px] text-[#9CA3AF]">
        Status
      </p>

      <span className="mr-5 text-[#9CA3AF]">:</span>

      <p className="text-[14px] font-medium text-[#F59E0B]">
       {selectedItem?.demoRequestStatus}
      </p>

    </div>

    {/* PRIORITY */}
    <div className="flex items-center">

      <p className="w-[100px] text-[12px] text-[#9CA3AF]">
        Assigned Staff
      </p>

      <span className="mr-5 text-[#9CA3AF]">:</span>

      <div className="bg-[#EEF4FF] text-[#2563EB] text-[13px] px-3 py-1 rounded-full flex items-center gap-1 w-fit">

        <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>

       {selectedItem?.assignedTo || "N/A"}

      </div>

    </div>

    {/* TYPE */}
   

    {/* ASSIGNED STAFF */}
    {selectedItem?.canAssignStaff === true && (
    <div className="flex items-center">

      <p className="w-[100px] text-[12px] text-[#9CA3AF]">
       Add Assigned 
      </p>

      <span className="mr-5 text-[#9CA3AF]">:</span>

     {/* <button
  onClick={onAssignStaff}
  className="
    text-[14px]
    font-semibold
    text-[#2563EB]
    cursor-pointer
    hover:underline
  "
>
  Assign +
</button> */}
{selectedItem?.canAssignStaff === true && (

  <button
    onClick={onAssignStaff}
    className="
      text-[14px]
      font-semibold
      text-[#2563EB]
      cursor-pointer
      hover:underline
    "
  >
    Assign +
  </button>

)}

    </div>
    )}
     <div className="flex items-center">

      <p className="w-[100px] text-[12px] text-[#9CA3AF] whitespace-nowrap">
        Owner Name
      </p>

      <span className="mr-5 text-[#9CA3AF]">:</span>

      <p className="text-[14px] font-medium text-[#1D1D1D]"  onClick={() =>
        navigate(
          `/ProprietorsOverview/${selectedItem?.owner?.ownerId}`
        )
      }>
       {selectedItem?.owner?.fullName || "N/A"}
      </p> 

    </div>

    {/* NOTES */}
    <div className="pt-2">

      <label className="text-[14px] font-medium text-[#1D1D1D]">
        Add Notes 
      </label>

      <div className="mt-3 border border-[#E5E7EB] rounded-xl overflow-hidden">

 <textarea
  placeholder="Comment here"
  value={commentText}
  onChange={(e) =>
    setCommentText(e.target.value)
  }
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
      
 <div className="flex items-center justify-between mt-3">

      {/* LEFT */}
    <button
 onClick={handleSeeAllComments }
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
          disabled={!commentText.trim()}
          className={`
            px-6 py-2 rounded-lg text-sm flex items-center gap-2 transition-all

            ${
              commentText.trim()
                ? "bg-[#315CEC] hover:bg-[#2648C9] text-white cursor-pointer"
                : "bg-[#DDE3FF] text-white cursor-not-allowed"
            }
          `}
        >

          ➤ Add

        </button>

      </div>

    </div>
    </div>

  </div>
</div>

          {/* TIMELINE */}
          <div>

            {/* <h3 className="text-[26px] font-semibold mb-8">
              Activity Timeline:
            </h3> */}
                  {/* TIMELINE */}
<div className="border border-[#E5E7EB] rounded-2xl p-5 bg-white">

  {/* TITLE */}
  <div className="flex items-center justify-between mb-5">

    <h2 className="text-[18px] font-semibold text-[#1D1D1D]">
      Activity Timeline
    </h2>

    <span className="text-[12px] text-gray-400">
      {selectedItem?.demoRequestActivities?.length || 0} Activities
    </span>

  </div>

  {/* SCROLL AREA */}
  <div
    className="
      max-h-[350px]
      overflow-y-auto
      pr-2
      space-y-6
    "
    style={{
      scrollbarWidth: "thin",
    }}
  >

    {selectedItem?.demoRequestActivities?.length > 0 ? (

      selectedItem?.demoRequestActivities?.map(
        (item, index) => (

          <div
            key={index}
            className="flex gap-4"
          >

            {/* LEFT */}
            <div className="flex flex-col items-center">

              <div
                className="
                  w-11 h-11 rounded-full
                  bg-[#EEF4FF]
                  border border-[#DCE7FF]
                  flex items-center justify-center
                  shrink-0
                "
              >
                <img
                  src={CommentBox}
                  className="w-5 h-5"
                />
              </div>

              {index !==
                selectedItem?.demoRequestActivities?.length - 1 && (
                <div className="w-[1px] flex-1 bg-[#E5E7EB] mt-2"></div>
              )}

            </div>

           
          <div
  className="
    flex-1
    bg-white
    border border-[#E5E7EB]
    rounded-2xl
    p-4
    shadow-sm
    hover:shadow-md
    transition-all
  "
>

  {/* STATUS */}
  <div className="flex items-center justify-between gap-3 mb-3">

    <div
      className="
        px-3
        py-1
        rounded-full
        bg-[#EEF4FF]
        text-[#315CEC]
        text-[11px]
        font-semibold
        uppercase
        w-fit
      "
    >
      {item.status || "STATUS"}
    </div>

    <p className="text-[11px] text-gray-400 whitespace-nowrap">
      {item.createdAtDate} • {item.createdAtTime}
    </p>

  </div>

  {/* DESCRIPTION */}
  {item.description && (
    <div className="mb-3">

     

      <p className="text-[14px] text-[#374151] leading-6 text-left break-words">
        {item.description}
      </p>

    </div>
  )}

  {/* COMMENT */}
  {item.comment && (
    <div
      className="
        bg-[#F9FAFB]
        border border-[#F1F5F9]
        rounded-xl
        p-3
      "
    >

      <p className="text-[12px] text-gray-400 font-medium text-left mb-1 uppercase tracking-wide">
        Comment
      </p>

      <p className="text-[14px] text-[#111827] leading-6 text-left break-words whitespace-pre-wrap">
        {item.comment}
      </p>

    </div>
  )}

  {/* UPDATED BY */}
  <div className="mt-4 pt-3 border-t border-[#F3F4F6]">

    <p className="text-[12px] text-left">

      <span className="text-gray-400">
        Updated by
      </span>

      <span className="text-[#2563EB] font-semibold ml-1">
        {item.createdBy}
      </span>

    </p>

  </div>

</div>

          </div>
        )
      )

    ) : (

      <div className="h-[220px] flex flex-col items-center justify-center text-center">

        <div className="w-14 h-14 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-3">

          <img
            src={CommentBox}
            className="w-6 h-6 opacity-50"
          />

        </div>

        <p className="text-sm font-medium text-gray-500">
          No Activities Found
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Timeline activities will appear here
        </p>

      </div>

    )}

  </div>

</div>
          </div>

        </div>
</div>
      </div>
    </div>
  </div>
  {/* ALL COMMENTS POPUP */}
{showAllComments && (

  <div className="fixed inset-0 z-[999999]">

    {/* OVERLAY */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() =>
        setShowAllComments(false)
      }
    />

    {/* MODAL */}
    <div className="absolute inset-0 flex items-center justify-center p-4">

      <div
        className="
          bg-white
          w-full
          max-w-[650px]
          rounded-2xl
          shadow-2xl
          overflow-hidden
          flex
          flex-col
          max-h-[85vh]
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">

          <div>

            <h2 className="text-[18px] font-semibold text-left">
              All Comments
            </h2>

            <p className="text-[12px] text-gray-500 mt-1">
              View all activity comments
            </p>

          </div>

          <button
            onClick={() =>
              setShowAllComments(false)
            }
            className="text-red-500 text-lg"
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {allComments
            ?.length > 0 ? (

            allComments.map(
              (item, index) => (

                <div
                  key={index}
                  className="
                    border border-[#E5E7EB]
                    rounded-2xl
                    p-4
                    bg-[#FAFAFA]
                  "
                >

                  <div className="flex gap-3">

                    {/* ICON */}
                    <div
                      className="
                        w-10 h-10
                        rounded-full
                        bg-[#EEF4FF]
                        border border-[#DCE7FF]
                        flex items-center justify-center
                        shrink-0
                      "
                    >

                      <img
                        src={CommentBox}
                        className="w-4 h-4"
                      />

                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">

                      <p className="text-[14px] font-semibold text-left text-[#111827] break-words">
                        {item.comment ||
                          "No Comment"}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-[12px] text-gray-500">

                        <span>
                          {item.createdAtDate}
                        </span>

                        <span>•</span>

                        <span>
                          {item.createdAtTime}
                        </span>

                      </div>

                      <p className="text-[12px] text-[#315CEC] mt-2 font-medium text-left">
                        Added by {item.createdBy}
                      </p>

                    </div>

                  </div>

                </div>
              )
            )

          ) : (

            <div className="h-[300px] flex flex-col items-center justify-center text-center">

              <div className="w-14 h-14 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-3">

                <img
                  src={CommentBox}
                  className="w-6 h-6 opacity-50"
                />

              </div>

              <p className="text-sm font-medium text-gray-500">
                No Comments Found
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  </div>

)}
  </>
);
};

export default SupportTicketOverview;