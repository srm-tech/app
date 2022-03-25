import nodemailer from 'nodemailer';

import { env } from './envConfig';

export default function sendMail(params) {
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_SERVER_HOST || 'email-smtp.ap-southeast-2.amazonaws.com',
    port: Number(env.EMAIL_SERVER_PORT) || 587,
    secure: Boolean(env.EMAIL_SECURE || 0),
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASS,
    },
  });

  const mailOption = {
    from: params.from,
    to: params.to,
    replyTo: params.replyTo,
    bcc: params.bcc,
    subject: params.subject,
    text: params.text,
    html: params.html,
  };

  return new Promise((resolve, reject) =>
    transporter.sendMail(mailOption, (err, data) => {
      if (err) {
        return reject(err); // todo:  throw Error maybe?
      }
      resolve(data);
    })
  );
}
