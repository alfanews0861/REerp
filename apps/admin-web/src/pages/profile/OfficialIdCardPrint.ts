import { UserProfile, CADRE_DISPLAY_NAMES, CadreLevel } from '@real-estate-erp/types';

export function generateIdCardHtml(user: UserProfile | any): string {
  const referralCode = user?.referralCode || `REF-${(user?.uid || 'USER').substring(0, 6).toUpperCase()}`;
  const referralLink = `https://reerp-website.web.app/join?ref=${referralCode}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(referralLink)}`;
  const cadreLabel = user?.cadre
    ? CADRE_DISPLAY_NAMES[user.cadre as CadreLevel] || String(user.cadre).toUpperCase()
    : (user?.role || 'ASSOCIATE').replace('_', ' ').toUpperCase();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'Aug 2024';

  const bloodGroup = user?.kycDetails?.bloodGroup || user?.bloodGroup || 'O+';
  const emergencyPhone = user?.emergencyContact || '+91 98480 00000';
  const userPhone = user?.phoneNumber || user?.phone || '+91 91738 11009';
  const userName = user?.displayName || 'Enterprise Associate';
  const avatarLetter = userName.charAt(0).toUpperCase();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official ID Card - ${userName} (${referralCode})</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
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
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    .print-header {
      text-align: center;
      margin-bottom: 24px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 12px;
      width: 100%;
      max-width: 780px;
    }
    .print-header h1 {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.5px;
    }
    .print-header p {
      font-size: 11px;
      color: #64748b;
      margin-top: 3px;
    }
    .cards-container {
      display: flex;
      gap: 32px;
      justify-content: center;
      align-items: flex-start;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .card-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .card-label {
      font-size: 12px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    /* Standard ID Card dimensions: 54mm x 86mm (approx 340px x 530px at standard DPI) */
    .id-card {
      width: 330px;
      height: 520px;
      border-radius: 16px;
      border: 2px solid #0f172a;
      overflow: hidden;
      position: relative;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      background: #ffffff;
    }
    /* Front Side Styling */
    .card-front-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 16px 14px 12px 14px;
      text-align: center;
      position: relative;
    }
    .company-name {
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #f8fafc;
      text-transform: uppercase;
    }
    .company-sub {
      font-size: 8.5px;
      color: #f59e0b;
      font-weight: 700;
      letter-spacing: 0.8px;
      margin-top: 2px;
      text-transform: uppercase;
    }
    .card-front-body {
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      background: #ffffff;
    }
    .avatar-box {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      font-size: 34px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4px solid #ffffff;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
      margin-bottom: 10px;
      margin-top: -6px;
    }
    .person-name {
      font-size: 17px;
      font-weight: 800;
      color: #0f172a;
      text-align: center;
      line-height: 1.2;
    }
    .cadre-pill {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 3px 12px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 6px;
      margin-bottom: 12px;
    }
    .meta-table {
      width: 100%;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 11px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .meta-key {
      color: #64748b;
      font-weight: 600;
    }
    .meta-val {
      color: #0f172a;
      font-weight: 700;
      text-align: right;
    }
    .card-front-footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sign-section {
      text-align: center;
    }
    .sign-line {
      width: 90px;
      height: 18px;
      border-bottom: 1px dashed #64748b;
      margin-bottom: 3px;
    }
    .sign-label {
      font-size: 8px;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
    }
    .seal-pill {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
    }

    /* Back Side Styling */
    .card-back-header {
      background: #0f172a;
      color: #ffffff;
      padding: 12px 14px;
      text-align: center;
    }
    .card-back-header h2 {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #f8fafc;
    }
    .card-back-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      flex: 1;
      background: #ffffff;
    }
    .qr-container {
      background: #ffffff;
      padding: 6px;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      margin-bottom: 10px;
      display: inline-block;
    }
    .qr-container img {
      width: 120px;
      height: 120px;
      display: block;
    }
    .qr-caption {
      font-size: 9.5px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 12px;
    }
    .instructions-box {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 9px;
      color: #475569;
      text-align: left;
      line-height: 1.4;
      width: 100%;
      margin-bottom: 10px;
    }
    .card-back-footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 8px 12px;
      text-align: center;
      font-size: 8px;
      color: #64748b;
      line-height: 1.3;
      width: 100%;
    }
    .cut-guidelines {
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      margin-top: 14px;
      border: 1px dashed #cbd5e1;
      padding: 8px 16px;
      border-radius: 6px;
      max-width: 600px;
    }
  </style>
</head>
<body>
  <div class="print-header">
    <h1>ISKON DEVELOPERS &amp; INFRA PVT. LTD.</h1>
    <p>Official Enterprise Associate Identification Card &bull; Verification Identifier: ${referralCode}</p>
  </div>

  <div class="cards-container">
    <!-- FRONT SIDE -->
    <div class="card-wrapper">
      <div class="card-label">Front Side</div>
      <div class="id-card">
        <div class="card-front-header">
          <div class="company-name">ISKON DEVELOPERS</div>
          <div class="company-sub">Townships &bull; Ventures &bull; Real Estate</div>
        </div>

        <div class="card-front-body">
          <div class="avatar-box">${avatarLetter}</div>
          <div class="person-name">${userName}</div>
          <div class="cadre-pill">${cadreLabel}</div>

          <div class="meta-table">
            <div class="meta-row">
              <span class="meta-key">Associate ID:</span>
              <span class="meta-val" style="color: #2563eb;">${referralCode}</span>
            </div>
            <div class="meta-row">
              <span class="meta-key">Mobile:</span>
              <span class="meta-val">${userPhone}</span>
            </div>
            <div class="meta-row">
              <span class="meta-key">Blood Group:</span>
              <span class="meta-val">${bloodGroup}</span>
            </div>
            <div class="meta-row">
              <span class="meta-key">Joined:</span>
              <span class="meta-val">${joinedDate}</span>
            </div>
            <div class="meta-row">
              <span class="meta-key">Branch Hub:</span>
              <span class="meta-val">${user?.kycDetails?.branch || 'Nellore Main Hub'}</span>
            </div>
          </div>
        </div>

        <div class="card-front-footer">
          <div class="sign-section">
            <div class="sign-line"></div>
            <div class="sign-label">Card Holder</div>
          </div>
          <div class="seal-pill">&#9733; Verified Staff</div>
          <div class="sign-section">
            <div class="sign-line"></div>
            <div class="sign-label">Auth Signatory</div>
          </div>
        </div>
      </div>
    </div>

    <!-- BACK SIDE -->
    <div class="card-wrapper">
      <div class="card-label">Back Side</div>
      <div class="id-card">
        <div class="card-back-header">
          <h2>Digital Verification &amp; QR</h2>
        </div>

        <div class="card-back-body">
          <div class="qr-container">
            <img src="${qrCodeUrl}" alt="Referral QR Code" />
          </div>
          <div class="qr-caption">Scan to Register / Verify Referral: <strong>${referralCode}</strong></div>

          <div class="instructions-box">
            <strong>Terms &amp; Emergency Instructions:</strong>
            <ol style="padding-left: 14px; margin-top: 3px;">
              <li>This card remains the property of ISKON Developers &amp; Infra.</li>
              <li>Must be produced upon demand during site visits and client meetings.</li>
              <li>If found, please return to Corporate Office: RKRI Towers, Nellore.</li>
              <li>Emergency Helpline: <strong>${emergencyPhone}</strong></li>
            </ol>
          </div>
        </div>

        <div class="card-back-footer">
          Corporate Office: RKRI Towers, Annamayya Circle, Mini Byepass Road, Nellore - 524 004, AP<br/>
          CIN: U70102AP2020PTC145678 &bull; Helpline: +91 98480 12345
        </div>
      </div>
    </div>
  </div>

  <div class="cut-guidelines">
    ✂ <strong>Print &amp; Cut Instructions:</strong> Print on standard A4 cardstock paper or photo paper. Cut along the outer card borders and insert into a standard plastic ID badge holder (54mm x 86mm).
  </div>
</body>
</html>`;
}

/**
 * Triggers a clean print dialog for the ID card in an isolated window or printable iframe.
 */
export function printIdCardDocument(user: UserProfile | any): void {
  const html = generateIdCardHtml(user);
  const printWindow = window.open('', '_blank', 'width=880,height=750');
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
