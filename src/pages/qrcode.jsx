import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import iphoneMockup from "../assets/t1.png";
import pdfPreviewImage from "../assets/pdf.png";
import "./qrcode.css";

const ChevronIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SectionIcon = ({ type }) => {
  if (type === "design") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 8h8v8H8z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  if (type === "personal") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="3.5" width="16" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 15.5c.8-1.5 2-2.2 3.5-2.2s2.7.7 3.5 2.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "contact") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8.2v.2M12 11v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
};

const LivePreviewIcon = ({ type }) => {
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.3 11.3 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.9 21 3 13.1 3 3.9a1 1 0 0 1 1-1h3.4a1 1 0 0 1 1 1 11.3 11.3 0 0 0 .56 3.5 1 1 0 0 1-.25 1L6.6 10.8Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="m5 8 7 5 7-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (type === "web") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (type === "location") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
};

const ActionIcon = ({ type }) => {
  if (type === "preview") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  if (type === "qr") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="14" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M14 14h3v3h-3zM20 14h1v1h-1zM18 17h3v4h-4v-2h1z" fill="currentColor" />
      </svg>
    );
  }
  if (type === "save") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h11l3 3v13H5V4Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 4v6h8V4M8 20v-5h8v5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};

const buildDownloadName = (projectTitle, fallbackBase, extension) => {
  const base = (projectTitle || "").trim() || fallbackBase;
  const safeBase = base.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_");
  return `${safeBase}.${extension}`;
};

