import attendanceAxiosClient from "../../api/attendanceAxiosClient";
import attendancePunchAxiosClient from "../../api/attendancePunchAxiosClient";

const CoachAttendanceService = {

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

    const res = await attendancePunchAxiosClient.post(
      "/employee-attendance/punch-in"
    );

    return res.data;
  },


  // ==========================================================
  // PUNCH OUT
  // ==========================================================

  punchOut: async () => {

    const res = await attendancePunchAxiosClient.post(
      "/employee-attendance/punch-out"
    );

    return res.data;
  },

};

export default CoachAttendanceService;