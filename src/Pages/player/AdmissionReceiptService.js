import axiosClient from "../../api/axiosClient";

const AdmissionReceiptService = {

  // =========================================================
  // GET ADMISSION RECEIPT DETAILS
  // =========================================================

  getReceipt: async (playerId) => {
    const res = await axiosClient.get(
      `/admission-receipts/player/${playerId}`
    );

    return res.data;
  },


  // =========================================================
  // GET ADMISSION RECEIPT PDF
  // =========================================================

  getReceiptPdf: async (playerId) => {
    const res = await axiosClient.get(
      `/admission-receipts/player/${playerId}/pdf`,
      {
        responseType: "blob",
      }
    );

    return res;
  },


  // =========================================================
  // SEND WELCOME EMAIL + RECEIPT
  // =========================================================

  sendWelcomeEmail: async (playerId) => {
    const res = await axiosClient.post(
      `/admission-receipts/player/${playerId}/send-email`
    );

    return res.data;
  },

};

export default AdmissionReceiptService;