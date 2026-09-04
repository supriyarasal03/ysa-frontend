import attendanceAxiosClient
    from "../../api/attendanceAxiosClient";

import attendancePunchAxiosClient
    from "../../api/attendancePunchAxiosClient";


const playerAttendanceService = {

    // ==========================================================
    // GET COACH'S ACTIVE BATCHES
    // ==========================================================

    getCoachBatches: async () => {

        const response =
            await attendanceAxiosClient.get(
                "/coach-dashboard/batches"
            );

        return response.data;
    },


    // ==========================================================
    // GET STUDENTS OF SELECTED BATCH
    // ==========================================================

    getBatchStudents: async (
        batchId
    ) => {

        const response =
            await attendanceAxiosClient.get(
                `/coach-dashboard/batches/${batchId}/students`
            );

        return response.data;
    },


    // ==========================================================
    // COACH PUNCH IN STUDENT
    // ==========================================================

    punchInStudent: async (
        batchId,
        playerId
    ) => {

        const response =
            await attendancePunchAxiosClient.post(
                `/coach-dashboard/batches/${batchId}/students/${playerId}/attendance/punch-in`
            );

        return response.data;
    },


    // ==========================================================
    // COACH PUNCH OUT STUDENT
    // ==========================================================

    punchOutStudent: async (
        batchId,
        playerId
    ) => {

        const response =
            await attendancePunchAxiosClient.post(
                `/coach-dashboard/batches/${batchId}/students/${playerId}/attendance/punch-out`
            );

        return response.data;
    },


    // ==========================================================
    // GET BATCH ATTENDANCE PERCENTAGE
    // ==========================================================

    getBatchAttendancePercentage: async (
        batchId
    ) => {

        const response =
            await attendanceAxiosClient.get(
                `/coach-dashboard/batches/${batchId}/attendance/percentage`
            );

        return response.data;
    },


    // ==========================================================
    // GET STUDENT DATE-WISE ATTENDANCE HISTORY
    // ==========================================================

    getStudentAttendanceHistory: async (
        batchId,
        playerId
    ) => {

        const response =
            await attendanceAxiosClient.get(
                `/coach-dashboard/batches/${batchId}/students/${playerId}/attendance/history`
            );

        return response.data;
    },


    // ==========================================================
    // SEND STUDENT PERFORMANCE EMAIL
    // ==========================================================

    sendStudentPerformanceEmail: async (
        batchId,
        playerId,
        remarks
    ) => {

        const response =
            await attendanceAxiosClient.post(
                `/coach-dashboard/batches/${batchId}/students/${playerId}/performance-email`,
                {
                    remarks
                }
            );

        return response.data;
    }

};


export default playerAttendanceService;