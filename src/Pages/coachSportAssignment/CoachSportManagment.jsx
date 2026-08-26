import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trophy,
  UserCheck,
  Users,
  UserPlus,
  AlertCircle,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import {
  getAllCoaches,
  getAllSports,
  getCoachSportAssignments,
  updateCoachSportAssignment,
  removeCoachSportAssignment,
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

const [selectedAssignment, setSelectedAssignment] =
  useState(null);

const [viewAssignment, setViewAssignment] =
  useState(null);

const [showUpdateModal, setShowUpdateModal] =
  useState(false);

const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [updateSportId, setUpdateSportId] =
  useState("");

const [actionLoading, setActionLoading] =
  useState(false);





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

const assignmentList = (
  Array.isArray(assignmentResponse?.data)
    ? assignmentResponse.data
    : Array.isArray(assignmentResponse)
    ? assignmentResponse
    : []
).sort(
  (a, b) =>
    Number(b.coachId || 0) -
    Number(a.coachId || 0)
);



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



  const handleUpdateAssignment = async () => {
  if (!selectedAssignment || !updateSportId) {
    return;
  }

  try {
    setActionLoading(true);
    setError("");

    await updateCoachSportAssignment(
      Number(updateSportId),
      Number(selectedAssignment.coachId)
    );

    setShowUpdateModal(false);
    setSelectedAssignment(null);
    setUpdateSportId("");

    await loadData();
  } catch (err) {
    setError(
      err.message ||
        "Failed to update coach sport assignment."
    );
  } finally {
    setActionLoading(false);
  }
};


const handleRemoveAssignment = async () => {
  if (!selectedAssignment) {
    return;
  }

  try {
    setActionLoading(true);
    setError("");

    await removeCoachSportAssignment(
      Number(selectedAssignment.coachId)
    );

    setShowDeleteModal(false);
    setSelectedAssignment(null);

    await loadData();
  } catch (err) {
    setError(
      err.message ||
        "Failed to remove coach from sport."
    );
  } finally {
    setActionLoading(false);
  }
};






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
  Actions
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


                     





                      {/* ACTIONS */}
<td className="px-6 py-5">
  <div className="flex items-center gap-2">

    {/* VIEW */}
    <button
      type="button"
      title="View"
      onClick={() =>
        setViewAssignment(assignment)
      }
      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
    >
      <Eye className="w-4 h-4" />
    </button>


    {/* UPDATE */}
    <button
      type="button"
      title="Update"
      onClick={() => {
        setSelectedAssignment(assignment);
        setUpdateSportId(
          String(assignment.sportId)
        );
        setShowUpdateModal(true);
      }}
      className="p-2 rounded-lg border border-slate-200 text-sky-600 hover:bg-sky-50"
    >
      <Pencil className="w-4 h-4" />
    </button>


    {/* ACTIVE / INACTIVE */}

    



    {/* REMOVE */}
    <button
      type="button"
      title="Remove Assignment"
      onClick={() => {
        setSelectedAssignment(assignment);
        setShowDeleteModal(true);
      }}
      className="p-2 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>

  </div>
</td>




                    </tr>
                  )
                  
                  
                  
                  
                  
                  )}

                </tbody>
              </table>
            </div>




          )}

        </div>

        {/* VIEW MODAL */}
        {viewAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

              <div className="flex items-center justify-between border-b px-6 py-5">

                <h2 className="text-xl font-semibold text-slate-900">
                  Assignment Details
                </h2>

                <button
                  type="button"
                  onClick={() => setViewAssignment(null)}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              <div className="p-6 space-y-4">

                <div>
                  <p className="text-sm text-slate-500">
                    Sport
                  </p>
                  <p className="font-semibold text-slate-900">
                    {viewAssignment.sportName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Coach
                  </p>
                  <p className="font-semibold text-slate-900">
                    {viewAssignment.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Contact
                  </p>
                  <p className="text-slate-900">
                    {viewAssignment.mobileNumber || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Experience
                  </p>
                  <p className="text-slate-900">
                    {viewAssignment.experience != null
                      ? `${viewAssignment.experience} yrs`
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Qualification
                  </p>
                  <p className="text-slate-900">
                    {viewAssignment.qualification || "-"}
                  </p>
                </div>

              </div>

            </div>
          </div>


        )}


        {/* UPDATE MODAL */}
{showUpdateModal &&
  selectedAssignment && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <h2 className="text-xl font-semibold text-slate-900">
            Update Sport Assignment
          </h2>

          <button
            type="button"
            onClick={() => {
              setShowUpdateModal(false);
              setSelectedAssignment(null);
            }}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        <div className="p-6">

          <div className="mb-5">
            <p className="text-sm text-slate-500">
              Coach
            </p>

            <p className="font-semibold text-slate-900">
              {selectedAssignment.fullName}
            </p>
          </div>

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Sport
          </label>

          <select
            value={updateSportId}
            onChange={(e) =>
              setUpdateSportId(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            {sports
              .filter(
                (sport) =>
                  String(
                    sport?.Status ??
                      sport?.status ??
                      ""
                  ).toUpperCase() === "ACTIVE"
              )
              .map((sport) => (
                <option
                  key={sport.id}
                  value={sport.id}
                >
                  {sport.sportsName}
                </option>
              ))}
          </select>

          <div className="flex justify-end gap-3 mt-6">

            <button
              type="button"
              onClick={() => {
                setShowUpdateModal(false);
                setSelectedAssignment(null);
              }}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdateAssignment}
              disabled={
                actionLoading ||
                !updateSportId
              }
              className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {actionLoading
                ? "Updating..."
                : "Update"}
            </button>

          </div>

        </div>
      </div>
    </div>
  )}



  {/* REMOVE MODAL */}
{showDeleteModal &&
  selectedAssignment && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

        <div className="p-6">

          <h2 className="text-xl font-semibold text-slate-900">
            Remove Assignment
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            Are you sure you want to remove{" "}
            <strong>
              {selectedAssignment.fullName}
            </strong>{" "}
            from{" "}
            <strong>
              {selectedAssignment.sportName}
            </strong>
            ?
          </p>

          <div className="flex justify-end gap-3 mt-6">

            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedAssignment(null);
              }}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium"
            >
              No
            </button>

            <button
              type="button"
              onClick={handleRemoveAssignment}
              disabled={actionLoading}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {actionLoading
                ? "Removing..."
                : "Yes, Remove"}
            </button>

          </div>

        </div>
      </div>
    </div>
  )}





      </div>
    </div>
  );
};

export default CoachSportManagment;
