import api from "../api/axiosClient"; // adjust path if needed

export const getAllSports = async () => {
  try {
    const res = await api.get("/sport");
    return res.data;
  } catch (error) {
    const err = new Error(
      error.response?.data?.message || "Failed to fetch sports"
    );
    err.data = error.response?.data?.data || error.response?.data;
    throw err;
  }
};

export const getSportById = async (id) => {
  try {
    const res = await api.get(`/sport/${id}`);
    return res.data;
  } catch (error) {
    const backend = error.response?.data;
    const err = new Error(backend?.message || "Failed to fetch sport");
    err.data = backend?.data ?? null;
    err.response = error.response;
    throw err;
  }
};

export const addSport = async (payload) => {
  try {
    const res = await api.post("/sport", payload);
    return res.data;
  } catch (error) {
    const backend = error.response?.data;
    const err = new Error(backend?.message || "Failed to create sport");
    err.data = backend?.data ?? null;
    err.response = error.response;
    throw err;
  }
};

export const updateSport = async (id, payload) => {
  try {
    const res = await api.put(`/sport/${id}`, payload);
    return res.data;
  } catch (error) {
    const backend = error.response?.data;
    const err = new Error(backend?.message || "Failed to update sport");
    err.data = backend?.data ?? null;
    err.response = error.response;
    throw err;
  }
};

export const deactivateSport = async (id) => {
  try {
    const res = await api.delete(`/sport/${id}`);
    return res.data;
  } catch (error) {
    const backend = error.response?.data;
    const err = new Error(backend?.message || "Failed to deactivate sport");
    err.data = backend?.data ?? null;
    err.response = error.response;
    throw err;
  }
};



export const updateSportStatus = async (id, status) => {
  try {
    // status should be "ACTIVE" or "INACTIVE"
    const res = await api.patch(`/sport/${id}/status`, null, {
      params: { status },
    });
    return res.data;
  } catch (error) {
    const backend = error.response?.data;
    const err = new Error(
      backend?.message || "Failed to update sport status"
    );
    err.data = backend?.data ?? null;
    err.response = error.response;
    throw err;
  }
};