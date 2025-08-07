const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2025_MYsequelG',
    database: 'portfolio'
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

// Nodemailer transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'softwaretestershian@gmail.com',        // <-- Your Gmail address
        pass: 'seyojqrnonxfqhiy'      // <-- Gmail App Password
    }
});

// Handle contact form submission
app.post('/submit-form', (req, res) => {
    const { fullname, email, message } = req.body;

    console.log('📩 New submission received:');
    console.log({ fullname, email, message });

    const sql = 'INSERT INTO contacts (fullname, email, message) VALUES (?, ?, ?)';
    db.query(sql, [fullname, email, message], (err, result) => {
        if (err) {
            console.error('❌ DB Error:', err);
            return res.status(500).send('Error saving message');
        }

        console.log('✅ Message saved to database');

        // Send email notification
        const mailOptions = {
            from: 'softwaretestershian@gmail.com',       // Must match the Gmail user above
            to: 'sherrieannmanguiat@gmail.com',         // Can be your own or any email to receive the message
            subject: 'New Contact Form Submission',
            text: `You received a new contact form submission:
            Full Name: ${fullname}
            Email: ${email}
            Message: ${message}
            `
        };

        transporter.sendMail(mailOptions, (emailErr, info) => {
            if (emailErr) {
                console.error('❌ Email Error:', emailErr);
                return res.status(500).send('Message saved but email failed to send');
            }

            console.log('✅ Email sent:', info.response);
            res.status(200).send('Message received and emailed successfully!');
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
