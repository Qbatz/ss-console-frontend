import React,{useState,useEffect} from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Search from "../../assets/Search.png";
import AddAdmin from "./AddAdmin";
import { useRole } from "../../Context/RoleContext";
import swap from "../../assets/arrowswap.png";

const users = [
  {
    name: "Arjun Kumar",
    email: "arjun.kumar5@gmail.com",
    role: "Co Admin",
    lastAction: "2025 Sep 21 14:20",
    createdOn: "2025 Oct 01",
    status: "Active",
  },
  {
    name: "Susi",
    email: "susee@gmail.com",
    role: "Support Agent",
    lastAction: "2025 Sep 21 14:20",
    createdOn: "2025 Sep 01",
    status: "Active",
  },
  {
    name: "Christopher",
    email: "christopher77@gmail.com",
    role: "Support Agent",
    lastAction: "2025 Sep 21 14:20",
    createdOn: "2025 Aug 21",
    status: "Active",
  },
  {
    name: "Priya Rahul",
    email: "priya95@gmail.com",
    role: "Billing Manager",
    lastAction: "2025 Sep 22 09:40",
    createdOn: "2025 Feb 21",
    status: "Active",
  },
];

const IamAdminUser = () => {
  const { getAdminDetails,loading,agents,getAllAgents} = useRole();
 
  const [admin, setAdmin] = useState(null);
  const [open, setOpen] = useState(false);
console.log("agents",agents)

useEffect(()=>{
getAllAgents()
},[])
  useEffect(() => {
    const fetchAdmin = async () => {
      const res = await getAdminDetails();

      if (res.success) {
        setAdmin(res.data);
      } else {
        console.log(res.message);
      }
    };

    fetchAdmin();
  }, []);
  console.log("admin",admin)
  const adminList = Array.isArray(admin) ? admin : [admin];

  return (
    <DashboardLayout>
      <div className="w-full px-4 md:px-6  space-y-6">

       
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b  border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            IAM- Admin User
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Recent Activity
            </button>

            <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"   onClick={() => setOpen(true)}>
              + Add Admin User
            </button>
          </div>
        </div>

        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <select className="border  border-gray-200 rounded-lg px-3 py-2 text-sm bg-white w-full md:w-auto">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border  border-gray-200 rounded-lg pl-4 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
             <img src={Search} alt="Search"
              className="w-4 h-4 object-contain"/>
            </span>
          </div>
        </div>

        {/* Table Section */}
<div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm relative">

  {loading && (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )}

  {/* ⭐ Fixed height container */}
  <div className="max-h-[400px] overflow-y-auto">

    <table className="min-w-full text-sm">

      {/* Header */}
      <thead className="bg-[#F8F9FF] text-xs font-semibold text-gray-500 sticky top-0 z-10">
        <tr>
          {/* <th className="px-6 py-3 text-left">NAME</th> */}
           <th className="px-4 py-3 text-left whitespace-nowrap">
                <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
                  NAME
                  <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                </div>
              </th>
               <th className="px-2 py-3 text-left whitespace-nowrap">
                <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
                  EMAIL
                  <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                </div>
              </th>
             <th className="px-2 py-3 text-left whitespace-nowrap">
                <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter">
                  Role
                  <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                </div>
              </th>
             <th className="px-2 py-3 text-left">
                <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter whitespace-nowrap">
                  LAST ACTION
                  <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                </div>
              </th>
            {/* <th className="px-2 py-3 text-left">
                <div className="flex items-center gap-1 font-semibold text-[12px] uppercase text-[#6B7280] font-inter whitespace-nowrap">
                CREATED ON
                  <img src={swap} alt="sort" className="w-3 h-3 opacity-70" />
                </div>
              </th> */}
        
          {/* <th className="px-2 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">STATUS</th> */}
          <th className="px-2 py-3 text-left font-semibold text-[12px] uppercase text-[#6B7280] font-inter">ACTIONS</th>
        </tr>
      </thead>

      <tbody>
        {agents?.length > 0 ? (
          agents.map((user, index) => (
            <tr
              key={index}
              className="border-b last:border-0 hover:bg-gray-50 border-gray-300"
            >
              <td className="px-4 py-1 text-left font-medium text-[12px] whitespace-nowrap">
                {user?.fullName}
              </td>

              <td className="px-2 py-1 text-left font-medium text-[12px] whitespace-nowrap">
                {user?.email}
              </td>

              <td className="px-2 py-1 text-left font-medium text-[12px] whitespace-nowrap">
                {user?.roleName || "N/A"}
              </td>

              <td className="px-2 py-1 text-left font-medium text-[12px] whitespace-nowrap">
                {user?.lastActiveDate} {user?.lastActiveTime}
              </td>

              {/* <td className="px-2 py-2 text-left font-medium text-[12px] whitespace-nowrap">
                {user?.createdDate || "-"}
              </td> */}

              {/* <td className="px-2 py-4">
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Active
                </span>
              </td> */}

              <td className="px-1 py-4 text-gray-500 cursor-pointer">
                ⋮
              </td>
            </tr>
          ))
        ) : (
          !loading && (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-400">
                No Admin Found
              </td>
            </tr>
          )
        )}
      </tbody>

    </table>
  </div>
</div>




      </div>
      <AddAdmin isOpen={open} onClose={() => setOpen(false)} />

    </DashboardLayout>
  );
};

export default IamAdminUser;
