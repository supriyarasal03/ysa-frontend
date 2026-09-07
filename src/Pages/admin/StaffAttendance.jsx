import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  CalendarCheck2,
  UserRound,
  ArrowLeft,
} from "lucide-react";

import ReceptionistAttendanceService
  from "../receptionist/ReceptionistAttendanceService";

export default function StaffAttendance() {

  const navigate = useNavigate();

  const [attendanceList, setAttendanceList] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD TODAY'S STAFF ATTENDANCE
  // ==========================================================

  const loadTodayAttendance = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await ReceptionistAttendanceService
          .getAdminTodayStaffAttendance();

      setAttendanceList(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load today's staff attendance:",
        err
      );

      setError(
        "Failed to load today's staff attendance."
      );

      setAttendanceList([]);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    loadTodayAttendance();

  }, []);

  // ==========================================================
  // ROLE LABEL
  // ==========================================================

  const getRoleLabel = (role) => {

    if (!role) {
      return "-";
    }

    switch (role) {

      case "INVENTORY_MANAGER":
        return "Inventory Manager";

      case "CLEANING_STAFF":
        return "Cleaning Staff";

      case "RECEPTIONIST":
        return "Receptionist";

      case "COACH":
        return "Coach";

      default:
        return role;
    }
  };

  // ==========================================================
  // FORMAT TIME
  // ==========================================================

  const formatTime = (time) => {

    if (!time) {
      return "-";
    }

    return time.substring(0, 5);
  };

  // ==========================================================
  // FILTER TODAY'S ATTENDANCE
  // ==========================================================

  const filteredAttendance = attendanceList.filter(
    (employee) => {

      const keyword =
        searchKeyword.trim().toLowerCase();

      const matchesKeyword =
        !keyword ||
        (employee.name || "")
          .toLowerCase()
          .includes(keyword) ||
        (employee.username || "")
          .toLowerCase()
          .includes(keyword);

      const matchesRole =
        selectedRole === "ALL" ||
        employee.role === selectedRole;

      return matchesKeyword && matchesRole;
    }
  );

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <main className="p-8">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div>

            <h1 className="text-2xl font-bold text-slate-800">
              Today's Staff Attendance
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Quick view of today's attendance for all staff and coaches.
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50">

          <CalendarCheck2 className="w-5 h-5 text-sky-600" />

          <span className="text-sm font-medium text-sky-700">
            Today
          </span>

        </div>

      </div>

      {error && (
        <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Search */}
          <div className="relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={searchKeyword}
              onChange={(e) =>
                setSearchKeyword(e.target.value)
              }
              placeholder="Search by name or username..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400"
            />

          </div>

          {/* Role */}
          <select
            value={selectedRole}
            onChange={(e) =>
              setSelectedRole(e.target.value)
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-400"
          >

            <option value="ALL">
              All Staff
            </option>

            <option value="RECEPTIONIST">
              Receptionist
            </option>

            <option value="COACH">
              Coach
            </option>

            <option value="INVENTORY_MANAGER">
              Inventory Manager
            </option>

            <option value="CLEANING_STAFF">
              Cleaning Staff
            </option>

          </select>

        </div>

      </div>

      {/* ======================================================
          TODAY'S ATTENDANCE TABLE
      ====================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        <div className="p-6 border-b border-slate-100">

          <h2 className="font-semibold text-slate-800">
            Today's Attendance
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {loading
              ? "Loading attendance..."
              : `${filteredAttendance.length} staff member${
                  filteredAttendance.length === 1
                    ? ""
                    : "s"
                } shown`}
          </p>

        </div>

        {loading ? (

          <div className="p-10 text-center text-slate-500">
            Loading today's attendance...
          </div>

        ) : filteredAttendance.length === 0 ? (

          <div className="p-10 text-center">

            <UserRound className="w-10 h-10 text-slate-300 mx-auto mb-3" />

            <p className="font-medium text-slate-700">
              No staff found
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Try changing your search or role filter.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="text-left text-slate-500 border-b border-slate-100">

                  <th className="px-6 py-4 font-medium">
                    Employee
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Username
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Role
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Date
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Punch In
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Punch Out
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Total Hours
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-50">

                {filteredAttendance.map((employee) => (

                  <tr
                    key={employee.userId}
                    className="hover:bg-slate-50 transition"
                  >

                    {/* Employee */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center">

                          <UserRound className="w-4 h-4 text-sky-600" />

                        </div>

                        <span className="font-medium text-slate-800">
                          {employee.name || "-"}
                        </span>

                      </div>

                    </td>

                    {/* Username */}
                    <td className="px-6 py-4 text-slate-600">
                      {employee.username || "-"}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">

                      <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                        {getRoleLabel(employee.role)}
                      </span>

                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {employee.attendanceDate || "-"}
                    </td>

                    {/* Punch In */}
                    <td className="px-6 py-4 text-slate-600">
                      {formatTime(employee.punchInTime)}
                    </td>

                    {/* Punch Out */}
                    <td className="px-6 py-4 text-slate-600">
                      {formatTime(employee.punchOutTime)}
                    </td>

                    {/* Total Hours */}
                    <td className="px-6 py-4 text-slate-600">
                      {employee.totalHours != null
                        ? `${employee.totalHours} hrs`
                        : "-"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          employee.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-600"
                            : employee.status === "PRESENT"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {employee.status === "COMPLETED"
                          ? "Completed"
                          : employee.status === "PRESENT"
                          ? "Present"
                          : "Not Marked"}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </main>
  );
}
