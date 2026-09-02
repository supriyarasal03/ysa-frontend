import attendanceAxiosClient from "../../api/attendanceAxiosClient";

const AdminAttendanceService = {

  // ==========================================================
  // GET TODAY'S ATTENDANCE
  // ==========================================================

  getTodayAttendance: async () => {
    const res = await attendanceAxiosClient.get(
      "/employee-attendance/today"
    );

    return res.data;
  },


  // ==========================================================
  // GET MY ATTENDANCE HISTORY
  // ==========================================================

  getMyAttendance: async () => {
    const res = await attendanceAxiosClient.get(
      "/employee-attendance/my"
    );

    return res.data;
  },


  // ==========================================================
  // PUNCH IN
  // ==========================================================

  punchIn: async () => {
    const res = await attendanceAxiosClient.post(
      "/employee-attendance/punch-in"
    );

    return res.data;
  },


  // ==========================================================
  // PUNCH OUT
  // ==========================================================

  punchOut: async () => {
    const res = await attendanceAxiosClient.post(
      "/employee-attendance/punch-out"
    );

    return res.data;
  },

};

export default AdminAttendanceService;