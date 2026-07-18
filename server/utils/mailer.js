import nodemailer from 'nodemailer';

/**
 * Send an email verification link to a newly registered student.
 * @param {string} toEmail   - Recipient's institutional email
 * @param {string} name      - Recipient's full name
 * @param {string} token     - Verification token (stored on the User document)
 */
export const sendVerificationEmail = async (toEmail, name, token) => {
  // Reusable transporter — created lazily so dotenv config is already run
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Resolve frontend base URL: use custom domain in production, local fallback in development
  const clientBase = (process.env.NODE_ENV === 'production' || process.env.VERCEL)
    ? 'https://unihubogb.name.ng'
    : (process.env.CLIENT_URL || 'http://localhost:5173');

  const verifyURL = `${clientBase.replace(/\/$/, '')}/verify/${token}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your UniHub OGB account</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Roboto:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-spacing: 0;
      width: 100%;
    }
    td {
      padding: 0;
    }
    a {
      text-decoration: none;
    }
    .wrapper {
      background-color: #f9f9f9;
      padding: 40px 16px;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e8e8e8;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(22, 24, 27, 0.03);
    }
    .header {
      background-color: #16181b;
      padding: 32px 40px;
      text-align: left;
    }
    .logo-mark {
      display: inline-block;
      width: 32px;
      height: 32px;
      line-height: 32px;
      background: linear-gradient(135deg, #745a23, #ffdb98);
      border-radius: 8px;
      color: #16181b;
      font-weight: 700;
      font-family: 'Poppins', sans-serif;
      font-size: 18px;
      text-align: center;
      vertical-align: middle;
      margin-right: 12px;
    }
    .brand-title {
      display: inline-block;
      font-family: 'Poppins', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      vertical-align: middle;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      margin-top: 4px;
      font-size: 10px;
      color: #ffdb98;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 500;
    }
    .content-body {
      padding: 40px;
    }
    .greeting {
      font-family: 'Poppins', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #16181b;
      margin: 0 0 16px 0;
    }
    .text {
      font-size: 15px;
      color: #46464b;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .highlight-card {
      background-color: #f3f3f3;
      border-left: 4px solid #745a23;
      border-radius: 8px;
      padding: 18px 24px;
      margin-bottom: 28px;
    }
    .highlight-title {
      font-weight: 500;
      font-size: 14px;
      color: #16181b;
      margin: 0 0 4px 0;
    }
    .highlight-desc {
      font-size: 13px;
      color: #46464b;
      margin: 0;
    }
    .btn-container {
      margin-bottom: 32px;
    }
    .btn {
      display: inline-block;
      background-color: #16181b;
      color: #ffffff !important;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 600;
      padding: 16px 36px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(22, 24, 27, 0.15);
      transition: background-color 0.2s ease;
    }
    .footer {
      background-color: #ffffff;
      border-top: 1px solid #eeeeee;
      padding: 24px 40px;
      text-align: center;
    }
    .footer-text {
      font-size: 12px;
      color: #76777b;
      margin: 0 0 8px 0;
    }
    .footer-subtext {
      font-size: 11px;
      color: #c7c6cb;
      margin: 0;
    }
    .fallback-url {
      font-size: 11px;
      color: #76777b;
      word-break: break-all;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <table>
          <tr>
            <td>
              <span class="logo-mark">U</span>
              <span class="brand-title">UniHub OGB</span>
              <div class="brand-sub">LAUTECH Ecosystem Hub</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Main Body -->
      <div class="content-body">
        <h1 class="greeting">Confirm Your Registration</h1>
        <p class="text">
          Hello <strong>${name}</strong>,<br/>
          Thank you for signing up for UniHub OGB. To finalize your student registration and gain secure access to the ecosystem portal, please verify your email address.
        </p>

        <!-- CTA Verification Button -->
        <div class="btn-container">
          <a href="${verifyURL}" class="btn">Verify and Join the Hub →</a>
        </div>

        <!-- Info Card -->
        <div class="highlight-card">
          <h2 class="highlight-title">Security Information</h2>
          <p class="highlight-desc">
            This verification link is secure, matching your student token, and will expire in 24 hours.
          </p>
        </div>

        <!-- Fallback Link -->
        <p class="text" style="font-size: 12px; margin-bottom: 0;">
          If the button does not open, copy and paste this verification path into your web browser:
        </p>
        <p class="fallback-url">
          <a href="${verifyURL}" style="color: #745a23;">${verifyURL}</a>
        </p>
      </div>

      <!-- Footer Info -->
      <div class="footer">
        <p class="footer-text">
          © ${new Date().getFullYear()} UniHub OGB — Ladoke Akintola University of Technology.
        </p>
        <p class="footer-subtext">
          This is an automated security message. Please do not reply directly to this mail.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"UniHub OGB" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify your UniHub OGB student account',
    html,
  });
};
