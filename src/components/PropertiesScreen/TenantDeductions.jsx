import React,{useState,useEffect} from "react";
import { useLocation,useNavigate} from "react-router-dom";

import DashboardLayout
from "../SidebarScreen/SidebarLayout";
import { useHostel } from "../../Context/HostelListContext";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import arrowleft from "../../assets/arrow-up.png";


const TenantDeductions = ({
  tenantData,
  hostelData,
}) => {
const { getTenantDeductions,updateTenantDeductions } = useHostel();
  // const { state } = useLocation();
const navigate = useNavigate();
  // const tenantData = state?.tenantData;
  // const hostelData = state?.hostelData;
  console.log("tenantData",tenantData)
const [deductions, setDeductions] = useState([]);
const [invoiceDeductions,setInvoiceDeductions] =useState([]);
const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [invoiceList, setInvoiceList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoice,setSelectedInvoice] = useState(null);
  const [deductionType, setDeductionType] = useState("");
  const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);

const [amount, setAmount] =
  useState("");

const [paidAmount, setPaidAmount] =
  useState("");
  const fetchDeductions = async () => {

  const res = await getTenantDeductions(
    tenantData?.hostelDetails?.hostelId,
    tenantData?.customerId
  );

  if (res?.success) {
console.log("res.data",res.data)
    setDeductions(
      Array.isArray(
        res.data?.customerAdvanceDeductions
      )
        ? res.data.customerAdvanceDeductions
        : []
    );

    setInvoiceList(
      res.data?.advanceInvoice || []
    );

    const invoiceData =
      res.data?.advanceInvoice?.flatMap(
        (invoice) =>
          (invoice.invoiceAdvanceDeductions || [])
            .map((deduction) => ({
              ...deduction,
              invoiceId: invoice.invoiceId,
              invoiceNumber: invoice.invoiceNumber
            }))
      ) || [];

    setInvoiceDeductions(invoiceData);
  }
};
useEffect(() => {

  if (
    tenantData?.hostelDetails?.hostelId &&
    tenantData?.customerId
  ) {
    fetchDeductions();
  }

}, [tenantData?.hostelDetails.hostelId, tenantData?.customerId]);

// useEffect(() => {

//   const fetchDeductions = async () => {

//     const res = await getTenantDeductions(
//       hostelData?.hostelId,
//       tenantData?.customerId
//     );

// if (res?.success) {

//   setDeductions(
//     Array.isArray(
//       res.data?.customerAdvanceDeductions
//     )
//       ? res.data.customerAdvanceDeductions
//       : []
//   );

//   setInvoiceList(
//     res.data?.advanceInvoice || []
//   );

//   const invoiceData =
//     res.data?.advanceInvoice?.flatMap(
//       (invoice) =>
//         (invoice.invoiceAdvanceDeductions || [])
//           .map((deduction) => ({
//             ...deduction,
//             invoiceId: invoice.invoiceId,
//             invoiceNumber: invoice.invoiceNumber
//           }))
//     ) || [];

//   setInvoiceDeductions(
//     invoiceData
//   );
// }

//   };

//   if (
//     hostelData?.hostelId &&
//     tenantData?.customerId
//   ) {
//     fetchDeductions();
//   }

