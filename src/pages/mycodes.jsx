import "./mycodes.css";
import qrCode from "../assets/qr-code.png";
import barcodeScan from "../assets/barcode-scan.png";
import { useLocation, useNavigate } from "react-router-dom";
import GeneratedCodesCard from "../components/generatedcodescard";


const Mycodes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/admin") ? "/admin" : "/dashboard";

  return (
    <section className="work-page">
      <div className="mycodes-header">
        <h1>My Codes</h1>
        <div className="mycodes-header-actions">
          <button type="button" className="mycodes-header-btn" onClick={() => navigate(`${basePath}/qrcode`)}>
            <img className="iconstopbtn" src={qrCode} alt="qr-code" />
            Create QR Code
          </button>
          <button type="button" className="mycodes-header-btn-secondary" onClick={() => navigate(`${basePath}/barcode`)}>
            <img className="iconstopbtn" src={barcodeScan} alt="barcode-scan" />
            Create Barcode
          </button>
        </div>
      </div>
      <p className="mycodes-header-subtitle">View and manage all generated QR codes and Barcodes.</p>
      <GeneratedCodesCard />
    </section>
  );
};

export default Mycodes;
