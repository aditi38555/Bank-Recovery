import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Plus, TrendingUp, Clock, CheckCircle, BarChart3 } from "lucide-react";
import "../App.css";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="db-container">
      <Header />
      <main className="db-content">
        <div className="db-header-flex">
          <div>
            <h1 className="db-title">Invoice Dashboard</h1>
            <p className="db-subtitle">Welcome back! Here is what's happening today.</p>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => navigate("/create")}
            >
            <Plus size={20} strokeWidth={3} />
            Create New Invoice
          </button>
        </div>
        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card" style={{ borderRight: "6px solid #6366f1" }}>
            <div className="flex justify-between items-start">
              <div>
                <span className="stat-label">Total Earnings</span>
                <span className="stat-value">₹84,200</span>
              </div>
              <TrendingUp className="text-indigo-500" size={24} />
            </div>
          </div>
          <div className="stat-card" style={{ borderRight: "6px solid #f59e0b" }}>
            <div className="flex justify-between items-start">
              <div>
                <span className="stat-label">Pending</span>
                <span className="stat-value">12</span>
              </div>
              <Clock className="text-amber-500" size={24} />
            </div>
          </div>

          <div className="stat-card" style={{ borderRight: "6px solid #10b981" }}>
            <div className="flex justify-between items-start">
              <div>
                <span className="stat-label">Completed</span>
                <span className="stat-value">156</span>
              </div>
              <CheckCircle className="text-emerald-500" size={24} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="activity-card">
          <div className="empty-icon">
            <BarChart3 size={64} className="text-slate-300" />
          </div>
          <h3 style={{ fontSize: "22px", color: "#1e293b", fontWeight: "700" }}>
            No Recent Activity
          </h3>
          <p className="db-subtitle" style={{ maxWidth: "400px", margin: "10px auto" }}>
            Your business analytics will appear here once you start generating invoices. 
            Ready to grow?
          </p>
          <button 
             onClick={() => navigate("/create")}
             style={{ marginTop: "20px", background: "#f1f5f9", color: "#475569" }} 
             className="btn-primary"
          >
            Get Started Now
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}