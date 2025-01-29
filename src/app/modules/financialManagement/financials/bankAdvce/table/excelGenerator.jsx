import { formatFive } from "../excel/format-05";
import { formatTwo } from "../excel/format-02";
import { formatThree } from "../excel/format-03";
import { formatOne } from "../excel/format-01";
import { formatFour } from "../excel/format-04";
import { formatSeven } from "../excel/format-07";
import { formatSix } from "../excel/format-06";

export const getFormatNumber = (adviceType, advice) => {
  switch ([adviceType, advice].join("-")) {
    case "1-1":
    case "1-8":
    case "12-1":
    case "12-8":
    case "13-1":
    case "13-8":
    case "14-1":
    case "14-8":
    case "15-1":
      return 1;

    case "1-2":
    case "1-9":
    case "12-2":
    case "12-9":
    case "13-2":
    case "13-9":
    case "14-2":
    case "14-9":
    case "15-2":
    case "15-8":
    case "15-9":
    case "15-4":
      return 2;

    case "1-3":
    case "12-3":
    case "13-3":
    case "14-3":
    case "15-3":
      return 3;
    // for jamuna-beftn andnrbcbl-beftn both same
    case "1-4":
    case "12-4":
    case "13-4":
    case "14-4":
    case "1-10":
    case "12-10":
    case "13-10":
    case "14-10":
      return 4;

    case "5-1":
    case "5-2":
    case "5-3":
    case "5-4":
    case "5-8":
    case "5-9":
      return 5;

    case "1-7":
    case "12-7":
    case "13-7":
    case "14-7":
      return 6;

    case "1-5":
    case "12-5":
    case "13-5":
    case "14-5":
    case "1-6":
    case "12-6":
    case "13-6":
    case "14-6":
      return 7;

    default:
      break;
  }
};

export const excelGenerator = (
  values,
  adviceReportData,
  selectedBusinessUnit,
  total,
  totalInWords,
  adviceBlobData,
  fileName
) => {
  switch (getFormatNumber(values?.adviceType?.value, values?.advice?.value)) {
    case 1:
      formatOne(
        values,
        adviceReportData,
        selectedBusinessUnit,
        total,
        totalInWords,
        adviceBlobData,
        fileName
      );
      return;
    case 2:
      formatTwo(
        values,
        adviceReportData,
        selectedBusinessUnit,
        total,
        totalInWords,
        adviceBlobData,
        fileName
      );
      return;
    case 3:
      formatThree(
        values,
        adviceReportData,
        selectedBusinessUnit,
        total,
        totalInWords,
        adviceBlobData,
        fileName
      );
      return;
    case 4:
      formatFour(
        values,
        adviceReportData,
        selectedBusinessUnit,
        total,
        totalInWords,
        adviceBlobData,
        fileName
      );
      return;
    case 5:
      formatFive(
        adviceReportData,
        values,
        total,
        totalInWords,
        selectedBusinessUnit,
        false,
        adviceBlobData,
        fileName
      );
      return;
    case 6:
      formatSix(
        values,
        adviceReportData,
        selectedBusinessUnit,
        total,
        totalInWords,
        adviceBlobData,
        fileName
      );
      return;
    case 7:
      formatSeven(
        values,
        adviceReportData,
        selectedBusinessUnit,
        total,
        totalInWords,
        adviceBlobData,
        fileName
      );
      return;
    default:
      if(values?.advice?.label === "JAMUNA-RTGS"){
        formatFour(
          values,
          adviceReportData,
          selectedBusinessUnit,
          total,
          totalInWords,
          adviceBlobData,
          fileName
        );
      }
      break;
  }
};
