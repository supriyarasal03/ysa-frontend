import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Menu,
  X,
  LogOut,
  UserRound,
  Clock3,
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import CoachAttendanceService from "../../Pages/coach/CoachAttendanceService.js";


const CoachLayout = () => {

  // ==========================================================
  // STATES
  // ==========================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [todayAttendance, setTodayAttendance] =
    useState(null);

  const [attendanceLoading, setAttendanceLoading] =
    useState(true);

  const [attendanceActionLoading, setAttendanceActionLoading] =
    useState(false);

  const navigate = useNavigate();


  // ==========================================================
  // GET LOGGED-IN USERNAME
  // ==========================================================

  const getLoggedInUsername = () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {
        return "Coach";
      }

      const payload =
        JSON.parse(
          atob(
            token
              .split(".")[1]
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        );

      return payload?.sub || "Coach";

    } catch (error) {

      console.error(
        "Unable to read username:",
        error
      );

      return "Coach";
    }
  };


  const username =
    getLoggedInUsername();


  // ==========================================================
  // LOAD TODAY'S ATTENDANCE
  // ==========================================================

  const loadTodayAttendance = async () => {

    try {

      setAttendanceLoading(true);

      const response =
        await CoachAttendanceService
          .getTodayAttendance();

      /*
       * IMPORTANT:
       * Do not clear existing attendance if the API
       * temporarily gives an empty/undefined response.
       */
      if (response) {

        setTodayAttendance(response);

      }

    } catch (error) {

      if (
        error?.response?.status === 404
      ) {

        setTodayAttendance(null);

      } else {

        console.error(
          "Today's attendance loading error:",
          error
        );

      }

    } finally {

      setAttendanceLoading(false);

    }
  };


  // ==========================================================
  // INITIAL ATTENDANCE LOAD
  // ==========================================================

  useEffect(() => {

    loadTodayAttendance();

  }, []);


  // ==========================================================
  // LISTEN FOR ATTENDANCE UPDATE
  // ==========================================================

  useEffect(() => {

    const handleAttendanceUpdated = () => {

      loadTodayAttendance();

    };

    window.addEventListener(
      "attendanceUpdated",
      handleAttendanceUpdated
    );

    return () => {

      window.removeEventListener(
        "attendanceUpdated",
        handleAttendanceUpdated
      );

    };

  }, []);


  // ==========================================================
  // CHECK PUNCH IN
  // ==========================================================

  const hasPunchIn =
    Boolean(
      todayAttendance?.punchInTime
    );


  // ==========================================================
  // CHECK PUNCH OUT
  // ==========================================================

  const hasPunchOut =
    Boolean(
      todayAttendance?.punchOutTime
    );


  // ==========================================================
  // CHECK ATTENDANCE COMPLETED
  // ==========================================================

  const attendanceCompleted =
    hasPunchIn &&
    hasPunchOut;


  // ==========================================================
  // PUNCH IN / PUNCH OUT
  // ==========================================================

  const handleAttendance = async () => {

    /*
     * Prevent duplicate request.
     */
    if (attendanceActionLoading) {
      return;
    }


    /*
     * Prevent Punch In after attendance is completed.
     */
    if (attendanceCompleted) {

      alert(
        "Today's attendance is already completed."
      );

      return;
    }


    try {

      setAttendanceActionLoading(true);


      let response;


      // ------------------------------------------------------
      // PUNCH IN
      // ------------------------------------------------------

      if (!todayAttendance) {

        response =
          await CoachAttendanceService
            .punchIn();

      }


      // ------------------------------------------------------
      // PUNCH OUT
      // ------------------------------------------------------

      else if (
        hasPunchIn &&
        !hasPunchOut
      ) {

        response =
          await CoachAttendanceService
            .punchOut();

      }


      // ------------------------------------------------------
      // ALREADY COMPLETED
      // ------------------------------------------------------

      else {

        alert(
          "Today's attendance is already completed."
        );

        return;

      }


      // ======================================================
      // IMPORTANT FIX
      // ======================================================
      //
      // Use the response returned from the punch API
      // immediately instead of depending only on another GET.
      //
      // This prevents the button from incorrectly changing
      // back to "Punch In".
      // ======================================================

      if (response) {

        setTodayAttendance(response);

      }


      // ------------------------------------------------------
      // UPDATE ATTENDANCE PAGE IMMEDIATELY
      // ------------------------------------------------------

      window.dispatchEvent(
        new Event("attendanceUpdated")
      );


    } catch (error) {

      console.error(
        "Attendance action error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Attendance action failed.";

      alert(message);


      /*
       * Refresh only after an error.
       */
      await loadTodayAttendance();

    } finally {

      setAttendanceActionLoading(false);

    }

  };


  // ==========================================================
  // BUTTON TEXT
  // ==========================================================

  const getAttendanceButtonText = () => {

    if (attendanceActionLoading) {

      return "Processing...";

    }


    if (attendanceLoading) {

      return "Punch In";

    }


    // No attendance today
    if (!todayAttendance) {

      return "Punch In";

    }


    // Punched in but not punched out
    if (
      hasPunchIn &&
      !hasPunchOut
    ) {

      return "Punch Out";

    }


    // Punched in + punched out
    if (attendanceCompleted) {

      return "Completed";

    }


    return "Punch In";

  };


  // ==========================================================
  // BUTTON STYLE
  // ==========================================================

  const getAttendanceButtonClass = () => {

    // --------------------------------------------------------
    // PUNCH OUT
    // --------------------------------------------------------

    if (
      hasPunchIn &&
      !hasPunchOut
    ) {

      return `
        bg-amber-500
        hover:bg-amber-600
        text-white
      `;

    }


    // --------------------------------------------------------
    // COMPLETED
    // --------------------------------------------------------

    if (attendanceCompleted) {

      return `
        bg-slate-400
        text-white
        cursor-not-allowed
      `;

    }


    // --------------------------------------------------------
    // PUNCH IN
    // --------------------------------------------------------

    return `
      bg-sky-500
      hover:bg-sky-600
      text-white
    `;

  };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const navigationItems = [

    {
      name: "Dashboard",
      path: "/coach",
      icon: LayoutDashboard,
    },

    {
      name: "Attendance",
      path: "/coach-attendance",
      icon: CalendarDays,
    },

  ];


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="flex h-screen bg-gray-50 font-sans">


      {/* ======================================================
          SIDEBAR
      ======================================================= */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-64
          bg-[#0f172a]
          text-white
          transform
          transition-transform
          duration-300
          ease-in-out

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
          lg:static
          lg:inset-0

          flex
          flex-col
        `}
      >


        {/* ==================================================
            LOGO
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-3
            px-6
            py-5
            border-b
            border-slate-700/50
          "
        >

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-blue-600
              flex
              items-center
              justify-center
              font-bold
              text-lg
              shrink-0
            "
          >

            Y

          </div>


          <div>

            <h1
              className="
                text-base
                font-semibold
                tracking-wide
              "
            >
              Yashree Sports
            </h1>

            <p
              className="
                text-xs
                text-slate-400
                mt-1
              "
            >
              Coach Panel
            </p>

          </div>

        </div>


        {/* ==================================================
            PUNCH BUTTON
        =================================================== */}

        <div
          className="
            px-5
            py-6
          "
        >

          <button
            type="button"
            onClick={handleAttendance}
            disabled={
              attendanceActionLoading ||
              attendanceCompleted
            }
            className={`
              w-full
              rounded-xl
              py-3
              px-4
              flex
              items-center
              justify-center
              gap-2
              text-sm
              font-semibold
              transition

              ${getAttendanceButtonClass()}
            `}
          >

            <Clock3
              className="w-5 h-5"
            />

            {getAttendanceButtonText()}

          </button>

        </div>


        {/* ==================================================
            NAVIGATION
        =================================================== */}

        <nav
          className="
            flex-1
            px-4
          "
        >

          <div
            className="
              px-5
              mb-3
              text-xs
              font-medium
              text-slate-500
              uppercase
            "
          >
            Overview
          </div>


          {navigationItems.map(
            (item) => {

              const Icon =
                item.icon;

              return (

                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({
                    isActive,
                  }) => `
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    mb-1
                    rounded-xl
                    text-sm
                    font-medium
                    transition

                    ${
                      isActive
                        ? `
                          bg-blue-600
                          text-white
                        `
                        : `
                          text-slate-300
                          hover:bg-slate-800
                          hover:text-white
                        `
                    }
                  `}
                >

                  <Icon
                    className="w-5 h-5"
                  />

                  {item.name}

                </NavLink>

              );

            }
          )}

        </nav>


        {/* ==================================================
            USER SECTION
        =================================================== */}

        <div
          className="
            border-t
            border-slate-700/50
            px-5
            py-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-4
            "
          >

            <div
              className="
                w-11
                h-11
                rounded-full
                bg-blue-600
                flex
                items-center
                justify-center
                shrink-0
              "
            >

              <UserRound
                className="w-5 h-5"
              />

            </div>


            <div
              className="
                min-w-0
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  truncate
                "
              >
                {username}
              </p>

              <p
                className="
                  text-xs
                  text-slate-400
                  mt-1
                "
              >
                Coach
              </p>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-slate-800
              hover:bg-slate-700
              text-white
              py-3
              text-sm
              font-medium
              transition
            "
          >

            <LogOut
              className="w-5 h-5"
            />

            Logout

          </button>

        </div>

      </aside>


      {/* ======================================================
          MAIN AREA
      ======================================================= */}

      <div
        className="
          flex-1
          min-w-0
          flex
          flex-col
        "
      >


        {/* ==================================================
            HEADER
        =================================================== */}

        <header
          className="
            h-24
            bg-white
            border-b
            border-slate-200
            flex
            items-center
            px-7
            shrink-0
          "
        >

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(
                (previous) =>
                  !previous
              )
            }
            className="
              mr-5
              p-1
              text-slate-500
              hover:text-slate-800
            "
          >

            {sidebarOpen ? (

              <X
                className="w-6 h-6"
              />

            ) : (

              <Menu
                className="w-6 h-6"
              />

            )}

          </button>


          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-slate-900
              "
            >
              Coach Dashboard
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              Manage coaching and daily operations
            </p>

          </div>


          {/* NOTIFICATION */}

          <div
            className="
              ml-auto
              relative
              text-slate-600
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
              "
            >

              <span
                className="
                  text-2xl
                "
              >
                ♧
              </span>

            </div>

            <span
              className="
                absolute
                top-1
                right-1
                w-2
                h-2
                rounded-full
                bg-red-500
              "
            />

          </div>

        </header>


        {/* ==================================================
            PAGE CONTENT
        =================================================== */}

        <main
          className="
            flex-1
            overflow-y-auto
          "
        >

          <Outlet />

        </main>

      </div>

    </div>

  );

};


export default CoachLayout;