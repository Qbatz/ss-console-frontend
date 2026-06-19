import React from "react";
import LoginImg from "../../assets/LoginImg.png";
import { usePermission } from "../../Utils/permissionHelper";

const PropertyAmenities = ({ hostelData }) => {
  const { canRead, canWrite, canUpdate, canDelete } =
    usePermission("Amenities");
  const amenities = hostelData?.amenities || [];

  return (
    <>
      {canRead === false ? (
        <div className="flex flex-col items-center justify-center h-[350px] gap-4">

          <img
            src={LoginImg}
            alt="Access Restricted"
            className="w-64 object-contain"
          />

          <p className="text-red-600 text-lg font-medium">
            Access Restricted
          </p>

        </div>

      ) : (
        <div className="bg-white rounded-xl shadow-sm border-soft max-h-[300px] overflow-auto">

          <table className="w-full text-sm text-left">

            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-600 sticky top-0 z-20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter uppercase">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter uppercase">Amenity Name</th>
                <th className="px-4 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter uppercase">Amount</th>
                {/* <th className="px-4 py-2 bg-gray-100">Pro Rate</th> */}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {amenities.length > 0 ? (
                amenities.map((item, index) => (
                  <tr key={item.amenityId} className="hover:bg-gray-50 border-b border-gray-300">

                    <td className="px-4 py-2 text-left font-medium text-[12px]">
                      {index + 1}
                    </td>

                    <td className="px-4 py-2 text-left font-medium text-[12px]">
                      {item.amenityName}
                    </td>

                    <td className="px-4 py-2 text-left font-medium text-[12px]">
                      ₹ {item.amenityAmount}
                    </td>

                    {/* <td className="px-4 py-2">
              {item.isProRate ? "Yes" : "No"}
            </td> */}

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No Amenities Available
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>
      )}
    </>
  );
};

export default PropertyAmenities;