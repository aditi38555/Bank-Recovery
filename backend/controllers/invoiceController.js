const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const { getInvoiceHTML } = require("../utils/invoiceTemplate");
const db = require("../config/db"); // 👈 ADD THIS

// ✅ PDF GENERATE (already hai)
const generateInvoice = async (req, res) => {
  try {

    const browser = await puppeteer.launch({
     args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();

    const html = getInvoiceHTML(req.body);

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf"
    });

    res.send(pdf);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating invoice");
  }
};


// ✅ NEW: SAVE DATA TO DB
const saveInvoice = (req, res) => {
  const {
    date,
    invoiceNo,
    email,
    contact,
    branch,
    bank,
    gstin,
    amount,
    cgst,
    sgst,
    total
  } = req.body;

  const sql = `
    INSERT INTO invoices 
    (date, invoiceNo, email, contact, branch, bank, gstin, amount, cgst, sgst, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [date, invoiceNo, email, contact, branch, bank, gstin, amount, cgst, sgst, total],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error saving data");
      }
      res.send("Invoice saved successfully ✅");
    }
  );
};

// ✅ GET ALL INVOICES
const getAllInvoices = (req, res) => {
  const sql = "SELECT * FROM invoices ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching data");
    }
    res.json(result);
  });
};

// ✅ DELETE
const deleteInvoice = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM invoices WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send("Delete error");
    res.send("Deleted successfully");
  });
};

// ✅ UPDATE
const updateInvoice = (req, res) => {

  const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};
  const formattedDate = formatDate(req.body.date);


  const { id } = req.params;

  const {
    date,
    email,
    contact,
    branch,
    bank,
    gstin,
    amount,
    cgst,
    sgst,
    total
  } = req.body;

  const sql = `
    UPDATE invoices 
    SET date=?, email=?, contact=?, branch=?, bank=?, gstin=?, amount=?, cgst=?, sgst=?, total=?
    WHERE id=?
  `;

  db.query(
    sql,
    [formattedDate, email, contact, branch, bank, gstin, amount, cgst, sgst, total, id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Update error");
      }
      res.send("Updated successfully");
    }
  );
};


const getSingleInvoice = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM invoices WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching invoice");
    }

    if (result.length === 0) {
      return res.status(404).send("Invoice not found");
    }

    res.json(result[0]);
  });
};

module.exports = { generateInvoice, saveInvoice, getAllInvoices, deleteInvoice, updateInvoice, getSingleInvoice };