import { _formatMoney } from "./_formatMoney";
export const _fixedPointVat = (num, decimalCount, isMoney) => {
  const convartNum = Number(num || 0).toFixed(decimalCount || 2);
  if (isMoney) {
    return _formatMoney(num || 0, decimalCount);
  } else {
    return Number(convartNum);
  }
};
