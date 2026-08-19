import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit2,
  Power,
  ChevronLeft,
  ChevronRight,
  Users,
  Filter,
  Layers,
} from "lucide-react";

import {
  getAllBatches,
  deactivateBatch,
} from "./batchService";

export default function BatchManagement() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 6;

  const [batchList, setBatchList] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoadingId, setActionLoadingId] =
    useState(null);

  // ==========================================================
  // LOAD BATCHES
  // ==========================================================

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAllBatches();

      const list =
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

      setBatchList(list);
    } catch (err) {
      console.error(
        "Failed to load batches:",
        err
      );

      setError(
        err.message ||
          "Failed to load batches."
      );

      setBatchList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  // ==========================================================
  // HELPERS
  // ==========================================================

  const getStatus = (batch) => {
    const status =
      batch?.status ??
      batch?.Status ??
      "";

    const value = String(
      status
    ).toUpperCase();

    if (value === "ACTIVE") {
      return "Active";
    }

    if (value === "INACTIVE") {
      return "Inactive";
    }

    return value || "Inactive";
  };

  const isActive = (batch) =>
    getStatus(batch) === "Active";

  const getSportName = (batch) =>
    batch?.sportName ||
    batch?.sport?.sportsName ||
    "-";

  const getCoachName = (batch) => {
    if (batch?.coachName) {
      return batch.coachName;
    }

    const firstName =
      batch?.coach?.firstName ||
      "";

    const lastName =
      batch?.coach?.lastName ||
      "";

    return (
      `${firstName} ${lastName}`.trim() ||
      "-"
    );
  };

  const formatTime = (time) => {
    if (!time) return "-";

    const [hour] =
      String(time)
        .split(":")
        .map(Number);

    const period =
      hour >= 12 ? "PM" : "AM";

    let displayHour =
      hour % 12;

    if (displayHour === 0) {
      displayHour = 12;
    }

    return `${displayHour}:00 ${period}`;
  };

  const formatTiming = (batch) => {
    if (
      !batch?.startTime ||
      !batch?.endTime
    ) {
      return "-";
    }

    return `${formatTime(
      batch.startTime
    )} - ${formatTime(
      batch.endTime
    )}`;
  };

  const formatDays = (days) => {
    if (!days) return "-";

    const labels = {
      MONDAY: "Mon",
      TUESDAY: "Tue",
      WEDNESDAY: "Wed",
      THURSDAY: "Thu",
      FRIDAY: "Fri",
      SATURDAY: "Sat",
      SUNDAY: "Sun",
    };

    return String(days)
      .split(",")
      .map((day) => {
        const key =
          day.trim().toUpperCase();

        return labels[key] || day;
      })
      .join(", ");
  };

  // ==========================================================
  // COUNTS
  // ==========================================================

  const totalBatches =
    batchList.length;

  const activeBatches =
    batchList.filter(
      isActive
    ).length;

  const inactiveBatches =
    batchList.filter(
      (batch) => !isActive(batch)
    ).length;

  // ==========================================================
  // FILTER + SEARCH
  // ==========================================================

  const filtered = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    return batchList.filter(
      (batch) => {
        const name =
          String(
            batch?.batchName || ""
          ).toLowerCase();

        const sport =
          String(
            getSportName(batch)
          ).toLowerCase();

        const coach =
          String(
            getCoachName(batch)
          ).toLowerCase();

        const matchesSearch =
          !value ||
          name.includes(value) ||
          sport.includes(value) ||
          coach.includes(value);

        const status =
          getStatus(batch);

        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter ===
            "Active" &&
            status === "Active") ||
          (statusFilter ===
            "Inactive" &&
            status === "Inactive");

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    batchList,
    search,
    statusFilter,
  ]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages =
    Math.ceil(
      filtered.length /
        itemsPerPage
    ) || 1;

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const paginated =
    filtered.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
  ]);

  // ==========================================================
  // DEACTIVATE
  // ==========================================================

  const handleDeactivate = async (
    batch
  ) => {
    if (!batch?.id) return;

    const confirmed =
      window.confirm(
        `Deactivate "${batch.batchName}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoadingId(
        batch.id
      );
      setError("");

      await deactivateBatch(
        batch.id
      );

      await loadBatches();
    } catch (err) {
      console.error(
        "Failed to deactivate batch:",
        err
      );

      setError(
        err.message ||
          "Failed to deactivate batch."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Batch Management
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Manage all training batches of Yashree Sports Academy
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/batch-form"
            )
          }
          className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add New Batch
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
            <Layers className="w-6 h-6 text-sky-600" />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Batches
            </p>

            <p className="text-2xl font-bold text-slate-800">
              {totalBatches}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Active Batches
            </p>

            <p className="text-2xl font-bold text-slate-800">
              {activeBatches}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-rose-600" />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Inactive Batches
            </p>

            <p className="text-2xl font-bold text-slate-800">
              {inactiveBatches}
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* TOOLBAR */}
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search by batch, sport or coach..."
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Filter className="w-4 h-4" />
              <span>
                Filter by Status
              </span>
            </div>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value
                );
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            >
              <option value="All">
                All Batches
              </option>

              <option value="Active">
                Active Only
              </option>

              <option value="Inactive">
                Inactive Only
              </option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="bg-slate-50 text-left">

                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Batch
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Sport / Coach
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Timing
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Days
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Capacity
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center text-slate-500"
                  >
                    Loading batches...
                  </td>
                </tr>
              ) : paginated.length >
                0 ? (
                paginated.map(
                  (batch) => {
                    const status =
                      getStatus(
                        batch
                      );

                    return (
                      <tr
                        key={
                          batch.id
                        }
                        className="hover:bg-slate-50/70 transition"
                      >

                        {/* BATCH */}
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">
                            {batch.batchName ||
                              "-"}
                          </p>
                        </td>

                        {/* SPORT / COACH */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {getSportName(
                              batch
                            )}
                          </p>

                          <p className="text-xs text-slate-400 mt-0.5">
                            {getCoachName(
                              batch
                            )}
                          </p>
                        </td>

                        {/* TIME */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatTiming(
                            batch
                          )}
                        </td>

                        {/* DAYS */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDays(
                            batch.trainingDays
                          )}
                        </td>

                        {/* CAPACITY */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-700">
                            {batch.currentPlayers ??
                              0}{" "}
                            /{" "}
                            {batch.capacity ??
                              "-"}
                          </p>

                          <p className="text-xs text-slate-400 mt-0.5">
                            {batch.availableSeats ??
                              Math.max(
                                0,
                                Number(
                                  batch.capacity ||
                                    0
                                ) -
                                  Number(
                                    batch.currentPlayers ||
                                      0
                                  )
                              )}{" "}
                            seats available
                          </p>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              isActive(
                                batch
                              )
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive(
                                  batch
                                )
                                  ? "bg-emerald-500"
                                  : "bg-rose-500"
                              }`}
                            />

                            {status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1">

                            <button
                              onClick={() =>
                                navigate(
                                  `/batch-form/${batch.id}`
                                )
                              }
                              disabled={
                                !isActive(
                                  batch
                                )
                              }
                              className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Edit Batch"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {isActive(
                              batch
                            ) && (
                              <button
                                onClick={() =>
                                  handleDeactivate(
                                    batch
                                  )
                                }
                                disabled={
                                  actionLoadingId ===
                                  batch.id
                                }
                                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-40"
                                title="Deactivate Batch"
                              >
                                <Power className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center"
                  >
                    <Layers className="w-12 h-12 mx-auto mb-3 text-slate-300" />

                    <p className="font-medium text-slate-500">
                      No batches found
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Try adjusting your search or filter
                    </p>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filtered.length ===
              0
                ? 0
                : startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-800">
              {Math.min(
                startIndex +
                  itemsPerPage,
                filtered.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {filtered.length}
            </span>{" "}
            batches
          </p>

          <div className="flex items-center gap-1.5">

            <button
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from(
              {
                length:
                  totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() =>
                  setCurrentPage(
                    page
                  )
                }
                className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                )
              }
              disabled={
                currentPage ===
                  totalPages ||
                totalPages === 0
              }
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
