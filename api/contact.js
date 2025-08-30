// api/contact.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    console.log('Function invoked'); // Debug: function started

    if (req.method !== 'POST') {
        console.log('Invalid method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fullname, email, message } = req.body || {};
    if (!fullname || !email || !message) {
        console.log('Missing fields:', req.body);
        return res.status(400).json({ error: 'fullname, email and message are required' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        await transporter.verify();
        console.log('SMTP verified');

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.RECIPIENT_EMAIL || process.env.GMAIL_USER,
            subject: 'New Contact Form Submission',
            text: `Name: ${fullname}\nEmail: ${email}\nMessage:\n${message}`,
            replyTo: email,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent');

        return res.status(200).json({ message: 'Message sent successfully!' });
    } catch (err) {
        console.error('Email error:', err);
        return res.status(500).json({ error: 'Failed to send email', details: err.message });
    }
};
