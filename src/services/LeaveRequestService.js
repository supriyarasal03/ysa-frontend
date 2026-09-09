import axiosClient from "../api/axiosClient";

const LeaveRequestService = {

    // ==========================================================
    // CREATE LEAVE REQUEST
    // ==========================================================

    createLeaveRequest: async (
        fromDate,
        toDate,
        reason
    ) => {

        const res = await axiosClient.post(
            "/leave-requests",
            {
                fromDate,
                toDate,
                reason
            }
        );

        return res.data;
    },


    // ==========================================================
    // GET MY LEAVE REQUESTS
    // ==========================================================

    getMyLeaveRequests: async () => {

        const res = await axiosClient.get(
            "/leave-requests/my"
        );

        return res.data;
    },


    // ==========================================================
    // GET ALL LEAVE REQUESTS - ADMIN
    // ==========================================================

    getAllLeaveRequests: async () => {

        const res = await axiosClient.get(
            "/leave-requests/admin"
        );

        return res.data;
    },


    // ==========================================================
    // APPROVE LEAVE REQUEST - ADMIN
    // ==========================================================

    approveLeaveRequest: async (
        id,
        adminRemark = ""
    ) => {

        const res = await axiosClient.put(
            `/leave-requests/${id}/approve`,
            null,
            {
                params: {
                    adminRemark
                }
            }
        );

        return res.data;
    },


    // ==========================================================
    // REJECT LEAVE REQUEST - ADMIN
    // ==========================================================

    rejectLeaveRequest: async (
        id,
        adminRemark = ""
    ) => {

        const res = await axiosClient.put(
            `/leave-requests/${id}/reject`,
            null,
            {
                params: {
                    adminRemark
                }
            }
        );

        return res.data;
    }

};


export default LeaveRequestService;