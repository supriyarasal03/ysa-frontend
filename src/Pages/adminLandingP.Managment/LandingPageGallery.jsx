import { useEffect, useState } from "react";

import LandingPageSportService
  from "../../services/LandingPageSportService";

import LandingPageGalleryForm
  from "./LandingPageGalleryForm";

import axiosClient
  from "../../api/axiosClient";


const LandingPageGallery = () => {

  const [galleryImages, setGalleryImages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingGallery, setEditingGallery] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);


  // =========================================================
  // GET IMAGE URL
  // =========================================================

  const getImageUrl = (imageUrl) => {

    if (!imageUrl) {
      return "";
    }


    // =======================================================
    // BACKEND ALREADY RETURNED FULL URL
    // =======================================================

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {

      return imageUrl;

    }


    // =======================================================
    // MAKE SURE IMAGE PATH STARTS WITH /
    // =======================================================

    const imagePath =
      imageUrl.startsWith("/")
        ? imageUrl
        : `/${imageUrl}`;


    // =======================================================
    // LOCAL DEVELOPMENT
    //
    // React/Vite  -> http://localhost:5173
    // Spring Boot -> http://localhost:8080
    //
    // Images are served by Spring Boot.
    // =======================================================

    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {

      return `http://localhost:8080${imagePath}`;

    }


    // =======================================================
    // GET AXIOS BASE URL
    // =======================================================

    const baseURL =
      axiosClient.defaults?.baseURL || "";


    // =======================================================
    // PRODUCTION / ABSOLUTE API URL
    // =======================================================

    if (
      baseURL.startsWith("http://") ||
      baseURL.startsWith("https://")
    ) {

      const backendURL =
        baseURL.replace(
          /\/api\/?$/,
          ""
        );


      return `${backendURL}${imagePath}`;

    }


    // =======================================================
    // SAME DOMAIN / NGINX
    // =======================================================

    return imagePath;

  };


  // =========================================================
  // LOAD GALLERY
  // =========================================================

  const loadGallery = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await LandingPageSportService
          .getGallery();


      if (response?.success) {

        setGalleryImages(
          response.data || []
        );

      } else {

        setGalleryImages([]);

      }

    } catch (err) {

      console.error(
        "Error loading gallery:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Unable to load gallery images."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadGallery();

  }, []);


  // =========================================================
  // ADD IMAGE
  // =========================================================

  const handleAdd = () => {

    setEditingGallery(null);

    setShowForm(true);

  };


  // =========================================================
  // EDIT IMAGE
  // =========================================================

  const handleEdit = (gallery) => {

    setEditingGallery(gallery);

    setShowForm(true);

  };


  // =========================================================
  // FORM SUCCESS
  // =========================================================

  const handleFormSuccess = async () => {

    setShowForm(false);

    setEditingGallery(null);

    await loadGallery();

  };


  // =========================================================
  // CANCEL FORM
  // =========================================================

  const handleCancel = () => {

    setShowForm(false);

    setEditingGallery(null);

  };


  // =========================================================
  // DELETE IMAGE
  // =========================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this gallery image?"
      );


    if (!confirmed) {

      return;

    }


    try {

      setDeletingId(id);

      setError("");


      await LandingPageSportService
        .deleteGallery(id);


      await loadGallery();

    } catch (err) {

      console.error(
        "Error deleting gallery image:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Unable to delete gallery image."
      );

    } finally {

      setDeletingId(null);

    }

  };


  // =========================================================
  // FORM VIEW
  // =========================================================

  if (showForm) {

    return (

      <LandingPageGalleryForm
        editingGallery={editingGallery}
        onSuccess={handleFormSuccess}
        onCancel={handleCancel}
      />

    );

  }


  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <div className="p-6">

      <div className="max-w-7xl mx-auto">


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-2xl font-bold text-slate-900">

              Landing Page Gallery

            </h1>


            <p className="text-gray-500 mt-1">

              Manage the images displayed in the
              public landing page gallery.

            </p>

          </div>


          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >

            <i className="fas fa-plus mr-2" />

            Add Gallery Image

          </button>

        </div>


        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (

          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">

            {error}

          </div>

        )}


        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (

          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

            <i className="fas fa-spinner fa-spin text-blue-700 text-xl" />

            <p className="text-gray-500 mt-3">

              Loading gallery images...

            </p>

          </div>

        )}


        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!loading &&
          galleryImages.length === 0 && (

            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">

              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">

                <i className="fas fa-images text-blue-700 text-2xl" />

              </div>


              <h3 className="text-lg font-semibold text-slate-800 mt-4">

                No Gallery Images

              </h3>


              <p className="text-gray-500 mt-1">

                Add your first image to the landing
                page gallery.

              </p>


              <button
                type="button"
                onClick={handleAdd}
                className="mt-5 px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
              >

                <i className="fas fa-plus mr-2" />

                Add Image

              </button>

            </div>

          )}


        {/* =====================================================
            GALLERY GRID
        ===================================================== */}

        {!loading &&
          galleryImages.length > 0 && (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {galleryImages.map(
                (gallery) => {

                  const imageUrl =
                    getImageUrl(
                      gallery.imageUrl
                    );


                  return (

                    <div
                      key={gallery.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                    >

                      {/* =================================================
                          IMAGE
                      ================================================= */}

                      <div className="relative">

                        <img
                          src={imageUrl}
                          alt={`Gallery ${gallery.displayOrder}`}
                          className="w-full h-52 object-cover"
                          onLoad={() => {
                            console.log(
                              "Gallery image loaded:",
                              imageUrl
                            );
                          }}
                          onError={() => {

                            console.error(
                              "Gallery image FAILED:",
                              imageUrl
                            );

                          }}
                        />


                        {/* DISPLAY ORDER */}

                        <div className="absolute top-3 left-3">

                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 text-slate-700 text-xs font-semibold shadow">

                            Order{" "}

                            {gallery.displayOrder}

                          </span>

                        </div>

                      </div>


                      {/* =================================================
                          CONTENT
                      ================================================= */}

                      <div className="p-4">

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="text-sm font-semibold text-slate-800">

                              Gallery Image

                            </p>


                            <p className="text-xs text-gray-400 mt-1">

                              Display Order:{" "}

                              {gallery.displayOrder}

                            </p>

                          </div>

                        </div>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="flex gap-2 mt-4">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                gallery
                              )
                            }
                            className="flex-1 px-3 py-2 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                          >

                            <i className="fas fa-edit mr-1.5" />

                            Edit

                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                gallery.id
                              )
                            }
                            disabled={
                              deletingId ===
                              gallery.id
                            }
                            className="flex-1 px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
                          >

                            {deletingId ===
                            gallery.id ? (

                              <>

                                <i className="fas fa-spinner fa-spin mr-1.5" />

                                Deleting...

                              </>

                            ) : (

                              <>

                                <i className="fas fa-trash mr-1.5" />

                                Delete

                              </>

                            )}

                          </button>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

      </div>

    </div>

  );

};


export default LandingPageGallery;