import api from "../../api/axiosClient";

// ==========================================================
// INVENTORY APIs
// ==========================================================

export const getAllInventory = async () => {
  const response = await api.get("/inventory");
  return response.data;
};


export const getInventoryById = async (id) => {
  const response = await api.get(`/inventory/${id}`);
  return response.data;
};


// ==========================================================
// SEARCH INVENTORY
// ==========================================================

export const searchInventory = async ({
  sportId = "",
  subItem = "",
  brand = "",
  status = "",
} = {}) => {

  const params = {};

  if (sportId) {
    params.sportId = sportId;
  }

  if (subItem?.trim()) {
    params.subItem = subItem.trim();
  }

  if (brand?.trim()) {
    params.brand = brand.trim();
  }

  if (status) {
    params.status = status;
  }

  const response = await api.get(
    "/inventory/search",
    {
      params,
    }
  );

  return response.data;
};


// ==========================================================
// ADD INVENTORY
// ==========================================================

export const addInventory = async (payload) => {

  const response = await api.post(
    "/inventory",
    payload
  );

  return response.data;
};


// ==========================================================
// UPDATE INVENTORY
//
// Cost price
// Selling price
// Low stock alert
//
// Stock is NOT updated here.
// ==========================================================

export const updateInventory = async (
  id,
  payload
) => {

  const response = await api.put(
    `/inventory/${id}`,
    payload
  );

  return response.data;
};


// ==========================================================
// RECEIVE STOCK
//
// Quantity
// Cost Price
// Selling Price
// ==========================================================

export const receiveStock = async (
  id,
  payload
) => {

  const response = await api.post(
    `/inventory/${id}/receive-stock`,
    payload
  );

  return response.data;
};


// ==========================================================
// DEACTIVATE INVENTORY
// ==========================================================

export const deactivateInventory = async (
  id
) => {

  const response = await api.delete(
    `/inventory/${id}`
  );

  return response.data;
};


// ==========================================================
// UPDATE STATUS
// ==========================================================

export const updateInventoryStatus = async (
  id,
  status
) => {

  const response = await api.patch(
    `/inventory/${id}/status`,
    null,
    {
      params: {
        status,
      },
    }
  );

  return response.data;
};


// ==========================================================
// SPORT API
// ==========================================================

export const getAllSports = async () => {

  const response = await api.get(
    "/sport"
  );

  return response.data;
};