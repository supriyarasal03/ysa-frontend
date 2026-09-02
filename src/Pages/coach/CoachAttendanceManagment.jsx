import React, {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  UserCheck,
  UserX,
  Clock3,
  AlertCircle,
} from "lucide-react";

import CoachAttendanceService from "./CoachAttendanceService";


const CoachAttendanceManagement = () => {

  // ==========================================================
  // STATES
  // ==========================================================

  const [
    todayAttendance,
    setTodayAttendance,
  ] = useState(null);

  const [
    attendanceRecords,
    setAttendanceRecords,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  // ==========================================================
  // LOAD TODAY'S ATTENDANCE
  // ==========================================================

  const loadTodayAttendance = async () => {

    try {

      const response =
        await CoachAttendanceService
          .getTodayAttendance();

      setTodayAttendance(
        response
      );

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
        await CoachAttendanceService
          .getMyAttendance();


      const records =
        Array.isArray(response)
          ? response
          : [];


      // ------------------------------------------------------
      // LATEST RECORD FIRST
      // ------------------------------------------------------

      const sortedRecords =
        [...records].sort(
          (a, b) => {

            const dateA =
              new Date(
                `${a?.attendanceDate || "1900-01-01"}T${
                  a?.punchInTime ||
                  "00:00:00"
                }`
              ).getTime();

            const dateB =
              new Date(
                `${b?.attendanceDate || "1900-01-01"}T${
                  b?.punchInTime ||
                  "00:00:00"
                }`
              ).getTime();

            return dateB - dateA;

          }
        );


      setAttendanceRecords(
        sortedRecords
      );

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
  // LOAD ALL ATTENDANCE
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
  // ATTENDANCE UPDATE EVENT
  // ==========================================================

  useEffect(() => {

    const handleAttendanceUpdated =
      () => {

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


    try {

      const parsedDate =
        new Date(date);


      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {

        return date;

      }


      return parsedDate.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

    } catch {

      return date;

    }

  };


  // ==========================================================
  // FORMAT TIME
  // ==========================================================

  const formatTime = (time) => {

    if (!time) {
      return "--";
    }


    try {

      const parts =
        time.split(":");


      if (
        parts.length < 2
      ) {

        return time;

      }


      let hours =
        parseInt(
          parts[0],
          10
        );

      const minutes =
        parts[1];


      const period =
        hours >= 12
          ? "PM"
          : "AM";


      hours =
        hours % 12;


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


    const numericHours =
      Number(hours);


    if (
      Number.isNaN(
        numericHours
      )
    ) {

      return `${hours} Hrs`;

    }


    return `${numericHours.toFixed(2)} Hrs`;

  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div
      className="
        min-h-full
        bg-[#f3f6fa]
        px-8
        py-7
      "
    >


      {/* ====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-8">

        <h1
          className="
            text-3xl
            font-semibold
            text-slate-900
          "
        >
          My Attendance
        </h1>

        <p
          className="
            mt-2
            text-base
            text-slate-500
          "
        >
          View your attendance summary and attendance records
        </p>

      </div>


      {/* ====================================================
          ERROR
      ===================================================== */}

      {errorMessage && (

        <div
          className="
            mb-6
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-5
            py-4
            text-sm
            text-red-600
          "
        >

          <AlertCircle
            className="h-5 w-5"
          />

          {errorMessage}

        </div>

      )}


      {/* ====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-3
          mb-9
        "
      >


        {/* ==================================================
            ABSENT DAYS
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-5
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-8
            py-8
            shadow-sm
          "
        >

          <div
            className="
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-red-50
            "
          >

            <UserX
              className="
                h-9
                w-9
                text-red-500
              "
            />

          </div>


          <div>

            <p
              className="
                text-base
                text-slate-500
              "
            >
              Absent Days
            </p>

            <p
              className="
                mt-2
                text-3xl
                font-semibold
                text-slate-900
              "
            >
              {loading
                ? "--"
                : absentDays}
            </p>

          </div>

        </div>


        {/* ==================================================
            PRESENT DAYS
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-5
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-8
            py-8
            shadow-sm
          "
        >

          <div
            className="
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-emerald-50
            "
          >

            <UserCheck
              className="
                h-9
                w-9
                text-emerald-500
              "
            />

          </div>


          <div>

            <p
              className="
                text-base
                text-slate-500
              "
            >
              Present Days
            </p>

            <p
              className="
                mt-2
                text-3xl
                font-semibold
                text-slate-900
              "
            >
              {loading
                ? "--"
                : presentDays}
            </p>

          </div>

        </div>


        {/* ==================================================
            TOTAL DAYS
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-5
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-8
            py-8
            shadow-sm
          "
        >

          <div
            className="
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-sky-50
            "
          >

            <CalendarDays
              className="
                h-9
                w-9
                text-sky-500
              "
            />

          </div>


          <div>

            <p
              className="
                text-base
                text-slate-500
              "
            >
              Total Days
            </p>

            <p
              className="
                mt-2
                text-3xl
                font-semibold
                text-slate-900
              "
            >
              {loading
                ? "--"
                : totalDays}
            </p>

          </div>

        </div>

      </div>


      {/* ====================================================
          ATTENDANCE RECORDS
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >


        {/* ==================================================
            RECORD HEADER
        =================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-9
            py-8
          "
        >

          <div>

            <p
              className="
                text-sm
                font-medium
                uppercase
                tracking-wide
                text-slate-400
              "
            >
              Records
            </p>

            <h2
              className="
                mt-3
                text-2xl
                font-semibold
                text-slate-900
              "
            >
              Attendance Records
            </h2>

          </div>


          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-400
            "
          >

            <Clock3
              className="h-5 w-5"
            />

            My Records

          </div>

        </div>


        {/* ==================================================
            TABLE HEADER
        =================================================== */}

        <div
          className="
            grid
            min-w-[800px]
            grid-cols-5
            items-center
            bg-slate-50
            px-9
            py-7
            text-xs
            font-medium
            uppercase
            tracking-wide
            text-slate-500
          "
        >

          <div>
            Date
          </div>

          <div>
            Username
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


        {/* ==================================================
            TABLE BODY
        =================================================== */}

        {loading ? (

          <div
            className="
              flex
              min-h-[220px]
              items-center
              justify-center
              text-sm
              text-slate-400
            "
          >

            Loading attendance records...

          </div>

        ) : attendanceRecords.length === 0 ? (

          /* ==================================================
             EMPTY
          ================================================== */

          <div
            className="
              flex
              min-h-[280px]
              flex-col
              items-center
              justify-center
              px-6
              text-center
            "
          >

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-slate-100
              "
            >

              <CalendarDays
                className="
                  h-7
                  w-7
                  text-slate-400
                "
              />

            </div>


            <h3
              className="
                mt-5
                text-base
                font-medium
                text-slate-700
              "
            >
              No attendance records found
            </h3>


            <p
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              Your attendance records will appear here.
            </p>

          </div>

        ) : (

          /* ==================================================
             RECORDS
          ================================================== */

          <div
            className="
              overflow-x-auto
            "
          >

            {attendanceRecords.map(
              (record, index) => (

                <div
                  key={
                    record?.id ||
                    `${record?.attendanceDate}-${index}`
                  }
                  className="
                    grid
                    min-w-[800px]
                    grid-cols-5
                    items-center
                    border-b
                    border-slate-100
                    px-9
                    py-7
                    last:border-b-0
                  "
                >


                  {/* DATE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-100
                      "
                    >

                      <CalendarDays
                        className="
                          h-5
                          w-5
                          text-slate-500
                        "
                      />

                    </div>


                    <span
                      className="
                        font-medium
                        text-slate-800
                      "
                    >

                      {formatDate(
                        record?.attendanceDate
                      )}

                    </span>

                  </div>


                  {/* USERNAME */}

                  <div
                    className="
                      font-medium
                      text-slate-800
                    "
                  >

                    {record?.username ||
                      "Coach"}

                  </div>


                  {/* PUNCH IN */}

                  <div
                    className="
                      font-medium
                      text-slate-700
                    "
                  >

                    {formatTime(
                      record?.punchInTime
                    )}

                  </div>


                  {/* PUNCH OUT */}

                  <div
                    className="
                      font-medium
                      text-slate-700
                    "
                  >

                    {formatTime(
                      record?.punchOutTime
                    )}

                  </div>


                  {/* TOTAL HOURS */}

                  <div>

                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-xl
                        bg-sky-50
                        px-4
                        py-2
                        font-medium
                        text-sky-600
                      "
                    >

                      {formatHours(
                        record?.totalHours
                      )}

                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

};


export default CoachAttendanceManagement;