import axiosClient from "../../api/axiosClient";

const AdminDashboardService = {

  // =========================================================
  // GET DASHBOARD SUMMARY
  // =========================================================

  getDashboardSummary: async (month, year) => {

    const response = await axiosClient.get(
      "/admin-dashboard/summary",
      {
        params: {
          month,
          year,
        },
      }
    );

    return response.data;
  },

};

export default AdminDashboardService;