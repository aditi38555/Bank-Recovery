const getInvoiceHTML = (data) => {
  return `
  <html>
  <head>
    <style>
      body { font-family: Arial; padding: 30px; font-size: 14px; }
      .container { width: 800px; margin: auto; }
      .header { display: flex; justify-content: space-between; }
      .title { text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 10px; }
      .section { margin-top: 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { border: 1px solid black; padding: 6px; }
      .right { text-align: right; }
      .no-border td { border: none; }
      .bold { font-weight: bold; }
    </style>
  </head>

  <body>
    <div class="container">

      <div class="title">INVOICE</div>

      <div class="header">
        <div>
          <b>NEELKAMAL ASSOCIATES</b><br/>
          SECOND FLOOR JYOTI COMPLEX<br/>
          MP NAGAR BHOPAL
        </div>

        <div>
          <b>Date:</b> ${data.date}<br/>
          <b>Invoice No:</b> ${data.invoiceNo}
        </div>
      </div>

      <div class="section">
        <b>Customer:</b> ${data.branch}
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Service Charges</td>
            <td class="right">${data.amount}</td>
          </tr>
        </tbody>
      </table>

      <table class="no-border">
        <tr>
          <td class="right">Amount</td>
          <td class="right">${data.amount}</td>
        </tr>
        <tr>
          <td class="right">CGST (9%)</td>
          <td class="right">${data.cgst}</td>
        </tr>
        <tr>
          <td class="right">SGST (9%)</td>
          <td class="right">${data.sgst}</td>
        </tr>
        <tr>
          <td class="right bold">Total</td>
          <td class="right bold">${data.total}</td>
        </tr>
      </table>

      <div class="section">
        Amount in words (Without GST): ${data.amountWords}
      </div>

      <div class="section">
        Amount in words (With GST): ${data.totalWords}
      </div>

    </div>
  </body>
  </html>
  `;
};

module.exports = { getInvoiceHTML };