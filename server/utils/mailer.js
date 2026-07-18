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
</head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:36px 48px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#c9a84c;letter-spacing:1px;">
                UniHub <span style="color:#ffffff;">OGB</span>
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,.55);letter-spacing:2px;text-transform:uppercase;">
                Ladoke Akintola University of Technology
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 32px;">
              <h1 style="margin:0 0 8px;font-size:24px;color:#1a1a2e;font-weight:700;">
                Verify your email address
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
                Hi <strong>${name}</strong>, welcome to UniHub OGB — the unified digital core of LAUTECH.
                <br/>Please confirm your student email address to activate your account.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#c9a84c;border-radius:10px;">
                    <a href="${verifyURL}"
                       style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;
                              color:#1a1a2e;text-decoration:none;letter-spacing:.5px;">
                      Activate My Account →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#888;line-height:1.6;">
                This link expires in <strong>24 hours</strong>. If you did not create a UniHub OGB account,
                you can safely ignore this email.
              </p>

              <!-- Fallback URL -->
              <p style="margin:24px 0 0;font-size:12px;color:#aaa;">
                If the button doesn't work, copy and paste this URL into your browser:
              </p>
              <p style="margin:4px 0 0;font-size:12px;word-break:break-all;">
                <a href="${verifyURL}" style="color:#0f3460;">${verifyURL}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f8f8;border-top:1px solid #ececec;padding:20px 48px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#bbb;">
                © ${new Date().getFullYear()} UniHub OGB · LAUTECH Digital Infrastructure
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
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
