import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"InternHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('📧 Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
}
export async function sendOTPEmail(to, otp, purpose = 'verification') {
  const subject = `Your InternHub OTP for ${purpose}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', Arial, sans-serif; background: #0F172A; color: #F8FAFC; margin: 0; padding: 0; }
        .container { max-width: 480px; margin: 0 auto; padding: 40px 24px; }
        .card { background: #1E293B; border-radius: 16px; padding: 32px; border: 1px solid rgba(255,255,255,0.1); }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo h1 { font-size: 28px; margin: 0; }
        .logo span { color: #6366F1; }
        .otp-box { background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.15)); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; border: 1px solid rgba(99,102,241,0.3); }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #6366F1; margin: 0; }
        .purpose { color: #94A3B8; font-size: 14px; text-align: center; margin-bottom: 16px; }
        .footer { text-align: center; color: #64748B; font-size: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); }
        .warning { color: #F59E0B; font-size: 13px; text-align: center; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo"><h1>Intern<span>Hub</span></h1></div>
          <p class="purpose">Your OTP for <strong>${purpose}</strong></p>
          <div class="otp-box">
            <p class="otp-code">${otp}</p>
          </div>
          <p class="warning">⚠️ This OTP is valid for 5 minutes. Do not share it with anyone.</p>
          <div class="footer">
            <p>This email was sent by InternHub. If you didn't request this, please ignore it.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail(to, subject, html);
}
export async function sendInvoiceEmail(to, planDetails) {
  const { planName, price, duration, paymentId, startDate, endDate } = planDetails;
  const subject = `InternHub — ${planName} Plan Invoice`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', Arial, sans-serif; background: #0F172A; color: #F8FAFC; margin: 0; padding: 0; }
        .container { max-width: 520px; margin: 0 auto; padding: 40px 24px; }
        .card { background: #1E293B; border-radius: 16px; padding: 32px; border: 1px solid rgba(255,255,255,0.1); }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo h1 { font-size: 28px; margin: 0; }
        .logo span { color: #6366F1; }
        .badge { display: inline-block; background: linear-gradient(135deg, #6366F1, #06B6D4); color: #fff; padding: 6px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; }
        .invoice-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        .invoice-table td { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; }
        .invoice-table td:first-child { color: #94A3B8; }
        .invoice-table td:last-child { text-align: right; font-weight: 600; }
        .total { background: rgba(99,102,241,0.1); border-radius: 12px; padding: 16px; text-align: center; margin: 16px 0; }
        .total .amount { font-size: 32px; font-weight: 800; color: #6366F1; }
        .footer { text-align: center; color: #64748B; font-size: 12px; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo"><h1>Intern<span>Hub</span></h1></div>
          <p style="text-align:center;"><span class="badge">✨ ${planName} Plan Activated</span></p>
          <div class="total">
            <p style="color:#94A3B8;font-size:13px;margin:0 0 8px;">Amount Paid</p>
            <p class="amount">₹${price}</p>
          </div>
          <table class="invoice-table">
            <tr><td>Plan</td><td>${planName}</td></tr>
            <tr><td>Duration</td><td>${duration}</td></tr>
            <tr><td>Payment ID</td><td style="font-size:12px;">${paymentId}</td></tr>
            <tr><td>Start Date</td><td>${startDate}</td></tr>
            <tr><td>End Date</td><td>${endDate}</td></tr>
          </table>
          <div class="footer">
            <p>Thank you for choosing InternHub! 🚀</p>
            <p>If you have any questions, reply to this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail(to, subject, html);
}
export async function sendPasswordResetEmail(to, newPassword) {
  const subject = 'InternHub — Your New Password';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', Arial, sans-serif; background: #0F172A; color: #F8FAFC; margin: 0; padding: 0; }
        .container { max-width: 480px; margin: 0 auto; padding: 40px 24px; }
        .card { background: #1E293B; border-radius: 16px; padding: 32px; border: 1px solid rgba(255,255,255,0.1); }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo h1 { font-size: 28px; margin: 0; }
        .logo span { color: #6366F1; }
        .password-box { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .password { font-size: 24px; font-weight: 700; color: #818CF8; letter-spacing: 2px; font-family: monospace; }
        .warning { color: #F59E0B; font-size: 13px; text-align: center; }
        .footer { text-align: center; color: #64748B; font-size: 12px; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo"><h1>Intern<span>Hub</span></h1></div>
          <p style="text-align:center;color:#94A3B8;">Your password has been reset. Here is your new password:</p>
          <div class="password-box">
            <p class="password">${newPassword}</p>
          </div>
          <p class="warning">⚠️ Please login and change your password immediately for security.</p>
          <p class="warning">You can only reset your password once per day.</p>
          <div class="footer">
            <p>If you didn't request this, please contact support immediately.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail(to, subject, html);
}
