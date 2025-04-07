import { createFile } from '../../../../_helper/excel/index';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { _formatMoney } from '../../../../_helper/_formatMoney';

// This excel only for supplier base delivery (both) report

class Cell {
  constructor(label, isMerge, align, format, cellRange, bold) {
    this.text = label;
    this.isMerge = isMerge;
    this.alignment = `${align}:middle`;
    this.format = format;
    this.cellRange = cellRange;
    this.bold = bold;
  }
  getCell() {
    return this.isMerge
      ? {
          text: this.text,
          fontSize: 7,
          cellRange: this.cellRange,
          merge: true,
          border: 'all 000000 thin',
          alignment: this.alignment || '',
          textFormat: this.format,
          bold: this.bold,
        }
      : {
          text: this.text,
          fontSize: 7,
          border: 'all 000000 thin',
          alignment: this.alignment || '',
          textFormat: this.format,
          bold: this.bold,
        };
  }
}

const total = {
  quantity: 0,
  amount: 0,
  handlingCost: 0,
  loadingLabourCost: 0,
  totalGrandAmount: 0,
  totalSubsidiaryAmount: 0,
};

const getTableData = (row) => {
  const arr = [];
  row.forEach((item) => {
    arr.push([
      new Cell(
        item?.customerName,
        true,
        'center',
        'text',
        'A1:S1',
        true
      ).getCell(),
    ]);
    item.objList.forEach((obj, objIndex) => {
      _formatMoney((total.quantity += obj?.deliveryQty));
      _formatMoney((total.amount += obj?.deliveryValue), 2);
      _formatMoney((total.handlingCost += obj?.handlingCost), 2);
      _formatMoney(
        (total.totalGrandAmount +=
          (obj?.transportzoneAmount || 0) +
          (obj?.handlingCost || 0) +
          (obj?.loadingLabourCostAmaount || 0)),
        2
      );
      _formatMoney(
        (total.loadingLabourCost += obj?.loadingLabourCostAmaount),
        2
      );
      _formatMoney(
        (total.totalSubsidiaryAmount += obj?.subsidiaryRate * obj?.deliveryQty),
        2
      );
      arr.push([
        new Cell(objIndex + 1, false, 'center', 'text').getCell(),
        new Cell(
          _dateFormatter(obj?.deliveryDate),
          false,
          'left',
          'text'
        ).getCell(),
        new Cell(obj?.so, false, 'left', 'text').getCell(),
        new Cell(obj?.deliveryCode, false, 'left', 'text').getCell(),
        new Cell(obj?.itemName, false, 'left', 'text').getCell(),
        new Cell(obj?.shipPointName || '', false, 'left', 'text').getCell(),
        new Cell(obj?.uomName, false, 'left', 'text').getCell(),
        new Cell(obj?.itemRate, false, 'right', 'text').getCell(),
        new Cell(obj?.deliveryQty, false, 'right', 'money').getCell(),
        new Cell(obj?.deliveryValue, false, 'right', 'text').getCell(),
        new Cell(obj?.transportzoneRate, false, 'right', 'text').getCell(),
        new Cell(obj?.transportzoneAmount, false, 'right', 'text').getCell(),
        new Cell(obj?.handlingRate, false, 'right', 'text').getCell(),
        new Cell(obj?.handlingCost, false, 'right', 'text').getCell(),
        new Cell(obj?.loadingLabourRate, false, 'right', 'text').getCell(),
        new Cell(
          obj?.loadingLabourCostAmaount,
          false,
          'right',
          'text'
        ).getCell(),
        new Cell(obj?.subsidiaryRate || 0, false, 'right', 'text').getCell(),
        new Cell(
          obj?.subsidiaryRate * obj?.deliveryQty,
          false,
          'right',
          'text'
        ).getCell(),
        new Cell(
          (obj?.transportzoneAmount || 0) +
            (obj?.handlingCost || 0) +
            (obj?.loadingLabourCostAmaount || 0),
          false,
          'right',
          'text'
        ).getCell(),
      ]);
    });
    arr.push([
      new Cell('Total', true, 'right', 'text', 'A1:G1', true).getCell(),
      new Cell('', false, 'right', 'text', '', true).getCell(),
      new Cell(total.quantity, false, 'right', 'money', '', true).getCell(),
      new Cell(total.amount, false, 'right', 'text', '', true).getCell(),
      new Cell('', false, 'right', 'text', '', true).getCell(),
      new Cell('', false, 'right', 'text', '', true).getCell(),
      new Cell('', false, 'right', 'text', '', true).getCell(),
      new Cell(total.handlingCost, false, 'right', 'text', '', true).getCell(),
      new Cell('', false, 'right', 'text', '', true).getCell(),
      new Cell(
        total.loadingLabourCost,
        false,
        'right',
        'text',
        '',
        true
      ).getCell(),
      new Cell('', false, 'right', 'text', '', true).getCell(),
      new Cell(
        total?.totalSubsidiaryAmount,
        false,
        'right',
        'text',
        '',
        true
      ).getCell(),
      new Cell(
        total.totalGrandAmount,
        false,
        'right',
        'text',
        '',
        true
      ).getCell(),
    ]);
    total.quantity = 0;
    total.amount = 0;
    total.handlingCost = 0;
    total.loadingLabourCost = 0;
    total.totalSubsidiaryAmount = 0;
  });

  return arr;
};
// Supplier Base Delivery (Customer Challan)
export const CreateSupplierBaseDeliveryExcel = (
  values,
  row,
  selectedBusinessUnit,
  documentName,
  reportName
) => {
  const excel = {
    name: documentName,
    sheets: [
      {
        name: documentName,
        gridLine: false,
        rows: [
          [
            {
              text: selectedBusinessUnit?.label,
              fontSize: 16,
              bold: true,
              cellRange: 'A1:S1',
              merge: true,
              alignment: 'center:middle',
            },
          ],
          [
            {
              text: selectedBusinessUnit?.address,
              fontSize: 12,
              bold: true,
              cellRange: 'A1:S1',
              merge: true,
              alignment: 'center:middle',
            },
          ],
          [
            {
              text: reportName,
              fontSize: 12,
              bold: true,
              cellRange: 'A1:S1',
              merge: true,
              alignment: 'center:middle',
            },
          ],
          [
            {
              text: `From Date: ${values?.fromDate}   To Date: ${values?.toDate}`,
              fontSize: 10,
              bold: true,
              cellRange: 'A1:S1',
              merge: true,
              alignment: 'center:middle',
            },
          ],
          ['_blank*1'],
          [
            {
              text: 'SL',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Date',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'SO Number',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Challan No',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Product Name',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Shippoint',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'UoM',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Product Rate',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Product Quantity',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Amount',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Trs. Zone Rate',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Trs. Zone Amount',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Handling Rate',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Handling Cost',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },

            {
              text: 'Loading Labour Rate',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Loading Labour Cost',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Subsidiary Rate',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Subsidiary (March-April)',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Grand Amount',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
          ],
          ...getTableData(row),
        ],
      },
    ],
  };
  createFile(excel);
};

const getTableDataTransfer = (row) => {
  const arr = [];
  row.forEach((item) => {
    arr.push([
      new Cell(
        item?.customerName,
        true,
        'center',
        'text',
        'A1:N1',
        true
      ).getCell(),
    ]);
    item.objList.forEach((obj, objIndex) => {
      _formatMoney((total.quantity += obj?.deliveryQty));
      _formatMoney((total.amount += obj?.deliveryValue), 2);
      _formatMoney((total.handlingCost += obj?.handlingCost), 2);
      _formatMoney(
        (total.loadingLabourCost += obj?.loadingLabourCostAmaount),
        2
      );
      arr.push([
        new Cell(objIndex + 1, false, 'center', 'text').getCell(),
        new Cell(
          _dateFormatter(obj?.deliveryDate),
          false,
          'left',
          'text'
        ).getCell(),
        new Cell(obj?.so, false, 'left', 'text').getCell(),
        new Cell(obj?.deliveryCode, false, 'left', 'text').getCell(),
        new Cell(obj?.itemName, false, 'left', 'text').getCell(),
        new Cell(obj?.shipPointName || '', false, 'left', 'text').getCell(),
        new Cell(obj?.uomName, false, 'left', 'text').getCell(),
        new Cell(obj?.itemRate, false, 'right', 'text').getCell(),
        new Cell(obj?.deliveryQty, false, 'right', 'money').getCell(),
        new Cell(obj?.deliveryValue, false, 'right', 'text').getCell(),
        new Cell(obj?.handlingRate, false, 'right', 'text').getCell(),
        new Cell(obj?.handlingCost, false, 'right', 'text').getCell(),
        new Cell(obj?.loadingLabourRate, false, 'right', 'text').getCell(),
        new Cell(
          obj?.loadingLabourCostAmaount,
          false,
          'right',
          'text'
        ).getCell(),
      ]);
    });
    arr.push([
      new Cell('Total', true, 'right', 'text', 'A1:G1', true).getCell(),
      new Cell('', false, 'right', 'text', '', true).getCell(),
      new Cell(total.quantity, false, 'right', 'money', '', true).getCell(),
      new Cell(total.amount, false, 'right', 'text', '', true).getCell(),
      new Cell('', false, 'right', 'text', '', true).getCell(),
      new Cell(total.handlingCost, false, 'right', 'text', '', true).getCell(),
      new Cell('', false, 'right', 'text', '', true).getCell(),
      new Cell(
        total.loadingLabourCost,
        false,
        'right',
        'text',
        '',
        true
      ).getCell(),
    ]);
    total.quantity = 0;
    total.amount = 0;
    total.handlingCost = 0;
    total.loadingLabourCost = 0;
  });

  return arr;
};

// Supplier Base Delivery (Transfer Challan)
export const CreateSupplierBaseDeliveryTransferExcel = (
  values,
  row,
  selectedBusinessUnit,
  documentName,
  reportName
) => {
  const excel = {
    name: documentName,
    sheets: [
      {
        name: documentName,
        gridLine: false,
        rows: [
          [
            {
              text: selectedBusinessUnit?.label,
              fontSize: 16,
              bold: true,
              cellRange: 'A1:N1',
              merge: true,
              alignment: 'center:middle',
            },
          ],
          [
            {
              text: selectedBusinessUnit?.address,
              fontSize: 12,
              bold: true,
              cellRange: 'A1:N1',
              merge: true,
              alignment: 'center:middle',
            },
          ],
          [
            {
              text: reportName,
              fontSize: 12,
              bold: true,
              cellRange: 'A1:N1',
              merge: true,
              alignment: 'center:middle',
            },
          ],
          [
            {
              text: `From Date: ${values?.fromDate}   To Date: ${values?.toDate}`,
              fontSize: 10,
              bold: true,
              cellRange: 'A1:N1',
              merge: true,
              alignment: 'center:middle',
            },
          ],
          ['_blank*1'],
          [
            {
              text: 'SL',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Date',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'SO Number',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Challan No',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Product Name',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Shippoint',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'UoM',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },

            {
              text: 'Trs. Zone Rate',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Trs. Zone Amount',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Amount',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Handling Rate',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Handling Cost',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },

            {
              text: 'Loading Labour Rate',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Loading Labour Cost',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
          ],
          ...getTableDataTransfer(row),
        ],
      },
    ],
  };
  createFile(excel);
};
