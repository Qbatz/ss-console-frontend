import React from "react";

const PropertyAmenities = ({ hostelData }) => {

  const amenities = hostelData?.amenities || [];

  return (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[300px] overflow-auto">

  <table className="w-full text-sm text-left">

    {/* HEADER */}
    <thead className="bg-gray-100 text-gray-600 sticky top-0 z-20">
      <tr>
        <th className="px-4 py-2 bg-gray-100 uppercase">ID</th>
        <th className="px-4 py-2 bg-gray-100 uppercase">Amenity Name</th>
        <th className="px-4 py-2 bg-gray-100 uppercase">Amount</th>
        {/* <th className="px-4 py-2 bg-gray-100">Pro Rate</th> */}
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {amenities.length > 0 ? (
        amenities.map((item, index) => (
          <tr key={item.amenityId}  className="hover:bg-gray-50 border-b border-gray-300">

            <td className="px-4 py-2">
              {index + 1}
            </td>

            <td className="px-4 py-2 font-medium text-gray-800">
              {item.amenityName}
            </td>

            <td className="px-4 py-2">
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
  );
};

export default PropertyAmenities;