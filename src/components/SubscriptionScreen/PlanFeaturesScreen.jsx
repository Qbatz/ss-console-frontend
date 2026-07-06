import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import { usePlan } from "../../Context/PlanContexts";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Edit from "../../assets/editIcon.png";
import Trash from "../../assets/trash.png"

const PlanFeatures = () => {
  const { getSmartstayFeatures,createSmartstayFeature,updateSmartstayFeature,deleteSmartstayFeature } = usePlan();

  const [smartstayFeatures, setSmartstayFeatures] = useState([]);
const [planName, setPlanName] = useState("");
const [price, setPrice] = useState("");
const [showModal, setShowModal] = useState(false);

const [featureName, setFeatureName] = useState("");
const [featureNameError,setFeatureNameError] = useState("")
const [isCommon, setIsCommon] = useState(false);
const [editId, setEditId] = useState(null);
const [modalType, setModalType] = useState("success");
const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [deleteError,setDeleteError] = useState("")
const [initialFeature, setInitialFeature] = useState(null);
const handleEdit = (item) => {
  setEditId(item.smartstayFeatureId);

  setFeatureName(item.featureName);
  setIsCommon(item.isCommon);

  setInitialFeature({
    featureName: item.featureName,
    isCommon: item.isCommon,
  });

  setShowModal(true);
};
  useEffect(() => {
    fetchSmartstayFeatures();
  }, []);

  const fetchSmartstayFeatures = async () => {
    const res = await getSmartstayFeatures();

    if (res.success) {
      setSmartstayFeatures(res.data || []);
      console.log("res.data",res?.data)
    }
  };
  const handleCloseModal = () => {
  setShowModal(false);
  setFeatureName("");
  setFeatureNameError("");
  setIsCommon(false);
};
const handleAddFeature = async () => {

if (!featureName.trim()) {
    setFeatureNameError("Feature Name is required");
    return;
  }

  // EDIT MODE
  if (editId) {

    const noChanges =
      featureName.trim() === initialFeature?.featureName &&
      isCommon === initialFeature?.isCommon;

    if (noChanges) {
      setModalType("error");
      setMessage("No changes detected");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);

      return;
    }
  }

  const payload = {
    featureName,
    isCommon
  };

  let res;

  if (editId) {

    res = await updateSmartstayFeature(
      editId,
      payload
    );

  } else {

    res = await createSmartstayFeature(
      payload
    );
  }

  if (res.success) {
 setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      handleCloseModal();
      }, 1500);
    

    fetchSmartstayFeatures();
  }
  else{
    setModalType("error");
      setMessage(res.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
    
      }, 1500);
  }
};
const confirmDelete = async () => {

  const res = await deleteSmartstayFeature(deleteId);

  if (res.success) {

    setModalType("success");
    setMessage(res.data);
    setShowSuccess(true);

    setShowDeleteModal(false);
    setDeleteId(null);

    fetchSmartstayFeatures();

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

  } else {

    // setModalType("error");
    // setMessage(res.message || "Delete failed");
    // setShowSuccess(true);

    // setTimeout(() => {
    //   setShowSuccess(false);
    // }, 1500);
    setDeleteError(res.message || "Delete failed")
  }
};
// const handleAddFeature  = async () => {

//   if (!featureName.trim()) {
//     setFeatureNameError("Feature Name is required");
//     return;
//   }

//   const payload = {
//     featureName,
//     isCommon
//   };

//   const res = await createSmartstayFeature(payload);

//   if (res.success) {

//     setFeatureName("");
//     setIsCommon(false);

//     setShowModal(false);

//     fetchSmartstayFeatures();

//   } else {
//     alert(res.message);
//   }
// };
  return (
   <DashboardLayout>
    <Toast
        show={showSuccess}
        message={message}
        type={modalType}
      />
 <div className="min-h-screen bg-gray-50 p-6 text-left">
  <h2 className="text-2xl font-semibold mb-2">
    Smartstay PlanFeatures
  </h2>

  <p className="text-gray-500 text-sm mb-6">
    Configure plan details, core features, and specialized add-ons.
  </p>

  <div className="grid grid-cols-12 gap-6">

   
    <div className="col-span-8">

     

      
   <div className="bg-white-common rounded-2xl shadow-sm border border-gray-200 p-6">

  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-800">
        Plan Features
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Manage Smartstay Features
      </p>
    </div>

   <button
  onClick={() => setShowModal(true)}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg  cursor-pointer"
>
  + Add Feature
</button>
  </div>

  {/* Table Header */}
  <div className="grid grid-cols-12 bg-gray-50 rounded-lg px-4 py-3 font-semibold text-gray-700 ">
    <div className="col-span-5">
      Feature Name
    </div>

    <div className="col-span-3 text-center">
      Common
    </div>

    <div className="col-span-4 text-center">
      Actions
    </div>
  </div>

  {/* Rows */}
  <div className="mt-2 h-[250px] overflow-y-auto pr-2">
  {smartstayFeatures.map((item) => (
    <div
      key={item.smartstayFeatureId}
      className="grid grid-cols-12 items-center px-4 py-4 rounded-lg mb-2 border border-gray-200 hover:bg-gray-50"
    >
      <div className="col-span-5 font-medium text-gray-700">
        {item.featureName}
      </div>

      <div className="col-span-3 flex justify-center">
        <input
          type="checkbox"
          checked={item.isCommon}
          readOnly
          className="w-4 h-4"
        />
      </div>

      <div className="col-span-4 flex justify-center gap-4">
        <button className="text-blue-600 hover:text-blue-800  cursor-pointer" onClick={() => handleEdit(item)}>
          <img src={Edit} className="w-5 h-5"/>
        </button>

       <button
  className="text-red-600 hover:text-red-800 cursor-pointer"
  onClick={() => {
    setDeleteId(item.smartstayFeatureId);
    setShowDeleteModal(true);
  }}
>
  <img src={Trash} className="w-5 h-5"/>
</button>
      </div>
    </div>
  ))}
</div>

</div>
    </div>

   

  </div>
</div>
{showModal && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={handleCloseModal}
  >
    <div
      className="bg-white-common rounded-2xl shadow-xl w-full max-w-md p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">
          Add New Feature
        </h2>

        <button
          onClick={handleCloseModal}
          className="text-gray-500 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Feature Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-left">
          Feature Name
          <span className="text-red-600">*</span>
        </label>

        <input
          type="text"
          value={featureName}
          onChange={(e) => {
            setFeatureName(e.target.value);
            setFeatureNameError("");
          }}
          placeholder="Enter Feature Name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {featureNameError && (
          <ErrorMessage
            message={featureNameError}
            type="error"
          />
        )}
      </div>

      {/* Common Checkbox */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          checked={isCommon}
          onChange={(e) =>
            setIsCommon(e.target.checked)
          }
          className="w-4 h-4 cursor-pointer"
        />

        <label className="text-sm font-medium">
          Common Feature
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleCloseModal}
          className="px-4 py-2 border rounded-lg cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleAddFeature}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
{showDeleteModal && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={() => {
      setShowDeleteModal(false);
      setDeleteId(null);
      setDeleteError("")
    }}
  >
    <div
      className="bg-white-common rounded-2xl p-6 w-full max-w-md shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Delete Feature
      </h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this feature?
      </p>
  {deleteError && (
          <ErrorMessage
            message={deleteError}
            type="error"
          />
        )}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteId(null);
            setDeleteError("")
          }}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
</DashboardLayout>
  );
};

export default PlanFeatures;