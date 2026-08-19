import axiosClient from "../../api/axiosClient";

const PlayerService = {
  // Get all players
  getAll: async () => {
    const res = await axiosClient.get("/player");   // ✅ correct
    return res.data;
  },

  // Get single player
  getById: async (id) => {
    const res = await axiosClient.get(`/player/${id}`);  // ✅ correct
    return res.data;
  },

  // Create player (multipart)
  create: async (formData) => {
    const res = await axiosClient.post("/player", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Update player (when you add it later)
  update: async (id, formData) => {
    const res = await axiosClient.put(`/player/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Delete / deactivate
  delete: async (id) => {
    const res = await axiosClient.delete(`/player/${id}`);
    return res.data;
  },
};

export default PlayerService;