import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, CalendarDays, Search, Upload, } from "lucide-react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useSupportTickets } from "../../Context/SupportTicketsContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Toast from "../../components/SuccessModal/ToastDesign";


const CreateTicketModal = ({ open, onClose }) => {
  const { searchOwners, loading, getQueryTypes, createSupportTicket } = useSupportTickets();
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedQueryType, setSelectedQueryType] = useState(null);
  const [ownersList, setOwnersList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [queryTypeList, setQueryTypeList] = useState([]);
  const [showQueryDropdown, setShowQueryDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {

    const fetchQueryTypes =
      async () => {

        const res =
          await getQueryTypes();

        if (res.success) {

          setQueryTypeList(
            res.data || []
          );

        }

      };

    fetchQueryTypes();

  }, []);

  const customerRef = useRef(null);
  const [propertyList, setPropertyList] = useState([]);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);

  const [formData, setFormData] =
    useState({
      customer: "",
      property: "",
      queryType: "",
      subject: "",
      priority: "",
      date: dayjs(),
      raisedBy: "",
      remarks: "",
      file: null,
    });

  const [staffList, setStaffList] = useState([]);

  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  useEffect(() => {

    const delayDebounce =
      setTimeout(async () => {

        if (
          customerSearch.trim()
            .length < 2
        ) {

          setOwnersList([]);

          return;

        }

        const res =
          await searchOwners(
            customerSearch
          );

        if (res.success) {

          setOwnersList(
            res.data || []
          );

          
          if (
            document.activeElement ===
            customerRef.current?.querySelector("input")
          ) {

            setShowDropdown(true);

          }

        }

      }, 500);

    return () =>
      clearTimeout(
        delayDebounce
      );

  }, [customerSearch]);
  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        customerRef.current &&
        !customerRef.current.contains(
          event.target
        )
      ) {

        setShowDropdown(false);

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
  useEffect(() => {

    // ONLY CLEAR WHEN INPUT EMPTY
    if (!customerSearch.trim()) {

      setPropertyList([]);

      setFormData((prev) => ({
        ...prev,
        property: "",
      }));

    }

  }, [customerSearch]);
  const handleSubmit =
    async () => {

      const newErrors = {};

      if (!selectedOwner) {

        newErrors.customer =
          "Customer is required";

      }

      if (!selectedHostel) {

        newErrors.property =
          "Property is required";

      }

      if (!selectedStaff) {

        newErrors.raisedBy =
          "Raised by is required";

      }

      if (!selectedQueryType) {

        newErrors.queryType =
          "Query Type is required";

      }

      if (
        !formData.subject.trim()
      ) {

        newErrors.subject =
          "Subject is required";

      }

      if (!formData.date) {

        newErrors.date =
          "Date is required";

      }

      // STOP API
      if (
        Object.keys(newErrors)
          .length > 0
      ) {

        setErrors(newErrors);

        return;

      }

      setErrors({});

      try {

        const payload = {

          parentId:
            selectedOwner?.parentId,

          hostelId:
            selectedHostel?.hostelId,

          raisedBy:
            selectedStaff?.userId,

          queryType:
            selectedQueryType?.key,

          subject:
            formData.subject,

          issueDate:
            dayjs(formData.date)
              .format(
                "DD-MM-YYYY"
              ),

          remarks:
            formData.remarks,

        };

        const res =
          await createSupportTicket(
            payload,
            formData.file
          );

        if (res.success) {
          setModalType("success");
          setMessage(
            res?.message ||
            "Ticket Created Successfully"
          );
          setShowSuccess(true);

          setTimeout(() => {
            setShowSuccess(false);
            onClose();

          }, 1300);


        }

      }
      catch (error) {

        console.log(error);

        setModalType("error");

        setMessage(
          error?.message ||
          "Something went wrong"
        );

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
      <div className="fixed inset-0 z-[9999]">


        <div
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />


        <div
          className="
    fixed
    top-3
    right-3
    bottom-3 w-[96%] sm:w-[92%] md:w-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideLeft">


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
            {/* CUSTOMER */}
            <div className="flex flex-col md:flex-row md:gap-6">

              <label
                className="
      w-full md:w-[100px]
      shrink-0
      text-xs
      text-subBlack
      pt-3
      text-left
    "
              >
                Customer
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div
                className="flex-1 relative"
                ref={customerRef}
              >

                <div className="flex gap-2">

                  <div
                    className="
          flex-1
          h-[48px]
          border border-[#e5e7eb]
          rounded-xl
          px-4
          flex items-center justify-between
          bg-white
        "
                  >

                    <input
                      type="text"
                      placeholder="search owner and mob"
                      value={customerSearch}
                      // onChange={(e) => {

                      //   setCustomerSearch(
                      //     e.target.value
                      //   );

                      //   setShowDropdown(true);

                      // }}
                      onChange={(e) => {

                        const value = e.target.value;

                        setCustomerSearch(value);

                        if (
                          document.activeElement ===
                          e.target
                        ) {

                          // setShowDropdown(true);
                          // CUSTOMER
                          setShowDropdown((prev) => !prev);

                          setShowPropertyDropdown(false);
                          setShowStaffDropdown(false);
                          setShowQueryDropdown(false);

                        }
                        setErrors((prev) => ({
                          ...prev,
                          customer: "",
                        }));
                        // CUSTOMER CLEARED
                        if (!value.trim()) {

                          setPropertyList([]);

                          setFormData((prev) => ({
                            ...prev,
                            customer: "",
                            property: "",
                          }));

                        }

                      }}
                      className="
    w-full
    outline-none
    text-sm
    bg-transparent
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
     btn-primary
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

                {/* DROPDOWN */}
                {showDropdown &&
                  ownersList?.length > 0 && (

                    <div
                      className="
            absolute
            top-[58px]
            left-0
            right-0
            bg-white
            border border-soft
            rounded-xl
            shadow-xl
            z-[99999]
            overflow-hidden
            max-h-[250px]
            overflow-y-auto
          "
                    >

                      {ownersList.map(
                        (item, index) => (

                          <button
                            key={index}
                            type="button"
                            onClick={() => {

                              setSelectedOwner(item);

                              setCustomerSearch(
                                item.fullName
                              );

                              setPropertyList(
                                item.hostels || []
                              );

                              setFormData({
                                ...formData,
                                customer:
                                  item.fullName,
                                property: "",
                              });

                              setShowDropdown(false);

                              setOwnersList([]);

                            }}
                            className="
        w-full
        px-4
        py-3
        text-left
        hover:bg-[#f5f7ff]
        border-b
        border-[#f3f4f6]
        last:border-b-0
      "
                          >

                            <p className="text-sm font-medium text-[#111827]">
                              {item.fullName}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {item.mobile}
                            </p>

                          </button>

                        )
                      )}

                    </div>

                  )}

              </div>

            </div>
            <div className="md:pl-[124px] pl-0">
              {errors.customer && (
                <ErrorMessage
                  message={errors.customer}
                  type="error"
                />
              )}
            </div>



            <div className="flex flex-col md:flex-row md:gap-6">

              <label
                className="
      w-full md:w-[100px]
      shrink-0
      text-xs
     text-subBlack
      pt-3
      text-left
    "
              >
                Property
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="flex-1 relative">

                <button
                  type="button"
                  onClick={() => {

                    setShowPropertyDropdown((prev) => !prev);

                    setShowDropdown(false);
                    setShowStaffDropdown(false);
                    setShowQueryDropdown(false);
                    setErrors((prev) => ({
                      ...prev,
                      property: "",
                    }));
                  }}
                  className="
        w-full
        h-[48px]
        border border-[#e5e7eb]
        rounded-xl
        px-4
        flex items-center justify-between
        text-sm
        bg-white
      "
                >

                  {formData.property ||
                    "Select Property"}

                  <ChevronDown size={18} />

                </button>

                <p className="text-[12px] text-[#9ca3af] mt-2 text-left">
                  Select the query issued property
                </p>

                {/* PROPERTY DROPDOWN */}
                {showPropertyDropdown && (

                  <div
                    className="
    absolute
    top-[58px]
    left-0
    right-0
    bg-white
    border border-[#e5e7eb]
    rounded-xl
    shadow-xl
    z-[99999]
    overflow-hidden
    max-h-[250px]
    overflow-y-auto
  "
                  >

                    {propertyList?.length > 0 ? (

                      propertyList.map(
                        (hostel, index) => (

                          <button
                            key={index}
                            type="button"
                            onClick={() => {

                              setSelectedHostel(hostel);

                              setFormData((prev) => ({
                                ...prev,
                                property:
                                  hostel.hostelName,

                                raisedBy: "",
                              }));

                              setStaffList(
                                hostel.staffs || []
                              );

                              setShowPropertyDropdown(
                                false
                              );

                            }}
                            className="
            w-full
            px-4
            py-3
            text-left
            hover:bg-[#f5f7ff]
            border-b
            border-[#f3f4f6]
            last:border-b-0
          "
                          >

                            <p className="text-sm font-medium text-[#111827]">
                              {hostel.hostelName}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {hostel.city},
                              {" "}
                              {hostel.state}
                            </p>

                          </button>

                        )
                      )

                    ) : (

                      <div
                        className="
        px-4
        py-6
        text-sm
        text-center
        text-gray-400
      "
                      >
                        No Property Found
                      </div>

                    )}

                  </div>

                )}

              </div>

            </div>
            <div className="md:pl-[124px] pl-0">
              {errors.property && (
                <ErrorMessage
                  message={errors.property}
                  type="error"
                />
              )}
            </div>
            <div className="flex flex-col md:flex-row md:gap-6">

              <label
                className="
      w-full md:w-[100px]
      shrink-0
      text-xs
      text-subBlack
      pt-3
      text-left
    "
              >
                Raised by
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="flex-1 relative">

                <button
                  type="button"
                  onClick={() => {

                    // CLOSE OTHER DROPDOWNS
                    setShowDropdown(false);

                    setShowPropertyDropdown(false);

                    // OPEN STAFF DROPDOWN
                    setShowStaffDropdown((prev) => !prev);

                    setShowDropdown(false);
                    setShowPropertyDropdown(false);
                    setShowQueryDropdown(false);
                    setErrors((prev) => ({
                      ...prev,
                      raisedBy: "",
                    }));
                  }}
                  className="
        w-full
        h-[48px]
        border border-[#e5e7eb]
        rounded-xl
        px-4
        flex items-center justify-between
        text-sm
        bg-white
      "
                >

                  {formData.raisedBy ||
                    "Select Staff"}

                  <ChevronDown size={18} />

                </button>

                {/* STAFF DROPDOWN */}
                {showStaffDropdown && (

                  <div
                    className="
          absolute
          top-[58px]
          left-0
          right-0
          bg-white
          border border-[#e5e7eb]
          rounded-xl
          shadow-xl
          z-[99999]
          overflow-hidden
          max-h-[250px]
          overflow-y-auto
        "
                  >

                    {staffList?.length > 0 ? (

                      staffList.map(
                        (staff, index) => (

                          <button
                            key={index}
                            type="button"
                            onClick={() => {

                              setSelectedStaff(staff);

                              setFormData((prev) => ({
                                ...prev,
                                raisedBy:
                                  staff.fullName,
                              }));

                              setShowStaffDropdown(false);

                            }}
                            className="
                  w-full
                  px-4
                  py-3
                  text-left
                  hover:bg-[#f5f7ff]
                  border-b
                  border-[#f3f4f6]
                  last:border-b-0
                "
                          >

                            <p className="text-sm font-medium text-[#111827]">
                              {staff.fullName}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {staff.mobile}
                            </p>

                          </button>

                        )
                      )

                    ) : (

                      <div
                        className="
              px-4
              py-6
              text-sm
              text-center
              text-gray-400
            "
                      >
                        No Staff Found
                      </div>

                    )}

                  </div>

                )}

              </div>

            </div>
            <div className="md:pl-[124px] pl-0">
              {errors.raisedBy && (
                <ErrorMessage
                  message={errors.raisedBy}
                  type="error"
                />
              )}
            </div>
            <div className="flex flex-col md:flex-row md:gap-6">

              <label
                className="
      w-full md:w-[100px]
      shrink-0
      text-xs
      text-subBlack
      pt-3
      text-left
    "
              >
                Query Type
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="flex-1 relative">

                <button
                  type="button"
                  onClick={() => {

                    setShowDropdown(false);

                    setShowPropertyDropdown(false);

                    setShowStaffDropdown(false);

                    setShowQueryDropdown((prev) => !prev);

                    setShowDropdown(false);
                    setShowPropertyDropdown(false);
                    setShowStaffDropdown(false);
                    setErrors((prev) => ({
                      ...prev,
                      queryType: "",
                    }));

                  }}
                  className="
        w-full
        h-[48px]
        border border-[#e5e7eb]
        rounded-xl
        px-4
        flex items-center justify-between
        text-sm
        bg-white
      "
                >

                  {formData.queryType ||
                    "Select Query Type"}

                  <ChevronDown size={18} />

                </button>

                {/* DROPDOWN */}
                {showQueryDropdown && (

                  <div
                    className="
          absolute
          top-[58px]
          left-0
          right-0
          bg-white
          border border-[#e5e7eb]
          rounded-xl
          shadow-xl
          z-[99999]
          overflow-hidden
          max-h-[200px]
          overflow-y-auto
        "
                  >

                    {queryTypeList?.length > 0 ? (

                      queryTypeList.map(
                        (item, index) => (

                          <button
                            key={index}
                            type="button"
                            onClick={() => {

                              setSelectedQueryType(item);

                              setFormData((prev) => ({
                                ...prev,
                                queryType:
                                  item.label,
                              }));

                              setShowQueryDropdown(false);

                            }}
                            className="
          w-full
          px-4
          py-3
          text-left
          hover:bg-[#f5f7ff]
          border-b
          border-[#f3f4f6]
          last:border-b-0
        "
                          >

                            <p className="text-sm font-medium text-[#111827]">
                              {item.label}
                            </p>

                          </button>

                        )
                      )

                    ) : (

                      <div
                        className="
      px-4
      py-6
      text-sm
      text-center
      text-gray-400
    "
                      >
                        No Query Type Found
                      </div>

                    )}

                  </div>

                )}

              </div>

            </div>
            <div className="md:pl-[124px] pl-0">
              {errors.queryType && (
                <ErrorMessage
                  message={errors.queryType}
                  type="error"
                />
              )}
            </div>

            <div className="flex flex-col md:flex-row md:gap-6">

              <label
                className="
        w-full md:w-[100px]
        shrink-0
        text-xs
       text-subBlack
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
                    onChange={(e) => {

                      setErrors((prev) => ({
                        ...prev,
                        subject: "",
                      }));

                      setFormData({
                        ...formData,
                        subject: e.target.value,
                      });

                    }}


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
            <div className="md:pl-[124px] pl-0">
              {errors.subject && (
                <ErrorMessage
                  message={errors.subject}
                  type="error"
                />
              )}
            </div>

            {/* <div className="flex flex-col md:flex-row md:gap-6">

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

          </div> */}


            <div className="flex flex-col md:flex-row md:gap-4">

              <label
                className="
      w-full md:w-[110px]
      shrink-0
      text-sm
     text-subBlack
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
                  onChange={(date) => {

                    setErrors((prev) => ({
                      ...prev,
                      date: "",
                    }));

                    setFormData({
                      ...formData,
                      date,
                    });

                  }}
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
            <div className="md:pl-[124px] pl-0">
              {errors.date && (
                <ErrorMessage
                  message={errors.date}
                  type="error"
                />
              )}
            </div>

            {/* <div className="flex flex-col md:flex-row md:gap-6">

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

          </div> */}


            <div className="flex flex-col md:flex-row md:gap-6">

              <label
                className="
        w-full md:w-[100px]
        shrink-0
        text-xs
       text-subBlack
        pt-3
        text-left
      "
              >
                Upload Payment Proof
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
                    hidden
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,

                        file:
                          e.target.files?.[0],
                      }))
                    }
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


            <div className="flex flex-col md:flex-row md:gap-6">

              <label
                className="
        w-full md:w-[100px]
        shrink-0
        text-xs
        text-subBlack
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


          <div className="px-6 py-5 border-t border-[#edf0f7] flex justify-end gap-3">

            <button
              onClick={onClose}
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
              className="
              h-[44px]
              px-6
              rounded-xl
              bg-[#315CEC]
              text-white
              text-sm
              font-medium cursor-pointer
            "
            >
              Send & Schedule
            </button>

          </div>

        </div>

      </div>
    </>
  );
};

export default CreateTicketModal;