const Qrcode = () => {
  const navigate = useNavigate();
  const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const [form, setForm] = useState({
    project_title: "",
    content_type: "url",
    content: "",
    full_name: "",
    job_title: "",
    company: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    whatsapp: "",
    theme_color: "#0076c9",
    pdf_title: "",
    pdf_description: "",
    pdf_company_name: "",
    pdf_website_url: "",
    pdf_button_label: "Open PDF",
    pdf_theme_color: "#58c2db",
    pdf_file_url: "",
    file_format: "png",
    scale: 5,
    border: 1,
    dark_color: "#000000",
    light_color: "#ffffff",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [contactPreviewMode, setContactPreviewMode] = useState("vcard");
  const [pdfPreviewMode, setPdfPreviewMode] = useState("preview");
  const [savedVcardId, setSavedVcardId] = useState(null);
  const [savedVcardSlug, setSavedVcardSlug] = useState("");
  const [hasUnsavedVCardChanges, setHasUnsavedVCardChanges] = useState(false);
  const [savedPdfLinkId, setSavedPdfLinkId] = useState(null);
  const [savedPdfSlug, setSavedPdfSlug] = useState("");
  const [hasUnsavedPdfChanges, setHasUnsavedPdfChanges] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const phoneScreenRef = useRef(null);
  const [downloadName, setDownloadName] = useState("qrcode.png");
  const [sectionsOpen, setSectionsOpen] = useState({
    projectTitle: false,
    content: false,
    design: false,
    personalInfo: false,
    contactDetails: false,
    location: false,
    downloadFormat: false,
    style: false,
  });

  const token = useMemo(
    () => window.localStorage.getItem("access_token") || window.sessionStorage.getItem("access_token") || "",
    [],
  );

  const vcardFieldNames = useMemo(
    () => new Set([
      "full_name",
      "job_title",
      "company",
      "phone",
      "email",
      "website",
      "address",
      "city",
      "state",
      "country",
      "linkedin",
      "twitter",
      "instagram",
      "whatsapp",
      "theme_color",
    ]),
    [],
  );

  const pdfFieldNames = useMemo(
    () => new Set([
      "project_title",
      "pdf_title",
      "pdf_description",
      "pdf_company_name",
      "pdf_website_url",
      "pdf_button_label",
      "pdf_theme_color",
    ]),
    [],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (form.content_type === "contact_card" && phoneScreenRef.current) {
      phoneScreenRef.current.scrollTop = 0;
    }
  }, [form.content_type]);

  useEffect(() => {
    if (form.content_type === "contact_card") {
      setContactPreviewMode("vcard");
    }
  }, [form.content_type]);

  useEffect(() => {
    if (form.content_type === "pdf") {
      setPdfPreviewMode("preview");
    }
  }, [form.content_type]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    if (form.content_type === "contact_card" && savedVcardId && vcardFieldNames.has(name)) {
      setHasUnsavedVCardChanges(true);
    }
    if (form.content_type === "pdf" && savedPdfLinkId && pdfFieldNames.has(name)) {
      setHasUnsavedPdfChanges(true);
    }
  };

  const handlePdfFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedPdfFile(file);
    if (file) {
      setForm((prev) => ({
        ...prev,
        pdf_file_url: file.name,
      }));
      if (form.content_type === "pdf" && savedPdfLinkId) {
        setHasUnsavedPdfChanges(true);
      }
    }
  };

  const toggleSection = (key) => {
    setSectionsOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const generateQr = async () => {
    if (!apiBaseUrl) {
      setError("Missing VITE_API_URL in Frontend/.env.");
      return;
    }
    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }
    if (!form.project_title.trim()) {
      setError("Project Title is required.");
      return;
    }
    if (form.content_type === "contact_card" && !form.full_name.trim()) {
      setError("Full Name is required for contact card.");
      return;
    }
    if (form.content_type === "pdf" && !form.pdf_title.trim()) {
      setError("PDF Title is required.");
      return;
    }
    if (form.content_type === "pdf" && !savedPdfLinkId && !selectedPdfFile) {
      setError("PDF file is required.");
      return;
    }
    if (form.content_type !== "contact_card" && form.content_type !== "pdf" && !form.content.trim()) {
      setError("Content is required.");
      return;
    }

    setError("");
    setIsCreating(true);
    try {
      let qrContent = form.content.trim();
      if (form.content_type === "contact_card") {
        if (!savedVcardId || !savedVcardSlug) {
          const vcardResponse = await fetch(`${apiBaseUrl}/vcards`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              full_name: form.full_name.trim(),
              job_title: form.job_title.trim(),
              company: form.company.trim(),
              phone: form.phone.trim(),
              email: form.email.trim() || null,
              website: form.website.trim(),
              address: form.address.trim(),
              city: form.city.trim(),
              state: form.state.trim(),
              country: form.country.trim(),
              linkedin: form.linkedin.trim(),
              twitter: form.twitter.trim(),
              instagram: form.instagram.trim(),
              whatsapp: form.whatsapp.trim(),
              theme_color: form.theme_color,
            }),
          });
          if (vcardResponse.status === 401) {
            window.localStorage.removeItem("access_token");
            window.localStorage.removeItem("token_type");
            window.localStorage.removeItem("user");
            window.sessionStorage.removeItem("access_token");
            window.sessionStorage.removeItem("token_type");
            window.sessionStorage.removeItem("user");
            navigate("/");
            return;
          }
          if (!vcardResponse.ok) {
            const vcardError = await vcardResponse.json().catch(() => ({}));
            throw new Error(vcardError.detail || "Contact card creation failed.");
          }
          const vcardData = await vcardResponse.json();
          setSavedVcardId(vcardData.id);
          setSavedVcardSlug(vcardData.slug);
          setHasUnsavedVCardChanges(false);
          qrContent = `${window.location.origin}/c/${vcardData.slug}`;
        } else {
          qrContent = `${window.location.origin}/c/${savedVcardSlug}`;
        }
      }
      if (form.content_type === "pdf") {
        if (!savedPdfLinkId || !savedPdfSlug) {
          const pdfFormData = new FormData();
          pdfFormData.append("project_title", form.project_title.trim());
          pdfFormData.append("pdf_title", form.pdf_title.trim());
          pdfFormData.append("description", form.pdf_description.trim());
          pdfFormData.append("company_name", form.pdf_company_name.trim());
          pdfFormData.append("website_url", form.pdf_website_url.trim());
          pdfFormData.append("button_label", form.pdf_button_label.trim() || "Open PDF");
          pdfFormData.append("theme_color", form.pdf_theme_color || "#58c2db");
          if (selectedPdfFile) {
            pdfFormData.append("pdf_file", selectedPdfFile);
          }
          const pdfResponse = await fetch(`${apiBaseUrl}/pdf-links`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: pdfFormData,
          });
          if (pdfResponse.status === 401) {
            window.localStorage.removeItem("access_token");
            window.localStorage.removeItem("token_type");
            window.localStorage.removeItem("user");
            window.sessionStorage.removeItem("access_token");
            window.sessionStorage.removeItem("token_type");
            window.sessionStorage.removeItem("user");
            navigate("/");
            return;
          }
          if (!pdfResponse.ok) {
            const pdfError = await pdfResponse.json().catch(() => ({}));
            throw new Error(pdfError.detail || "PDF link creation failed.");
          }
          const pdfData = await pdfResponse.json();
          setSavedPdfLinkId(pdfData.id);
          setSavedPdfSlug(pdfData.slug);
          setHasUnsavedPdfChanges(false);
          setSelectedPdfFile(null);
          qrContent = `${window.location.origin}/p/${pdfData.slug}`;
        } else {
          qrContent = `${window.location.origin}/p/${savedPdfSlug}`;
        }
      }

      const response = await fetch(`${apiBaseUrl}/codes/qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: qrContent,
          project_title: form.project_title.trim(),
          file_format: form.file_format,
          scale: form.scale,
          border: form.border,
          dark_color: form.dark_color,
          light_color: form.light_color,
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
        throw new Error(apiError.detail || "QR code generation failed.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(objectUrl);
      if (form.content_type === "contact_card") {
        setContactPreviewMode("qr");
      }
      if (form.content_type === "pdf") {
        setPdfPreviewMode("qr");
      }
      setDownloadName(buildDownloadName(form.project_title, "qrcode", form.file_format));
    } catch (err) {
      setError(err.message || "Something went wrong while creating QR code.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownload = () => {
    if (!previewUrl) {
      return;
    }
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShowVCardPreview = () => {
    setContactPreviewMode("vcard");
  };

  const handleShowQrPreview = () => {
    if (!previewUrl && !isCreating) {
      generateQr();
      return;
    }
    setError("");
    setContactPreviewMode("qr");
  };

  const handleShowPdfPreview = () => {
    setPdfPreviewMode("preview");
  };

  const handleShowPdfQr = () => {
    if (!previewUrl && !isCreating) {
      generateQr();
      return;
    }
    setError("");
    setPdfPreviewMode("qr");
  };

  const handleSaveVCard = async () => {
    if (!savedVcardId) {
      setError("Create QR Code first so we can save updates to that card.");
      return;
    }
    if (!apiBaseUrl) {
      setError("Missing VITE_API_URL in Frontend/.env.");
      return;
    }
    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }
    if (!form.full_name.trim()) {
      setError("Full Name is required for contact card.");
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      const response = await fetch(`${apiBaseUrl}/vcards/${savedVcardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          job_title: form.job_title.trim(),
          company: form.company.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          website: form.website.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
          linkedin: form.linkedin.trim(),
          twitter: form.twitter.trim(),
          instagram: form.instagram.trim(),
          whatsapp: form.whatsapp.trim(),
          theme_color: form.theme_color,
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
        throw new Error(apiError.detail || "Could not save contact card updates.");
      }

      const updated = await response.json();
      if (updated?.slug) {
        setSavedVcardSlug(updated.slug);
      }
      setHasUnsavedVCardChanges(false);
    } catch (err) {
      setError(err.message || "Could not save contact card updates.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePdfLink = async () => {
    if (!savedPdfLinkId) {
      setError("Create QR Code first so we can save updates to that PDF link.");
      return;
    }
    if (!apiBaseUrl) {
      setError("Missing VITE_API_URL in Frontend/.env.");
      return;
    }
    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }
    if (!form.pdf_title.trim()) {
      setError("PDF Title is required.");
      return;
    }

    setError("");
    setIsSavingPdf(true);
    try {
      const pdfFormData = new FormData();
      pdfFormData.append("project_title", form.project_title.trim());
      pdfFormData.append("pdf_title", form.pdf_title.trim());
      pdfFormData.append("description", form.pdf_description.trim());
      pdfFormData.append("company_name", form.pdf_company_name.trim());
      pdfFormData.append("website_url", form.pdf_website_url.trim());
      pdfFormData.append("button_label", form.pdf_button_label.trim() || "Open PDF");
      pdfFormData.append("theme_color", form.pdf_theme_color || "#58c2db");
      if (selectedPdfFile) {
        pdfFormData.append("pdf_file", selectedPdfFile);
      }

      const response = await fetch(`${apiBaseUrl}/pdf-links/${savedPdfLinkId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: pdfFormData,
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
        throw new Error(apiError.detail || "Could not save PDF link updates.");
      }

      const updated = await response.json();
      if (updated?.slug) {
        setSavedPdfSlug(updated.slug);
      }
      setHasUnsavedPdfChanges(false);
      setSelectedPdfFile(null);
    } catch (err) {
      setError(err.message || "Could not save PDF link updates.");
    } finally {
      setIsSavingPdf(false);
    }
  };

  return (
    <section className="qr-page">
      <div className="qr-builder">
        <div className="qr-panel qr-controls">
          <h2 className="qr-group-heading">1. Project title</h2>
          <div className="qr-accordion-item qr-section-card">
            <button type="button" className="qr-accordion-toggle qr-section-toggle" onClick={() => toggleSection("projectTitle")}>
              <span>Project Title</span>
              <span className={`qr-accordion-chevron ${sectionsOpen.projectTitle ? "open" : ""}`}>
                <ChevronIcon />
              </span>
            </button>
            <div className={`qr-accordion-panel-wrap ${sectionsOpen.projectTitle ? "open" : ""}`}>
              <div className="qr-accordion-panel">
                <input
                  id="project_title"
                  className="qrcode-project-title-label-input"
                  name="project_title"
                  type="text"
                  value={form.project_title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  maxLength={255}
                  required
                />
              </div>
            </div>
          </div>

          <h2 className="qr-group-heading">2. Add Content to your QR Code</h2>
          <div className="qr-accordion-item qr-section-card">
            <button type="button" className="qr-accordion-toggle qr-section-toggle" onClick={() => toggleSection("content")}>
              <span>Content</span>
              <span className={`qr-accordion-chevron ${sectionsOpen.content ? "open" : ""}`}>
                <ChevronIcon />
              </span>
            </button>
            <div className={`qr-accordion-panel-wrap ${sectionsOpen.content ? "open" : ""}`}>
              <div className="qr-accordion-panel">
                <div className="content-type-options">
                  <label className="content-type-option" htmlFor="content_type_url">
                    <input
                      id="content_type_url"
                      type="radio"
                      name="content_type"
                      value="url"
                      checked={form.content_type === "url"}
                      onChange={handleChange}
                    />
                    <span>URL</span>
                  </label>
                  <label className="content-type-option" htmlFor="content_type_text">
                    <input
                      id="content_type_text"
                      type="radio"
                      name="content_type"
                      value="text"
                      checked={form.content_type === "text"}
                      onChange={handleChange}
                    />
                    <span>Text</span>
                  </label>
                  <label className="content-type-option" htmlFor="content_type_contact_card">
                    <input
                      id="content_type_contact_card"
                      type="radio"
                      name="content_type"
                      value="contact_card"
                      checked={form.content_type === "contact_card"}
                      onChange={handleChange}
                    />
                    <span>Contact Card</span>
                  </label>
                  <label className="content-type-option" htmlFor="content_type_pdf">
                    <input
                      id="content_type_pdf"
                      type="radio"
                      name="content_type"
                      value="pdf"
                      checked={form.content_type === "pdf"}
                      onChange={handleChange}
                    />
                    <span>PDF</span>
                  </label>
                </div>
                {form.content_type === "url" ? (
                  <input
                    id="content"
                    name="content"
                    type="url"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="https://www.yoururl.com"
                  />
                ) : form.content_type === "text" ? (
                  <textarea
                    id="content"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Type your text here"
                    rows={4}
                  />
                ) : form.content_type === "pdf" ? (
                  <div className="qr-grid qr-grid-two">
                    <div className="qr-grid-full">
                      <label htmlFor="pdf_title">PDF Title</label>
                      <input id="pdf_title" name="pdf_title" type="text" value={form.pdf_title} onChange={handleChange} placeholder="Company Profile" />
                    </div>
                    <div className="qr-grid-full">
                      <label htmlFor="pdf_file">PDF File</label>
                      <input id="pdf_file" name="pdf_file" type="file" accept="application/pdf" onChange={handlePdfFileChange} />
                      {form.pdf_file_url ? <small>{form.pdf_file_url}</small> : null}
                    </div>
                    <div className="qr-grid-full">
                      <label htmlFor="pdf_description">Description</label>
                      <textarea id="pdf_description" name="pdf_description" value={form.pdf_description} onChange={handleChange} placeholder="Short description..." rows={3} />
                    </div>
                    <div>
                      <label htmlFor="pdf_company_name">Company Name</label>
                      <input id="pdf_company_name" name="pdf_company_name" type="text" value={form.pdf_company_name} onChange={handleChange} placeholder="Company name" />
                    </div>
                    <div>
                      <label htmlFor="pdf_button_label">Button Label</label>
                      <input id="pdf_button_label" name="pdf_button_label" type="text" value={form.pdf_button_label} onChange={handleChange} placeholder="Open PDF" />
                    </div>
                    <div>
                      <label htmlFor="pdf_theme_color">Theme Color</label>
                      <input id="pdf_theme_color" name="pdf_theme_color" type="color" value={form.pdf_theme_color} onChange={handleChange} />
                    </div>
                    <div className="qr-grid-full">
                      <label htmlFor="pdf_website_url">Website</label>
                      <input id="pdf_website_url" name="pdf_website_url" type="url" value={form.pdf_website_url} onChange={handleChange} placeholder="https://example.com" />
                    </div>
                  </div>
                ) : (
                  <div className="vcard-sections">
                    <div className="qr-accordion-item vcard-accordion-item">
                      <button type="button" className="qr-accordion-toggle vcard-accordion-toggle" onClick={() => toggleSection("personalInfo")}>
                        <span className="vcard-header-left">
                          <span className="vcard-header-icon"><SectionIcon type="personal" /></span>
                          <span>
                            <strong>Personal Information</strong>
                            <small>Fill in your information.</small>
                          </span>
                        </span>
                        <span className={`qr-accordion-chevron vcard-chevron ${sectionsOpen.personalInfo ? "open" : ""}`}>
                          <ChevronIcon />
                        </span>
                      </button>
                      {sectionsOpen.personalInfo ? (
                        <div className="qr-accordion-panel">
                          <div className="qr-grid qr-grid-two">
                            <div className="qr-grid-full">
                              <label htmlFor="full_name">Full Name</label>
                              <input id="full_name" name="full_name" type="text" value={form.full_name} onChange={handleChange} placeholder="John Doe" />
                            </div>
                            <div>
                              <label htmlFor="job_title">Job Title</label>
                              <input id="job_title" name="job_title" type="text" value={form.job_title} onChange={handleChange} placeholder="Chief Executive Officer" />
                            </div>
                            <div>
                              <label htmlFor="company">Company</label>
                              <input id="company" name="company" type="text" value={form.company} onChange={handleChange} placeholder="Google Inc." />
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="qr-accordion-item vcard-accordion-item">
                      <button type="button" className="qr-accordion-toggle vcard-accordion-toggle" onClick={() => toggleSection("contactDetails")}>
                        <span className="vcard-header-left">
                          <span className="vcard-header-icon"><SectionIcon type="contact" /></span>
                          <span>
                            <strong>Contact Details</strong>
                            <small>Provide the contact information to display.</small>
                          </span>
                        </span>
                        <span className={`qr-accordion-chevron vcard-chevron ${sectionsOpen.contactDetails ? "open" : ""}`}>
                          <ChevronIcon />
                        </span>
                      </button>
                      {sectionsOpen.contactDetails ? (
                        <div className="qr-accordion-panel">
                          <div className="qr-grid qr-grid-two">
                            <div>
                              <label htmlFor="phone">Phone</label>
                              <input id="phone" name="phone" type="text" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" />
                            </div>
                            <div>
                              <label htmlFor="email">Email</label>
                              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                            </div>
                            <div className="qr-grid-full">
                              <label htmlFor="website">Website</label>
                              <input id="website" name="website" type="url" value={form.website} onChange={handleChange} placeholder="https://example.com" />
                            </div>
                            <div>
                              <label htmlFor="linkedin">LinkedIn</label>
                              <input id="linkedin" name="linkedin" type="url" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
                            </div>
                            <div>
                              <label htmlFor="twitter">Twitter/X</label>
                              <input id="twitter" name="twitter" type="url" value={form.twitter} onChange={handleChange} placeholder="https://x.com/username" />
                            </div>
                            <div>
                              <label htmlFor="instagram">Instagram</label>
                              <input id="instagram" name="instagram" type="url" value={form.instagram} onChange={handleChange} placeholder="https://instagram.com/username" />
                            </div>
                            <div>
                              <label htmlFor="whatsapp">WhatsApp</label>
                              <input id="whatsapp" name="whatsapp" type="url" value={form.whatsapp} onChange={handleChange} placeholder="https://wa.me/1234567890" />
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="qr-accordion-item vcard-accordion-item">
                      <button type="button" className="qr-accordion-toggle vcard-accordion-toggle" onClick={() => toggleSection("location")}>
                        <span className="vcard-header-left">
                          <span className="vcard-header-icon"><SectionIcon type="location" /></span>
                          <span>
                            <strong>Location</strong>
                            <small>Provide your address and location information.</small>
                          </span>
                        </span>
                        <span className={`qr-accordion-chevron vcard-chevron ${sectionsOpen.location ? "open" : ""}`}>
                          <ChevronIcon />
                        </span>
                      </button>
                      {sectionsOpen.location ? (
                        <div className="qr-accordion-panel">
                          <div className="qr-grid qr-grid-two">
                            <div className="qr-grid-full">
                              <label htmlFor="address">Address</label>
                              <input id="address" name="address" type="text" value={form.address} onChange={handleChange} placeholder="Street address" />
                            </div>
                            <div>
                              <label htmlFor="city">City</label>
                              <input id="city" name="city" type="text" value={form.city} onChange={handleChange} placeholder="Kasoa" />
                            </div>
                            <div>
                              <label htmlFor="state">State</label>
                              <input id="state" name="state" type="text" value={form.state} onChange={handleChange} placeholder="Central Region" />
                            </div>
                            <div>
                              <label htmlFor="country">Country</label>
                              <input id="country" name="country" type="text" value={form.country} onChange={handleChange} placeholder="Ghana" />
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="qr-accordion-item vcard-accordion-item">
                      <button type="button" className="qr-accordion-toggle vcard-accordion-toggle" onClick={() => toggleSection("design")}>
                        <span className="vcard-header-left">
                          <span className="vcard-header-icon"><SectionIcon type="design" /></span>
                          <span>
                            <strong>Design</strong>
                            <small>Choose a color theme for your page.</small>
                          </span>
                        </span>
                        <span className={`qr-accordion-chevron vcard-chevron ${sectionsOpen.design ? "open" : ""}`}>
                          <ChevronIcon />
                        </span>
                      </button>
                      {sectionsOpen.design ? (
                        <div className="qr-accordion-panel">
                          <label htmlFor="theme_color">Theme Color</label>
                          <input id="theme_color" name="theme_color" type="color" value={form.theme_color} onChange={handleChange} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <h2 className="qr-group-heading">3. Design your QR Code</h2>

          <div className="qr-accordion-item qr-section-card">
            <button type="button" className="qr-accordion-toggle qr-section-toggle" onClick={() => toggleSection("style")}>
              <span>Style</span>
              <span className={`qr-accordion-chevron ${sectionsOpen.style ? "open" : ""}`}>
                <ChevronIcon />
              </span>
            </button>
            <div className={`qr-accordion-panel-wrap ${sectionsOpen.style ? "open" : ""}`}>
              <div className="qr-accordion-panel">
                <div className="qr-grid qr-grid-two">
                  <div>
                    <label htmlFor="dark_color">Dot Colour</label>
                    <input id="dark_color" name="dark_color" type="color" value={form.dark_color} onChange={handleChange} />
                  </div>

                  <div>
                    <label htmlFor="light_color">Background Color</label>
                    <input id="light_color" name="light_color" type="color" value={form.light_color} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="qr-accordion-item qr-section-card">
            <button type="button" className="qr-accordion-toggle qr-section-toggle" onClick={() => toggleSection("design")}>
              <span>Design</span>
              <span className={`qr-accordion-chevron ${sectionsOpen.design ? "open" : ""}`}>
                <ChevronIcon />
              </span>
            </button>
            <div className={`qr-accordion-panel-wrap ${sectionsOpen.design ? "open" : ""}`}>
              <div className="qr-accordion-panel">
                <div className="qr-grid qr-grid-two">
                  <div>
                    <label htmlFor="scale">Scale</label>
                    <input id="scale" name="scale" type="number" min={1} max={50} value={form.scale} onChange={handleChange} />
                  </div>

                  <div>
                    <label htmlFor="border">Border</label>
                    <input id="border" name="border" type="number" min={0} max={20} value={form.border} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="qr-accordion-item qr-section-card">
            <button type="button" className="qr-accordion-toggle qr-section-toggle" onClick={() => toggleSection("downloadFormat")}>
              <span>Download Format</span>
              <span className={`qr-accordion-chevron ${sectionsOpen.downloadFormat ? "open" : ""}`}>
                <ChevronIcon />
              </span>
            </button>
            <div className={`qr-accordion-panel-wrap ${sectionsOpen.downloadFormat ? "open" : ""}`}>
              <div className="qr-accordion-panel">
                <label htmlFor="file_format">Format</label>
                <select id="file_format" name="file_format" value={form.file_format} onChange={handleChange}>
                  <option value="png">PNG</option>
                  <option value="svg">SVG</option>
                </select>
              </div>
            </div>
          </div>

          {error ? <p className="qr-error">{error}</p> : null}
        </div>

        <div className="qr-panel qr-preview">
          <div className="phone-shell">
            <img src={iphoneMockup} alt="iPhone mockup" className="phone-bg" />
            <div
              ref={phoneScreenRef}
              className={`phone-screen ${form.content_type === "contact_card" && contactPreviewMode === "vcard" ? "phone-screen-scroll" : ""}`}
            >
              {form.content_type === "contact_card" && contactPreviewMode === "vcard" ? (
                <div className="vcard-live-preview" style={{ "--accent": form.theme_color || "#0076c9" }}>
                  <div className="public-vcard-hero preview-vcard-hero">
                    <h1>{form.full_name || "Full Name"}</h1>
                    <p>{form.job_title || "Job Title"}</p>
                    <div className="public-vcard-quick-actions">
                      {form.phone ? (
                        <span className="quick-action" aria-hidden="true">
                          <LivePreviewIcon type="phone" />
                        </span>
                      ) : null}
                      {form.email ? (
                        <span className="quick-action" aria-hidden="true">
                          <LivePreviewIcon type="email" />
                        </span>
                      ) : null}
                      {[form.address, form.city, form.state, form.country].some(Boolean) ? (
                        <span className="quick-action" aria-hidden="true">
                          <LivePreviewIcon type="location" />
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="public-vcard-main">
                    <div className="public-vcard-info-list">
                      {form.phone ? (
                        <div className="info-row">
                          <span className="info-icon"><LivePreviewIcon type="phone" /></span>
                          <div className="info-text">
                            <small>Personal Phone</small>
                            <p>{form.phone}</p>
                          </div>
                        </div>
                      ) : null}
                      {form.email ? (
                        <div className="info-row">
                          <span className="info-icon"><LivePreviewIcon type="email" /></span>
                          <div className="info-text">
                            <small>My Personal Email</small>
                            <p>{form.email}</p>
                          </div>
                        </div>
                      ) : null}
                      {form.website ? (
                        <div className="info-row">
                          <span className="info-icon"><LivePreviewIcon type="web" /></span>
                          <div className="info-text">
                            <small>My Website</small>
                            <p>{form.website}</p>
                          </div>
                        </div>
                      ) : null}
                      {[form.address, form.city, form.state, form.country].some(Boolean) ? (
                        <div className="info-row">
                          <span className="info-icon"><LivePreviewIcon type="location" /></span>
                          <div className="info-text">
                            <small>Location</small>
                            <p>{[form.address, form.city, form.state, form.country].filter(Boolean).join(", ")}</p>
                          </div>
                        </div>
                      ) : null}
                      {form.company || form.job_title ? (
                        <div className="info-row">
                          <span className="info-icon"><LivePreviewIcon type="work" /></span>
                          <div className="info-text">
                            <small>{form.company || "Company"}</small>
                            <p>{form.job_title || "Role"}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {(form.linkedin || form.twitter || form.instagram || form.whatsapp) ? (
                      <>
                        <h2>Find me on</h2>
                        <div className="public-vcard-socials">
                          {form.linkedin ? (
                            <div className="social-row">
                              <span>LinkedIn</span>
                              <strong>&rarr;</strong>
                            </div>
                          ) : null}
                          {form.twitter ? (
                            <div className="social-row">
                              <span>X</span>
                              <strong>&rarr;</strong>
                            </div>
                          ) : null}
                          {form.instagram ? (
                            <div className="social-row">
                              <span>Instagram</span>
                              <strong>&rarr;</strong>
                            </div>
                          ) : null}
                          {form.whatsapp ? (
                            <div className="social-row">
                              <span>WhatsApp</span>
                              <strong>&rarr;</strong>
                            </div>
                          ) : null}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : form.content_type === "pdf" && pdfPreviewMode === "preview" ? (
                <div className="pdf-live-preview" style={{ "--pdf-accent": form.pdf_theme_color || "#58c2db" }}>
                  <div className="pdf-live-hero">
                    {form.pdf_company_name ? <p>{form.pdf_company_name}</p> : null}
                    <h4>{form.pdf_title || "Annual Report"}</h4>
                    {form.pdf_description ? <span>{form.pdf_description}</span> : null}
                  </div>
                  <div className="pdf-live-body">
                    <div className="pdf-live-image-wrap">
                      <img src={pdfPreviewImage} alt="PDF preview" className="pdf-live-image" />
                    </div>
                    <div className="pdf-live-button">{form.pdf_button_label || "View PDF"}</div>
                  </div>
                </div>
              ) : previewUrl ? (
                <img src={previewUrl} alt="Generated QR code preview" className="qr-preview-image" />
              ) : (
                <span className="preview-placeholder">
                  Generated QR appears here
                </span>
              )}
            </div>
          </div>

          {form.content_type === "contact_card" ? (
            <div className="qr-actions qr-icon-actions">
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={handleShowVCardPreview}
                aria-label="Preview"
                title="Preview"
              >
                <ActionIcon type="preview" />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={handleShowQrPreview}
                disabled={isCreating}
                aria-label={previewUrl ? "QR Code" : "Create QR Code"}
                title={previewUrl ? "QR Code" : "Create QR Code"}
              >
                <ActionIcon type="qr" />
              </button>
              <button
                type="button"
                className="btn btn-primary btn-icon"
                onClick={handleSaveVCard}
                disabled={isSaving || !savedVcardId || !hasUnsavedVCardChanges}
                aria-label="Save"
                title={isSaving ? "Saving..." : "Save"}
              >
                <ActionIcon type="save" />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={handleDownload}
                disabled={!previewUrl}
                aria-label="Download"
                title="Download"
              >
                <ActionIcon type="download" />
              </button>
            </div>
          ) : form.content_type === "pdf" ? (
            <div className="qr-actions qr-icon-actions">
              <button type="button" className="btn btn-secondary btn-icon" onClick={handleShowPdfPreview} aria-label="Preview" title="Preview">
                <ActionIcon type="preview" />
              </button>
              <button type="button" className="btn btn-secondary btn-icon" onClick={handleShowPdfQr} disabled={isCreating} aria-label="QR Code" title="QR Code">
                <ActionIcon type="qr" />
              </button>
              <button type="button" className="btn btn-primary btn-icon" onClick={handleSavePdfLink} disabled={isSavingPdf || !savedPdfLinkId || !hasUnsavedPdfChanges} aria-label="Save" title={isSavingPdf ? "Saving..." : "Save"}>
                <ActionIcon type="save" />
              </button>
              <button type="button" className="btn btn-secondary btn-icon" onClick={handleDownload} disabled={!previewUrl} aria-label="Download" title="Download">
                <ActionIcon type="download" />
              </button>
            </div>
          ) : (
            <div className="qr-actions">
              <button type="button" className="btn btn-primary" onClick={generateQr} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create QR Code"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleDownload} disabled={!previewUrl}>
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Qrcode;
