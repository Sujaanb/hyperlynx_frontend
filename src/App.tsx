import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MarketingPage from './pages/MarketingPage';
import { DashboardRoot } from './dashboard/DashboardRoot';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/dashboard/*" element={<DashboardRoot />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
