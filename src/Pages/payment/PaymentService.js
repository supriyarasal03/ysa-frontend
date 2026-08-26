import axiosClient from "../../api/axiosClient";

const PaymentService = {

  // =========================================================
  // GET ALL PAYMENTS
  // =========================================================

  getAll: async () => {
    try {
      const res = await axiosClient.get("/payment");
      return res.data;
    } catch (error) {
      throw normalizeError(error, "Failed to fetch payments");
    }
  },


  // =========================================================
  // GET PAYMENT BY ID
  // =========================================================

  getById: async (id) => {
    try {
      const res = await axiosClient.get(`/payment/${id}`);
      return res.data;
    } catch (error) {
      throw normalizeError(error, "Failed to fetch payment");
    }
  },


  // =========================================================
  // GET PAYMENTS BY PLAYER
  // =========================================================

  getByPlayer: async (playerId) => {
    try {
      const res = await axiosClient.get(
        `/payment/player/${playerId}`
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to fetch player payments"
      );
    }
  },


  // =========================================================
  // GET PAYMENTS BY ENROLLMENT
  // =========================================================

  getByEnrollment: async (enrollmentId) => {
    try {
      const res = await axiosClient.get(
        `/payment/enrollment/${enrollmentId}`
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to fetch enrollment payments"
      );
    }
  },


  // =========================================================
  // GET PAYMENTS BY INSTALLMENT
  // =========================================================

  getByInstallment: async (installmentId) => {
    try {
      const res = await axiosClient.get(
        `/payment/installment/${installmentId}`
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to fetch installment payments"
      );
    }
  },


  // =========================================================
  // CREATE PAYMENT
  // =========================================================

  create: async (formData) => {
    try {
      const res = await axiosClient.post(
        "/payment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to create payment"
      );
    }
  },


  // =========================================================
  // MARK PAYMENT AS RECEIVED
  // =========================================================

  markAsReceived: async (id) => {
    try {
      const res = await axiosClient.patch(
        `/payment/${id}/received`
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to mark payment as received"
      );
    }
  },


  // =========================================================
  // GET PLAYER ENROLLMENTS
  // =========================================================

  getEnrollments: async () => {
    try {
      const res = await axiosClient.get(
        "/player-enrollment"
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to fetch player enrollments"
      );
    }
  },


  // =========================================================
  // GET ENROLLMENT BY ID
  // =========================================================

  getEnrollmentById: async (id) => {
    try {
      const res = await axiosClient.get(
        `/player-enrollment/${id}`
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to fetch enrollment"
      );
    }
  },


  // =========================================================
  // GET ENROLLMENTS BY PLAYER
  // =========================================================

  getEnrollmentsByPlayer: async (playerId) => {
    try {
      const res = await axiosClient.get(
        `/player-enrollment/player/${playerId}`
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to fetch player enrollments"
      );
    }
  },



  // =========================================================
// GENERATE INSTALLMENTS
// =========================================================

generateInstallments: async (enrollmentId) => {
  try {
    const res = await axiosClient.post(
      `/installment/enrollment/${enrollmentId}/generate`
    );

    return res.data;
  } catch (error) {
    throw normalizeError(
      error,
      "Failed to generate installments"
    );
  }
},


  // =========================================================
  // GET INSTALLMENTS BY ENROLLMENT
  // =========================================================

  getInstallments: async (enrollmentId) => {
    try {
      const res = await axiosClient.get(
        `/installment/enrollment/${enrollmentId}`
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to fetch installments"
      );
    }
  },


  // =========================================================
  // GET PENDING INSTALLMENTS
  // =========================================================

  getPendingInstallments: async (enrollmentId) => {
    try {
      const res = await axiosClient.get(
        `/installment/enrollment/${enrollmentId}/pending`
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to fetch pending installments"
      );
    }
  },


  // =========================================================
  // GET ALL INSTALLMENTS
  // =========================================================

  getAllInstallments: async () => {
    try {
      const res = await axiosClient.get(
        "/installment"
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to fetch installments"
      );
    }
  },


  // =========================================================
  // GET INSTALLMENT BY ID
  // =========================================================

  getInstallmentById: async (id) => {
    try {
      const res = await axiosClient.get(
        `/installment/${id}`
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to fetch installment"
      );
    }
  },


  // =========================================================
  // GENERATE UPI QR
  // =========================================================

  generateQr: async (amount) => {
    try {
      const res = await axiosClient.get(
        "/payment/upi-qr",
        {
          params: {
            amount: amount,
          },
        }
      );

      return res.data;
    } catch (error) {
      throw normalizeError(
        error,
        "Failed to generate UPI QR"
      );
    }
  },

};


// =========================================================
// COMMON BACKEND ERROR HANDLER
// =========================================================

const normalizeError = (error, defaultMessage) => {

  const backend = error?.response?.data;

  const normalizedError = new Error(
    backend?.message ||
    error?.message ||
    defaultMessage
  );

  normalizedError.status =
    error?.response?.status;

  normalizedError.response =
    error?.response;

  normalizedError.data =
    backend?.data ?? null;

  normalizedError.validationErrors =
    extractValidationErrors(backend);

  return normalizedError;
};


// =========================================================
// EXTRACT BACKEND VALIDATION ERRORS
// =========================================================

const extractValidationErrors = (backend) => {

  if (!backend) {
    return {};
  }



  ///

  ///Hellow
  // Example:
  // data: {
  //   fieldName: "error message"
  // }

  if (
    backend.data &&
    typeof backend.data === "object" &&
    !Array.isArray(backend.data)
  ) {
    return backend.data;
  }

  if (
    backend.errors &&
    typeof backend.errors === "object"
  ) {
    return backend.errors;
  }

  return {};
};


export default PaymentService;