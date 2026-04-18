import React, { useState, useEffect,useRef } from "react";
import { useSubscription } from "../../Context/SubscriptionContext";
import Arrow from "../../assets/direction-down 01.png";

const UpdateStatusModal = ({ open, onClose, demoRequestId,refreshList }) => {
  const { updateDemoRequestStatus, getAgentsDropdown,getDemoRequestStatus,getDemoRequests } = useSubscription();
const [statusList, setStatusList] = useState([]);
const [openStatus, setOpenStatus] = useState(false);
const [selectedStatus, setSelectedStatus] = useState("");
useEffect(() => {
  const fetchStatus = async () => {
    const res = await getDemoRequestStatus();
    if (res.success) {
      setStatusList(res.data);
    }
  };

  fetchStatus();
}, []);

  const [form, setForm] = useState({
    demoRequestStatus: "",
    comments: "",
    presentedBy: "",
    presentedAt: ""
  });

  const [agents, setAgents] = useState([]);
  const [errors, setErrors] = useState({});
  const [agentList, setAgentList] = useState([]);
const [openDropdown, setOpenDropdown] = useState(false);
const [selectedAgent, setSelectedAgent] = useState("");
const dropdownRef = useRef(null);

 

 
useEffect(() => {
  const fetchAgents = async () => {
    const res = await getAgentsDropdown();
    if (res.success) {
      setAgentList(res.data);
    }
  };

  fetchAgents();
}, []);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    const d = new Date(dateTime);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const validate = () => {
    let err = {};

    if (!form.demoRequestStatus) {
      err.demoRequestStatus = "Status is required";
    }

    if (form.demoRequestStatus === "COMPLETED") {
      if (!form.presentedBy) {
        err.presentedBy = "Agent is required";
      }
      if (!form.presentedAt) {
        err.presentedAt = "Date & Time required";
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...form,
      presentedAt:
        form.demoRequestStatus === "COMPLETED"
          ? formatDateTime(form.presentedAt)
          : ""
    };

    const res = await updateDemoRequestStatus(demoRequestId, payload);

    if (res.success) {
       await refreshList();
      onClose();
      
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-xl p-6 shadow-lg">

        <h2 className="text-lg font-semibold mb-4">Update Status</h2>

       
       <div className="relative mt-2">

  {/* Selected box */}
  <div
    onClick={() => setOpenStatus(!openStatus)}
    className="w-full border border-gray-300 rounded px-4 py-2 flex justify-between items-center cursor-pointer"
  >
    <span className="text-sm">
      {statusList.find(s => s.key === selectedStatus)?.value || "Select Status"}
    </span>
  </div>

  {/* Dropdown */}
  {openStatus && (
    <div className="absolute mt-2 w-full bg-white border rounded shadow max-h-40 overflow-y-auto z-50">

      {statusList.map((item) => (
        <div
          key={item.key}
          onClick={() => {
            setSelectedStatus(item.key);
            setForm({ ...form, demoRequestStatus: item.key });
            setOpenStatus(false);
          }}
          className={`px-4 py-2 cursor-pointer text-sm
            ${selectedStatus === item.key
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
            }`}
        >
          {item.value}
        </div>
      ))}

    </div>
  )}
</div>
        {errors.demoRequestStatus && <p className="text-red-500 text-xs">{errors.demoRequestStatus}</p>}

     
        <textarea
          name="comments"
          placeholder="Comments"
          onChange={handleChange}
          className="w-full border p-2 rounded mt-2"
        />

        {/* Conditional Fields */}
        {form.demoRequestStatus === "COMPLETED" && (
          <>
            {/* Agent */}
         <div className="relative mt-2" ref={dropdownRef}>

  {/* Selected box */}
  <div
    onClick={(e) => {
      e.stopPropagation();
      setOpenDropdown(!openDropdown);
    }}
    className="w-full border border-gray-300 rounded px-4 py-2 flex justify-between items-center cursor-pointer"
  >
    <span className="text-sm">
      {agentList.find(a => a.agentId === selectedAgent)?.agentName || "Select Agent"}
    </span>

    <img src={Arrow} className="w-[20px] h-[20px]" />
  </div>

  {/* Dropdown list */}
  {openDropdown && (
    <div className="absolute mt-2 w-full bg-white rounded shadow-lg border max-h-44 overflow-y-auto z-[9999]">

      {agentList.map((agent) => (
        <div
          key={agent.agentId}
          onClick={() => {
            setSelectedAgent(agent.agentId);
            setForm({ ...form, presentedBy: agent.agentId }); // 🔥 important
            setOpenDropdown(false);
          }}
          className={`px-4 py-2 cursor-pointer text-sm
            ${selectedAgent === agent.agentId
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
            }`}
        >
          {agent.agentName}
        </div>
      ))}

    </div>
  )}

</div>
            {errors.presentedBy && <p className="text-red-500 text-xs">{errors.presentedBy}</p>}

            {/* Date Time */}
            <input
              type="datetime-local"
              name="presentedAt"
              onChange={handleChange}
              className="w-full border p-2 rounded mt-2"
            />
            {errors.presentedAt && <p className="text-red-500 text-xs">{errors.presentedAt}</p>}
          </>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateStatusModal;