import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Toast from "../SuccessModal/ToastDesign";
import {
  ShieldCheck,
  Clock3,
  ShieldOff,
  Zap,
  Search,
  Eye,
  EyeOff,
  MoreHorizontal,
  RefreshCw,Copy, Check
} from "lucide-react";
import Circle from "../../assets/menucircle.png";

import { useServiceToken } from "../../Context/ServiceTokenContext";

const ServiceTokens = () => {
  const {
    getServiceTokens,
    loading,
    accessError,getServiceTokenServices,generateServiceToken,regenerateServiceToken,revokeServiceToken,getServiceTokenByService
  } = useServiceToken();

 

  const searchTimer = useRef(null);

 

  const [tokens, setTokens] = useState([]);

  const [copiedToken, setCopiedToken] = useState(false);

  const [activeCount, setActiveCount] =
    useState(0);

  const [expiringSoonCount, setExpiringSoonCount] =
    useState(0);
    const [showViewDrawer, setShowViewDrawer] = useState(false);
const [selectedToken, setSelectedToken] = useState(null);
const [viewLoading, setViewLoading] = useState(false);
const [copiedField, setCopiedField] = useState("");
  const [expiredCount, setExpiredCount] =
    useState(0);
    const handleCopyToken = async () => {
  if (!revokeToken?.authToken) return;

  await navigator.clipboard.writeText(revokeToken.authToken);

  setCopiedToken(true);

  setTimeout(() => {
    setCopiedToken(false);
  }, 1500);
};

  const [totalCount, setTotalCount] =
    useState(0);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [modalMode, setModalMode] =
  useState("generate");

const [selectedService, setSelectedService] = useState("");

 const [serviceList, setServiceList] = useState([]);
 const [showRevokeModal, setShowRevokeModal] = useState(false);
const [revokeToken, setRevokeToken] = useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalItems, setTotalItems] =
    useState(0);

  const [pageSize, setPageSize] =
    useState(10);
  const [openMenu, setOpenMenu] = useState(null);
const [menuPosition, setMenuPosition] = useState({
  top: 0,
  left: 0,
});

  const [search, setSearch] =
    useState("");

  

  const [status, setStatus] =
    useState("ALL");

  

  const [statusFilters, setStatusFilters] =
    useState([]);
    const [modalType, setModalType] = useState("success");
      const [showSuccess, setShowSuccess] = useState(false);
      const [message, setMessage] = useState("");
