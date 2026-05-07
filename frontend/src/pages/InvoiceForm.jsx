import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  History,
  IndianRupee,
  Mail,
  Phone,
  Calendar,
  Landmark,
} from "lucide-react";
import "../App.css";

export default function InvoiceForm() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    date: "",
    invoiceNo: "",
    email: "",
    contact: "",
    branch: "",
    bank: "",
    gstin: "",
    amount: "",
  });

  // ✅ ERROR STATE
  const [errors, setErrors] = useState({});

  const amount = Number(data.amount) || 0;
  const taxRate = 0.09;

  const cgst = (amount * taxRate).toFixed(2);
  const sgst = (amount * taxRate).toFixed(2);

  const total = (
    amount +
    Number(cgst) +
    Number(sgst)
  ).toFixed(2);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

    // remove error while typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // ✅ VALIDATION FUNCTION
  const validateForm = () => {
    let newErrors = {};

    // DATE
    if (!data.date) {
      newErrors.date = "Invoice date is required";
    }

    // INVOICE NO
    if (!data.invoiceNo.trim()) {
      newErrors.invoiceNo = "Invoice number is required";
    }

    // EMAIL
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)
    ) {
      newErrors.email = "Enter valid email";
    }

    // CONTACT
    if (!data.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(data.contact)) {
      newErrors.contact = "Enter valid 10-digit number";
    }

    // BANK
    if (!data.bank.trim()) {
      newErrors.bank = "Bank name is required";
    }

    // GSTIN
    if (!data.gstin.trim()) {
      newErrors.gstin = "GSTIN is required";
    } else if (data.gstin.length !== 15) {
      newErrors.gstin = "GSTIN must be 15 characters";
    }

    // AMOUNT
    if (!data.amount) {
      newErrors.amount = "Amount is required";
    } else if (Number(data.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation check
    if (!validateForm()) return;

    const finalData = {
      ...data,
      amount,
      cgst,
      sgst,
      total,
      amountWords:
        "Rupees " + (data.amount || 0) + " Only",
      totalWords:
        "Rupees " + total + " Only",
    };

    try {
      await axios.post(
        "https://bank-recovery.onrender.com/api/save-invoice",
        finalData
      );

      alert("Invoice Created! 🚀");

      navigate("/invoices");

    } catch (error) {
      console.error(error);
      alert("Error saving invoice ❌");
    }
  };

  return (
    <div className="db-container">
      <div className="db-content">

        {/* HEADER */}
        <div className="db-header-flex">
          <div>
            <h1 className="db-title">
              Create New Invoice
            </h1>

            <p className="db-subtitle">
              Fill in the details to generate a professional bill.
            </p>
          </div>

          <button
            className="btn-primary"
            style={{
              background: "#f1f5f9",
              color: "#475569",
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        {/* FORM */}
        <div className="form-card">

          <form
            onSubmit={handleSubmit}
            className="form-grid"
          >

            {/* DATE */}
            <div className="form-group">
              <label>
                <Calendar size={14} /> Invoice Date
              </label>

              <input
                name="date"
                type="date"
                value={data.date}
                onChange={handleChange}
                className="form-input"
              />

              {errors.date && (
                <p className="error-text">
                  {errors.date}
                </p>
              )}
            </div>

            {/* INVOICE NUMBER */}
            <div className="form-group">
              <label>Invoice Number</label>

              <input
                name="invoiceNo"
                value={data.invoiceNo}
                placeholder="e.g. INV-2026-001"
                onChange={handleChange}
                className="form-input"
              />

              {errors.invoiceNo && (
                <p className="error-text">
                  {errors.invoiceNo}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label>
                <Mail size={14} /> Customer Email
              </label>

              <input
                name="email"
                type="email"
                value={data.email}
                placeholder="client@company.com"
                onChange={handleChange}
                className="form-input"
              />

              {errors.email && (
                <p className="error-text">
                  {errors.email}
                </p>
              )}
            </div>

            {/* CONTACT */}
            <div className="form-group">
              <label>
                <Phone size={14} /> Contact Number
              </label>

              <input
                name="contact"
                value={data.contact}
                placeholder="9876543210"
                onChange={handleChange}
                className="form-input"
              />

              {errors.contact && (
                <p className="error-text">
                  {errors.contact}
                </p>
              )}
            </div>

            {/* BANK */}
            <div className="form-group">
              <label>
                <Landmark size={14} /> Bank Name
              </label>

              <input
                name="bank"
                value={data.bank}
                placeholder="HDFC Bank"
                onChange={handleChange}
                className="form-input"
              />

              {errors.bank && (
                <p className="error-text">
                  {errors.bank}
                </p>
              )}
            </div>

            {/* GSTIN */}
            <div className="form-group">
              <label>GSTIN Number</label>

              <input
                name="gstin"
                value={data.gstin}
                placeholder="22AAAAA0000A1Z5"
                onChange={handleChange}
                className="form-input"
              />

              {errors.gstin && (
                <p className="error-text">
                  {errors.gstin}
                </p>
              )}
            </div>

            {/* AMOUNT */}
            <div className="form-group full-width">
              <label>
                <IndianRupee size={14} /> Amount (Exclusive of Tax)
              </label>

              <input
                name="amount"
                type="number"
                value={data.amount}
                placeholder="Enter base amount"
                onChange={handleChange}
                className="form-input"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#6366f1",
                }}
              />

              {errors.amount && (
                <p className="error-text">
                  {errors.amount}
                </p>
              )}
            </div>

            {/* SUMMARY */}
            <div className="full-width summary-box">

              <div className="summary-item">
                <p>Taxable Amount</p>
                <h2 style={{ fontSize: "18px" }}>
                  ₹{amount.toLocaleString()}
                </h2>
              </div>

              <div
                className="summary-item"
                style={{ textAlign: "center" }}
              >
                <p>GST (18%)</p>

                <h2 style={{ fontSize: "18px" }}>
                  ₹
                  {(
                    Number(cgst) +
                    Number(sgst)
                  ).toLocaleString()}
                </h2>
              </div>

              <div
                className="summary-item"
                style={{ textAlign: "right" }}
              >
                <p>Grand Total</p>

                <h2>
                  ₹{total.toLocaleString()}
                </h2>
              </div>
            </div>

            {/* BUTTONS */}
            <div
              className="full-width btn-group"
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "15px",
              }}
            >
              <button
                type="button"
                className="btn-primary"
                style={{
                  background: "#e0e7ff",
                  color: "#4338ca",
                  flex: 1,
                }}
                onClick={() => navigate("/invoices")}
              >
                <History size={18} /> View History
              </button>

              <button
                type="submit"
                className="btn-save"
                style={{
                  flex: 2,
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Save size={18} />
                Save & Generate Invoice
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}