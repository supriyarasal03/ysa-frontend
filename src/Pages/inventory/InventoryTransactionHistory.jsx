import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAllPlayerInventoryTransactions,
} from "./playerInventoryTransactionApi";

const InventoryTransactionHistory = () => {

  // =========================================================
  // DATA
  // =========================================================

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [selectedTransaction, setSelectedTransaction] =
    useState(null);


  // =========================================================
  // FILTERS
  // =========================================================

  const [period, setPeriod] = useState("ALL");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  const [sport, setSport] = useState("");

  const [subItem, setSubItem] = useState("");

  const [brand, setBrand] = useState("");



  // =========================================================
  // FETCH TRANSACTIONS
  // =========================================================

  const fetchTransactions = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await getAllPlayerInventoryTransactions();

      setTransactions(
        Array.isArray(response?.data)
          ? response.data
          : []
      );

    } catch (err) {

      console.error(
        "Failed to fetch inventory transactions:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load inventory transactions."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchTransactions();

  }, []);


  // =========================================================
  // DATE HELPERS
  // =========================================================

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const getDateOnly = (dateValue) => {

    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year =
      date.getFullYear();

    const month =
      String(date.getMonth() + 1).padStart(2, "0");

    const day =
      String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  // =========================================================
  // CURRENT DATE
  // =========================================================

  const today = new Date();

  const todayString =
    getDateOnly(today);


  // =========================================================
  // FLATTEN TRANSACTION ITEMS
  // =========================================================

  const transactionRows = useMemo(() => {

    return transactions.flatMap(
      (transaction) => {

        const items =
          Array.isArray(transaction.items)
            ? transaction.items
            : [];

        return items.map(
          (item, itemIndex) => ({

            transactionId:
              transaction.id,

            transactionNumber:
              transaction.transactionNumber ||
              `Transaction #${transaction.id}`,

            transactionDate:
              transaction.transactionDate,

            playerId:
              transaction.playerId,

            playerName:
              transaction.playerName ||
              "Unknown Student",

            itemId:
              item.id ||
              `${transaction.id}-${itemIndex}`,

            inventoryId:
              item.inventoryId,

            sportName:
              item.sportName || "",

            subItem:
              item.subItem || "",

            brand:
              item.brand || "",

            quantity:
              Number(item.quantity || 0),

            unitPrice:
              Number(item.unitPrice || 0),

            totalPrice:
              Number(item.totalPrice || 0),

            transactionTotal:
              Number(
                transaction.totalAmount || 0
              ),

          })
        );

      }
    );

  }, [transactions]);


  // =========================================================
  // FILTER TRANSACTIONS
  // =========================================================

  const filteredRows = useMemo(() => {

    return transactionRows.filter(
      (row) => {

        const rowDate =
          getDateOnly(
            row.transactionDate
          );


        // ---------------------------------------------------
        // TODAY
        // ---------------------------------------------------

        if (period === "TODAY") {

          if (rowDate !== todayString) {
            return false;
          }

        }


        // ---------------------------------------------------
        // THIS MONTH
        // ---------------------------------------------------

        if (period === "MONTH") {

          const date =
            new Date(
              row.transactionDate
            );

          if (
            date.getMonth() !==
              today.getMonth() ||
            date.getFullYear() !==
              today.getFullYear()
          ) {

            return false;

          }

        }


        // ---------------------------------------------------
        // THIS YEAR
        // ---------------------------------------------------

        if (period === "YEAR") {

          const date =
            new Date(
              row.transactionDate
            );

          if (
            date.getFullYear() !==
            today.getFullYear()
          ) {

            return false;

          }

        }


        // ---------------------------------------------------
        // CUSTOM DATE
        // ---------------------------------------------------

        if (
          period === "CUSTOM" &&
          fromDate &&
          rowDate < fromDate
        ) {

          return false;

        }


        if (
          period === "CUSTOM" &&
          toDate &&
          rowDate > toDate
        ) {

          return false;

        }


        // ---------------------------------------------------
        // STUDENT NAME
        // ---------------------------------------------------

        if (
          studentSearch.trim() &&
          !String(row.playerName || "")
            .toLowerCase()
            .includes(studentSearch.trim().toLowerCase())
        ) {

          return false;

        }


        // ---------------------------------------------------
        // SPORT
        // ---------------------------------------------------

        if (
          sport &&
          row.sportName !== sport
        ) {

          return false;

        }


        // ---------------------------------------------------
        // SUB ITEM
        // ---------------------------------------------------

        if (
          subItem &&
          row.subItem !== subItem
        ) {

          return false;

        }


        // ---------------------------------------------------
        // BRAND
        // ---------------------------------------------------

        if (
          brand &&
          row.brand !== brand
        ) {

          return false;

        }


        return true;

      }
    );

  }, [
    transactionRows,
    period,
    fromDate,
    toDate,
    studentSearch,
    sport,
    subItem,
    brand,
    todayString,
  ]);


  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const sports = useMemo(() => {

    return [
      ...new Set(
        transactionRows
          .map(
            (item) =>
              item.sportName
          )
          .filter(Boolean)
      ),
    ];

  }, [transactionRows]);


  const availableSubItems =
    useMemo(() => {

      return [
        ...new Set(
          transactionRows
            .filter(
              (item) =>
                (!sport || item.sportName === sport) &&
                (!brand || item.brand === brand)
            )
            .map(
              (item) =>
                item.subItem
            )
            .filter(Boolean)
        ),
      ];

    }, [
      transactionRows,
      sport,
      brand,
    ]);


  const availableBrands =
    useMemo(() => {

      return [
        ...new Set(
          transactionRows
            .filter(
              (item) =>
                !sport ||
                item.sportName === sport
            )
            .map(
              (item) =>
                item.brand
            )
            .filter(Boolean)
        ),
      ];

    }, [
      transactionRows,
      sport,
    ]);


  // =========================================================
  // SUMMARY
  // =========================================================


  
  const totalTransactions =
    useMemo(() => {

      return new Set(
        filteredRows.map(
          (row) =>
            row.transactionId
        )
      ).size;

    }, [filteredRows]);


  const totalItems =
    useMemo(() => {

      return filteredRows.reduce(
        (sum, row) =>
          sum +
          Number(
            row.quantity || 0
          ),
        0
      );

    }, [filteredRows]);







const totalSales =
  useMemo(() => {

    return filteredRows.reduce(
      (sum, row) =>
        sum +
        Number(
          row.totalPrice || 0
        ),
      0
    );

  }, [filteredRows]);













  const totalStudents =
    useMemo(() => {

      return new Set(
        filteredRows
          .map(
            (row) =>
              row.playerId
          )
          .filter(Boolean)
      ).size;

    }, [filteredRows]);


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {

    setPeriod("ALL");

    setFromDate("");

    setToDate("");
    setStudentSearch("");

    setSport("");

    setSubItem("");

    setBrand("");

  };


  // =========================================================
  // VIEW TRANSACTION
  // =========================================================

  const handleViewTransaction = (
    transactionId
  ) => {

    const transaction =
      transactions.find(
        (item) =>
          item.id ===
          transactionId
      );

    if (transaction) {

      setSelectedTransaction(
        transaction
      );

    }

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="flex min-h-[300px] items-center justify-center">

        <div className="text-sm font-medium text-[#60758d]">
          Loading student inventory history...
        </div>

      </div>

    );

  }


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="w-full">

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="rounded-[18px] border border-[#dce5ee] bg-white shadow-sm">


        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col gap-4 border-b border-[#e5ebf1] p-7 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-[24px] font-bold text-[#172b4d]">
              Student Inventory Transactions
            </h2>

            <p className="mt-1 text-sm text-[#7388a0]">
              View and manage inventory purchased by students.
            </p>

          </div>


          <button
            type="button"
            onClick={fetchTransactions}
            className="h-11 rounded-xl border border-[#d4deea] bg-white px-6 text-sm font-semibold text-[#35638a] transition hover:bg-[#f5f8fb]"
          >
            Refresh
          </button>

        </div>


        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}

        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 xl:grid-cols-4">


          {/* TRANSACTIONS */}

          <div className="rounded-2xl border border-[#dce5ee] bg-white p-5 shadow-sm">

            <p className="text-sm text-[#7388a0]">
              Total Transactions
            </p>

            <p className="mt-2 text-[28px] font-bold text-[#17395c]">
              {totalTransactions}
            </p>

          </div>


          {/* ITEMS */}

          <div className="rounded-2xl border border-[#dce5ee] bg-white p-5 shadow-sm">

            <p className="text-sm text-[#7388a0]">
              Items Sold
            </p>

            <p className="mt-2 text-[28px] font-bold text-[#17395c]">
              {totalItems}
            </p>

          </div>


          {/* STUDENTS */}

          <div className="rounded-2xl border border-[#dce5ee] bg-white p-5 shadow-sm">

            <p className="text-sm text-[#7388a0]">
              Students
            </p>

            <p className="mt-2 text-[28px] font-bold text-[#17395c]">
              {totalStudents}
            </p>

          </div>


          {/* SALES */}

          <div className="rounded-2xl border border-[#dce5ee] bg-white p-5 shadow-sm">

            <p className="text-sm text-[#7388a0]">
              Total Sales
            </p>

            <p className="mt-2 text-[28px] font-bold text-green-600">
              ₹
              {totalSales.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>

          </div>

        </div>


        {/* ===================================================
            FILTER SECTION
        =================================================== */}

        <div className="border-y border-[#e5ebf1] bg-[#fbfcfd] p-6">

          <div className="mb-5">

            <h3 className="text-lg font-bold text-[#172b4d]">
              Transaction Filters
            </h3>

            <p className="mt-1 text-sm text-[#7388a0]">
              Filter student inventory transactions by date, sport, item and brand.
            </p>

          </div>


          {/* FILTER GRID */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* DATE */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#415d79]">
                Date
              </label>

              <select
                value={period}
                onChange={(event) => {

                  const value =
                    event.target.value;

                  setPeriod(value);

                  if (value !== "CUSTOM") {

                    setFromDate("");
                    setToDate("");

                  }

                }}
                className="h-11 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[15px] text-[#263e5a] outline-none focus:border-[#0787c8]"
              >

                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="MONTH">This Month</option>
                <option value="YEAR">This Year</option>
                <option value="CUSTOM">Custom Date</option>

              </select>

            </div>

            {/* FROM DATE - BESIDE DATE FILTER */}

            {period === "CUSTOM" && (

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#415d79]">
                  From Date
                </label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) =>
                    setFromDate(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[#263e5a] outline-none focus:border-[#0787c8]"
                />

              </div>

            )}

            {/* TO DATE - BESIDE FROM DATE */}

            {period === "CUSTOM" && (

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#415d79]">
                  To Date
                </label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(event) =>
                    setToDate(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[#263e5a] outline-none focus:border-[#0787c8]"
                />

              </div>

            )}

            {/* SPORT - SELECT FIRST */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#415d79]">
                Sport
              </label>

              <select
                value={sport}
                onChange={(event) => {

                  setSport(event.target.value);
                  setBrand("");
                  setSubItem("");

                }}
                className="h-11 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[15px] text-[#263e5a] outline-none focus:border-[#0787c8]"
              >

                <option value="">All Sports</option>

                {sports.map((item) => (

                  <option key={item} value={item}>
                    {item}
                  </option>

                ))}

              </select>

            </div>

            {/* BRAND - SELECT AFTER SPORT */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#415d79]">
                Brand
              </label>

              <select
                value={brand}
                disabled={!sport}
                onChange={(event) => {

                  setBrand(event.target.value);
                  setSubItem("");

                }}
                className="h-11 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[15px] text-[#263e5a] outline-none transition focus:border-[#0787c8] disabled:cursor-not-allowed disabled:bg-[#f3f6f9] disabled:text-[#9aaabd]"
              >

                <option value="">
                  {sport ? "All Brands" : "Select Sport First"}
                </option>

                {availableBrands.map((item) => (

                  <option key={item} value={item}>
                    {item}
                  </option>

                ))}

              </select>

            </div>

            {/* SUB ITEM - SELECT AFTER BRAND */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#415d79]">
                Sub Item
              </label>

              <select
                value={subItem}
                disabled={!sport || !brand}
                onChange={(event) =>
                  setSubItem(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[15px] text-[#263e5a] outline-none transition focus:border-[#0787c8] disabled:cursor-not-allowed disabled:bg-[#f3f6f9] disabled:text-[#9aaabd]"
              >

                <option value="">
                  {!sport
                    ? "Select Sport First"
                    : !brand
                    ? "Select Brand First"
                    : "All Sub Items"}
                </option>

                {availableSubItems.map((item) => (

                  <option key={item} value={item}>
                    {item}
                  </option>

                ))}

              </select>

              {/* STUDENT NAME */}


          </div>

          </div>


          {/* CLEAR */}

          <div className="mt-5 flex justify-end">

            <button
              type="button"
              onClick={clearFilters}
              className="h-11 rounded-xl border border-[#d4deea] bg-white px-7 font-semibold text-[#536b86] transition hover:bg-[#f5f8fb]"
            >
              Clear Filters
            </button>

          </div>

        </div>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

          </div>

        )}


        {/* ===================================================
            TABLE HEADER
        =================================================== */}

        <div className="border-b border-[#e5ebf1] px-6 py-5">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h3 className="text-xl font-bold text-[#172b4d]">
                Transaction History
              </h3>

              <p className="mt-1 text-sm text-[#7388a0]">
                Student inventory purchase history.
              </p>

            {/* STUDENT SEARCH */}

            <div className="mt-5 max-w-[420px]">

              <label className="mb-2 block text-sm font-semibold text-[#415d79]">
                Student
              </label>

              <input
                type="text"
                value={studentSearch}
                onChange={(event) =>
                  setStudentSearch(event.target.value)
                }
                placeholder="Search student name..."
                className="h-11 w-full rounded-xl border border-[#d5e0eb] bg-white px-4 text-[15px] text-[#263e5a] outline-none focus:border-[#0787c8]"
              />

            </div>


            </div>

            <p className="text-sm text-[#7388a0]">
              {filteredRows.length} item records
            </p>

          </div>

        </div>


        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1150px]">

            <thead>

              <tr className="border-b border-[#e5ebf1] bg-[#f8fafc]">

                <th className="px-6 py-5 text-left text-xs font-semibold tracking-wide text-[#55718f]">
                  DATE
                </th>

                <th className="px-6 py-5 text-left text-xs font-semibold tracking-wide text-[#55718f]">
                  STUDENT
                </th>

                <th className="px-6 py-5 text-left text-xs font-semibold tracking-wide text-[#55718f]">
                  SPORT
                </th>

                <th className="px-6 py-5 text-left text-xs font-semibold tracking-wide text-[#55718f]">
                  SUB ITEM
                </th>

                <th className="px-6 py-5 text-left text-xs font-semibold tracking-wide text-[#55718f]">
                  BRAND
                </th>

                <th className="px-6 py-5 text-center text-xs font-semibold tracking-wide text-[#55718f]">
                  QTY
                </th>

                <th className="px-6 py-5 text-right text-xs font-semibold tracking-wide text-[#55718f]">
                  UNIT PRICE
                </th>

                <th className="px-6 py-5 text-right text-xs font-semibold tracking-wide text-[#55718f]">
                  TOTAL
                </th>

                <th className="px-6 py-5 text-center text-xs font-semibold tracking-wide text-[#55718f]">
                  ACTIONS
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredRows.length === 0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="px-6 py-16 text-center"
                  >

                    <p className="text-sm font-medium text-[#7388a0]">
                      No inventory transactions found.
                    </p>

                    <p className="mt-1 text-xs text-[#9aabba]">
                      Try changing or clearing your filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredRows.map(
                  (row) => (

                    <tr
                      key={row.itemId}
                      className="border-b border-[#edf1f5] transition hover:bg-[#fbfdff]"
                    >

                      {/* DATE */}

                      <td className="whitespace-nowrap px-6 py-5 text-sm text-[#536b86]">
                        {formatDate(
                          row.transactionDate
                        )}
                      </td>


                      {/* STUDENT */}

                      <td className="px-6 py-5">

                        <p className="whitespace-nowrap text-sm font-semibold text-[#263e5a]">
                          {row.playerName}
                        </p>

                      </td>


                      {/* SPORT */}

                      <td className="px-6 py-5">

                        <p className="whitespace-nowrap text-sm text-[#536b86]">
                          {row.sportName || "-"}
                        </p>

                      </td>


                      {/* SUB ITEM */}

                      <td className="px-6 py-5">

                        <p className="whitespace-nowrap text-sm font-semibold text-[#263e5a]">
                          {row.subItem || "-"}
                        </p>

                      </td>


                      {/* BRAND */}

                      <td className="px-6 py-5">

                        <p className="whitespace-nowrap text-sm font-semibold text-[#263e5a]">
                          {row.brand || "-"}
                        </p>

                      </td>


                      {/* QTY */}

                      <td className="px-6 py-5 text-center">

                        <span className="inline-flex min-w-[42px] items-center justify-center rounded-full bg-[#e9f8f0] px-3 py-1.5 text-sm font-semibold text-green-600">
                          {row.quantity}
                        </span>

                      </td>


                      {/* UNIT PRICE */}

                      <td className="whitespace-nowrap px-6 py-5 text-right text-sm text-[#536b86]">

                        ₹
                        {row.unitPrice.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}

                      </td>


                      {/* TOTAL */}

                      <td className="whitespace-nowrap px-6 py-5 text-right text-sm font-semibold text-green-600">

                        ₹
                        {row.totalPrice.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}

                      </td>


                      {/* ACTION */}

                      <td className="px-6 py-5 text-center">

                        <button
                          type="button"
                          onClick={() =>
                            handleViewTransaction(
                              row.transactionId
                            )
                          }
                          className="rounded-lg border border-[#d4deea] bg-white px-4 py-2 text-sm font-semibold text-[#35638a] transition hover:bg-[#f4f8fb]"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          TRANSACTION DETAILS MODAL
      ===================================================== */}

      {selectedTransaction && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-5">

          <div className="max-h-[90vh] w-full max-w-[950px] overflow-y-auto rounded-[18px] bg-white shadow-2xl">


            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-[#e5ebf1] p-7">

              <div>

                <h2 className="text-2xl font-bold text-[#172b4d]">
                  Transaction Details
                </h2>

                <p className="mt-1 text-sm text-[#7388a0]">
                  {selectedTransaction.transactionNumber ||
                    `Transaction #${selectedTransaction.id}`}
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedTransaction(
                    null
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f4f8] text-xl text-[#60758d] transition hover:bg-[#e7edf3]"
              >
                ×
              </button>

            </div>


            {/* CONTENT */}

            <div className="p-7">


              {/* BASIC INFORMATION */}

              <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">


                {/* STUDENT */}

                <div className="rounded-xl bg-[#f8fafc] p-5">

                  <p className="text-xs text-[#7187a0]">
                    Student
                  </p>

                  <p className="mt-2 font-semibold text-[#1d3855]">
                    {selectedTransaction.playerName ||
                      "Unknown Student"}
                  </p>

                </div>


                {/* DATE */}

                <div className="rounded-xl bg-[#f8fafc] p-5">

                  <p className="text-xs text-[#7187a0]">
                    Transaction Date
                  </p>

                  <p className="mt-2 font-semibold text-[#1d3855]">
                    {formatDate(
                      selectedTransaction.transactionDate
                    )}
                  </p>

                </div>


                {/* TOTAL */}

                <div className="rounded-xl bg-[#f8fafc] p-5">

                  <p className="text-xs text-[#7187a0]">
                    Total Amount
                  </p>

                  <p className="mt-2 font-semibold text-green-600">

                    ₹
                    {Number(
                      selectedTransaction.totalAmount ||
                        0
                    ).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}

                  </p>

                </div>

              </div>


              {/* ITEMS */}

              <div>

                <h3 className="mb-4 text-lg font-bold text-[#172b4d]">
                  Purchased Items
                </h3>


                <div className="overflow-x-auto rounded-xl border border-[#dce5ee]">

                  <table className="w-full min-w-[700px]">

                    <thead>

                      <tr className="border-b border-[#e5ebf1] bg-[#f8fafc]">

                        <th className="px-5 py-4 text-left text-xs font-semibold text-[#55718f]">
                          SPORT
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold text-[#55718f]">
                          SUB ITEM
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold text-[#55718f]">
                          BRAND
                        </th>

                        <th className="px-5 py-4 text-center text-xs font-semibold text-[#55718f]">
                          QTY
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold text-[#55718f]">
                          UNIT PRICE
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold text-[#55718f]">
                          TOTAL
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {(
                        selectedTransaction.items ||
                        []
                      ).map(
                        (item, index) => (

                          <tr
                            key={
                              item.id ||
                              `${selectedTransaction.id}-${index}`
                            }
                            className="border-b border-[#edf1f5] last:border-b-0"
                          >

                            <td className="px-5 py-4 text-sm text-[#536b86]">
                              {item.sportName ||
                                "-"}
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold text-[#263e5a]">
                              {item.subItem ||
                                "-"}
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold text-[#263e5a]">
                              {item.brand ||
                                "-"}
                            </td>

                            <td className="px-5 py-4 text-center text-sm text-[#536b86]">
                              {item.quantity ||
                                0}
                            </td>

                            <td className="px-5 py-4 text-right text-sm text-[#536b86]">

                              ₹
                              {Number(
                                item.unitPrice ||
                                  0
                              ).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}

                            </td>

                            <td className="px-5 py-4 text-right text-sm font-semibold text-green-600">

                              ₹
                              {Number(
                                item.totalPrice ||
                                  0
                              ).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>


              {/* FOOTER */}

              <div className="mt-7 flex justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedTransaction(
                      null
                    )
                  }
                  className="h-11 rounded-xl border border-[#d4deea] bg-white px-7 font-semibold text-[#536b86] transition hover:bg-[#f7fafc]"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default InventoryTransactionHistory;