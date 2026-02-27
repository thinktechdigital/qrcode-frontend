import "./App.css";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Admin from "./pages/admin";
import Qrcode from "./pages/qrcode";
import Barcode from "./pages/barcode";
import Mycodes from "./pages/mycodes";
import Analytics from "./pages/analytics";
import PublicVCard from "./pages/publicvcard";
import PublicPdf from "./pages/publicpdf";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/c/:slug" element={<PublicVCard />} />
        <Route path="/p/:slug" element={<PublicPdf />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]} redirectTo="/admin">
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="mycodes" replace />} />
          <Route path="qrcode" element={<Qrcode />} />
          <Route path="barcode" element={<Barcode />} />
          <Route path="mycodes" element={<Mycodes />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="qrcode" element={<Qrcode />} />
          <Route path="barcode" element={<Barcode />} />
          <Route path="mycodes" element={<Mycodes />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
