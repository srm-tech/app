export function formatCommissionDescriptions(commission) {
  const result = {
    key: '',
    value: '',
  };
  switch (commission.commissionType) {
    case 'commisionPerReceivedLeadCash':
      result.key = 'Commission per received ($)';
      result.value = commission.commisionPerReceivedLeadCash;
      break;
    case 'commissionPerCompletedLead':
      result.key = 'Commission per completed lead ($)';
      result.value = commission.commissionPerCompletedLead;
      break;
    case 'commissionPerReceivedLeadPercent':
      result.key = 'Commission per received lead (%)';
      result.value = commission.commissionPerReceivedLeadPercent;
      break;
  }
  return result;
}
