import React, { useState, useEffect } from "react";
import { useSubscription } from "../../Context/SubscriptionContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";
const DemoRequestDrawer = ({ open, onClose }) => {
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

    const { createDemoRequest, loading } = useSubscription();
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [modalType, setModalType] = useState("success");
      const [showSuccess, setShowSuccess] = useState(false);
      const [message, setMessage] = useState("");
      const [nameError,setNameError] = useState("")
      const [mobileError,setMobileError] = useState("")
      const [countryError,setCountryError] = useState("")
      const [tenantError,setTenantError] = useState("")
      const[hostelError,setHostelError] = useState("")

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

  return valid;
};

    const handleSubmit = async () => {
       const isValid = validateForm(); 

  if (!isValid) return;

        const payload = {
            ...formData,
            noOfHostels: Number(formData.noOfHostels) || 0,
            noOfTenants: Number(formData.noOfTenants) || 0,
            requestedDate: formatDate(formData.requestedDate),
            requestedTime: formatTime(formData.requestedTime),
        };

        const res = await createDemoRequest(payload);

        if (res.success) {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">

            <div
                className="absolute inset-0 bg-black/20"
                onClick={onClose}></div>


            <div className="relative w-full flex justify-end p-4">

                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl h-full max-h-[95vh] overflow-y-auto p-6">

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Add Demo Request</h2>
                        <button className="cursor-pointer" onClick={onClose}>✖</button>
                    </div>

                    <div className="space-y-3">

                        <input name="name" placeholder="Name" onChange={(e) => {
  handleChange(e);
  setNameError("");
}} className="w-full border p-2 rounded-xl  border-gray-300" />
                          {nameError && (
                                            <ErrorMessage message={nameError} type="error" />
                                          )}
                        <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded-xl   border-gray-300" />
                       <div className="w-full border border-gray-300 rounded-xl  flex overflow-hidden">

  {/* Country Code */}
  <div className="flex items-center px-3 bg-gray-100 border-r border-gray-300">
    <select
      name="countryCode"
      value={formData.countryCode}
      onChange={handleChange}
      className="bg-transparent outline-none"
    >
      <option value="+91">+91</option>
     
    </select>
  </div>
    {countryError && (
                      <ErrorMessage message={countryError} type="error" />
                    )}

  {/* Phone Input */}
  <input
    name="contactNo"
    placeholder="Enter Mobile Number"
    value={formData.contactNo}
   onChange={(e) => {
  const value = e.target.value.replace(/\D/g, "");
  setFormData({ ...formData, contactNo: value });
  setMobileError("");
}}
    className="w-full p-2 outline-none"
  />
 
</div>
   {mobileError && (
                      <ErrorMessage message={mobileError} type="error" />
                    )}
                        <input name="organization" placeholder="Organization" onChange={handleChange} className="w-full border p-2 rounded-xl   border-gray-300" />

                     <div className="grid grid-cols-2 gap-3">

  {/* Hostels */}
  <div>
    <input
      name="noOfHostels"
      placeholder="No. of Hostels"
      type="text"
      onChange={(e) => {
        handleChange(e);
        setHostelError("");
      }}
      className={`w-full border p-2 rounded-xl ${
        hostelError ? "border-red-500" : "border-gray-300"
      }`}
    />

    {hostelError && (
      <ErrorMessage message={hostelError} type="error" />
    )}
  </div>

  {/* Tenants */}
  <div>
    <input
      name="noOfTenants"
      placeholder="No. of Tenants"
      type="text"
      onChange={(e) => {
        handleChange(e);
        setTenantError("");
      }}
      className={`w-full border p-2 rounded-xl ${
        tenantError ? "border-red-500" : "border-gray-300"
      }`}
    />

    {tenantError && (
      <ErrorMessage message={tenantError} type="error" className="whitespace-nowrap"/>
    )}
  </div>

</div>
                    

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                name="city"
                                placeholder="City"
                                onChange={handleChange}
                                className="w-full border p-2 rounded-xl   border-gray-300"
                            />
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Select State"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setFormData({ ...formData, state: "" });
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    className="w-full border p-2 rounded-xl  border-gray-300"
                                />

                                {showDropdown && (
                                    <div className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto shadow">

                                        {filteredStates.length > 0 ? (
                                            filteredStates.map((state, index) => (
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
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500">No results</div>
                                        )}

                                    </div>
                                )}
                            </div>
                        </div>

                        <input
                            name="country"
                            placeholder="Country"
                            onChange={handleChange}
                            className="w-full border p-2 rounded-xl   border-gray-300"
                        />


                        <input type="date" name="requestedDate" onChange={handleChange} className="w-full border p-2 rounded-xl   border-gray-300" />
                        <input type="time" name="requestedTime" onChange={handleChange} className="w-full border p-2 rounded-xl   border-gray-300" />

                        <textarea name="comments" placeholder="Comments" onChange={handleChange} className="w-full border p-2 rounded-xl   border-gray-300" />


                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={onClose} className="px-4 py-2 border rounded">
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {loading ? "Saving..." : "Submit"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoRequestDrawer;