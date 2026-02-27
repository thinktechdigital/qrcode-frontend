import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import iphoneMockup from "../assets/iphone17.png";
import "./barcode.css";

const buildDownloadName = (projectTitle, fallbackBase, extension) => {
  const base = (projectTitle || "").trim() || fallbackBase;
  const safeBase = base.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_");
  return `${safeBase}.${extension}`;
};

const Barcode = () => {
  const navigate = useNavigate();
  const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const [types, setTypes] = useState(["code128"]);
  const [form, setForm] = useState({
    project_title: "",
    content: "",
    barcode_type: "code128",
    file_format: "png",
    module_width: 0.2,
    module_height: 15,
    quiet_zone: 6.5,
    font_size: 10,
    text_distance: 5,
    write_text: true,
    foreground: "#000000",
    background: "#ffffff",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [downloadName, setDownloadName] = useState("barcode.png");

  const token = useMemo(
    () => window.localStorage.getItem("access_token") || window.sessionStorage.getItem("access_token") || "",
    [],
  );

  useEffect(() => {
    const loadTypes = async () => {
      if (!apiBaseUrl) return;
      try {
        const response = await fetch(`${apiBaseUrl}/codes/barcode/types`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data.types) && data.types.length > 0) {
          setTypes(data.types);
          setForm((prev) => ({
            ...prev,
            barcode_type: data.types.includes(prev.barcode_type) ? prev.barcode_type : data.types[0],
          }));
        }
      } catch {
        // Keep fallback types list.
      }
    };

    loadTypes();
  }, [apiBaseUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const generateBarcode = async () => {
    if (!apiBaseUrl) {
      setError("Missing VITE_API_URL in Frontend/.env.");
      return;
    }
    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }
    if (!form.content.trim()) {
      setError("Content is required.");
      return;
    }
    if (!form.project_title.trim()) {
      setError("Project Title is required.");
      return;
    }

    setError("");
    setIsCreating(true);

    try {
      const response = await fetch(`${apiBaseUrl}/codes/barcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: form.content.trim(),
          project_title: form.project_title.trim(),
          barcode_type: form.barcode_type,
          file_format: form.file_format,
          module_width: form.module_width,
          module_height: form.module_height,
          quiet_zone: form.quiet_zone,
          font_size: form.font_size,
          text_distance: form.text_distance,
          write_text: form.write_text,
          foreground: form.foreground,
          background: form.background,
        }),
      });

      if (response.status === 401) {
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("token_type");
        window.localStorage.removeItem("user");
        window.sessionStorage.removeItem("access_token");
        window.sessionStorage.removeItem("token_type");
        window.sessionStorage.removeItem("user");
        navigate("/");
        return;
      }

      if (!response.ok) {
        const apiError = await response.json().catch(() => ({}));
        throw new Error(apiError.detail || "Barcode generation failed.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(objectUrl);
      setDownloadName(buildDownloadName(form.project_title, form.barcode_type, form.file_format));
    } catch (err) {
      setError(err.message || "Something went wrong while creating barcode.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="barcode-page">
      <div className="barcode-builder">
        <div className="barcode-panel barcode-controls">
          <label className="barcode-project-title-label" htmlFor="project_title">1. Project Title</label>
          <input className="barcode-project-title-label-input"
            id="project_title"
            name="project_title"
            type="text"
            value={form.project_title}
            onChange={handleChange}
            placeholder="Enter project title"
            maxLength={255}
            required
          />

          <h2 className="barcode-group-heading" >2. Barcode Parameters</h2>

          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Type barcode content"
            rows={3}
          />

          <div className="barcode-grid barcode-grid-two">
            <div>
              <label htmlFor="barcode_type">Barcode Type</label>
              <select id="barcode_type" name="barcode_type" value={form.barcode_type} onChange={handleChange}>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="file_format">Download Format</label>
              <select id="file_format" name="file_format" value={form.file_format} onChange={handleChange}>
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </select>
            </div>
          </div>

          <div className="barcode-grid barcode-grid-four">
            <div>
              <label htmlFor="module_width">Module Width</label>
              <input id="module_width" name="module_width" type="number" step="0.1" min={0.1} max={10} value={form.module_width} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="module_height">Module Height</label>
              <input id="module_height" name="module_height" type="number" step="0.5" min={1} max={200} value={form.module_height} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="quiet_zone">Quiet Zone</label>
              <input id="quiet_zone" name="quiet_zone" type="number" step="0.5" min={0} max={100} value={form.quiet_zone} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="font_size">Font Size</label>
              <input id="font_size" name="font_size" type="number" min={0} max={72} value={form.font_size} onChange={handleChange} />
            </div>
          </div>

          <div className="barcode-grid barcode-grid-two">
            <div>
              <label htmlFor="text_distance">Text Distance</label>
              <input id="text_distance" name="text_distance" type="number" step="0.5" min={0} max={100} value={form.text_distance} onChange={handleChange} />
            </div>
            <div className="barcode-checkbox-wrap">
              <label htmlFor="write_text">Show Text</label>
              <input id="write_text" name="write_text" type="checkbox" checked={form.write_text} onChange={handleChange} />
            </div>
          </div>

          <div className="barcode-grid barcode-grid-two">
            <div>
              <label htmlFor="foreground">Bar Color</label>
              <input id="foreground" name="foreground" type="color" value={form.foreground} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="background">Background Color</label>
              <input id="background" name="background" type="color" value={form.background} onChange={handleChange} />
            </div>
          </div>

          {error ? <p className="barcode-error">{error}</p> : null}
        </div>

        <div className="barcode-panel barcode-preview">
          <div className="barcode-phone-shell">
            <img src={iphoneMockup} alt="iPhone mockup" className="barcode-phone-bg" />
            <div className="barcode-phone-screen">
              {previewUrl ? (
                <img src={previewUrl} alt="Generated barcode preview" className="barcode-preview-image" />
              ) : (
                <span className="barcode-placeholder">Generated barcode appears here</span>
              )}
            </div>
          </div>

          <div className="barcode-actions">
            <button type="button" className="barcode-btn barcode-btn-primary" onClick={generateBarcode} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Barcode"}
            </button>
            <button type="button" className="barcode-btn barcode-btn-secondary" onClick={handleDownload} disabled={!previewUrl}>
              Download
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Barcode;
