import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

export const exportToCSV = (data) => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  // Define the header row (optional)
  const headerRow = worksheet.addRow([
    'ItemId',
    'ItemName',
    'ItemCode',
    'BOM',
    'BomId',
    'UOM',
    'UomID',
    'PlanQuantity',
    'Rate',
  ]);
  headerRow.font = { bold: true };

  // Add data to the worksheet
  data?.length &&
    data.forEach((item) => {
      worksheet.addRow([
        item.itemId,
        item.itemName,
        item.itemCode,
        item?.objBOMList?.[0]?.label,
        item?.objBOMList?.[0]?.value,
        item?.uomName,
        item?.uomid,
        '',
        item?.rate,
      ]);
    });

  // Generate a unique file name for the exported CSV file
  const fileName = `data_${new Date().getTime()}.csv`;

  // Save the workbook as a CSV file
  workbook.csv.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, fileName);
  });
};
