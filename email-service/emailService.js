const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'your-email@example.com', // your email
      pass: 'your-password' // your email password
    },
  });

  let info = await transporter.sendMail({
    from: '"Sender Name" <sender@example.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
  });

  console.log('Message sent: %s', info.messageId);
}

module.exports = sendEmail;