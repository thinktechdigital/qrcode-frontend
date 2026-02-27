import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./generatedcodescard.css";
import deleteIcon from "../assets/delete.png";
import downloadIcon from "../assets/download.png";
import editIcon from "../assets/edit.png";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm10 17-4.2-4.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

const getDefaultName = (item) => {
  const prettyType = item.code_type === "qr" ? "QR Code" : "Barcode";
  return `${prettyType} #${item.id}`;
};

const GeneratedCodesCard = () => {
  const navigate = useNavigate();
  const apiBaseUrl = useMemo(() => (import.meta.env.VITE_API_URL || "").replace(/\/$/, ""), []);
  const token = useMemo(
    () => window.localStorage.getItem("access_token") || window.sessionStorage.getItem("access_token") || "",
    [],
  );
  const [filters, setFilters] = useState({
    search: "",
    codeType: "all",
    sortBy: "most_recent",
    quantity: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [error, setError] = useState("");

  const allSelected = items.length > 0 && selectedIds.length === items.length;

  const clearAuthAndRedirect = useCallback(() => {
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("token_type");
    window.localStorage.removeItem("user");
    window.sessionStorage.removeItem("access_token");
    window.sessionStorage.removeItem("token_type");
    window.sessionStorage.removeItem("user");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();
    const loadCodes = async () => {
      if (!apiBaseUrl || !token) return;

      setIsLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          search: filters.search,
          code_type: filters.codeType,
          sort_by: filters.sortBy,
          quantity: String(filters.quantity),
        });
        const response = await fetch(`${apiBaseUrl}/codes/mine?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (response.status === 401) {
          clearAuthAndRedirect();
          return;
        }
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.detail || "Could not load generated codes.");
        }

        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
        setSelectedIds([]);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load generated codes.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCodes();
    return () => controller.abort();
  }, [apiBaseUrl, clearAuthAndRedirect, filters.codeType, filters.quantity, filters.search, filters.sortBy, token]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : items.map((item) => item.id));
  };

  const toggleOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const startEdit = (item) => {
    const current = item.project_title?.trim() || getDefaultName(item);
    setDraftName(current);
    setEditingId(item.id);
  };

  const saveEdit = async (item) => {
    const trimmed = draftName.trim();
    const title = trimmed || getDefaultName(item);

    try {
      const response = await fetch(`${apiBaseUrl}/codes/${item.id}/title`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ project_title: title }),
      });

      if (response.status === 401) {
        clearAuthAndRedirect();
        return;
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || "Could not update name.");
      }

      setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, project_title: title } : row)));
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Could not update name.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftName("");
  };

  const downloadCode = (item) => {
    const link = document.createElement("a");
    link.href = item.image_url;
    const extension = item.image_url.startsWith("data:image/svg+xml") ? "svg" : "png";
    const displayName = item.project_title?.trim() || getDefaultName(item);
    link.download = `${displayName.replace(/\s+/g, "_")}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteCode = async (id) => {
    if (!apiBaseUrl || !token) return;
    try {
      const response = await fetch(`${apiBaseUrl}/codes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        clearAuthAndRedirect();
        return;
      }
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || "Delete failed.");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((v) => v !== id));
    } catch (err) {
      setError(err.message || "Delete failed.");
    }
  };

  const downloadSelected = () => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id));
    selectedItems.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.image_url;
      const extension = item.image_url.startsWith("data:image/svg+xml") ? "svg" : "png";
      const displayName = item.project_title?.trim() || getDefaultName(item);
      link.download = `${displayName.replace(/\s+/g, "_")}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const deleteSelected = async () => {
    if (!apiBaseUrl || !token || selectedIds.length === 0) return;
    try {
      const responses = await Promise.all(
        selectedIds.map((id) =>
          fetch(`${apiBaseUrl}/codes/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );

      if (responses.some((response) => response.status === 401)) {
        clearAuthAndRedirect();
        return;
      }

      const failed = responses.find((response) => !response.ok);
      if (failed) {
        const payload = await failed.json().catch(() => ({}));
        throw new Error(payload.detail || "Could not delete all selected codes.");
      }

      setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    } catch (err) {
      setError(err.message || "Could not delete selected codes.");
    }
  };

  return (
    <section className="generated-codes">
      <div className="generated-filters">
        <div className="filter-group filter-search">
          <label htmlFor="search">My Generated Codes</label>
          <div className="search-box">
            <SearchIcon />
            <input id="search" name="search" type="text" placeholder="Search..." value={filters.search} onChange={handleFilterChange} />
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="codeType">Code Type</label>
          <select id="codeType" name="codeType" value={filters.codeType} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="qr">QR Code</option>
            <option value="barcode">Barcode</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select id="sortBy" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="most_recent">Most Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="quantity">Quantity</label>
          <select id="quantity" name="quantity" value={filters.quantity} onChange={handleFilterChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="generated-select-row">
        <label className="select-all-label">
          <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
          <span>Select All</span>
        </label>
      </div>

      {error ? <p className="generated-error">{error}</p> : null}
      {isLoading ? <p className="generated-empty">Loading codes...</p> : null}
      {!isLoading && items.length === 0 ? <p className="generated-empty">No generated codes found.</p> : null}

      <div className="generated-list">
        {items.map((item) => {
          const displayName = item.project_title?.trim() || getDefaultName(item);
          const typeLabel = item.code_type === "qr" ? "QR Code" : "Barcode";
          const isEditing = editingId === item.id;
          return (
            <article key={item.id} className="generated-card">
              <div className="card-left">
                <label className="row-check">
                  <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleOne(item.id)} />
                </label>
                <img src={item.image_url} alt={displayName} className="code-thumb" />
                <div className="card-main">
                  <span className={`type-pill ${item.code_type === "qr" ? "qr" : "barcode"}`}>{typeLabel}</span>
                  <div className="name-row">
                    {isEditing ? (
                      <input
                        className="name-input"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onBlur={() => saveEdit(item)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(item);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                      />
                    ) : (
                      <h3>{displayName}</h3>
                    )}
                    <button type="button" className="icon-btn edit-btn" onClick={() => startEdit(item)} aria-label="Edit code name">
                      <img className="mycodeicon-edit" src={editIcon} alt="edit" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-meta">
                <p className="created-date">Date Created: {formatDate(item.created_at)}</p>
              </div>

              <div className="card-actions">
                <button type="button" className="download-btn" onClick={() => downloadCode(item)}>
                  <img className="mycodeicon-download" src={downloadIcon} alt="download" />
                  <span>Download</span>
                </button>
                <button type="button" className="icon-btn delete-btn" onClick={() => deleteCode(item.id)} aria-label="Delete code">
                  <img className="mycodeicon-delete" src={deleteIcon} alt="delete" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {selectedIds.length > 0 ? (
        <div className="bulk-actions-bar">
          <span>{selectedIds.length} selected</span>
          <div className="bulk-actions-buttons">
            <button type="button" className="bulk-btn bulk-delete" onClick={deleteSelected}>
              Delete
            </button>
            <button type="button" className="bulk-btn bulk-download" onClick={downloadSelected}>
              Download
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default GeneratedCodesCard;
