import Sidebar from "../components/sidebar";
import "./dashboard.css";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar basePath="/dashboard" />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
