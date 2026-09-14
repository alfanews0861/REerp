import { numberToIndianWords } from '@real-estate-erp/utils';
import { PaymentRecord } from '../PaymentsWorkspace';

export function generateReceiptHtml(receipt: PaymentRecord): string {
  const amountWords = numberToIndianWords(receipt.amount);
  const formattedAmount = `₹${receipt.amount.toLocaleString('en-IN')}/-`;
  const paymentDateFormatted = new Date(receipt.paymentDate).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Receipt - ${receipt.receiptNumber}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      padding: 16px;
      font-size: 13px;
      line-height: 1.4;
    }
    .receipt-container {
      border: 2px solid #0f172a;
      border-radius: 8px;
      padding: 24px;
      position: relative;
      background: #ffffff;
      max-width: 800px;
      margin: 0 auto;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 72px;
      font-weight: 900;
      color: rgba(22, 101, 52, 0.08);
      letter-spacing: 6px;
      pointer-events: none;
      white-space: nowrap;
      text-transform: uppercase;
      user-select: none;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .company-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      width: 52px;
      height: 52px;
      background: #0f172a;
      color: #f59e0b;
      font-size: 26px;
      font-weight: 800;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .company-title h1 {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .company-title p {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .company-meta {
      text-align: right;
      font-size: 10px;
      color: #475569;
      line-height: 1.4;
    }
    .doc-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f1f5f9;
      padding: 8px 16px;
      border-radius: 6px;
      margin-bottom: 18px;
      border-left: 5px solid #2563eb;
    }
    .doc-title {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .stamp-pill {
      background: #dcfce7;
      color: #166534;
      font-weight: 700;
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 9999px;
      border: 1px solid #86efac;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    .card-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px 14px;
      background: #fafafa;
    }
    .card-box h3 {
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .data-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 12px;
    }
    .data-row:last-child {
      margin-bottom: 0;
    }
    .data-label {
      color: #64748b;
      font-weight: 500;
    }
    .data-val {
      color: #0f172a;
      font-weight: 600;
      text-align: right;
    }
    .amount-highlight {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 1.5px solid #bfdbfe;
      border-radius: 6px;
      padding: 14px 18px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .amount-left p {
      font-size: 11px;
      font-weight: 700;
      color: #1e40af;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 2px;
    }
    .amount-left h2 {
      font-size: 26px;
      font-weight: 900;
      color: #1e3a8a;
    }
    .amount-right {
      text-align: right;
      max-width: 55%;
    }
    .amount-words {
      font-size: 12px;
      font-weight: 700;
      color: #1e40af;
      font-style: italic;
    }
    .terms-box {
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 10px;
      color: #64748b;
      margin-bottom: 24px;
      background: #f8fafc;
    }
    .terms-box ol {
      padding-left: 14px;
      line-height: 1.5;
    }
    .signatures-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 16px;
    }
    .sig-block {
      text-align: center;
      width: 180px;
    }
    .sig-line {
      height: 36px;
      border-bottom: 1.5px dashed #475569;
      margin-bottom: 6px;
    }
    .sig-title {
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 9px;
      color: #64748b;
    }
    .seal-box {
      border: 2px solid #2563eb;
      border-radius: 50%;
      width: 76px;
      height: 76px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #2563eb;
      font-size: 8px;
      font-weight: 800;
      text-align: center;
      margin: 0 auto 6px auto;
      transform: rotate(-10deg);
      background: rgba(37, 99, 235, 0.03);
    }
    .footer-bar {
      margin-top: 18px;
      text-align: center;
      font-size: 9px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="watermark">PAID &amp; VERIFIED</div>
    
    <!-- Enterprise Header -->
    <div class="header">
      <div class="company-logo">
        <div class="logo-badge">🏢</div>
        <div class="company-title">
          <h1>ISKON DEVELOPERS &amp; INFRA PVT. LTD.</h1>
          <p>Real Estate Enterprise &bull; NUDA &bull; DTCP &bull; AP RERA Approved Townships</p>
        </div>
      </div>
      <div class="company-meta">
        <div><strong>Corporate Office:</strong> RKRI Towers, Annamayya Circle, Mini Byepass Road, Nellore - 524 004, AP</div>
        <div><strong>CIN:</strong> U70102AP2020PTC145678 | <strong>GSTIN:</strong> 37AABCI1429M1ZX</div>
        <div><strong>Helpline:</strong> +91 98480 12345 | <strong>Email:</strong> accounts@iskondevelopers.com</div>
        <div><strong>RERA Registration:</strong> AP RERA Approved</div>
      </div>
    </div>

    <!-- Title & Status -->
    <div class="doc-title-bar">
      <div class="doc-title">OFFICIAL PAYMENT RECEIPT</div>
      <div class="stamp-pill">&#10003; Verified &amp; Credited</div>
    </div>

    <!-- Metadata Grid -->
    <div class="grid-2">
      <!-- Receipt & Customer Info -->
      <div class="card-box">
        <h3>Customer &amp; Receipt Profile</h3>
        <div class="data-row">
          <span class="data-label">Receipt Number:</span>
          <span class="data-val" style="color: #2563eb; font-weight: 800;">${receipt.receiptNumber}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Payment Date &amp; Time:</span>
          <span class="data-val">${paymentDateFormatted}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Customer Name:</span>
          <span class="data-val">${receipt.customerName}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Contact Phone:</span>
          <span class="data-val">${receipt.customerPhone}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Customer ID:</span>
          <span class="data-val">${receipt.customerId}</span>
        </div>
      </div>

      <!-- Booking & Property Info -->
      <div class="card-box">
        <h3>Property &amp; Booking Allocation</h3>
        <div class="data-row">
          <span class="data-label">Booking Reference:</span>
          <span class="data-val" style="font-weight: 700;">${receipt.bookingNumber}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Project / Venture:</span>
          <span class="data-val">${receipt.projectName}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Allocated Plot Number:</span>
          <span class="data-val" style="color: #0f172a; font-weight: 800; font-size: 13px;">${receipt.plotNumber}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Payment Mode:</span>
          <span class="data-val">${receipt.paymentMethod}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Transaction / UTR Ref:</span>
          <span class="data-val">${receipt.transactionRef || 'N/A'}</span>
        </div>
      </div>
    </div>

    <!-- Amount Received Highlight -->
    <div class="amount-highlight">
      <div class="amount-left">
        <p>Total Amount Received</p>
        <h2>${formattedAmount}</h2>
      </div>
      <div class="amount-right">
        <div style="font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">Amount in Words:</div>
        <div class="amount-words">${amountWords}</div>
        ${receipt.remarks ? `<div style="font-size: 10px; color: #475569; margin-top: 4px;"><strong>Purpose / Remarks:</strong> ${receipt.remarks}</div>` : ''}
      </div>
    </div>

    <!-- Terms & Conditions Box -->
    <div class="terms-box">
      <strong>Terms, Conditions &amp; Statutory Disclosures:</strong>
      <ol>
        <li>Payment received via Cheque / Demand Draft is provisional and subject to final bank clearing &amp; realization.</li>
        <li>Token Advance holds reservation for a maximum of 48 hours; allotment confirmation is subject to execution of standard Agreement of Sale.</li>
        <li>All payments are credited towards the specified plot booking account and are non-transferable without prior corporate approval.</li>
        <li>This is a digitally generated system receipt verified electronically with unique identifier <code>${receipt.id}</code>.</li>
      </ol>
    </div>

    <!-- Signatures -->
    <div class="signatures-row">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title">Customer / Remitter Signature</div>
        <div class="sig-sub">Acknowledged &amp; Confirmed</div>
      </div>

      <div class="sig-block">
        <div class="seal-box">
          ISKON<br/>
          ★ SEAL ★<br/>
          ACCOUNTS
        </div>
        <div class="sig-title">Authorized Signatory</div>
        <div class="sig-sub">ISKON Developers &amp; Infra Pvt Ltd</div>
      </div>
    </div>

    <!-- Footer Security Note -->
    <div class="footer-bar">
      Confidential Enterprise Document &bull; Generated via Real Estate ERP &bull; Timestamp: ${new Date().toISOString()} &bull; Page 1 of 1
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Triggers a clean print dialog for the payment receipt in an isolated window or printable iframe.
 */
export function printReceiptDocument(receipt: PaymentRecord): void {
  const html = generateReceiptHtml(receipt);
  const printWindow = window.open('', '_blank', 'width=900,height=750');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Wait for styles and DOM rendering before triggering print
    setTimeout(() => {
      printWindow.print();
    }, 400);
  } else {
    // Fallback if popup blocker blocks new window
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 400);
    }
  }
}
