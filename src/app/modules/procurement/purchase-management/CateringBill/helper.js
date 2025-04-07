import { generateJsonToExcel } from '../../../_helper/excel/jsonToExcel';
import { getMonth } from '../../../salesManagement/report/customerSalesTarget/utils';

export const generateExcel = (gridData) => {
  const header = [
    {
      text: 'Month',
      textFormat: 'text',
      alignment: 'center:middle',
      key: 'month', // Key for month, modified
    },
    {
      text: 'Business Unit',
      textFormat: 'text',
      alignment: 'center:middle',
      key: 'controllingUnitName', // Key for business unit, modified
    },
    {
      text: 'Supplier',
      textFormat: 'text',
      alignment: 'center:middle',
      key: 'supplierName', // Key for supplier, modified
    },
    {
      text: 'Meal Count',
      textFormat: 'text',
      alignment: 'center:middle',
      key: 'mealCount', // Key for meal count, modified
    },
    {
      text: 'Meal Amount',
      textFormat: 'text',
      alignment: 'center:middle',
      key: 'mealAmount', // Key for meal amount, modified
    },
    {
      text: 'Purchase Order No',
      textFormat: 'text',
      alignment: 'center:middle',
      key: 'purchaseOrderNo', // Key for purchase order no, modified
    },
    {
      text: 'Inventory Transaction Code',
      textFormat: 'text',
      alignment: 'center:middle',
      key: 'inventoryTransactionCode', // Key for inventory transaction code, modified
    },
  ];

  // Adjusted Data with formatted month
  const formattedData = gridData.map((item) => ({
    month: getMonth(item.monthId), // Format the month using the getMonth function
    controllingUnitName: item.controllingUnitName,
    supplierName: item.supplierName,
    mealCount: item.mealCount,
    mealAmount: item.mealAmount,
    purchaseOrderNo: item.purchaseOrderNo,
    inventoryTransactionCode: item.inventoryTransactionCode,
  }));

  generateJsonToExcel(header, formattedData, 'Catering Bill Report');
};
