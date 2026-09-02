import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  UserRoundCheck,
  UserRoundX,
  Clock,
  AlertCircle,
} from "lucide-react";
import InnventoryManagerService from "./InnventoryManagerService.js";


const InnventoryManagerAttendance = () => {

  // ==========================================================
  // STATE
  // ==========================================================

  const [todayAttendance, setTodayAttendance] =
    useState(null);

  const [attendanceRecords, setAttendanceRecords] =
    useState([]);

  const [attendanceLoading, setAttendanceLoading] =
    useState(true);

  const [attendanceActionLoading, setAttendanceActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  // ==========================================================
  // LOAD ATTENDANCE
  // ==========================================================

  const loadAttendance = async () => {

    try {

      setAttendanceLoading(true);
      setError("");

      const [todayResponse, historyResponse] =
        await Promise.all([
          InnventoryManagerService.getTodayAttendance(),
          InnventoryManagerService.getMyAttendance(),
        ]);


      // ------------------------------------------------------
      // TODAY'S ATTENDANCE
      // ------------------------------------------------------

      setTodayAttendance(
        todayResponse || null
      );


      // ------------------------------------------------------
      // ATTENDANCE HISTORY
      // ------------------------------------------------------

      let records = [];

      if (Array.isArray(historyResponse)) {

        records = historyResponse;

      } else if (
        historyResponse &&
        Array.isArray(historyResponse.data)
      ) {

        records = historyResponse.data;

      }


      // ------------------------------------------------------
      // LATEST RECORD FIRST
      // ------------------------------------------------------

      records.sort((a, b) => {

        const dateA =
          new Date(
            `${a.attendanceDate || ""}T${
              a.punchInTime || "00:00:00"
            }`
          );

        const dateB =
          new Date(
            `${b.attendanceDate || ""}T${
              b.punchInTime || "00:00:00"
            }`
          );

        return dateB - dateA;
      });


      setAttendanceRecords(records);

    } catch (err) {

      console.error(
        "Attendance loading error:",
        err
      );

      setError(
        "Unable to load attendance records."
      );

    } finally {

      setAttendanceLoading(false);

    }
  };


  // ==========================================================
  // INITIAL LOAD + ATTENDANCE UPDATE LISTENER
  // ==========================================================

  useEffect(() => {

    // Load attendance when page opens
    loadAttendance();


    // --------------------------------------------------------
    // LISTEN FOR PUNCH IN / PUNCH OUT FROM LAYOUT
    // --------------------------------------------------------

    const handleAttendanceUpdated = () => {

      loadAttendance();

    };


    window.addEventListener(
      "attendance-updated",
      handleAttendanceUpdated
    );


    // --------------------------------------------------------
    // CLEANUP
    // --------------------------------------------------------

    return () => {

      window.removeEventListener(
        "attendance-updated",
        handleAttendanceUpdated
      );

    };

  }, []);


  // ==========================================================
  // CLEAR MESSAGES
  // ==========================================================

  const clearMessages = () => {

    setError("");
    setSuccessMessage("");

  };


  // ==========================================================
  // PUNCH IN
  // ==========================================================

  const handlePunchIn = async () => {

    clearMessages();

    try {

      setAttendanceActionLoading(true);

      const response =
        await InnventoryManagerService.punchIn();


      // ------------------------------------------------------
      // UPDATE TODAY'S ATTENDANCE IMMEDIATELY
      // ------------------------------------------------------

      setTodayAttendance(response);


      // ------------------------------------------------------
      // UPDATE HISTORY WITHOUT PAGE RELOAD
      // ------------------------------------------------------

      await loadAttendance();


      setSuccessMessage(
        response?.message ||
        "Punch in successful."
      );

    } catch (err) {

      console.error(
        "Punch in error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to punch in.";

      setError(message);

    } finally {

      setAttendanceActionLoading(false);

    }
  };


  // ==========================================================
  // PUNCH OUT
  // ==========================================================

  const handlePunchOut = async () => {

    clearMessages();

    try {

      setAttendanceActionLoading(true);

      const response =
        await InnventoryManagerService.punchOut();


      // ------------------------------------------------------
      // UPDATE TODAY'S ATTENDANCE IMMEDIATELY
      // ------------------------------------------------------

      setTodayAttendance(response);


      // ------------------------------------------------------
      // UPDATE HISTORY WITHOUT PAGE RELOAD
      // ------------------------------------------------------

      await loadAttendance();


      setSuccessMessage(
        response?.message ||
        "Punch out successful."
      );

    } catch (err) {

      console.error(
        "Punch out error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to punch out.";

      setError(message);

    } finally {

      setAttendanceActionLoading(false);

    }
  };


  // ==========================================================
  // DYNAMIC ATTENDANCE BUTTON
  // ==========================================================

  const handleAttendanceAction = async () => {

    if (attendanceActionLoading) {
      return;
    }


    // --------------------------------------------------------
    // NO ATTENDANCE TODAY
    // --------------------------------------------------------

    if (!todayAttendance) {

      await handlePunchIn();

      return;
    }


    // --------------------------------------------------------
    // PUNCH IN EXISTS BUT PUNCH OUT DOES NOT
    // --------------------------------------------------------

    if (
      todayAttendance.punchInTime &&
      !todayAttendance.punchOutTime
    ) {

      await handlePunchOut();

      return;
    }


    // --------------------------------------------------------
    // ALREADY COMPLETED TODAY
    // --------------------------------------------------------

    if (
      todayAttendance.punchInTime &&
      todayAttendance.punchOutTime
    ) {

      setError(
        "Attendance already completed for today."
      );

    }

  };


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return "--";
    }

    const date =
      new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

  };


  // ==========================================================
  // FORMAT TIME
  // ==========================================================

  const formatTime = (timeValue) => {

    if (!timeValue) {
      return "--";
    }

    const parts =
      timeValue.split(":");

    if (parts.length < 2) {
      return timeValue;
    }

    const hours =
      parseInt(parts[0], 10);

    const minutes =
      parts[1];

    if (Number.isNaN(hours)) {
      return timeValue;
    }

    const period =
      hours >= 12 ? "PM" : "AM";

    const displayHour =
      hours % 12 || 12;

    return `${displayHour}:${minutes} ${period}`;

  };


  // ==========================================================
  // TOTAL HOURS
  // ==========================================================

  const formatTotalHours = (hours) => {

    if (
      hours === null ||
      hours === undefined
    ) {
      return "--";
    }

    return `${Number(hours).toFixed(2)} Hrs`;

  };


  // ==========================================================
  // SUMMARY
  // ==========================================================

  const presentDays =
    attendanceRecords.length;

  const totalDays =
    attendanceRecords.length;

  // Holiday/absent calculation will be added later
  // when the Holiday module is implemented.

  const absentDays = "--";


  // ==========================================================
  // BUTTON STATE
  // ==========================================================

  let buttonText = "Punch In";

  let buttonClass =
    "bg-sky-500 hover:bg-sky-600";

  if (
    todayAttendance?.punchInTime &&
    !todayAttendance?.punchOutTime
  ) {

    buttonText = "Punch Out";

    buttonClass =
      "bg-amber-500 hover:bg-amber-600";

  }


  if (
    todayAttendance?.punchInTime &&
    todayAttendance?.punchOutTime
  ) {

    buttonText = "Punch In";

    buttonClass =
      "bg-sky-500 hover:bg-sky-600";

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-full bg-slate-100 p-4 sm:p-6">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-semibold text-slate-900">
          My Attendance
        </h1>

        <p className="mt-1 text-base text-slate-500">
          View your attendance summary and attendance records
        </p>

      </div>


      {/* ======================================================
          MESSAGES
      ====================================================== */}

      {error && (

        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

          <AlertCircle className="h-5 w-5 shrink-0" />

          <span>{error}</span>

        </div>

      )}


      {successMessage && (

        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">

          {successMessage}

        </div>

      )}


      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


        {/* ====================================================
            ABSENT DAYS
        ==================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex items-center gap-5">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-50">

              <UserRoundX
                className="h-8 w-8 text-red-500"
              />

            </div>

            <div>

              <p className="text-base text-slate-500">
                Absent Days
              </p>

              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {absentDays}
              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            PRESENT DAYS
        ==================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex items-center gap-5">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-50">

              <UserRoundCheck
                className="h-8 w-8 text-emerald-500"
              />

            </div>

            <div>

              <p className="text-base text-slate-500">
                Present Days
              </p>

              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {presentDays}
              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            TOTAL DAYS
        ==================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex items-center gap-5">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-50">

              <CalendarDays
                className="h-8 w-8 text-sky-500"
              />

            </div>

            <div>

              <p className="text-base text-slate-500">
                Total Days
              </p>

              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {totalDays}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          ATTENDANCE RECORDS
      ====================================================== */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


        {/* ====================================================
            RECORD HEADER
        ==================================================== */}

        <div className="flex items-center justify-between px-6 py-7">

          <div>

            <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
              Records
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Attendance Records
            </h2>

          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">

            <Clock className="h-5 w-5" />

            <span>
              My Records
            </span>

          </div>

        </div>


        {/* ====================================================
            TABLE HEADER
        ==================================================== */}

        <div className="grid grid-cols-5 border-y border-slate-100 bg-slate-50 px-6 py-5 text-sm font-medium uppercase tracking-wide text-slate-500">

          <div>
            Date
          </div>

          <div>
            Name
          </div>

          <div>
            Punch In
          </div>

          <div>
            Punch Out
          </div>

          <div>
            Total Hours
          </div>

        </div>


        {/* ====================================================
            LOADING
        ==================================================== */}

        {attendanceLoading ? (

          <div className="flex min-h-[220px] items-center justify-center">

            <div className="text-sm text-slate-500">
              Loading attendance records...
            </div>

          </div>

        ) : attendanceRecords.length === 0 ? (

          /* ==================================================
             EMPTY STATE
          ================================================== */

          <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

              <CalendarDays
                className="h-7 w-7 text-slate-400"
              />

            </div>

            <h3 className="mt-5 text-base font-medium text-slate-700">
              No attendance records found
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Your attendance records will appear here.
            </p>

          </div>

        ) : (

          /* ==================================================
             ATTENDANCE ROWS
          ================================================== */

          <div>

            {attendanceRecords.map(
              (record, index) => (

                <div
                  key={
                    record.id ||
                    `${record.attendanceDate}-${index}`
                  }
                  className="grid grid-cols-5 items-center border-b border-slate-100 px-6 py-6 last:border-b-0"
                >

                  {/* DATE */}

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">

                      <CalendarDays
                        className="h-5 w-5 text-slate-500"
                      />

                    </div>

                    <span className="font-medium text-slate-800">
                      {formatDate(
                        record.attendanceDate
                      )}
                    </span>

                  </div>


                  {/* USERNAME */}

                  <div className="font-medium text-slate-800">

                    {record.username || "--"}

                  </div>


                  {/* PUNCH IN */}

                  <div className="font-medium text-slate-800">

                    {formatTime(
                      record.punchInTime
                    )}

                  </div>


                  {/* PUNCH OUT */}

                  <div className="font-medium text-slate-800">

                    {formatTime(
                      record.punchOutTime
                    )}

                  </div>


                  {/* TOTAL HOURS */}

                  <div>

                    <span className="inline-flex rounded-xl bg-sky-50 px-4 py-2 font-medium text-sky-600">

                      {formatTotalHours(
                        record.totalHours
                      )}

                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* ======================================================
          MOBILE RESPONSIVE NOTE
      ====================================================== */}

      <div className="mt-5 md:hidden">

        <p className="text-xs text-slate-400">
          Swipe horizontally to view all attendance details.
        </p>

      </div>

    </div>
  );
};


export default InnventoryManagerAttendance;