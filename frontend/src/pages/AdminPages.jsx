import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.jsx";

/* =============================================================
 * Dashboard
 * ============================================================= */
export function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, recruiters: 0 });
  useEffect(() => {
    Promise.all([api.get("/admin/users"), api.get("/admin/recruiters")]).then(
      ([u, r]) => setStats({ users: u.data.length, recruiters: r.data.length })
    );
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="neon-heading">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="neon-card p-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Total users
          </p>
          <p className="text-3xl font-bold dark:text-neon-cyan">
            {stats.users}
          </p>
        </div>
        <div className="neon-card p-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Recruiters
          </p>
          <p className="text-3xl font-bold dark:text-neon-pink">
            {stats.recruiters}
          </p>
          <Link to="/admin/recruiters" className="neon-link text-sm">
            Manage →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
 * Users
 * ============================================================= */
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const load = () =>
    api.get("/admin/users").then((r) => setUsers(r.data));

  useEffect(() => {
    load();
  }, []);

  const toggle = async (u) => {
    const action = u.status === "BLOCKED" ? "unblock" : "block";
    await api.post(`/admin/users/${u._id}/${action}`);
    load();
  };

  const del = async (id) => {
    if (!confirm("Delete user?")) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="neon-heading">Users</h1>
      <div className="neon-card divide-y divide-slate-200 dark:divide-neon-cyan/10">
        {users.map((u) => (
          <div
            key={u._id}
            className="p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {u.email} · {u.role} · {u.status}
              </p>
            </div>
            <div className="space-x-3 text-sm">
              <button
                onClick={() => toggle(u)}
                className="text-orange-500 hover:underline"
              >
                {u.status === "BLOCKED" ? "Unblock" : "Block"}
              </button>
              <button
                onClick={() => del(u._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =============================================================
 * Recruiters
 * ============================================================= */
export function AdminRecruiters() {
  const [rows, setRows] = useState([]);
  const load = () =>
    api.get("/admin/recruiters").then((r) => setRows(r.data));

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.post(`/admin/recruiters/${id}/approve`);
    load();
  };

  const reject = async (id) => {
    await api.post(`/admin/recruiters/${id}/reject`);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="neon-heading">Recruiters</h1>
      <div className="neon-card divide-y divide-slate-200 dark:divide-neon-cyan/10">
        {rows.map((r) => (
          <div
            key={r._id}
            className="p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {r.email} · {r.status}
              </p>
            </div>
            <div className="space-x-3 text-sm">
              {r.status === "PENDING" && (
                <>
                  <button
                    onClick={() => approve(r._id)}
                    className="text-green-500 hover:underline"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(r._id)}
                    className="text-red-500 hover:underline"
                  >
                    Reject
                  </button>
                </>
              )}
              {r.status === "ACTIVE" && (
                <button
                  onClick={() => reject(r._id)}
                  className="text-red-500 hover:underline"
                >
                  Block
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}