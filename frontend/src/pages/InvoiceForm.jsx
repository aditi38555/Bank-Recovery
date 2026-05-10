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

import { motion } from "framer-motion";

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

  // ERROR STATE
  const [errors, setErrors] = useState({});

  // CALCULATIONS
  const amount = Number(data.amount) || 0;

  const taxRate = 0.09;

  const cgst = (amount * taxRate).toFixed(2);

  const sgst = (amount * taxRate).toFixed(2);

  const total = (
    amount +
    Number(cgst) +
    Number(sgst)
  ).toFixed(2);

  // HANDLE CHANGE
  const handleChange = (e) => {

    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

    // REMOVE ERROR WHILE TYPING
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // VALIDATION
  const validateForm = () => {

    let newErrors = {};

    // DATE
    if (!data.date) {
      newErrors.date = "Invoice date is required";
    }

    // INVOICE NUMBER
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

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    // VALIDATION CHECK
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

      alert("Invoice Created Successfully 🚀");

      navigate("/invoices");

    } catch (error) {

      console.error(error);

      alert("Error saving invoice ❌");
    }
  };

  return (
    <div className="invoice-page">

      <div className="invoice-container">

        {/* HEADER */}
        <motion.div
          className="invoice-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >

          <div>
            <h1 className="invoice-title">
              Create New Invoice
            </h1>

            <p className="invoice-subtitle">
              Generate professional GST invoices with modern billing experience.
            </p>
          </div>

          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Back
          </button>

        </motion.div>

        {/* FORM CARD */}
        <motion.div
          className="invoice-card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <form
            onSubmit={handleSubmit}
            className="invoice-form-grid"
          >

            {/* DATE */}
            <div className="form-group">

              <label>
                <Calendar size={14} />
                Invoice Date
              </label>

              <input
                type="date"
                name="date"
                value={data.date}
                onChange={handleChange}
                className="invoice-input"
              />

              {errors.date && (
                <p className="error-text">
                  {errors.date}
                </p>
              )}

            </div>

            {/* INVOICE NUMBER */}
            <div className="form-group">

              <label>
                Invoice Number
              </label>

              <input
                type="text"
                name="invoiceNo"
                value={data.invoiceNo}
                placeholder="INV-2026-001"
                onChange={handleChange}
                className="invoice-input"
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
                <Mail size={14} />
                Customer Email
              </label>

              <input
                type="email"
                name="email"
                value={data.email}
                placeholder="client@company.com"
                onChange={handleChange}
                className="invoice-input"
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
                <Phone size={14} />
                Contact Number
              </label>

              <input
                type="text"
                name="contact"
                value={data.contact}
                placeholder="9876543210"
                onChange={handleChange}
                className="invoice-input"
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
                <Landmark size={14} />
                Bank Name
              </label>

              <input
                type="text"
                name="bank"
                value={data.bank}
                placeholder="HDFC Bank"
                onChange={handleChange}
                className="invoice-input"
              />

              {errors.bank && (
                <p className="error-text">
                  {errors.bank}
                </p>
              )}

            </div>

            {/* GSTIN */}
            <div className="form-group">

              <label>
                GSTIN Number
              </label>

              <input
                type="text"
                name="gstin"
                value={data.gstin}
                placeholder="22AAAAA0000A1Z5"
                onChange={handleChange}
                className="invoice-input"
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
                <IndianRupee size={14} />
                Amount (Exclusive of Tax)
              </label>

              <input
                type="number"
                name="amount"
                value={data.amount}
                placeholder="Enter Amount"
                onChange={handleChange}
                className="invoice-input amount-input"
              />

              {errors.amount && (
                <p className="error-text">
                  {errors.amount}
                </p>
              )}

            </div>

            {/* SUMMARY */}
            <div className="summary-box full-width">

              <div className="summary-item">
                <p>Taxable Amount</p>

                <h2>
                  ₹{amount.toLocaleString()}
                </h2>
              </div>

              <div className="summary-item">
                <p>GST (18%)</p>

                <h2>
                  ₹
                  {(
                    Number(cgst) +
                    Number(sgst)
                  ).toLocaleString()}
                </h2>
              </div>

              <div className="summary-item">
                <p>Grand Total</p>

                <h2>
                  ₹{total.toLocaleString()}
                </h2>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="btn-group full-width">

              <button
                type="button"
                className="history-btn"
                onClick={() => navigate("/invoices")}
              >
                <History size={18} />
                View History
              </button>

              <button
                type="submit"
                className="save-btn"
              >
                <Save size={18} />
                Save & Generate Invoice
              </button>

            </div>

          </form>

        </motion.div>

      </div>

    </div>
  );
}