import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  MapPin,
} from "lucide-react";

import LandingPageSportService
  from "../../services/LandingPageSportService";
import LandingPageSportsForm from "./LandingPageSportsForm";

const LandingPageSports = () => {

  const [sports, setSports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingSport, setEditingSport] = useState(null);


  // =========================================================
  // FETCH LANDING PAGE SPORTS
  // =========================================================

  const fetchSports = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await LandingPageSportService.getAll();

      if (response?.success) {

        setSports(
          response.data || []
        );

      } else {

        setSports([]);
      }

    } catch (err) {

      console.error(
        "Error fetching landing page sports:",
        err
      );

      setError(
        "Unable to load landing page sports."
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    fetchSports();

  }, []);


  // =========================================================
  // ADD
  // =========================================================

  const handleAdd = () => {

    setEditingSport(null);
    setShowForm(true);
  };


  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (sport) => {

    setEditingSport(sport);
    setShowForm(true);
  };


  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to remove this sport from the landing page?"
      );

    if (!confirmed) {
      return;
    }


    try {

      await LandingPageSportService.delete(id);

      await fetchSports();

    } catch (err) {

      console.error(
        "Error deleting landing page sport:",
        err
      );

      alert(
        err?.response?.data?.message ||
        "Failed to remove sport from landing page."
      );
    }
  };


  // =========================================================
  // FORM SUCCESS
  // =========================================================

  const handleFormSuccess = async () => {

    setShowForm(false);
    setEditingSport(null);

    await fetchSports();
  };


  // =========================================================
  // FORM CANCEL
  // =========================================================

  const handleCancel = () => {

    setShowForm(false);
    setEditingSport(null);
  };


  // =========================================================
  // FORM SCREEN
  // =========================================================

  if (showForm) {

    return (

      <LandingPageSportsForm
        editingSport={editingSport}
        onSuccess={handleFormSuccess}
        onCancel={handleCancel}
      />

    );
  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-[400px]">

        <div className="flex items-center gap-3 text-gray-600">

          <RefreshCw
            size={20}
            className="animate-spin"
          />

          Loading landing page sports...

        </div>

      </div>

    );
  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (

    <div className="p-6">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Landing Page Sports
          </h1>

          <p className="text-gray-500 mt-1">
            Manage the sports displayed on the public website.
          </p>

        </div>


        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
        >

          <Plus size={18} />

          Add Sport

        </button>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700">

          {error}

        </div>

      )}


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {sports.length === 0 ? (

        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">

          <div className="mb-4">

            <Plus
              size={42}
              className="mx-auto text-gray-300"
            />

          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            No sports configured
          </h3>

          <p className="text-gray-500 mt-1 mb-5">
            Add sports that you want to display on the public landing page.
          </p>

          <button
            onClick={handleAdd}
            className="px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Add Sport
          </button>

        </div>

      ) : (

        /* =====================================================
           TABLE
           ===================================================== */

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b border-gray-200">

                <tr>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    Image
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    Sport
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                    Tag
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {sports.map((sport) => (

                  <tr
                    key={sport.id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* ORDER */}

                    <td className="px-5 py-4">

                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-semibold">

                        {sport.displayOrder}

                      </span>

                    </td>


                    {/* IMAGE */}

                    <td className="px-5 py-4">

                      <img
                        src={sport.imageUrl}
                        alt={sport.name}
                        className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                        onError={(event) => {

                          event.currentTarget.src =
                            "https://via.placeholder.com/160x100?text=No+Image";

                        }}
                      />

                    </td>


                    {/* SPORT */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">

                          <i
                            className={`fas ${
                              sport.icon ||
                              "fa-running"
                            } text-blue-700`}
                          />

                        </div>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {sport.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            Sport ID: {sport.sportId}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* LOCATION */}

                    <td className="px-5 py-4">

                      <div className="flex items-start gap-2 text-sm text-gray-600">

                        <MapPin
                          size={16}
                          className="text-orange-500 mt-0.5 flex-shrink-0"
                        />

                        <span>
                          {sport.location || "-"}
                        </span>

                      </div>

                    </td>


                    {/* TAG */}

                    <td className="px-5 py-4">

                      <span className="inline-flex px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">

                        {sport.tag || "-"}

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        <button
                          onClick={() =>
                            handleEdit(sport)
                          }
                          className="p-2 rounded-lg text-blue-700 hover:bg-blue-50 transition"
                          title="Edit"
                        >

                          <Edit size={17} />

                        </button>


                        <button
                          onClick={() =>
                            handleDelete(sport.id)
                          }
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Remove"
                        >

                          <Trash2 size={17} />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default LandingPageSports;