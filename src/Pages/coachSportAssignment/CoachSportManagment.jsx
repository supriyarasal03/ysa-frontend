import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trophy,
  UserCheck,
  Users,
  UserPlus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  getAllCoaches,
  getAllSports,
  getCoachSportAssignments,
} from "../coach/CoachService";

import CoachSportAssignmentForm from "./CoachSportAssignmentForm";

const CoachSportManagment = () => {
  const [sports, setSports] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        sportResponse,
        coachResponse,
        assignmentResponse,
      ] = await Promise.all([
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
        err.message ||
          "Failed to load coach sport assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalSports = sports.length;

  const activeSports = sports.filter((sport) => {
    const status = String(
      sport?.Status ?? sport?.status ?? ""
    )
      .trim()
      .toUpperCase();

    return status === "ACTIVE";
  }).length;

  const assignedCoaches = assignments.length;

  const filteredAssignments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return assignments.filter((assignment) => {
      const sportName = String(
        assignment?.sportName ?? ""
      ).toLowerCase();

      const coachName = String(
        assignment?.fullName ??
          `${assignment?.firstName ?? ""} ${
            assignment?.lastName ?? ""
          }`
      ).toLowerCase();

      const matchesSearch =
        !term ||
        sportName.includes(term) ||
        coachName.includes(term);

      const matchesSport =
        selectedSport === "ALL" ||
        String(assignment?.sportId) ===
          String(selectedSport);

      return matchesSearch && matchesSport;
    });
  }, [assignments, search, selectedSport]);

  const getStatusClasses = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "ACTIVE") {
      return "bg-emerald-50 text-emerald-700";
    }

    return "bg-red-50 text-red-600";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-[1500px] mx-auto">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Coach Sport Management
            </h1>
            <p className="mt-1 text-slate-500">
              Manage coach assignments across academy sports
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-sky-600" />
              </div>

              <div>
                <p className="text-slate-500 text-base">
                  Total Sports
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {loading ? "..." : totalSports}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-emerald-600" />
              </div>

              <div>
                <p className="text-slate-500 text-base">
                  Active Sports
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {loading ? "..." : activeSports}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-violet-50 flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-violet-600" />
              </div>

              <div>
                <p className="text-slate-500 text-base">
                  Assigned Coaches
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {loading ? "..." : assignedCoaches}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ASSIGN FORM */}
        <div className="mb-8">
          <CoachSportAssignmentForm
            onAssigned={loadData}
          />
        </div>

        {/* ASSIGNMENT TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* TABLE HEADER */}
          <div className="px-6 md:px-8 py-6 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Coach Sport Assignments
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  View which coach is assigned to which sport
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">

                {/* SEARCH */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search by coach or sport..."
                    className="w-full sm:w-72 rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                {/* SPORT FILTER */}
                <select
                  value={selectedSport}
                  onChange={(e) =>
                    setSelectedSport(e.target.value)
                  }
                  className="w-full sm:w-52 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="ALL">
                    All Sports
                  </option>

                  {sports.map((sport) => (
                    <option
                      key={sport.id}
                      value={sport.id}
                    >
                      {sport.sportsName}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={loadData}
                  disabled={loading}
                  title="Refresh"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Loading coach assignments...
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="py-16 text-center">

              <Users className="w-14 h-14 mx-auto text-slate-300" />

              <h3 className="mt-4 text-lg font-semibold text-slate-700">
                No coach assignments found
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Once a coach is assigned to a sport,
                the assignment will appear here.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">

                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Sport
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Coach
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Experience
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Qualification
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Coach Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Sport Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredAssignments.map((assignment) => (
                    <tr
                      key={`${assignment.sportId}-${assignment.coachId}`}
                      className="hover:bg-slate-50 transition"
                    >

                      {/* SPORT */}
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-800">
                          {assignment.sportName}
                        </div>
                      </td>

                      {/* COACH */}
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-800">
                          {assignment.fullName ||
                            `${assignment.firstName || ""} ${
                              assignment.lastName || ""
                            }`}
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td className="px-6 py-5">
                        <div className="text-sm text-slate-700">
                          {assignment.mobileNumber || "-"}
                        </div>
                      </td>

                      {/* EXPERIENCE */}
                      <td className="px-6 py-5 text-sm text-slate-700">
                        {assignment.experience != null
                          ? `${assignment.experience} yrs`
                          : "-"}
                      </td>

                      {/* QUALIFICATION */}
                      <td className="px-6 py-5 text-sm text-slate-700">
                        {assignment.qualification || "-"}
                      </td>

                      {/* COACH STATUS */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                            assignment.coachStatus
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {assignment.coachStatus || "UNKNOWN"}
                        </span>
                      </td>

                      {/* SPORT STATUS */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                            assignment.sportStatus
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {assignment.sportStatus || "UNKNOWN"}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CoachSportManagment;
