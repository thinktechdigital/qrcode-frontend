import Sidebar from "../components/sidebar";
import "./dashboard.css";
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar basePath="/admin" showAnalytics />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
