import React,{useState,useEffect} from "react";
import DownArrow from "../../assets/dropdownImg.png"
import { useRole } from "../../Context/RoleContext";


const AddAdmin = ({ isOpen, onClose }) => {
  const { agentRoles,getAgentRoles,createAdmin} = useRole();
    const roles = [
  "Super Admin",
  "Support Agent",
  "Billing Manager",
  "Property Manager",
  "test","test1","test2"
];
useEffect(() => {
  getAgentRoles();
}, []);

const [selectedRole, setSelectedRole] = useState("");
const [openDropdown, setOpenDropdown] = useState(false);
 const [openDept, setOpenDept] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [email, setEmail] = useState("");

  const departments = [
    "Operations",
    "Billing",
    "Support",
    "Marketing",
    "Sales"
  ];
  const handleAddUser = async () => {
  if (!email) {
    alert("Email is required");
    return;
  }

  if (!selectedRole?.id) {
    alert("Please select a role");
    return;
  }

  const payload = {
    emailId: email,
     roleId: Number(selectedRole.id),
     ticketLink:"https://sprints.zoho.in/workspace/s3remoticatechnologies#P24/itemdetails/I4"
  };

  console.log("FINAL PAYLOAD 👉", payload);

  const res = await createAdmin(payload);

  if (res.success) {
    onClose();
    setEmail("");
    setSelectedRole(null);
  }
};

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Slide Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
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
            onClick={onClose}
            className="text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 text-sm">

          {/* Full Name */}
          <div>
          <label className="block w-full text-left text-sm font-medium pb-1">
  Full Name <span className="text-red-500">*</span>
</label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block w-full text-left text-sm font-medium pb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
  onChange={(e) => setEmail(e.target.value)}
              placeholder="Eg: admin@smartstay.com"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Department */}
         
            
 <div className="relative">
  <label className="block w-full text-left text-sm font-medium pb-1">
    Department <span className="text-red-500">*</span>
  </label>

  {/* Input Box */}
  <div
    onClick={() => setOpenDept(!openDept)}
    className="w-full border rounded-lg px-3 py-2 bg-white cursor-pointer flex justify-between items-center"
  >
    <span className="text-sm text-gray-700">
      {selectedDept || "Select department"}
    </span>
   <img src={DownArrow} alt="down" className="w-4 h-4 object-contain"/>
  </div>

  {/* Dropdown */}
  {openDept && (
    <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
      {departments.map((dept, i) => (
        <div
          key={i}
          onClick={() => {
            setSelectedDept(dept);
            setOpenDept(false);
          }}
          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
        >
          {dept}
        </div>
      ))}
    </div>
  )}
</div>


         

          {/* Assign Role */}
          {/* <div>
            <label className="block mb-1 font-medium">
              Assign Role <span className="text-red-500">*</span>
            </label>

            <div className="border rounded-lg divide-y">
              {roles.map((role, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  {role}
                </div>
              ))}
            </div>
          </div> */}
          <div className="relative">
  <label className="block w-full text-left text-sm font-medium pb-1">
    Assign Role <span className="text-red-500">*</span>
  </label>

  {/* Dropdown Button */}
  <div
    onClick={() => setOpenDropdown(!openDropdown)}
    className="w-full border rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer bg-white"
  >
    <span className={selectedRole ? "text-gray-800" : "text-gray-400"}>
  {selectedRole?.name || "Select role"}
</span>
<img src={DownArrow} alt="down" className="w-4 h-4 object-contain"/>
    {/* <ChevronDown size={16} className="text-gray-400" /> */}
  </div>

  {/* Dropdown Menu */}
 {openDropdown && (
  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
    {agentRoles.map((role) => (
      <div
        key={role.id}
        onClick={() => {
          setSelectedRole(role);
          setOpenDropdown(false);
        }}
        className={`px-3 py-2 cursor-pointer text-sm 
          ${
            selectedRole?.id === role.id
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

        </div>

        {/* Footer */}
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
  );
};

export default AddAdmin;
