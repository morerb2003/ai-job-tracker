import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AIAnalysisPage from "../pages/AI/AIAnalysisPage";
import AnalyticsPage from "../pages/Analytics/AnalyticsPage";
import ApplicationsPage from "../pages/Applications/ApplicationsPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import InterviewsPage from "../pages/Interviews/InterviewsPage";
import KanbanPage from "../pages/Kanban/KanbanPage";
import SettingsPage from "../pages/Settings/SettingsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/ai-analysis" element={<AIAnalysisPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
