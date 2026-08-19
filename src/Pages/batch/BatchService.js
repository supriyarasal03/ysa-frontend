import api from "../../api/axiosClient";

// ==========================================================
// BATCH APIs
// ==========================================================

export const addBatch = async (payload) => {
  try {
    const res = await api.post("/batches", payload);
    return res.data;
  } catch (error) {
    const backend = error.response?.data;

    const err = new Error(
      backend?.message || "Failed to create batch"
    );

    err.data = backend?.data ?? null;
    err.response = error.response;

    throw err;
  }
};

export const updateBatch = async (id, payload) => {
  try {
    const res = await api.put(`/batches/${id}`, payload);
    return res.data;
  } catch (error) {
    const backend = error.response?.data;

    const err = new Error(
      backend?.message || "Failed to update batch"
    );

    err.data = backend?.data ?? null;
    err.response = error.response;

    throw err;
  }
};

export const getBatchById = async (id) => {
  try {
    const res = await api.get(`/batches/${id}`);
    return res.data;
  } catch (error) {
    const backend = error.response?.data;

    const err = new Error(
      backend?.message || "Failed to fetch batch"
    );

    err.data = backend?.data ?? null;
    err.response = error.response;

    throw err;
  }
};

export const getAllBatches = async () => {
  try {
    const res = await api.get("/batches");
    return res.data;
  } catch (error) {
    const backend = error.response?.data;

    const err = new Error(
      backend?.message || "Failed to fetch batches"
    );

    err.data = backend?.data ?? null;
    err.response = error.response;

    throw err;
  }
};

// ==========================================================
// DEACTIVATE BATCH
// ==========================================================

export const deactivateBatch = async (id) => {
  try {
    const res = await api.delete(`/batches/${id}`);
    return res.data;
  } catch (error) {
    const backend = error.response?.data;

    const err = new Error(
      backend?.message || "Failed to deactivate batch"
    );

    err.data = backend?.data ?? null;
    err.response = error.response;

    throw err;
  }
};

// ==========================================================
// SPORTS
// ==========================================================

export const getSports = async () => {
  try {
    const res = await api.get("/sport");
    return res.data;
  } catch (error) {
    const backend = error.response?.data;

    const err = new Error(
      backend?.message || "Failed to fetch sports"
    );

    err.data = backend?.data ?? null;
    err.response = error.response;

    throw err;
  }
};

// ==========================================================
// AVAILABLE COACHES
// ==========================================================

export const getAvailableCoaches = async ({
  sportId,
  startTime,
  endTime,
  trainingDays,
  excludeBatchId = null,
}) => {
  try {
    const params = {
      sportId,
      startTime,
      endTime,
      trainingDays,
    };

    if (excludeBatchId) {
      params.excludeBatchId = excludeBatchId;
    }

    const res = await api.get(
      "/batches/available-coaches",
      {
        params,
      }
    );

    return res.data;
  } catch (error) {
    const backend = error.response?.data;

    const err = new Error(
      backend?.message ||
        "Failed to fetch available coaches"
    );

    err.data = backend?.data ?? null;
    err.response = error.response;

    throw err;
  }
};