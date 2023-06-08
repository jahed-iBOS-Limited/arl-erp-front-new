export const getTotalAmount = ({ landing }) => {
  let prTotal = 0;
  let poTotal = 0;
  let invTotal = 0;

  for (let i = 0; i < landing?.length; i++) {
    const element = landing[i];
    prTotal += element?.prQty;
    poTotal += element?.poQty;
    invTotal += element?.invQty;
  }

  return { prTotal, poTotal, invTotal };
};
