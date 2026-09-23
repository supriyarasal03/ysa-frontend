import axiosClient from "../api/axiosClient";

const PlayerEnquiryService = {

  // =========================================================
  // GET AVAILABLE SPORTS
  // =========================================================

  getSports: async () => {
    const response = await axiosClient.get(
      "/player-enquiries/sports"
    );

    return response.data;
  },


  // =========================================================
  // GET ACTIVE BATCHES BY SPORT
  // =========================================================

  getBatchesBySport: async (sportId) => {
    const response = await axiosClient.get(
      `/player-enquiries/sports/${sportId}/batches`
    );

    return response.data;
  },


  // =========================================================
  // CREATE PLAYER ENQUIRY
  // =========================================================

  create: async (data) => {
    const response = await axiosClient.post(
      "/player-enquiries",
      data
    );

    return response.data;
  },


  // =========================================================
  // GET ALL ENQUIRIES
  // Receptionist/Admin - view only
  // =========================================================

  getAll: async () => {
    const response = await axiosClient.get(
      "/player-enquiries"
    );

    return response.data;
  },


  // =========================================================
  // GET ENQUIRY BY ID
  // Receptionist/Admin - view only
  // =========================================================

  getById: async (id) => {
    const response = await axiosClient.get(
      `/player-enquiries/${id}`
    );

    return response.data;
  },
};

export default PlayerEnquiryService;