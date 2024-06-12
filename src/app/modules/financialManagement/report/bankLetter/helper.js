import moment from "moment";
import { akijResourcehead } from "../../invoiceManagementSystem/salesInvoice/base64Images/akijResource";
import { batayonTradersLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/batayounTraders";
import { bluePillLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/bluePill";
import { bongoTradersLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/bongoTraders";
import { buildingLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/building";
import { cementLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/cement";
import { commoditiesLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/commodities";
import { dailyTradingLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/dailyTrading";
import { directTradingLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/directTrading";
import { essentialLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/essential";
import { eurasiaTradingLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/eurasiaTrading";
import { exoticaTradersLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/exoticaTraders";
import { ispatLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/ispat";
import { lineAsiaTradingLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/lineAsiaTrading";
import { magnumLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/magnum";
import { MTSLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/mts";
import { nobayonTradersLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/nobayonTraders";
import { oneTradingLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/oneTrading";
import { optimaTradersLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/optimaTraders";
import { polyFibreLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/polyFibre";
import { readymixLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/readymix";
import { resourceTradersLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/resourceTraders";
import { tradersLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/traders";
import { tradingLetterhead } from "../../invoiceManagementSystem/salesInvoice/base64Images/trading";

export const getLetterHead = ({ buId }) => {
  const letterhead =
    buId === 175
      ? readymixLetterhead
      : buId === 94
      ? MTSLetterhead
      : buId === 144
      ? essentialLetterhead
      : buId === 4
      ? cementLetterhead
      : buId === 186
      ? bluePillLetterhead
      : buId === 8
      ? polyFibreLetterhead
      : buId === 224
      ? ispatLetterhead
      : buId === 220
      ? buildingLetterhead
      : buId === 171
      ? magnumLetterhead
      : buId === 221
      ? commoditiesLetterhead
      : buId === 216
      ? tradersLetterhead
      : buId === 213
      ? tradingLetterhead
      : buId === 181
      ? oneTradingLetterhead
      : buId === 212
      ? batayonTradersLetterhead
      : buId === 178
      ? bongoTradersLetterhead
      : buId === 182
      ? dailyTradingLetterhead
      : buId === 180
      ? directTradingLetterhead
      : buId === 183
      ? eurasiaTradingLetterhead
      : buId === 218
      ? exoticaTradersLetterhead
      : buId === 209
      ? lineAsiaTradingLetterhead
      : buId === 211
      ? nobayonTradersLetterhead
      : buId === 214
      ? optimaTradersLetterhead
      : buId === 210
      ? resourceTradersLetterhead
      : buId === 136
      ? akijResourcehead
      : "";

  return letterhead;
};
export const formatDate = (dateString) => {
  // Parse the input date
  const date = moment(dateString, "YYYY-MM-DD");

  // Get the day and determine the ordinal suffix
  const day = date.date();
  let dayWithSuffix;
  if (day % 10 === 1 && day !== 11) {
    dayWithSuffix = day + "ST";
  } else if (day % 10 === 2 && day !== 12) {
    dayWithSuffix = day + "ND";
  } else if (day % 10 === 3 && day !== 13) {
    dayWithSuffix = day + "RD";
  } else {
    dayWithSuffix = day + "TH";
  }

  // Get the month in uppercase
  const month = date.format("MMMM").toUpperCase();

  // Get the year
  const year = date.year();

  // Format the final string
  return `${dayWithSuffix} DAY OF ${month},${year}`;
};
