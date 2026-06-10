import React, { useState } from "react";
import {
  X,
  ChevronDown,
  CalendarDays,
  Search,
  Upload,
} from "lucide-react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const CreateTicketModal = ({
  open,
  onClose,
}) => {

  const [formData, setFormData] =
    useState({
      customer: "",
      property: "Sunrise PG",
      queryType: "General Query",
      subject: "",
      priority: "Medium",
     date: dayjs(),
      assignStaff: "Saranya M",
      remarks: "",
      file: null,
    });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999]">

      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
  className="
    fixed
    top-3
    right-3
    bottom-3

    w-[96%]
    sm:w-[92%]
    md:w-[500px]

    bg-white
    rounded-2xl
    shadow-2xl

    flex
    flex-col

    overflow-hidden

    animate-slideLeft
  "
>

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#edf0f7]">

          <h2 className="text-[28px] font-semibold text-[#111827]">
            Create New Ticket
          </h2>

          <button
            onClick={onClose}
            className="text-red-500"
          >
            <X size={22} />
          </button>

        </div>

        {/* BODY */}
        <div
  className="
    flex-1
    px-5 py-6
    overflow-y-auto
    space-y-6
  "
>

  {/* CUSTOMER */}
  <div className="flex flex-col md:flex-row md:gap-6">

    <label
      className="
        w-full md:w-[100px]
        shrink-0
        text-xs
        text-[#374151]
        pt-3
        text-left
      "
    >
      Customer
      <span className="text-red-500 ml-1">*</span>
    </label>

    <div className="flex-1">

      <div className="flex gap-2">

        <div
          className="
            flex-1
            h-[48px]
            border border-[#e5e7eb]
            rounded-xl
            px-4
            flex items-center justify-between
          "
        >

          <input
            type="text"
            placeholder="Add or Search Tenant"
            className="
              w-full
              outline-none
              text-sm
            "
          />

          <ChevronDown
            size={18}
            className="text-gray-400"
          />

        </div>

        <button
          className="
            w-[48px]
            h-[48px]
            rounded-xl
            bg-[#315CEC]
            text-white
            flex items-center justify-center
            shrink-0
          "
        >
          <Search size={18} />
        </button>

      </div>

      <p className="text-[12px] text-[#9ca3af] mt-2 text-left">
        Search existing tenants in the Property flow ecosystem to auto-fill details.
      </p>

    </div>

  </div>

  {/* PROPERTY */}
  <div className="flex flex-col md:flex-row md:gap-6">

    <label
      className="
        w-full md:w-[100px]
        shrink-0
        text-xs
        text-[#374151]
        pt-3
        text-left
      "
    >
      Property
      <span className="text-red-500 ml-1">*</span>
    </label>

    <div className="flex-1">

      <button
        className="
          w-full
          h-[48px]
          border border-[#e5e7eb]
          rounded-xl
          px-4
          flex items-center justify-between
          text-sm
        "
      >
        {formData.property}

        <ChevronDown size={18} />
      </button>

      <p className="text-[12px] text-[#9ca3af] mt-2 text-left">
        Select the query issued property
      </p>

    </div>

  </div>

  {/* QUERY TYPE */}
  <div className="flex flex-col md:flex-row md:gap-6">

    <label
      className="
        w-full md:w-[100px]
        shrink-0
        text-xs
        text-[#374151]
        pt-3
        text-left
      "
    >
      Query Type
      <span className="text-red-500 ml-1">*</span>
    </label>

    <div className="flex-1">

      <button
        className="
          w-full
          h-[48px]
          border border-[#e5e7eb]
          rounded-xl
          px-4
          flex items-center justify-between
          text-sm
        "
      >
        {formData.queryType}

        <ChevronDown size={18} />
      </button>

    </div>

  </div>

  {/* SUBJECT */}
  <div className="flex flex-col md:flex-row md:gap-6">

    <label
      className="
        w-full md:w-[100px]
        shrink-0
        text-xs
        text-[#374151]
        pt-3
        text-left
      "
    >
      Subject
      <span className="text-red-500 ml-1">*</span>
    </label>

    <div className="flex-1">

      <div
        className="
          border border-[#e5e7eb]
          rounded-xl
          p-4
        "
      >

        <textarea
          placeholder='"Describe the Query/Complaint"'
          value={formData.subject}
          onChange={(e) =>
            setFormData({
              ...formData,
              subject: e.target.value,
            })
          }
          className="
            w-full
            h-[120px]
            resize-none
            outline-none
            text-sm
          "
        />

        <div className="flex justify-end gap-3 text-sm text-gray-400">

          <button className="font-semibold">
            B
          </button>

          <button className="italic">
            I
          </button>

          <button className="underline">
            U
          </button>

        </div>

      </div>

    </div>

  </div>

  {/* PRIORITY */}
  <div className="flex flex-col md:flex-row md:gap-6">

    <label
      className="
        w-full md:w-[100px]
        shrink-0
        text-xs
        text-[#374151]
        pt-3
        text-left
      "
    >
      Priority
      <span className="text-red-500 ml-1">*</span>
    </label>

    <div className="flex-1">

      <button
        className="
          w-full
          h-[48px]
          border border-[#e5e7eb]
          rounded-xl
          px-4
          flex items-center justify-between
          text-sm
        "
      >
        {formData.priority}

        <ChevronDown size={18} />
      </button>

    </div>

  </div>

  {/* DATE */}
{/* DATE */}
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
    Date
    <span className="text-red-500 ml-1">*</span>
  </label>

  <div className="flex-1">

  <DatePicker
  value={formData.date}
  format="DD/MM/YYYY"
  onChange={(date) =>
    setFormData({
      ...formData,
      date,
    })
  }
  getPopupContainer={(trigger) =>
    trigger.parentElement
  }
  popupClassName="custom-date-popup"
  className="
    w-full
    !h-[48px]
    !rounded-xl
  "
  placeholder="Select date"
  suffixIcon={
    <CalendarDays
      size={18}
      className="text-[#315CEC]"
    />
  }
/>

  </div>

</div>

  {/* ASSIGN STAFF */}
  <div className="flex flex-col md:flex-row md:gap-6">

    <label
      className="
        w-full md:w-[100px]
        shrink-0
        text-xs
        text-[#374151]
        pt-3
        text-left
      "
    >
      Assign Staff
      <span className="text-red-500 ml-1">*</span>
    </label>

    <div className="flex-1">

      <button
        className="
          w-full
          h-[48px]
          border border-[#e5e7eb]
          rounded-xl
          px-4
          flex items-center justify-between
          text-sm
        "
      >
        {formData.assignStaff}

        <ChevronDown size={18} />
      </button>

    </div>

  </div>

  {/* FILE */}
  <div className="flex flex-col md:flex-row md:gap-6">

    <label
      className="
        w-full md:w-[100px]
        shrink-0
        text-xs
        text-[#374151]
        pt-3
        text-left
      "
    >
      Upload Payment Proof
      <span className="text-red-500 ml-1">*</span>
    </label>

    <div className="flex-1">

      <label
        className="
          h-[120px]
          border border-[#e5e7eb]
          rounded-xl
          flex flex-col
          items-center justify-center
          cursor-pointer
          bg-[#fafafa]
        "
      >

        <input
          type="file"
          className="hidden"
        />

        <div
          className="
            w-10 h-10
            rounded-xl
            bg-[#EEF2FF]
            flex items-center justify-center
            mb-2
          "
        >
          <Upload
            size={18}
            className="text-[#315CEC]"
          />
        </div>

        <p className="text-sm">
          <span className="text-[#315CEC] font-medium">
            Choose Image
          </span>
          {" "}
          to Upload
        </p>

        <p className="text-[11px] text-gray-400 mt-1">
          JPG/JPEG Format
        </p>

      </label>

    </div>

  </div>

  {/* REMARKS */}
  <div className="flex flex-col md:flex-row md:gap-6">

    <label
      className="
        w-full md:w-[100px]
        shrink-0
        text-xs
        text-[#374151]
        pt-3
        text-left
      "
    >
      Remarks
    </label>

    <div className="flex-1">

      <textarea
        placeholder='"Add internal notes..."'
        value={formData.remarks}
        onChange={(e) =>
          setFormData({
            ...formData,
            remarks: e.target.value,
          })
        }
        className="
          w-full
          h-[120px]
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

        {/* FOOTER */}
        <div className="px-6 py-5 border-t border-[#edf0f7] flex justify-end gap-3">

          <button
            onClick={onClose}
            className="
              h-[44px]
              px-6
              rounded-xl
              border border-[#e5e7eb]
              text-sm
              font-medium
            "
          >
            Cancel
          </button>

          <button
            className="
              h-[44px]
              px-6
              rounded-xl
              bg-[#315CEC]
              text-white
              text-sm
              font-medium
            "
          >
            Send & Schedule
          </button>

        </div>

      </div>

    </div>
  );
};

export default CreateTicketModal;