import React,{useState} from "react";
// import DownArrow from "../../assets/dropdown.png"


const AddAdmin = ({ isOpen, onClose }) => {
    const roles = [
  "Super Admin",
  "Support Agent",
  "Billing Manager",
  "Property Manager",
  "test","test1","test2"
];

const [selectedRole, setSelectedRole] = useState("");
const [openDropdown, setOpenDropdown] = useState(false);
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
            <label className="block mb-1 font-medium">
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
            <label className="block mb-1 font-medium">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Eg: admin@smartstay.com"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block mb-1 font-medium">
              Department <span className="text-red-500">*</span>
            </label>
            <select className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Select department</option>
              <option>Operations</option>
              <option>Billing</option>
              <option>Support</option>
            </select>
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
  <label className="block mb-1 font-medium">
    Assign Role <span className="text-red-500">*</span>
  </label>

  {/* Dropdown Button */}
  <div
    onClick={() => setOpenDropdown(!openDropdown)}
    className="w-full border rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer bg-white"
  >
    <span className={selectedRole ? "text-gray-800" : "text-gray-400"}>
      {selectedRole || "Select role"}
    </span>

    {/* <ChevronDown size={16} className="text-gray-400" /> */}
  </div>

  {/* Dropdown Menu */}
  {openDropdown && (
    <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg">
      {roles.map((role, index) => (
        <div
          key={index}
          onClick={() => {
            setSelectedRole(role);
            setOpenDropdown(false);
          }}
          className={`px-3 py-2 cursor-pointer text-sm 
            ${
              selectedRole === role
                ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600"
                : "hover:bg-gray-50"
            }`}
        >
          {role}
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

          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
