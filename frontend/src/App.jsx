import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ThemeProvider } from "./api";
import { ProtectedRoute, RoleRoute, DashboardLayout } from "./components";
import { Login, Register } from "./pages/AuthPages";
import {
  ApplicantDashboard,
  ApplicantResume,
  ApplicantJobs,
  ApplicantApplications,
} from "./pages/ApplicantPages";
import {
  RecruiterDashboard,
  RecruiterJobs,
  CreateJob,
  JobTopics,
  JobRankings,
} from "./pages/RecruiterPages";
import {
  AdminDashboard,
  AdminUsers,
  AdminRecruiters,
} from "./pages/AdminPages";

const wrap = (role, node) => (
  <ProtectedRoute>
    <RoleRoute role={role}>
      <DashboardLayout>{node}</DashboardLayout>
    </RoleRoute>
  </ProtectedRoute>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/applicant/dashboard"
              element={wrap("APPLICANT", <ApplicantDashboard />)}
            />
            <Route
              path="/applicant/resume"
              element={wrap("APPLICANT", <ApplicantResume />)}
            />
            <Route
              path="/applicant/jobs"
              element={wrap("APPLICANT", <ApplicantJobs />)}
            />
            <Route
              path="/applicant/applications"
              element={wrap("APPLICANT", <ApplicantApplications />)}
            />

            <Route
              path="/recruiter/dashboard"
              element={wrap("RECRUITER", <RecruiterDashboard />)}
            />
            <Route
              path="/recruiter/jobs"
              element={wrap("RECRUITER", <RecruiterJobs />)}
            />
            <Route
              path="/recruiter/jobs/create"
              element={wrap("RECRUITER", <CreateJob />)}
            />
            <Route
              path="/recruiter/jobs/:id/topics"
              element={wrap("RECRUITER", <JobTopics />)}
            />
            <Route
              path="/recruiter/jobs/:id/rankings"
              element={wrap("RECRUITER", <JobRankings />)}
            />

            <Route
              path="/admin/dashboard"
              element={wrap("ADMIN", <AdminDashboard />)}
            />
            <Route
              path="/admin/users"
              element={wrap("ADMIN", <AdminUsers />)}
            />
            <Route
              path="/admin/recruiters"
              element={wrap("ADMIN", <AdminRecruiters />)}
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}