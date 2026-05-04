const express = require("express");
const router = express.Router();

const {
  generateInvoice,
  saveInvoice,
  getAllInvoices,
  deleteInvoice,
  updateInvoice,
  getSingleInvoice
} = require("../controllers/invoiceController");

router.post("/invoice", generateInvoice);
router.post("/save-invoice", saveInvoice);
router.get("/invoices", getAllInvoices);
router.put("/invoice/:id", updateInvoice);
router.delete("/invoice/:id", deleteInvoice);
router.get("/invoice/:id", getSingleInvoice);


module.exports = router;