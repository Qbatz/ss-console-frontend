import React, { useState, useEffect } from "react";
import { useSubscription } from "../../Context/SubscriptionContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";
const DemoRequestDrawer = ({ open, onClose, fetchData }) => {
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const { createDemoRequest, loading, } = useSubscription();
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [nameError, setNameError] = useState("")
  const [mobileError, setMobileError] = useState("")
  const [countryError, setCountryError] = useState("")
  const [tenantError, setTenantError] = useState("")
  const [hostelError, setHostelError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [requestDateError, setRequestDateError] = useState("")
  const [requestTimeError, setRequestTimeError] = useState("")
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const filteredStates = states.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    countryCode: "+91",
    organization: "",
    noOfHostels: "",
    noOfTenants: "",
    city: "",
    state: "",
    country: "",
    comments: "",
    requestedDate: "",
    requestedTime: ""
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (time) => {
    if (!time) return "";
    return time.slice(0, 5);
  };
  const validateForm = () => {
    let valid = true;

    // reset
    setNameError("");
    setMobileError("");
    setRequestDateError("");
    setRequestTimeError("");

    if (!formData.name) {
      setNameError("Name is required");
      valid = false;
    }

    if (!formData.contactNo) {
      setMobileError("Mobile number is required");
      valid = false;
    } else if (formData.contactNo.length < 10) {
      setMobileError("Enter valid mobile number");
      valid = false;
    }
    if (
      formData.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {

      setEmailError("Enter valid email address");
      valid = false;

    }

    if (!formData.countryCode) {
      setCountryError("Country code is required");
      valid = false;
    }

    if (formData.noOfHostels < 0) {
      setHostelError("Hostels cannot be negative");
      valid = false;
    }

    if (formData.noOfTenants < 0) {
      setTenantError("Tenants cannot be negative");
      valid = false;
    }
    if (!formData.requestedDate) {
      setRequestDateError("Requested date is required");
      valid = false;
    }


    if (!formData.requestedTime) {
      setRequestTimeError("Requested time is required");
      valid = false;
    }

    return valid;
  };
  const handleCloseDrawer = () => {

    // reset form
    setFormData({
      name: "",
      email: "",
      contactNo: "",
      countryCode: "+91",
      organization: "",
      noOfHostels: "",
      noOfTenants: "",
      city: "",
      state: "",
      country: "",
      comments: "",
      requestedDate: "",
      requestedTime: "",

    });


    setSearch("");
    setIsSubmitting(false)


    setNameError("");
    setMobileError("");
    setCountryError("");
    setTenantError("");
    setHostelError("");
    setRequestDateError("");
    setRequestTimeError("")


    setShowDropdown(false);


    onClose();
  };

  const handleSubmit = async () => {


    if (isSubmitting || loading) return;

    setIsSubmitting(true);

    const isValid = validateForm();

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    if (!formData.contactNo) {
      setMobileError("Mobile number is required");
      setIsSubmitting(false);
      return;
    }

    if (
      !/^[6-9]\d{9}$/.test(formData.contactNo) ||
      /^(\d)\1{9}$/.test(formData.contactNo)
    ) {
      setMobileError("Enter valid mobile number");
      setIsSubmitting(false);
      return;
    }


    try {



      const payload = {
        ...formData,

        noOfHostels:
          Number(
            formData.noOfHostels
          ) || 0,

        noOfTenants:
          Number(
            formData.noOfTenants
          ) || 0,

        requestedDate:
          formatDate(
            formData.requestedDate
          ),

        requestedTime:
          formatTime(
            formData.requestedTime
          ),
      };

      const res =
        await createDemoRequest(
          payload
        );

      if (res.success) {

        setModalType("success");

        setMessage(
          res?.message
        );

        setShowSuccess(true);

        fetchData();

        setTimeout(() => {

          setShowSuccess(false);

          handleCloseDrawer();

        }, 1500);

      } else {

        setModalType("error");

        setMessage(
          res?.message
        );

        setShowSuccess(true);

        setTimeout(() => {

          setShowSuccess(false);

        }, 1500);

      }

    } catch (error) {

      setModalType("error");

      setMessage(
        error?.message ||
        "Something went wrong"
      );

      setShowSuccess(true);

      setTimeout(() => {

        setShowSuccess(false);

      }, 1500);

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
      <div className="fixed inset-0 z-50">


        <div
          className="absolute inset-0 bg-black/20"
          onClick={handleCloseDrawer}
        />

        {/* Drawer */}
        <div className="absolute right-0 top-0 h-full w-full max-w-md">

          <div
            className="h-full bg-white shadow-xl overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >


            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Demo Request</h2>
              <button className="cursor-pointer" onClick={handleCloseDrawer}>✖</button>
            </div>

            <div className="space-y-4">

              {/* Name */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="w-full">
                  <input
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={(e) => {

                      const value = e.target.value;


                      if (/^[A-Za-z\s]*$/.test(value)) {

                        handleChange({
                          target: {
                            name: "name",
                            value,
                          },
                        });

                        setNameError("");
                      }

                    }}
                    className="w-full border p-2 rounded border-gray-300 placeholder:text-sm"
                  />
                  {nameError && <ErrorMessage message={nameError} type="error" />}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium">
                  Email ID
                </label>

                <div className="w-full">
                  <input
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={(e) => {
                      handleChange(e);
                      setEmailError("");
                    }}
                    className="w-full border p-2 rounded border-gray-300 placeholder:text-sm"
                  />

                  {emailError && (
                    <ErrorMessage message={emailError} type="error" />
                  )}
                </div>
              </div>

              {/* Contact Number */}
              {/* <div className="flex items-start text-left gap-3">
    <label className="w-40 text-sm font-medium whitespace-nowrap">
      Contact Number <span className="text-red-500">*</span>
    </label>

    <div className="w-full">
      <div className="flex border border-gray-300 rounded-xl overflow-hidden">
        <div className="px-3 bg-gray-100 border-r text-center items-center">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="bg-transparent outline-none items-center text-center"
          >
            <option value="+91">+91</option>
          </select>
        </div>

        <input
          name="contactNo"
          value={formData.contactNo}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setFormData({ ...formData, contactNo: value });
            setMobileError("");
          }}
          className="w-full p-2 outline-none"
        />
      </div>

      {mobileError && <ErrorMessage message={mobileError} type="error" />}
    </div>
  </div> */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium whitespace-nowrap">
                  Contact Number <span className="text-red-500">*</span>
                </label>

                <div className="w-full">
                  <div className="flex border border-gray-300 rounded overflow-hidden">

                    {/* FIXED HERE */}
                    <div className="px-3 bg-gray-100 border-r flex items-center justify-center">
                      <select
                        name="countryCode"

                        value={formData.countryCode}
                        onChange={handleChange}
                        className="bg-transparent outline-none text-sm rounded"
                      >
                        <option value="+91">+91</option>
                      </select>
                    </div>

                    <input
                      name="contactNo"
                      value={formData.contactNo}
                      placeholder="Enter Mobile"
                      // onChange={(e) => {
                      //   const value = e.target.value.replace(/\D/g, "");
                      //   setFormData({ ...formData, contactNo: value });
                      //   setMobileError("");
                      // }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormData({ ...formData, contactNo: value });
                        setMobileError("");
                      }}
                      className="w-full p-2 outline-none placeholder:text-sm rounded"
                    />
                  </div>

                  {mobileError && <ErrorMessage message={mobileError} type="error" />}
                </div>
              </div>

              {/* Organization */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium">Organization</label>
                <input
                  name="organization"
                  placeholder="Enter organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full border p-2 rounded border-gray-300 placeholder:text-sm"
                />
              </div>

              {/* No of Hostels */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium">
                  No. of Hostels
                </label>
                <div className="w-full">
                  <input
                    name="noOfHostels"
                    placeholder="Enter number of Hostels"
                    value={formData.noOfHostels}
                    onChange={(e) => {
                      handleChange(e);
                      setHostelError("");
                    }}
                    className={`w-full border p-2 rounded placeholder:text-sm ${hostelError ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {hostelError && <ErrorMessage message={hostelError} type="error" />}
                </div>
              </div>

              {/* No of Tenants */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium">
                  No. of Tenants
                </label>
                <div className="w-full">
                  <input
                    name="noOfTenants"
                    placeholder="Enter number of Tenants"
                    value={formData.noOfTenants}
                    onChange={(e) => {
                      handleChange(e);
                      setTenantError("");
                    }}
                    className={`w-full border p-2 rounded placeholder:text-sm ${tenantError ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {tenantError && <ErrorMessage message={tenantError} type="error" />}
                </div>
              </div>

              {/* City */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium">City</label>
                <input
                  name="city"
                  value={formData.city}
                  placeholder="Enter City"
                  onChange={handleChange}
                  className="w-full border p-2 rounded border-gray-300 placeholder:text-sm"
                />
              </div>

              {/* State */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium">State</label>

                <div className="relative w-full">
                  <input
                    value={search}
                    placeholder="Select State"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setFormData({ ...formData, state: "" });
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full border p-2 rounded border-gray-300 placeholder:text-sm"
                  />

                  {showDropdown && (
                    <div className="absolute z-50 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow">
                      {filteredStates.map((state, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setFormData({ ...formData, state });
                            setSearch(state);
                            setShowDropdown(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {state}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Country */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium">Country</label>
                <input
                  name="country"
                  placeholder="Enter Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border p-2 rounded border-gray-300 placeholder:text-sm"
                />
              </div>

              {/* Date */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium">
                  Requested Date <span className="text-red-500">*</span>
                </label>

                <div className="w-full">
                  <input
                    type="date"
                    name="requestedDate"
                    value={formData.requestedDate}
                    onChange={(e) => {
                      handleChange(e);
                      setRequestDateError("");
                    }}
                    className="w-full border p-2 rounded border-gray-300 placeholder:text-sm"
                  />

                  {requestDateError && (
                    <ErrorMessage message={requestDateError} type="error" />
                  )}
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium">
                  Requested Time <span className="text-red-500">*</span>
                </label>

                <div className="w-full">
                  <input
                    type="time"
                    name="requestedTime"
                    value={formData.requestedTime}
                    onChange={(e) => {
                      handleChange(e);
                      setRequestTimeError("");
                    }}
                    className="w-full border p-2 rounded border-gray-300 placeholder:text-sm"
                  />

                  {requestTimeError && (
                    <ErrorMessage message={requestTimeError} type="error" />
                  )}
                </div>
              </div>
              {/* Comments */}
              <div className="flex items-start text-left gap-3">
                <label className="w-40 text-[12px] font-medium">Comments</label>
                <textarea
                  name="comments"
                  placeholder="Enter Comments"
                  onChange={handleChange}
                  className="w-full border p-2 rounded border-gray-300 placeholder:text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={handleCloseDrawer} className="px-4 py-2 border rounded">
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || loading}
                  className={`
    px-4 py-2 rounded text-white
    ${isSubmitting || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 cursor-pointer"
                    }
  `}
                >
                  {isSubmitting || loading
                    ? "Submitting..."
                    : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoRequestDrawer;