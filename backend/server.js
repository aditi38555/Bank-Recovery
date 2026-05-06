const express = require("express");
const cors = require("cors");
const invoiceRoutes = require("./routes/invoiceRoutes");
const app = express();


app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use("/api", invoiceRoutes);
app.get("/", (req, res) => {   
  res.send("Backend running ");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

