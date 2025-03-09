import React from "react";
import { readymixLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/readymix";
import { MTSLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/mts";
import { essentialLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/essential";
import { cementLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/cement";
import { bluePillLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/bluePill";
import { polyFibreLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/polyFibre";
import { ispatLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/ispat";
import { buildingLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/building";
import { magnumLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/magnum";
import { commoditiesLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/commodities";
import { tradersLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/traders";
import { tradingLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/trading";
import { oneTradingLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/oneTrading";
import { batayonTradersLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/batayounTraders";
import { bongoTradersLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/bongoTraders";
import { dailyTradingLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/dailyTrading";
import { directTradingLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/directTrading";
import { eurasiaTradingLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/eurasiaTrading";
import { exoticaTradersLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/exoticaTraders";
import { lineAsiaTradingLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/lineAsiaTrading";
import { nobayonTradersLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/nobayonTraders";
import { optimaTradersLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/optimaTraders";
import { resourceTradersLetterhead } from "../../../invoiceManagementSystem/salesInvoice/base64Images/resourceTraders";

const PdfHeader = ({ selectedBusinessUnit }) => {
  const buId = selectedBusinessUnit?.value;
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
      : "";
  return (
    <>
      <div
        className="invoice-header"
        style={{
          backgroundImage: `url(${letterhead})`,
          backgroundRepeat: "no-repeat",
          height: "150px",
          backgroundPosition: "left 10px",
          backgroundSize: "cover",
          position: "fixed",
          width: "100%",
          top: "-40px",
        }}
      ></div>
      <div
        className="invoice-footer"
        style={{
          backgroundImage: `url(${letterhead})`,
          backgroundRepeat: "no-repeat",
          height: "100px",
          backgroundPosition: "left bottom",
          backgroundSize: "cover",
          bottom: "-0px",
          position: "fixed",
          width: "100%",
        }}
      ></div>
    </>
  );
};

export default PdfHeader;
