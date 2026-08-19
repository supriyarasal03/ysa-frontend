import React from "react";
import {
  Users,
  UserPlus,
  CreditCard,
  Calendar,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const ReceptionistDashboard = () => {
  const stats = [
    {
      title: "Total Players",
      value: "842",
      change: "+18 this month",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      changeColor: "text-green-600",
    },
    {
      title: "New Registrations",
      value: "47",
      change: "+12 this week",
      icon: UserPlus,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      changeColor: "text-orange-600",
    },
    {
      title: "Pending Fees",
      value: "₹38,400",
      change: "19 players",
      icon: CreditCard,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      changeColor: "text-emerald-600",
    },
    {
      title: "Today's Trials",
      value: "9",
      change: "4 remaining",
      icon: Calendar,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      changeColor: "text-blue-600",
    },
  ];

  const recentPlayers = [
    { name: "Aarav Sharma", sport: "Cricket", batch: "U-14 Morning", fee: "Paid", date: "11 Aug" },
    { name: "Priya Verma", sport: "Badminton", batch: "Beginner Eve", fee: "Pending", date: "11 Aug" },
    { name: "Rohan Patel", sport: "Football", batch: "U-16 Evening", fee: "Paid", date: "10 Aug" },
    { name: "Sneha Reddy", sport: "Tennis", batch: "Intermediate", fee: "Pending", date: "10 Aug" },
    { name: "Vikram Singh", sport: "Cricket", batch: "U-12 Morning", fee: "Paid", date: "09 Aug" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">
                  {stat.value}
                </p>
                <p className={`text-xs mt-2 font-medium ${stat.changeColor}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Recent Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Monthly Growth Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Player Growth</h3>
              <p className="text-sm text-gray-500 mt-0.5">New registrations vs Active players</p>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-blue-500"></span>
                <span className="text-gray-600">New</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-orange-400"></span>
                <span className="text-gray-600">Active</span>
              </div>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between h-52 gap-3 px-1">
            {[
              { month: "Mar", new: 35, active: 55 },
              { month: "Apr", new: 48, active: 62 },
              { month: "May", new: 32, active: 58 },
              { month: "Jun", new: 55, active: 78 },
              { month: "Jul", new: 42, active: 70 },
              { month: "Aug", new: 65, active: 85 },
            ].map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center gap-1.5 h-40">
                  <div
                    className="w-3 sm:w-4 bg-blue-500 rounded-t-md"
                    style={{ height: `${item.new}%` }}
                  ></div>
                  <div
                    className="w-3 sm:w-4 bg-orange-400 rounded-t-md"
                    style={{ height: `${item.active}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Players */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Recent Players</h3>
            <Link
              to="/receptionist/players"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentPlayers.map((player, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                  {player.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{player.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {player.sport} • {player.batch}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                      player.fee === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {player.fee}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">{player.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Register Player", path: "/receptionist/register-player", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
            { label: "Collect Fees", path: "/receptionist/fees", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
            { label: "View Batches", path: "/receptionist/batches", color: "bg-violet-50 text-violet-700 hover:bg-violet-100" },
            { label: "All Players", path: "/receptionist/players", color: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
          ].map((action, idx) => (
            <Link
              key={idx}
              to={action.path}
              className={`flex items-center justify-center py-3.5 rounded-xl text-sm font-medium transition-colors ${action.color}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;