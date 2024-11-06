import axios from "axios";
import {
  _dateFormatter,
  _dateTimeFormatter,
} from "../../../_helper/_dateFormate";
import { generateJsonToExcel } from "../../../_helper/excel/jsonToExcel";
import { eProcurementBaseURL } from "../../../../App";

export const rfqReportExcel = (rowData) => {
  const header = [
    {
      text: "SL",
      textFormat: "text",
      alignment: "center:middle",
      key: "sl",
    },
    {
      text: "RFQ No",
      textFormat: "text",
      alignment: "center:middle",
      key: "requestForQuotationCode",
    },
    {
      text: "RFQ Date",
      textFormat: "text",
      alignment: "center:middle",
      key: "rfqdate",
    },
    {
      text: "Currency",
      textFormat: "text",
      alignment: "center:middle",
      key: "currencyCode",
    },
    {
      text: "RFQ Start Date-Time",
      textFormat: "text",
      alignment: "center:middle",
      key: "quotationEntryStart",
    },
    {
      text: "RFQ End Date-Time",
      textFormat: "text",
      alignment: "center:middle",
      key: "validTillDate",
    },
    {
      text: "Status",
      textFormat: "text",
      alignment: "center:middle",
      key: "status",
    },
    {
      text: "Created By",
      textFormat: "text",
      alignment: "center:middle",
      key: "createdBy",
    },
  ];

  const _data = rowData.map((item, index) => {
    return {
      ...item,
      sl: index + 1,
      rfqdate: _dateFormatter(item.rfqdate),
      quotationEntryStart: _dateTimeFormatter(item.quotationEntryStart),
      validTillDate: _dateTimeFormatter(item.validTillDate),
    };
  });

  generateJsonToExcel(header, _data, "Request For Quotation Report");
};

export const createQuotationPrepare = async (
  erpUserId,
  requestForQuotationId
) => {
  try {
    const response = await axios.post(
      `${eProcurementBaseURL}/RequestForQuotation/UpdateRequestForQuotationStatus?erpUserId=${erpUserId}&requestForQuotationId=${requestForQuotationId}&type=Prepared`
    );
    return response?.data;
  } catch (error) {
    return [];
  }
};
