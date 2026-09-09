import React, {
    useEffect,
    useState
} from "react";

import LeaveRequestService
    from "../../services/LeaveRequestService";


const LeaveRequests = () => {

    // ==========================================================
    // STATES
    // ==========================================================

    const [leaveRequests, setLeaveRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [processingId, setProcessingId] =
        useState(null);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [selectedStatus, setSelectedStatus] =
        useState("ALL");


    // ==========================================================
    // LOAD ALL REQUESTS
    // ==========================================================

    useEffect(() => {

        loadLeaveRequests();

    }, []);


    // ==========================================================
    // LOAD REQUESTS
    // ==========================================================

    const loadLeaveRequests = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await LeaveRequestService
                    .getAllLeaveRequests();

            setLeaveRequests(
                response || []
            );

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Unable to load leave requests."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================================
    // APPROVE
    // ==========================================================

    const handleApprove = async (
        request
    ) => {

        const adminRemark =
            window.prompt(
                "Enter admin remark (optional):"
            );


        if (
            adminRemark === null
        ) {
            return;
        }


        try {

            setProcessingId(
                request.id
            );

            setError("");

            setSuccessMessage("");


            await LeaveRequestService
                .approveLeaveRequest(
                    request.id,
                    adminRemark
                );


            setSuccessMessage(
                "Leave request approved successfully."
            );


            await loadLeaveRequests();

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Unable to approve leave request."
            );

        } finally {

            setProcessingId(null);
        }
    };


    // ==========================================================
    // REJECT
    // ==========================================================

    const handleReject = async (
        request
    ) => {

        const adminRemark =
            window.prompt(
                "Enter reason for rejection:"
            );


        if (
            adminRemark === null
        ) {
            return;
        }


        if (
            !adminRemark.trim()
        ) {

            window.alert(
                "Please enter a rejection reason."
            );

            return;
        }


        try {

            setProcessingId(
                request.id
            );

            setError("");

            setSuccessMessage("");


            await LeaveRequestService
                .rejectLeaveRequest(
                    request.id,
                    adminRemark.trim()
                );


            setSuccessMessage(
                "Leave request rejected successfully."
            );


            await loadLeaveRequests();

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Unable to reject leave request."
            );

        } finally {

            setProcessingId(null);
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
    // STATUS STYLE
    // ==========================================================

    const getStatusStyle = (
        status
    ) => {

        if (
            status === "APPROVED"
        ) {

            return {
                ...statusStyle,
                ...approvedStyle
            };
        }


        if (
            status === "REJECTED"
        ) {

            return {
                ...statusStyle,
                ...rejectedStyle
            };
        }


        if (
            status === "CANCELLED"
        ) {

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
    // FILTER
    // ==========================================================

    const filteredRequests =
        selectedStatus === "ALL"
            ? leaveRequests
            : leaveRequests.filter(
                request =>
                    request.status ===
                    selectedStatus
            );


    // ==========================================================
    // PENDING COUNT
    // ==========================================================

    const pendingCount =
        leaveRequests.filter(
            request =>
                request.status === "PENDING"
        ).length;


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
                    Leave Requests
                </h2>

                <p
                    style={{
                        margin: 0,
                        color: "#6b7280"
                    }}
                >
                    Review and manage staff leave requests.
                </p>

            </div>


            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div
                style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "20px"
                }}
            >

                <div
                    style={{
                        background: "#ffffff",
                        padding: "18px 22px",
                        borderRadius: "10px",
                        minWidth: "180px",
                        boxShadow:
                            "0 1px 4px rgba(0,0,0,0.08)"
                    }}
                >

                    <div
                        style={{
                            fontSize: "13px",
                            color: "#6b7280",
                            marginBottom: "6px"
                        }}
                    >
                        Pending Requests
                    </div>

                    <div
                        style={{
                            fontSize: "26px",
                            fontWeight: 700,
                            color: "#111827"
                        }}
                    >
                        {pendingCount}
                    </div>

                </div>

            </div>


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
                FILTER
            ================================================== */}

            <div
                style={{
                    background: "#ffffff",
                    padding: "18px 20px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    boxShadow:
                        "0 1px 4px rgba(0,0,0,0.08)"
                }}
            >

                <label
                    style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom: "7px",
                        color: "#374151"
                    }}
                >
                    Filter Status
                </label>


                <select
                    value={selectedStatus}
                    onChange={(event) =>
                        setSelectedStatus(
                            event.target.value
                        )
                    }
                    style={{
                        width: "220px",
                        padding: "10px 12px",
                        border:
                            "1px solid #d1d5db",
                        borderRadius: "7px",
                        background: "#ffffff",
                        fontSize: "14px"
                    }}
                >

                    <option value="ALL">
                        All Requests
                    </option>

                    <option value="PENDING">
                        Pending
                    </option>

                    <option value="APPROVED">
                        Approved
                    </option>

                    <option value="REJECTED">
                        Rejected
                    </option>

                    <option value="CANCELLED">
                        Cancelled
                    </option>

                </select>

            </div>


            {/* ==================================================
                TABLE
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

                {loading ? (

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
                            minWidth: "1250px"
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
                                    Employee
                                </th>

                                <th style={thStyle}>
                                    Username
                                </th>

                                <th style={thStyle}>
                                    Role
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
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredRequests.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="10"
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

                                filteredRequests.map(
                                    (request, index) => {

                                        const isProcessing =
                                            processingId ===
                                            request.id;


                                        return (

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
                                                    style={{
                                                        ...tdStyle,
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {request.employeeName ||
                                                        "-"}
                                                </td>


                                                <td
                                                    style={tdStyle}
                                                >
                                                    {request.username ||
                                                        "-"}
                                                </td>


                                                <td
                                                    style={tdStyle}
                                                >
                                                    {request.role ||
                                                        "-"}
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
                                                        minWidth:
                                                            "220px"
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
                                                        minWidth:
                                                            "200px"
                                                    }}
                                                >
                                                    {request.adminRemark ||
                                                        "-"}
                                                </td>


                                                <td
                                                    style={tdStyle}
                                                >

                                                    {request.status ===
                                                        "PENDING" ? (

                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                gap:
                                                                    "8px"
                                                            }}
                                                        >

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isProcessing
                                                                }
                                                                onClick={() =>
                                                                    handleApprove(
                                                                        request
                                                                    )
                                                                }
                                                                style={{
                                                                    ...approveButtonStyle,
                                                                    opacity:
                                                                        isProcessing
                                                                            ? 0.6
                                                                            : 1
                                                                }}
                                                            >
                                                                {isProcessing
                                                                    ? "Processing..."
                                                                    : "Approve"}
                                                            </button>


                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isProcessing
                                                                }
                                                                onClick={() =>
                                                                    handleReject(
                                                                        request
                                                                    )
                                                                }
                                                                style={{
                                                                    ...rejectButtonStyle,
                                                                    opacity:
                                                                        isProcessing
                                                                            ? 0.6
                                                                            : 1
                                                                }}
                                                            >
                                                                {isProcessing
                                                                    ? "Processing..."
                                                                    : "Reject"}
                                                            </button>

                                                        </div>

                                                    ) : (

                                                        <span
                                                            style={{
                                                                color:
                                                                    "#6b7280",
                                                                fontSize:
                                                                    "13px"
                                                            }}
                                                        >
                                                            No action
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

                )}

            </div>

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


const approveButtonStyle = {
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    background: "#166534",
    color: "#ffffff"
};


const rejectButtonStyle = {
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    background: "#b91c1c",
    color: "#ffffff"
};


export default LeaveRequests;