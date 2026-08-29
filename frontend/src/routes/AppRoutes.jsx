import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AIAnalysisPage from "../pages/AI/AIAnalysisPage";
import AnalyticsPage from "../pages/Analytics/AnalyticsPage";
import ApplicationsPage from "../pages/Applications/ApplicationsPage";
import DashboardOverviewPage from "../pages/Dashboard/DashboardPage";
import InterviewsPage from "../pages/Interviews/InterviewsPage";
import KanbanPage from "../pages/Kanban/KanbanPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/overview" element={<DashboardOverviewPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/ai-analysis" element={<AIAnalysisPage />} />
            <Route path="/interviews" element={<InterviewsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