// }, []);
const handleSaveDeduction =
  async () => {

    if (saving) return;

    try {

      setSaving(true);

      const res =
        await updateTenantDeductions(
          tenantData?.hostelDetails?.hostelId,
          tenantData?.customerId,
          selectedInvoiceId
        );

      if (res?.success) {

        setModalType("success");
        setMessage(res?.data);

        await fetchDeductions();

        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          setShowAddModal(false);
        }, 1500);

      } else {

        setModalType("error");
        setMessage(res?.message);

        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 1500);
      }

    } finally {

      setSaving(false);

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
        className="
          p-6
          bg-[#F8FAFC]
          min-h-screen
        "
      >

      
       {/* <div className="flex items-center gap-3 mb-6">

  <img
    src={arrowleft}
    alt="Back"
    className="
      w-5
      h-5
     
      cursor-pointer
    "
    onClick={() => window.history.back()}
  />

  <div className="text-left">

    <h1
      className="
        text-[22px]
        font-bold
        text-gray-800
      "
    >
      Tenant Deductions
    </h1>

    <p
      className="
        text-sm
        text-gray-500
        mt-1
      "
    >
      Manage tenant deduction details
    </p>

  </div>

</div>


       
        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            shadow-sm
            p-6
            mb-6
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-5
            "
          >

            <h2
              className="
                text-xl
                font-semibold
                text-gray-800
              "
            >
              Tenant Details
            </h2>

            <span
              className="
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                bg-green-100
                text-green-700
              "
            >
             {tenantData?.currentStatus}
            </span>

          </div>


          <div
  className="
    grid
    grid-cols-1
    lg:grid-cols-2
    gap-6
  "
>

            
            <div className="text-left">

              <p
                className="
                  text-xs
                  text-gray-500
                  mb-1 
                "
              >
                Tenant Name
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                {tenantData?.fullName}
              </p>

            </div>


          
            <div className="text-left">

              <p
                className="
                  text-xs
                  text-gray-500
                  mb-1
                "
              >
                Mobile Number
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                +91 {tenantData?.mobile}
              </p>

            </div>


          
            

          </div>

        </div> */}


     
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
          "
        >

        
          <div
  className="
    bg-white
    rounded-2xl
    border
    border-gray-200
    shadow-sm
    overflow-hidden
    self-start
  "
>

         
            <div
              className="
                px-6
                py-5
                border-b
                border-gray-200
                bg-gray-50
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                "
              >
                Advance Deduction
              </h2>

              

            </div>


         
           <div
  className="
    border-t
    border-gray-200
  "
>

  
  <table className="w-full">

    <thead className="bg-gray-50">

      <tr>

        <th
          className="
            text-left
            px-6
            py-4
            text-xs
            font-semibold
            text-gray-500
            uppercase
            w-[33%]
          "
        >
          Type
        </th>

        <th
          className="
            text-left
            px-6
            py-4
            text-xs
            font-semibold
            text-gray-500
            uppercase
            w-[33%]
          "
        >
          Amount
        </th>

        <th
          className="
            text-left
            px-6
            py-4
            text-xs
            font-semibold
            text-gray-500
            uppercase
            w-[34%]
          "
        >
          Paid Amount
        </th>

      </tr>

    </thead>

  </table>


  {/* BODY */}
  <div className="max-h-[250px] overflow-y-auto">

    <table className="w-full">

      <tbody>

        {Array.isArray(deductions) &&
         deductions.length > 0 ? (

          deductions.map(
            (item, index) => (

              <tr
                key={index}
                className="
                  border-t
                  border-gray-100
                  hover:bg-gray-50
                "
              >

                <td
                  className="
                    px-6
                    py-4
                    text-sm
                    font-medium
                    text-gray-800
                    text-left
                    w-[33%]
                  "
                >
                  {item.type}
                </td>

                <td
                  className="
                    px-6
                    py-4
                    text-sm
                    text-gray-700
                    text-left
                    w-[33%]
                  "
                >
                  ₹ {item.amount}
                </td>

                <td
                  className="
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-green-600
                    text-left
                    w-[34%]
                  "
                >
                  ₹ {item?.paidAmount || 0}
                </td>

              </tr>

            )
          )

        ) : (

          <tr>

            <td
              colSpan={3}
              className="
                py-8
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

          </div>


          {/* RIGHT TABLE */}
         {/* RIGHT TABLE */}
<div
  className="
    bg-white
    rounded-2xl
    border
    border-gray-200
    shadow-sm
    overflow-hidden
  "
>

  {/* HEADER */}
  <div
    className="
      px-6
      py-5
      border-b
      border-gray-200
      bg-gray-50
      flex
      items-center
      justify-between
    "
  >

    <h2
      className="
        text-lg
        font-semibold
        text-gray-800
      "
    >
      Invoice Deductions
    </h2>

  </div>

  <div className="max-h-[500px] overflow-y-auto">

    {invoiceList?.length > 0 ? (

      invoiceList.map((invoice) => (

        <div key={invoice.invoiceId}>

          {/* INVOICE ROW */}
          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th
                  className="
                    text-left
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    text-gray-500
                    uppercase
                  "
                >
                  Invoice Num
                </th>

                <th
                  className="
                    text-center
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    text-gray-500
                    uppercase text-left
                  "
                >
                  Deductions
                </th>

              </tr>

            </thead>

            <tbody>

              <tr
                className="
                  border-t
                  border-gray-100
                "
              >

                <td
                  className="
                    px-6
                    py-4
                    text-sm
                    font-medium
                    text-gray-800
                    text-left
                  "
                >
                  {invoice.invoiceNumber}
                </td>

                <td
                  className="
                    px-6
                    py-4
                    text-center text-left
                  "
                >

                  <button
                    onClick={() => {

                      setSelectedInvoiceId(
                        invoice.invoiceId
                      );

                      setShowAddModal(true);

                    }}
                    className="
                      px-4
                      py-2
                      rounded-lg
                      bg-blue-600
                      text-white
                      text-sm
                      cursor-pointer
                    "
                  >
                    + Add
                  </button>

                </td>

              </tr>

            </tbody>

          </table>


          {/* DEDUCTION TABLE */}
          <div className="p-4">

            <div
              className="
                border
                border-gray-200
                rounded-xl
                overflow-hidden
              "
            >

              <table className="w-full">

                <thead
                  className="
                    bg-gray-50
                  "
                >

                  <tr>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                      "
                    >
                      Type
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                      "
                    >
                      Amount
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        text-gray-500
                        uppercase
                      "
                    >
                      Paid Amount
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {invoice
                    ?.invoiceAdvanceDeductions
                    ?.length > 0 ? (

                    invoice.invoiceAdvanceDeductions.map(
                      (
                        deduction,
                        index
                      ) => (

                        <tr
                          key={index}
                          className="
                            border-t
                            border-gray-100
                          "
                        >

                          <td className="px-6 py-4 text-sm">
                            {deduction.type}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            ₹ {deduction.amount}
                          </td>

                          <td
                            className="
                              px-6
                              py-4
                              text-sm
                              text-green-600
                              font-medium
                            "
                          >
                            ₹ {deduction.paidAmount || 0}
                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan={3}
                        className="
                          py-8
                          text-center
                          text-gray-500
                        "
                      >
                        No Deductions Added
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      ))

    ) : (

      <div
  className="
    py-12
    flex
    items-center
    justify-center
    text-gray-500
  "
>
  No Invoice Found
</div>

    )}

  </div>

</div>

        </div>

      </div>
{showAddModal && (

  <div
    className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
    "
    onClick={() =>
      setShowAddModal(false)
    }
  >

    <div
      className="
        bg-white
        rounded-2xl
        p-6
        w-[400px]
        shadow-xl
      "
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <h2 className="text-lg font-semibold text-gray-800 text-left">
        Confirmation
      </h2>

      <p className="text-sm text-gray-500 mt-3">
        Are you sure you want to add this deduction?
      </p>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() =>
            setShowAddModal(false)
          }
          className="
            px-4
            py-2
            border
            rounded-lg
            text-gray-600
            cursor-pointer
          "
        >
          Cancel
        </button>

        <button
          onClick={handleSaveDeduction}
          disabled={saving}
          className="
            px-4
            py-2
            bg-blue-600
            text-white
            rounded-lg
            cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {saving ? "Saving..." : "OK"}
        </button>

      </div>

    </div>

  </div>

)}

    </>

  );
};

export default TenantDeductions;