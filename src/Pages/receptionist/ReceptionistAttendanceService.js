import axiosClient from "../../api/axiosClient";

import attendancePunchAxiosClient
  from "../../api/attendancePunchAxiosClient";


const ReceptionistAttendanceService = {

  // ==========================================================
  // GET TODAY'S ATTENDANCE
  // ==========================================================

  getTodayAttendance: async () => {

    const res = await axiosClient.get(
      "/employee-attendance/today"
    );

    return res.data;
  },


  // ==========================================================
  // GET MY ATTENDANCE HISTORY
  // ==========================================================

  getMyAttendance: async () => {

    const res = await axiosClient.get(
      "/employee-attendance/my"
    );

    return res.data;
  },


  // ==========================================================
  // ADMIN - GET STAFF LIST
  //
  // keyword = employee name or username
  // role = staff role
  // ==========================================================

  getAdminStaffList: async (
    keyword = "",
    role = ""
  ) => {

    const params = {};

    if (keyword && keyword.trim()) {
      params.keyword = keyword.trim();
    }

    if (role && role !== "ALL") {
      params.role = role;
    }

    const res = await axiosClient.get(
      "/employee-attendance/admin/staff",
      {
        params,
      }
    );

    return res.data;
  },




  // ==========================================================
  // ADMIN - GET TODAY'S ATTENDANCE OF ALL STAFF
  // ==========================================================

  getAdminTodayStaffAttendance: async () => {
    const res = await axiosClient.get(
      "/employee-attendance/admin/today"
    );

    return res.data;
  },

  getAdminStaffAttendanceHistory: async (
    userId
  ) => {
    const res = await axiosClient.get(
      `/employee-attendance/admin/staff/${userId}/history`
    );
    return res.data;
  },







  // ==========================================================
  // ADMIN - GET SELECTED STAFF ATTENDANCE HISTORY
  // ==========================================================

  getAdminStaffAttendanceHistory: async (
    userId
  ) => {

    const res = await axiosClient.get(
      `/employee-attendance/admin/staff/${userId}/history`
    );

    return res.data;
  },


  // ==========================================================
  // PUNCH IN
  // USE ACADEMY NETWORK CLIENT
  // ==========================================================

  punchIn: async () => {

    const res = await attendancePunchAxiosClient.post(
      "/employee-attendance/punch-in"
    );

    return res.data;
  },


  // ==========================================================
  // PUNCH OUT
  // USE ACADEMY NETWORK CLIENT
  // ==========================================================

  punchOut: async () => {

    const res = await attendancePunchAxiosClient.post(
      "/employee-attendance/punch-out"
    );

    return res.data;
  },

};







export default ReceptionistAttendanceService;