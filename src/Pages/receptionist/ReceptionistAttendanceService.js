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