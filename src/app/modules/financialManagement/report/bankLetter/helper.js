import moment from 'moment';
import { akijAgroLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/akijAgro';
import { akijIbosLetterHead } from '../../invoiceManagementSystem/salesInvoice/base64Images/akijIbos';
import { akijLogisticshead } from '../../invoiceManagementSystem/salesInvoice/base64Images/akijLogistics';
import { akijResourcehead } from '../../invoiceManagementSystem/salesInvoice/base64Images/akijResource';
import { akijShippingLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/akijShipping';
import { batayonTradersLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/batayounTraders';
import { bluePillLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/bluePill';
import { bongoTradersLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/bongoTraders';
import { buildingLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/building';
import { cementLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/cement';
import { commoditiesLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/commodities';
import { dailyTradingLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/dailyTrading';
import { directTradingLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/directTrading';
import { essentialLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/essential';
import { eurasiaTradingLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/eurasiaTrading';
import { exoticaTradersLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/exoticaTraders';
import { hashemhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/hashem';
import { infoTechLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/infoTech';
import { ispatLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/ispat';
import { kafilLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/kafil';
import { lineAsiaTradingLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/lineAsiaTrading';
import { magnumLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/magnum';
import { mariTimeLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/mariTime';
import { MTSLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/mts';
import { nobayonTradersLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/nobayonTraders';
import { oceanLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/ocean';
import { oneTradingLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/oneTrading';
import { optimaTradersLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/optimaTraders';
import { polyFibreLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/polyFibre';
import { readymixLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/readymix';
import { resourceTradersLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/resourceTraders';
import { seaLineLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/seaLine';
import { seaLineShippingLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/seaLineShip';
import { southAsiaLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/southAsia';
import { tradersLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/traders';
import { tradingLetterhead } from '../../invoiceManagementSystem/salesInvoice/base64Images/trading';
// 102 singa,
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
      : buId === 188
      ? hashemhead
      : buId === 225
      ? akijLogisticshead
      : buId === 208
      ? seaLineLetterhead
      : buId === 233
      ? seaLineShippingLetterhead
      : buId === 12
      ? oceanLetterhead
      : buId === 117
      ? mariTimeLetterhead
      : buId === 17
      ? akijShippingLetterhead
      : buId === 232
      ? akijAgroLetterhead
      : buId === 138
      ? infoTechLetterhead
      : buId === 184
      ? akijIbosLetterHead
      : buId === 189
      ? kafilLetterhead
      : buId === 234
      ? southAsiaLetterhead
      : '';

  return letterhead;
};
export const formatDate = (dateString) => {
  // Parse the input date
  const date = moment(dateString, 'YYYY-MM-DD');

  // Get the day and determine the ordinal suffix
  const day = date.date();
  let dayWithSuffix;
  if (day % 10 === 1 && day !== 11) {
    dayWithSuffix = day + 'ST';
  } else if (day % 10 === 2 && day !== 12) {
    dayWithSuffix = day + 'ND';
  } else if (day % 10 === 3 && day !== 13) {
    dayWithSuffix = day + 'RD';
  } else {
    dayWithSuffix = day + 'TH';
  }

  // Get the month in uppercase
  const month = date.format('MMMM').toUpperCase();

  // Get the year
  const year = date.year();

  // Format the final string
  return `${dayWithSuffix} DAY OF ${month},${year}`;
};
