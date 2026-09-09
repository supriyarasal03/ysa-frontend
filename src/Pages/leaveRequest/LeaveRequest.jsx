import React, {
    useEffect,
    useState
} from "react";

import LeaveRequestService
    from "../../services/LeaveRequestService";


const LeaveRequest = () => {

    // ==========================================================
    // STATES
    // ==========================================================

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    const [reason, setReason] =
        useState("");

    const [leaveRequests, setLeaveRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [loadingRequests, setLoadingRequests] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    // ==========================================================
    // LOAD MY LEAVE REQUESTS
    // ==========================================================

    useEffect(() => {

        loadMyLeaveRequests();

    }, []);


    // ==========================================================
    // LOAD REQUESTS
    // ==========================================================

    const loadMyLeaveRequests = async () => {

        try {

            setLoadingRequests(true);

            setError("");

            const response =
                await LeaveRequestService
                    .getMyLeaveRequests();

            setLeaveRequests(
                response || []
            );

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Unable to load leave requests."
            );

        } finally {

            setLoadingRequests(false);
        }
    };


    // ==========================================================
    // SUBMIT LEAVE REQUEST
    // ==========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccessMessage("");


        // ------------------------------------------------------
        // VALIDATE FROM DATE
        // ------------------------------------------------------

        if (!fromDate) {

            setError(
                "Please select leave from date."
            );

            return;
        }


        // ------------------------------------------------------
        // VALIDATE TO DATE
        // ------------------------------------------------------

        if (!toDate) {

            setError(
                "Please select leave to date."
            );

            return;
        }


        // ------------------------------------------------------
        // VALIDATE DATE RANGE
        // ------------------------------------------------------

        if (toDate < fromDate) {

            setError(
                "Leave to date cannot be before from date."
            );

            return;
        }


        // ------------------------------------------------------
        // VALIDATE REASON
        // ------------------------------------------------------

        if (!reason.trim()) {

            setError(
                "Please enter leave reason."
            );

            return;
        }


        try {

            setLoading(true);


            await LeaveRequestService
                .createLeaveRequest(
                    fromDate,
                    toDate,
                    reason.trim()
                );


            // --------------------------------------------------
            // RESET FORM
            // --------------------------------------------------

            setFromDate("");

            setToDate("");

            setReason("");


            setSuccessMessage(
                "Leave request submitted successfully."
            );


            // --------------------------------------------------
            // REFRESH REQUESTS
            // --------------------------------------------------

            await loadMyLeaveRequests();

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Unable to submit leave request."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================================
    // FORMAT DATE
    // ==========================================================

    const formatDate = (date) => {

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
    // GET STATUS STYLE
    // ==========================================================

    const getStatusStyle = (status) => {

        if (status === "APPROVED") {

            return {
                ...statusStyle,
                ...approvedStyle
            };
        }


        if (status === "REJECTED") {

            return {
                ...statusStyle,
                ...rejectedStyle
            };
        }


        if (status === "CANCELLED") {

            return {
                ...statusStyle,
                ...cancelledStyle
            };
        }


        return {
            ...statusStyle,
            ...pendingStyle
        };
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
                PAGE HEADER
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
                    Leave Request
                </h2>

                <p
                    style={{
                        margin: 0,
                        color: "#6b7280"
                    }}
                >
                    Submit your leave request and check its status.
                </p>

            </div>


            {/* ==================================================
                SUCCESS MESSAGE
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
                ERROR MESSAGE
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
                LEAVE REQUEST FORM
            ================================================== */}

            <div
                style={{
                    background: "#ffffff",
                    padding: "24px",
                    borderRadius: "10px",
                    marginBottom: "24px",
                    boxShadow:
                        "0 1px 4px rgba(0,0,0,0.08)"
                }}
            >

                <h3
                    style={{
                        marginTop: 0,
                        marginBottom: "20px"
                    }}
                >
                    Send Leave Request
                </h3>


                <form
                    onSubmit={handleSubmit}
                >

                    {/* ------------------------------------------
                        FROM DATE
                    ------------------------------------------- */}

                    <div
                        style={{
                            marginBottom: "18px"
                        }}
                    >

                        <label
                            style={labelStyle}
                        >
                            From Date
                        </label>

                        <input
                            type="date"
                            value={fromDate}
                            onChange={(event) =>
                                setFromDate(
                                    event.target.value
                                )
                            }
                            style={inputStyle}
                        />

                    </div>


                    {/* ------------------------------------------
                        TO DATE
                    ------------------------------------------- */}

                    <div
                        style={{
                            marginBottom: "18px"
                        }}
                    >

                        <label
                            style={labelStyle}
                        >
                            To Date
                        </label>

                        <input
                            type="date"
                            value={toDate}
                            onChange={(event) =>
                                setToDate(
                                    event.target.value
                                )
                            }
                            style={inputStyle}
                        />

                    </div>


                    {/* ------------------------------------------
                        REASON
                    ------------------------------------------- */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label
                            style={labelStyle}
                        >
                            Reason
                        </label>

                        <textarea
                            value={reason}
                            onChange={(event) =>
                                setReason(
                                    event.target.value
                                )
                            }
                            placeholder="Enter reason for leave"
                            rows={4}
                            style={{
                                ...inputStyle,
                                resize: "vertical"
                            }}
                        />

                    </div>


                    {/* ------------------------------------------
                        SUBMIT
                    ------------------------------------------- */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...submitButtonStyle,
                            opacity: loading
                                ? 0.6
                                : 1
                        }}
                    >
                        {loading
                            ? "Submitting..."
                            : "Send Request"}
                    </button>

                </form>

            </div>


            {/* ==================================================
                MY LEAVE REQUESTS
            ================================================== */}

            <div
                style={{
                    background: "#ffffff",
                    borderRadius: "10px",
                    overflowX: "auto",
                    boxShadow:
                        "0 1px 4px rgba(0,0,0,0.08)"
                }}
            >

                <div
                    style={{
                        padding: "20px",
                        borderBottom:
                            "1px solid #e5e7eb"
                    }}
                >

                    <h3
                        style={{
                            margin: 0
                        }}
                    >
                        My Leave Requests
                    </h3>

                </div>


                {loadingRequests ? (

                    <div
                        style={{
                            padding: "40px",
                            textAlign: "center",
                            color: "#6b7280"
                        }}
                    >
                        Loading leave requests...
                    </div>

                ) : (

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
                                    background: "#f9fafb",
                                    borderBottom:
                                        "1px solid #e5e7eb"
                                }}
                            >

                                <th style={thStyle}>
                                    #
                                </th>

                                <th style={thStyle}>
                                    From Date
                                </th>

                                <th style={thStyle}>
                                    To Date
                                </th>

                                <th style={thStyle}>
                                    Reason
                                </th>

                                <th style={thStyle}>
                                    Status
                                </th>

                                <th style={thStyle}>
                                    Admin Remark
                                </th>

                                <th style={thStyle}>
                                    Requested At
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {leaveRequests.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        style={{
                                            padding: "40px",
                                            textAlign: "center",
                                            color: "#6b7280"
                                        }}
                                    >
                                        No leave requests found.
                                    </td>

                                </tr>

                            ) : (

                                leaveRequests.map(
                                    (request, index) => (

                                        <tr
                                            key={request.id}
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
                                                style={tdStyle}
                                            >
                                                {formatDate(
                                                    request.fromDate
                                                )}
                                            </td>


                                            <td
                                                style={tdStyle}
                                            >
                                                {formatDate(
                                                    request.toDate
                                                )}
                                            </td>


                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    whiteSpace:
                                                        "normal",
                                                    minWidth: "220px"
                                                }}
                                            >
                                                {request.reason}
                                            </td>


                                            <td
                                                style={tdStyle}
                                            >

                                                <span
                                                    style={
                                                        getStatusStyle(
                                                            request.status
                                                        )
                                                    }
                                                >
                                                    {request.status}
                                                </span>

                                            </td>


                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    whiteSpace:
                                                        "normal",
                                                    minWidth: "200px"
                                                }}
                                            >
                                                {request.adminRemark ||
                                                    "-"}
                                            </td>


                                            <td
                                                style={tdStyle}
                                            >
                                                {request.requestedAt
                                                    ? new Date(
                                                        request.requestedAt
                                                    ).toLocaleString()
                                                    : "-"}
                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
};


// ==========================================================
// STYLES
// ==========================================================

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151"
};


const inputStyle = {
    width: "100%",
    maxWidth: "500px",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff"
};


const submitButtonStyle = {
    border: "none",
    borderRadius: "7px",
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    background: "#111827",
    color: "#ffffff"
};


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
    whiteSpace: "nowrap",
    verticalAlign: "top"
};


const statusStyle = {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600
};


const pendingStyle = {
    background: "#fef3c7",
    color: "#92400e"
};


const approvedStyle = {
    background: "#dcfce7",
    color: "#166534"
};


const rejectedStyle = {
    background: "#fee2e2",
    color: "#b91c1c"
};


const cancelledStyle = {
    background: "#f3f4f6",
    color: "#6b7280"
};


export default LeaveRequest;