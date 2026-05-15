import React, { useState, useEffect, useRef } from "react";
import { useSubscription } from "../../Context/SubscriptionContext";
import Arrow from "../../assets/direction-down 01.png";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Toast from "../SuccessModal/ToastDesign";

const UpdateStatusModal = ({ open, onClose, demoRequestId, refreshList, currentStatus }) => {
  const { updateDemoRequestStatus, getAgentsDropdown, getDemoRequestStatus, getDemoRequests } = useSubscription();
  const [statusList, setStatusList] = useState([]);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await getDemoRequestStatus();
      if (res.success) {
        setStatusList(res.data);
      }
    };

    fetchStatus();
  }, []);
  const filteredStatuses =
    statusList.find(
      (item) => item.currentStatus === currentStatus
    )?.allowedStatuses || [];
  console.log("setStatusList", statusList)

  const [form, setForm] = useState({
    demoRequestStatus: "",
    comments: "",
    presentedBy: "",
    presentedAt: "",
    agentId: ""
  });

  const [agents, setAgents] = useState([]);
  const [errors, setErrors] = useState({});
  const [agentList, setAgentList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const dropdownRef = useRef(null);
  const [updateError, setUpdateError] = useState("")

  console.log("selectedAgent", selectedAgent)
  const resetForm = () => {
    setForm({
      demoRequestStatus: "",
      comments: "",
      presentedBy: "",
      presentedAt: "",
      agentId: ""
    });

    setSelectedStatus("");
    setSelectedAgent("");
    setOpenDropdown(false);
    setOpenStatus(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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

    // Status validation
    if (!form.demoRequestStatus) {
      err.demoRequestStatus = "Status is required";
    }


    if (
      form.demoRequestStatus === "ASSIGNED" &&
      !form.agentId
    ) {
      err.agentId = "Agent is required";
    }

    // COMPLETED -> presentedBy required
    if (
      form.demoRequestStatus === "COMPLETED" &&
      !form.presentedBy
    ) {
      err.presentedBy = "Agent is required";
    }

    // COMPLETED -> presentedAt required
    if (
      form.demoRequestStatus === "COMPLETED" &&
      !form.presentedAt
    ) {
      err.presentedAt = "Presented date is required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) return;

    let payload = {
      demoRequestStatus: form.demoRequestStatus,
      comments: form.comments,
    };

    // ASSIGNED
    if (form.demoRequestStatus === "ASSIGNED") {

      payload.agentId = form.agentId;
    }

    // COMPLETED
    if (form.demoRequestStatus === "COMPLETED") {

      payload.presentedBy = form.presentedBy;

      payload.presentedAt = formatDateTime(
        form.presentedAt
      );
    }

    const res = await updateDemoRequestStatus(
      demoRequestId,
      payload
    );

    if (res.success) {
      setModalType("success");
      setMessage(res?.message);
      setShowSuccess(true);
      await refreshList();

      setTimeout(() => {
        setShowSuccess(false);
        resetForm();

        onClose();



      }, 1500);



    }
    else {

    }
  };
  // const handleSubmit = async () => {
  //   if (!validate()) return;

  //   const payload = {
  //     ...form,
  //     presentedAt:
  //       form.demoRequestStatus === "COMPLETED"
  //         ? formatDateTime(form.presentedAt)
  //         : ""
  //   };

  //   const res = await updateDemoRequestStatus(demoRequestId, payload);

  //   if (res.success) {
  //      await refreshList();
  //     onClose();

  //   }
  // };

  if (!open) return null;

  return (
    <>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div className="fixed inset-0 z-50 flex items-center justify-center">


        <div className="absolute inset-0 bg-black/30" onClick={handleClose}></div>

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
                {
                  filteredStatuses.find(
                    (s) => s.key === selectedStatus
                  )?.value || "Select Status"
                }

              </span>
            </div>

            {/* Dropdown */}
            {openStatus && (
              <div className="absolute mt-2 w-full bg-white border rounded shadow max-h-40 overflow-y-auto z-50">

                {filteredStatuses.map((item) => (
                  <div
                    key={item.key}
                 
                    onClick={() => {

                      let updatedForm = {
                        ...form,
                        demoRequestStatus: item.key
                      };

                      setSelectedAgent("");

                      updatedForm = {
                        ...updatedForm,
                        presentedBy: "",
                        agentId: ""
                      };

                      setSelectedStatus(item.key);

                      setForm(updatedForm);

                      // error clear
                      setErrors({
                        ...errors,
                        demoRequestStatus: ""
                      });

                      setOpenStatus(false);
                    }}
                    className={`px-4 py-2 cursor-pointer text-sm text-left
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
          {errors.demoRequestStatus && (
            <ErrorMessage message={errors.demoRequestStatus} type="error" />
          )}
          {/* {errors.demoRequestStatus && <p className="text-red-500 text-xs">{errors.demoRequestStatus}</p>} */}


          <textarea
            name="comments"
            placeholder="Comments"
            onChange={handleChange}
            className="w-full border p-2 rounded mt-2"
          />

          {/* Conditional Fields */}
          {(

            form.demoRequestStatus === "ASSIGNED" ||
            form.demoRequestStatus === "COMPLETED"
          ) && (


              <div className="relative mt-2" ref={dropdownRef}>


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


                {openDropdown && (
                  <div className="absolute mt-2 w-full bg-white rounded shadow-lg border max-h-44 overflow-y-auto z-[9999]">

                    {agentList.map((agent) => (
                      <div
                        key={agent.agentId}

                        onClick={() => {

                          setSelectedAgent(agent.agentId);

                          setForm({
                            ...form,

                            ...(form.demoRequestStatus === "ASSIGNED" && {
                              agentId: agent.agentId
                            }),

                            ...(form.demoRequestStatus === "COMPLETED" && {
                              presentedBy: agent.agentId
                            })
                          });
                          setErrors({
                            ...errors,
                            agentId: "",
                            presentedBy: ""
                          });
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

            )}
          {errors.agentId && (
            <ErrorMessage
              message={errors.agentId}
              type="error"
            />
          )}
          {(

            form.demoRequestStatus === "COMPLETED"
          ) && (
              <>
                {/* {errors.presentedBy && <p className="text-red-500 text-xs">{errors.presentedBy}</p>} */}

                {errors.presentedBy && (
                  <ErrorMessage
                    message={errors.presentedBy}
                    type="error"
                  />
                )}
                <input
                  type="datetime-local"
                  name="presentedAt"
                  value={form.presentedAt}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-2"
                />
                {errors.presentedAt && (
                  <ErrorMessage message={errors.presentedAt} type="error" />
                )}
                {/* {errors.presentedAt && <p className="text-red-500 text-xs">{errors.presentedAt}</p>} */}
              </>
            )}

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={handleClose} className="px-4 py-2 border rounded">
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
    </>
  );
};

export default UpdateStatusModal;