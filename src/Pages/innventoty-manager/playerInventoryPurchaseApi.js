import api from "../../api/axiosClient";

// ==========================================================
// COMMON ERROR HANDLER
// ==========================================================

const handleApiError = (error, fallbackMessage) => {
  const backend = error?.response?.data;

  const err = new Error(
    backend?.message || fallbackMessage
  );

  err.data = backend?.data ?? null;
  err.response = error?.response;

  throw err;
};


// ==========================================================
// GET SPORTS
// ==========================================================

export const getPurchaseSports = async () => {
  try {
    const response = await api.get(
      "/player-inventory-purchase/sports"
    );

    return response.data;
  } catch (error) {
    handleApiError(
      error,
      "Failed to fetch sports."
    );
  }
};


// ==========================================================
// GET ONGOING BATCHES BY SPORT
// ==========================================================

export const getPurchaseBatches = async (
  sportId
) => {
  try {
    const response = await api.get(
      `/player-inventory-purchase/sports/${sportId}/batches`
    );

    return response.data;
  } catch (error) {
    handleApiError(
      error,
      "Failed to fetch ongoing batches."
    );
  }
};


// ==========================================================
// GET ACTIVE PLAYERS BY BATCH
// ==========================================================

export const getPurchasePlayers = async (
  sportId,
  batchId
) => {
  try {
    const response = await api.get(
      `/player-inventory-purchase/sports/${sportId}/batches/${batchId}/players`
    );

    return response.data;
  } catch (error) {
    handleApiError(
      error,
      "Failed to fetch students."
    );
  }
};


// ==========================================================
// GET ACTIVE INVENTORY BY SPORT
// ==========================================================

export const getPurchaseInventory = async (
  sportId
) => {
  try {
    const response = await api.get(
      `/player-inventory-purchase/sports/${sportId}/inventory`
    );

    return response.data;
  } catch (error) {
    handleApiError(
      error,
      "Failed to fetch inventory."
    );
  }
};


// ==========================================================
// GENERATE UPI QR
// ==========================================================

export const generateUpiQr = async (amount) => {
  try {
    const response = await api.get(
      `/payment/upi-qr?amount=${amount}`
    );

    return response.data;
  } catch (error) {
    handleApiError(
      error,
      "Failed to generate UPI QR."
    );
  }
};


// ==========================================================
// PURCHASE INVENTORY
// ==========================================================

export const purchaseInventory = async (
  payload,
  upiScreenshot
) => {
  try {
    const formData = new FormData();

    // Purchase JSON
    formData.append(
      "purchase",
      JSON.stringify(payload)
    );

    // UPI screenshot
    if (upiScreenshot) {
      formData.append(
        "upiScreenshot",
        upiScreenshot
      );
    }

    const response = await api.post(
      "/player-inventory-purchase",
      formData
    );

    return response.data;

  } catch (error) {
    handleApiError(
      error,
      "Failed to purchase inventory."
    );
  }
};