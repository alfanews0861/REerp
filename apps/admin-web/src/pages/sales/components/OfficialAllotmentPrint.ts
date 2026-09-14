import { numberToIndianWords } from '@real-estate-erp/utils';
import { BookingItem } from '../BookingsWorkspace';

export function generateAllotmentLetterHtml(booking: BookingItem): string {
  const finalAmountWords = numberToIndianWords(booking.finalAmount);
  const tokenAmountWords = numberToIndianWords(booking.tokenAmount);
  const bookingDateFormatted = new Date(booking.bookingDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const balanceOutstanding = Math.max(0, booking.finalAmount - booking.totalPaidAmount);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Provisional Allotment Letter - ${booking.bookingNumber}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 16px;
      font-size: 13px;
      line-height: 1.5;
    }
    .letter-container {
      border: 2px solid #1e293b;
      border-radius: 8px;
      padding: 28px;
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 64px;
      font-weight: 900;
      color: rgba(30, 58, 138, 0.05);
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
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .company-title h1 {
      font-size: 21px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.5px;
    }
    .company-title p {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }
    .company-meta {
      text-align: right;
      font-size: 10px;
      color: #475569;
    }
    .ref-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      font-size: 12px;
    }
    .subject-line {
      background: #f1f5f9;
      border-left: 4px solid #1e3a8a;
      padding: 10px 14px;
      font-weight: 700;
      margin-bottom: 16px;
      font-size: 13px;
    }
    .table-spec {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12px;
    }
    .table-spec th, .table-spec td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
    }
    .table-spec th {
      background: #f8fafc;
      font-weight: 700;
      text-align: left;
      color: #475569;
    }
    .terms-box {
      font-size: 11px;
      color: #475569;
      margin: 18px 0;
      line-height: 1.6;
    }
    .terms-box ol {
      padding-left: 18px;
    }
    .sig-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 36px;
    }
    .sig-box {
      text-align: center;
      width: 200px;
    }
    .sig-line {
      border-bottom: 1.5px dashed #475569;
      height: 40px;
      margin-bottom: 6px;
    }
    .seal-box {
      border: 2px solid #1e3a8a;
      border-radius: 50%;
      width: 72px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1e3a8a;
      font-size: 8px;
      font-weight: 800;
      text-align: center;
      margin: 0 auto 8px auto;
      transform: rotate(-10deg);
    }
  </style>
</head>
<body>
  <div class="letter-container">
    <div class="watermark">ALLOTMENT LETTER</div>
    
    <div class="header">
      <div>
        <div class="company-title">
          <h1>ISKON DEVELOPERS &amp; INFRA PVT. LTD.</h1>
          <p>Real Estate &bull; NUDA / DTCP Approved Gated Townships</p>
        </div>
      </div>
      <div class="company-meta">
        <div><strong>Corporate Office:</strong> RKRI Towers, Annamayya Circle, Mini Byepass Road, Nellore - 524 004, AP</div>
        <div><strong>CIN:</strong> U70102AP2020PTC145678 | <strong>GST:</strong> 37AABCI1429M1ZX</div>
        <div><strong>RERA Registration:</strong> AP RERA Approved</div>
      </div>
    </div>

    <div class="ref-bar">
      <div><strong>Ref No:</strong> ALLOT/${booking.bookingNumber}</div>
      <div><strong>Date:</strong> ${bookingDateFormatted}</div>
    </div>

    <div style="margin-bottom: 14px;">
      <strong>To:</strong><br/>
      ${booking.customerName}<br/>
      Phone: ${booking.customerPhone}<br/>
      Customer Ref: ${booking.customerId}
    </div>

    <div class="subject-line">
      SUBJECT: PROVISIONAL ALLOTMENT LETTER FOR PLOT NO. ${booking.plotNumber} IN "${booking.projectName.toUpperCase()}"
    </div>

    <p style="margin-bottom: 12px;">
      Dear <strong>${booking.customerName}</strong>,
    </p>
    <p style="margin-bottom: 14px;">
      We are delighted to confirm that based on your application and payment of initial booking token advance, you have been provisionally allotted the residential villa plot described in the schedule below:
    </p>

    <table class="table-spec">
      <tr>
        <th style="width: 35%;">Project / Layout Name</th>
        <td><strong>${booking.projectName}</strong></td>
      </tr>
      <tr>
        <th>Allotted Plot Number</th>
        <td><strong style="color: #1e3a8a; font-size: 14px;">${booking.plotNumber}</strong></td>
      </tr>
      <tr>
        <th>Total Agreed Sale Value</th>
        <td><strong>₹${booking.finalAmount.toLocaleString('en-IN')}/-</strong> (${finalAmountWords})</td>
      </tr>
      <tr>
        <th>Token Advance Received</th>
        <td><strong>₹${booking.totalPaidAmount.toLocaleString('en-IN')}/-</strong> (${tokenAmountWords})</td>
      </tr>
      <tr>
        <th>Balance Outstanding Payable</th>
        <td><strong style="color: #dc2626;">₹${balanceOutstanding.toLocaleString('en-IN')}/-</strong></td>
      </tr>
      <tr>
        <th>Payment Plan Selected</th>
        <td style="text-transform: capitalize;">${booking.paymentPlanType || 'Standard Installment'}</td>
      </tr>
      <tr>
        <th>Booking Status</th>
        <td style="text-transform: uppercase; font-weight: 700;">${booking.status}</td>
      </tr>
    </table>

    <div class="terms-box">
      <strong>Terms &amp; Conditions of Allotment:</strong>
      <ol>
        <li>This provisional allotment is subject to execution of the standard Agreement of Sale within 15 days of this letter.</li>
        <li>The balance consideration must be paid as per the agreed payment schedule or bank loan disbursement.</li>
        <li>Registration of the sale deed will be executed upon 100% receipt and clearance of the full sale value and applicable statutory charges.</li>
        <li>All infrastructure developments, electricity lines, underground drainage, and water supply will be delivered in accordance with NUDA/DTCP sanctioned plans.</li>
      </ol>
    </div>

    <div class="sig-row">
      <div class="sig-box">
        <div class="sig-line"></div>
        <strong>Allottee Acceptance</strong><br/>
        <span style="font-size: 10px; color: #64748b;">(${booking.customerName})</span>
      </div>

      <div class="sig-box">
        <div class="seal-box">
          ISKON<br/>
          ★ SEAL ★<br/>
          ALLOTMENT
        </div>
        <strong>Authorized Signatory</strong><br/>
        <span style="font-size: 10px; color: #64748b;">ISKON Developers &amp; Infra Pvt Ltd</span>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function printAllotmentLetter(booking: BookingItem): void {
  const html = generateAllotmentLetterHtml(booking);
  const printWindow = window.open('', '_blank', 'width=900,height=750');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}
