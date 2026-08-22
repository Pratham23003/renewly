export const generateEmailTemplate = ({
  userName,
  subscriptionName,
  renewalDate,
  planName,
  price,
  paymentMethod,
  daysLeft,
}) => {
  const isUrgent = daysLeft <= 2;
  const badgeColor = isUrgent ? "#F59E0B" : "#3B82F6";
  const badgeBg = isUrgent ? "rgba(245, 158, 11, 0.15)" : "rgba(59, 130, 246, 0.15)";
  const dashboardUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Renewly Reminder</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0F17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0B0F17; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #161E2E; border: 1px solid #232F45; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 24px 28px 18px; border-bottom: 1px solid #232F45; background-color: #111827;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.5px;">
                      Renew<span style="color: #3B82F6;">ly</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 12px; font-size: 11px; font-weight: 600; color: ${badgeColor}; background-color: ${badgeBg}; border: 1px solid ${badgeColor}; border-radius: 9999px;">
                      ${daysLeft === 1 ? '⚡ Renews Tomorrow' : `🔔 ${daysLeft} Days Left`}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 28px;">
              <h1 style="margin: 0 0 10px; font-size: 19px; font-weight: 600; color: #FFFFFF;">
                Upcoming Renewal Alert
              </h1>
              
              <p style="margin: 0 0 22px; font-size: 14px; line-height: 1.6; color: #94A3B8;">
                Hi <strong style="color: #F8FAFC;">${userName}</strong>, your <strong style="color: #3B82F6;">${subscriptionName}</strong> subscription will renew on <strong style="color: #F8FAFC;">${renewalDate}</strong>.
              </p>

              <!-- Subscription Summary Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0F172A; border: 1px solid #1E293B; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1E293B;">
                    <span style="font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Service</span><br>
                    <span style="font-size: 15px; font-weight: 600; color: #F8FAFC;">${subscriptionName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1E293B;">
                    <span style="font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Renewal Amount</span><br>
                    <span style="font-size: 18px; font-weight: 700; color: #38BDF8; font-family: monospace;">${price}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px;">
                    <span style="font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Payment Method</span><br>
                    <span style="font-size: 14px; color: #CBD5E1;">${paymentMethod || "Saved Payment Method"}</span>
                  </td>
                </tr>
              </table>

              <!-- Call to Action -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 8px;">
                    <a href="${dashboardUrl}/dashboard" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                      Manage in Renewly Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 18px 28px; background-color: #0F172A; border-top: 1px solid #1E293B; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748B;">
                Sent automatically by Renewly · Never miss a subscription renewal
              </p>
              <p style="margin: 4px 0 0; font-size: 11px; color: #475569;">
                Built by <a href="https://github.com/Pratham23003/" target="_blank" style="color: #64748B; text-decoration: underline;">Pratham</a>
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
};

export const emailTemplates = [
  {
    label: "Reminder 7 days before",
    generateSubject: (data) =>
      `📅 Reminder: Your ${data.subscriptionName} Subscription Renews in 7 Days!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 7 }),
  },
  {
    label: "Reminder 5 days before",
    generateSubject: (data) =>
      `⏳ ${data.subscriptionName} Renews in 5 Days – Stay Subscribed!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 5 }),
  },
  {
    label: "Reminder 2 days before",
    generateSubject: (data) =>
      `🚀 2 Days Left! ${data.subscriptionName} Subscription Renewal`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 2 }),
  },
  {
    label: "Reminder 1 days before",
    generateSubject: (data) =>
      `⚡ Final Reminder: ${data.subscriptionName} Renews Tomorrow!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 1 }),
  },
];