import Axios from "axios";
import { createFile } from "../../../_helper/excel";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";

export const GetSubLedgerDDL_api = async (buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/SubLedger/GetSubLedgerDDL?BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const modifiedData = res?.data?.map((itm) => ({
        ...itm,
        label: `${itm?.label} (${itm?.code || ""}) `,
        name: itm?.label
      }));
      setter(modifiedData);
    }
  } catch (error) { }
};
export const GetAccountingJournal_api = async (
  accId,
  buId,
  glLedgerId,
  formDate,
  toDate,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/SubLedger/GetSubLedgerReport?accountId=${accId}&businessUnitId=${buId}&intGeneralLedgerId=${glLedgerId}&fromTransactionDate=${formDate}&toTransactionDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const exportExcel = async (subLedgerReportData) => {
  if (subLedgerReportData?.length > 0) {
    const headerName = [
      "Code",
      "Date",
      "Description",
      "Debit",
      "Credit",
      "Balance"
    ];
    const header = headerName?.map((item) => {
      return {
        text: item,
        bold: true,
        fontSize: 12,
      };
    });
    const body = subLedgerReportData?.map((item, index) => {
      return [
        item?.accountingJournalCode,
        _dateFormatter(item?.transactionDate),
        item?.narration,
        item?.debit,
        item?.credit,
        item?.amount,
      ];
    });

    const finalBody = [...body, [
      "",
      "",
      "Total",
      subLedgerReportData?.reduce((a, b) => a + (b?.debit || 0), 0),
      subLedgerReportData?.reduce((a, b) => a + (b?.credit || 0), 0),
      subLedgerReportData?.reduce((a, b) => a + (b?.amount || 0), 0),
    ]];

    const row = [header, ...finalBody];

    console.log(row);
    createFile({
      name: "General Ledger Report",
      sheets: [
        {
          name: "General Ledger Report",
          // border: "all 000000 thin",
          alignment: "center:left",
          rows: row,
        },
      ],
    });
  } else {
    return
  }

};

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
        border: "all 000000 thin",
        alignment: this.alignment || "",
        textFormat: this.format,
        bold: this.bold,
      }
      : {
        text: this.text,
        fontSize: 7,
        border: "all 000000 thin",
        alignment: this.alignment || "",
        textFormat: this.format,
        bold: this.bold,
      };
  }
}

const getTableData = (row) => {
  const arr = [];
  row.forEach((item, objIndex) => {
    arr.push([
      new Cell(objIndex + 1, false, "center", "text").getCell(),
      new Cell(item?.accountingJournalCode, false, "left", "text").getCell(),
      new Cell(_dateFormatter(item?.transactionDate), false, "left", "text").getCell(),
      new Cell(item?.narration, false, "left", "text").getCell(),
      new Cell(
        _fixedPoint(Math.abs(item?.debit)),
        false,
        "right",
        "money"
      ).getCell(),
      new Cell(
        _fixedPoint(Math.abs(item?.credit)),
        false,
        "right",
        "money"
      ).getCell(),
      new Cell(
        _fixedPoint(Math.abs(item?.debit + item?.credit)),
        false,
        "right",
        "money"
      ).getCell(),
    ]);
  });

  arr.push([
    new Cell("Total", true, "right", "text", "A1:D1", true).getCell(),
    new Cell(
      _fixedPoint(Math.abs(row?.reduce((a, b) => a + Number(b?.debit), 0))),
      false,
      "right",
      "money",
      "",
      true
    ).getCell(),
    new Cell(
      _fixedPoint(Math.abs(row?.reduce((a, b) => a + Number(b?.credit), 0))),
      false,
      "right",
      "money",
      "",
      true
    ).getCell(),
    new Cell(
      _fixedPoint(
        Math.abs(
          row?.reduce((a, b) => a + Number(b?.debit), 0) + row?.reduce((a, b) => a + Number(b?.credit), 0) || 0
        )
      ),
      false,
      "right",
      "money",
      "",
      true
    ).getCell(),
  ]);

  return arr;
};

export const CreatePartnerLedgerExcel = (
  selectedBusinessUnit,
  subLedgerReportData,
  fromDate,
  toDate
) => {
  if (subLedgerReportData?.length > 0) {
    const excel = {
      name: "General Ledger Report",
      sheets: [
        {
          name: "General Ledger Report",
          gridLine: false,
          rows: [
            [
              {
                text: selectedBusinessUnit?.label,
                fontSize: 16,
                bold: true,
                cellRange: "A1:G1",
                merge: true,
                alignment: "center:middle",
              },
            ],
            [
              {
                text: selectedBusinessUnit?.address,
                fontSize: 11,
                bold: true,
                cellRange: "A1:G1",
                merge: true,
                alignment: "center:middle",
              },
            ],
            [
              {
                text: "Subsidiary Ledger",
                fontSize: 12,
                bold: true,
                cellRange: "A1:G1",
                merge: true,
                alignment: "center:middle",
              },
            ],
            [
              {
                text: `From Date: ${fromDate}  To Date: ${toDate}`,
                fontSize: 10,
                bold: true,
                cellRange: "A1:G1",
                merge: true,
                alignment: "center:middle",
              },
            ],
            ["_blank*1"],
            [
              {
                text: "SL",
                fontSize: 7,
                bold: true,
                border: "all 000000 thin",
              },
              {
                text: "Code",
                fontSize: 7,
                bold: true,
                border: "all 000000 thin",
              },
              {
                text: "Date",
                fontSize: 7,
                bold: true,
                border: "all 000000 thin",
              },
              {
                text: "Description",
                fontSize: 7,
                bold: true,
                border: "all 000000 thin",
              },
              {
                text: "Debit",
                fontSize: 7,
                bold: true,
                border: "all 000000 thin",
              },
              {
                text: "Credit",
                fontSize: 7,
                bold: true,
                border: "all 000000 thin",
              },
              {
                text: "Balance",
                fontSize: 7,
                bold: true,
                border: "all 000000 thin",
              },
            ],
            ...getTableData(subLedgerReportData),
          ],
        },
      ],
    };
    createFile(excel);
  } else { return }
};
