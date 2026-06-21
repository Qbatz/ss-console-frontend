import React, {
  useEffect,
  useState
} from "react";

import { useParams,useNavigate,useLocation} from "react-router-dom";
import { useHostel } from "../../Context/HostelListContext";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import arrowleft from "../../assets/arrow-up.png";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage"


const InvoiceReceipt = () => {
const navigate = useNavigate();
  const { hostelId, invoiceId } =
    useParams();

  const {
    getInvoiceReceipt,updateInvoiceBalance
  } = useHostel();
  const location = useLocation();
const hostelData = location.state?.hostelData;
const invoiceData = location.state?.invoiceData;

console.log("hostelData",hostelData)
  const [receiptList, setReceiptList] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
const [balanceAmount, setBalanceAmount] = useState("");
const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [balanceAmountError,setBalanceAmountError] = useState("")
  const handleCloseModal = () => {
  setShowUpdateModal(false);
  setBalanceAmount("");
  setBalanceAmountError("")
};
  useEffect(() => {
    fetchReceipt();
  }, []);

  const fetchReceipt = async () => {

    const res =
      await getInvoiceReceipt(
        hostelId,
        invoiceId
      );

    if (res.success) {
      setReceiptList(
        res.data || []
      );
    }

  };
  const handleUpdateBalance = async () => {
 if (!balanceAmount || Number(balanceAmount) <= 0) {
    setBalanceAmountError("Please enter valid balance amount");
    return;
  }

  setBalanceAmountError("");
  const res = await updateInvoiceBalance(
    hostelId,
    invoiceId,
    balanceAmount
  );

  if (res?.success) {
 setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
         setShowUpdateModal(false);
    setBalanceAmount("");
      }, 1500);
   

    fetchReceipt();

  } else {
setBalanceAmountError(res.message)
      }
};

  return (
    <DashboardLayout>
         <Toast
        show={showSuccess}
        message={message}
        type={modalType}
      />
    <div className="p-6">

 <div className="flex items-center justify-between mb-4">

  <div className="flex items-center gap-2">

    <img
  src={arrowleft}
  alt="back"
  className="w-4 h-4 cursor-pointer"
  onClick={() =>
    navigate(
      `/property-overview/${hostelId}`,
      {
        state: {
          activeTab: "Invoice",
        },
      }
    )
  }
/>

    <h2 className="text-lg font-semibold">
      Invoice Receipts
    </h2>

  </div>

  <button   onClick={() => setShowUpdateModal(true)}
    className="
      px-4
      py-2
      bg-[#2563EB]
      text-white
      text-sm
      rounded-lg
      hover:bg-[#1D4ED8]
      cursor-pointer
    "
  >
    Update
  </button>

</div>
<div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">

  <div className="grid grid-cols-4 gap-6">

    <div>
      <p className="text-[12px] text-gray-500 mb-1">
        Property Name
      </p>
      <p className="text-[14px] font-medium">
        {hostelData?.hostelName || "N/A"}
      </p>
    </div>

    <div>
      <p className="text-[12px] text-gray-500 mb-1">
        Invoice Number
      </p>
      <p className="text-[14px] font-medium">
        {invoiceData?.invoiceNumber || invoiceId}
      </p>
    </div>

   

    <div>
      <p className="text-[12px] text-gray-500 mb-1">
        Invoice Type
      </p>
      <p className="text-[14px] font-medium">
        {invoiceData?.invoiceType || "N/A"}
      </p>
    </div>

  </div>

</div>
      <div className="bg-white rounded-xl border-soft overflow-hidden">

        <table className="w-full text-[12px]">

          <thead className="bg-[#F8F9FC]">

            <tr>

              

              <th className="px-4 py-3 text-left">
                Customer
              </th>

              <th className="px-4 py-3 text-left">
                Paid Amount
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>
 <th className="px-4 py-3 text-left">
                Transaction Mode 
              </th>
              <th className="px-4 py-3 text-left">
                Payment Date
              </th>

              {/* <th className="px-4 py-3 text-left">
                Action
              </th> */}

            </tr>

          </thead>

         <tbody>
  {receiptList?.length > 0 ? (
    receiptList.map((item) => (
      <tr
        key={item.transactionId}
        className="border-t border-gray-300"
      >
       

        <td className="px-4 py-3 text-left">
          {item.customerName}
        </td>

        <td className="px-4 py-3 text-left">
          ₹{item.paidAmount}
        </td>

        <td className="px-4 py-3 text-left">
          {item.status}
        </td>
<td className="px-4 py-3 text-left">
          {item.transactionMode}
        </td>
        <td className="px-4 py-3 text-left">
          {item.paymentDate}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="5"
        className="
          py-10
          text-center
          text-gray-500
          text-sm
        "
      >
        No Data Found
      </td>
    </tr>
  )}
</tbody>

        </table>

      </div>

    </div>
    {showUpdateModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center">

    <div
      className="absolute inset-0 bg-black/40"
      onClick={handleCloseModal}
    />

    <div className="relative bg-white rounded-xl w-[450px] p-6 shadow-xl text-left">

      <h3 className="text-lg font-semibold mb-5 ">
        Update Balance Amount
      </h3>

      <div>
        <label className="block text-sm mb-2 text-gray-600">
          Balance Amount <span className="text-red-400">*</span>
        </label>

        <input
          type="number"
          value={balanceAmount}
          onChange={(e) => {
    setBalanceAmount(e.target.value);
    setBalanceAmountError("");
  }}
          placeholder="Enter balance amount"
          className="
            w-full
            border
            border-gray-300
            rounded-lg
            px-3
            py-2
            outline-none
          "
        />
      </div>
 {balanceAmountError && (
              <ErrorMessage message={balanceAmountError} type="error" />
            )}
      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={handleCloseModal}
          className="
            px-4
            py-2
            border
            rounded-lg cursor-pointer
          "
        >
          Cancel
        </button>

        <button
         onClick={handleUpdateBalance}
          className="
            px-4
            py-2
            bg-[#2563EB]
            text-white
            rounded-lg cursor-pointer
          "
        >
          Update
        </button>

      </div>

    </div>

  </div>
)}
    </DashboardLayout>
  );
};

export default InvoiceReceipt;