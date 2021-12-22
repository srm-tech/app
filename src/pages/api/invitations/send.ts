import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import sendMail from '@/lib/mail';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import models from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    await models.client.connect();
    const _userId = await getCurrentUser(req, res);
    const user = await models.UserProfile.getOne(_userId._id);
    let result;
    if (req.method === 'POST') {
      await validate([
        check('email').isEmail(),
        check('message').isLength({ min: 1, max: 1023 }),
      ])(req, res);

      req.body.name = `${user.firstName} ${user.lastName}`;
      const mailData = {
        from: process.env.EMAIL_FROM,
        to: `${req.body.email}`,
        subject: `A business opportunity from ${req.body.name}`,
        text: text(req.body),
        html: html(req.body),
      };
      const commission = commissionFormatter(req.body);
      const idData = {
        userId: new ObjectId(req.body.userId),
        email: req.body.email,
        commissionType: req.body.commissionType,
      };
      idData[req.body.commissionType] = commission.value;

      const id = await models.Agreement.createJob(idData);

      result = await models.Introduction.create({
        from: new ObjectId(user._id),
        to: null,
        status: 'pending',
        date: new Date(),
        action: 'sent',
        agreementId: id.insertedId,
      });

      sendMail(mailData);
    } else {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
    await models.client.close();
  }
);

function commissionFormatter(data) {
  let label;
  let value;
  switch (data.commissionType) {
    case 'commissionPerReceivedLeadCash':
      label = 'Commission per received lead ($)';
      value = data.commissionPerReceivedLeadCash;
      break;
    case 'commissionPerCompletedLeadCash':
      label = 'Commission per completed lead ($)';
      value = data.commissionPerCompletedLead;
      break;
    case 'commissionPerReceivedLeadPercent':
      label = 'Commission per received lead (%)';
      value = data.commissionPerReceivedLeadPercent;
      break;
  }
  return {
    label: label,
    value: value,
  };
}

function html(data) {
  const backgroundColor = '#f9f9f9';
  const textColor = '#444444';
  const mainBackgroundColor = '#ffffff';

  const commission = commissionFormatter(data);

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
        <p><strong>${commission.label}:</strong> ${commission.value}</p>
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

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text(data) {
  const commission = commissionFormatter(data);
  return `${data.message}\n\n
  ${commission.label}: ${commission.value}\n\n
  Best Regards,\n
  ${data.name}
`;
}
