import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Group from "../../assets/Group.png";
import { useHostel } from "../../Context/HostelListContext";
import Circle from "../../assets/menucircle.png";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {
  Filter,
  Export,
  ArrowLeft,
  ArrowUp2,
  ArrowSwapVertical,
  Setting3,
  SearchNormal1,
  Buildings,
  ArrowDown2,
  ArrowDown,
} from "iconsax-react";

const TableCustomization = () => {
  const { getTableColumns, updateTableColumns, resetTableColumns, loading } = useHostel();
  const [selectedColumns, setSelectedColumns] = useState([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableError, setTableError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [columnSearch, setColumnSearch] = useState("");

  const [dragIndex, setDragIndex] = useState(null);
  const [search, setSearch] = useState("");
  console.log("tableError", tableError)
  const [expandedHostel, setExpandedHostel] = useState({});
  const [expandedUsers, setExpandedUsers] = useState({});
  const handleDrop = (dropId) => {
    if (!dragIndex) return;

    const newItems = [...selectedRow.columns];

    const dragIndexReal = newItems.findIndex(c => c.fieldName === dragIndex);
    const dropIndexReal = newItems.findIndex(c => c.fieldName === dropId);

    if (dragIndexReal === -1 || dropIndexReal === -1) return;

    const [draggedItem] = newItems.splice(dragIndexReal, 1);
    newItems.splice(dropIndexReal, 0, draggedItem);

    const updated = newItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setSelectedRow({
      ...selectedRow,
      columns: updated,
    });

    setDragIndex(null);
  };
  const handleSave = async () => {
    const payload = {
      hostelId: selectedRow?.hostelId,
      userId: selectedRow?.userId,
      moduleName: selectedRow?.moduleName, // ✅ FIX
      columns: selectedRow?.columns?.map((col, index) => ({
        order: index + 1,
        fieldName: col?.fieldName,
        isSelected: col?.selected,
      })),
    };

    const res = await updateTableColumns(payload);

    if (res.success) {
      setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);
      await fetchColumns();
      setTimeout(() => {
        setShowSuccess(false);
        setShowModal(false);
      }, 1000);

    }
    else {
      setTableError(res.message)
    }
  };

  console.log("selectedRow", selectedRow)
  const fetchColumns = async () => {

    const res = await getTableColumns(
      page,
      rowsPerPage,
      debouncedSearch
    );

    if (res.success) {

      // 🔥 DIRECT HOSTEL LIST
      const hostelList = res?.data?.hostelList || [];

      // 🔥 NO FLATTEN
      setSelectedColumns(hostelList);

      // 🔥 TOTAL COUNT
      setTotalRecords(res?.data?.totalItems || 0);
    }
  };
  // const fetchColumns = async () => {


  //   const res = await getTableColumns(page, rowsPerPage, debouncedSearch);

  //   if (res.success) {
  //     const hostelList = res?.data?.hostelList || [];

  //     let allTableColumns = [];

  //     hostelList.forEach(hostel => {
  //       hostel.usersList?.forEach(user => {
  //         user.tableColumns?.forEach(tc => {
  //           allTableColumns.push({
  //             tableColumnId: tc?.tableColumnId,
  //             hostelId: tc?.hostelId,
  //             hostelName: hostel?.hostelName,
  //             userId: tc?.userId,
  //             userName: user?.userName,
  //             moduleName: tc?.moduleName,
  //             columns: tc?.columns || [],
  //           });
  //           // allTableColumns.push({
  //           //   ...tc,
  //           //   hostelName: hostel?.hostelName,
  //           //   userName: user?.userName
  //           // });
  //         });
  //       });
  //     });

  //     // const filtered = allTableColumns.filter(
  //     //   item => item.moduleName === "MODULE_TENANT"
  //     // );
  //     setSelectedColumns(allTableColumns);
  //     setTotalRecords(res.data.totalItems);
  //   }



  // };
  useEffect(() => {
    fetchColumns();
  }, [page, rowsPerPage, debouncedSearch]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);
  // useEffect(() => {
  //   const fetchColumns = async () => {
  //     setLoading(true);
  //     const apiPage = page;
  //     const res = await getTableColumns(apiPage, rowsPerPage, "");

  //     if (res.success) {
  //       const hostelList = res?.data?.hostelList || [];

  //       let allTableColumns = [];

  //       hostelList.forEach(hostel => {
  //         hostel.usersList?.forEach(user => {
  //           user.tableColumns?.forEach(tc => {
  //             allTableColumns.push({
  //               ...tc,
  //               hostelName: hostel?.hostelName,
  //               userName: user?.userName
  //             });
  //           });
  //         });
  //       });

  //       const filtered = allTableColumns.filter(
  //         item => item.moduleName === "MODULE_TENANT"
  //       );

  //       setSelectedColumns(filtered);
  //       setTotalRecords(res.data.totalItems);
  //     }

  //     setLoading(false);
  //   };

  //   fetchColumns();
  // }, [page, rowsPerPage]);
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const handleReset = async () => {
    const payload = {
      hostelId: selectedRow?.hostelId,
      userId: selectedRow?.userId,
      moduleName: selectedRow?.moduleName,
    };

    const res = await resetTableColumns(payload);

    if (res.success) {
      await fetchColumns();

      setSelectedRow(res?.data);

      setShowModal(false);
    }
  };

  return (
    <DashboardLayout>
      <Toast
        show={showSuccess}
        message={message}
        type={modalType}

      />
      <div className="p-6 space-y-6">

        <h2 className="text-lg font-semibold mb-4 text-left">
          Table Customization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">Total Records</p>
            <h3 className="text-2xl font-semibold mt-2">
              {totalRecords}
            </h3>
          </div>


        </div>
        <div className="flex justify-end mb-4">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            type="text"
            placeholder="Search"
            className="w-[250px] border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">

          {/* 🔥 SCROLL CONTAINER */}
          <div className="max-h-[350px] overflow-y-auto">

            <table className="w-full text-sm">

              {/* 🔥 STICKY HEADER */}
              <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left">Hostel</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Module</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (

                  [...Array(rowsPerPage)].map((_, i) => (
                    <tr key={i} className="border-t border-gray-200">

                      <td className="px-4 py-3">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                      </td>

                    </tr>
                  ))

                ) : selectedColumns.length === 0 ? (

                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-10 text-gray-400"
                    >
                      No data found
                    </td>
                  </tr>

                ) : (

                  selectedColumns.map((hostel) => (

                    <React.Fragment key={hostel.hostelId}>


                      <tr className="border-t bg-gray-50">

                        <td className="px-4 py-3 font-medium text-[13px]">

                          <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() =>
                              setExpandedHostel(
                                expandedHostel === hostel.hostelId
                                  ? null
                                  : hostel.hostelId
                              )
                            }
                          >

                            <span className="text-[11px]">
                              {expandedHostel === hostel.hostelId
                                ? "▼"
                                : "▶"}
                            </span>

                            <span>{hostel.hostelName}</span>

                          </div>

                        </td>

                        <td></td>
                        <td></td>
                        <td></td>

                      </tr>

                      {/* 🔥 USER ROWS */}
                      {/* 🔥 USER ROWS */}
                      {expandedHostel === hostel.hostelId &&
                        hostel.usersList?.map((user) => (

                          <React.Fragment key={user.userId}>

                            {/* USER DROPDOWN */}
                            <tr className="border-t bg-white">

                              <td className="px-10 py-2 text-[12px]">

                                <div
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() =>
                                    setExpandedUsers((prev) => ({
                                      ...prev,
                                      [user.userId]: !prev[user.userId],
                                    }))
                                  }
                                >

                                  <span className="text-[10px]">
                                    {expandedUsers[user.userId]
                                      ? "▼"
                                      : "▶"}
                                  </span>

                                  <span className="font-medium">
                                    {user.userName}
                                  </span>

                                </div>

                              </td>

                              <td></td>
                              <td></td>
                              <td></td>

                            </tr>

                            {/* MODULE ROWS */}
                            {expandedUsers[user.userId] &&
                              user.tableColumns?.map((item) => (

                                <tr
                                  key={item.tableColumnId}
                                  className="border-t hover:bg-gray-50 transition"
                                >

                                  <td className="px-16 py-2 text-[12px] text-gray-500">

                                  </td>

                                  <td className="px-4 py-2 text-[12px]">
                                    {user.userName}
                                  </td>

                                  <td className="px-4 py-2 text-[12px]">
                                    {item.moduleName}
                                  </td>

                                  <td className="px-4 py-2">

                                    <Setting3
                                      size="22"
                                      color="#4B4B4B"
                                      className="cursor-pointer"
                                      onClick={() => {

                                        setColumnSearch("");

                                        setSelectedRow({
                                          ...item,
                                          hostelName: hostel.hostelName,
                                          userName: user.userName,
                                          columns: item?.columns || [],
                                        });

                                        setShowModal(true);
                                      }}
                                    />

                                  </td>

                                </tr>

                              ))}

                          </React.Fragment>

                        ))}

                    </React.Fragment>

                  ))

                )}

              </tbody>

            </table>

          </div>
        </div>
        <div className="flex justify-between items-center mt-4 bg-white px-4 py-3 ">

          {/* 🔥 LEFT SIDE */}
          <div className="text-sm text-gray-600">
            Total Record Count :{" "}
            <span className="text-blue-600 font-semibold">
              {totalRecords}
            </span>
          </div>

          {/* 🔥 RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded-md px-3 py-1 text-sm bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {/* Prev Button */}
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-2 text-lg ${page === 1 ? "text-gray-300" : "text-gray-700 hover:text-black"
                }`}
            >
              ‹
            </button>

            {/* Page Number */}
            <div className="border px-3 py-1 rounded-md text-sm font-medium">
              {page}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-2 text-lg ${page === totalPages
                ? "text-gray-300"
                : "text-gray-700 hover:text-black"
                }`}
            >
              ›
            </button>


            <div className="text-sm text-gray-500">
              {(page - 1) * rowsPerPage + 1} -{" "}
              {Math.min(page * rowsPerPage, totalRecords)}
            </div>

          </div>
        </div>

      </div>


      {showModal && (
        <div className="fixed inset-0 z-50 flex">


          <div
            className="flex-1 bg-black/30"
            onClick={() => {
              setShowModal(false);
              setTableError("");
            }}
          />


          <div className="w-[420px] bg-white h-screen shadow-xl flex flex-col">

            {/* HEADER */}
            {/* <div className="px-5 py-4 border-b flex justify-between items-center">
  <h2 className="text-[18px] font-semibold">Customize Tabs</h2>

  <button
    onClick={() => setShowModal(false)}
    className="text-gray-400 hover:text-black text-lg"
  >
    ✕
  </button>
</div> */}

            {/* BODY */}
            {/* TOP */}
            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-4">

              {/* TITLE + SELECT ALL */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[16px] font-medium">Customize Tabs</h3>

                <button
                  className="text-blue-600 text-sm font-medium"
                  onClick={() => {
                    setTableError("");
                    const allSelected = selectedRow?.columns?.every(
                      c => c.selected
                    );

                    const updated = selectedRow.columns.map(c => ({
                      ...c,
                      selected: !allSelected,
                    }));

                    setSelectedRow({
                      ...selectedRow,
                      columns: updated,
                    });
                  }}
                >
                  ✓ {selectedRow?.columns?.every(c => c.selected)
                    ? "Unselect all"
                    : "Select all"}
                </button>
              </div>

              {/* 🔥 DRAWER SEARCH */}
              <input
                type="text"
                placeholder="Search Columns"
                value={columnSearch}
                onChange={(e) => setColumnSearch(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />

              {/* 🔥 LIST */}
              <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2">

                {(selectedRow?.columns || [])
                  .filter(col =>
                    col.fieldName
                      .toLowerCase()
                      .includes(columnSearch.toLowerCase())
                  )
                  .map((col) => (
                    <div
                      key={col.fieldName}
                      className={`flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition
            ${dragIndex === col.fieldName ? "bg-blue-50" : ""}
          `}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(col.fieldName)}
                    >

                      {/* DRAG ICON */}
                      <span
                        draggable
                        onDragStart={() => setDragIndex(col.fieldName)}
                        className="cursor-grab active:cursor-grabbing text-gray-500 text-lg"
                      >
                        ☰
                      </span>

                      {/* CHECKBOX */}
                      <input
                        type="checkbox"
                        checked={col.selected}
                        onChange={(e) => {
                          const updated = [...selectedRow.columns];

                          const index = updated.findIndex(
                            c => c.fieldName === col.fieldName
                          );
                          setTableError("")

                          updated[index].selected = e.target.checked;

                          setSelectedRow({
                            ...selectedRow,
                            columns: updated,
                          });
                        }}
                        className="accent-blue-600 w-4 h-4"
                      />

                      {/* LABEL */}
                      <span className="text-sm text-gray-700">
                        {col.fieldName}
                      </span>

                    </div>
                  ))}

              </div>
            </div>

            {tableError && (
              <ErrorMessage message={tableError} type="error" />
            )}

            {/* FOOTER */}
            <div className="p-4 border-t flex justify-between">
              <button className="px-4 py-2 border rounded-lg" onClick={handleReset}>
                Reset
              </button>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleSave}>
                Save
              </button>
            </div>

          </div>
        </div>
      )}


    </DashboardLayout>
  );
};

export default TableCustomization;
