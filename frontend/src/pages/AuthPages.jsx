import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../api.jsx";

const homeByRole = {
  APPLICANT: "/applicant/dashboard",
  RECRUITER: "/recruiter/dashboard",
  ADMIN: "/admin/dashboard",
};

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(homeByRole[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6
                    bg-slate-100 dark:bg-ink-900">
      <form onSubmit={submit} className="neon-card p-8 w-96 space-y-4">
        <h2 className="neon-heading mb-2">Sign in</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="neon-input"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="neon-input"
        />
        <button className="neon-btn w-full">Login</button>
        <p className="text-sm text-center dark:text-slate-300">
          No account?{" "}
          <Link to="/register" className="neon-link">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "APPLICANT",
  });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await register(form);
      if (user.role === "RECRUITER" && user.status === "PENDING") {
        alert("Your recruiter account is pending admin approval.");
        navigate("/login");
      } else {
        navigate(homeByRole[user.role] || "/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6
                    bg-slate-100 dark:bg-ink-900">
      <form onSubmit={submit} className="neon-card p-8 w-96 space-y-4">
        <h2 className="neon-heading mb-2">Create account</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          placeholder="Full name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="neon-input"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="neon-input"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="neon-input"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="neon-input"
        >
          <option value="APPLICANT">Applicant</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button className="neon-btn w-full">Register</button>
        <p className="text-sm text-center dark:text-slate-300">
          Have an account?{" "}
          <Link to="/login" className="neon-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}