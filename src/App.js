import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Guests from "./pages/Guests";

function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="text-xl font-extrabold">Unauthorized</div>
        <p className="text-sm text-slate-500 mt-1">
          You don’t have permission to access this page.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* All roles */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/guests" element={<Guests />} />

            {/* Admin + Manager only */}
            <Route element={<ProtectedRoute allowRoles={["admin","manager"]} />}>
              <Route path="/rooms" element={<Rooms />} />
            </Route>

          </Route>
        </Route>

        {/* 404 page */}
        <Route path="*" element={<div className="p-6 text-sm">404 Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}