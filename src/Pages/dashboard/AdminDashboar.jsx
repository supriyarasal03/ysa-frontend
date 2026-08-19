import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserRound,
  Trophy,
  CalendarDays,
  Bell,
  TrendingUp,
  Gamepad2,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [activeYearFilter, setActiveYearFilter] = useState("All Time");

  const pickerRef = useRef(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowMonthPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMonthSelect = (monthIndex) => {
    setSelectedMonth(monthIndex);
    setShowMonthPicker(false);
  };

  return (
    <>
      {/* ========== HEADER ========== */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold text-slate-800">Dashboard Overview</h1>
          <span className="text-sm text-slate-500">
            · All data from Yashree Sports Academy
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Picker */}
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="flex items-center gap-2 px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              {months[selectedMonth].slice(0, 3)} {selectedYear}
            </button>

            {showMonthPicker && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setSelectedYear(selectedYear - 1)}
                    className="p-1.5 rounded-lg hover:bg-slate-100"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="font-semibold text-slate-800">{selectedYear}</span>
                  <button
                    onClick={() => setSelectedYear(selectedYear + 1)}
                    className="p-1.5 rounded-lg hover:bg-slate-100"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      className={`py-2 text-sm rounded-lg font-medium transition ${
                        selectedMonth === index
                          ? "bg-sky-600 text-white"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      {month.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Year Filter */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            {["All Time", "2026", "2025"].map((year) => (
              <button
                key={year}
                onClick={() => setActiveYearFilter(year)}
                className={`px-3.5 py-1.5 text-sm rounded-lg font-medium transition ${
                  activeYearFilter === year
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Notification */}
          <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-slate-800">1,248</p>
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +14 this month
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Active Players</p>
                <p className="text-3xl font-bold text-slate-800">842</p>
                <p className="text-xs text-orange-500 mt-2">All Active</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                <UserRound className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Active Games</p>
                <p className="text-3xl font-bold text-slate-800">7</p>
                <p className="text-xs text-emerald-600 mt-2">Live now</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Sessions Today</p>
                <p className="text-3xl font-bold text-slate-800">18</p>
                <p className="text-xs text-sky-600 mt-2">+5 from yesterday</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-violet-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-slate-800">Monthly Player Growth</h2>
                <p className="text-sm text-slate-500">New registrations vs Active players</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-sky-500"></span>
                  <span className="text-slate-600">New</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-orange-400"></span>
                  <span className="text-slate-600">Active</span>
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end gap-4 px-2">
              {[
                { month: "Mar", new: 40, active: 55 },
                { month: "Apr", new: 55, active: 70 },
                { month: "May", new: 35, active: 60 },
                { month: "Jun", new: 70, active: 85 },
                { month: "Jul", new: 50, active: 75 },
                { month: "Aug", new: 80, active: 95 },
              ].map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1 h-48">
                    <div
                      className="w-3.5 rounded-t bg-sky-500"
                      style={{ height: `${item.new}%` }}
                    ></div>
                    <div
                      className="w-3.5 rounded-t bg-orange-400"
                      style={{ height: `${item.active}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-1">Role Distribution</h2>
            <p className="text-sm text-slate-500 mb-5">Users by role</p>

            <div className="flex items-center justify-center mb-5">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="3.5"
                    strokeDasharray="67 100"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3.5"
                    strokeDasharray="18 100"
                    strokeDashoffset="-67"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="3.5"
                    strokeDasharray="11 100"
                    strokeDashoffset="-85"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl font-bold text-slate-800">1.2k</p>
                    <p className="text-xs text-slate-500">Users</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  <span className="text-slate-600">Players</span>
                </div>
                <span className="font-medium">67%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                  <span className="text-slate-600">Parents</span>
                </div>
                <span className="font-medium">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400"></span>
                  <span className="text-slate-600">Others</span>
                </div>
                <span className="font-medium">15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-800">Recent Activity</h2>
              <button className="text-sm text-sky-600 hover:underline">View all</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-100">
                    <th className="pb-3 font-medium">Activity</th>
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="py-3 font-medium text-slate-800">New player registered</td>
                    <td className="py-3 text-slate-600">Rahul Sharma</td>
                    <td className="py-3 text-slate-500">12 min ago</td>
                    <td className="py-3">
                      <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">
                        Success
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-slate-800">Session created</td>
                    <td className="py-3 text-slate-600">U-14 Batch A</td>
                    <td className="py-3 text-slate-500">45 min ago</td>
                    <td className="py-3">
                      <span className="text-xs bg-sky-50 text-sky-600 px-2 py-1 rounded-full">
                        Created
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-slate-800">Coach profile updated</td>
                    <td className="py-3 text-slate-600">Coach Vikram</td>
                    <td className="py-3 text-slate-500">2 hrs ago</td>
                    <td className="py-3">
                      <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">
                        Updated
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-slate-800">Payment received</td>
                    <td className="py-3 text-slate-600">Priya Kapoor</td>
                    <td className="py-3 text-slate-500">3 hrs ago</td>
                    <td className="py-3">
                      <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">
                        Paid
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-1">Platform Summary</h2>
            <p className="text-sm text-slate-500 mb-5">Key metrics at a glance</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">46</p>
                <p className="text-xs text-slate-500 mt-1">Coaches</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">18</p>
                <p className="text-xs text-slate-500 mt-1">Today Sessions</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">7</p>
                <p className="text-xs text-slate-500 mt-1">Live Games</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">92%</p>
                <p className="text-xs text-slate-500 mt-1">Attendance</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}