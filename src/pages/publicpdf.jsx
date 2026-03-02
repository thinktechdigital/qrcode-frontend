import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./publicpdf.css";
import pdfPreviewImage from "../assets/pdf.png";

const toAbsoluteUrl = (value) => {
  const raw = (value || "").trim();
  if (!raw) return "";
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  return `https://${raw}`;
};

const PublicPdf = () => {
  const { slug = "" } = useParams();
  const apiBaseUrl = useMemo(() => (import.meta.env.VITE_API_URL || "").replace(/\/$/, ""), []);
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItem = async () => {
      if (!apiBaseUrl || !slug) {
        setError("PDF link not found.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`${apiBaseUrl}/pdf-links/public/${slug}`);
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.detail || "PDF link not found.");
        }
        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError(err.message || "PDF link not found.");
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [apiBaseUrl, slug]);

  if (isLoading) return <section className="public-pdf-page"><p>Loading PDF page...</p></section>;
  if (error || !item) return <section className="public-pdf-page"><p>{error || "PDF link not found."}</p></section>;
  const fileUrl = item.pdf_file_url?.startsWith("http")
    ? item.pdf_file_url
    : `${apiBaseUrl}${item.pdf_file_url || ""}`;

  return (
    <section className="public-pdf-page">
      <article className="public-pdf-card" style={{ "--accent": item.theme_color || "#58c2db" }}>
        <header className="public-pdf-hero">
          {item.company_name ? <p className="public-pdf-company">{item.company_name}</p> : null}
          <h1>{item.pdf_title || "PDF Document"}</h1>
          {item.description ? <p className="public-pdf-description">{item.description}</p> : null}
        </header>

        <div className="public-pdf-body">
          <div className="public-pdf-image-wrap">
            <img src={pdfPreviewImage} alt="PDF preview illustration" className="public-pdf-image" />
          </div>

          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="public-pdf-button"
          >
            <span className="public-pdf-button-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 19h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            {item.button_label || "View PDF"}
          </a>
          {item.website_url ? (
            <a href={toAbsoluteUrl(item.website_url)} target="_blank" rel="noreferrer" className="public-pdf-website">
              {item.website_url}
            </a>
          ) : null}
        </div>
      </article>
    </section>
  );
};

export default PublicPdf;
