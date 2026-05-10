import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Eye,
    Edit3,
    Trash2,
    Search,
    FileText,
    X,
    ArrowLeft,
    Plus,
} from "lucide-react";

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

            const res = await axios.get(
                "https://bank-recovery.onrender.com/api/invoices"
            );

            setData(res.data);

        } catch (err) {

            console.error("Data fetch error:", err);
        }
    };

    const handleDelete = async (id) => {

        if (
            window.confirm(
                "Do you really want to delete this invoice?"
            )
        ) {

            await axios.delete(
                `https://bank-recovery.onrender.com/api/invoice/${id}`
            );

            fetchData();
        }
    };

    // VALIDATION
    const validateForm = () => {

        let newErrors = {};

        if (!editData.email?.trim()) {

            newErrors.email = "Email is required";

        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(editData.email)
        ) {

            newErrors.email = "Enter valid email";
        }

        if (
            !editData.amount ||
            Number(editData.amount) <= 0
        ) {

            newErrors.amount =
                "Amount must be greater than 0";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // UPDATE
    const handleUpdate = async (e) => {

        e.preventDefault();

        if (!validateForm()) return;

        try {

            const amount =
                Number(editData.amount) || 0;

            const cgst = (
                amount * 0.09
            ).toFixed(2);

            const sgst = (
                amount * 0.09
            ).toFixed(2);

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

            alert(
                "Invoice updated successfully ✅"
            );

            setEditData(null);

            setErrors({});

            fetchData();

        } catch (err) {

            console.error(err);

            alert("Update failed ❌");
        }
    };

    // SEARCH FILTER
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
                <motion.div
                    className="db-header-flex"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >

                    <div>

                        <h1 className="db-title">
                            All Invoices
                        </h1>

                        <p className="db-subtitle">
                            Managing {data.length} records
                        </p>

                    </div>

                    {/* RIGHT BUTTONS */}
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                        }}
                    >

                        {/* BACK */}
                        <button
                            onClick={() => navigate(-1)}
                            className="btn-back"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>

                        {/* CREATE */}
                        <button
                            onClick={() =>
                                navigate("/create")
                            }
                            className="btn-primary"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <Plus size={18} />
                            Create Invoice
                        </button>

                    </div>

                </motion.div>

                {/* SEARCH */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        position: "relative",
                        marginBottom: "25px",
                    }}
                >

                    <Search
                        style={{
                            position: "absolute",
                            left: "15px",
                            top: "50%",
                            transform:
                                "translateY(-50%)",
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
                            maxWidth: "450px",
                        }}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                    />

                </motion.div>

                {/* TABLE */}
                <motion.div
                    className="table-container"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >

                    <table className="custom-table">

                        <thead>

                            <tr>
                                <th>Invoice</th>
                                <th>Client Details</th>
                                <th>Date</th>
                                <th>Total Amount</th>

                                <th
                                    style={{
                                        textAlign: "center",
                                    }}
                                >
                                    Actions
                                </th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredData.map((item) => (

                                <tr key={item.id}>

                                    {/* INVOICE */}
                                    <td>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                gap: "10px",
                                            }}
                                        >

                                            <div
                                                style={{
                                                    background:
                                                        "#eef2ff",

                                                    padding:
                                                        "10px",

                                                    borderRadius:
                                                        "12px",
                                                }}
                                            >

                                                <FileText
                                                    size={18}
                                                    color="#4f46e5"
                                                />

                                            </div>

                                            <span
                                                style={{
                                                    fontWeight:
                                                        "700",

                                                    color:
                                                        "#1e293b",
                                                }}
                                            >
                                                {
                                                    item.invoiceNo
                                                }
                                            </span>

                                        </div>

                                    </td>

                                    {/* CLIENT */}
                                    <td>

                                        <div
                                            style={{
                                                fontSize:
                                                    "14px",

                                                fontWeight:
                                                    "600",
                                            }}
                                        >
                                            {item.email}
                                        </div>

                                        <div
                                            style={{
                                                fontSize:
                                                    "12px",

                                                color:
                                                    "#64748b",
                                            }}
                                        >
                                            {item.contact}
                                        </div>

                                    </td>

                                    {/* DATE */}
                                    <td
                                        style={{
                                            color:
                                                "#475569",

                                            fontSize:
                                                "14px",
                                        }}
                                    >
                                        {item.date}
                                    </td>

                                    {/* TOTAL */}
                                    <td>

                                        <div
                                            style={{
                                                color:
                                                    "#10b981",

                                                fontWeight:
                                                    "800",
                                            }}
                                        >
                                            ₹{item.total}
                                        </div>

                                        <div
                                            style={{
                                                fontSize:
                                                    "10px",

                                                color:
                                                    "#94a3b8",
                                            }}
                                        >
                                            Incl. 18% GST
                                        </div>

                                    </td>

                                    {/* ACTIONS */}
                                    <td>

                                        <div
                                            style={{
                                                display:
                                                    "flex",

                                                gap: "10px",

                                                justifyContent:
                                                    "center",

                                                alignItems:
                                                    "center",

                                                flexWrap:
                                                    "wrap",
                                            }}
                                        >

                                            {/* VIEW */}
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/preview/${item.id}`
                                                    )
                                                }
                                                className="action-btn btn-view"
                                                title="View Invoice"
                                            >

                                                <Eye
                                                    size={18}
                                                    strokeWidth={2.5}
                                                    color="#0284c7"
                                                />

                                            </button>

                                            {/* EDIT */}
                                            <button
                                                onClick={() => {

                                                    setEditData(
                                                        item
                                                    );

                                                    setErrors(
                                                        {}
                                                    );
                                                }}
                                                className="action-btn btn-edit"
                                                title="Edit Invoice"
                                            >

                                                <Edit3
                                                    size={18}
                                                    strokeWidth={2.5}
                                                    color="#7c3aed"
                                                />

                                            </button>

                                            {/* DELETE */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id
                                                    )
                                                }
                                                className="action-btn btn-delete"
                                                title="Delete Invoice"
                                            >

                                                <Trash2
                                                    size={18}
                                                    strokeWidth={2.5}
                                                    color="#dc2626"
                                                />

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    {/* EMPTY */}
                    {filteredData.length === 0 && (

                        <div
                            style={{
                                padding: "70px 20px",
                                textAlign: "center",
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "45px",
                                    marginBottom:
                                        "10px",
                                }}
                            >
                                🔍
                            </div>

                            <p
                                style={{
                                    color: "#64748b",
                                }}
                            >
                                No matching invoices found.
                            </p>

                        </div>

                    )}

                </motion.div>

                {/* EDIT MODAL */}
                {editData && (

                    <div className="edit-overlay">

                        <motion.div
                            className="edit-modal"
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                        >

                            {/* CLOSE */}
                            <button
                                className="btn-back"
                                style={{
                                    position:
                                        "absolute",

                                    right: "20px",

                                    top: "20px",

                                    padding: "8px",
                                }}
                                onClick={() =>
                                    setEditData(null)
                                }
                            >
                                <X size={20} />
                            </button>

                            <h2
                                className="db-title"
                                style={{
                                    fontSize: "22px",
                                    marginBottom:
                                        "25px",
                                }}
                            >
                                Edit Invoice
                            </h2>

                            {/* FORM */}
                            <form
                                onSubmit={handleUpdate}
                            >

                                <div className="form-grid">

                                    {/* EMAIL */}
                                    <div className="form-group">

                                        <label>
                                            Client Email
                                        </label>

                                        <input
                                            type="email"
                                            value={
                                                editData.email
                                            }
                                            className="form-input"
                                            onChange={(e) =>
                                                setEditData(
                                                    {
                                                        ...editData,
                                                        email:
                                                            e.target.value,
                                                    }
                                                )
                                            }
                                        />

                                        {errors.email && (
                                            <p className="error-text">
                                                {
                                                    errors.email
                                                }
                                            </p>
                                        )}

                                    </div>

                                    {/* AMOUNT */}
                                    <div className="form-group">

                                        <label>
                                            Amount
                                            (Basic)
                                        </label>

                                        <input
                                            type="number"
                                            value={
                                                editData.amount
                                            }
                                            className="form-input"
                                            onChange={(e) =>
                                                setEditData(
                                                    {
                                                        ...editData,
                                                        amount:
                                                            e.target.value,
                                                    }
                                                )
                                            }
                                        />

                                        {errors.amount && (
                                            <p className="error-text">
                                                {
                                                    errors.amount
                                                }
                                            </p>
                                        )}

                                    </div>

                                </div>

                                {/* BUTTONS */}
                                <div
                                    className="btn-group"
                                    style={{
                                        marginTop:
                                            "30px",
                                    }}
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditData(
                                                null
                                            )
                                        }
                                        className="btn-back"
                                        style={{
                                            flex: 1,
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn-save"
                                        style={{
                                            flex: 2,
                                        }}
                                    >
                                        Save Changes
                                    </button>

                                </div>

                            </form>

                        </motion.div>

                    </div>

                )}

            </main>

            <Footer />

        </div>
    );
}