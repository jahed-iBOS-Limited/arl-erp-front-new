import { _formatMoney } from "./_formatMoney";
export const _fixedPoint = (num, isMoney, decimalCount) => {
  const convartNum = Number(num).toFixed(2);
  if (isMoney) {
    return _formatMoney(num, decimalCount);
  } else {
    return Number(convartNum);
  }
};
