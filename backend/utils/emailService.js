const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp, context = 'registration') => {
    try {
        // If no credentials, just log it (Safety for dev environment without env vars)
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('=================================================');
            console.log(`[DEV MODE] Email Service mocked.`);
            console.log(`To: ${email}`);
            console.log(`OTP: ${otp}`);
            console.log(`Context: ${context}`);
            console.log('=================================================');
            return true;
        }

        // Customize email content based on context
        const templates = {
            registration: {
                subject: 'NextOffer - Verify Your Email',
                title: 'Email Verification',
                message: 'Thank you for registering with NextOffer. Please use the following OTP to verify your email address:'
            },
            'password-reset': {
                subject: 'NextOffer - Password Reset',
                title: 'Password Reset Request',
                message: 'You requested to reset your password. Please use the following OTP to continue:'
            }
        };

        const template = templates[context] || templates.registration;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: template.subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4a90e2;">${template.title}</h2>
                    <p>${template.message}</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
                    </div>
                    <p>This OTP is valid for 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendOTP };
