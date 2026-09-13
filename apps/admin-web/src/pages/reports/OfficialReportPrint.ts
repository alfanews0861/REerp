export interface ReportPrintOptions {
  title: string;
  category: string;
  summary: string;
  columns: string[];
  data: { [key: string]: any }[];
  projectFilter?: string;
  periodFilter?: string;
  generatedBy?: string;
}

export function generateReportHtml(options: ReportPrintOptions): string {
  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const projectLabels: { [key: string]: string } = {
    ALL: 'All Townships & Ventures',
    MOKILA: 'Sunrise Enclave (Mokila)',
    SHADNAGAR: 'Green Meadows (Shadnagar)',
    JADCHERLA: 'Palm Meadows (Jadcherla)',
  };

  const periodLabels: { [key: string]: string } = {
    THIS_MONTH: 'Current Month',
    LAST_MONTH: 'Previous Month',
    THIS_QUARTER: 'Current Quarter (Q4)',
    YEAR_TO_DATE: 'Financial Year (FY 2025-26)',
  };

  const projectName = projectLabels[options.projectFilter || 'ALL'] || options.projectFilter || 'All Ventures';
  const periodName = periodLabels[options.periodFilter || 'YEAR_TO_DATE'] || options.periodFilter || 'FY 2025-26';

  const tableHeadersHtml = options.columns
    .map((col) => `<th>${col}</th>`)
    .join('');

  const tableRowsHtml = options.data
    .map(
      (row, idx) => `
      <tr class="${idx % 2 === 1 ? 'even-row' : ''}">
        ${options.columns
          .map((_, colIdx) => {
            const val = row[`col${colIdx}`] || '';
            const isFirst = colIdx === 0;
            const isAmount = String(val).includes('₹') || String(val).includes('%');
            return `<td class="${isFirst ? 'font-bold' : ''} ${isAmount ? 'align-right' : ''}">${val}</td>`;
          })
          .join('')}
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${options.title} - Enterprise Audit Report</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #ffffff;
      color: #0f172a;
      padding: 12px;
      font-size: 12px;
      line-height: 1.4;
    }
    .report-container {
      max-width: 1050px;
      margin: 0 auto;
    }
    /* Enterprise Header */
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .brand-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      width: 44px;
      height: 44px;
      background: #0f172a;
      color: #f59e0b;
      font-size: 22px;
      font-weight: 900;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-text h1 {
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.5px;
    }
    .brand-text p {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .meta-right {
      text-align: right;
      font-size: 10px;
      color: #475569;
      line-height: 1.4;
    }
    /* Report Title & Metadata Banner */
    .title-banner {
      background: #f1f5f9;
      border-left: 5px solid #2563eb;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title-banner h2 {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .title-banner .category-badge {
      background: #dbeafe;
      color: #1e40af;
      padding: 3px 10px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 10px;
      text-transform: uppercase;
    }
    .filters-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 11px;
    }
    .filter-item span.label {
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 9px;
      display: block;
      margin-bottom: 2px;
    }
    .filter-item span.val {
      color: #0f172a;
      font-weight: 700;
    }
    .summary-text {
      font-size: 11px;
      color: #334155;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 16px;
    }
    /* Data Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      font-size: 11.5px;
    }
    table.data-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      text-align: left;
      padding: 9px 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 10px;
      border: 1px solid #0f172a;
    }
    table.data-table td {
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      color: #1e293b;
    }
    table.data-table tr.even-row {
      background: #f8fafc;
    }
    .font-bold {
      font-weight: 700;
      color: #0f172a;
    }
    .align-right {
      text-align: right;
      font-weight: 700;
    }
    /* Footer Signatures */
    .sign-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 14px;
      margin-top: 14px;
      border-top: 1px solid #e2e8f0;
    }
    .sign-block {
      text-align: center;
      width: 180px;
    }
    .sign-line {
      height: 30px;
      border-bottom: 1.5px dashed #475569;
      margin-bottom: 4px;
    }
    .sign-title {
      font-size: 10px;
      font-weight: 700;
      color: #0f172a;
    }
    .sign-sub {
      font-size: 8.5px;
      color: #64748b;
    }
    .footer-note {
      text-align: center;
      font-size: 8.5px;
      color: #94a3b8;
      margin-top: 12px;
      padding-top: 6px;
      border-top: 1px solid #f1f5f9;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <!-- Corporate Header -->
    <div class="header-bar">
      <div class="brand-left">
        <div class="logo-badge">🏢</div>
        <div class="brand-text">
          <h1>SRI CITY DEVELOPERS &amp; INFRA PVT. LTD.</h1>
          <p>Real Estate Enterprise Management &bull; Corporate Audit Reports</p>
        </div>
      </div>
      <div class="meta-right">
        <div><strong>CIN:</strong> U70102TG2020PTC145678</div>
        <div><strong>Corporate HQ:</strong> Financial District, Hyderabad</div>
        <div><strong>Generated:</strong> ${generatedAt}</div>
      </div>
    </div>

    <!-- Title Bar -->
    <div class="title-banner">
      <h2>${options.title}</h2>
      <div class="category-badge">${options.category} AUDIT</div>
    </div>

    <!-- Filter Context -->
    <div class="filters-grid">
      <div class="filter-item">
        <span class="label">Venture Scope:</span>
        <span class="val">${projectName}</span>
      </div>
      <div class="filter-item">
        <span class="label">Time Horizon:</span>
        <span class="val">${periodName}</span>
      </div>
      <div class="filter-item">
        <span class="label">Generated By:</span>
        <span class="val">${options.generatedBy || 'Authorized Management'}</span>
      </div>
      <div class="filter-item">
        <span class="label">Audit Status:</span>
        <span class="val" style="color: #166534;">&#10003; Verified &amp; Signed</span>
      </div>
    </div>

    <div class="summary-text">
      <strong>Scope &amp; Executive Summary:</strong> ${options.summary}
    </div>

    <!-- Data Table -->
    <table class="data-table">
      <thead>
        <tr>
          ${tableHeadersHtml}
        </tr>
      </thead>
      <tbody>
        ${tableRowsHtml}
      </tbody>
    </table>

    <!-- Signature Row -->
    <div class="sign-row">
      <div class="sign-block">
        <div class="sign-line"></div>
        <div class="sign-title">Prepared By</div>
        <div class="sign-sub">ERP System Administrator</div>
      </div>

      <div class="sign-block">
        <div class="sign-line"></div>
        <div class="sign-title">Department Head</div>
        <div class="sign-sub">${options.category} Operations</div>
      </div>

      <div class="sign-block">
        <div class="sign-line"></div>
        <div class="sign-title">Executive Director</div>
        <div class="sign-sub">Sri City Developers &amp; Infra</div>
      </div>
    </div>

    <div class="footer-note">
      Confidential Enterprise Report &bull; Generated from Real Estate ERP Core Platform &bull; Page 1 of 1
    </div>
  </div>
</body>
</html>`;
}

/**
 * Triggers a clean print dialog for the report in an isolated window or printable iframe.
 */
export function printReportDocument(options: ReportPrintOptions): void {
  const html = generateReportHtml(options);
  const printWindow = window.open('', '_blank', 'width=1000,height=750');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  } else {
    // Fallback using invisible iframe
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
