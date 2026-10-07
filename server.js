const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static portfolio files
app.use(express.static(path.join(__dirname)));

/**
 * Creates and returns a Nodemailer transporter.
 * If EMAIL_USER and EMAIL_PASS are set, uses configured SMTP / Gmail.
 * Otherwise, generates an Ethereal test account so development and testing works immediately.
 */
async function getTransporter() {
    const hasCustomConfig = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    if (hasCustomConfig) {
        if (process.env.SMTP_HOST) {
            return {
                transporter: nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT) || 587,
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                }),
                isTest: false,
                fromEmail: process.env.EMAIL_USER
            };
        }

        // Default to Gmail service
        return {
            transporter: nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            }),
            isTest: false,
            fromEmail: process.env.EMAIL_USER
        };
    }

    // Fallback: Automatic Ethereal test account for instant testing without manual SMTP credentials
    console.log('⚡ No production EMAIL_USER found in .env. Initializing Nodemailer Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    return {
        transporter: nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        }),
        isTest: true,
        fromEmail: testAccount.user
    };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Portfolio Nodemailer Server',
        timestamp: new Date().toISOString()
    });
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { fullName, email, subject, message } = req.body;

        // Validation
        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields (Name, Email, Subject, Message) are required.'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        // Clean & truncate inputs
        const safeName = String(fullName).trim().slice(0, 100);
        const safeEmail = String(email).trim().slice(0, 150);
        const safeSubject = String(subject).trim().slice(0, 200);
        const safeMessage = String(message).trim().slice(0, 5000);

        const recipientEmail = process.env.RECIPIENT_EMAIL || 'malthumkarvarun@gmail.com';

        const { transporter, isTest, fromEmail } = await getTransporter();

        // Email to portfolio owner
        const mailOptions = {
            from: `"${safeName} (Portfolio Contact)" <${fromEmail}>`,
            replyTo: safeEmail,
            to: recipientEmail,
            subject: `[Portfolio Contact] ${safeSubject}`,
            text: `You received a new message from your portfolio contact form:\n\nName: ${safeName}\nEmail: ${safeEmail}\nSubject: ${safeSubject}\n\nMessage:\n${safeMessage}\n\nReceived at: ${new Date().toLocaleString()}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 24px; }
                        .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
                        .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 28px; text-align: center; }
                        .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
                        .body { padding: 32px 28px; }
                        .field-group { margin-bottom: 20px; }
                        .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px; margin-bottom: 6px; }
                        .value { font-size: 15px; color: #f9fafb; background: #1f2937; padding: 12px 16px; border-radius: 8px; border: 1px solid #374151; word-break: break-word; }
                        .message-box { font-size: 15px; line-height: 1.6; color: #f3f4f6; background: #1f2937; padding: 16px; border-radius: 8px; border: 1px solid #374151; white-space: pre-wrap; word-break: break-word; }
                        .footer { padding: 20px 28px; background: #0f172a; border-top: 1px solid #1f2937; text-align: center; font-size: 12px; color: #6b7280; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>New Portfolio Message</h1>
                        </div>
                        <div class="body">
                            <div class="field-group">
                                <div class="label">Sender Name</div>
                                <div class="value">${safeName}</div>
                            </div>
                            <div class="field-group">
                                <div class="label">Email Address</div>
                                <div class="value"><a href="mailto:${safeEmail}" style="color: #60a5fa; text-decoration: none;">${safeEmail}</a></div>
                            </div>
                            <div class="field-group">
                                <div class="label">Subject</div>
                                <div class="value">${safeSubject}</div>
                            </div>
                            <div class="field-group">
                                <div class="label">Message</div>
                                <div class="message-box">${safeMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                            </div>
                        </div>
                        <div class="footer">
                            Sent from Varun M's Portfolio Website • ${new Date().toUTCString()}
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Message sent successfully! ID: ${info.messageId}`);

        let previewUrl = null;
        if (isTest) {
            previewUrl = nodemailer.getTestMessageUrl(info);
            console.log(`🔗 Ethereal Email Preview URL: ${previewUrl}`);
        }

        return res.status(200).json({
            success: true,
            message: 'Thank you! Your message has been sent successfully.',
            messageId: info.messageId,
            previewUrl: previewUrl || undefined
        });
    } catch (error) {
        console.error('❌ Error sending email via Nodemailer:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while sending your message. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Fallback to index.html for root or unknown GET routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio server running on http://localhost:${PORT}`);
    console.log(`📧 Nodemailer ready on endpoint: POST http://localhost:${PORT}/api/contact`);
});
