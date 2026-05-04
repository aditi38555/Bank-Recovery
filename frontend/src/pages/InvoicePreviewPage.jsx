import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Download, Printer, Share2, FileCheck } from "lucide-react";
import InvoicePreview from "../components/InvoicePreview";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

export default function InvoicePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/invoice/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching invoice ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/invoice",
        data,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${data.invoiceNo || id}.pdf`;
      a.click();
    } catch (err) {
      alert("PDF download failed ❌");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="db-container">
      <Header />

      <main className="db-content" style={{ backgroundColor: '#f8fafc' }}>
        <div className="preview-container">
          
          {/* Corrected Action Bar */}
          <div className="action-bar">
            <button 
              onClick={() => navigate(-1)} 
              className="btn-primary" 
              style={{ background: 'transparent', color: '#64748b', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ArrowLeft size={18} /> Back
            </button>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handlePrint} className="action-btn btn-view" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={18} /> Print
              </button>
              <button onClick={handleDownload} className="btn-download">
                <Download size={18} /> Download PDF
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <p style={{ marginTop: '15px', color: '#64748b', fontWeight: '500' }}>Loading Invoice...</p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {/* Status Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#10b981', fontWeight: '700', fontSize: '14px' }}>
                <FileCheck size={18} /> 
                Invoice Ready: {data.invoiceNo || "N/A"}
              </div>

              {/* Professional Paper Wrapper */}
              <div className="invoice-paper-wrapper">
                {/* Yahan aapka existing component call ho raha hai */}
                <InvoicePreview data={data} />
              </div>
              
              {/* Footer Share Info - FIXED Property Name */}
              <div className="action-bar" style={{ marginTop: '30px', justifyContent: 'center', opacity: 0.9 }}>
                 <p className="db-subtitle" style={{ margin: 0, fontSize: '13px' }}>
                    <Share2 size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 
                    Reference ID: <span style={{ color: '#1e293b', fontWeight: '600' }}>{id}</span>
                 </p>
              </div>
            </div>
          )}

          <div style={{ marginTop: '30px', textAlign: 'center', paddingBottom: '40px' }}>
            <p className="db-subtitle" style={{ fontSize: '12px' }}>
              Note: This is a system-generated document and does not require a physical signature.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}