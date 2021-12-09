import nodemailer from 'nodemailer';

export default function sendMail(params) {
  const transporter = nodemailer.createTransport({
    host:
      process.env.EMAIL_SERVER_HOST ||
      'email-smtp.ap-southeast-2.amazonaws.com',
    port: process.env.EMAIL_SERVER_PORT || 587,
    secure: Boolean(process.env.EMAIL_SECURE || 0),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASS,
    },
  });

  const mailOption = {
    from: params.from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
  };

  transporter.sendMail(mailOption, (err, data) => {
    if (err) {
      return err; // todo:  throw Error maybe?
    }
  });
}
