import React, {
    useEffect,
    useState
} from "react";

import playerAttendanceService
    from "./playerAttendanceService";


const StudentsAttendance = () => {

    // ==========================================================
    // STATES
    // ==========================================================

    const [batches, setBatches] = useState([]);

    const [selectedBatchId, setSelectedBatchId] =
        useState("");

    const [students, setStudents] = useState([]);

    const [loadingBatches, setLoadingBatches] =
        useState(false);

    const [loadingStudents, setLoadingStudents] =
        useState(false);

    const [processingStudentId, setProcessingStudentId] =
        useState(null);

    const [error, setError] = useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    // ==========================================================
    // LOAD COACH BATCHES
    // ==========================================================

    useEffect(() => {

        loadBatches();

    }, []);


    // ==========================================================
    // LOAD BATCHES
    // ==========================================================

    const loadBatches = async () => {

        try {

            setLoadingBatches(true);

            setError("");

            const response =
                await playerAttendanceService
                    .getCoachBatches();


            if (response?.success) {

                const batchList =
                    response.data || [];

                setBatches(batchList);

            } else {

                setError(
                    response?.message ||
                    "Unable to load batches."
                );
            }

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Unable to load batches."
            );

        } finally {

            setLoadingBatches(false);
        }
    };


    // ==========================================================
    // BATCH CHANGE
    // ==========================================================

    const handleBatchChange = async (event) => {

        const batchId =
            event.target.value;

        setSelectedBatchId(batchId);

        setStudents([]);

        setError("");

        setSuccessMessage("");


        if (!batchId) {
            return;
        }


        await loadStudents(batchId);
    };


    // ==========================================================
    // LOAD STUDENTS
    // ==========================================================

    const loadStudents = async (batchId) => {

        try {

            setLoadingStudents(true);

            setError("");

            const response =
                await playerAttendanceService
                    .getBatchStudents(batchId);


            if (response?.success) {

                setStudents(
                    response.data || []
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to load students."
                );

                setStudents([]);
            }

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Unable to load students."
            );

            setStudents([]);

        } finally {

            setLoadingStudents(false);
        }
    };


    // ==========================================================
    // REFRESH STUDENTS
    // ==========================================================

    const refreshStudents = async () => {

        if (!selectedBatchId) {
            return;
        }

        await loadStudents(
            selectedBatchId
        );
    };


    // ==========================================================
    // CHECK NETWORK / ACADEMY WIFI ERROR
    // ==========================================================

    const isNetworkError = (err) => {

        return (
            !err?.response ||
            err?.code === "ERR_NETWORK" ||
            err?.code === "ECONNABORTED" ||
            err?.code === "ETIMEDOUT" ||
            err?.message === "Network Error"
        );
    };


    // ==========================================================
    // SHOW ACADEMY WIFI POPUP
    // ==========================================================

    const showAcademyWifiPopup = () => {

        window.alert(
            "Please connect to Academy Wi-Fi."
        );
    };


    // ==========================================================
    // PUNCH IN
    // ==========================================================

    const handlePunchIn = async (
        playerId
    ) => {

        try {

            setProcessingStudentId(playerId);

            setError("");

            setSuccessMessage("");


            const response =
                await playerAttendanceService
                    .punchInStudent(
                        selectedBatchId,
                        playerId
                    );


            if (response?.success) {

                setSuccessMessage(
                    response.message ||
                    "Student punched in successfully."
                );

                await refreshStudents();

            } else {

                setError(
                    response?.message ||
                    "Unable to punch in student."
                );
            }

        } catch (err) {

            // --------------------------------------------------
            // DIFFERENT WIFI / BACKEND NOT REACHABLE
            // --------------------------------------------------

            if (isNetworkError(err)) {

                showAcademyWifiPopup();

                return;
            }


            // --------------------------------------------------
            // NORMAL BACKEND ERROR
            // --------------------------------------------------

            setError(
                err?.response?.data?.message ||
                "Unable to punch in student."
            );

        } finally {

            setProcessingStudentId(null);
        }
    };


    // ==========================================================
    // PUNCH OUT
    // ==========================================================

    const handlePunchOut = async (
        playerId
    ) => {

        try {

            setProcessingStudentId(playerId);

            setError("");

            setSuccessMessage("");


            const response =
                await playerAttendanceService
                    .punchOutStudent(
                        selectedBatchId,
                        playerId
                    );


            if (response?.success) {

                setSuccessMessage(
                    response.message ||
                    "Student punched out successfully."
                );

                await refreshStudents();

            } else {

                setError(
                    response?.message ||
                    "Unable to punch out student."
                );
            }

        } catch (err) {

            // --------------------------------------------------
            // DIFFERENT WIFI / BACKEND NOT REACHABLE
            // --------------------------------------------------

            if (isNetworkError(err)) {

                showAcademyWifiPopup();

                return;
            }


            // --------------------------------------------------
            // NORMAL BACKEND ERROR
            // --------------------------------------------------

            setError(
                err?.response?.data?.message ||
                "Unable to punch out student."
            );

        } finally {

            setProcessingStudentId(null);
        }
    };


    // ==========================================================
    // FORMAT TIME
    // ==========================================================

    const formatTime = (time) => {

        if (!time) {
            return "-";
        }

        return time.substring(
            0,
            5
        );
    };


    // ==========================================================
    // GET ATTENDANCE STATUS
    // ==========================================================

    const getAttendanceStatus = (
        student
    ) => {

        if (
            student.attendanceMarkedToday
        ) {

            return "Present";
        }

        if (
            student.attendanceAllowedToday
        ) {

            return "Absent";
        }

        return "Not Available";
    };


    // ==========================================================
    // GET STATUS CLASS
    // ==========================================================

    const getStatusClass = (
        student
    ) => {

        if (
            student.attendanceMarkedToday
        ) {

            return "attendance-status present";
        }

        if (
            student.attendanceAllowedToday
        ) {

            return "attendance-status absent";
        }

        return "attendance-status unavailable";
    };


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div
            style={{
                padding: "24px",
                width: "100%",
                boxSizing: "border-box"
            }}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                style={{
                    marginBottom: "24px"
                }}
            >

                <h2
                    style={{
                        margin: 0,
                        marginBottom: "6px"
                    }}
                >
                    Students Attendance
                </h2>

                <p
                    style={{
                        margin: 0,
                        color: "#6b7280"
                    }}
                >
                    Mark and manage today's student attendance.
                </p>

            </div>


            {/* ==================================================
                BATCH SELECT
            ================================================== */}

            <div
                style={{
                    background: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    boxShadow:
                        "0 1px 4px rgba(0,0,0,0.08)"
                }}
            >

                <label
                    style={{
                        display: "block",
                        fontWeight: 600,
                        marginBottom: "8px"
                    }}
                >
                    Select Batch
                </label>


                <select
                    value={selectedBatchId}
                    onChange={handleBatchChange}
                    disabled={loadingBatches}
                    style={{
                        width: "100%",
                        maxWidth: "450px",
                        padding: "11px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "7px",
                        fontSize: "14px",
                        background: "#ffffff"
                    }}
                >

                    <option value="">
                        {loadingBatches
                            ? "Loading batches..."
                            : "Select Batch"}
                    </option>


                    {batches.map(
                        (batch) => (

                            <option
                                key={batch.id}
                                value={batch.id}
                            >
                                {batch.batchName}
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div
                    style={{
                        marginBottom: "16px",
                        padding: "12px 16px",
                        borderRadius: "7px",
                        background: "#fee2e2",
                        color: "#b91c1c"
                    }}
                >
                    {error}
                </div>

            )}


            {/* ==================================================
                SUCCESS
            ================================================== */}

            {successMessage && (

                <div
                    style={{
                        marginBottom: "16px",
                        padding: "12px 16px",
                        borderRadius: "7px",
                        background: "#dcfce7",
                        color: "#166534"
                    }}
                >
                    {successMessage}
                </div>

            )}


            {/* ==================================================
                NO BATCH SELECTED
            ================================================== */}

            {!selectedBatchId && (

                <div
                    style={{
                        background: "#ffffff",
                        padding: "40px",
                        textAlign: "center",
                        borderRadius: "10px",
                        color: "#6b7280"
                    }}
                >
                    Please select a batch to view students.
                </div>

            )}


            {/* ==================================================
                LOADING
            ================================================== */}

            {selectedBatchId &&
                loadingStudents && (

                    <div
                        style={{
                            background: "#ffffff",
                            padding: "40px",
                            textAlign: "center",
                            borderRadius: "10px"
                        }}
                    >
                        Loading students...
                    </div>

                )}


            {/* ==================================================
                STUDENTS TABLE
            ================================================== */}

            {selectedBatchId &&
                !loadingStudents && (

                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            overflowX: "auto",
                            boxShadow:
                                "0 1px 4px rgba(0,0,0,0.08)"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                minWidth: "950px"
                            }}
                        >

                            <thead>

                                <tr
                                    style={{
                                        borderBottom:
                                            "1px solid #e5e7eb",
                                        background:
                                            "#f9fafb"
                                    }}
                                >

                                    <th style={thStyle}>
                                        #
                                    </th>

                                    <th style={thStyle}>
                                        Student
                                    </th>

                                    <th style={thStyle}>
                                        Age
                                    </th>

                                    <th style={thStyle}>
                                        Attendance
                                    </th>

                                    <th style={thStyle}>
                                        Punch In
                                    </th>

                                    <th style={thStyle}>
                                        Punch Out
                                    </th>

                                    <th style={thStyle}>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {students.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            style={{
                                                padding: "40px",
                                                textAlign: "center",
                                                color: "#6b7280"
                                            }}
                                        >
                                            No active students found
                                            in this batch.
                                        </td>

                                    </tr>

                                ) : (

                                    students.map(
                                        (student, index) => {

                                            const isProcessing =
                                                processingStudentId ===
                                                student.playerId;

                                            const isUnder18 =
                                                student.age !== null &&
                                                student.age < 18;

                                            const canMark =
                                                student.coachCanMarkAttendance ===
                                                true;

                                            const isMarked =
                                                student.attendanceMarkedToday ===
                                                true;

                                            const attendanceAllowed =
                                                student.attendanceAllowedToday ===
                                                true;


                                            return (

                                                <tr
                                                    key={
                                                        student.playerId
                                                    }
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #f0f0f0"
                                                    }}
                                                >

                                                    <td
                                                        style={tdStyle}
                                                    >
                                                        {index + 1}
                                                    </td>


                                                    <td
                                                        style={{
                                                            ...tdStyle,
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {student.firstName}
                                                        {" "}
                                                        {student.lastName}
                                                    </td>


                                                    <td
                                                        style={tdStyle}
                                                    >
                                                        {student.age ?? "-"}
                                                    </td>


                                                    <td
                                                        style={tdStyle}
                                                    >

                                                        <span
                                                            style={{
                                                                ...statusStyle,
                                                                ...(isMarked
                                                                    ? presentStyle
                                                                    : attendanceAllowed
                                                                        ? absentStyle
                                                                        : unavailableStyle)
                                                            }}
                                                        >
                                                            {getAttendanceStatus(
                                                                student
                                                            )}
                                                        </span>


                                                        {!isUnder18 &&
                                                            student.age !== null && (

                                                                <div
                                                                    style={{
                                                                        fontSize: "12px",
                                                                        color: "#6b7280",
                                                                        marginTop: "5px"
                                                                    }}
                                                                >
                                                                    Student marked
                                                                </div>

                                                            )}

                                                    </td>


                                                    <td
                                                        style={tdStyle}
                                                    >
                                                        {formatTime(
                                                            student.punchInTime
                                                        )}
                                                    </td>


                                                    <td
                                                        style={tdStyle}
                                                    >
                                                        {formatTime(
                                                            student.punchOutTime
                                                        )}
                                                    </td>


                                                    <td
                                                        style={tdStyle}
                                                    >

                                                        {/* --------------------------------
                                                            UNDER 18 + TRAINING DAY
                                                        --------------------------------- */}

                                                        {isUnder18 &&
                                                            canMark &&
                                                            attendanceAllowed &&
                                                            !isMarked && (

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isProcessing
                                                                    }
                                                                    onClick={() =>
                                                                        handlePunchIn(
                                                                            student.playerId
                                                                        )
                                                                    }
                                                                    style={{
                                                                        ...buttonStyle,
                                                                        opacity:
                                                                            isProcessing
                                                                                ? 0.6
                                                                                : 1
                                                                    }}
                                                                >
                                                                    {isProcessing
                                                                        ? "Processing..."
                                                                        : "Punch In"}
                                                                </button>

                                                            )}


                                                        {/* --------------------------------
                                                            UNDER 18 + PUNCHED IN
                                                        --------------------------------- */}

                                                        {isUnder18 &&
                                                            canMark &&
                                                            attendanceAllowed &&
                                                            isMarked &&
                                                            !student.punchOutTime && (

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isProcessing
                                                                    }
                                                                    onClick={() =>
                                                                        handlePunchOut(
                                                                            student.playerId
                                                                        )
                                                                    }
                                                                    style={{
                                                                        ...buttonStyle,
                                                                        opacity:
                                                                            isProcessing
                                                                                ? 0.6
                                                                                : 1
                                                                    }}
                                                                >
                                                                    {isProcessing
                                                                        ? "Processing..."
                                                                        : "Punch Out"}
                                                                </button>

                                                            )}


                                                        {/* --------------------------------
                                                            COMPLETED
                                                        --------------------------------- */}

                                                        {isUnder18 &&
                                                            isMarked &&
                                                            student.punchOutTime && (

                                                                <span
                                                                    style={{
                                                                        color: "#166534",
                                                                        fontWeight: 600
                                                                    }}
                                                                >
                                                                    Completed
                                                                </span>

                                                            )}


                                                        {/* --------------------------------
                                                            18+
                                                        --------------------------------- */}

                                                        {!isUnder18 &&
                                                            student.age !== null && (

                                                                <span
                                                                    style={{
                                                                        color: "#6b7280",
                                                                        fontSize: "13px"
                                                                    }}
                                                                >
                                                                    Student marks
                                                                </span>

                                                            )}


                                                        {/* --------------------------------
                                                            NON TRAINING DAY
                                                        --------------------------------- */}

                                                        {(!attendanceAllowed) && (

                                                            <span
                                                                style={{
                                                                    color: "#6b7280",
                                                                    fontSize: "13px"
                                                                }}
                                                            >
                                                                Not available today
                                                            </span>

                                                        )}

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

        </div>
    );
};


// ==========================================================
// TABLE STYLES
// ==========================================================

const thStyle = {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    whiteSpace: "nowrap"
};


const tdStyle = {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#374151",
    whiteSpace: "nowrap"
};


const buttonStyle = {
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    background: "#111827",
    color: "#ffffff"
};


const statusStyle = {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600
};


const presentStyle = {
    background: "#dcfce7",
    color: "#166534"
};


const absentStyle = {
    background: "#fee2e2",
    color: "#b91c1c"
};


const unavailableStyle = {
    background: "#f3f4f6",
    color: "#6b7280"
};


export default StudentsAttendance;