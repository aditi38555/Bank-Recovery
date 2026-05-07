import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, Edit3, Trash2, Search, FileText, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

export default function InvoicesList() {
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("https://bank-recovery.onrender.com/api/invoices");
            setData(res.data);
        } catch (err) {
            console.error("Data fetch error:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Do you really want to delete this invoice?")) {
            await axios.delete(`https://bank-recovery.onrender.com/api/invoice/${id}`);
            fetchData();
        }
    };

    // ✅ VALIDATION FUNCTION
    const validateForm = () => {
        let newErrors = {};

        // Email validation
        if (!editData.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(editData.email)
        ) {
            newErrors.email = "Enter valid email";
        }

        // Amount validation
        if (!editData.amount || Number(editData.amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ✅ UPDATE FUNCTION
    const handleUpdate = async (e) => {
        e.preventDefault();

        // Run validation
        if (!validateForm()) return;

        try {
            const amount = Number(editData.amount) || 0;
            const cgst = (amount * 0.09).toFixed(2);
            const sgst = (amount * 0.09).toFixed(2);
            const total = (
                amount +
                Number(cgst) +
                Number(sgst)
            ).toFixed(2);

            const updatedData = {
                ...editData,
                amount,
                cgst,
                sgst,
                total,
            };

            await axios.put(
                `https://bank-recovery.onrender.com/api/invoice/${editData.id}`,
                updatedData
            );

            alert("Invoice updated successfully ✅");

            setEditData(null);
            setErrors({});
            fetchData();

        } catch (err) {
            console.error(err);
            alert("Update failed ❌");
        }
    };

    // ✅ SEARCH FILTER
    const filteredData = data.filter(
        (item) =>
            item.invoiceNo
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="db-container">
            <Header />

            <main className="db-content">

                {/* HEADER */}
                <div className="db-header-flex">
                    <div>
                        <h1 className="db-title">All Invoices</h1>
                        <p className="db-subtitle">
                            Managing {data.length} records
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/create")}
                        className="btn-primary"
                    >
                        + Create Invoice
                    </button>
                </div>

                {/* SEARCH */}
                <div
                    style={{
                        position: "relative",
                        marginBottom: "20px",
                    }}
                >
                    <Search
                        style={{
                            position: "absolute",
                            left: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#94a3b8",
                        }}
                        size={18}
                    />

                    <input
                        type="text"
                        placeholder="Search by Invoice No or Client Email..."
                        className="form-input"
                        style={{
                            paddingLeft: "45px",
                            width: "100%",
                            maxWidth: "400px",
                        }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* TABLE */}
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Client Details</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th style={{ textAlign: "center" }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    background: "#f1f5f9",
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                }}
                                            >
                                                <FileText
                                                    size={18}
                                                    color="#6366f1"
                                                />
                                            </div>

                                            <span
                                                style={{
                                                    fontWeight: "700",
                                                    color: "#1e293b",
                                                }}
                                            >
                                                {item.invoiceNo}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <div
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {item.email}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "12px",
                                                color: "#64748b",
                                            }}
                                        >
                                            {item.contact}
                                        </div>
                                    </td>

                                    <td
                                        style={{
                                            color: "#475569",
                                            fontSize: "14px",
                                        }}
                                    >
                                        {item.date}
                                    </td>

                                    <td>
                                        <div
                                            style={{
                                                color: "#10b981",
                                                fontWeight: "800",
                                            }}
                                        >
                                            ₹{item.total}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "10px",
                                                color: "#94a3b8",
                                            }}
                                        >
                                            Incl. 18% GST
                                        </div>
                                    </td>

                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    navigate(`/preview/${item.id}`)
                                                }
                                                className="action-btn btn-view"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditData(item);
                                                    setErrors({});
                                                }}
                                                className="action-btn btn-edit"
                                            >
                                                <Edit3 size={16} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="action-btn btn-delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredData.length === 0 && (
                        <div
                            style={{
                                padding: "60px",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "40px",
                                    marginBottom: "10px",
                                }}
                            >
                                🔍
                            </div>

                            <p style={{ color: "#64748b" }}>
                                No matching invoices found.
                            </p>
                        </div>
                    )}
                </div>

                {/* EDIT MODAL */}
                {editData && (
                    <div className="edit-overlay">
                        <div className="edit-modal">

                            <button
                                className="btn-back"
                                style={{
                                    position: "absolute",
                                    right: "20px",
                                    top: "20px",
                                    padding: "8px",
                                }}
                                onClick={() => setEditData(null)}
                            >
                                <X size={20} />
                            </button>

                            <h2
                                className="db-title"
                                style={{
                                    fontSize: "22px",
                                    marginBottom: "25px",
                                }}
                            >
                                Edit Invoice
                            </h2>

                            {/* ✅ FORM */}
                            <form onSubmit={handleUpdate}>

                                <div className="form-grid">

                                    {/* EMAIL */}
                                    <div className="form-group">
                                        <label>Client Email</label>

                                        <input
                                            type="email"
                                            value={editData.email}
                                            className="form-input"
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    email: e.target.value,
                                                })
                                            }
                                        />

                                        {errors.email && (
                                            <p className="error-text" >
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* AMOUNT */}
                                    <div className="form-group">
                                        <label>Amount (Basic)</label>

                                        <input
                                            type="number"
                                            value={editData.amount}
                                            className="form-input"
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    amount: e.target.value,
                                                })
                                            }
                                        />

                                        {errors.amount && (
                                            <p className="error-text" >
                                                {errors.amount}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div
                                    className="btn-group"
                                    style={{ marginTop: "30px" }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setEditData(null)}
                                        className="btn-back"
                                        style={{ flex: 1 }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn-save"
                                        style={{ flex: 2 }}
                                    >
                                        Save Changes
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}