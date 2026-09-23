import axiosClient from "../api/axiosClient";

const LandingPageSportService = {

  // =========================================================
  // ======================= SPORTS ==========================
  // =========================================================


  // =========================================================
  // GET ALL SPORTS FROM MAIN SPORT MODULE
  // =========================================================

  getAvailableSports: async () => {

    const response =
      await axiosClient.get("/sport");

    return response.data;
  },


  // =========================================================
  // GET ALL LANDING PAGE SPORTS
  // =========================================================

  getAll: async () => {

    const response =
      await axiosClient.get(
        "/landing-page/sports"
      );

    return response.data;
  },


  // =========================================================
  // GET LANDING PAGE SPORT BY ID
  // =========================================================

  getById: async (id) => {

    const response =
      await axiosClient.get(
        `/landing-page/sports/${id}`
      );

    return response.data;
  },


  // =========================================================
  // UPLOAD SPORT IMAGE
  // =========================================================

  uploadImage: async (file) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await axiosClient.post(
        "/landing-page/sports/upload-image",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },


  // =========================================================
  // CREATE LANDING PAGE SPORT
  // =========================================================

  create: async (data) => {

    const response =
      await axiosClient.post(
        "/landing-page/sports",
        data
      );

    return response.data;
  },


  // =========================================================
  // UPDATE LANDING PAGE SPORT
  // =========================================================

  update: async (id, data) => {

    const response =
      await axiosClient.put(
        `/landing-page/sports/${id}`,
        data
      );

    return response.data;
  },


  // =========================================================
  // DELETE LANDING PAGE SPORT
  // =========================================================

  delete: async (id) => {

    const response =
      await axiosClient.delete(
        `/landing-page/sports/${id}`
      );

    return response.data;
  },


  // =========================================================
  // ======================= GALLERY =========================
  // =========================================================


  // =========================================================
  // GET ALL GALLERY IMAGES
  // =========================================================

  getGallery: async () => {

    const response =
      await axiosClient.get(
        "/landing-page/gallery"
      );

    return response.data;
  },


  // =========================================================
  // GET GALLERY IMAGE BY ID
  // =========================================================

  getGalleryById: async (id) => {

    const response =
      await axiosClient.get(
        `/landing-page/gallery/${id}`
      );

    return response.data;
  },


  // =========================================================
  // UPLOAD GALLERY IMAGE
  // =========================================================

  uploadGalleryImage: async (file) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await axiosClient.post(
        "/landing-page/gallery/upload-image",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },


  // =========================================================
  // CREATE GALLERY IMAGE
  // =========================================================

  createGallery: async (data) => {

    const response =
      await axiosClient.post(
        "/landing-page/gallery",
        data
      );

    return response.data;
  },


  // =========================================================
  // UPDATE GALLERY IMAGE
  // =========================================================

  updateGallery: async (id, data) => {

    const response =
      await axiosClient.put(
        `/landing-page/gallery/${id}`,
        data
      );

    return response.data;
  },


  // =========================================================
  // DELETE GALLERY IMAGE
  // =========================================================

  deleteGallery: async (id) => {

    const response =
      await axiosClient.delete(
        `/landing-page/gallery/${id}`
      );

    return response.data;
  },

};


export default LandingPageSportService;