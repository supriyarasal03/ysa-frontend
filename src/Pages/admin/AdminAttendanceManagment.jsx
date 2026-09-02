import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  UserCheck,
  UserX,
} from "lucide-react";

import AdminAttendanceService from "./AdminAttendanceService";

export default function AdminAttendanceManagement() {

  // ==========================================================
  // STATES
  // ==========================================================

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  // ==========================================================
  // LOAD ATTENDANCE
  // ==========================================================

  const loadAttendance = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const todayResponse =
        await AdminAttendanceService.getTodayAttendance();

      const historyResponse =
        await AdminAttendanceService.getMyAttendance();


      // ------------------------------------------------------
      // TODAY'S ATTENDANCE
      // ------------------------------------------------------

      if (todayResponse?.data) {

        setTodayAttendance(todayResponse.data);

      } else {

        setTodayAttendance(todayResponse);

      }


      // ------------------------------------------------------
      // ATTENDANCE HISTORY
      // ------------------------------------------------------

      let records = [];

      if (Array.isArray(historyResponse?.data)) {

        records = historyResponse.data;

      } else if (Array.isArray(historyResponse)) {

        records = historyResponse;

      }


      // ------------------------------------------------------
      // LATEST DATE FIRST
      // ------------------------------------------------------

      records.sort((a, b) => {

        const dateA =
          new Date(
            `${a.attendanceDate || "1900-01-01"}T${
              a.punchInTime || "00:00:00"
            }`
          ).getTime();

        const dateB =
          new Date(
            `${b.attendanceDate || "1900-01-01"}T${
              b.punchInTime || "00:00:00"
            }`
          ).getTime();

        return dateB - dateA;

      });


      setAttendanceHistory(records);

    } catch (error) {

      console.error(
        "Attendance loading error:",
        error
      );

      if (error?.response?.status === 404) {

        setTodayAttendance(null);
        setAttendanceHistory([]);

      } else {

        setErrorMessage(
          error?.response?.data?.message ||
          "Unable to load attendance records."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // LOAD ON PAGE OPEN + LISTEN FOR ATTENDANCE UPDATE
  // ==========================================================

  useEffect(() => {

    // Load attendance when page opens
    loadAttendance();


    // --------------------------------------------------------
    // LISTEN FOR PUNCH IN / PUNCH OUT UPDATE
    // --------------------------------------------------------

    const handleAttendanceUpdated = () => {

      loadAttendance();

    };


    window.addEventListener(
      "attendanceUpdated",
      handleAttendanceUpdated
    );


    // --------------------------------------------------------
    // CLEANUP
    // --------------------------------------------------------

    return () => {

      window.removeEventListener(
        "attendanceUpdated",
        handleAttendanceUpdated
      );

    };

  }, []);


  // ==========================================================
  // FORMAT TIME
  // ==========================================================

  const formatTime = (time) => {

    if (!time) {
      return "--";
    }

    try {

      const parts = time.split(":");

      if (parts.length < 2) {
        return time;
      }

      let hours = parseInt(parts[0], 10);

      const minutes = parts[1];

      const period =
        hours >= 12 ? "PM" : "AM";

      hours = hours % 12;

      if (hours === 0) {
        hours = 12;
      }

      return `${hours}:${minutes} ${period}`;

    } catch {

      return time;

    }
  };


  // ==========================================================
  // FORMAT HOURS
  // ==========================================================

  const formatHours = (hours) => {

    if (
      hours === null ||
      hours === undefined ||
      hours === ""
    ) {

      return "--";

    }

    return `${hours} Hrs`;

  };


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {

    if (!date) {
      return "--";
    }

    try {

      const [year, month, day] =
        date.split("-");

      return `${day}-${month}-${year}`;

    } catch {

      return date;

    }

  };


  // ==========================================================
  // PRESENT DAYS
  // ==========================================================

  const presentDays =
    new Set(
      attendanceHistory
        .map(
          (record) =>
            record.attendanceDate
        )
        .filter(Boolean)
    ).size;


  // ==========================================================
  // SUMMARY VALUES
  // ==========================================================

  const absentDays = "--";

  const totalDays = attendanceHistory.length;


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="min-h-screen bg-slate-100 p-6">


      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-7">

        <h1 className="text-3xl font-semibold text-slate-800">
          My Attendance
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          View your attendance summary and attendance records
        </p>

      </div>


      {/* ======================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {successMessage && (

        <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-600">

          <CheckCircle className="w-4 h-4" />

          {successMessage}

        </div>

      )}


      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {errorMessage && (

        <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">

          <AlertCircle className="w-4 h-4" />

          {errorMessage}

        </div>

      )}


      {/* ======================================================
          ATTENDANCE SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-7">


        {/* ====================================================
            ABSENT DAYS
        ==================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center gap-5">

            <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center">

              <UserX className="w-7 h-7 text-red-500" />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Absent Days
              </p>

              <p className="text-3xl font-semibold text-slate-800 mt-1">
                {absentDays}
              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            PRESENT DAYS
        ==================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center gap-5">

            <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center">

              <UserCheck className="w-7 h-7 text-emerald-500" />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Present Days
              </p>

              <p className="text-3xl font-semibold text-slate-800 mt-1">
                {loading ? "..." : presentDays}
              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            TOTAL DAYS
        ==================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center gap-5">

            <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center">

              <CalendarDays className="w-7 h-7 text-sky-500" />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Total Days
              </p>

              <p className="text-3xl font-semibold text-slate-800 mt-1">
                {totalDays}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          ATTENDANCE RECORDS
      ====================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="px-7 py-6 border-b border-slate-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Records
              </p>

              <h2 className="text-2xl font-semibold text-slate-800 mt-2">
                Attendance Records
              </h2>

            </div>


            <div className="flex items-center gap-2 text-sm text-slate-400">

              <Clock className="w-4 h-4" />

              My Records

            </div>

          </div>

        </div>


        {/* ====================================================
            TABLE
        ==================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full">


            {/* TABLE HEADER */}

            <thead>

              <tr className="bg-slate-50 border-b border-slate-100">

                <th className="text-left px-7 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Date
                </th>

                <th className="text-left px-7 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Username
                </th>

                <th className="text-left px-7 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Punch In
                </th>

                <th className="text-left px-7 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Punch Out
                </th>

                <th className="text-left px-7 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Total Hours
                </th>

              </tr>

            </thead>


            {/* TABLE BODY */}

            <tbody>


              {/* =================================================
                  LOADING
              ================================================= */}

              {loading && (

                <tr>

                  <td
                    colSpan="5"
                    className="px-7 py-12 text-center text-sm text-slate-400"
                  >

                    Loading attendance records...

                  </td>

                </tr>

              )}


              {/* =================================================
                  NO RECORDS
              ================================================= */}

              {!loading &&
                attendanceHistory.length === 0 && (

                  <tr>

                    <td
                      colSpan="5"
                      className="px-7 py-12 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">

                          <CalendarDays className="w-6 h-6 text-slate-400" />

                        </div>

                        <p className="text-sm font-medium text-slate-600">
                          No attendance records found
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Your attendance records will appear here.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}


              {/* =================================================
                  RECORDS
              ================================================= */}

              {!loading &&
                attendanceHistory.length > 0 &&
                attendanceHistory.map(
                  (record, index) => (

                    <tr
                      key={
                        record.id ||
                        `${record.attendanceDate}-${index}`
                      }
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
                    >


                      {/* DATE */}

                      <td className="px-7 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">

                            <CalendarDays className="w-4 h-4 text-slate-500" />

                          </div>

                          <span className="text-sm font-semibold text-slate-700">

                            {formatDate(
                              record.attendanceDate
                            )}

                          </span>

                        </div>

                      </td>


                      {/* NAME */}

                      <td className="px-7 py-5">

                        <span className="text-sm font-semibold text-slate-700">

                          {record.name || "--"}

                        </span>

                      </td>


                      {/* PUNCH IN */}

                      <td className="px-7 py-5">

                        <span className="text-sm font-medium text-slate-700">

                          {formatTime(
                            record.punchInTime
                          )}

                        </span>

                      </td>


                      {/* PUNCH OUT */}

                      <td className="px-7 py-5">

                        <span className="text-sm font-medium text-slate-700">

                          {formatTime(
                            record.punchOutTime
                          )}

                        </span>

                      </td>


                      {/* TOTAL HOURS */}

                      <td className="px-7 py-5">

                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 text-sm font-semibold">

                          {formatHours(
                            record.totalHours
                          )}

                        </span>

                      </td>


                    </tr>

                  )
                )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}