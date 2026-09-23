import axiosClient from "../../api/axiosClient";

// =========================================================
// RECEPTIONIST CONTACT / ENQUIRY SERVICE
// =========================================================

const ReceptionistContactService = {

  // =========================================================
  // GET ALL CONTACT ENQUIRIES
  // GET /api/contact
  // =========================================================

  getAllContacts: async () => {
    const response = await axiosClient.get("/contact");

    return response.data;
  },


  // =========================================================
  // GET CONTACT ENQUIRY BY ID
  // GET /api/contact/{id}
  // =========================================================

  getContactById: async (id) => {
    const response =
      await axiosClient.get(`/contact/${id}`);

    return response.data;
  },

};


// =========================================================
// EXPORT
// =========================================================

export default ReceptionistContactService;