const nodeMailer = require('nodemailer');
const MailService = {
    sendMail: async (email, subject, content) => {
        let transporter = nodeMailer.createTransport({
            service: 'gmail',
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_NAME,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let mailOptions = {
            from: process.env.EMAIL_NAME,
            to: email,
            subject: subject,
            html: content
        };
        await transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent');
            }
        });
    }
};

module.exports = MailService;