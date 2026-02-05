import React,{useState} from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Search from "../../assets/Search.png";
import AddAdmin from "./AddAdmin";

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
  const [open, setOpen] = useState(false);
  return (
    <DashboardLayout>
      <div className="w-full px-4 md:px-6  space-y-6">

       
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
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
          <select className="border rounded-lg px-3 py-2 text-sm bg-white w-full md:w-auto">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border rounded-lg pl-4 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
             <img src={Search} alt="Search"
              className="w-4 h-4 object-contain"/>
            </span>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">

          <div className="overflow-x-auto">

            {/* Table Header */}
            <div className="min-w-[900px] grid grid-cols-7 bg-gray-50 text-xs font-semibold text-gray-500 px-6 py-3 border-b">
              <div>NAME</div>
              <div>EMAIL</div>
              <div>ROLE</div>
              <div>LAST ACTION</div>
              <div>CREATED ON</div>
              <div>STATUS</div>
              <div className="text-right">ACTIONS</div>
            </div>

            {/* Table Rows */}
            {users.map((user, index) => (
              <div
                key={index}
                className="min-w-[900px] grid grid-cols-7 px-6 py-4 text-sm border-b last:border-b-0 items-center hover:bg-gray-50 transition"
              >
                <div className="text-blue-600 font-medium cursor-pointer">
                  {user.name}
                </div>

                <div className="text-gray-600 truncate">
                  {user.email}
                </div>

                <div>{user.role}</div>

                <div>{user.lastAction}</div>

                <div>{user.createdOn}</div>

                <div>
                  <span className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {user.status}
                  </span>
                </div>

                <div className="text-right cursor-pointer text-gray-500 hover:text-gray-700">
                  ⋮
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
      <AddAdmin isOpen={open} onClose={() => setOpen(false)} />

    </DashboardLayout>
  );
};

export default IamAdminUser;
