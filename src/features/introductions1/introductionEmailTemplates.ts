export const newIntroductionTemplate = (BASE_URL, guru, customer, business) => {
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
        <a href="${BASE_URL}/app/introductions">View contact details for ${customer.firstName}.</a>
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
};
