import { getInvoiceHTML } from "../utils/invoiceTemplate";

export default function InvoicePreview({ data }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: getInvoiceHTML(data),
      }}
    />
  );
}