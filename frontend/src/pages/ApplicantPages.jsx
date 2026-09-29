import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.jsx";

/* =============================================================
 * Dashboard
 * ============================================================= */
export function ApplicantDashboard() {
  const [apps, setApps] = useState([]);
  const [resumeCount, setResumeCount] = useState(0);

  useEffect(() => {
    api
      .get("/applicant/applications")
      .then((r) => setApps(r.data))
      .catch(() => setApps([]));
    api
      .get("/resumes")
      .then((r) => setResumeCount(r.data.length))
      .catch(() => setResumeCount(0));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="neon-heading">Applicant Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="neon-card p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Applications
          </p>
          <p className="text-3xl font-bold dark:text-neon-cyan">{apps.length}</p>
        </div>
        <div className="neon-card p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Resumes uploaded
          </p>
          <p className="text-3xl font-bold dark:text-neon-pink">
            {resumeCount}
          </p>
        </div>
        <div className="neon-card p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Quick actions
          </p>
          <Link to="/applicant/jobs" className="neon-link">
            Browse jobs →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
 * My Resumes (multiple)
 * ============================================================= */
export function ApplicantResume() {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [label, setLabel] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/resumes");
      setResumes(data);
    } catch {
      setResumes([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    const fd = new FormData();
    fd.append("resume", file);
    if (label.trim()) fd.append("label", label.trim());
    try {
      await api.post("/resumes", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg("Uploaded and analyzed successfully.");
      setLabel("");
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this resume?")) return;
    try {
      await api.delete(`/resumes/${id}`);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Delete failed");
    }
  };

  const makeDefault = async (id) => {
    try {
      await api.put(`/resumes/${id}/default`);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to set default");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="neon-heading">My Resumes</h1>

      {resumes.map((r) => (
        <div key={r._id} className="neon-card p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {r.label || r.fileName || "Unnamed resume"}
                {r.isDefault && (
                  <span className="neon-badge-default">Default</span>
                )}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {r.fileName} · {new Date(r.uploadedAt).toLocaleString()}
              </p>
            </div>
            <div className="space-x-3 text-sm">
              {!r.isDefault && (
                <button
                  onClick={() => makeDefault(r._id)}
                  className="neon-link"
                >
                  Set as default
                </button>
              )}
              <button
                onClick={() => del(r._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
          <details className="text-sm">
            <summary className="cursor-pointer neon-link">
              View extracted text
            </summary>
            <p className="mt-2 p-3 rounded whitespace-pre-wrap max-h-64 overflow-y-auto
                          bg-slate-50 dark:bg-ink-700 dark:text-slate-200">
              {r.extractedText}
            </p>
          </details>
        </div>
      ))}

      {resumes.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">
          No resumes uploaded yet.
        </p>
      )}

      <div className="neon-card p-6">
        <p className="mb-3 font-medium">
          Upload a new resume (PDF or DOCX, max 5 MB)
        </p>
        <input
          type="text"
          placeholder="Optional label (e.g., Backend v2)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="neon-input mb-2"
        />
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={upload}
          disabled={uploading}
          className="block dark:text-slate-300"
        />
        {uploading && (
          <p className="text-cyan-500 mt-2 animate-pulse">Uploading...</p>
        )}
        {msg && <p className="mt-2 text-sm">{msg}</p>}
      </div>
    </div>
  );
}

/* =============================================================
 * Browse Jobs
 * ============================================================= */
export function ApplicantJobs() {
  const [jobs, setJobs] = useState([]);
  const [myResumes, setMyResumes] = useState([]);
  const [msg, setMsg] = useState("");
  const [appliedMap, setAppliedMap] = useState({});

  const loadApplied = async () => {
    try {
      const { data } = await api.get("/applicant/applications");
      const map = {};
      data.forEach((a) => {
        const jid = a.jobId?._id || a.jobId;
        const rid = a.resumeId?._id || a.resumeId;
        if (!map[jid]) map[jid] = new Set();
        if (rid) map[jid].add(rid);
      });
      setAppliedMap(map);
    } catch {
      setAppliedMap({});
    }
  };

  useEffect(() => {
    api.get("/jobs").then((r) => setJobs(r.data)).catch(() => setJobs([]));
    api
      .get("/resumes")
      .then((r) => setMyResumes(r.data))
      .catch(() => setMyResumes([]));
    loadApplied();
  }, []);

  const apply = async (jobId, resumeId) => {
    setMsg("");
    try {
      await api.post(`/applicant/jobs/${jobId}/apply`, { resumeId });
      setMsg("Applied successfully!");
      await loadApplied();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="neon-heading">Browse Jobs</h1>

      {myResumes.length === 0 && (
        <p className="text-yellow-500 dark:text-yellow-400">
          Upload a resume before applying. Go to "My Resume".
        </p>
      )}

      {msg && <p className="text-cyan-500">{msg}</p>}

      <div className="grid gap-4">
        {jobs.map((j) => {
          const applied = appliedMap[j._id] || new Set();
          return (
            <div key={j._id} className="neon-card p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold dark:text-neon-cyan">
                  {j.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  {j.location} · {j.experience}
                </p>
                <p className="mt-2 dark:text-slate-200">{j.description}</p>
              </div>

              <div className="border-t border-slate-200 dark:border-neon-cyan/20 pt-4">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Apply with a resume:
                </p>
                <div className="space-y-2">
                  {myResumes.map((r) => {
                    const already = applied.has(r._id);
                    return (
                      <div
                        key={r._id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">
                          {r.label || r.fileName || "Unnamed resume"}
                          {r.isDefault ? " (default)" : ""}
                        </span>
                        {already ? (
                          <span className="text-green-500 text-sm font-medium">
                            ✓ Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => apply(j._id, r._id)}
                            className="neon-btn text-sm"
                          >
                            Apply with this resume
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {myResumes.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No resumes yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {jobs.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">No jobs yet.</p>
        )}
      </div>
    </div>
  );
}

/* =============================================================
 * My Applications
 * ============================================================= */
export function ApplicantApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/applicant/applications")
      .then((r) => setApps(r.data))
      .catch((err) => console.error("Failed to load applications:", err))
      .finally(() => setLoading(false));
  }, []);

  const viewScore = async (appId) => {
    try {
      const { data } = await api.get(`/rankings/application/${appId}`);
      alert(
        `Your Score: ${data.score.toFixed(1)}\nYour Rank: #${data.rank}\nTotal Applicants: ${data.total}`
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not fetch score");
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="neon-heading">My Applications</h1>
      <div className="neon-card divide-y divide-slate-200 dark:divide-neon-cyan/10">
        {apps.map((a) => (
          <div key={a._id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">
                {a.jobId?.title || "Job removed"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Status: {a.status} · Applied{" "}
                {new Date(a.appliedAt).toLocaleDateString()}
              </p>
              {a.resumeId?.label && (
                <p className="text-xs text-slate-400 dark:text-neon-cyan/80">
                  Resume: {a.resumeId.label}
                </p>
              )}
            </div>
            <button
              onClick={() => viewScore(a._id)}
              className="neon-link text-sm"
            >
              View my score
            </button>
          </div>
        ))}
        {apps.length === 0 && (
          <p className="p-4 text-slate-500 dark:text-slate-400">
            No applications yet.
          </p>
        )}
      </div>
    </div>
  );
}