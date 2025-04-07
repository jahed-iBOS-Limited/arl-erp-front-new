export const fillPersentageValueInRow = (
  PercentageValue: any,
  index: number,
  initialAmount: any,
  tableData: any,
  setTableData: any
): void => {
  const updatedData = [...tableData];
  let updatedValue = initialAmount;
  const monthsToUpdate = [
    "julAmount",
    "augAmount",
    "sepAmount",
    "octAmount",
    "novAmount",
    "decAmount",
    "janAmount",
    "febAmount",
    "marAmount",
    "aprAmount",
    "mayAmount",
    "junAmount",
  ];
  for (const month of monthsToUpdate) {
    updatedValue += updatedValue * (PercentageValue / 100);
    updatedValue = parseFloat(updatedValue.toFixed(2));
    updatedData[index][month] = updatedValue;
  }
  setTableData(updatedData);
};
