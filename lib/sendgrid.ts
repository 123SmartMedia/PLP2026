import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = "bookings@playlikeaprobaseball.com";
const ADMIN_EMAIL = "admin@123smartmedia.com"; // TODO: switch to admin@playlikeaprobaseball.com
const BRAND_NAME = "Play Like a Pro";

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  coachName: string | null;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  totalCents: number;
  bookingId: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const date = formatDate(data.startTime);
  const startTime = formatTime(data.startTime);
  const endTime = formatTime(data.endTime);
  const amount = formatMoney(data.totalCents);

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#0f2645;padding:32px;text-align:center;">
        <h1 style="color:#d4a017;margin:0;font-size:24px;">${BRAND_NAME}</h1>
        <p style="color:#fff;margin:8px 0 0;">Booking Confirmed</p>
      </div>
      <div style="padding:32px;">
        <p>Hi ${data.customerName},</p>
        <p>Your booking is confirmed! Here are the details:</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 8px;font-weight:bold;width:40%;">Service</td>
            <td style="padding:12px 8px;">${data.serviceName}</td>
          </tr>
          ${data.coachName ? `
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 8px;font-weight:bold;">Coach</td>
            <td style="padding:12px 8px;">${data.coachName}</td>
          </tr>` : ""}
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 8px;font-weight:bold;">Date</td>
            <td style="padding:12px 8px;">${date}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:12px 8px;font-weight:bold;">Time</td>
            <td style="padding:12px 8px;">${startTime} – ${endTime} ET</td>
          </tr>
          <tr>
            <td style="padding:12px 8px;font-weight:bold;">Amount Paid</td>
            <td style="padding:12px 8px;">${amount}</td>
          </tr>
        </table>
        <p style="color:#666;font-size:14px;">
          Questions? Reply to this email or call us. We look forward to seeing you!
        </p>
        <p style="color:#666;font-size:14px;">Booking ID: ${data.bookingId}</p>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999;">
        ${BRAND_NAME} · Hauppauge, NY
      </div>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <h2>New Booking — ${data.serviceName}</h2>
      <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
      ${data.coachName ? `<p><strong>Coach:</strong> ${data.coachName}</p>` : ""}
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${startTime} – ${endTime} ET</p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Booking ID:</strong> ${data.bookingId}</p>
    </div>
  `;

  await Promise.all([
    sgMail.send({
      to: data.customerEmail,
      from: { email: FROM_EMAIL, name: BRAND_NAME },
      subject: `Booking Confirmed — ${data.serviceName} on ${date}`,
      html: customerHtml,
    }),
    sgMail.send({
      to: ADMIN_EMAIL,
      from: { email: FROM_EMAIL, name: BRAND_NAME },
      subject: `New Booking: ${data.customerName} — ${data.serviceName}`,
      html: adminHtml,
    }),
  ]);
}