useEffect(() => {
  const handleClickOutside = () => {
    setOpenMenu(null);
  };

  if (openMenu !== null) {
    document.addEventListener(
      "click",
      handleClickOutside
    );
  }

  return () => {
    document.removeEventListener(
      "click",
      handleClickOutside
    );
  };
}, [openMenu]);
  

  const [activeTab, setActiveTab] =
    useState("ALL");

  

  const [showToken, setShowToken] =
    useState({});



  const loadServiceTokens = async (
    page = 1,
    size = pageSize,
    searchName = search || null,
    selectedStatus = status
  ) => {
    const result = await getServiceTokens(
      page,
      size,
      searchName,
      selectedStatus
    );

    if (result?.success) {
      const data = result?.data;

      console.log(
        "SERVICE TOKEN DATA:",
        data
      );

      // ================================
      // TOKEN DATA
      // ================================

      setTokens(
        data?.serviceTokens || []
      );

      // ================================
      // COUNTS
      // ================================

      setActiveCount(
        data?.activeCount || 0
      );

      setExpiringSoonCount(
        data?.expiringSoonCount || 0
      );

      setExpiredCount(
        data?.expiredCount || 0
      );

      setTotalCount(
        data?.totalCount || 0
      );

      // ================================
      // PAGINATION
      // ================================

      setCurrentPage(
        data?.currentPage || page
      );

      setTotalPages(
        data?.totalPages || 1
      );

      setTotalItems(
        data?.totalItems || 0
      );

      setPageSize(
        data?.pageSize || size
      );

      // ================================
      // DYNAMIC STATUS FILTERS
      // ================================

      setStatusFilters(
        data?.expiryStatusFilters || []
      );
    } else {
      setTokens([]);
      setTotalItems(0);
      setTotalPages(1);
    }
  };

  

  useEffect(() => {
    loadServiceTokens(
      1,
      pageSize,
      null,
      "ALL"
    );
  }, []);

  

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

   
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

   
    searchTimer.current = setTimeout(() => {
      loadServiceTokens(
        1,
        pageSize,
        value || null,
        status
      );
    }, 500);
  };

  

  useEffect(() => {
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);

  

  const handleTabChange = (filterName) => {
    setActiveTab(filterName);
    setStatus(filterName);

   

    loadServiceTokens(
      1,
      pageSize,
      search || null,
      filterName
    );
  };

  

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      loading
    ) {
      return;
    }

    setCurrentPage(page);

    loadServiceTokens(
      page,
      pageSize,
      search || null,
      status
    );
  };

  

  const toggleToken = (key) => {
    setShowToken((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

 

  const maskValue = (value) => {
    if (!value) return "—";

    if (value.length <= 12) {
      return "••••••••";
    }

    return `${value.substring(
      0,
      6
    )}••••••••${value.substring(
      value.length - 4
    )}`;
  };

 
  const getStatusStyle = (
    expiryStatus
  ) => {
    switch (expiryStatus) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-600";

      case "EXPIRING_SOON":
        return "bg-orange-50 text-orange-600";

      case "EXPIRED":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  

  const getStatusDot = (
    expiryStatus
  ) => {
    switch (expiryStatus) {
      case "ACTIVE":
        return "bg-emerald-500";

      case "EXPIRING_SOON":
        return "bg-orange-500";

      case "EXPIRED":
        return "bg-red-500";

      default:
        return "bg-gray-400";
    }
  };

  

  const getStatusLabel = (
    expiryStatus
  ) => {
    switch (expiryStatus) {
      case "ACTIVE":
        return "Active";

      case "EXPIRING_SOON":
        return "Expiring Soon";

      case "EXPIRED":
        return "Expired";

      default:
        return "Active";
    }
  };

  

  const stats = [
     {
      title: "Total Services",
      value: totalCount,
      icon: Zap,
      iconClass:
        "bg-blue-50 text-blue-500",
    },
    {
      title: "Active Tokens",
      value: activeCount,
      icon: ShieldCheck,
      iconClass:
        "bg-emerald-50 text-emerald-500",
    },

    {
      title: "Expiring Soon",
      value: expiringSoonCount,
      icon: Clock3,
      iconClass:
        "bg-orange-50 text-orange-500",
    },

    {
      title: "Expired",
      value: expiredCount,
      icon: ShieldOff,
      iconClass:
        "bg-red-50 text-red-500",
    },

   
  ];

  

  const renderLoaderRows = () => {
    return Array.from({
      length: 5,
    }).map((_, index) => (
      <tr
        key={index}
        className="h-[58px] border-t border-gray-100"
      >
        {Array.from({
          length: 6,
        }).map((_, column) => (
          <td
            key={column}
            className="px-3"
          >
            <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
          </td>
        ))}
      </tr>
    ));
  };


const handleRegenerateClick = async (item) => {
  if (!item) return;

  setOpenMenu(null);
  setModalMode("regenerate");

  const serviceName = item.service;

 
  const result = await getServiceTokenServices();

  if (result?.success) {
    const services = result.data || [];

   
    const exists = services.some(
      (service) => service.service === serviceName
    );

    if (!exists) {
      services.push({
        service: serviceName,
      });
    }

    setServiceList(services);
  }

  // Selected service
  setSelectedService(serviceName);

  // Open popup
  setShowGenerateModal(true);
};

const handleGenerateToken = async () => {
  if (!selectedService) return;

  let result;

  if (modalMode === "regenerate") {
    result = await regenerateServiceToken(
      selectedService
    );
  } else {
    result = await generateServiceToken(
      selectedService
    );
  }

  if (result?.success) {
    setModalType("success");

    setMessage(
      result?.message ||
      result?.data?.message ||
      "Token generated successfully"
    );

    setShowSuccess(true);

   
    setSelectedService("");
    setModalMode("generate");

    await loadServiceTokens(
      1,
      pageSize,
      search || null,
      status
    );

    setTimeout(() => {
      setShowSuccess(false);
       setShowGenerateModal(false);
    }, 1000);
  } else {
    setModalType("error");

    setMessage(
      result?.message ||
      result?.data?.message ||
      "Token generation failed"
    );

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1000);
  }
};
const handleRevokeClick = (item) => {
  if (!item) return;

  setOpenMenu(null);

  setRevokeToken(item);

  setShowRevokeModal(true);
};
const handleConfirmRevoke = async () => {
  if (!revokeToken?.service) return;

  const result = await revokeServiceToken(
    revokeToken.service
  );

  if (result?.success) {
    setShowRevokeModal(false);
    setRevokeToken(null);
    setOpenMenu(null);

    setModalType("success");
    setMessage(
      result?.message ||
        "Token revoked successfully"
    );
    setShowSuccess(true);

    await loadServiceTokens(
      1,
      pageSize,
      search || null,
      status
    );

    setTimeout(() => {
      setShowSuccess(false);
    }, 1000);
  } else {
    setModalType("error");
    setMessage(
      result?.message ||
        "Token revoke failed"
    );
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1000);
  }
};
const handleCopy = async (value, field) => {
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);

    setCopiedField(field);

    setTimeout(() => {
      setCopiedField("");
    }, 1500);
  } catch (error) {
    console.error("Copy failed:", error);
  }
};
const handleViewToken = async (item) => {
  if (!item?.service) return;

  setShowViewDrawer(true);
  setSelectedToken(null);
  setViewLoading(true);

  const result = await getServiceTokenByService(
    item.service
  );

  if (result?.success) {
    setSelectedToken(result.data);
  }

  setViewLoading(false);
};
  return (
    <DashboardLayout>
      <Toast
                    show={showSuccess}
                    message={message}
                    type={modalType}
      
                  />
      <div className="min-h-screen bg-[#f8fafc] px-6 py-7">

       

        <div className="mb-5 flex items-start justify-between">

          <div>
            <h1 className="text-left text-[26px] font-semibold leading-8 text-[#202733]">
              Service Tokens
            </h1>

            <p className="mt-1 text-[13px] text-gray-400">
              Manage secure credentials used by
              SmartStay services.
            </p>
          </div>

          <button
            type="button"
 onClick={async () => {
  setShowGenerateModal(true);
  setSelectedService("");

  const result =
    await getServiceTokenServices();

  if (result?.success) {
    setServiceList(result.data || []);
  }
}}
            className="flex items-center gap-2 rounded-md bg-[#2455e6] px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:bg-[#1e49ca] cursor-pointer"
          >
            <span className="text-[17px]">
              +
            </span>

            Generate Token
          </button>
        </div>

        {/* ================= STATS ================= */}

        <div className="mb-4 grid grid-cols-4 gap-4">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex h-[86px] items-center justify-between rounded-lg border border-gray-100 bg-white px-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
              >

                <div>
                  <p className="text-[11px] text-gray-400">
                    {item.title}
                  </p>

                  {loading ? (
                    <div className="mt-2 h-7 w-8 animate-pulse rounded bg-gray-100" />
                  ) : (
                    <p className="mt-2 text-[22px] font-semibold text-[#29313d]">
                      {item.value}
                    </p>
                  )}
                </div>

                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-md ${item.iconClass}`}
                >
                  <Icon
                    size={14}
                    strokeWidth={2}
                  />
                </div>

              </div>
            );
          })}

        </div>

        {/* ================= MAIN CARD ================= */}

        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]">

          {/* ================= TABS ================= */}

          <div className="flex h-[37px] items-center border-b border-gray-100 px-4">

           

            <button
              type="button"
              onClick={() =>
                handleTabChange("ALL")
              }
              className={`relative mr-7 flex h-full items-center gap-1 text-[12px] ${
                activeTab === "ALL"
                  ? "font-medium text-[#2455e6]"
                  : "text-gray-400"
              }`}
            >
              All Tokens

             

              {activeTab === "ALL" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#2455e6]" />
              )}
            </button>

         

            {statusFilters.map(
              (filter) => {

                let count = 0;

                if (
                  filter.name ===
                  "ACTIVE"
                ) {
                  count = activeCount;
                }

                if (
                  filter.name ===
                  "EXPIRING_SOON"
                ) {
                  count =
                    expiringSoonCount;
                }

                if (
                  filter.name ===
                  "EXPIRED"
                ) {
                  count = expiredCount;
                }

                return (
                  <button
                    key={filter.name}
                    type="button"
                    onClick={() =>
                      handleTabChange(
                        filter.name
                      )
                    }
                    className={`relative mr-7 flex h-full items-center gap-1 text-[12px] ${
                      activeTab ===
                      filter.name
                        ? "font-medium text-[#2455e6]"
                        : "text-gray-400"
                    }`}
                  >
                    {filter.label}

                    

                    {activeTab ===
                      filter.name && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#2455e6]" />
                    )}
                  </button>
                );
              }
            )}

          </div>

     

          <div className="flex h-[47px] items-center justify-between border-b border-gray-100 px-4">

            <div className="flex items-center gap-2">


              <div className="relative">

                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search service..."
                  className="h-[25px] w-[220px] rounded-md border border-gray-200 pl-8 pr-2 text-[10px] outline-none placeholder:text-gray-400 focus:border-blue-300"
                />

              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={() =>
                  loadServiceTokens(
                    currentPage,
                    pageSize,
                    search || null,
                    status
                  )
                }
                disabled={loading}
                className="flex h-[25px] w-[25px] items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50"
              >
                <RefreshCw
                  size={12}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>

            </div>

            <span className="text-[9px] text-gray-400">
              {totalItems} tokens
            </span>

          </div>

          

      <div className="max-h-[320px] overflow-x-auto overflow-y-auto">

  <table className="w-full table-fixed">

    <thead className="sticky top-0 z-10">
      <tr className="h-[32px] bg-[#fafbfc] text-left text-[12px]">

        <th className="w-[16%] px-3 font-medium uppercase tracking-wide text-gray-400">
          Service
        </th>

        <th className="w-[15%] px-3 font-medium uppercase tracking-wide text-gray-400">
          Auth Token
        </th>

        <th className="w-[15%] px-3 font-medium uppercase tracking-wide text-gray-400">
          Secret Value
        </th>

        <th className="w-[13%] px-3 font-medium uppercase tracking-wide text-gray-400">
          Status
        </th>

        <th className="w-[12%] px-3 font-medium uppercase tracking-wide text-gray-400">
          Expires On
        </th>

        <th className="w-[9%] px-3 font-medium uppercase tracking-wide text-gray-400">
          Actions
        </th>

      </tr>
    </thead>

              <tbody>

               

                {loading ? (
                  renderLoaderRows()
                ) : tokens.length === 0 ? (

                 

                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center"
                    >
                      <div className="text-[12px] text-gray-400">
                        No service tokens
                        found
                      </div>
                    </td>
                  </tr>

                ) : (

                  

                  tokens.map(
                    (item, index) => (
                      <tr
                        key={`${item.service}-${index}`}
                        className="h-[58px] border-t border-gray-100 bg-white hover:bg-gray-50"
                      >

                       

                        <td className="px-3 text-left ">

                          <div className="flex items-center gap-2">

                            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-[#f4f7ff] text-[#3564dc]">
                              <ShieldCheck
                                size={13}
                              />
                            </div>

                            <div>
                              <p className="text-[12px] font-semibold capitalize text-[#303846]">
                                {item.service ||
                                  "—"}
                              </p>

                              {item.expiryStatus ===
                                "EXPIRING_SOON" && (
                                <p className="mt-0.5 text-[10px] text-orange-500 text-left">
                                  ● Renewal
                                  required
                                </p>
                              )}
                            </div>

                          </div>

                        </td>


<td className="px-3 text-left">
  <div className="flex items-center gap-1">

    <span
      title={item.authToken}
      className="max-w-[210px] truncate font-mono text-[12px] text-gray-500"
    >
      {showToken[`auth-${index}`]
        ? item.authToken
        : maskValue(item.authToken)}
    </span>

    {item.authToken && (
      <button
        type="button"
        title="Copy Auth Token"
        onClick={(e) => {
          e.stopPropagation();
          handleCopy(
            item.authToken,
            `auth-${index}`
          );
        }}
        className="shrink-0 p-0 text-gray-400 hover:text-[#2455e6] cursor-pointer"
      >
        {copiedField === `auth-${index}` ? (
          <Check
            size={13}
            className="text-green-500"
          />
        ) : (
          <Copy size={13} />
        )}
      </button>
    )}

  </div>
</td>

                        

                       <td className="px-3 text-left">
  <div className="flex min-w-0 items-center gap-2">

    <span
      title={item.secretValue}
      className="block min-w-0 flex-1 truncate font-mono text-[12px] text-gray-500 cursor-pointer"
    >
      {showToken[`secret-${index}`]
        ? item.secretValue
        : maskValue(item.secretValue)}
    </span>

   

  </div>
</td>

                       

                      <td className="px-3 text-left">
  <span
    className={`rounded-full px-2 py-1 text-[10px] font-medium ${
      item.expiryStatus === "ACTIVE"
        ? "bg-green-50 text-green-600"
        : item.expiryStatus === "EXPIRING_SOON"
        ? "bg-orange-50 text-orange-600"
        : item.expiryStatus === "EXPIRED"
        ? "bg-red-50 text-red-600"
        : "bg-gray-50 text-gray-500"
    }`}
  >
    {item.expiryStatus || "N/A"}
  </span>
</td>

                        {/* EXPIRY */}

                        <td className="px-3 text-left">

                          {item.expiryAtDate ? (
                            <div>
                              <p
                                className={`text-[11px] ${
                                  item.expiryStatus ===
                                  "EXPIRED"
                                    ? "text-red-500"
                                    : item.expiryStatus ===
                                      "EXPIRING_SOON"
                                    ? "font-medium text-orange-500"
                                    : "text-gray-500"
                                }`}
                              >
                                {
                                  item.expiryAtDate
                                }
                              </p>

                              <p className="mt-0.5 text-[10px] text-gray-400">
                                {
                                  item.expiryAtTime
                                }
                              </p>
                            </div>
                          ) : (
                            <span className="text-[9px] text-gray-400">
                              —
                            </span>
                          )}

                        </td>

                        {/* ACTIONS */}

   <td className="px-3">
  <div className="flex items-center gap-2 text-gray-400">

   

   
    <button
      type="button"
      title="More"
      onClick={(e) => {
        e.stopPropagation();

        const rect =
          e.currentTarget.getBoundingClientRect();

        const menuWidth = 150;
        const menuHeight = 150;

        let left = rect.right - menuWidth;
        let top = rect.bottom + 8;

        // Right side overflow
        if (left < 8) {
          left = 8;
        }

        if (
          left + menuWidth >
          window.innerWidth - 8
        ) {
          left =
            window.innerWidth -
            menuWidth -
            8;
        }

        // Bottom overflow → மேலே காட்டும்
        if (
          top + menuHeight >
          window.innerHeight - 8
        ) {
          top =
            rect.top -
            menuHeight -
            8;
        }

        // Top overflow safety
        if (top < 8) {
          top = 8;
        }

        setMenuPosition({
          top,
          left,
        });

        setOpenMenu(
          openMenu === index ? null : index
        );
      }}
      className="hover:text-gray-700"
    >
      <img src={Circle} className="w-5 h-5 cursor-pointer"/>
    </button>

  </div>
</td>

                      </tr>
                    )
                  )
                )}

              </tbody>
            </table>
            {openMenu !== null && (
  <div
    className="fixed z-[99999] w-[150px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
    style={{
      top: `${menuPosition.top}px`,
      left: `${menuPosition.left}px`,
    }}
    onClick={(e) =>
      e.stopPropagation()
    }
  >

    {/* VIEW */}
    <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();

    const selectedItem = tokens[openMenu];

    console.log("VIEW CLICK ITEM:", selectedItem);

    if (!selectedItem) return;

    setOpenMenu(null);
    handleViewToken(selectedItem);
  }}
  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[12px] text-gray-600 hover:bg-gray-50"
>
  <Eye
    size={15}
    className="text-gray-400"
  />
  <span>View</span>
</button>

    {/* REGENERATE */}
   <button
  type="button"
  onClick={() =>
    handleRegenerateClick(
      tokens[openMenu]
    )
  }
  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[12px] text-orange-500 hover:bg-orange-50"
>
  <RefreshCw
    size={15}
    className="text-orange-500"
  />

  <span>Regenerate</span>
</button>

    {/* REVOKE */}
    <button
  type="button"
  onClick={() => {
    handleRevokeClick(tokens[openMenu]);
  }}
  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[12px] text-red-500 hover:bg-red-50"
>
  <ShieldOff
    size={15}
    className="text-red-500"
  />

  <span>Revoke</span>
</button>

  </div>
)}
          </div>

          

          {!loading && totalItems > 0 && (
  <div className="flex h-[58px] items-center justify-between border-t border-gray-100 px-5">

    

    <div className="text-gray-800">
      {/* Total Record Count :
      <span className="ml-1 text-[#2455e6]">
        {tokens?.length}
      </span> */}
        <span className="text-muted">
                  Total Record Count :{" "}
                  <span className="text-primary">
                    {/* {pageSize} */}
                    {/* {hostels?.totalHostels} */}
                    {tokens?.length || 0}
                  </span>
                </span>
    </div>


   
    <div className="flex items-center gap-4">

      

      <select
        value={pageSize}
        onChange={(e) => {
          const newSize = Number(e.target.value);

          setPageSize(newSize);
          setCurrentPage(1);

          loadServiceTokens(
            1,
            newSize,
            search,
            status
          );
        }}
       className="border rounded-md px-2 py-1 text-sm cursor-pointer"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>


      

      <button
        type="button"
        disabled={
          currentPage === 1 || loading
        }
        onClick={() =>
          handlePageChange(currentPage - 1)
        }
        className="
          text-[24px]
          text-gray-300
          disabled:cursor-not-allowed
        "
      >
        ‹
      </button>


     

      <button
        type="button"
       className="
    border
    border-borderSoft
    px-3
    py-1
    rounded-card
    bg-cardBg
    text-cardTitle
    font-medium
  "
      >
        {currentPage}
      </button>


      {/* RANGE */}

      <span className="text-textDark/60 text-cardTitle">
       {currentPage} - {totalPages}
      </span>


      {/* NEXT */}

      <button
        type="button"
        disabled={
          currentPage >= totalPages || loading
        }
        onClick={() =>
          handlePageChange(currentPage + 1)
        }
        className="
          text-[24px]
          text-gray-800
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        ›
      </button>

    </div>
  </div>
)}

        </div>

        

      </div>
{showGenerateModal && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4"
    onClick={() => {
      setShowGenerateModal(false);
      setSelectedService("");
    }}
  >
    {/* POPUP */}
    <div
      className="w-full max-w-[500px] overflow-hidden rounded-lg bg-white shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">

        <div className="flex items-start gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-[#2455e6]">
            <ShieldCheck size={17} />
          </div>

          <div>
            <h2 className="text-[14px] font-semibold text-[#202733]">
  {modalMode === "regenerate"
    ? "Regenerate Service Token"
    : "Generate Service Token"}
</h2>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Create a secure credential for a SmartStay backend service.
            </p>
          </div>

        </div>

        {/* CLOSE */}
        <button
          type="button"
          onClick={() => {
            setShowGenerateModal(false);
            setSelectedService("");
          }}
          className="text-xl text-gray-400 hover:text-gray-700"
        >
          ×
        </button>

      </div>

      {/* BODY */}
      <div className="px-5 py-5">

        <label className="mb-2 block text-[11px] font-medium text-[#303846] text-left">
          Service Name
          <span className="ml-1 text-red-500">*</span>
        </label>

     <select
  value={selectedService}
  onChange={(e) =>
    setSelectedService(e.target.value)
  }
  disabled={modalMode === "regenerate"}
  className="h-[40px] w-full rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-700 outline-none focus:border-[#2455e6] disabled:cursor-not-allowed disabled:bg-gray-50"
>
  <option value="">
    Select service
  </option>

  {serviceList.map((item, index) => (
    <option
      key={index}
      value={item.service}
    >
      {item.service}
    </option>
  ))}
</select>

      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">

        <button
          type="button"
          onClick={() => {
            setShowGenerateModal(false);
            setSelectedService("");
          }}
          className="rounded-md border border-gray-200 bg-white px-4 py-2 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>

       <button
  type="button"
  disabled={!selectedService || loading}
  onClick={handleGenerateToken}
  className="rounded-md bg-[#2455e6] px-4 py-2 text-[11px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
>
  {loading ? "Generating..." : "Generate Token"}
</button>

      </div>

    </div>
  </div>
)}
{showRevokeModal && revokeToken && (
  <div
    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 px-4"
    onClick={() => setShowRevokeModal(false)}
  >
    <div
      className="w-full max-w-[550px] rounded-lg bg-white p-10 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div className="flex items-center gap-4">

        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-red-50">
          <ShieldOff
            size={25}
            className="text-red-500"
          />
        </div>

        <h2 className="text-[22px] font-semibold text-[#202733]">
          Revoke Service Token?
        </h2>

      </div>

      {/* DESCRIPTION */}
      <p className="mt-7 text-[16px] leading-7 text-gray-400">
        This token will immediately stop working.
        Existing service requests using this
        credential will be rejected.
      </p>

      {/* TOKEN DETAILS */}
      <div className="mt-7 rounded-xl bg-[#f8f9fa] px-5 py-4">

        <div className="flex items-center justify-between">
          <span className="text-[15px] text-gray-400">
            Service
          </span>

          <span className="text-[15px] font-semibold text-[#303846]">
            {revokeToken.service || "—"}
          </span>
        </div>

     <div className="mt-4 flex items-center justify-between gap-4">
  <span className="shrink-0 text-[15px] text-gray-400">
    Token ID
  </span>

  <div className="flex min-w-0 items-center gap-2">
    
    
    <span
      title={revokeToken.authToken}
      className="max-w-[300px] truncate cursor-pointer font-mono text-[14px] font-semibold text-[#303846]"
    >
      {revokeToken.authToken || "—"}
    </span>

   
    {revokeToken.authToken && (
      <button
        type="button"
        title={copiedToken ? "Copied" : "Copy token"}
        onClick={handleCopyToken}
        className="shrink-0 text-gray-400 transition hover:text-[#2455e6]"
      >
        {copiedToken ? (
          <Check size={15} className="text-green-500" />
        ) : (
          <Copy size={15} />
        )}
      </button>
    )}

  </div>
</div>

      </div>

      {/* BUTTONS */}
      <div className="mt-7 flex justify-end gap-3">

        <button
          type="button"
          onClick={() =>
            setShowRevokeModal(false)
          }
          className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-[14px] font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button onClick={handleConfirmRevoke}
          type="button"
          className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-[14px] font-medium text-white hover:bg-red-700"
        >
          <ShieldOff size={16} />

          Revoke Token
        </button>

      </div>

    </div>
  </div>
)}
{showViewDrawer && (
  <div className="fixed inset-0 z-[99999]">

  
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setShowViewDrawer(false)}
    />

   
   <div className="absolute right-4 top-4 bottom-4 w-[420px] rounded-xl bg-white shadow-2xl">


      <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">

        <div>
          <div className="flex items-center gap-2">

            <span className="text-[18px] font-semibold text-[#303846]">
              {selectedToken?.service || "Service"}
            </span>

           
            {selectedToken && (
              <span
                className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${
                  selectedToken.expiryStatus === "ACTIVE"
                    ? "bg-green-50 text-green-600"
                    : selectedToken.expiryStatus === "EXPIRING_SOON"
                    ? "bg-orange-50 text-orange-600"
                    : selectedToken.expiryStatus === "EXPIRED"
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                {selectedToken.expiryStatus === "ACTIVE"
                  ? "Active"
                  : selectedToken.expiryStatus === "EXPIRING_SOON"
                  ? "Expiring Soon"
                  : selectedToken.expiryStatus === "EXPIRED"
                  ? "Expired"
                  : "N/A"}
              </span>
            )}

          </div>

          <p className="mt-1 text-[11px] text-gray-400 text-left">
            Service token details
          </p>
        </div>

        {/* CLOSE */}
        <button
          type="button"
          onClick={() => setShowViewDrawer(false)}
          className="text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

      </div>


     
      <div className="h-[calc(100vh-80px)] overflow-y-auto px-5 py-4">

        {viewLoading ? (

          /* LOADING */
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#2455e6]" />
          </div>

        ) : selectedToken ? (

          <>

          
            <p className="mb-3 text-[14px] font-medium uppercase tracking-wide text-gray-400 text-left">
              Token Information
            </p>

            <div className="space-y-4">

              {/* SERVICE */}
              <div className="flex items-center justify-between gap-4">
                <span className="shrink-0 text-[13px] text-gray-400">
                  Service
                </span>

                <span className="text-right text-[13px] font-medium capitalize text-gray-700">
                  {selectedToken.service || "—"}
                </span>
              </div>


            
              <div className="flex items-start justify-between gap-4">

                <span className="shrink-0 pt-1 text-[13px] text-gray-400">
                  Token ID
                </span>

               <div className="flex min-w-0 items-center gap-2">

  <span
    title={selectedToken.authToken}
    className="max-w-[260px] truncate font-mono text-[13px] font-medium text-gray-700"
  >
    {selectedToken.authToken || "—"}
  </span>

  {selectedToken.authToken && (
    <button
      type="button"
      title="Copy Token ID"
      onClick={(e) => {
        e.stopPropagation();
        handleCopy(
          selectedToken.authToken,
          "authToken"
        );
      }}
      className="shrink-0 text-gray-400 hover:text-[#2455e6]"
    >
      {copiedField === "authToken" ? (
        <Check size={14} className="text-green-500" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  )}

</div>

              </div>


              {/* SECRET VALUE */}
              <div className="flex items-start justify-between gap-4">

                <span className="shrink-0 pt-1 text-[13px] text-gray-400">
                  Secret Key
                </span>

                <div className="flex min-w-0 items-center gap-2">

  <span
    title={selectedToken.secretValue}
    className="max-w-[260px] truncate rounded border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-[13px] text-gray-500"
  >
    {selectedToken.secretValue || "—"}
  </span>

  {selectedToken.secretValue && (
    <button
      type="button"
      title="Copy Secret Key"
      onClick={(e) => {
        e.stopPropagation();
        handleCopy(
          selectedToken.secretValue,
          "secretValue"
        );
      }}
      className="shrink-0 text-gray-400 hover:text-[#2455e6]"
    >
      {copiedField === "secretValue" ? (
        <Check size={14} className="text-green-500" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  )}

</div>

              </div>


              {/* EXPIRY STATUS */}
              <div className="flex items-center justify-between gap-4">

                <span className="text-[13px] text-gray-400">
                  Status
                </span>

                <span
                  className={`rounded-full px-2 py-1 text-[9px] font-medium ${
                    selectedToken.expiryStatus === "ACTIVE"
                      ? "bg-green-50 text-green-600"
                      : selectedToken.expiryStatus ===
                        "EXPIRING_SOON"
                      ? "bg-orange-50 text-orange-600"
                      : selectedToken.expiryStatus ===
                        "EXPIRED"
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {selectedToken.expiryStatus === "ACTIVE"
                    ? "Active"
                    : selectedToken.expiryStatus ===
                      "EXPIRING_SOON"
                    ? "Expiring Soon"
                    : selectedToken.expiryStatus ===
                      "EXPIRED"
                    ? "Expired"
                    : "N/A"}
                </span>

              </div>


              {/* EXPIRY DATE */}
              <div className="flex items-center justify-between gap-4">

                <span className="text-[10px] text-gray-400">
                  Expires On
                </span>

                <div className="text-right">

                  <p
                    className={`text-[10px] font-medium ${
                      selectedToken.expiryStatus === "EXPIRED"
                        ? "text-red-500"
                        : selectedToken.expiryStatus ===
                          "EXPIRING_SOON"
                        ? "text-orange-500"
                        : "text-gray-700"
                    }`}
                  >
                    {selectedToken.expiryAtDate || "—"}
                  </p>

                  {selectedToken.expiryAtTime && (
                    <p className="mt-0.5 text-[9px] text-gray-400">
                      {selectedToken.expiryAtTime}
                    </p>
                  )}

                </div>

              </div>

            </div>

          </>

        ) : (

          /* NO DATA */
          <div className="flex h-[300px] items-center justify-center text-[11px] text-gray-400">
            No service token details found
          </div>

        )}

      </div>

    </div>
  </div>
)}
    </DashboardLayout>
  );
};

export default ServiceTokens;