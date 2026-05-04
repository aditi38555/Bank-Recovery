import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, History, IndianRupee, Mail, Phone, Calendar, Landmark } from "lucide-react";
import "../App.css";

// numberToWords function same rahega...

export default function InvoiceForm() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    date: "", invoiceNo: "", email: "", contact: "", branch: "", bank: "", gstin: "", amount: ""
  });

  const amount = Number(data.amount) || 0;
  const taxRate = 0.09; // 9% CGST + 9% SGST = 18%
  const cgst = (amount * taxRate).toFixed(2);
  const sgst = (amount * taxRate).toFixed(2);
  const total = (amount + Number(cgst) + Number(sgst)).toFixed(2);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { 
        ...data, amount, cgst, sgst, total, 
        amountWords: "Rupees " + (data.amount || 0) + " Only", 
        totalWords: "Rupees " + total + " Only" 
    };

    try {
      await axios.post("http://localhost:5000/api/save-invoice", finalData);
      alert("Invoice Created! 🚀");
      navigate("/invoices");
    } catch (error) {
      alert("Error saving invoice ❌");
    }
  };

  return (
    <div className="db-container">
      <div className="db-content">
        
        {/* Header Section */}
        <div className="db-header-flex">
          <div>
            <h1 className="db-title">Create New Invoice</h1>
            <p className="db-subtitle">Fill in the details to generate a professional bill.</p>
          </div>
          <button className="btn-primary" style={{background: '#f1f5f9', color: '#475569'}} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            
            {/* Input Groups */}
            <div className="form-group">
              <label><Calendar size={14} /> Invoice Date</label>
              <input name="date" type="date" required onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label>Invoice Number</label>
              <input name="invoiceNo" placeholder="e.g. INV-2026-001" onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label><Mail size={14} /> Customer Email</label>
              <input name="email" type="email" placeholder="client@company.com" onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label><Phone size={14} /> Contact Number</label>
              <input name="contact" placeholder="+91 98765 43210" onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label><Landmark size={14} /> Bank Name</label>
              <input name="bank" placeholder="HDFC Bank" onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label>GSTIN Number</label>
              <input name="gstin" placeholder="22AAAAA0000A1Z5" onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group full-width">
              <label><IndianRupee size={14} /> Amount (Exclusive of Tax)</label>
              <input 
                name="amount" 
                type="number" 
                placeholder="Enter base amount" 
                required 
                onChange={handleChange} 
                className="form-input" 
                style={{fontSize: '18px', fontWeight: 'bold', color: '#6366f1'}}
              />
            </div>

            {/* Live Calculation Preview Card */}
            <div className="full-width summary-box">
               <div className="summary-item">
                  <p>Taxable Amount</p>
                  <h2 style={{fontSize: '18px'}}>₹{amount.toLocaleString()}</h2>
               </div>
               <div className="summary-item" style={{textAlign: 'center'}}>
                  <p>GST (18%)</p>
                  <h2 style={{fontSize: '18px'}}>₹{(Number(cgst) + Number(sgst)).toLocaleString()}</h2>
               </div>
               <div className="summary-item" style={{textAlign: 'right'}}>
                  <p>Grand Total</p>
                  <h2>₹{total.toLocaleString()}</h2>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="full-width btn-group" style={{marginTop: '20px', display: 'flex', gap: '15px'}}>
              <button type="button" className="btn-primary" style={{background: '#e0e7ff', color: '#4338ca', flex: 1}} onClick={() => navigate("/invoices")}>
                <History size={18} /> View History
              </button>
              <button type="submit" className="btn-save" style={{flex: 2, display: 'flex', justifyContent: 'center', gap: '10px'}}>
                <Save size={18} /> Save & Generate Invoice
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}