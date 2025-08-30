// api/contact.js
require('dotenv').config(); // Only needed if testing locally
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fullname, email, message } = req.body || {};
    if (!fullname || !email || !message) {
        return res.status(400).json({ error: 'fullname, email and message are required' });
    }

    try {
        // Create transporter using Gmail SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS, // App password from Google
            },
        });

        // Verify SMTP connection (useful for debugging)
        await transporter.verify();
        console.log('SMTP server is ready to send messages');

        // Prepare email
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.RECIPIENT_EMAIL || process.env.GMAIL_USER,
            subject: 'New Contact Form Submission',
            text: `You received a new contact form submission:\n\nName: ${fullname}\nEmail: ${email}\nMessage:\n${message}`,
            replyTo: email,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Message sent successfully!' });
    } catch (err) {
        console.error('Email error:', err);
        return res.status(500).json({ error: 'Failed to send email', details: err.message });
    }
};
