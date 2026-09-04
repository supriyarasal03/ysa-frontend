import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Trophy,
  UserRoundCog,
  CalendarCheck2,
  Package,
  LogOut,
  Menu,
  X,
  Clock,
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import axiosClient from "../../api/axiosClient";
import AdminAttendanceService from "../../Pages/admin/AdminAttendanceService";


const AdminLayout = () => {

  const [sidebarOpen, setSidebarOpen] =
    React.useState(true);

  const [todayAttendance, setTodayAttendance] =
    useState(null);

  const [attendanceLoading, setAttendanceLoading] =
    useState(false);

  const [adminName, setAdminName] =
    useState("");

  const navigate = useNavigate();


  // ==========================================================
  // ADMIN PROFILE
  // ==========================================================

  const loadAdminProfile = async () => {

    try {

      const response =
        await axiosClient.get("/admin/profile");

      const firstName =
        response?.data?.firstName || "";

      const lastName =
        response?.data?.lastName || "";

      setAdminName(
        `${firstName} ${lastName}`.trim()
      );

    } catch (error) {

      console.error(
        "Admin profile loading error:",
        error
      );

    }

  };


  // ==========================================================
  // ATTENDANCE
  // ==========================================================

  const loadTodayAttendance = async () => {

    try {

      const response =
        await AdminAttendanceService.getTodayAttendance();

      if (response?.data) {
        setTodayAttendance(response.data);
      } else {
        setTodayAttendance(response);
      }

    } catch (error) {

      console.error(
        "Attendance loading error:",
        error
      );

      setTodayAttendance(null);

    }

  };


  useEffect(() => {

    loadAdminProfile();

    loadTodayAttendance();

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


  const handleAttendance = async () => {

    if (attendanceLoading) {
      return;
    }

    try {

      setAttendanceLoading(true);

      let response;

      if (
        todayAttendance?.punchInTime &&
        !todayAttendance?.punchOutTime
      ) {

        response =
          await AdminAttendanceService.punchOut();

      } else {

        response =
          await AdminAttendanceService.punchIn();

      }


      if (response?.data) {
        setTodayAttendance(response.data);
      } else {
        setTodayAttendance(response);
      }


      window.dispatchEvent(
        new Event("attendanceUpdated")
      );











    } catch (error) {

  if (
    error?.code === "ERR_NETWORK" ||
    error?.code === "ECONNABORTED" ||
    error?.code === "ETIMEDOUT" ||
    error?.message === "Network Error"
  ) {

    window.alert(
      "Please connect to Academy Wi-Fi."
    );

  } else if (error?.response?.status === 403) {

    window.alert(
      "Attendance can only be marked from Academy Wi-Fi."
    );

  } else {

    console.error(
      "Attendance action error:",
      error
    );

    window.alert(
      error?.response?.data?.message ||
      "Unable to mark attendance. Please try again."
    );

  }








    } finally {

      setAttendanceLoading(false);

    }

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
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Staff Managment",
      path: "/admin/staff-management",
      icon: Users,
    },
    {
      name: "Sports Managment",
      path: "/admin/sport-management",
      icon: Trophy,
    },
    
    
    {
      name: "Coach Managment",
      path: "/admin/coach-managmnet",
      icon: UserRoundCog,
    },

    {
      name: "Batch Managment",
      path: "/admin/batch-managmnet",
      icon: Package,
    },


    {
      name: "Attendance",
      path: "/admin/attendance",
      icon: CalendarCheck2,
    },




    
  ];


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f3f6fa",
        display: "flex",
      }}
    >

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        style={{
          width: sidebarOpen ? "270px" : "80px",
          background: "#0d172c",
          color: "#fff",
          minHeight: "100vh",
          transition: "width 0.2s ease",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >

        {/* LOGO */}

        <div
          style={{
            padding: "28px 24px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >

          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#2864e8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "700",
              flexShrink: 0,
            }}
          >
            Y
          </div>


          {sidebarOpen && (

            <div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Yashashree Sports
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#8ca1c0",
                  marginTop: "4px",
                }}
              >
                {adminName || "Admin Panel"}
              </div>

            </div>

          )}

        </div>


        {/* ATTENDANCE BUTTON */}

        {sidebarOpen &&
          !(
            todayAttendance?.punchInTime &&
            todayAttendance?.punchOutTime
          ) && (

          <div
            style={{
              padding: "18px 16px 0",
            }}
          >

            <button
              type="button"
              onClick={handleAttendance}
              disabled={attendanceLoading}


              style={{
                width: "100%",
                border: "none",
                borderRadius: "10px",
                padding: "12px 14px",
                background: "#1d2a40",
                color: "#fff",


                cursor: attendanceLoading
                  ? "not-allowed"
                  : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "15px",
                fontWeight: "600",
                opacity: attendanceLoading
                  ? 0.7
                  : 1,
              }}
            >

              <Clock size={19} />

              {attendanceLoading
                ? "Processing..."
                : todayAttendance?.punchInTime
                  ? "Punch Out"
                  : "Punch In"}

            </button>

          </div>

        )}


        {/* SIDEBAR MENU */}

        <nav
          style={{
            padding: "24px 16px",
            flex: 1,
          }}
        >

          <div
            style={{
              color: "#7184a3",
              fontSize: "12px",
              marginBottom: "14px",
              paddingLeft: sidebarOpen
                ? "20px"
                : "0",
              textAlign: sidebarOpen
                ? "left"
                : "center",
            }}
          >
            {sidebarOpen ? "OVERVIEW" : "•••"}
          </div>


          {navigationItems.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: sidebarOpen
                    ? "flex-start"
                    : "center",
                  gap: "14px",
                  padding: "14px 18px",
                  marginBottom: "7px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: isActive
                    ? "#fff"
                    : "#c4d0e2",
                  background: isActive
                    ? "#2864e8"
                    : "transparent",
                  fontSize: "15px",
                  fontWeight: isActive
                    ? "600"
                    : "500",
                })}
              >

                <Icon size={21} />

                {sidebarOpen && item.name}

              </NavLink>

            );

          })}

        </nav>


        {/* LOGOUT */}

        <div
          style={{
            padding: "18px 16px 24px",
            borderTop:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              background: "#1d2a40",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: sidebarOpen
                ? "flex-start"
                : "center",
              gap: "12px",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >

            <LogOut size={20} />

            {sidebarOpen && "Logout"}

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <main
        style={{
          marginLeft: sidebarOpen
            ? "270px"
            : "80px",
          width: "100%",
          minHeight: "100vh",
          transition: "margin-left 0.2s ease",
        }}
      >

        {/* HEADER */}

        <header
          style={{
            height: "82px",
            background: "#fff",
            borderBottom: "1px solid #e8edf3",
            display: "flex",
            alignItems: "center",
            padding: "0 30px",
            boxSizing: "border-box",
            gap: "18px",
          }}
        >

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(
                (previous) => !previous
              )
            }
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Menu size={23} color="#596b84" />
          </button>


          <div>

            <h2
              style={{
                margin: 0,
                color: "#07152f",
                fontSize: "30px",
                fontWeight: "600",
              }}
            >
              Welcome, {adminName || "Admin"}
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#71849e",
                fontSize: "14px",
              }}
            >
              Manage Yashree Sports Academy
            </p>

          </div>

        </header>


        {/* PAGE */}

        <Outlet />

      </main>

    </div>
  );
};


export default AdminLayout;