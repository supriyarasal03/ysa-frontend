import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import {
  getAllCoaches,
  getAllSports,
  getCoachSportAssignments,
  assignCoachToSport,
} from "../coach/CoachService";

const CoachSportAssignmentForm = ({ onAssigned }) => {
  const [sports, setSports] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [sportId, setSportId] = useState("");
  const [coachId, setCoachId] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError("");

      const [sportResponse, coachResponse, assignmentResponse] =
        await Promise.all([
          getAllSports(),
          getAllCoaches(),
          getCoachSportAssignments(),
        ]);

      const sportList = Array.isArray(sportResponse?.data)
        ? sportResponse.data
        : Array.isArray(sportResponse)
        ? sportResponse
        : [];

      const coachList = Array.isArray(coachResponse?.data)
        ? coachResponse.data
        : Array.isArray(coachResponse)
        ? coachResponse
        : [];

      const assignmentList = Array.isArray(assignmentResponse?.data)
        ? assignmentResponse.data
        : Array.isArray(assignmentResponse)
        ? assignmentResponse
        : [];

      setSports(sportList);
      setCoaches(coachList);
      setAssignments(assignmentList);
    } catch (err) {
      setError(
        err.message || "Failed to load sports, coaches and assignments."
      );
    } finally {
      setLoadingData(false);
    }
  };

  const activeSports = useMemo(() => {
    return sports.filter((sport) => {
      const status = String(
        sport?.Status ?? sport?.status ?? ""
      )
        .trim()
        .toUpperCase();

      return status === "ACTIVE";
    });
  }, [sports]);

  // Backend assignment API is the source of truth.
  // A coach already present in assignments must NOT appear here.
  const assignedCoachIds = useMemo(() => {
    return new Set(
      assignments
        .map((assignment) => Number(assignment?.coachId))
        .filter((id) => !Number.isNaN(id))
    );
  }, [assignments]);

  const availableCoaches = useMemo(() => {
    return coaches.filter((coach) => {
      const status = String(
        coach?.status ??
          coach?.user?.status ??
          ""
      )
        .trim()
        .toUpperCase();

      const coachId = Number(coach?.id);

      const alreadyAssignedByResponse =
        coach?.sport != null || coach?.sportId != null;

      return (
        status === "ACTIVE" &&
        !assignedCoachIds.has(coachId) &&
        !alreadyAssignedByResponse
      );
    });
  }, [coaches, assignments, assignedCoachIds]);

  const selectedSport = useMemo(() => {
    return activeSports.find(
      (sport) => String(sport.id) === String(sportId)
    );
  }, [activeSports, sportId]);

  const handleSportChange = (e) => {
    setSportId(e.target.value);
    setCoachId("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!sportId) {
      setError("Please select a sport.");
      return;
    }

    if (!coachId) {
      setError("Please select a coach.");
      return;
    }

    try {
      setLoading(true);

      const response = await assignCoachToSport(
        Number(sportId),
        Number(coachId)
      );

      setSuccess(
        response?.message ||
          "Coach assigned to sport successfully."
      );

      setCoachId("");

      // Refresh assignments and dropdown after successful assignment.
      await loadData();

      if (onAssigned) {
        onAssigned();
      }
    } catch (err) {
      setError(
        err.message ||
          "Failed to assign coach to sport."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-8 py-7 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-sky-600" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Assign Coach to Sport
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Assign one active coach to one sport.
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="assignment-sport"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Sport
            </label>

            <select
              id="assignment-sport"
              value={sportId}
              onChange={handleSportChange}
              disabled={loadingData || loading}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">Select sport</option>

              {activeSports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.sportsName}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Only active sports can receive coaches.
            </p>
          </div>

          <div>
            <label
              htmlFor="assignment-coach"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Coach
            </label>

            <select
              id="assignment-coach"
              value={coachId}
              onChange={(e) => {
                setCoachId(e.target.value);
                setError("");
                setSuccess("");
              }}
              disabled={
                loadingData ||
                loading ||
                !sportId ||
                availableCoaches.length === 0
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">
                {!sportId
                  ? "Select sport first"
                  : availableCoaches.length === 0
                  ? "No active unassigned coaches available"
                  : "Select coach"}
              </option>

              {availableCoaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.firstName} {coach.lastName}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Only active and unassigned coaches are shown.
            </p>

            {selectedSport && availableCoaches.length === 0 && (
              <p className="mt-2 text-xs text-amber-600">
                All active coaches are already assigned to a sport.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              loadingData ||
              loading ||
              !sportId ||
              !coachId
            }
            className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 transition"
          >
            {loading ? "Assigning..." : "Assign Coach"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CoachSportAssignmentForm;
