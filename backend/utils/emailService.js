const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp) => {
    try {
        // If no credentials, just log it (Safety for dev environment without env vars)
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('=================================================');
            console.log(`[DEV MODE] Email Service mocked.`);
            console.log(`To: ${email}`);
            console.log(`OTP: ${otp}`);
            console.log('=================================================');
            return true;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'NextOffer - Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4a90e2;">Email Verification</h2>
                    <p>Thank you for registering with NextOffer. Please use the following OTP to verify your email address:</p>
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
