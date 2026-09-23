import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import PlayerEnquiryService from "../../services/PlayerEnquiryService";

const PlayerEnquiry = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // SPORT PASSED FROM ENROLL NOW
  // =========================================================

  const selectedSportId = location.state?.sportId || "";
  const selectedSportName = location.state?.sportName || "";


  // =========================================================
  // STATE
  // =========================================================

  const [batches, setBatches] = useState([]);

  const [loadingBatches, setLoadingBatches] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");


  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    playerName: "",
    age: "",
    playerMobileNumber: "",
    email: "",
    address: "",
    parentName: "",
    parentMobile: "",
    sportId: selectedSportId,
    batchId: "",
  });


  // =========================================================
  // LOAD ACTIVE + ONGOING BATCHES
  // =========================================================
useEffect(() => {

  const fetchBatches = async () => {

    if (!selectedSportId) {
      setBatches([]);
      return;
    }

    try {

      setLoadingBatches(true);
      setError("");

      const response =
        await PlayerEnquiryService.getBatchesBySport(
          selectedSportId
        );

      if (response?.success) {

        setBatches(response.data || []);

      } else {

        setBatches([]);

      }

    } catch (err) {

      console.error(
        "Error loading batches:",
        err
      );

      setBatches([]);

      setError(
        "Unable to load batches for this sport."
      );

    } finally {

      setLoadingBatches(false);

    }

  };

  fetchBatches();

}, [selectedSportId]);





















  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccessMessage("");

  };


  // =========================================================
  // SUBMIT FORM
  // =========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccessMessage("");


    // ---------------------------------------------------------
    // SPORT VALIDATION
    // ---------------------------------------------------------

    if (!formData.sportId) {

      setError(
        "Selected sport is missing. Please go back and select a sport."
      );

      return;
    }


    // ---------------------------------------------------------
    // BATCH VALIDATION
    // ---------------------------------------------------------

    if (!formData.batchId) {

      setError(
        "Please select a preferred batch."
      );

      return;
    }


    try {

      setSubmitting(true);


      const payload = {

        playerName:
          formData.playerName.trim(),

        age:
          Number(formData.age),

        playerMobileNumber:
          formData.playerMobileNumber.trim(),

        email:
          formData.email.trim(),

        address:
          formData.address.trim(),

        parentName:
          formData.parentName.trim(),

        parentMobile:
          formData.parentMobile.trim(),

        sportId:
          Number(formData.sportId),

        batchId:
          Number(formData.batchId),
      };


      const response =
        await PlayerEnquiryService.create(
          payload
        );


      if (response?.success) {

        setSuccessMessage(
          "Your enquiry has been submitted successfully. Our academy team will contact you soon."
        );


        // Reset form
        setFormData({
          playerName: "",
          age: "",
          playerMobileNumber: "",
          email: "",
          address: "",
          parentName: "",
          parentMobile: "",
          sportId: selectedSportId,
          batchId: "",
        });

      } else {

        setError(
          response?.message ||
          "Unable to submit enquiry. Please try again."
        );

      }

    } catch (err) {

      console.error(
        "Error submitting enquiry:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Unable to submit enquiry. Please try again."
      );

    } finally {

      setSubmitting(false);

    }

  };


  // =========================================================
  // FORMAT TIME
  // Example: 07:00:00 → 07:00 AM
  // =========================================================

  const formatTime = (time) => {

    if (!time) {
      return "";
    }


    const [hours, minutes] =
      time.split(":");


    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );


    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <>

      <Navbar />


      <div className="pt-28 pb-20 bg-gray-50 min-h-screen">

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="text-center mb-8">

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">

              Sports{" "}

              <span className="text-blue-800">
                Enquiry
              </span>

            </h1>


            <p className="text-gray-600 max-w-2xl mx-auto">

              Fill in your details and our academy team
              will contact you regarding your preferred
              batch.

            </p>

          </div>


          {/* =================================================
              FORM CARD
          ================================================= */}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 md:p-6">


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {successMessage && (

              <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700">

                <div className="flex items-start gap-3">

                  <i className="fas fa-check-circle mt-1" />

                  <div>

                    <p className="font-semibold">
                      Enquiry Submitted
                    </p>

                    <p className="text-sm mt-1">
                      {successMessage}
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (

              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-600">

                <div className="flex items-start gap-3">

                  <i className="fas fa-exclamation-circle mt-1" />

                  <p className="text-sm">
                    {error}
                  </p>

                </div>

              </div>

            )}


            <form onSubmit={handleSubmit}>


              {/* =================================================
                  PLAYER DETAILS
              ================================================= */}

              <div className="mb-6">

                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Player Details
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                  {/* Player Name */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Player Name *
                    </label>

                    <input
                      type="text"
                      name="playerName"
                      value={formData.playerName}
                      onChange={handleChange}
                      placeholder="Enter player name"
                      required
                      maxLength={100}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />

                  </div>


                  {/* Age */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age *
                    </label>

                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter age"
                      min="1"
                      max="100"
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />

                  </div>


                  {/* Player Mobile */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Player Mobile Number *
                    </label>

                    <input
                      type="tel"
                      name="playerMobileNumber"
                      value={formData.playerMobileNumber}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />

                  </div>


                  {/* Email */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      maxLength={150}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />

                  </div>


                  {/* Address */}

                  <div className="md:col-span-2">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address *
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      required
                      maxLength={500}
                      rows={2}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 resize-none"
                    />

                  </div>

                </div>

              </div>


              {/* =================================================
                  PARENT DETAILS
              ================================================= */}

              <div className="mb-6">

                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Parent Details
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                  {/* Parent Name */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Parent Name
                    </label>

                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Enter parent name"
                      maxLength={100}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />

                  </div>


                  {/* Parent Mobile */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Parent Mobile Number
                    </label>

                    <input
                      type="tel"
                      name="parentMobile"
                      value={formData.parentMobile}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />

                  </div>

                </div>

              </div>


              {/* =================================================
                  SPORT & BATCH
              ================================================= */}

              <div className="mb-6">

                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Sport & Batch
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                  {/* =================================================
                      SELECTED SPORT
                  ================================================= */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Selected Sport
                    </label>


                    <div className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 flex items-center gap-3">

                      <i className="fas fa-running text-blue-700" />

                      <span className="font-semibold">
                        {selectedSportName || "Sport"}
                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      PREFERRED BATCH
                  ================================================= */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Batch *
                    </label>


                    <select
                      name="batchId"
                      value={formData.batchId}
                      onChange={handleChange}
                      required
                      disabled={
                        !formData.sportId ||
                        loadingBatches
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    >

                      <option value="">

                        {loadingBatches
                          ? "Loading batches..."
                          : batches.length === 0
                          ? "No ongoing batches available"
                          : "Select preferred batch"}

                      </option>


                      {batches.map((batch) => (

                        <option
                          key={batch.id}
                          value={batch.id}
                        >

                          {batch.batchName} —{" "}

                          {formatTime(
                            batch.startTime
                          )}

                          {" - "}

                          {formatTime(
                            batch.endTime
                          )}

                        </option>

                      ))}

                    </select>

                  </div>

                </div>


                {/* =================================================
                    BATCH INFORMATION
                ================================================= */}

                {formData.batchId && (

                  <div className="mt-5">

                    {(() => {

                      const selectedBatch =
                        batches.find(
                          (batch) =>
                            String(batch.id) ===
                            String(formData.batchId)
                        );


                      if (!selectedBatch) {
                        return null;
                      }


                      return (

                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">

                          <p className="font-semibold text-blue-900 mb-3">
                            Selected Batch
                          </p>


                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">


                            {/* Batch */}

                            <div className="flex items-center gap-2">

                              <i className="fas fa-layer-group text-blue-700" />

                              <span>
                                {selectedBatch.batchName}
                              </span>

                            </div>


                            {/* Time */}

                            <div className="flex items-center gap-2">

                              <i className="fas fa-clock text-blue-700" />

                              <span>

                                {formatTime(
                                  selectedBatch.startTime
                                )}

                                {" - "}

                                {formatTime(
                                  selectedBatch.endTime
                                )}

                              </span>

                            </div>


                            {/* Training Days */}

                            <div className="flex items-center gap-2">

                              <i className="fas fa-calendar-alt text-blue-700" />

                              <span>
                                {selectedBatch.trainingDays}
                              </span>

                            </div>

                          </div>

                        </div>

                      );

                    })()}

                  </div>

                )}

              </div>


              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">


                {/* BACK */}

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="sm:flex-1 py-2.5 px-5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >

                  <i className="fas fa-arrow-left mr-2" />

                  Back

                </button>


                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    batches.length === 0
                  }
                  className="sm:flex-1 py-2.5 px-5 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  {submitting ? (

                    <>
                      <i className="fas fa-spinner fa-spin mr-2" />
                      Submitting...
                    </>

                  ) : (

                    <>
                      <i className="fas fa-paper-plane mr-2" />
                      Submit Enquiry
                    </>

                  )}

                </button>

              </div>


            </form>

          </div>

        </div>

      </div>


      <Footer />

    </>

  );

};


export default PlayerEnquiry;