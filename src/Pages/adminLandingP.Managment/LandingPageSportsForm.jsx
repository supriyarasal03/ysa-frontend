import { useEffect, useRef, useState } from "react";

import LandingPageSportService
  from "../../services/LandingPageSportService";


const LandingPageSportsForm = ({
  editingSport,
  onSuccess = async () => {},
  onCancel = () => {},
}) => {

  const isEdit =
    Boolean(editingSport);

  const fileInputRef =
    useRef(null);


  // =========================================================
  // STATE
  // =========================================================

  const [availableSports, setAvailableSports] =
    useState([]);

  const [landingPageSports, setLandingPageSports] =
    useState([]);

  const [loadingSports, setLoadingSports] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [error, setError] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState("");


  const [formData, setFormData] =
    useState({
      sportId: "",
      imageUrl: "",
      location:
        "Yashashree Sports Complex, Pune",
      tag: "",
      icon: "",
      displayOrder: "",
    });


  // =========================================================
  // LOAD SPORTS
  // =========================================================

  useEffect(() => {

    const loadSports = async () => {

      try {

        setLoadingSports(true);
        setError("");


        // -----------------------------------------------------
        // GET ALL MAIN SPORTS
        // -----------------------------------------------------

        const sportsResponse =
          await LandingPageSportService
            .getAvailableSports();


        setAvailableSports(
          sportsResponse?.data || []
        );


        // -----------------------------------------------------
        // GET SPORTS ALREADY ON LANDING PAGE
        // -----------------------------------------------------

        const landingResponse =
          await LandingPageSportService
            .getAll();


        setLandingPageSports(
          landingResponse?.data || []
        );


      } catch (err) {

        console.error(
          "Error loading sports:",
          err
        );


        setError(
          err?.response?.data?.message ||
          "Unable to load sports."
        );


      } finally {

        setLoadingSports(false);
      }
    };


    loadSports();

  }, []);


  // =========================================================
  // SET EDIT DATA
  // =========================================================

  useEffect(() => {

    if (editingSport) {

      setFormData({

        sportId:
          editingSport.sportId || "",

        imageUrl:
          editingSport.imageUrl || "",

        location:
          editingSport.location ||
          "Yashashree Sports Complex, Pune",

        tag:
          editingSport.tag || "",

        icon:
          editingSport.icon || "",

        displayOrder:
          editingSport.displayOrder || "",
      });


      setPreviewUrl(
        editingSport.imageUrl || ""
      );


      setSelectedFile(null);


    } else {

      setFormData({

        sportId: "",
        imageUrl: "",

        location:
          "Yashashree Sports Complex, Pune",

        tag: "",
        icon: "",
        displayOrder: "",
      });


      setPreviewUrl("");

      setSelectedFile(null);
    }

  }, [editingSport]);


  // =========================================================
  // FILTER SPORTS
  //
  // When adding:
  // show only sports NOT already added.
  //
  // When editing:
  // also show the current sport.
  // =========================================================

  const filteredSports =
    availableSports.filter((sport) => {

      const alreadyAdded =
        landingPageSports.some(
          (landingSport) =>
            Number(landingSport.sportId) ===
            Number(sport.id)
        );


      // -----------------------------------------------------
      // ADD MODE
      // -----------------------------------------------------

      if (!isEdit) {

        return !alreadyAdded;
      }


      // -----------------------------------------------------
      // EDIT MODE
      //
      // Keep the current sport visible.
      // -----------------------------------------------------

      return (
        !alreadyAdded ||
        Number(sport.id) ===
          Number(editingSport?.sportId)
      );

    });


  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((previous) => ({

      ...previous,

      [name]: value,

    }));


    // -------------------------------------------------------
    // SPORT SELECT
    // -------------------------------------------------------

    if (name === "sportId") {

      const selectedSport =
        availableSports.find(
          (sport) =>
            String(sport.id) ===
            String(value)
        );


      if (selectedSport) {

        setFormData((previous) => ({

          ...previous,

          sportId: value,

          tag:
            previous.tag ||
            selectedSport.sportsName ||
            selectedSport.name ||
            "",

        }));

      }

    }

  };


  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleImageChange = async (
    event
  ) => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    // -------------------------------------------------------
    // IMAGE TYPE
    // -------------------------------------------------------

    if (!file.type.startsWith("image/")) {

      setError(
        "Please select a valid image file."
      );

      event.target.value = "";

      return;
    }


    // -------------------------------------------------------
    // IMAGE SIZE
    // -------------------------------------------------------

    const maxSize =
      10 * 1024 * 1024;


    if (file.size > maxSize) {

      setError(
        "Image size must be less than 10 MB."
      );

      event.target.value = "";

      return;
    }


    setError("");

    setSelectedFile(file);


    // -------------------------------------------------------
    // LOCAL PREVIEW
    // -------------------------------------------------------

    const localPreview =
      URL.createObjectURL(file);


    setPreviewUrl(
      localPreview
    );


    // -------------------------------------------------------
    // UPLOAD
    // -------------------------------------------------------

    try {

      setUploadingImage(true);


      const response =
        await LandingPageSportService
          .uploadImage(file);


      if (!response?.success) {

        throw new Error(
          response?.message ||
          "Image upload failed."
        );
      }


      setFormData((previous) => ({

        ...previous,

        imageUrl:
          response.imageUrl ||
          response.data?.imageUrl ||
          "",

      }));


    } catch (err) {

      console.error(
        "Sport image upload error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to upload sport image."
      );


      setSelectedFile(null);


      setPreviewUrl(
        editingSport?.imageUrl || ""
      );


    } finally {

      setUploadingImage(false);
    }

  };


  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const handleRemoveImage = () => {

    setSelectedFile(null);


    setFormData((previous) => ({

      ...previous,

      imageUrl:
        editingSport?.imageUrl || "",

    }));


    setPreviewUrl(
      editingSport?.imageUrl || ""
    );


    if (fileInputRef.current) {

      fileInputRef.current.value = "";

    }

  };


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    // -------------------------------------------------------
    // SPORT VALIDATION
    // -------------------------------------------------------

    if (!formData.sportId) {

      setError(
        "Please select a sport."
      );

      return;
    }


    // -------------------------------------------------------
    // IMAGE VALIDATION
    // -------------------------------------------------------

    if (!formData.imageUrl) {

      setError(
        "Please select a sport image."
      );

      return;
    }


    // -------------------------------------------------------
    // DISPLAY ORDER
    // -------------------------------------------------------

    if (!formData.displayOrder) {

      setError(
        "Please enter display order."
      );

      return;
    }


    // -------------------------------------------------------
    // IMAGE UPLOAD CHECK
    // -------------------------------------------------------

    if (uploadingImage) {

      setError(
        "Please wait until the image upload is complete."
      );

      return;
    }


    // -------------------------------------------------------
    // DUPLICATE CHECK
    // -------------------------------------------------------

    if (!isEdit) {

      const alreadyExists =
        landingPageSports.some(
          (sport) =>
            Number(sport.sportId) ===
            Number(formData.sportId)
        );


      if (alreadyExists) {

        setError(
          "This sport is already added to the landing page."
        );

        return;
      }

    }


    // -------------------------------------------------------
    // PAYLOAD
    // -------------------------------------------------------

    const payload = {

      sportId:
        Number(formData.sportId),

      imageUrl:
        formData.imageUrl,

      location:
        formData.location.trim(),

      tag:
        formData.tag.trim(),

      icon:
        formData.icon.trim(),

      displayOrder:
        Number(formData.displayOrder),

    };


    try {

      setSaving(true);


      // -----------------------------------------------------
      // UPDATE
      // -----------------------------------------------------

      if (isEdit) {

        await LandingPageSportService.update(

          editingSport.id,

          payload

        );

      }

      // -----------------------------------------------------
      // CREATE
      // -----------------------------------------------------

      else {

        await LandingPageSportService.create(
          payload
        );

      }


      // -----------------------------------------------------
      // SUCCESS CALLBACK
      // -----------------------------------------------------

      if (
        typeof onSuccess ===
        "function"
      ) {

        await onSuccess();

      }


    } catch (err) {

      console.error(
        "Error saving landing page sport:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to save landing page sport."
      );


    } finally {

      setSaving(false);
    }

  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="p-6">

      <div className="max-w-3xl mx-auto">


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-blue-700 hover:underline mb-3"
          >

            ← Back to Landing Page Sports

          </button>


          <h1 className="text-2xl font-bold text-slate-900">

            {isEdit
              ? "Edit Landing Page Sport"
              : "Add Landing Page Sport"}

          </h1>


          <p className="text-gray-500 mt-1">

            Select a sport and configure
            how it appears on the public
            landing page.

          </p>

        </div>


        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >


          {/* ===================================================
              ERROR
          =================================================== */}

          {error && (

            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">

              {error}

            </div>

          )}


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            {/* =================================================
                SPORT
            ================================================= */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Sport

                <span className="text-red-500 ml-1">
                  *
                </span>

              </label>


              <select
                name="sportId"
                value={formData.sportId}
                onChange={handleChange}
                disabled={
                  loadingSports ||
                  isEdit
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >

                <option value="">

                  {loadingSports
                    ? "Loading sports..."
                    : filteredSports.length === 0 &&
                      !isEdit
                    ? "All sports already added"
                    : "Select Sport"}

                </option>


                {filteredSports.map(
                  (sport) => (

                    <option
                      key={sport.id}
                      value={sport.id}
                    >

                      {sport.sportsName ||
                        sport.name}

                    </option>

                  )
                )}

              </select>


              {!isEdit &&
                !loadingSports &&
                filteredSports.length === 0 && (

                  <p className="text-xs text-gray-500 mt-2">

                    All available sports have
                    already been added to the
                    landing page.

                  </p>

                )}


              {isEdit && (

                <p className="text-xs text-gray-400 mt-1">

                  Sport selection cannot
                  be changed while editing.

                </p>

              )}

            </div>


            {/* =================================================
                SPORT IMAGE
            ================================================= */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Sport Image

                <span className="text-red-500 ml-1">
                  *
                </span>

              </label>


              <div className="flex items-center gap-3">

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="sport-image-input"
                />


                <label
                  htmlFor="sport-image-input"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-700 text-white rounded-lg cursor-pointer hover:bg-blue-800 transition"
                >

                  <i className="fas fa-upload mr-2" />

                  Choose Image

                </label>


                {selectedFile && (

                  <span className="text-sm text-gray-600 truncate max-w-xs">

                    {selectedFile.name}

                  </span>

                )}

              </div>


              <p className="text-xs text-gray-400 mt-2">

                JPG, JPEG, PNG, WEBP.
                Maximum size: 10 MB.

              </p>


              {/* =================================================
                  UPLOADING
              ================================================= */}

              {uploadingImage && (

                <div className="flex items-center gap-2 mt-3 text-sm text-blue-700">

                  <i className="fas fa-spinner fa-spin" />

                  Uploading image...

                </div>

              )}


              {/* =================================================
                  PREVIEW
              ================================================= */}

              {previewUrl &&
                !uploadingImage && (

                  <div className="mt-4">

                    <div className="flex items-center justify-between mb-2">

                      <p className="text-sm font-medium text-gray-600">

                        Image Preview

                      </p>


                      {selectedFile && (

                        <button
                          type="button"
                          onClick={
                            handleRemoveImage
                          }
                          className="text-sm text-red-600 hover:text-red-700"
                        >

                          Remove

                        </button>

                      )}

                    </div>


                    <img
                      src={previewUrl}
                      alt="Sport preview"
                      className="w-56 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                      onError={() => {
                        setPreviewUrl("");
                      }}
                    />

                  </div>

                )}

            </div>


            {/* =================================================
                LOCATION
            ================================================= */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Location

              </label>


              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Yashashree Sports Complex, Pune"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* =================================================
                TAG
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Tag

              </label>


              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Cricket"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* =================================================
                ICON
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Font Awesome Icon

              </label>


              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="fa-baseball-ball"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />


              <p className="text-xs text-gray-400 mt-1">

                Example:
                fa-baseball-ball,
                fa-futbol,
                fa-running

              </p>

            </div>


            {/* =================================================
                DISPLAY ORDER
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Display Order

                <span className="text-red-500 ml-1">
                  *
                </span>

              </label>


              <input
                type="number"
                name="displayOrder"
                min="1"
                value={formData.displayOrder}
                onChange={handleChange}
                placeholder="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>


          {/* =====================================================
              BUTTONS
          ===================================================== */}

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">

            <button
              type="button"
              onClick={onCancel}
              disabled={
                saving ||
                uploadingImage
              }
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >

              Cancel

            </button>


            <button
              type="submit"
              disabled={
                saving ||
                uploadingImage ||
                (
                  !isEdit &&
                  filteredSports.length === 0
                )
              }
              className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >

              {saving
                ? "Saving..."
                : uploadingImage
                  ? "Uploading..."
                  : isEdit
                    ? "Update Sport"
                    : "Save Sport"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
};


export default LandingPageSportsForm;