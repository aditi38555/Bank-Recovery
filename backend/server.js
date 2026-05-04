const express = require("express");
const cors = require("cors");

const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", invoiceRoutes);

app.listen(5000, () => console.log("Server running 🚀"));