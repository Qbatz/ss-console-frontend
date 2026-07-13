import React, { useState, useRef, useEffect } from "react";

const RoomView = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = (key, e) => {
    if (openMenu === key) {
      setOpenMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 160,
    });
    setOpenMenu(key);
  };

  const MenuButton = ({ menuKey }) => (
    <div className="flex justify-center">
      <button
        onClick={(e) => handleMenuToggle(menuKey, e)}
        className="text-gray-400 hover:text-gray-700 text-xl px-2 py-1 rounded hover:bg-gray-100"
      >
        ⋮
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto relative">
      <table className="w-full min-w-[1200px] border-collapse text-sm">
        <thead>
          <tr className="bg-[#F8FAFC] text-xs font-semibold text-[#667085]">
            <th className="sticky left-0 z-30 bg-[#F8FAFC] px-4 py-3 text-left border border-gray-100 min-w-[160px]">
              FLOOR
            </th>
            <th className="px-4 py-3 text-left border border-gray-100 min-w-[130px]">
              ROOM
            </th>
            <th className="px-4 py-3 text-left border border-gray-100 min-w-[130px]">
              INVOICE NO
            </th>
            <th className="px-4 py-3 text-left border border-gray-100 min-w-[220px]">
              NAME
            </th>
            <th className="px-4 py-3 text-left border border-gray-100 min-w-[150px]">
              INVOICE DATE
            </th>
            <th className="px-4 py-3 text-left border border-gray-100 min-w-[150px]">
              DUE DATE
            </th>
            <th className="px-4 py-3 text-left border border-gray-100 min-w-[110px]">
              AMOUNT
            </th>
            <th className="sticky right-0 z-30 bg-[#F8FAFC] px-4 py-3 text-center border border-gray-100 min-w-[90px]">
              ACTION
            </th>
          </tr>
        </thead>

        <tbody>
          
          <tr className="hover:bg-[#F9FAFB]">
            <td
              rowSpan={5}
              className="sticky left-0 z-20 bg-white border border-gray-100 px-4 py-3 align-middle font-medium text-gray-700"
            >
              Ground Floor
            </td>
            <td rowSpan={3} className="border border-gray-100 px-4 py-3 align-middle text-gray-600">
              Room 001
            </td>
            <td className="border border-gray-100 px-4 py-3 text-[#3158F5] font-medium">ADV-002</td>
            <td className="border border-gray-100 px-4 py-3 whitespace-nowrap text-gray-800">Arun Kumar</td>
            <td className="border border-gray-100 px-4 py-3 text-gray-600">18 Jul 2025</td>
            <td className="border border-gray-100 px-4 py-3 text-gray-600">18 Jul 2025</td>
            <td rowSpan={3} className="border border-gray-100 px-4 py-3 text-center align-middle font-semibold text-gray-800">
              ₹600
            </td>
            <td className="sticky right-0 z-20 bg-white border border-gray-100 px-4 py-3">
              <MenuButton menuKey="arun" />
            </td>
          </tr>

       
          <tr className="hover:bg-[#F9FAFB]">
            <td className="border border-gray-100 px-4 py-3 text-[#3158F5] font-medium">INV-002</td>
            <td className="border border-gray-100 px-4 py-3 whitespace-nowrap text-gray-800">Karthik Raj</td>
            <td className="border border-gray-100 px-4 py-3 text-gray-600">18 Jul 2025</td>
            <td className="border border-gray-100 px-4 py-3 text-gray-600">18 Jul 2025</td>
            <td className="sticky right-0 z-20 bg-white border border-gray-100 px-4 py-3">
              <MenuButton menuKey="karthik" />
            </td>
          </tr>

         
          <tr className="hover:bg-[#F9FAFB]">
            <td className="border border-gray-100 px-4 py-3 text-[#3158F5] font-medium">ADV-003</td>
            <td className="border border-gray-100 px-4 py-3 whitespace-nowrap text-gray-800">Rahul Das</td>
            <td className="border border-gray-100 px-4 py-3 text-gray-600">18 Jul 2025</td>
            <td className="border border-gray-100 px-4 py-3 text-gray-600">18 Jul 2025</td>
            <td className="sticky right-0 z-20 bg-white border border-gray-100 px-4 py-3">
              <MenuButton menuKey="rahul" />
            </td>
          </tr>

        
          <tr className="hover:bg-[#F9FAFB]">
            <td rowSpan={2} className="border border-gray-100 px-4 py-3 align-middle text-gray-600">
              Room 002
            </td>
            <td className="border border-gray-100 px-4 py-3 text-[#3158F5] font-medium">INV-001</td>
            <td className="border border-gray-100 px-4 py-3 whitespace-nowrap text-gray-800">Nolan Calzoni</td>
            <td className="border border-gray-100 px-4 py-3 text-gray-600">18 Jul 2025</td>
            <td className="border border-gray-100 px-4 py-3 text-gray-600">18 Jul 2025</td>
            <td rowSpan={2} className="border border-gray-100 px-4 py-3 text-center align-middle font-semibold text-gray-800">
              ₹600
            </td>
            <td className="sticky right-0 z-20 bg-white border border-gray-100 px-4 py-3">
              <MenuButton menuKey="nolan" />
            </td>
          </tr>

       
          <tr className="hover:bg-[#F9FAFB]">
            <td className="border border-gray-100 px-4 py-3 text-[#3158F5] font-medium">ADV-002</td>
            <td className="border border-gray-100 px-4 py-3 whitespace-nowrap text-gray-800">Alfredo Press</td>
            <td className="border border-gray-100 px-4 py-3 text-gray-600">18 Jul 2025</td>
            <td className="border border-gray-100 px-4 py-3 text-gray-600">18 Jul 2025</td>
            <td className="sticky right-0 z-20 bg-white border border-gray-100 px-4 py-3">
              <MenuButton menuKey="alfredo" />
            </td>
          </tr>
        </tbody>
      </table>

    
      {openMenu && (
        <div
          ref={menuRef}
          className="fixed bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] min-w-[100px] py-1"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <button
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpenMenu(null)}
          >
            Recalculation
          </button>
          <button
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpenMenu(null)}
          >
            View Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomView;
