import axiosClient from "../../api/axiosClient";

const PlayerService = {

  // =========================================================
  // GET ALL PLAYERS
  // =========================================================

  getAll: async () => {
    const res = await axiosClient.get("/player");
    return res.data;
  },


  // =========================================================
  // GET PLAYER BY ID
  // =========================================================

  getById: async (id) => {
    const res = await axiosClient.get(`/player/${id}`);
    return res.data;
  },


  // =========================================================
  // GET ALL SPORTS
  // =========================================================

  getSports: async () => {
    const res = await axiosClient.get("/sport");
    return res.data;
  },


  // =========================================================
  // OLD CREATE PLAYER
  // =========================================================

  create: async (formData) => {
    const res = await axiosClient.post(
      "/player",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  },


  // =========================================================
  // ONE FORM PLAYER REGISTRATION
  // PLAYER + ENROLLMENT + INSTALLMENTS + PAYMENT
  // =========================================================

  register: async (formData) => {
    const res = await axiosClient.post(
      "/player/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  },


  // =========================================================
  // UPDATE PLAYER
  // =========================================================

  update: async (id, formData) => {
    const res = await axiosClient.put(
      `/player/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  },


  // =========================================================
  // ACTIVATE PLAYER
  // =========================================================

  activate: async (id) => {
    const res = await axiosClient.put(
      `/player/${id}/activate`
    );

    return res.data;
  },


  // =========================================================
  // DEACTIVATE PLAYER
  // =========================================================

  deactivate: async (id) => {
    const res = await axiosClient.put(
      `/player/${id}/deactivate`
    );

    return res.data;
  },

};

export default PlayerService;