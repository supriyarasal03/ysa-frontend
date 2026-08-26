import api from "../../api/axiosClient";

// ==========================================================
// PLAYER INVENTORY TRANSACTION APIs
// ==========================================================

// Get all student inventory transactions
export const getAllPlayerInventoryTransactions = async () => {
  const response = await api.get(
    "/player-inventory-transactions"
  );

  return response.data;
};


// Get transactions for one player
export const getPlayerInventoryTransactions = async (playerId) => {
  const response = await api.get(
    `/player-inventory-transactions/player/${playerId}`
  );

  return response.data;
};


// Get one transaction
export const getPlayerInventoryTransactionById = async (id) => {
  const response = await api.get(
    `/player-inventory-transactions/${id}`
  );

  return response.data;
};


// Create transaction
export const createPlayerInventoryTransaction = async (payload) => {
  const response = await api.post(
    "/player-inventory-transactions",
    payload
  );

  return response.data;
};