export function formatCommissionDescriptions(commission) {
  // console.log('commission', commission);
  const result = {
    key: '',
    value: '',
  };
  switch (commission.commissionType) {
    case 'commisionPerReceivedLeadCash':
      result.key = 'Commission per received ($)';
      // result.value = commission.commisionPerReceivedLeadCash;
      result.value = commission.value;
      break;

    // todo: dedup this:
    case 'commissionPerCompletedLeadCash':
      result.key = 'Commission per completed lead ($)';
      // result.value = commission.commissionPerCompletedLeadCash;
      result.value = commission.commissionValue;
      break;
    case 'commissionPerCompletedLead':
      result.key = 'Commission per completed lead ($)';
      // result.value = commission.commissionPerCompletedLead;
      result.value = commission.commissionValue;
      break;

    case 'commissionPerReceivedLeadPercent':
      result.key = 'Commission per completed lead (%)';
      // result.value = commission.commissionPerReceivedLeadPercent;
      result.value = commission.commissionValue;
      break;
  }
  return result;
}

export function htmlNewStripeAccount(data) {
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
          But first you have to connect to introduce.guru via Stripe:
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

export function htmlStripeReminder(data) {
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
        But first you have to provide details and payment data to make the payment possible.
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

export function htmlIntroduction(guru, customer, business) {
  const backgroundColor = '#f9f9f9';
  const textColor = '#444444';
  const mainBackgroundColor = '#ffffff';

  return `
  <body style="background: ${backgroundColor}; padding-bottom: 20px; padding-top: 20px;">

  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px; margin-bottom: 20px">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
       <p>Hi ${business.firstName},</p>
       <p>I would like to introduce you to ${customer.firstName} who needs your service.</p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <p>
        <a href="${process.env.NEXTAUTH_URL}/introductions">View contact details for ${customer.firstName}.</a>
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p>Best Regards,</p>
        <p>${guru.firstName} ${guru.lastName}</p>
      </td>
    </tr>

  </table>
</body>
`;
}
