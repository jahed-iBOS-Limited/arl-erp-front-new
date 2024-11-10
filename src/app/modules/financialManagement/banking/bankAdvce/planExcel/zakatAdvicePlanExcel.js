import { generateJsonToExcel } from "../../../../_helper/excel/jsonToExcel";

export const zakatAdvicePlanExcel = (data,values, fileName, getZakatBlob) =>{
    const header = [
        {
          text: "Account Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strBankAccountName",
        },
        {
          text: "Code No",
          textFormat: "text",
          alignment: "center:middle",
          key: "strPayeCode",
        },
        {
          text: "Bank Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strBankName",
        },
        {
          text: "Branch Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strBankBranchName",
        },
        {
          text: "A/C Type",
          textFormat: "text",
          alignment: "center:middle",
          key: "strBankAccType",
        },
        {
          text: "Account No",
          textFormat: "text",
          alignment: "center:middle",
          key: "strBankAccountNo",
        },
        {
          text: "Amount",
          textFormat: "money",
          alignment: "right:middle",
          key: "numAmount",
        },
        {
          text: "Payment Info",
          textFormat: "text",
          alignment: "center:middle",
          key: "strPaymentReff",
        },
        {
          text: "Comments",
          textFormat: "number",
          alignment: "center:middle",
          key: "strComments",
        },
        {
          text: "Routing No",
          textFormat: "text",
          alignment: "center:middle",
          key: "strRoutingNumber",
        },
        {
          text: "Instrument No",
          textFormat: "text",
          alignment: "center:middle",
          key: "strInstrumentNo",
        },
        {
          text: "SL No",
          textFormat: "number",
          alignment: "center:middle",
          key: "sl",
        },
        {
          text: "Debit Account",
          textFormat: "text",
          alignment: "right:middle",
          key: "bankAccNo",
        },
      ];
      const _data = data.map((item, index) => {
        return {
          ...item,
          sl: index + 1,
          bankAccNo:values?.bankAccountNo?.bankAccNo
        };
      });
    generateJsonToExcel(header, _data, fileName, getZakatBlob);
}