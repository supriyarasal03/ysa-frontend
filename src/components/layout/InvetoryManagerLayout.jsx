import React, { useEffect, useState } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  CalendarDays,
  LogOut,
  Menu,
  Bell,
  X,
  Clock,
} from "lucide-react";

import InnventoryManagerService
  from "../../Pages/innventoty-manager/InnventoryManagerService";


const InventoryManagerLayout = () => {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [todayAttendance, setTodayAttendance] =
    useState(null);

  const [attendanceActionLoading, setAttendanceActionLoading] =
    useState(false);

  const [attendanceMessage, setAttendanceMessage] =
    useState("");

  const [attendanceError, setAttendanceError] =
    useState("");

  const navigate = useNavigate();


  // ==========================================================
  // LOAD TODAY'S ATTENDANCE
  // ==========================================================

  const loadTodayAttendance = async () => {

    try {

      const response =
        await InnventoryManagerService.getTodayAttendance();

      setTodayAttendance(response || null);

    } catch (error) {

      /*
       * If there is no attendance record for today,
       * backend may return an error.
       *
       * Do not show that as a layout error.
       */

      setTodayAttendance(null);

    }

  };


  // ==========================================================
  // LOAD ATTENDANCE ON LAYOUT LOAD
  // ==========================================================

  useEffect(() => {

    loadTodayAttendance();

  }, []);


  // ==========================================================
  // PUNCH IN
  // ==========================================================

  const handlePunchIn = async () => {

    if (attendanceActionLoading) {
      return;
    }

    setAttendanceMessage("");
    setAttendanceError("");
    setAttendanceActionLoading(true);

    try {

      const response =
        await InnventoryManagerService.punchIn();

      setTodayAttendance(response);

      setAttendanceMessage(
        response?.message ||
        "Punch in successful."
      );

      /*
       * Notify attendance page so that it can
       * refresh its records without browser reload.
       */

      window.dispatchEvent(
        new Event("attendance-updated")
      );

    } catch (error) {

      console.error(
        "Punch in error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to punch in.";

      setAttendanceError(message);

      /*
       * Refresh today's attendance because the
       * backend may already have a punch-in record.
       */

      await loadTodayAttendance();

    } finally {

      setAttendanceActionLoading(false);

    }

  };


  // ==========================================================
  // PUNCH OUT
  // ==========================================================

  const handlePunchOut = async () => {

    if (attendanceActionLoading) {
      return;
    }

    setAttendanceMessage("");
    setAttendanceError("");
    setAttendanceActionLoading(true);

    try {

      const response =
        await InnventoryManagerService.punchOut();

      setTodayAttendance(response);

      setAttendanceMessage(
        response?.message ||
        "Punch out successful."
      );

      /*
       * Notify attendance page so that the
       * latest punch-out record appears immediately.
       */

      window.dispatchEvent(
        new Event("attendance-updated")
      );

    } catch (error) {

      console.error(
        "Punch out error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to punch out.";

      setAttendanceError(message);

      await loadTodayAttendance();

    } finally {

      setAttendanceActionLoading(false);

    }

  };


  // ==========================================================
  // DYNAMIC ATTENDANCE BUTTON
  // ==========================================================

  const handleAttendanceAction = () => {

    /*
     * No attendance today
     * -> Punch In
     */

    if (!todayAttendance) {

      handlePunchIn();

      return;
    }


    /*
     * Punched in but not punched out
     * -> Punch Out
     */

    if (
      todayAttendance.punchInTime &&
      !todayAttendance.punchOutTime
    ) {

      handlePunchOut();

      return;
    }


    /*
     * Already completed today
     * -> Show message
     */

    if (
      todayAttendance.punchInTime &&
      todayAttendance.punchOutTime
    ) {

      setAttendanceError(
        "Attendance already completed for today."
      );

    }

  };


  // ==========================================================
  // BUTTON TEXT
  // ==========================================================

  let attendanceButtonText = "Punch In";

  let attendanceButtonClass =
    "bg-sky-500 hover:bg-sky-600";


  /*
   * After Punch In
   */

  if (
    todayAttendance?.punchInTime &&
    !todayAttendance?.punchOutTime
  ) {

    attendanceButtonText = "Punch Out";

    attendanceButtonClass =
      "bg-amber-500 hover:bg-amber-600";

  }


  /*
   * After Punch Out
   *
   * Button becomes Punch In again.
   */

  if (
    todayAttendance?.punchInTime &&
    todayAttendance?.punchOutTime
  ) {

    attendanceButtonText = "Punch In";

    attendanceButtonClass =
      "bg-sky-500 hover:bg-sky-600";

  }


  // ==========================================================
  // NAVIGATION ITEMS
  // ==========================================================

  const navItems = [

    {
      name: "Dashboard",
      path: "/innventory-manager",
      icon: LayoutDashboard,
      end: true,
    },

    {
      name: "Inventory Management",
      path: "/inventory",
      icon: Package,
      end: false,
    },

    {
      name: "Inventory Transaction History",
      path: "/innventory/history",
      icon: Package,
      end: false,
    },

    {
      name: "Attendance",
      path: "/innventory-attendance",
      icon: CalendarDays,
      end: false,
    },

  ];


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");

  };


  // ==========================================================
  // RETURN
  // ==========================================================

  return (

    <div className="flex h-screen bg-gray-50 font-sans">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          bg-[#0f172a] text-white
          transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:static lg:translate-x-0
        `}
      >


        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold">

              Y

            </div>

            <div>

              <h1 className="text-base font-semibold tracking-wide">
                Yashree Sports
              </h1>

              <p className="text-xs text-slate-400">
                Inventory Manager
              </p>

            </div>

          </div>


          {/* Mobile Close */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >

            <X className="h-5 w-5" />

          </button>

        </div>


        {/* ===================================================
            ATTENDANCE ACTION
        =================================================== */}

        <div className="border-b border-slate-700/50 px-4 py-4">

          <button
            type="button"
            onClick={handleAttendanceAction}
            disabled={attendanceActionLoading}
            className={`
              flex w-full items-center
              justify-center gap-2
              rounded-xl
              py-2.5
              text-sm font-semibold
              text-white
              shadow-md
              transition-all
              duration-200
              disabled:cursor-not-allowed
              disabled:opacity-60
              ${attendanceButtonClass}
            `}
          >

            <Clock className="h-4 w-4" />

            {attendanceActionLoading
              ? "Processing..."
              : attendanceButtonText}

          </button>


          {/* Success Message */}

          {attendanceMessage && (

            <p className="mt-2 text-center text-xs text-emerald-400">

              {attendanceMessage}

            </p>

          )}


          {/* Error Message */}

          {attendanceError && (

            <p className="mt-2 text-center text-xs text-red-400">

              {attendanceError}

            </p>

          )}

        </div>


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav className="space-y-1 px-3 py-6">

          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">

            Overview

          </p>


          {navItems.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  rounded-xl px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                  `
                }
              >

                <Icon className="h-5 w-5" />

                {item.name}

              </NavLink>

            );

          })}

        </nav>


        {/* ===================================================
            BOTTOM USER SECTION
        =================================================== */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/50 p-4">

          <div className="mb-3 flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">

              IM

            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-medium">

                Inventory Manager

              </p>

              <p className="truncate text-xs text-slate-400">

                inventory@yashree.com

              </p>

            </div>

          </div>


          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full items-center
              justify-center gap-2
              rounded-xl bg-slate-800
              py-2.5 text-sm font-medium
              transition-colors
              hover:bg-slate-700
            "
          >

            <LogOut className="h-4 w-4" />

            Logout

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">


        {/* ===================================================
            TOP HEADER
        =================================================== */}

        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            >

              <Menu className="h-5 w-5" />

            </button>


            <div>

              <h2 className="text-lg font-semibold text-gray-900">

                Inventory Manager Dashboard

              </h2>

              <p className="text-sm text-gray-500">

                Manage academy inventory

              </p>

            </div>

          </div>


          {/* Notification */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              className="relative rounded-xl p-2 text-gray-600 hover:bg-gray-100"
            >

              <Bell className="h-5 w-5" />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />

            </button>

          </div>

        </header>


        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">

          <Outlet />

        </main>

      </div>


      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (

        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

    </div>

  );

};


export default InventoryManagerLayout;