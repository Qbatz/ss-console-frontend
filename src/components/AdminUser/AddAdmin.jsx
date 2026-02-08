import React, { useState, useEffect } from "react";
import DownArrow from "../../assets/dropdownImg.png"
import { useRole } from "../../Context/RoleContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";


const AddAdmin = ({ isOpen, onClose }) => {
  const { agentRoles, getAgentRoles, createAdmin } = useRole();

  useEffect(() => {
    getAgentRoles();
  }, []);

  const [selectedRole, setSelectedRole] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDept, setOpenDept] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [email, setEmail] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketLink, setTicketLink] = useState("");
  const [emailError, setEmailError] = useState("")
  const [roleError, setRoleError] = useState("")
  const [ticketLinkError, setTicketLinkError] = useState("")


  const departments = [
    "Operations",
    "Billing",
    "Support",
    "Marketing",
    "Sales"
  ];
  const resetForm = () => {
    setEmail("");
    setSelectedRole("");
    setTicketLink("");
    setEmailError("")
    setTicketLinkError("")
    setRoleError("")

  };
  const handleClose = () => {

    resetForm();
    onClose();
  };
  const handleAddUser = async () => {

    let hasError = false;



    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    }

    if (!selectedRole?.id) {
      setRoleError("Please select a role");
      hasError = true;
    }

    if (!ticketLink.trim()) {
      setTicketLinkError("Ticket link is required");
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      emailId: email,
      roleId: Number(selectedRole.id),
      ticketLink: ticketLink
    };

    console.log("FINAL PAYLOAD 👉", payload);

    const res = await createAdmin(payload);

    if (res.success) {

      setModalType("success");
      setMessage(res?.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        handleClose();

      }, 800);
    }
    else {
      setEmailError(res.message);
    }
  };

  return (
    <>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div
        className={`fixed inset-0 z-50 transition ${isOpen ? "visible" : "invisible"
          }`}
      >

        <div
          onClick={handleClose}
          className={`absolute inset-0 bg-black/40 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"
            }`}
        />


        <div
          className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >

          <div className="flex justify-between items-start px-6 py-4 border-b">
            <div>
              <h2 className="text-lg font-semibold font-inter">
                Add New Admin User
              </h2>
              <p className="text-xs text-gray-500">
                Fill in the details to create a new admin user
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>


          <div className="px-6 py-5 space-y-5 text-sm">





            <div>
              <label className="block w-full text-left text-sm font-medium pb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}

                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="Eg: admin@smartstay.com"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            {emailError && (
              <ErrorMessage message={emailError} type="error" />
            )}

            <div className="relative">
              <label className="block w-full text-left text-sm font-medium pb-1">
                Assign Role <span className="text-red-500">*</span>
              </label>


              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="w-full border rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer bg-white"
              >
                <span className={selectedRole ? "text-gray-800" : "text-gray-400"}>
                  {selectedRole?.name || "Select role"}
                </span>
                <img src={DownArrow} alt="down" className="w-4 h-4 object-contain" />

              </div>


              {openDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {agentRoles.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role);
                        setOpenDropdown(false);
                        setRoleError("")
                      }}
                      className={`px-3 py-2 cursor-pointer text-sm 
          ${selectedRole?.id === role.id
                          ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600"
                          : "hover:bg-gray-50"
                        }`}
                    >
                      {role.name}
                    </div>
                  ))}
                </div>
              )}


            </div>
            {roleError && (
              <ErrorMessage message={roleError} type="error" />
            )}
            <div>
              <label className="block w-full text-left text-sm font-medium pb-1">
                Ticket Link <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ticketLink}

                onChange={(e) => {
                  setTicketLink(e.target.value);
                  setTicketLinkError("");
                }}
                placeholder="Enter Ticket Link"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {ticketLinkError && (
                <ErrorMessage message={ticketLinkError} type="error" />
              )}
            </div>
          </div>


          <div className="absolute bottom-0 w-full px-6 py-4 border-t bg-white flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Cancel
            </button>

            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" onClick={handleAddUser}>
              Add User
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAdmin;
