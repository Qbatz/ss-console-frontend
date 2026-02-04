import React from "react";
import RoleImg from "../../assets/RoleImg.png";
import Lock from "../../assets/lock.png"

const modules = ["Properties", "Owners", "Subscriptions"];

const CreateRoleModal = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-4 border-b">
          <div>
            <h2 className="text-[15px] font-semibold font-inter text-start">Create New Role</h2>
            <p className="text-sm text-gray-500">
              Fill in the details to create a new admin user
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-130px)]">

          {/* Basic Details */}
          <div className="border rounded-xl p-6 space-y-5">
  <h3 className="text-base font-semibold flex items-center gap-2">
    <img src={RoleImg} alt="Role"
  className="w-5 h-5 object-contain"/> Basic Role Details
  </h3>

 
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700 text-left">
      Role Name <span className="text-red-500">*</span>
    </label>

    <input
      type="text"
      placeholder="e.g., Super Admin, Accountant"
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>

  {/* Role Description */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700 text-left">
      Role Description
    </label>

    <textarea
      rows="4"
      placeholder="e.g., Can manage Property, Billings, Subscriptions."
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
    />
  </div>
</div>


          
          <div className="border rounded-xl p-5">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
             <img src={Lock} alt="Lock"
  className="w-5 h-5 object-contain"/> Permissions
            </h3>

            <div className="grid grid-cols-6 text-xs font-medium text-gray-500 mb-3">
              <div>Module</div>
              <div className="text-center">View</div>
              <div className="text-center">Add</div>
              <div className="text-center">Edit</div>
              <div className="text-center">Delete</div>
              <div className="text-center">Extra</div>
            </div>

            {modules.map((mod, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center py-2 border-t text-sm"
              >
                <div>{mod}</div>
                <div className="flex justify-center">
                  <input type="checkbox" />
                </div>
                <div className="flex justify-center">
                  <input type="checkbox" />
                </div>
                <div className="flex justify-center">
                  <input type="checkbox" />
                </div>
                <div className="flex justify-center">
                  <input type="checkbox" />
                </div>
                <div className="text-center text-blue-600 cursor-pointer text-xs">
                  More +
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Cancel
          </button>
          <button className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Role
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateRoleModal;
