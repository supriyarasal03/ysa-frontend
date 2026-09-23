import { useEffect, useState } from "react";

import LandingPageSportService
  from "../../services/LandingPageSportService";

import axiosClient
  from "../../api/axiosClient";


const Gallery = () => {

  const [galleryImages, setGalleryImages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =========================================================
  // IMAGE URL
  // =========================================================



const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  // Backend already returned complete URL
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  const imagePath = imageUrl.startsWith("/")
    ? imageUrl
    : `/${imageUrl}`;

  const baseURL =
    axiosClient.defaults?.baseURL || "";

  // ---------------------------------------------------------
  // LOCAL DEVELOPMENT
  // React:    http://localhost:5173
  // Backend:  http://localhost:8080
  // ---------------------------------------------------------

  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return `http://localhost:8080${imagePath}`;
  }

  // ---------------------------------------------------------
  // PRODUCTION
  // Nginx + backend on same domain
  // ---------------------------------------------------------

  if (
    baseURL.startsWith("http://") ||
    baseURL.startsWith("https://")
  ) {
    const backendURL = baseURL.replace(
      /\/api\/?$/,
      ""
    );

    return `${backendURL}${imagePath}`;
  }

  return imagePath;
};










  // =========================================================
  // FETCH GALLERY IMAGES
  // =========================================================

  useEffect(() => {

    const fetchGalleryImages = async () => {

      try {

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

      } catch (error) {

        console.error(
          "Failed to fetch gallery images:",
          error
        );

        setGalleryImages([]);

      } finally {

        setLoading(false);

      }

    };


    fetchGalleryImages();

  }, []);


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <section
      id="gallery"
      className="py-20 md:py-28 bg-gradient-to-b from-white to-blue-50"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="text-center mb-14">

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">

            Yashashree{" "}

            <span className="text-blue-800">
              Gallery
            </span>

            {" "}— Experience the Emotion!!

          </h2>


          <p className="text-gray-600 max-w-2xl mx-auto text-lg">

            Explore the best moments from our training
            sessions and tournaments

          </p>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="text-center py-10">

            <p className="text-gray-500">

              Loading gallery...

            </p>

          </div>

        )}


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!loading &&
          galleryImages.length === 0 && (

            <div className="text-center py-10">

              <p className="text-gray-500">

                No gallery images available.

              </p>

            </div>

          )}


        {/* =================================================
            GALLERY GRID
        ================================================= */}

        {!loading &&
          galleryImages.length > 0 && (

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

              {galleryImages.map(
                (gallery, index) => {

                  const imageUrl =
                    getImageUrl(
                      gallery.imageUrl
                    );


                  return (

                    <div
                      key={
                        gallery.id ||
                        index
                      }
                      className="rounded-2xl overflow-hidden shadow-md group"
                    >

                      <img
                        src={imageUrl}
                        alt={`Yashashree Gallery ${index + 1}`}
                        className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => {

                          console.error(
                            "Gallery image failed to load:",
                            imageUrl
                          );

                        }}
                      />

                    </div>

                  );

                }
              )}

            </div>

          )}

      </div>

    </section>

  );

};


export default Gallery;