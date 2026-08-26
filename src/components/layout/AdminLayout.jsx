import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Trophy,
  UsersRound,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { IndianRupee } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-50 overflow-hidden">
        {/* Logo */}
        <div className="pt-3 pb-4 px-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-white text-base shadow-md">
            Y
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-[15px]">Yashree Sports</p>
            <p className="text-[11px] text-slate-400">Admin Dashboard</p>
          </div>
        </div>

        <div className="border-b border-slate-700/60"></div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto scrollbar-hide text-[13px]">
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Overview
          </p>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold no-underline transition ${
                isActive
                  ? "bg-sky-600/20 text-sky-400"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            Dashboard
          </NavLink>

          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2">
            Management
          </p>

          <NavLink
            to="/admin/staff-management"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold no-underline transition ${
                isActive
                  ? "bg-sky-600/20 text-sky-400"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <Users className="w-4.5 h-4.5" />
            Staff Management
          </NavLink>

          <NavLink
            to="/admin/sport-management"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold no-underline transition ${
                isActive
                  ? "bg-sky-600/20 text-sky-400"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <UserRound className="w-4.5 h-4.5" />
            Sport Managmnet
          </NavLink>




         




          <NavLink
            to="/admin/coach-managmnet"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold no-underline transition ${
                isActive
                  ? "bg-sky-600/20 text-sky-400"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <Trophy className="w-4.5 h-4.5" />
            Coaches Managment
          </NavLink>

        
          <NavLink
            to="/admin/batch-managmnet"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold no-underline transition ${
                isActive
                  ? "bg-sky-600/20 text-sky-400"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <CalendarDays className="w-4.5 h-4.5" />
           Batch Managment
          </NavLink>



          
          



       

        </nav>



        {/* User + Logout */}
        <div className="p-4 border-t border-slate-700/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-sm font-semibold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin</p>
              <p className="text-xs text-slate-400 truncate">admin@yashree.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-300 transition text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
}