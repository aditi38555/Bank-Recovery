import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  List, // Naya icon import kiya
} from "lucide-react";
import { motion } from "framer-motion";
import "../App.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="db-container">
      <Header />

      <main className="db-content">
        {/* Header Section */}
        <motion.div
          className="db-header-flex"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="db-title">Invoice Dashboard</h1>
            <p className="db-subtitle">
              Welcome back! Here is what's happening today.
            </p>
          </div>

          {/* Buttons Group */}
          <div className="db-header-btns">
            {/* LIST BUTTON */}
            <button
              className="btn-secondary-outline"
              onClick={() => navigate("/invoices")}
            >
              <List size={20} />
              View All Invoices
            </button>

            {/* CREATE BUTTON */}
            <button
              className="btn-primary"
              onClick={() => navigate("/create")}
            >
              <Plus size={20} strokeWidth={3} />
              Create New
            </button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="stats-grid">
          <motion.div
            custom={0}
            variants={cardVariant}
            initial="hidden"
            animate="visible"
            className="stat-card earnings"
          >
            <div className="stat-top">
              <div>
                <span className="stat-label">Total Earnings</span>
                <span className="stat-value">₹84,200</span>
              </div>
              <div className="icon-box indigo">
                <TrendingUp size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={1}
            variants={cardVariant}
            initial="hidden"
            animate="visible"
            className="stat-card pending"
          >
            <div className="stat-top">
              <div>
                <span className="stat-label">Pending</span>
                <span className="stat-value">12</span>
              </div>
              <div className="icon-box amber">
                <Clock size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={2}
            variants={cardVariant}
            initial="hidden"
            animate="visible"
            className="stat-card completed"
          >
            <div className="stat-top">
              <div>
                <span className="stat-label">Completed</span>
                <span className="stat-value">156</span>
              </div>
              <div className="icon-box green">
                <CheckCircle size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity Section */}
        <motion.div
          className="activity-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="empty-icon">
            <BarChart3 size={70} className="activity-icon" />
          </div>
          <h3 className="activity-title">No Recent Activity</h3>
          <p className="activity-text">
            Your business analytics will appear here once you start generating
            invoices. Ready to grow?
          </p>
          <div className="btn-group-center">
             <button
              onClick={() => navigate("/create")}
              className="secondary-btn"
            >
              Get Started Now
            </button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}