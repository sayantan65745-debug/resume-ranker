import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "./api.jsx";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export const RoleRoute = ({ role, children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
};

const navByRole = {
  APPLICANT: [
    { to: "/applicant/dashboard", label: "Dashboard" },
    { to: "/applicant/resume", label: "My Resume" },
    { to: "/applicant/jobs", label: "Browse Jobs" },
    { to: "/applicant/applications", label: "My Applications" },
  ],
  RECRUITER: [
    { to: "/recruiter/dashboard", label: "Dashboard" },
    { to: "/recruiter/jobs", label: "My Jobs" },
    { to: "/recruiter/jobs/create", label: "Post a Job" },
  ],
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/recruiters", label: "Recruiters" },
  ],
};

export function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const links = navByRole[user?.role] || [];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 p-6 flex flex-col bg-slate-900 text-slate-100 dark:bg-ink-800 dark:border-r dark:border-neon-cyan/20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold dark:text-neon-cyan dark:drop-shadow-[0_0_6px_#00fff7] dark:animate-neon-pulse">
            Resume Ranker
          </h1>
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="text-lg p-1 rounded hover:bg-slate-800 dark:hover:bg-ink-700"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block px-3 py-2 rounded
                         hover:bg-slate-800 hover:text-neon-cyan
                         dark:hover:bg-ink-700 dark:hover:text-neon-cyan
                         dark:hover:shadow-neon-inset
                         transition-all"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-700 dark:border-neon-cyan/20 pt-4 text-sm">
          <p className="font-medium">{user?.name}</p>
          <p className="text-slate-400 dark:text-neon-pink mb-3 text-xs tracking-wider">
            {user?.role}
          </p>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="neon-btn-pink w-full"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}