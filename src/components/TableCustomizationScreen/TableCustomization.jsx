import React, { useState, useEffect } from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";
import Group from "../../assets/Group.png";
import { useHostel } from "../../Context/HostelListContext";
import Circle from "../../assets/menucircle.png";
import Toast from "../SuccessModal/ToastDesign";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import UserList from "../../assets/team.png"
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
      <div className="min-h-screen bg-[#f4f7fb] p-6">

  {/* TOP HEADER */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Table Customization
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        Manage and customize module columns
      </p>
    </div>

    {/* SEARCH */}
    <div className="relative w-full md:w-[280px]">

      <SearchNormal1
        size="18"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        type="text"
        placeholder="Search hostel or user..."
        className="
          w-full
          pl-10
          pr-4
          py-2.5
          rounded-xl
          border border-gray-200
          bg-white
          shadow-sm
          outline-none
          focus:ring-4
          focus:ring-blue-100
          transition-all
        "
      />
    </div>

  </div>

  {/* SUMMARY CARD */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

    <div
      className="
        bg-white
        rounded-2xl
        border border-gray-100
        shadow-sm
        p-5
        hover:shadow-md
        transition-all
      "
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-400 font-medium">
            Total Records
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {totalRecords}
          </h2>

        </div>

        <div
          className="
            w-14 h-14
            rounded-2xl
            bg-blue-50
            flex items-center justify-center
          "
        >
          <Buildings size="28" color="#2563eb" />
        </div>

      </div>

    </div>

  </div>

  {/* TABLE SECTION */}
  <div
    className="
      bg-white
      rounded-3xl
      border border-gray-100
      shadow-sm
      overflow-hidden
    "
  >

    {/* TABLE */}
    <div className="overflow-auto max-h-[300px] w-full">

      <table className="w-full text-sm">

<thead
  className="
    sticky top-0 z-10
    bg-[#f8fafc]
    border-b border-gray-200
  "
>
  <tr>

    {/* LEFT SIDE TITLE */}
    <th
      className="
        px-6 py-4 text-left
        text-[12px]
        uppercase
        tracking-wider
        font-semibold
        text-gray-500
      "
    >
      Table Customization
    </th>

    {/* EMPTY */}
    <th />

    {/* EMPTY */}
    <th />

    {/* ONLY ACTION */}
    <th
      className="
        px-6 py-4 text-left
        text-[12px]
        uppercase
        tracking-wider
        font-semibold
        text-gray-500
      "
    >
      Action
    </th>

  </tr>
</thead>

        {/* BODY */}
       <tbody>

  {selectedColumns.map((hostel) => (

    <React.Fragment key={hostel.hostelId}>

      {/* ================= HOSTEL ROW ================= */}
      <tr
        className="
          bg-gradient-to-r
          from-blue-50
          to-white
          border-b border-gray-100
          hover:bg-blue-50/70
          transition-all duration-200
        "
      >

        <td className="px-6 py-4">

          <div
            className="
              flex items-center gap-3
              cursor-pointer
            "
            onClick={() =>
              setExpandedHostel(
                expandedHostel === hostel.hostelId
                  ? null
                  : hostel.hostelId
              )
            }
          >

            {/* ARROW */}
            <div
              className={`
                transition-transform duration-300
                ${expandedHostel === hostel.hostelId
                  ? "rotate-180"
                  : ""
                }
              `}
            >
              <ArrowDown2
                size="16"
                color="#2563eb"
              />
            </div>

            {/* ICON */}
            <div
              className="
                w-11 h-11
                rounded-2xl
                bg-blue-100
                flex items-center justify-center
              "
            >
              <Buildings
                size="20"
                color="#2563eb"
              />
            </div>

            {/* NAME */}
         <div
  className="
    flex items-center gap-2 flex-wrap
  "
>

  <p
    className="
      text-[15px]
      font-semibold
      text-gray-800
    "
  >
    {hostel.hostelName}
  </p>

  <div
    className="
      flex items-center gap-1
      px-2 py-1
      rounded-full
      bg-blue-50
    "
  >
    <img
      src={UserList}
      alt="users"
      className="w-4 h-4"
    />

    <span
      className="
        text-xs
        font-medium
        text-blue-600
      "
    >
      {hostel.usersList?.length || 0}
    </span>

  </div>

</div>

          </div>

        </td>

        <td />
        <td />
        <td />

      </tr>

      {/* ================= USER LIST ================= */}
      {expandedHostel === hostel.hostelId &&
        hostel.usersList?.map((user) => (

          <React.Fragment key={user.userId}>

            {/* USER ROW */}
            <tr
              className="
                bg-white
                border-b border-gray-100
                hover:bg-gray-50
                transition-all duration-200
              "
            >

              <td className="px-14 py-4">

                <div
                  className="
                    flex items-center gap-3
                    cursor-pointer
                  "
                  onClick={() =>
                    setExpandedUsers((prev) => ({
                      ...prev,
                      [user.userId]:
                        !prev[user.userId],
                    }))
                  }
                >

                  {/* ARROW */}
                  <div
                    className={`
                      transition-transform duration-300
                      ${expandedUsers[user.userId]
                        ? "rotate-180"
                        : ""
                      }
                    `}
                  >
                    <ArrowDown2
                      size="14"
                      color="#64748b"
                    />
                  </div>

                  {/* USER AVATAR */}
                  <div
                    className="
                      w-10 h-10
                      rounded-full
                      bg-gray-100
                      flex items-center justify-center
                      text-sm
                      font-semibold
                      text-gray-600
                    "
                  >
                    {user.userName?.charAt(0)}
                  </div>

                  {/* USER NAME */}
                  <div>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      {user.userName}
                    </p>

                    <p
                      className="
                        text-xs
                        text-gray-400 text-left
                      "
                    >
                      User
                    </p>

                  </div>

                </div>

              </td>

              <td />
              <td />
              <td />

            </tr>

            {/* ================= MODULE LIST ================= */}
            {/* ================= MODULE LIST ================= */}
{expandedUsers[user.userId] &&
  user.tableColumns?.map((item) => (

    <tr
      key={item.tableColumnId}
      className="
        bg-[#fafcff]
        border-b border-gray-100
        hover:bg-violet-50/40
        transition-all duration-200
      "
    >

      {/* MODULE */}
      <td className="px-24 py-4">

        <div
          className="
            flex items-center gap-3
          "
        >

          {/* LEFT LINE */}
          <div
            className="
              w-8
              flex justify-center
            "
          >
            <div
              className="
                w-[2px]
                h-10
                bg-gray-200
                rounded-full
              "
            />
          </div>

          {/* MODULE ICON */}
          <div
            className="
              w-9 h-9
              rounded-xl
              bg-violet-100
              flex items-center justify-center
            "
          >
            <div
              className="
                w-2.5 h-2.5
                rounded-full
                bg-violet-600
              "
            />
          </div>

          {/* MODULE INFO */}
          <div>

            <p
  className="
    text-sm
    font-semibold
    text-gray-700
    break-words
    whitespace-nowrap
    max-w-[120px]
    leading-5 text-left
  "
>
  {item.moduleName}
 
</p>

            <p
              className="
                text-xs
                text-gray-400 text-left
              "
            >
              Module Configuration
            </p>

          </div>

        </div>

      </td>

      {/* EMPTY USER */}
      <td />

      {/* EMPTY MODULE */}
      <td />

      {/* ACTION */}
      <td className="px-6 py-4">

        <div
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
          className="
            w-10 h-10
            rounded-xl
            bg-gray-100
            hover:bg-violet-100
            flex items-center justify-center
            transition-all duration-200
            cursor-pointer
          "
        >

          <Setting3
            size="18"
            color="#7c3aed"
          />

        </div>

      </td>

    </tr>

))}

          </React.Fragment>

        ))}

    </React.Fragment>

  ))}

</tbody>

      </table>

    </div>

    {/* FOOTER */}
   

  </div>
    <div className="flex justify-between items-center mt-4 bg-white px-4 py-3  w-full">

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
