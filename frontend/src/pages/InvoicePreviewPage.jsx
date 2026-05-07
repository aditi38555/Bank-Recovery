import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Download,
  Printer,
  Share2,
  FileCheck,
  LoaderCircle,
} from "lucide-react";

import InvoicePreview from "../components/InvoicePreview";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

export default function InvoicePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ DOWNLOAD LOADING STATE
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://bank-recovery.onrender.com/api/invoice/${id}`
      );

      setData(res.data);

    } catch (err) {
      console.error(err);
      alert("Error fetching invoice ❌");

    } finally {
      setLoading(false);
    }
  };

  // ✅ DOWNLOAD FUNCTION
  const handleDownload = async () => {
    try {

      // START LOADING
      setDownloading(true);

      const res = await axios.post(
        "https://bank-recovery.onrender.com/api/invoice",
        data,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const a = document.createElement("a");

      a.href = url;
      a.download = `Invoice-${data.invoiceNo || id}.pdf`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("PDF download failed ❌");

    } finally {

      // STOP LOADING
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="db-container">
      <Header />

      <main
        className="db-content"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="preview-container">

          {/* ACTION BAR */}
          <div className="action-bar">

            <button
              onClick={() => navigate(-1)}
              className="btn-primary"
              style={{
                background: "transparent",
                color: "#64748b",
                boxShadow: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div style={{ display: "flex", gap: "12px" }}>

              {/* PRINT */}
              <button
                onClick={handlePrint}
                className="action-btn btn-view"
                style={{
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Printer size={18} />
                Print
              </button>

              {/* DOWNLOAD */}
              <button
                onClick={handleDownload}
                className="btn-download"
                disabled={downloading}
                style={{
                  opacity: downloading ? 0.7 : 1,
                  cursor: downloading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {downloading ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="spin-icon"
                    />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Download PDF
                  </>
                )}
              </button>

            </div>
          </div>

          {/* MAIN CONTENT */}
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>

              <p
                style={{
                  marginTop: "15px",
                  color: "#64748b",
                  fontWeight: "500",
                }}
              >
                Loading Invoice...
              </p>
            </div>
          ) : (
            <div className="animate-fadeIn">

              {/* STATUS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "20px",
                  color: "#10b981",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                <FileCheck size={18} />
                Invoice Ready: {data.invoiceNo || "N/A"}
              </div>

              {/* PAPER */}
              <div className="invoice-paper-wrapper">
                <InvoicePreview data={data} />
              </div>

              {/* FOOTER */}
              <div
                className="action-bar"
                style={{
                  marginTop: "30px",
                  justifyContent: "center",
                  opacity: 0.9,
                }}
              >
                <p
                  className="db-subtitle"
                  style={{
                    margin: 0,
                    fontSize: "13px",
                  }}
                >
                  <Share2
                    size={14}
                    style={{
                      marginRight: "8px",
                      verticalAlign: "middle",
                    }}
                  />

                  Reference ID:
                  <span
                    style={{
                      color: "#1e293b",
                      fontWeight: "600",
                    }}
                  >
                    {" "}
                    {id}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              paddingBottom: "40px",
            }}
          >
            <p
              className="db-subtitle"
              style={{ fontSize: "12px" }}
            >
              Note: This is a system-generated document and does not require a physical signature.
            </p>
          </div>

        </div>
      </main>

      {/* ✅ DOWNLOAD POPUP */}
      {downloading && (
        <div className="download-popup-overlay">
          <div className="download-popup">

            <LoaderCircle
              size={40}
              className="spin-icon"
            />

            <h3>Downloading PDF...</h3>

            <p>
              Please wait while your invoice is being generated.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}