import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserRound,
  CalendarDays,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ReceptionistAttendanceService from "../receptionist/ReceptionistAttendanceService";
import AdminDashboardService from "../admin/AdminDashboardService";

export default function AdminDashboard() {

  const navigate = useNavigate();

  // =========================================================
  // CURRENT DATE
  // =========================================================

  const today = new Date();

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();


  // =========================================================
  // MONTH / YEAR FILTER
  // =========================================================

  const [showMonthPicker, setShowMonthPicker] =
    useState(false);

  // JavaScript:
  // January = 0
  // February = 1
  // ...
  // September = 8

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const [selectedYear, setSelectedYear] =
    useState(currentYear);


  // =========================================================
  // STAFF ATTENDANCE
  // =========================================================

  const [todayAttendance, setTodayAttendance] =
    useState([]);

  const [attendanceLoading, setAttendanceLoading] =
    useState(true);


  // =========================================================
  // ADMIN DASHBOARD SUMMARY
  // =========================================================

  const [dashboardData, setDashboardData] = useState({

    totalUsers: 0,

    activePlayers: 0,

    totalCoaches: 0,

    activeReceptionists: 0,

    activeInventoryManagers: 0,

    activeCleaningStaff: 0,

    activeBatches: 0,

  });


  const [dashboardLoading, setDashboardLoading] =
    useState(true);


  const pickerRef = useRef(null);


  // =========================================================
  // MONTHS
  // =========================================================

  const months = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",

  ];


  // =========================================================
  // DEFAULT DASHBOARD DATA
  // =========================================================

  const emptyDashboardData = {

    totalUsers: 0,

    activePlayers: 0,

    totalCoaches: 0,

    activeReceptionists: 0,

    activeInventoryManagers: 0,

    activeCleaningStaff: 0,

    activeBatches: 0,

  };


  // =========================================================
  // CLOSE MONTH PICKER WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target)
      ) {

        setShowMonthPicker(false);

      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // =========================================================
  // LOAD ADMIN DASHBOARD SUMMARY
  // RUNS WHEN MONTH OR YEAR CHANGES
  // =========================================================

  useEffect(() => {

    const loadDashboardSummary = async () => {

      try {

        setDashboardLoading(true);


        // ===================================================
        // FRONTEND MONTH
        // January = 0
        //
        // BACKEND MONTH
        // January = 1
        // ===================================================

        const backendMonth =
          selectedMonth + 1;


        console.log(
          "Loading dashboard:",
          {
            month: backendMonth,
            year: selectedYear,
          }
        );


        const response =
          await AdminDashboardService.getDashboardSummary(
            backendMonth,
            selectedYear
          );


        console.log(
          "Dashboard API response:",
          response
        );


        setDashboardData(
          response?.data || emptyDashboardData
        );

      } catch (error) {

        console.error(
          "Failed to load admin dashboard summary:",
          error
        );


        setDashboardData(
          emptyDashboardData
        );

      } finally {

        setDashboardLoading(false);

      }

    };


    loadDashboardSummary();

  }, [selectedMonth, selectedYear]);


  // =========================================================
  // LOAD TODAY STAFF ATTENDANCE
  // =========================================================

  useEffect(() => {

    const loadTodayAttendance = async () => {

      try {

        setAttendanceLoading(true);


        const data =
          await ReceptionistAttendanceService
            .getAdminTodayStaffAttendance();


        setTodayAttendance(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Failed to load today's staff attendance:",
          error
        );


        setTodayAttendance([]);

      } finally {

        setAttendanceLoading(false);

      }

    };


    loadTodayAttendance();

  }, []);


  // =========================================================
  // MONTH SELECT
  // =========================================================

  const handleMonthSelect = (monthIndex) => {

    setSelectedMonth(monthIndex);

    setShowMonthPicker(false);

  };


  // =========================================================
  // PREVIOUS YEAR
  // =========================================================

  const handlePreviousYear = () => {

    const newYear =
      selectedYear - 1;


    setSelectedYear(newYear);

  };


  // =========================================================
  // NEXT YEAR
  // =========================================================

  const handleNextYear = () => {

    const newYear =
      selectedYear + 1;


    // Do not allow future year

    if (
      newYear > currentYear
    ) {

      return;

    }


    setSelectedYear(newYear);


    if (
      newYear === currentYear &&
      selectedMonth > currentMonth
    ) {

      setSelectedMonth(currentMonth);

    }

  };


  // =========================================================
  // PRESENT STAFF COUNT
  // =========================================================

  const presentTodayCount =
    todayAttendance.filter(
      (employee) =>
        employee.status === "PRESENT" ||
        employee.status === "COMPLETED"
    ).length;


  // =========================================================
  // SELECTED PERIOD
  // =========================================================

  const selectedPeriod =
    `${months[selectedMonth]} ${selectedYear}`;


  return (
    <>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          h-16
          bg-white
          border-b
          border-slate-200
          flex
          items-center
          justify-between
          px-8
          sticky
          top-0
          z-40
        "
      >

        {/* ===================================================
            HEADER TITLE
        =================================================== */}

        <div className="flex items-baseline gap-2">

          <h1 className="text-xl font-bold text-slate-800">

            Dashboard Overview

          </h1>


          <span className="text-sm text-slate-500">

            · {selectedPeriod}

          </span>

        </div>


        {/* ===================================================
            HEADER RIGHT SIDE
        =================================================== */}

        <div className="flex items-center gap-3">


          {/* =================================================
              MONTH / YEAR PICKER
          ================================================= */}

          <div
            className="relative"
            ref={pickerRef}
          >

            <button
              type="button"
              onClick={() =>
                setShowMonthPicker(
                  !showMonthPicker
                )
              }
              className="
                flex
                items-center
                gap-2
                px-3.5
                py-2
                text-sm
                rounded-xl
                border
                border-slate-200
                bg-white
                hover:bg-slate-50
                text-slate-700
                font-medium
              "
            >

              <Calendar
                className="
                  w-4
                  h-4
                  text-slate-500
                "
              />

              {months[selectedMonth].slice(0, 3)}

              {" "}

              {selectedYear}

            </button>


            {/* =================================================
                MONTH PICKER
            ================================================= */}

            {showMonthPicker && (

              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-64
                  bg-white
                  rounded-xl
                  shadow-xl
                  border
                  border-slate-200
                  p-4
                  z-50
                "
              >

                {/* YEAR NAVIGATION */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-4
                  "
                >

                  {/* PREVIOUS YEAR */}

                  <button
                    type="button"
                    onClick={handlePreviousYear}
                    className="
                      p-1.5
                      rounded-lg
                      hover:bg-slate-100
                    "
                  >

                    <ChevronLeft
                      className="
                        w-4
                        h-4
                        text-slate-600
                      "
                    />

                  </button>


                  {/* SELECTED YEAR */}

                  <span
                    className="
                      font-semibold
                      text-slate-800
                    "
                  >

                    {selectedYear}

                  </span>


                  {/* NEXT YEAR */}

                  <button
                    type="button"
                    onClick={handleNextYear}
                    disabled={
                      selectedYear >= currentYear
                    }
                    className={`
                      p-1.5
                      rounded-lg
                      ${
                        selectedYear >= currentYear
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-slate-100"
                      }
                    `}
                  >

                    <ChevronRight
                      className="
                        w-4
                        h-4
                        text-slate-600
                      "
                    />

                  </button>

                </div>


                {/* MONTHS */}

                <div
                  className="
                    grid
                    grid-cols-3
                    gap-2
                  "
                >

                  {months.map(
                    (month, index) => {

                      const isFutureMonth =
                        selectedYear === currentYear &&
                        index > currentMonth;


                      return (

                        <button
                          type="button"
                          key={month}
                          disabled={isFutureMonth}
                          onClick={() =>
                            handleMonthSelect(index)
                          }
                          className={`
                            py-2
                            text-sm
                            rounded-lg
                            font-medium
                            transition
                            ${
                              selectedMonth === index
                                ? "bg-sky-600 text-white"
                                : isFutureMonth
                                ? "text-slate-300 cursor-not-allowed"
                                : "hover:bg-slate-100 text-slate-700"
                            }
                          `}
                        >

                          {month.slice(0, 3)}

                        </button>

                      );

                    }
                  )}

                </div>

              </div>

            )}

          </div>


          {/* =================================================
              NOTIFICATION
          ================================================= */}








        </div>

      </header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="p-8">

        {/* ===================================================
            KPI CARDS
        =================================================== */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-5
            mb-8
          "
        >

          {/* =================================================
              TOTAL USERS
          ================================================= */}

          <div
            className="
              bg-white
              rounded-2xl
              p-5
              border
              border-slate-200
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <div>

                <p className="text-sm text-slate-500 mb-1">

                  Total Users

                </p>


                <p
                  className="
                    text-3xl
                    font-bold
                    text-slate-800
                  "
                >

                  {dashboardLoading
                    ? "..."
                    : dashboardData.totalUsers}

                </p>


                <p className="text-xs text-slate-500 mt-2">

                  Users registered in {months[selectedMonth]}

                </p>

              </div>


              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-sky-50
                  flex
                  items-center
                  justify-center
                "
              >

                <Users
                  className="
                    w-5
                    h-5
                    text-sky-600
                  "
                />

              </div>

            </div>

          </div>


          {/* =================================================
              ACTIVE PLAYERS
          ================================================= */}

          <div
            className="
              bg-white
              rounded-2xl
              p-5
              border
              border-slate-200
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <div>

                <p className="text-sm text-slate-500 mb-1">

                  Active Players

                </p>


                <p
                  className="
                    text-3xl
                    font-bold
                    text-slate-800
                  "
                >

                  {dashboardLoading
                    ? "..."
                    : dashboardData.activePlayers}

                </p>


                <p className="text-xs text-orange-500 mt-2">

                  Active players in {months[selectedMonth]}

                </p>

              </div>


              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-orange-50
                  flex
                  items-center
                  justify-center
                "
              >

                <UserRound
                  className="
                    w-5
                    h-5
                    text-orange-500
                  "
                />

              </div>

            </div>

          </div>


          {/* =================================================
              ALL COACHES
          ================================================= */}

          <div
            className="
              bg-white
              rounded-2xl
              p-5
              border
              border-slate-200
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <div>

                <p className="text-sm text-slate-500 mb-1">

                  All Coaches

                </p>


                <p
                  className="
                    text-3xl
                    font-bold
                    text-slate-800
                  "
                >

                  {dashboardLoading
                    ? "..."
                    : dashboardData.totalCoaches}

                </p>


                <p className="text-xs text-emerald-600 mt-2">

                  Coaches joined in {months[selectedMonth]}

                </p>

              </div>


              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-emerald-50
                  flex
                  items-center
                  justify-center
                "
              >

                <UserRound
                  className="
                    w-5
                    h-5
                    text-emerald-600
                  "
                />

              </div>

            </div>

          </div>


          {/* =================================================
              ACTIVE RECEPTIONISTS
          ================================================= */}

          <div
            className="
              bg-white
              rounded-2xl
              p-5
              border
              border-slate-200
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <div>

                <p className="text-sm text-slate-500 mb-1">

                  Active Receptionists

                </p>


                <p
                  className="
                    text-3xl
                    font-bold
                    text-slate-800
                  "
                >

                  {dashboardLoading
                    ? "..."
                    : dashboardData.activeReceptionists}

                </p>


                <p className="text-xs text-violet-600 mt-2">

                  Active in {months[selectedMonth]}

                </p>

              </div>


              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-violet-50
                  flex
                  items-center
                  justify-center
                "
              >

                <Users
                  className="
                    w-5
                    h-5
                    text-violet-600
                  "
                />

              </div>

            </div>

          </div>


          {/* =================================================
              ACTIVE INVENTORY MANAGERS
          ================================================= */}

          <div
            className="
              bg-white
              rounded-2xl
              p-5
              border
              border-slate-200
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <div>

                <p className="text-sm text-slate-500 mb-1">

                  Active Inventory Managers

                </p>


                <p
                  className="
                    text-3xl
                    font-bold
                    text-slate-800
                  "
                >

                  {dashboardLoading
                    ? "..."
                    : dashboardData.activeInventoryManagers}

                </p>


                <p className="text-xs text-sky-600 mt-2">

                  Active in {months[selectedMonth]}

                </p>

              </div>


              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-sky-50
                  flex
                  items-center
                  justify-center
                "
              >

                <Users
                  className="
                    w-5
                    h-5
                    text-sky-600
                  "
                />

              </div>

            </div>

          </div>


          {/* =================================================
              ACTIVE CLEANING STAFF
          ================================================= */}

          <div
            className="
              bg-white
              rounded-2xl
              p-5
              border
              border-slate-200
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <div>

                <p className="text-sm text-slate-500 mb-1">

                  Active Cleaning Staff

                </p>


                <p
                  className="
                    text-3xl
                    font-bold
                    text-slate-800
                  "
                >

                  {dashboardLoading
                    ? "..."
                    : dashboardData.activeCleaningStaff}

                </p>


                <p className="text-xs text-orange-500 mt-2">

                  Active in {months[selectedMonth]}

                </p>

              </div>


              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-orange-50
                  flex
                  items-center
                  justify-center
                "
              >

                <Users
                  className="
                    w-5
                    h-5
                    text-orange-500
                  "
                />

              </div>

            </div>

          </div>


          {/* =================================================
              ACTIVE BATCHES
          ================================================= */}

          <div
            className="
              bg-white
              rounded-2xl
              p-5
              border
              border-slate-200
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <div>

                <p className="text-sm text-slate-500 mb-1">

                  Active Batches

                </p>


                <p
                  className="
                    text-3xl
                    font-bold
                    text-slate-800
                  "
                >

                  {dashboardLoading
                    ? "..."
                    : dashboardData.activeBatches}

                </p>


                <p className="text-xs text-emerald-600 mt-2">

                  Active during {months[selectedMonth]}

                </p>

              </div>


              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-emerald-50
                  flex
                  items-center
                  justify-center
                "
              >

                <CalendarDays
                  className="
                    w-5
                    h-5
                    text-emerald-600
                  "
                />

              </div>

            </div>

          </div>


          {/* =================================================
              STAFF ATTENDANCE TODAY
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/staff-attendance"
              )
            }
            className="
              text-left
              bg-white
              rounded-2xl
              p-5
              border
              border-slate-200
              shadow-sm
              hover:border-violet-300
              hover:shadow-md
              transition
              cursor-pointer
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <div>

                <p className="text-sm text-slate-500 mb-1">

                  Staff Attendance Today

                </p>


                <p
                  className="
                    text-3xl
                    font-bold
                    text-slate-800
                  "
                >

                  {attendanceLoading
                    ? "..."
                    : presentTodayCount}

                </p>


                <p className="text-xs text-sky-600 mt-2">

                  {attendanceLoading
                    ? "Loading attendance..."
                    : `Present out of ${todayAttendance.length} staff`}

                </p>

              </div>


              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-violet-50
                  flex
                  items-center
                  justify-center
                "
              >

                <CalendarDays
                  className="
                    w-5
                    h-5
                    text-violet-600
                  "
                />

              </div>

            </div>

          </button>

        </div>

      </main>

    </>
  );
}