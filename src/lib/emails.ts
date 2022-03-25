import { NextApiRequest } from 'next';

import { env } from '@/lib/envConfig';

import sendMail from './mail';

export async function sendEmailWhenNoStripe(
  req: NextApiRequest,
  job,
  accountLink
) {
  const data = {
    name: `${job.user.firstName} ${job.user.lastName}`,
    accountLink: accountLink.url,
  };

  const mailData = {
    from: env.EMAIL_FROM,
    to: job.user.email,
    subject: `A payment from ${req.body.name} is waiting for you in introduce.guru!`,
    // text: text(req.body),
    html: html(data),
  };
  sendMail(mailData);

  function html(data) {
    const backgroundColor = '#f9f9f9';
    const textColor = '#444444';
    const mainBackgroundColor = '#ffffff';

    return `
    <body style="background: ${backgroundColor}; padding-bottom: 20px; padding-top: 20px;">
  
    <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px; margin-bottom: 20px">
      <tr>
        <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
         <p>You have a payment to collect from ${data.name} in introduce.guru!</p>
  
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          <p>
          <a href="${data.accountLink}">
            But first you have to connect to introduce.guru via Stripe
          </a>
          </p>
        </td>
      </tr>
  
      <tr>
        <td>
          <p>Best Regards</p>
          <p>${data.name}</p>
        </td>
      </tr>
      
      <tr>
        <td align="center" style="padding: 0px 0px 10px 0px; font-size: 10px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          If you did not request this email you can safely ignore it.
        </td>
      </tr>
    </table>
  </body>
  `;
  }
}
