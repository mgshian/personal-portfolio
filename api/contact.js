// api/contact.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fullname, email, message } = req.body || {};
    if (!fullname || !email || !message) {
        return res.status(400).json({ error: 'fullname, email, and message are required' });
    }

    try {
        // Use a reliable SMTP service
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER, // your SMTP email
                pass: process.env.SMTP_PASS, // your SMTP password / app password
            },
        });

        // Debugging
        await transporter.verify();

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER,
            subject: 'New Contact Form Submission',
            text: `You received a new contact form submission:\n\nName: ${fullname}\nEmail: ${email}\nMessage:\n${message}`,
            replyTo: email,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Message received and emailed successfully!' });
    } catch (err) {
        console.error('Email error:', err);

        // Detailed error message for debugging in Vercel logs
        return res.status(500).json({ error: 'Failed to send email', details: err.message });
    }
};
