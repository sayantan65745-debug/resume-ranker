import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { api } from "../api.jsx";

/* =============================================================
 * Dashboard
 * ============================================================= */
export function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    api.get("/jobs").then((r) => setJobs(r.data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="neon-heading">Recruiter Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="neon-card p-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Active jobs
          </p>
          <p className="text-3xl font-bold dark:text-neon-cyan">
            {jobs.length}
          </p>
        </div>
        <div className="neon-card p-6">
          <Link to="/recruiter/jobs/create" className="neon-link">
            Post a new job →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
 * My Jobs
 * ============================================================= */
export function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    api.get("/jobs").then((r) => setJobs(r.data));
  }, []);

  const del = async (id) => {
    if (!confirm("Delete this job?")) return;
    await api.delete(`/jobs/${id}`);
    setJobs(jobs.filter((j) => j._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="neon-heading">My Jobs</h1>
        <Link to="/recruiter/jobs/create" className="neon-btn">
          + New Job
        </Link>
      </div>
      <div className="neon-card divide-y divide-slate-200 dark:divide-neon-cyan/10">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium dark:text-neon-cyan">{job.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {job.topics?.length || 0} topics weighted
              </p>
            </div>
            <div className="space-x-3 text-sm">
              <Link
                to={`/recruiter/jobs/${job._id}/topics`}
                className="neon-link"
              >
                Topics
              </Link>
              <Link
                to={`/recruiter/jobs/${job._id}/rankings`}
                className="text-green-500 hover:underline"
              >
                Rankings
              </Link>
              <button
                onClick={() => del(job._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <p className="p-4 text-slate-500 dark:text-slate-400">
            No jobs yet.
          </p>
        )}
      </div>
    </div>
  );
}

/* =============================================================
 * Create Job
 * ============================================================= */
export function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    experience: "",
  });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/jobs", form);
      navigate(`/recruiter/jobs/${data._id}/topics`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job");
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="neon-heading mb-6">Post a Job</h1>
      <form onSubmit={submit} className="neon-card p-6 space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <input
          placeholder="Job title"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="neon-input"
        />
        <textarea
          placeholder="Description"
          required
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="neon-input"
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="neon-input"
        />
        <input
          placeholder="Experience"
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
          className="neon-input"
        />
        <button className="neon-btn">Create</button>
      </form>
    </div>
  );
}

/* =============================================================
 * Topic Weights
 * ============================================================= */
export function JobTopics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([
    { name: "Data Structures", weight: 30, priorityOrder: 1 },
    { name: "C++", weight: 20, priorityOrder: 2 },
    { name: "Java", weight: 15, priorityOrder: 3 },
    { name: "SQL", weight: 15, priorityOrder: 4 },
    { name: "Git", weight: 10, priorityOrder: 5 },
    { name: "English", weight: 10, priorityOrder: 6 },
  ]);
  const [msg, setMsg] = useState("");
  const total = topics.reduce((s, t) => s + Number(t.weight || 0), 0);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((r) => {
      if (r.data.topics?.length) setTopics(r.data.topics);
    });
  }, [id]);

  const save = async () => {
    if (total !== 100) {
      setMsg("Weights must sum to 100");
      return;
    }
    try {
      await api.put(`/jobs/${id}/topics`, { topics });
      setMsg("Saved.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="neon-heading">Topic Weights</h1>
      <p
        className={`text-sm ${
          total === 100 ? "text-green-500" : "text-red-500"
        }`}
      >
        Total: {total} / 100
      </p>
      <div className="neon-card divide-y divide-slate-200 dark:divide-neon-cyan/10">
        {topics.map((t, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <input
              value={t.name}
              onChange={(e) => {
                const copy = [...topics];
                copy[i].name = e.target.value;
                setTopics(copy);
              }}
              className="neon-input flex-1"
            />
            <input
              type="number"
              value={t.weight}
              onChange={(e) => {
                const copy = [...topics];
                copy[i].weight = Number(e.target.value);
                setTopics(copy);
              }}
              className="neon-input w-24"
            />
            <button
              onClick={() =>
                setTopics(topics.filter((_, j) => j !== i))
              }
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() =>
            setTopics([
              ...topics,
              { name: "", weight: 0, priorityOrder: topics.length + 1 },
            ])
          }
          className="px-4 py-2 rounded bg-slate-200 dark:bg-ink-700 dark:text-slate-200"
        >
          + Add topic
        </button>
        <button
          onClick={save}
          disabled={total !== 100}
          className="neon-btn disabled:opacity-50"
        >
          Save
        </button>
        <button
          onClick={() => navigate(`/recruiter/jobs/${id}/rankings`)}
          className="neon-link"
        >
          View rankings →
        </button>
      </div>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}

/* =============================================================
 * Rankings
 * ============================================================= */
export function JobRankings() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get(`/rankings/job/${id}`).then((r) => setRows(r.data));
  }, [id]);

  return (
    <div className="space-y-8">
      <h1 className="neon-heading">Rankings</h1>

      {rows.length > 0 && (
        <div className="neon-card p-6">
          <h2 className="font-medium mb-4">Score distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={rows.map((r) => ({
                name: `${r.applicant?.name ?? "?"} · ${
                  r.resume?.label || r.resume?.fileName || "resume"
                }`,
                score: r.overallScore,
              }))}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,255,247,.15)"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                stroke="#64748b"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#94a3b8" }}
                stroke="#64748b"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d0d17",
                  border: "1px solid rgba(0,255,247,.4)",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                }}
              />
              <Bar dataKey="score" fill="#00fff7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="neon-card divide-y divide-slate-200 dark:divide-neon-cyan/10">
        {rows.map((r) => (
          <div key={r.applicationId} className="p-4 flex justify-between">
            <div>
              <span className="font-bold mr-3 dark:text-neon-pink">
                #{r.rank}
              </span>
              <span>{r.applicant?.name}</span>
              <span className="text-slate-500 dark:text-slate-400 ml-3 text-sm">
                {r.applicant?.email}
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Resume:{" "}
                <span className="font-medium dark:text-neon-cyan">
                  {r.resume?.label || "Untitled"}
                </span>{" "}
                <span className="text-slate-400 dark:text-slate-500">
                  ({r.resume?.fileName || "—"})
                </span>
              </p>
            </div>
            <p className="font-semibold text-lg dark:text-neon-cyan">
              {r.overallScore.toFixed(1)}
            </p>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="p-4 text-slate-500 dark:text-slate-400">
            No applicants yet.
          </p>
        )}
      </div>
    </div>
  );
}