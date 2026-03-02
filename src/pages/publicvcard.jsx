import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./publicvcard.css";

const IconPhone = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.3 11.3 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.9 21 3 13.1 3 3.9a1 1 0 0 1 1-1h3.4a1 1 0 0 1 1 1 11.3 11.3 0 0 0 .56 3.5 1 1 0 0 1-.25 1L6.6 10.8Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
const IconEmail = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="m5 8 7 5 7-5" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
const IconWeb = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const IconLocation = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
const IconWork = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="7" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const toAbsoluteUrl = (value) => {
  const raw = (value || "").trim();
  if (!raw) return "";
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  return `https://${raw}`;
};

const PublicVCard = () => {
  const { slug = "" } = useParams();
  const apiBaseUrl = useMemo(() => (import.meta.env.VITE_API_URL || "").replace(/\/$/, ""), []);
  const [card, setCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCard = async () => {
      if (!apiBaseUrl || !slug) {
        setError("Card not found.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`${apiBaseUrl}/vcards/public/${slug}`);
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.detail || "Card not found.");
        }
        const data = await response.json();
        setCard(data);
      } catch (err) {
        setError(err.message || "Card not found.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCard();
  }, [apiBaseUrl, slug]);

  if (isLoading) return <section className="public-vcard-page"><p>Loading card...</p></section>;
  if (error || !card) return <section className="public-vcard-page"><p>{error || "Card not found."}</p></section>;

  const location = [card.city, card.state, card.country].filter(Boolean).join(", ");
  const socials = [
    { key: "linkedin", label: "LinkedIn", url: toAbsoluteUrl(card.linkedin) },
    { key: "twitter", label: "X", url: toAbsoluteUrl(card.twitter) },
    { key: "instagram", label: "Instagram", url: toAbsoluteUrl(card.instagram) },
    { key: "whatsapp", label: "WhatsApp", url: toAbsoluteUrl(card.whatsapp) },
  ].filter((item) => item.url);

  return (
    <section className="public-vcard-page">
      <article className="public-vcard-card" style={{ "--accent": card.theme_color || "#6ea2df" }}>
        <div className="public-vcard-hero">
          <h1>{card.full_name}</h1>
          <p>{card.job_title || "Professional"}</p>
          <div className="public-vcard-quick-actions">
            {card.phone ? <a href={`tel:${card.phone}`} className="quick-action"><IconPhone /></a> : null}
            {card.email ? <a href={`mailto:${card.email}`} className="quick-action"><IconEmail /></a> : null}
            {location ? <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${card.address || ""} ${location}`.trim())}`} target="_blank" rel="noreferrer" className="quick-action"><IconLocation /></a> : null}
          </div>
        </div>

        <div className="public-vcard-main">
          <div className="public-vcard-info-list">
            {card.phone ? (
              <div className="info-row">
                <span className="info-icon"><IconPhone /></span>
                <div className="info-text">
                  <small>Personal Phone</small>
                  <a href={`tel:${card.phone}`}>{card.phone}</a>
                </div>
              </div>
            ) : null}
            {card.email ? (
              <div className="info-row">
                <span className="info-icon"><IconEmail /></span>
                <div className="info-text">
                  <small>My Personal Email</small>
                  <a href={`mailto:${card.email}`}>{card.email}</a>
                </div>
              </div>
            ) : null}
            {card.website ? (
              <div className="info-row">
                <span className="info-icon"><IconWeb /></span>
                <div className="info-text">
                  <small>My Website</small>
                  <a href={toAbsoluteUrl(card.website)} target="_blank" rel="noreferrer">{card.website}</a>
                </div>
              </div>
            ) : null}
            {location || card.address ? (
              <div className="info-row">
                <span className="info-icon"><IconLocation /></span>
                <div className="info-text">
                  <small>Location</small>
                  <p>{[card.address, location].filter(Boolean).join(", ")}</p>
                </div>
              </div>
            ) : null}
            {card.company || card.job_title ? (
              <div className="info-row">
                <span className="info-icon"><IconWork /></span>
                <div className="info-text">
                  <small>{card.company || "Company"}</small>
                  <p>{card.job_title || "-"}</p>
                </div>
              </div>
            ) : null}
          </div>

          {socials.length > 0 ? (
            <>
              <h2>Find me on</h2>
              <div className="public-vcard-socials">
                {socials.map((social) => (
                  <a key={social.key} href={social.url} target="_blank" rel="noreferrer" className="social-row">
                    <span>{social.label}</span>
                    <strong>&rarr;</strong>
                  </a>
                ))}
              </div>
            </>
          ) : null}

        </div>
      </article>
    </section>
  );
};

export default PublicVCard;
