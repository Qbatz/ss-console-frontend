import React from "react";
import Notes from "../../assets/notes.png";
import CommentBox from "../../assets/message-2.png";
import Messagequestion from "../../assets/messagequestion.png"

const SupportTicketOverview = ({
  open,
  onClose,
  selectedItem,
}) => {
  if (!open) return null;

  return (
  <div className="fixed inset-0 z-[99999]">

    {/* OVERLAY */}
    <div
      className="absolute inset-0 bg-black/30"
      onClick={onClose}
    />

    {/* DRAWER */}
  <div className="absolute inset-0 flex justify-end p-2">

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

          <div className="flex items-center gap-2">
            <img src={Messagequestion} className="w-5 h-5" />

          <h2 className="text-[20px] leading-[20px] font-semibold text-[#1D1D1D] font-sans">
  Support Ticket Overview
</h2>
          </div>

          <button
            onClick={onClose}
            className="text-red-500 text-m cursor-pointer"
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

       <div className="border border-[#E5E7EB] rounded-2xl p-5 text-left bg-[#FCFCFD]">

  {/* HEADER */}
  <div className="flex items-center justify-between mb-5">

    <h3 className="text-[11px] font-semibold tracking-[1px] text-[#6B7280] uppercase">
      Property Info
    </h3>

    <button className="text-gray-400 text-lg">
      ⋮
    </button>

  </div>

  {/* CONTENT */}
  <div className="space-y-4">

    {/* CUSTOMER NAME */}
    <div className="flex items-center gap-3">

      {/* ICON */}
      <div className="w-4 flex justify-center text-[#9CA3AF]">
        👤
      </div>

      {/* LABEL */}
      <p className="w-[110px] text-[12px] text-[#9CA3AF]">
        Customer Name
      </p>

      {/* VALUE */}
      <p className="text-[13px] font-medium text-[#1D1D1D]">
        {selectedItem?.name || "----"}
      </p>

    </div>

    {/* PROPERTY NAME */}
    <div className="flex items-center gap-3">

      <div className="w-4 flex justify-center text-[#9CA3AF]">
        🏢
      </div>

      <p className="w-[110px] text-[12px] text-[#9CA3AF]">
        Property Name
      </p>

      <p className="text-[13px] font-semibold text-[#2563EB] cursor-pointer flex items-center gap-1">
        {selectedItem?.organization || "----"}

        <span className="text-[11px]">↗</span>
      </p>

    </div>

    {/* LOCATION */}
    <div className="flex items-center gap-3">

      <div className="w-4 flex justify-center text-[#9CA3AF]">
        📍
      </div>

      <p className="w-[110px] text-[12px] text-[#9CA3AF]">
        Location
      </p>

      <p className="text-[13px] font-medium text-[#1D1D1D]">
        Solinganallur, Chennai
      </p>

    </div>

    {/* MOBILE */}
    <div className="flex items-center gap-3">

      <div className="w-4 flex justify-center text-[#9CA3AF]">
        📞
      </div>

      <p className="w-[110px] text-[12px] text-[#9CA3AF]">
        Mobile
      </p>

      <p className="text-[13px] font-medium text-[#1D1D1D]">
        {selectedItem?.contactNo || "----"}
      </p>

    </div>

  </div>
</div>

          {/* TICKET DETAILS */}
         <div className="border border-[#E5E7EB] rounded-2xl p-5">

  <div className="space-y-6 text-left">

    {/* SUBJECT */}
    <div className="flex items-start">

      <p className="w-[100px] text-[12px] text-[#9CA3AF]">
        Subject
      </p>

      <p className="text-[14px] font-medium text-[#1D1D1D] leading-5 max-w-[320px]">
        {selectedItem?.comments || "No Subject"}
      </p>

    </div>

    {/* REQUEST ID */}
    <div className="flex items-center">

      <p className="w-[100px] text-[12px] text-[#9CA3AF]">
        Ticket ID
      </p>

      <span className="mr-5 text-[#9CA3AF]">:</span>

      <p className="text-[14px] font-semibold text-[#1D1D1D]">
        #{selectedItem?.requestId || "----"}
      </p>

    </div>

    {/* STATUS */}
    <div className="flex items-center">

      <p className="w-[100px] text-[12px] text-[#9CA3AF]">
        Ticket Status
      </p>

      <span className="mr-5 text-[#9CA3AF]">:</span>

      <p className="text-[14px] font-medium text-[#F59E0B]">
        In Progress
      </p>

    </div>

    {/* PRIORITY */}
    <div className="flex items-center">

      <p className="w-[100px] text-[12px] text-[#9CA3AF]">
        Priority
      </p>

      <span className="mr-5 text-[#9CA3AF]">:</span>

      <div className="bg-[#EEF4FF] text-[#2563EB] text-[13px] px-3 py-1 rounded-full flex items-center gap-1 w-fit">

        <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>

        Medium

      </div>

    </div>

    {/* TYPE */}
    <div className="flex items-center">

      <p className="w-[100px] text-[12px] text-[#9CA3AF]">
        Type
      </p>

      <span className="mr-5 text-[#9CA3AF]">:</span>

      <p className="text-[14px] font-medium text-[#1D1D1D]">
        Feature Request
      </p>

    </div>

    {/* ASSIGNED STAFF */}
    <div className="flex items-center">

      <p className="w-[100px] text-[12px] text-[#9CA3AF]">
        Assigned Staff
      </p>

      <span className="mr-5 text-[#9CA3AF]">:</span>

      <p className="text-[14px] font-semibold text-[#2563EB] cursor-pointer">
        Assign +
      </p>

    </div>

    {/* NOTES */}
    <div className="pt-2">

      <label className="text-[14px] font-medium text-[#1D1D1D]">
        Add Notes <span className="text-red-500">*</span>
      </label>

      <div className="mt-3 border border-[#E5E7EB] rounded-xl overflow-hidden">

        <textarea
          placeholder="Comment here"
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

    </div>

  </div>
</div>

          {/* TIMELINE */}
          <div>

            {/* <h3 className="text-[26px] font-semibold mb-8">
              Activity Timeline:
            </h3> */}
                   <h2 className="text-[20px] leading-[20px] font-semibold text-[#1D1D1D] font-sans text-left">
 Activity Timeline:
</h2>

            <div className="space-y-10">

              {selectedItem?.demoRequestComments?.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex gap-5"
                  >

                    {/* ICON */}
                    <div className="flex flex-col items-center">

                      <div className="w-12 h-12 rounded-full bg-[#EEF4FF] flex items-center justify-center">

                        <img
                          src={CommentBox}
                          className="w-5 h-5"
                        />
                      </div>

                      {index !==
                        selectedItem
                          ?.demoRequestComments
                          ?.length - 1 && (
                        <div className="w-[1px] flex-1 bg-gray-300 mt-2"></div>
                      )}

                    </div>

                    {/* CONTENT */}
                    <div>

                      <p className="font-semibold text-[18px]">
                        {item.comment}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Added by {item.createdBy}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        {item.createdAtDate},{" "}
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
  </div>
);
};

export default SupportTicketOverview;