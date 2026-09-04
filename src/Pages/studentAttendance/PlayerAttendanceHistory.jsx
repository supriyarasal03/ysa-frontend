import React, {
    useEffect,
    useState
} from "react";

import playerAttendanceService
    from "./playerAttendanceService";


const PlayerAttendanceHistory = () => {

    // ==========================================================
    // STATES
    // ==========================================================

    const [batches, setBatches] = useState([]);

    const [selectedBatchId, setSelectedBatchId] =
        useState("");

    const [attendance, setAttendance] =
        useState([]);

    const [loadingBatches, setLoadingBatches] =
        useState(false);

    const [loadingAttendance, setLoadingAttendance] =
        useState(false);

    const [loadingHistoryPlayerId, setLoadingHistoryPlayerId] =
        useState(null);

    const [selectedStudent, setSelectedStudent] =
        useState(null);

    const [attendanceHistory, setAttendanceHistory] =
        useState([]);

    const [error, setError] = useState("");

    // ==========================================================
    // PERFORMANCE EMAIL STATES
    // ==========================================================

    const [emailStudent, setEmailStudent] =
        useState(null);

    const [performanceRemarks, setPerformanceRemarks] =
        useState("");

    const [sendingEmail, setSendingEmail] =
        useState(false);

    const [emailSuccessMessage, setEmailSuccessMessage] =
        useState("");

    const [emailErrorMessage, setEmailErrorMessage] =
        useState("");


    // ==========================================================
    // LOAD BATCHES
    // ==========================================================

    useEffect(() => {

        loadBatches();

    }, []);


    // ==========================================================
    // LOAD COACH BATCHES
    // ==========================================================

    const loadBatches = async () => {

        try {

            setLoadingBatches(true);

            setError("");

            const response =
                await playerAttendanceService
                    .getCoachBatches();


            if (response?.success) {

                setBatches(
                    response.data || []
                );

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

    const handleBatchChange = async (
        event
    ) => {

        const batchId =
            event.target.value;

        setSelectedBatchId(batchId);

        setAttendance([]);

        setSelectedStudent(null);

        setAttendanceHistory([]);

        setEmailStudent(null);

        setPerformanceRemarks("");

        setEmailSuccessMessage("");

        setEmailErrorMessage("");

        setError("");


        if (!batchId) {
            return;
        }


        await loadAttendance(
            batchId
        );
    };


    // ==========================================================
    // LOAD ATTENDANCE SUMMARY
    // ==========================================================

    const loadAttendance = async (
        batchId
    ) => {

        try {

            setLoadingAttendance(true);

            setError("");

            const response =
                await playerAttendanceService
                    .getBatchAttendancePercentage(
                        batchId
                    );


            if (response?.success) {

                setAttendance(
                    response.data || []
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to load attendance."
                );

                setAttendance([]);
            }

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Unable to load attendance."
            );

            setAttendance([]);

        } finally {

            setLoadingAttendance(false);
        }
    };


    // ==========================================================
    // VIEW STUDENT ATTENDANCE HISTORY
    // ==========================================================

    const handleViewAttendance = async (
        student
    ) => {

        try {

            setLoadingHistoryPlayerId(
                student.playerId
            );

            setError("");

            setSelectedStudent(
                student
            );

            setAttendanceHistory([]);


            const response =
                await playerAttendanceService
                    .getStudentAttendanceHistory(
                        selectedBatchId,
                        student.playerId
                    );


            if (response?.success) {

                setAttendanceHistory(
                    response.data || []
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to load student attendance history."
                );

                setAttendanceHistory([]);
            }

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Unable to load student attendance history."
            );

            setAttendanceHistory([]);

        } finally {

            setLoadingHistoryPlayerId(
                null
            );
        }
    };


    // ==========================================================
    // CLOSE HISTORY
    // ==========================================================

    const handleCloseHistory = () => {

        setSelectedStudent(null);

        setAttendanceHistory([]);

        setError("");
    };


    // ==========================================================
    // OPEN PERFORMANCE EMAIL
    // ==========================================================

    const handleOpenPerformanceEmail = (
        student
    ) => {

        setEmailStudent(student);

        setPerformanceRemarks("");

        setEmailSuccessMessage("");

        setEmailErrorMessage("");

        setError("");
    };


    // ==========================================================
    // CLOSE PERFORMANCE EMAIL
    // ==========================================================

    const handleClosePerformanceEmail = () => {

        if (sendingEmail) {
            return;
        }

        setEmailStudent(null);

        setPerformanceRemarks("");

        setEmailSuccessMessage("");

        setEmailErrorMessage("");

        setError("");
    };


    // ==========================================================
    // SEND PERFORMANCE EMAIL
    // ==========================================================

    const handleSendPerformanceEmail = async () => {

        if (!emailStudent) {
            return;
        }


        if (!performanceRemarks.trim()) {

            setEmailErrorMessage(
                "Please enter performance remarks."
            );

            return;
        }


        try {

            setSendingEmail(true);

            setError("");

            setEmailErrorMessage("");

            setEmailSuccessMessage("");


            const response =
                await playerAttendanceService
                    .sendStudentPerformanceEmail(
                        selectedBatchId,
                        emailStudent.playerId,
                        performanceRemarks.trim()
                    );




if (response?.success) {

    setEmailSuccessMessage(
        response.message ||
        "Student performance email sent successfully."
    );

    setPerformanceRemarks("");

    setTimeout(() => {

        setEmailStudent(null);

        setEmailSuccessMessage("");

    }, 1000);

} else {

    setEmailErrorMessage(
        response?.message ||
        "Unable to send performance email."
    );
}







        } catch (err) {

            setEmailErrorMessage(
                err?.response?.data?.message ||
                "Unable to send performance email."
            );

        } finally {

            setSendingEmail(false);
        }
    };


    // ==========================================================
    // FORMAT TIME
    // ==========================================================

    const formatTime = (
        time
    ) => {

        if (!time) {
            return "-";
        }

        return time.substring(
            0,
            5
        );
    };


    // ==========================================================
    // FORMAT DATE
    // ==========================================================

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "-";
        }

        const parts =
            date.split("-");

        if (parts.length !== 3) {
            return date;
        }

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
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
                    Player Attendance History
                </h2>

                <p
                    style={{
                        margin: 0,
                        color: "#6b7280"
                    }}
                >
                    View student attendance and date-wise records.
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
                NO BATCH
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
                    Please select a batch to view attendance.
                </div>

            )}


            {/* ==================================================
                LOADING SUMMARY
            ================================================== */}

            {selectedBatchId &&
                loadingAttendance && (

                    <div
                        style={{
                            background: "#ffffff",
                            padding: "40px",
                            textAlign: "center",
                            borderRadius: "10px"
                        }}
                    >
                        Loading attendance...
                    </div>

                )}


            {/* ==================================================
                SUMMARY TABLE
            ================================================== */}

            {selectedBatchId &&
                !loadingAttendance &&
                !selectedStudent && (

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
                                minWidth: "1100px"
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
                                        Total Training Days
                                    </th>

                                    <th style={thStyle}>
                                        Present Days
                                    </th>

                                    <th style={thStyle}>
                                        Absent Days
                                    </th>

                                    <th style={thStyle}>
                                        Attendance %
                                    </th>

                                    <th style={thStyle}>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {attendance.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            style={{
                                                padding: "40px",
                                                textAlign: "center",
                                                color: "#6b7280"
                                            }}
                                        >
                                            No students found
                                            in this batch.
                                        </td>

                                    </tr>

                                ) : (

                                    attendance.map(
                                        (student, index) => (

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
                                                    {student.studentName}
                                                </td>


                                                <td
                                                    style={tdStyle}
                                                >
                                                    {student.age ?? "-"}
                                                </td>


                                                <td
                                                    style={tdStyle}
                                                >
                                                    {
                                                        student.totalTrainingDays
                                                    }
                                                </td>


                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {
                                                        student.presentDays
                                                    }
                                                </td>


                                                <td
                                                    style={tdStyle}
                                                >
                                                    {
                                                        student.absentDays
                                                    }
                                                </td>


                                                <td
                                                    style={tdStyle}
                                                >

                                                    <span
                                                        style={{
                                                            display: "inline-block",
                                                            padding: "6px 10px",
                                                            borderRadius: "20px",
                                                            background:
                                                                "#eef2ff",
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {
                                                            student.attendancePercentage
                                                        }%
                                                    </span>

                                                </td>


                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        display: "flex",
                                                        gap: "8px",
                                                        alignItems: "center"
                                                    }}
                                                >

                                                    {/* ==================================
                                                        VIEW ATTENDANCE
                                                    =================================== */}

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            loadingHistoryPlayerId ===
                                                            student.playerId
                                                        }
                                                        onClick={() =>
                                                            handleViewAttendance(
                                                                student
                                                            )
                                                        }
                                                        style={{
                                                            ...viewButtonStyle,
                                                            opacity:
                                                                loadingHistoryPlayerId ===
                                                                student.playerId
                                                                    ? 0.6
                                                                    : 1
                                                        }}
                                                    >

                                                        {loadingHistoryPlayerId ===
                                                        student.playerId
                                                            ? "Loading..."
                                                            : "View Attendance"}

                                                    </button>


                                                    {/* ==================================
                                                        SEND PERFORMANCE EMAIL
                                                    =================================== */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenPerformanceEmail(
                                                                student
                                                            )
                                                        }
                                                        style={
                                                            emailButtonStyle
                                                        }
                                                    >
                                                        Send Performance Email
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                )}


            {/* ==================================================
                DATE-WISE HISTORY
            ================================================== */}

            {selectedStudent && (

                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "10px",
                        padding: "20px",
                        boxShadow:
                            "0 1px 4px rgba(0,0,0,0.08)"
                    }}
                >

                    {/* ==========================================
                        HISTORY HEADER
                    =========================================== */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                            gap: "15px",
                            flexWrap: "wrap"
                        }}
                    >

                        <div>

                            <h3
                                style={{
                                    margin: 0,
                                    marginBottom: "5px"
                                }}
                            >
                                {
                                    selectedStudent.studentName
                                }
                            </h3>

                            <div
                                style={{
                                    color: "#6b7280",
                                    fontSize: "14px"
                                }}
                            >
                                Age:{" "}
                                {selectedStudent.age ?? "-"}
                                {" | "}
                                Attendance:{" "}
                                {
                                    selectedStudent.attendancePercentage
                                }%
                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleCloseHistory
                            }
                            style={
                                closeButtonStyle
                            }
                        >
                            Back to Students
                        </button>

                    </div>


                    {/* ==========================================
                        HISTORY TABLE
                    =========================================== */}

                    <div
                        style={{
                            overflowX: "auto"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                minWidth: "850px"
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
                                        Date
                                    </th>

                                    <th style={thStyle}>
                                        Day
                                    </th>

                                    <th style={thStyle}>
                                        Status
                                    </th>

                                    <th style={thStyle}>
                                        Punch In
                                    </th>

                                    <th style={thStyle}>
                                        Punch Out
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {attendanceHistory.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            style={{
                                                padding: "40px",
                                                textAlign: "center",
                                                color: "#6b7280"
                                            }}
                                        >
                                            No attendance history
                                            found for this student.
                                        </td>

                                    </tr>

                                ) : (

                                    attendanceHistory.map(
                                        (record) => (

                                            <tr
                                                key={
                                                    `${record.playerId}-${record.attendanceDate}`
                                                }
                                                style={{
                                                    borderBottom:
                                                        "1px solid #f0f0f0"
                                                }}
                                            >

                                                <td
                                                    style={tdStyle}
                                                >
                                                    {
                                                        formatDate(
                                                            record.attendanceDate
                                                        )
                                                    }
                                                </td>


                                                <td
                                                    style={tdStyle}
                                                >
                                                    {record.day}
                                                </td>


                                                <td
                                                    style={tdStyle}
                                                >

                                                    <span
                                                        style={{
                                                            ...statusStyle,
                                                            ...(record.status ===
                                                            "PRESENT"
                                                                ? presentStyle
                                                                : absentStyle)
                                                        }}
                                                    >
                                                        {
                                                            record.status
                                                        }
                                                    </span>

                                                </td>


                                                <td
                                                    style={tdStyle}
                                                >
                                                    {
                                                        formatTime(
                                                            record.punchInTime
                                                        )
                                                    }
                                                </td>


                                                <td
                                                    style={tdStyle}
                                                >
                                                    {
                                                        formatTime(
                                                            record.punchOutTime
                                                        )
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}


            {/* ==================================================
                PERFORMANCE EMAIL MODAL
            ================================================== */}

            {emailStudent && (

                <div
                    style={modalOverlayStyle}
                >

                    <div
                        style={modalStyle}
                    >

                        {/* ======================================
                            MODAL HEADER
                        ======================================= */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px"
                            }}
                        >

                            <div>

                                <h3
                                    style={{
                                        margin: 0,
                                        marginBottom: "5px"
                                    }}
                                >
                                    Send Performance Email
                                </h3>

                                <p
                                    style={{
                                        margin: 0,
                                        color: "#6b7280",
                                        fontSize: "13px"
                                    }}
                                >
                                    Send the student's performance
                                    report to the parent.
                                </p>

                            </div>


                            <button
                                type="button"
                                disabled={sendingEmail}
                                onClick={
                                    handleClosePerformanceEmail
                                }
                                style={
                                    modalCloseButtonStyle
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* ======================================
                            STUDENT INFORMATION
                        ======================================= */}

                        <div
                            style={
                                studentSummaryBoxStyle
                            }
                        >

                            <div
                                style={summaryRowStyle}
                            >
                                <span>
                                    Student
                                </span>

                                <strong>
                                    {
                                        emailStudent.studentName
                                    }
                                </strong>
                            </div>


                            <div
                                style={summaryRowStyle}
                            >
                                <span>
                                    Age
                                </span>

                                <strong>
                                    {
                                        emailStudent.age ?? "-"
                                    }
                                </strong>
                            </div>


                            <div
                                style={summaryRowStyle}
                            >
                                <span>
                                    Total Training Days
                                </span>

                                <strong>
                                    {
                                        emailStudent.totalTrainingDays
                                    }
                                </strong>
                            </div>


                            <div
                                style={summaryRowStyle}
                            >
                                <span>
                                    Present Days
                                </span>

                                <strong>
                                    {
                                        emailStudent.presentDays
                                    }
                                </strong>
                            </div>


                            <div
                                style={summaryRowStyle}
                            >
                                <span>
                                    Absent Days
                                </span>

                                <strong>
                                    {
                                        emailStudent.absentDays
                                    }
                                </strong>
                            </div>


                            <div
                                style={summaryRowStyle}
                            >
                                <span>
                                    Attendance
                                </span>

                                <strong>
                                    {
                                        emailStudent.attendancePercentage
                                    }%
                                </strong>
                            </div>

                        </div>


                        {/* ======================================
                            SUCCESS MESSAGE
                        ======================================= */}

                        {emailSuccessMessage && (

                            <div
                                style={{
                                    marginBottom: "16px",
                                    padding: "12px 14px",
                                    borderRadius: "7px",
                                    background: "#dcfce7",
                                    color: "#166534",
                                    fontSize: "14px"
                                }}
                            >
                                {emailSuccessMessage}
                            </div>

                        )}


                        {/* ======================================
                            REMARKS
                        ======================================= */}

                        <label
                            style={{
                                display: "block",
                                fontWeight: 600,
                                marginBottom: "8px"
                            }}
                        >
                            Performance Remarks
                        </label>


                        <textarea
                            value={
                                performanceRemarks
                            }
                            onChange={(event) =>
                                setPerformanceRemarks(
                                    event.target.value
                                )
                            }
                            disabled={sendingEmail}
                            placeholder="Enter student's performance remarks..."
                            rows="5"
                            style={
                                textareaStyle
                            }
                        />


                        {/* ======================================
                            MODAL ACTIONS
                        ======================================= */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                                marginTop: "20px"
                            }}
                        >

                            <button
                                type="button"
                                disabled={sendingEmail}
                                onClick={
                                    handleClosePerformanceEmail
                                }
                                style={
                                    cancelButtonStyle
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                disabled={
                                    sendingEmail ||
                                    !performanceRemarks.trim()
                                }
                                onClick={
                                    handleSendPerformanceEmail
                                }
                                style={{
                                    ...sendEmailButtonStyle,
                                    opacity:
                                        sendingEmail ||
                                        !performanceRemarks.trim()
                                            ? 0.6
                                            : 1
                                }}
                            >
                                {sendingEmail
                                    ? "Sending..."
                                    : "Send Email"}
                            </button>

                        </div>


                        {/* ======================================
                            EMAIL ERROR POPUP
                        ======================================= */}

                        {emailErrorMessage && (

                            <div
                                style={
                                    emailErrorOverlayStyle
                                }
                            >

                                <div
                                    style={
                                        emailErrorPopupStyle
                                    }
                                >

                                    <div
                                        style={
                                            emailErrorIconStyle
                                        }
                                    >
                                        ⚠
                                    </div>


                                    <h3
                                        style={{
                                            margin:
                                                "0 0 10px 0",
                                            color: "#b91c1c",
                                            fontSize: "18px"
                                        }}
                                    >
                                        Unable to Send Email
                                    </h3>


                                    <p
                                        style={{
                                            margin:
                                                "0 0 20px 0",
                                            color: "#374151",
                                            fontSize: "14px",
                                            lineHeight: "1.5"
                                        }}
                                    >
                                        {
                                            emailErrorMessage
                                        }
                                    </p>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEmailErrorMessage(
                                                ""
                                            )
                                        }
                                        style={
                                            emailErrorOkButtonStyle
                                        }
                                    >
                                        OK
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
};


// ==========================================================
// STYLES
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


const viewButtonStyle = {
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    background: "#111827",
    color: "#ffffff"
};


const emailButtonStyle = {
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    background: "#2563eb",
    color: "#ffffff"
};


const closeButtonStyle = {
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    background: "#ffffff",
    color: "#374151"
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


// ==========================================================
// EMAIL MODAL STYLES
// ==========================================================

const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 9999,
    boxSizing: "border-box"
};


const modalStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxSizing: "border-box",
    boxShadow:
        "0 10px 35px rgba(0,0,0,0.2)"
};


const modalCloseButtonStyle = {
    border: "none",
    background: "transparent",
    fontSize: "26px",
    lineHeight: 1,
    cursor: "pointer",
    color: "#6b7280"
};


const studentSummaryBoxStyle = {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "14px",
    marginBottom: "20px"
};


const summaryRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "7px 0",
    fontSize: "14px",
    color: "#374151"
};


const textareaStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit"
};


const cancelButtonStyle = {
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "9px 16px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    background: "#ffffff",
    color: "#374151"
};


const sendEmailButtonStyle = {
    border: "none",
    borderRadius: "6px",
    padding: "9px 16px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    background: "#2563eb",
    color: "#ffffff"
};


// ==========================================================
// EMAIL ERROR POPUP STYLES
// ==========================================================

const emailErrorOverlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255,255,255,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",
    zIndex: 20,
    padding: "20px",
    boxSizing: "border-box"
};


const emailErrorPopupStyle = {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "10px",
    padding: "24px",
    textAlign: "center",
    boxShadow:
        "0 10px 30px rgba(0,0,0,0.20)",
    border: "1px solid #fecaca",
    boxSizing: "border-box"
};


const emailErrorIconStyle = {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#b91c1c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px auto",
    fontSize: "20px",
    fontWeight: 700
};


const emailErrorOkButtonStyle = {
    border: "none",
    borderRadius: "6px",
    padding: "9px 24px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    background: "#b91c1c",
    color: "#ffffff"
};


export default PlayerAttendanceHistory;