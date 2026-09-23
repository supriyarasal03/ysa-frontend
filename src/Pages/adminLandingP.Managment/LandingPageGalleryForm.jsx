import {
  useEffect,
  useRef,
  useState,
} from "react";

import LandingPageSportService
  from "../../services/LandingPageSportService";


const LandingPageGalleryForm = ({
  editingGallery,
  onSuccess,
  onCancel,
}) => {

  const isEdit =
    Boolean(editingGallery);

  const fileInputRef =
    useRef(null);


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
      imageUrl: "",
      displayOrder: "",
    });


  // =========================================================
  // SET EDIT DATA
  // =========================================================

  useEffect(() => {

    if (editingGallery) {

      setFormData({
        imageUrl:
          editingGallery.imageUrl || "",

        displayOrder:
          editingGallery.displayOrder || "",
      });

      setPreviewUrl(
        editingGallery.imageUrl || ""
      );

      setSelectedFile(null);

    } else {

      setFormData({
        imageUrl: "",
        displayOrder: "",
      });

      setPreviewUrl("");
      setSelectedFile(null);

    }

  }, [editingGallery]);


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
    // IMAGE TYPE VALIDATION
    // -------------------------------------------------------

    if (!file.type.startsWith("image/")) {

      setError(
        "Please select a valid image file."
      );

      event.target.value = "";

      return;
    }


    // -------------------------------------------------------
    // IMAGE SIZE VALIDATION
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
    // UPLOAD IMAGE
    // -------------------------------------------------------

    try {

      setUploadingImage(true);


      const response =
        await LandingPageSportService
          .uploadGalleryImage(file);


      if (!response?.success) {

        throw new Error(
          response?.message ||
          "Image upload failed."
        );

      }


      // -----------------------------------------------------
      // SAVE RETURNED IMAGE URL
      // -----------------------------------------------------

      const uploadedImageUrl =
        response.imageUrl ||
        response.data?.imageUrl ||
        "";


      if (!uploadedImageUrl) {

        throw new Error(
          "Image uploaded but image URL was not returned."
        );

      }


      setFormData((previous) => ({
        ...previous,

        imageUrl:
          uploadedImageUrl,
      }));


    } catch (err) {

      console.error(
        "Gallery image upload error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to upload gallery image."
      );


      setSelectedFile(null);

      setPreviewUrl(
        editingGallery?.imageUrl || ""
      );

    } finally {

      setUploadingImage(false);

    }

  };


  // =========================================================
  // REMOVE SELECTED IMAGE
  // =========================================================

  const handleRemoveImage = () => {

    setSelectedFile(null);


    setFormData((previous) => ({
      ...previous,

      imageUrl:
        editingGallery?.imageUrl || "",
    }));


    setPreviewUrl(
      editingGallery?.imageUrl || ""
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
    // VALIDATION
    // -------------------------------------------------------

    if (!formData.imageUrl) {

      setError(
        "Please select a gallery image."
      );

      return;
    }


    if (!formData.displayOrder) {

      setError(
        "Please enter display order."
      );

      return;
    }


    if (
      Number(formData.displayOrder) < 1
    ) {

      setError(
        "Display order must be greater than 0."
      );

      return;
    }


    if (uploadingImage) {

      setError(
        "Please wait until the image upload is complete."
      );

      return;
    }


    // -------------------------------------------------------
    // PAYLOAD
    // -------------------------------------------------------

    const payload = {

      imageUrl:
        formData.imageUrl,

      displayOrder:
        Number(formData.displayOrder),

    };


    // -------------------------------------------------------
    // SAVE
    // -------------------------------------------------------

    try {

      setSaving(true);


      if (isEdit) {

        await LandingPageSportService
          .updateGallery(
            editingGallery.id,
            payload
          );

      } else {

        await LandingPageSportService
          .createGallery(
            payload
          );

      }


      await onSuccess();


    } catch (err) {

      console.error(
        "Error saving gallery image:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to save gallery image."
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


        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-8">

          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-blue-700 hover:underline mb-3"
          >

            ← Back to Landing Page Gallery

          </button>


          <h1 className="text-2xl font-bold text-slate-900">

            {isEdit
              ? "Edit Gallery Image"
              : "Add Gallery Image"}

          </h1>


          <p className="text-gray-500 mt-1">

            Upload and configure an image
            for the public landing page gallery.

          </p>

        </div>


        {/* ===================================================
            FORM
        =================================================== */}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
        >


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">

              {error}

            </div>

          )}


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            {/* =================================================
                IMAGE
            ================================================= */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Gallery Image

                <span className="text-red-500 ml-1">
                  *
                </span>

              </label>


              {/* FILE INPUT */}

              <div className="flex items-center gap-3">

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="gallery-image-input"
                />


                <label
                  htmlFor="gallery-image-input"
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
                  UPLOAD STATUS
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
                          onClick={handleRemoveImage}
                          className="text-sm text-red-600 hover:text-red-700"
                        >

                          Remove

                        </button>

                      )}

                    </div>


                    <img
                      src={previewUrl}
                      alt="Gallery preview"
                      className="w-full max-w-xl h-64 object-cover rounded-lg border border-gray-200 shadow-sm"
                      onError={() => {
                        setPreviewUrl("");
                      }}
                    />

                  </div>

                )}

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


              <p className="text-xs text-gray-400 mt-1">

                Lower numbers appear first.

              </p>

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
                uploadingImage
              }
              className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >

              {saving
                ? "Saving..."
                : uploadingImage
                  ? "Uploading..."
                  : isEdit
                    ? "Update Gallery"
                    : "Save Gallery"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

};


export default LandingPageGalleryForm;