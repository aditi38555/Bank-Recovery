import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import InvoiceForm from "./pages/InvoiceForm";
import InvoicesList from "./pages/InvoicesList";
import InvoicePreviewPage from "./pages/InvoicePreviewPage";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<InvoiceForm />} /> 
        <Route path="/invoices" element={<InvoicesList />} />
          <Route path="/preview/:id" element={<InvoicePreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;