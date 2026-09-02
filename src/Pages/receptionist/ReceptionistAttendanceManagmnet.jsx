import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  UserCheck,
  UserX,
  Clock3,
  AlertCircle,
} from "lucide-react";

import ReceptionistAttendanceService from "./ReceptionistAttendanceService.js";

const ReceptionistAttendanceManagement = () => {

  // ==========================================================
  // STATES
  // ==========================================================

  const [todayAttendance, setTodayAttendance] =
    useState(null);

  const [attendanceRecords, setAttendanceRecords] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");


  // ==========================================================
  // LOAD TODAY'S ATTENDANCE
  // ==========================================================

  const loadTodayAttendance = async () => {

    try {

      const response =
        await ReceptionistAttendanceService
          .getTodayAttendance();

      setTodayAttendance(response);

    } catch (error) {

      if (error?.response?.status === 404) {

        setTodayAttendance(null);

      } else {

        console.error(
          "Today's attendance loading error:",
          error
        );

      }
    }
  };


  // ==========================================================
  // LOAD ATTENDANCE HISTORY
  // ==========================================================

  const loadAttendance = async () => {

    try {

      setLoading(true);
      setErrorMessage("");

      const response =
        await ReceptionistAttendanceService
          .getMyAttendance();

      const records =
        Array.isArray(response)
          ? response
          : [];

      // ------------------------------------------------------
      // LATEST RECORD FIRST
      // ------------------------------------------------------

      const sortedRecords =
        [...records].sort((a, b) => {

          const dateA =
            new Date(
              `${a.attendanceDate}T${
                a.punchInTime || "00:00:00"
              }`
            );

          const dateB =
            new Date(
              `${b.attendanceDate}T${
                b.punchInTime || "00:00:00"
              }`
            );

          return dateB - dateA;

        });

      setAttendanceRecords(sortedRecords);

    } catch (error) {

      console.error(
        "Attendance loading error:",
        error
      );

      setErrorMessage(
        error?.response?.data?.message ||
        "Unable to load attendance records."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // LOAD ALL ATTENDANCE DATA
  // ==========================================================

  const refreshAttendance = async () => {

    await Promise.all([
      loadTodayAttendance(),
      loadAttendance(),
    ]);

  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    refreshAttendance();

  }, []);


  // ==========================================================
  // LISTEN FOR ATTENDANCE UPDATE
  // ==========================================================

  useEffect(() => {

    const handleAttendanceUpdated = () => {

      refreshAttendance();

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
  // SUMMARY
  // ==========================================================

  const presentDays =
    attendanceRecords.length;

  const totalDays =
    attendanceRecords.length;

  const absentDays = 0;


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {

    if (!date) {
      return "--";
    }

    const parts =
      date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;

  };


  // ==========================================================
  // FORMAT TIME
  // ==========================================================

  const formatTime = (time) => {

    if (!time) {
      return "--";
    }

    const parts =
      time.split(":");

    if (parts.length < 2) {
      return time;
    }

    let hour =
      parseInt(parts[0], 10);

    const minute =
      parts[1];

    const period =
      hour >= 12
        ? "PM"
        : "AM";

    hour =
      hour % 12 || 12;

    return `${hour}:${minute} ${period}`;

  };


  // ==========================================================
  // FORMAT HOURS
  // ==========================================================

  const formatHours = (hours) => {

    if (
      hours === null ||
      hours === undefined
    ) {

      return "--";

    }

    return `${Number(hours).toFixed(2)} Hrs`;

  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="min-h-screen bg-slate-100 px-6 py-6">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-semibold text-slate-900">

          My Attendance

        </h1>

        <p className="mt-1 text-sm text-slate-500">

          View your attendance summary and attendance records

        </p>

      </div>


      {/* ====================================================
          ERROR
      ==================================================== */}

      {errorMessage && (

        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

          <AlertCircle className="w-5 h-5" />

          {errorMessage}

        </div>

      )}


      {/* ====================================================
          SUMMARY CARDS
      ==================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">


        {/* ABSENT */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">

          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">

              <UserX className="w-8 h-8 text-red-500" />

            </div>

            <div>

              <p className="text-sm text-slate-500 mb-3">

                Absent Days

              </p>

              <p className="text-3xl font-semibold text-slate-900">

                {loading ? "--" : absentDays}

              </p>

            </div>

          </div>

        </div>


        {/* PRESENT */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">

          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">

              <UserCheck className="w-8 h-8 text-emerald-500" />

            </div>

            <div>

              <p className="text-sm text-slate-500 mb-3">

                Present Days

              </p>

              <p className="text-3xl font-semibold text-slate-900">

                {loading ? "--" : presentDays}

              </p>

            </div>

          </div>

        </div>


        {/* TOTAL */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">

          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center">

              <CalendarDays className="w-8 h-8 text-sky-500" />

            </div>

            <div>

              <p className="text-sm text-slate-500 mb-3">

                Total Days

              </p>

              <p className="text-3xl font-semibold text-slate-900">

                {loading ? "--" : totalDays}

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ====================================================
          ATTENDANCE RECORDS
      ==================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">


        {/* HEADER */}

        <div className="px-8 py-7">

          <p className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">

            Records

          </p>

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-semibold text-slate-900">

              Attendance Records

            </h2>

            <div className="flex items-center gap-2 text-sm text-slate-400">

              <Clock3 className="w-5 h-5" />

              My Records

            </div>

          </div>

        </div>


        {/* TABLE HEADER */}

        <div className="grid grid-cols-5 bg-slate-50 border-y border-slate-100 px-8 py-5">

          <div className="text-xs font-medium text-slate-500 uppercase">
            Date
          </div>

          <div className="text-xs font-medium text-slate-500 uppercase">
            UserName
          </div>

          <div className="text-xs font-medium text-slate-500 uppercase">
            Punch In
          </div>

          <div className="text-xs font-medium text-slate-500 uppercase">
            Punch Out
          </div>

          <div className="text-xs font-medium text-slate-500 uppercase">
            Total Hours
          </div>

        </div>


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (

          <div className="px-8 py-12 text-center text-slate-400">

            Loading attendance records...

          </div>

        )}


        {/* ==================================================
            EMPTY
        ================================================== */}

        {!loading &&
          attendanceRecords.length === 0 && (

            <div className="px-8 py-16 text-center">

              <CalendarDays className="w-12 h-12 mx-auto text-slate-300 mb-4" />

              <p className="text-lg font-medium text-slate-600">

                No attendance records found

              </p>

              <p className="text-sm text-slate-400 mt-2">

                Your attendance records will appear here.

              </p>

            </div>

        )}


        {/* ==================================================
            RECORDS
        ================================================== */}

        {!loading &&
          attendanceRecords.map((record) => (

            <div
              key={record.id}
              className="grid grid-cols-5 items-center px-8 py-6 border-b border-slate-100 last:border-b-0"
            >

              {/* DATE */}

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">

                  <CalendarDays className="w-5 h-5 text-slate-500" />

                </div>

                <span className="font-medium text-slate-800">

                  {formatDate(record.attendanceDate)}

                </span>

              </div>


              {/* NAME */}

              <div className="font-medium text-slate-800">

                {record.name ||
                  record.username ||
                  "Receptionist"}

              </div>


              {/* PUNCH IN */}

              <div className="font-medium text-slate-700">

                {formatTime(record.punchInTime)}

              </div>


              {/* PUNCH OUT */}

              <div className="font-medium text-slate-700">

                {formatTime(record.punchOutTime)}

              </div>


              {/* TOTAL HOURS */}

              <div>

                <span className="inline-flex items-center rounded-xl bg-sky-50 px-4 py-2 font-medium text-sky-600">

                  {formatHours(record.totalHours)}

                </span>

              </div>

            </div>

          ))}

      </div>

    </div>

  );

};

export default ReceptionistAttendanceManagement;