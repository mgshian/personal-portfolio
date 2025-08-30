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
        // Use environment variables (set in Vercel Dashboard)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD, // must be App Password
            },
        });

        await transporter.verify(); // ✅ check connection

        const mailOptions = {
            from: `"Contact Form" <${process.env.GMAIL_USER}>`,
            to: process.env.RECIPIENT_EMAIL || process.env.GMAIL_USER,
            subject: 'New Contact Form Submission',
            text: `Name: ${fullname}\nEmail: ${email}\nMessage:\n${message}`,
            replyTo: email,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Message sent successfully!' });
    } catch (err) {
        console.error('Email error:', err);
        return res.status(500).json({ error: 'Failed to send email', details: err.message });
    }
};
