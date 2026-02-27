import { NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import logo from "../assets/logo.png";
import "./sidebar.css";
import barcodeScan from "../assets/barcode-scan.png";
import qrCode from "../assets/qr-code.png";
import myCode from "../assets/mycode.png";
import Dashboard from "../assets/dashboard.png";
import userIcon from "../assets/user.png";
import outIcon from "../assets/out.png";



const Sidebar = ({ basePath = "/dashboard", showAnalytics = false }) => {
  const navigate = useNavigate();
  const currentUser = useMemo(() => {
    const localRaw = window.localStorage.getItem("user");
    const sessionRaw = window.sessionStorage.getItem("user");
    const raw = localRaw || sessionRaw;
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const firstName = currentUser?.first_name || "";
  const roleLabel = currentUser?.role ? `${String(currentUser.role).charAt(0).toUpperCase()}${String(currentUser.role).slice(1)}` : "User";

  const handleLogout = () => {
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("token_type");
    window.localStorage.removeItem("user");
    window.sessionStorage.removeItem("access_token");
    window.sessionStorage.removeItem("token_type");
    window.sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-wrap">
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        {showAnalytics ? (
          <NavLink to={`${basePath}/analytics`} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            
            <img className="navigation-icons" src={Dashboard} alt="dashboard" />
            <span>Analytics</span>
          </NavLink>
        ) : null}

        <NavLink to={`${basePath}/qrcode`} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          
          <img className="navigation-icons" src={qrCode} alt="qr-code" />
          <span>Create QR Code</span>
        </NavLink>

        <NavLink to={`${basePath}/barcode`} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          
          <img className="navigation-icons" src={barcodeScan} alt="barcode-scan" />
          <span>Create Barcode</span>
        </NavLink>

        <NavLink to={`${basePath}/mycodes`} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          
          <img className="navigation-icons" src={myCode} alt="qr-code" />
          <span>My Codes</span>
        </NavLink>
      </nav>

      <div className="sidebar-welcome">
        <img src={userIcon} alt="user" className="sidebar-user-icon" />
        <div className="sidebar-welcome-text">
          <p className="sidebar-welcome-label">Welcome, {firstName}</p>
          <p className="sidebar-role-label">{roleLabel}</p>
        </div>
      </div>

      <button type="button" className="sidebar-logout" onClick={handleLogout}>
        <img src={outIcon} alt="logout" className="sidebar-logout-icon" />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
