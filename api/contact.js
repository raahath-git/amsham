const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    let data = req.body;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        const query = new URLSearchParams(data);
        data = Object.fromEntries(query.entries());
      }
    }

    const name = data.Name || data.name || 'Anonymous User';
    const email = data.Email || data.email || 'No email provided';
    const phone = data.Phone || data.phone || data.Tel || 'Not provided';
    const message = data.Message || data.message || 'No message provided';

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER || 'huar.org@gmail.com';
    const smtpPass = process.env.SMTP_PASS || '';
    const targetEmail = process.env.CONTACT_EMAIL || 'huar.org@gmail.com';

    if (smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `huaR Website <${smtpUser}>`,
        to: targetEmail,
        replyTo: email,
        subject: `New huaR Website Inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0a0a0c; color: #ffffff;">
            <h2 style="color: #ffffff; border-bottom: 1px solid #333; padding-bottom: 10px;">New huaR Website Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #4a9eff;">${email}</a></p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #151518; padding: 15px; border-left: 4px solid #4a9eff; margin: 0; color: #ddd;">
              ${message.replace(/\n/g, '<br>')}
            </blockquote>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email successfully sent to ${targetEmail} from ${email}`);
    } else {
      console.log(`Form submission received (SMTP_PASS not configured):`, { name, email, phone, message });
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
