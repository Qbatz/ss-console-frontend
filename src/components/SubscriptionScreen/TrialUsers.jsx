import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Circle from "../../assets/menucircle.png";
import Single from "../../assets/single.png";
import Team from "../../assets/team.png";
import Location from "../../assets/locationGrey.png";
import Call from "../../assets/call.png";
import { useSubscription } from "../../Context/SubscriptionContext";
import ArrowRight from "../../assets/arrow-right.png";
import { useRole } from "../../Context/RoleContext";
import { useNavigate } from "react-router-dom";

const TrailPage = () => {
  const { adminDetails} = useRole();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [showExtendTrial, setShowExtendTrial] = useState(false);
  const [trialList, setTrialList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [searchValue, setSearchValue] = useState("");
const [filterBy, setFilterBy] = useState("ALL");

const [totalCount, setTotalCount] = useState(0);
const [totalPages, setTotalPages] = useState(0);

const [totalTrials, setTotalTrials] = useState(0);
const [activeCount, setActiveCount] = useState(0);
const [expiredCount, setExpiredCount] = useState(0);
  const menuRef = useRef(null);
  const {getTrialSubscriptions} = useSubscription();
const [loading, setLoading] = useState(false);
const [extendableTrialCount,setExtendableTrialCount] = useState(0)

 

const fetchTrialUsers = async () => {
  try {
    setLoading(true);

    const res = await getTrialSubscriptions(
      currentPage,
      pageSize,
      searchValue,
      filterBy
    );

    if (res.success) {
      setTrialList(res.data.content || []);
      setTotalCount(res.data.totalItems || 0);
      setTotalPages(res.data.totalPages || 0);

      setTotalTrials(res.data.trialPlansCount || 0);
      setActiveCount(res.data.activePropertiesCount || 0);
      setExpiredCount(res.data.expiredPropertiesCount || 0);
      setExtendableTrialCount(res.data.expandableTrialPlansCount || 0)
    }
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchTrialUsers();
}, [
  currentPage,
  pageSize,
  searchValue,
  filterBy
]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

 

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen">

        {/* Header */}
        {/* <div className="flex justify-between items-center mb-6 border-b border-gray-300">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <button className="text-blue-600 text-sm font-medium">
          Manage Plans
        </button>
      </div> */}
        <div className="border-b border-gray-200 mb-3 pb-2">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">


              <h1 className="text-lg font-semibold font-inter">
                TrailUsers
              </h1>



            </div>

            {/* RIGHT SIDE BUTTON */}
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium font-inter w-full sm:w-fit cursor-pointer" onClick={() => navigate(`/manage-plans/${adminDetails?.roleId}`)}>
              Manage Plans
            </button>

          </div>

        </div>
        {/* Cards */}
        <div className="flex gap-4 mb-4">
          <div className="bg-white border border-gray-300 rounded-lg p-4 w-64">
            <p className="text-sm text-gray-500">Active Properties</p>
            <h2 className="text-xl font-semibold">{activeCount}</h2>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-4 w-64">
            <p className="text-sm text-gray-500">Expired Properties</p>
            <h2 className="text-xl font-semibold">{expiredCount}</h2>
          </div>

           <div className="bg-white border border-gray-300 rounded-lg p-4 w-64">
            <p className="text-sm text-gray-500">Trial PlanCount</p>
            <h2 className="text-xl font-semibold">{totalTrials}</h2>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-4 w-64">
            <p className="text-sm text-gray-500">Expandable Trial PlansCount</p>
            <h2 className="text-xl font-semibold">{extendableTrialCount}</h2>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center mb-3">

          <div className="flex gap-2">
           <select
  value={filterBy}
  onChange={(e) => {
    setFilterBy(e.target.value);
    setCurrentPage(1);
  }}
  className="border border-gray-300 rounded px-3 py-1 text-sm"
>
  <option value="ALL">ALL</option>
  <option value="TRIAL">TRIAL</option>
  <option value="EXPANDABLE_TRIAL">
    EXPANDABLE TRIAL
  </option>
</select>

           
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-blue-500 text-white p-2 rounded" onClick={() => {
  setSearchValue("");
  setFilterBy("ALL");
  setCurrentPage(1);
  fetchTrialUsers();
}}>
              🔄
            </button>

          <input
  value={searchValue}
  onChange={(e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  }}
  placeholder="Search Property..."
  className="border border-gray-300 rounded px-3 py-1 text-sm"
/>
          </div>
        </div>

       
        <div className="bg-white border-soft-light rounded-2xl shadow-sm relative overflow-hidden">

         
          <div
  className="
    table-scroll
    relative
    overflow-auto
    max-h-[420px]
    rounded-2xl
  "
>

            <table className="w-full text-sm">

              {/* Sticky Header */}
              <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-[12px] font-semibold text-left">ID</th>
                 
                  <th className="px-4 py-3 text-[12px] font-semibold text-left">PROPERTY NAME</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-left">PLAN NAME</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-left">Status</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-left">START DATE</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-left">EXPRIY</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-left">ACTION</th>
                </tr>
              </thead>

             <tbody>
  {loading ? (
    [...Array(10)].map((_, index) => (
      <tr key={index} className="border-t border-gray-200 animate-pulse">
        <td className="px-4 py-3">
          <div className="h-4 w-10 bg-gray-200 rounded"></div>
        </td>

        <td className="px-4 py-3">
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </td>

        <td className="px-4 py-3">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </td>

        <td className="px-4 py-3">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </td>

        <td className="px-4 py-3">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </td>

        <td className="px-4 py-3">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </td>

        <td className="px-4 py-3">
          <div className="h-4 w-6 bg-gray-200 rounded"></div>
        </td>
      </tr>
    ))
  ) : trialList.length > 0 ? (
   trialList.map((item, index) => (
                  <tr key={index} className="border-t border-gray-300">

                    {/* <td className="px-4 py-2 text-[12px] text-left">{index + 1}</td> */}
                    <td className="px-4 py-2 text-left">
                                {(currentPage - 1) * pageSize + index + 1}
                              </td>
                    
                    <td className="px-4 py-2 text-[12px] text-left">{item.hostelName}</td>
                    <td className="px-4 py-2 text-[12px] text-left">{item.planName}</td>
                     <td className="px-4 py-2 text-left">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${item.isExpired
                                      ? "bg-red-100 text-red-600"
                                      : "bg-green-100 text-green-600"
                                    }`}
                                >
                                  {item.isExpired ? "Expired" : "Active"}
                                </span>
                              </td>
                    <td className="px-4 py-2 text-[12px] text-left">{item.planStartsAt}</td>
                    <td className="px-4 py-2 text-[12px] text-left">{item.planEndsAt}</td>

                    {/* <td className="px-4 py-2 relative" ref={openMenu === index ? menuRef : null}>
                      <img
                        src={Circle}
                        alt="Circle"
                        className="w-4 h-4 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === index ? null : index);
                        }}
                      />

                      {openMenu === index && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-[13px]">
                          <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-l-4 border-blue-500">
                            View Details
                          </p>
                          <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Extend Trial
                          </p>
                          <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Record Payment
                          </p>
                          <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Deactivate
                          </p>
                          <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                            Delete
                          </p>
                        </div>
                      )}
                    </td> */}
                    <td className="px-4 py-2 relative">
                      <div ref={openMenu === index ? menuRef : null} className="inline-block relative">
                        <img
                          src={Circle}
                          alt="Circle"
                          className="w-4 h-4 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(openMenu === index ? null : index);
                          }}
                        />

                        {openMenu === index && (
                          <div
                            className={`absolute right-0 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-[13px] text-justify 
          ${index >= trialList.length - 2 ? "bottom-full mb-2" : "top-full mt-2"}`}
                          >


                            <p
                              onClick={() => setActiveAction("view")}
                              className={`px-4 py-2 cursor-pointer rounded-t-lg
    ${activeAction === "view"
                                  ? "bg-gray-100 border-l-4 border-blue-600"
                                  : "hover:bg-blue-100"}
  `}
                            >
                              View Details
                            </p>


                            <p
                              onClick={() => {
                                setShowExtendTrial(true);
                                setOpenMenu(null);
                              }}
                              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            >
                              Extend Trial
                            </p>


                            <p
                              onClick={() => setActiveAction("payment")}
                              className={`px-4 py-2 cursor-pointer
    ${activeAction === "payment"
                                  ? "bg-gray-100 border-l-4 border-blue-600"
                                  : "hover:bg-blue-100"}
  `}
                            >
                              Record Payment
                            </p>

                            <p
                              onClick={() => setActiveAction("deactivate")}
                              className={`px-4 py-2 cursor-pointer
    ${activeAction === "deactivate"
                                  ? "bg-gray-100 border-l-4 border-blue-600"
                                  : "hover:bg-blue-100"}
  `}
                            >
                              Deactivate
                            </p>

                            <p
                              onClick={() => setActiveAction("delete")}
                              className={`px-4 py-2 cursor-pointer text-red-500 rounded-b-lg
    ${activeAction === "delete"
                                  ? "bg-gray-100 border-l-4 border-blue-600"
                                  : "hover:bg-blue-100"}
  `}
                            >
                              Delete
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
  ) : (
    <tr>
      <td
        colSpan="7"
        className="text-center py-10 text-gray-500"
      >
        No Records Found
      </td>
    </tr>
  )}
</tbody>

            </table>

          </div>
        </div>

        {showExtendTrial && (
          <div className="fixed inset-0 z-[60] w-full">

            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowExtendTrial(false)}
            ></div>


            <div className="absolute top-0 right-0 h-full w-full sm:w-[550px] bg-white shadow-2xl animate-slideIn flex flex-col">


              <div className="flex items-center justify-between px-5 py-4 ">
                <h2 className="text-[16px] font-semibold text-gray-800">
                  Extend Trial Period
                </h2>
                <button
                  onClick={() => setShowExtendTrial(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>


              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

                <div className="text-left">
                  <p className="text-[14px] font-semibold text-gray-400 mb-3">
                    PROPERTY INFO
                  </p>

                  <div className="space-y-2 text-[13px]">
                    <div className="flex gap-3">
                      <img src={Single} alt="Single" className="w-4 h-4" />
                      <span className="w-28 text-gray-400">Customer Name</span>
                      <span className="text-gray-800 font-medium">Arish Raj</span>
                    </div>

                    <div className="flex gap-3">
                      <img src={Team} alt="Team" className="w-4 h-4" />
                      <span className="w-28 text-gray-400">Property Name</span>
                      <span className="text-blue-600 font-medium">
                        Laksha Ladies Hostel
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <img src={Location} alt="Location" className="w-4 h-4" />
                      <span className="w-28 text-gray-400">Location</span>
                      <span className="text-gray-800">Sholinganallur, Chennai</span>
                    </div>

                    <div className="flex gap-3">
                      <img src={Call} alt="Call" className="w-4 h-4" />
                      <span className="w-28 text-gray-400">Mobile</span>
                      <span className="text-gray-800">+91 98843 87475</span>
                    </div>
                  </div>
                </div>


                <div className="flex items-start gap-6">

                  <div className="min-w-[120px] text-left">
                    <label className="block text-[13px] font-medium text-gray-700 leading-5">
                      Extension
                      <br />
                      Duration <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="flex-1 whitespace-nowrap">
                    <div className="flex items-center gap-8 text-[13px] text-gray-700">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="duration" className="w-4 h-4" />
                        <span>+7 Days</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="duration" className="w-4 h-4" />
                        <span>+10 Days</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="duration" className="w-4 h-4" />
                        <span>+14 Days (Max)</span>
                      </label>
                    </div>

                    <button
                      type="button"
                      className="mt-3 text-[13px] text-blue-600 font-medium"
                    >
                      Select Custom
                    </button>
                  </div>
                </div>

                {/* <div className="whitespace-nowrap">
                  <label className="block text-[13px] font-medium text-gray-700 mb-2">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select Follow-up</option>
                    <option>Sales Follow-up</option>
                    <option>Customer Request</option>
                    <option>Technical Delay</option>
                  </select>
                </div> */}

                <div className="grid grid-cols-[150px_1fr] items-center gap-4">

                  <label className="text-[13px] font-medium text-gray-700 text-left">
                    Reason <span className="text-red-500">*</span>
                  </label>

                  <select className="w-full h-[42px] border border-gray-300 rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select Follow-up</option>
                    <option>Sales Follow-up</option>
                    <option>Customer Request</option>
                    <option>Technical Delay</option>
                  </select>

                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add internal notes..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-md px-3 py-2 text-[12px] text-gray-600">
                  Maximum extension allowed is 14 days. Max 3 tries per customer.
                </div>
              </div>

              <div className=" px-5 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowExtendTrial(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  Confirm Extension
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-3 text-sm">
          <p>
            Total Record Count : <span className="text-blue-600">{trialList.length || 0}</span>
          </p>

          <div className="flex items-center gap-2">
           <select
  value={pageSize}
  onChange={(e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  }}
  className="border rounded px-2 py-1"
>
  <option value={10}>10</option>
  <option value={20}>20</option>
  <option value={50}>50</option>
  <option value={100}>100</option>
</select>

           <button
  disabled={currentPage === 1}
  onClick={() =>
    setCurrentPage((prev) => prev - 1)
  }
>
  <img src={ArrowRight} className="w-4 h-4"/>
</button>
 <span className="border px-3 py-1 rounded bg-gray-50">
                      {currentPage}
                    </span>
                    <button
  disabled={currentPage === totalPages}
  onClick={() =>
    setCurrentPage((prev) => prev + 1)
  }
>
  <img src={ArrowRight} className="w-4 h-4 scale-x-[-1]"/>
</button>
<span>
  {currentPage} - {totalPages}
</span>


          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default TrailPage;