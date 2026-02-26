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

const sendShortlistEmail = async (candidateEmail, candidateName, jobTitle, companyName) => {
    try {
        // If no credentials, just log it (Safety for dev environment without env vars)
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('=================================================');
            console.log(`[DEV MODE] Shortlist Email Service mocked.`);
            console.log(`To: ${candidateEmail}`);
            console.log(`Candidate: ${candidateName}`);
            console.log(`Job: ${jobTitle} at ${companyName}`);
            console.log('=================================================');
            return true;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: candidateEmail,
            subject: `Congratulations! You've been shortlisted for ${jobTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #28a745; margin-bottom: 20px;">🎉 Congratulations, ${candidateName}!</h2>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            We are pleased to inform you that you have been <strong>shortlisted</strong> for the position of 
                            <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
                        </p>
                        
                        <div style="background-color: #e8f5e9; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0; border-radius: 5px;">
                            <p style="margin: 0; color: #2e7d32; font-weight: bold;">What's Next?</p>
                            <p style="margin: 10px 0 0 0; color: #333;">
                                Our team will review your application and contact you soon with further details regarding the next steps in the recruitment process.
                            </p>
                        </div>
                        
                        <p style="font-size: 14px; color: #666; line-height: 1.6;">
                            Please keep an eye on your email and phone for updates. We recommend you:
                        </p>
                        
                        <ul style="color: #666; line-height: 1.8;">
                            <li>Review the job description and company profile</li>
                            <li>Prepare for potential interviews</li>
                            <li>Keep your contact information updated</li>
                        </ul>
                        
                        <p style="font-size: 14px; color: #666; margin-top: 30px;">
                            Best regards,<br>
                            <strong>${companyName}</strong><br>
                            <span style="color: #999;">via NextOffer</span>
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        <p>This is an automated notification from NextOffer.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Shortlist email sent to', candidateEmail, ':', info.response);
        return true;
    } catch (error) {
        console.error('Error sending shortlist email:', error);
        return false;
    }
};

const sendInterviewEmail = async (candidateEmail, candidateName, jobTitle, companyName, interviewDate, interviewEndDate) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('=================================================');
            console.log(`[DEV MODE] Interview Email Service mocked.`);
            console.log(`To: ${candidateEmail}`);
            console.log(`Candidate: ${candidateName}`);
            console.log(`Job: ${jobTitle} at ${companyName}`);
            console.log(`Start: ${interviewDate}`);
            console.log(`End: ${interviewEndDate}`);
            console.log('=================================================');
            return true;
        }

        // Format dates
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // Since input is date-only (yyyy-mm-dd), exact time isn't captured, but effectively it's that day.
        // User asked for "start and end date only no time needed".
        // We will display: "From: Tuesday, January 20, 2026 To: Wednesday, January 21, 2026" or similar if different.
        // If same day, maybe just one? But user inputs separate start/end dates.

        const startDateStr = new Date(interviewDate).toLocaleDateString(undefined, dateOptions);
        const endDateStr = interviewEndDate ? new Date(interviewEndDate).toLocaleDateString(undefined, dateOptions) : '';

        // Construct Date Display
        let dateDisplay = `<strong>Start Date:</strong> ${startDateStr}`;
        if (endDateStr && startDateStr !== endDateStr) {
            dateDisplay += `<br><strong>End Date:</strong> ${endDateStr}`;
        } else if (endDateStr) {
            // If same day, explicit start/end implies checking availability on that day? 
            // Or maybe just show single date. 
            // "Date: Saturday, 17 January 2026" as per mock.
            // If they are explicitly different, show range.
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: candidateEmail,
            subject: `Interview Invitation for ${jobTitle} at ${companyName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #4a90e2; margin-bottom: 20px;">Interview Invitation</h2>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            Dear <strong>${candidateName}</strong>,
                        </p>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            We are pleased to invite you for an interview for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
                        </p>
                        
                        <div style="background-color: #e3f2fd; padding: 20px; border-left: 4px solid #2196f3; margin: 20px 0; border-radius: 5px;">
                            <p style="margin: 0 0 10px 0; color: #1565c0; font-weight: bold;">Interview Details</p>
                            <p style="margin: 5px 0;">${dateDisplay}</p>
                            <p style="margin: 15px 0 0 0; color: #333;">
                                <strong>Action Required:</strong> Please view your <strong>My Application</strong> tab on the NextOffer portal for attending the interview.
                            </p>
                        </div>
                        
                        <p style="font-size: 14px; color: #666; line-height: 1.6;">
                            Please ensure you are available on the scheduled date(s).
                        </p>
                        
                        <p style="font-size: 14px; color: #666; margin-top: 30px;">
                            Best regards,<br>
                            <strong>${companyName}</strong><br>
                            <span style="color: #999;">via NextOffer</span>
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Interview email sent to', candidateEmail, ':', info.response);
        return true;
    } catch (error) {
        console.error('Error sending interview email:', error);
        return false;
    }
};

const sendHireEmail = async (candidateEmail, candidateName, jobTitle, companyName) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('=================================================');
            console.log(`[DEV MODE] Hire Email Service mocked.`);
            console.log(`To: ${candidateEmail}`);
            console.log(`Candidate: ${candidateName}`);
            console.log(`Job: ${jobTitle} at ${companyName}`);
            console.log('=================================================');
            return true;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: candidateEmail,
            subject: `Job Offer: You're Hired for ${jobTitle} at ${companyName}!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #28a745; margin-bottom: 20px;">🎉 Congratulations, ${candidateName}!</h2>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            We are absolutely thrilled to inform you that you have been selected for the position of 
                            <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
                        </p>
                        
                        <div style="background-color: #e8f5e9; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0; border-radius: 5px;">
                            <p style="margin: 0; color: #2e7d32; font-weight: bold;">Welcome to the Team!</p>
                            <p style="margin: 10px 0 0 0; color: #333;">
                                Your skills and experience stood out to us, and we are excited to have you onboard. Our HR team will reach out to you shortly with your official offer letter and onboarding details.
                            </p>
                        </div>
                        
                        <p style="font-size: 14px; color: #666; margin-top: 30px;">
                            Best regards,<br>
                            <strong>${companyName}</strong><br>
                            <span style="color: #999;">via NextOffer</span>
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Hire email sent to', candidateEmail, ':', info.response);
        return true;
    } catch (error) {
        console.error('Error sending hire email:', error);
        return false;
    }
};

const sendRejectEmail = async (candidateEmail, candidateName, jobTitle, companyName) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('=================================================');
            console.log(`[DEV MODE] Reject Email Service mocked.`);
            console.log(`To: ${candidateEmail}`);
            console.log(`Candidate: ${candidateName}`);
            console.log(`Job: ${jobTitle} at ${companyName}`);
            console.log('=================================================');
            return true;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: candidateEmail,
            subject: `Update on your application for ${jobTitle} at ${companyName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Application Update</h2>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            Dear <strong>${candidateName}</strong>,
                        </p>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            Thank you for taking the time to apply and interview for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
                        </p>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            We received many applications from highly qualified individuals, and after careful consideration, we have decided to move forward with other candidates who more closely match our current needs.
                        </p>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            We genuinely appreciate your interest in joining our team and wish you the very best of luck in your job search and future career endeavors.
                        </p>
                        
                        <p style="font-size: 14px; color: #666; margin-top: 30px;">
                            Best regards,<br>
                            <strong>${companyName}</strong><br>
                            <span style="color: #999;">via NextOffer</span>
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Reject email sent to', candidateEmail, ':', info.response);
        return true;
    } catch (error) {
        console.error('Error sending reject email:', error);
        return false;
    }
};

module.exports = { sendOTP, sendShortlistEmail, sendInterviewEmail, sendHireEmail, sendRejectEmail };
