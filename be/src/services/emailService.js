import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/**
 * @param {string} name
 * @param {string} resetUrl
 * @param {number} expiresMinutes
 */
export function buildResetEmail({ name, resetUrl, expiresMinutes = 15 }) {
  const safeName = name ? escapeHtml(name) : "Bạn";
  const plainText = `${safeName},

Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.

Mở liên kết sau để đặt mật khẩu mới (hết hạn sau ${expiresMinutes} phút):
${resetUrl}

Nếu bạn không yêu cầu việc này, hãy bỏ qua email này.

Trân trọng,
Team Markdown Notes`;

  const html = `<!doctype html>
  <html lang="vi">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>Đặt lại mật khẩu</title>
    <style>
      /* Reset & basic */
      body { margin:0; padding:0; background:#f3f4f6; font-family:Inter, Helvetica, Arial, sans-serif; }
      .container { max-width:680px; margin:32px auto; }
      .card { background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 20px rgba(2,6,23,0.08); }
      .header { padding:28px 32px; background: linear-gradient(90deg,#6366f1,#06b6d4); color:#fff; display:flex; align-items:center; gap:16px; }
      .logo { width:48px; height:48px; border-radius:8px; background:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:700; color:#111827; }
      .title { font-size:18px; font-weight:700; }
      .body { padding:28px 32px; color:#111827; }
      .greeting { font-size:16px; margin-bottom:8px; }
      .desc { font-size:14px; color:#4b5563; margin-bottom:20px; line-height:1.6; }
      .btn { display:inline-block; background:#111827; color:#fff; padding:12px 20px; border-radius:10px; text-decoration:none; font-weight:600; }
      .muted { font-size:12px; color:#6b7280; margin-top:18px; }
      .footer { padding:20px 32px; background:#f9fafb; font-size:12px; color:#6b7280; text-align:center; }
      .note { margin-top:14px; font-size:12px; color:#9ca3af; }
      @media (max-width:520px){
        .header { padding:18px; }
        .body { padding:20px; }
        .container { margin:12px; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <div class="logo">MN</div>
          <div>
            <div class="title">Markdown Notes — Đặt lại mật khẩu</div>
            <div style="font-size:12px; opacity:0.95;">An toàn & nhanh chóng</div>
          </div>
        </div>

        <div class="body">
          <div class="greeting">Xin chào ${safeName},</div>

          <div class="desc">
            Bạn (hoặc người dùng khác) vừa yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email này.
            Nhấn nút bên dưới để đặt mật khẩu mới. Liên kết chỉ có hiệu lực trong <strong>${expiresMinutes} phút</strong>.
          </div>

          <div style="text-align:center; margin:18px 0;">
            <a href="${resetUrl}" class="btn" target="_blank" rel="noopener">Đặt lại mật khẩu</a>
          </div>

          <div style="text-align:center" class="muted">
            Hoặc sao chép liên kết này sang trình duyệt nếu nút không hoạt động:
            <div style="word-break:break-all; color:#374151; margin-top:6px;">${resetUrl}</div>
          </div>

          <div class="note">
            Nếu bạn không yêu cầu điều này, có thể bỏ qua email này — mọi thứ vẫn an toàn.
          </div>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} Markdown Notes · <span style="color:#374151">Bảo mật là ưu tiên hàng đầu</span><br/>
          <small>Địa chỉ giả lập • Email gửi tự động — đừng trả lời thư này</small>
        </div>
      </div>
    </div>
  </body>
  </html>`;

  return { html, text: plainText };
}

export async function sendMail({ to, subject, html, text }) {
  try {
    transporter.sendMail({
      from: `"Markdown Notes" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function sendResetEmail({
  to,
  name,
  resetUrl,
  expiresMinutes = 15,
}) {
  const { html, text } = buildResetEmail({ name, resetUrl, expiresMinutes });
  return sendMail({
    to,
    subject: "Đặt lại mật khẩu — Markdown Notes",
    html,
    text,
  });
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
