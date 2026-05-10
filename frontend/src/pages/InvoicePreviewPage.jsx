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

import { motion } from "framer-motion";

import InvoicePreview from "../components/InvoicePreview";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "../App.css";

export default function InvoicePreviewPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

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

  // DOWNLOAD PDF
  const handleDownload = async () => {
    try {
      setDownloading(true);

      const res = await axios.post(
        "https://bank-recovery.onrender.com/api/invoice",
        data,
        {
          responseType: "blob",
        }
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
      setDownloading(false);
    }
  };

  // PRINT
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="preview-page">

      <Header />

      <main className="preview-main">

        <div className="preview-container">

          {/* TOP BAR */}
          <motion.div
            className="top-action-bar"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >

            <button
              onClick={() => navigate(-1)}
              className="back-btn"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div className="top-actions">

              {/* PRINT */}
              <button
                onClick={handlePrint}
                className="action-btn print-btn"
              >
                <Printer size={18} />
                Print
              </button>

              {/* DOWNLOAD */}
              <button
                onClick={handleDownload}
                className="action-btn download-btn"
                disabled={downloading}
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
          </motion.div>

          {/* LOADING */}
          {loading ? (
            <div className="loader-container">

              <div className="premium-spinner"></div>

              <p className="loading-text">
                Loading Invoice...
              </p>

            </div>
          ) : (
            <motion.div
              className="invoice-content"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >

              {/* STATUS */}
              <div className="invoice-status">

                <FileCheck size={18} />

                <span>
                  Invoice Ready:
                </span>

                <strong>
                  {data.invoiceNo || "N/A"}
                </strong>

              </div>

              {/* PAPER */}
              <div className="invoice-paper-wrapper">
                <InvoicePreview data={data} />
              </div>

              {/* REF */}
              <div className="reference-box">

                <Share2 size={14} />

                <span>
                  Reference ID:
                </span>

                <strong>{id}</strong>

              </div>

            </motion.div>
          )}

          {/* NOTE */}
          <div className="note-box">

            <p>
              Note: This is a system-generated document and does not require a physical signature.
            </p>

          </div>

        </div>
      </main>

      {/* DOWNLOAD POPUP */}
      {downloading && (
        <div className="download-popup-overlay">

          <motion.div
            className="download-popup"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >

            <LoaderCircle
              size={42}
              className="spin-icon"
            />

            <h3>Downloading PDF...</h3>

            <p>
              Please wait while your invoice is being generated.
            </p>

          </motion.div>
        </div>
      )}

      <Footer />

    </div>
  );
}