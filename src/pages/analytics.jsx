import "./analytics.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import qrCode from "../assets/qr-code.png";
import barcodeScan from "../assets/barcode-scan.png";
import groupIcon from "../assets/group2.png";
import fileIcon from "../assets/file.png";
import userIcon from "../assets/user.png";

const Analytics = () => {
  const navigate = useNavigate();
  const apiBaseUrl = useMemo(() => (import.meta.env.VITE_API_URL || "").replace(/\/$/, ""), []);
  const token = useMemo(
    () => window.localStorage.getItem("access_token") || window.sessionStorage.getItem("access_token") || "",
    [],
  );
  const [stats, setStats] = useState({
    total_users: 0,
    total_codes_generated: 0,
    total_admins: 0,
    total_regular_users: 0,
    total_qr_codes_generated: 0,
    total_barcodes_generated: 0,
    barcode_type_breakdown: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [chartRefreshKey, setChartRefreshKey] = useState(0);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState("");
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const maxBarcodeCount = useMemo(
    () => Math.max(...stats.barcode_type_breakdown.map((item) => item.count), 1),
    [stats.barcode_type_breakdown],
  );
  const qrVsBarcodeTotal = stats.total_qr_codes_generated + stats.total_barcodes_generated;
  const qrPercent = qrVsBarcodeTotal > 0 ? (stats.total_qr_codes_generated / qrVsBarcodeTotal) * 100 : 0;
  const barcodePercent = qrVsBarcodeTotal > 0 ? (stats.total_barcodes_generated / qrVsBarcodeTotal) * 100 : 0;
  const donutRadius = 42;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const qrSegmentLength = donutCircumference * (qrPercent / 100);
  const barcodeSegmentLength = donutCircumference * (barcodePercent / 100);

  const clearAuthAndRedirect = () => {
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("token_type");
    window.localStorage.removeItem("user");
    window.sessionStorage.removeItem("access_token");
    window.sessionStorage.removeItem("token_type");
    window.sessionStorage.removeItem("user");
    navigate("/");
  };

  const formatCreatedDate = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "-";
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day % 100 !== 11
        ? "st"
        : day % 10 === 2 && day % 100 !== 12
          ? "nd"
          : day % 10 === 3 && day % 100 !== 13
            ? "rd"
            : "th";
    const month = date.toLocaleDateString(undefined, { month: "short" });
    return `${day}${suffix} ${month}`;
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!apiBaseUrl || !token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          clearAuthAndRedirect();
          return;
        }

        if (!response.ok) {
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setStats({
          total_users: data.total_users ?? 0,
          total_codes_generated: data.total_codes_generated ?? 0,
          total_admins: data.total_admins ?? 0,
          total_regular_users: data.total_regular_users ?? 0,
          total_qr_codes_generated: data.total_qr_codes_generated ?? 0,
          total_barcodes_generated: data.total_barcodes_generated ?? 0,
          barcode_type_breakdown: Array.isArray(data.barcode_type_breakdown) ? data.barcode_type_breakdown : [],
        });
        setChartRefreshKey((prev) => prev + 1);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [apiBaseUrl, token]);

  useEffect(() => {
    const loadUsers = async () => {
      if (!apiBaseUrl || !token) {
        setUsersLoading(false);
        return;
      }

      setUsersLoading(true);
      setUsersError("");
      try {
        const response = await fetch(`${apiBaseUrl}/admin/users?limit=200&offset=0`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          clearAuthAndRedirect();
          return;
        }
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.detail || "Could not load users.");
        }
        const data = await response.json();
        setUsers(Array.isArray(data) ? data.filter((item) => item.is_active) : []);
      } catch (err) {
        setUsersError(err.message || "Could not load users.");
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, [apiBaseUrl, token]);

  const handleNewUserChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const createUser = async () => {
    if (!apiBaseUrl) {
      setAddUserError("Missing API URL.");
      return;
    }
    if (!newUser.first_name.trim() || !newUser.last_name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      setAddUserError("All fields are required.");
      return;
    }

    setAddUserError("");
    setIsAddingUser(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: newUser.first_name.trim(),
          last_name: newUser.last_name.trim(),
          email: newUser.email.trim(),
          password: newUser.password,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || "Could not create user.");
      }

      setShowAddUser(false);
      setNewUser({ first_name: "", last_name: "", email: "", password: "" });

      const usersResponse = await fetch(`${apiBaseUrl}/admin/users?limit=200&offset=0`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(Array.isArray(usersData) ? usersData.filter((item) => item.is_active) : []);
      }
    } catch (err) {
      setAddUserError(err.message || "Could not create user.");
    } finally {
      setIsAddingUser(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!apiBaseUrl || !token) return;
    setDeletingUserId(userId);
    setUsersError("");
    try {
      const response = await fetch(`${apiBaseUrl}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: false }),
      });

      if (response.status === 401) {
        clearAuthAndRedirect();
        return;
      }
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || "Could not delete user.");
      }
      const usersResponse = await fetch(`${apiBaseUrl}/admin/users?limit=200&offset=0`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(Array.isArray(usersData) ? usersData.filter((item) => item.is_active) : []);
      } else {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      }
    } catch (err) {
      setUsersError(err.message || "Could not delete user.");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <section className="analytics-page">
      <h1>Analytics</h1>

      <div className="analytics-cards-grid">
        <article className="analytics-card">
          <p className="analytics-card-label">
            <img src={groupIcon} alt="group2" className="analytics-card-label-icon" />
            <span>Total Users</span>
          </p>
          <h2 className="analytics-card-value">{isLoading ? "--" : stats.total_users}</h2>
        </article>

        <article className="analytics-card">
          <p className="analytics-card-label">
            <img src={fileIcon} alt="file" className="analytics-card-label-icon" />
            <span>Total Codes Generated</span>
          </p>
          <h2 className="analytics-card-value">{isLoading ? "--" : stats.total_codes_generated}</h2>
        </article>

        <article className="analytics-card">
          <p className="analytics-card-label">
            <img src={userIcon} alt="user" className="analytics-card-label-icon" />
            <span>Admin / Users</span>
          </p>
          <h2 className="analytics-card-value">{isLoading ? "-- / --" : `${stats.total_admins} / ${stats.total_regular_users}`}</h2>
        </article>

        <article className="analytics-card analytics-actions-card">
          <button type="button" className="analytics-action-btn analytics-action-btn-primary" onClick={() => navigate("/admin/qrcode")}>
            <img className="analytics-action-icon" src={qrCode} alt="qr-code" />
            <span>Create QR Code</span>
          </button>
          <button type="button" className="analytics-action-btn analytics-action-btn-secondary" onClick={() => navigate("/admin/barcode")}>
            <img className="analytics-action-icon" src={barcodeScan} alt="barcode-scan" />
            <span>Create Barcode</span>
          </button>
        </article>
      </div>
      <section className="analytics-charts-grid">
        <div className="analytics-barchat-types analytics-chart-card">
          <div className="analytics-chart-header">
            <h2>Barcode Types Generated</h2>
          </div>
          {isLoading ? (
            <p className="analytics-chart-empty">Loading chart...</p>
          ) : stats.barcode_type_breakdown.length === 0 ? (
            <p className="analytics-chart-empty">No barcode data yet.</p>
          ) : (
            <div className="analytics-bar-list">
              {stats.barcode_type_breakdown.map((item) => {
                const widthPercent = (item.count / maxBarcodeCount) * 100;
                return (
                  <div key={`${chartRefreshKey}-${item.barcode_type}`} className="analytics-bar-row">
                    <div className="analytics-bar-label">{item.barcode_type}</div>
                    <div className="analytics-bar-track">
                      <div className="analytics-bar-fill analytics-animate-bar" style={{ width: `${widthPercent}%` }} />
                    </div>
                    <div className="analytics-bar-value">{item.count}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="analytics-chart analytics-chart-card">
          <div className="analytics-chart-header">
            <h2>QR vs Barcode</h2>
          </div>
          {isLoading ? (
            <p className="analytics-chart-empty">Loading chart...</p>
          ) : qrVsBarcodeTotal === 0 ? (
            <p className="analytics-chart-empty">No code data yet.</p>
          ) : (
            <>
              <div
                key={`donut-${chartRefreshKey}`}
                className="analytics-donut"
                aria-label="Doughnut chart for QR versus Barcode counts"
              >
                <svg className="analytics-donut-svg" viewBox="0 0 120 120" role="img" aria-hidden="true">
                  <circle className="analytics-donut-track" cx="60" cy="60" r={donutRadius} />
                  <circle
                    className="analytics-donut-segment analytics-donut-segment-qr"
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    style={
                      {
                        "--circ": donutCircumference,
                        "--dasharray": `${qrSegmentLength} ${donutCircumference}`,
                      }
                    }
                  />
                  <circle
                    className="analytics-donut-segment analytics-donut-segment-barcode"
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    style={
                      {
                        "--circ": donutCircumference,
                        "--dasharray": `${barcodeSegmentLength} ${donutCircumference}`,
                        "--dashoffset": `-${qrSegmentLength}`,
                      }
                    }
                  />
                </svg>
                <div className="analytics-donut-center">
                  <span>{qrVsBarcodeTotal}</span>
                  <small>Total</small>
                </div>
              </div>
              <div className="analytics-donut-legend">
                <p>
                  <span className="legend-dot legend-qr" /> QR Codes: {stats.total_qr_codes_generated} ({qrPercent.toFixed(1)}%)
                </p>
                <p>
                  <span className="legend-dot legend-barcode" /> Barcodes: {stats.total_barcodes_generated} ({barcodePercent.toFixed(1)}%)
                </p>
              </div>
            </>
          )}
        </div>
      </section>
      <section className="manage-users-section">
        <div className="manage-users-header">
          <h2>Manage Users</h2>
          <button
            type="button"
            className="manage-users-add-btn"
            onClick={() => {
              setAddUserError("");
              setShowAddUser(true);
            }}
          >
            + Add User
          </button>
        </div>

        <div className="manage-users-list">
          {usersError ? <p className="manage-users-error">{usersError}</p> : null}
          {usersLoading ? <p className="manage-users-empty">Loading users...</p> : null}
          {!usersLoading && users.length === 0 ? <p className="manage-users-empty">No registered users found.</p> : null}
          {!usersLoading &&
            users.map((user) => (
              <article key={user.id} className="manage-user-row">
                <div className="manage-user-left">
                  <span className="manage-user-avatar" aria-hidden="true">
                    <img src={userIcon} alt="" />
                  </span>
                  <div className="manage-user-meta">
                    <h3>{`${user.first_name} ${user.last_name}`}</h3>
                    <p>{user.role}</p>
                  </div>
                </div>

                <div className="manage-user-middle">Date created: {formatCreatedDate(user.created_at)}</div>

                <div className="manage-user-right">
                  <button
                    type="button"
                    className="manage-user-delete-btn"
                    onClick={() => setConfirmDeleteUser(user)}
                    disabled={deletingUserId === user.id}
                  >
                    {deletingUserId === user.id ? "Deleting..." : "Delete User"}
                  </button>
                </div>
              </article>
            ))}
        </div>
      </section>

      {showAddUser ? (
        <div className="manage-users-modal-overlay" role="presentation" onClick={() => setShowAddUser(false)}>
          <div className="manage-users-modal" role="dialog" aria-modal="true" aria-label="Add user" onClick={(e) => e.stopPropagation()}>
            <h3>Add User</h3>
            <div className="manage-users-modal-grid">
              <input name="first_name" type="text" placeholder="First name" value={newUser.first_name} onChange={handleNewUserChange} />
              <input name="last_name" type="text" placeholder="Last name" value={newUser.last_name} onChange={handleNewUserChange} />
              <input name="email" type="email" placeholder="Email" value={newUser.email} onChange={handleNewUserChange} />
              <input name="password" type="password" placeholder="Password" value={newUser.password} onChange={handleNewUserChange} />
            </div>
            {addUserError ? <p className="manage-users-error">{addUserError}</p> : null}
            <div className="manage-users-modal-actions">
              <button type="button" className="manage-users-cancel-btn" onClick={() => setShowAddUser(false)}>
                Cancel
              </button>
              <button type="button" className="manage-users-save-btn" onClick={createUser} disabled={isAddingUser}>
                {isAddingUser ? "Adding..." : "Add User"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmDeleteUser ? (
        <div className="manage-users-modal-overlay" role="presentation" onClick={() => setConfirmDeleteUser(null)}>
          <div className="manage-users-modal manage-users-confirm-modal" role="dialog" aria-modal="true" aria-label="Delete user confirmation" onClick={(e) => e.stopPropagation()}>
            <h3>Delete User</h3>
            <p className="manage-users-confirm-text">
              Are you sure you want to delete this user?
            </p>
            <p className="manage-users-confirm-name">{`${confirmDeleteUser.first_name} ${confirmDeleteUser.last_name}`}</p>
            <div className="manage-users-modal-actions">
              <button type="button" className="manage-users-cancel-btn" onClick={() => setConfirmDeleteUser(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="manage-user-delete-btn"
                onClick={async () => {
                  const id = confirmDeleteUser.id;
                  setConfirmDeleteUser(null);
                  await deleteUser(id);
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
    
  );
};

export default Analytics;
