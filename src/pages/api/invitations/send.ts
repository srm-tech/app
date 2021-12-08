import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import models from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    await models.client.connect();
    const _userId = getCurrentUser();
    const user = await models.UserProfile.getOne(_userId._id);

    const result = { message: 'OK' };
    if (req.method === 'POST') {
      await validate([
        check('email').isEmail(),
        check('message').isLength({ min: 1, max: 1023 }),
        check('commissionPerReceivedLeadCash').isAlphanumeric(),
        check('commissionPerCompletedLead').isAlphanumeric(),
        check('commissionPerReceivedLeadPercent').isAlphanumeric(),
      ])(req, res);
      // const { name, email, text } = req.body;

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
        from: `${user.firstName} ${user.lastName} <${user.email}>`,
        to: `${req.body.email}`,
        subject: `A business opportunity from ${user.firstName} ${user.lastName}`,
        text: text(req.body),
        html: html(req.body),
      };

      transporter.sendMail(mailOption, (err, data) => {
        if (err) {
          return res.status(500).json({ message: err, statusCode: 500 });
        }
      });
    } else {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
    await models.client.close();
  }
);

function html(data) {
  // message, commissionPerReceivedLeadCash, commissionPerCompletedLead, commissionPerReceivedLeadPercent }: Record<'message' | 'commissionPerReceivedLeadCash' | 'commissionPerCompletedLead' | 'commissionPerReceivedLeadPercent' , string>) {

  // Some simple styling options
  const backgroundColor = '#f9f9f9';
  const textColor = '#444444';
  const mainBackgroundColor = '#ffffff';

  return `
  <body style="background: ${backgroundColor}; padding-bottom: 20px; padding-top: 20px;">

  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px; margin-bottom: 20px">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        ${data.message}
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <p><strong>Commission per received lead ($):</strong> ${data.commissionPerReceivedLeadCash}</p>
        <p><strong>Commission per completed lead ($):</strong> ${data.commissionPerCompletedLead}</p>
        <p><strong>Commission per received lead (%):</strong> ${data.commissionPerReceivedLeadPercent}</p>
      </td>
    </tr>
    
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text(data) {
  // message, commissionPerReceivedLeadCash, commissionPerCompletedLead, commissionPerReceivedLeadPercent }: Record<'message' | 'commissionPerReceivedLeadCash' | 'commissionPerCompletedLead' | 'commissionPerReceivedLeadPercent' , string>) {
  return `${data.message}\n\n
  Commission per received lead ($): ${data.commissionPerReceivedLeadCash}\n
  Commission per completed lead ($):</strong> ${data.commissionPerCompletedLead}\n
  Commission per received lead (%):</strong> ${data.commissionPerReceivedLeadPercent}\n\n
`;
}
