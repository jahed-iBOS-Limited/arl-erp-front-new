import { akijAgroLetterhead } from './base64Images/akijAgro';
import { akijIbosLetterHead } from './base64Images/akijIbos';
import { akijLogisticshead } from './base64Images/akijLogistics';
import { akijResourcehead } from './base64Images/akijResource';
import { akijShippingLine } from './base64Images/akijShippingLine';
import { akijShippingLinePteSingaporeLetterhead } from './base64Images/akijShippingLinePteSingapore';
import { batayonTradersLetterhead } from './base64Images/batayounTraders';
import { bluePillLetterhead } from './base64Images/bluePill';
import { bongoTradersLetterhead } from './base64Images/bongoTraders';
import { buildingLetterhead } from './base64Images/building';
import { cementLetterhead } from './base64Images/cement';
import { commoditiesLetterhead } from './base64Images/commodities';
import { dailyTradingLetterhead } from './base64Images/dailyTrading';
import { directTradingLetterhead } from './base64Images/directTrading';
import { essentialLetterhead } from './base64Images/essential';
import { eurasiaTradingLetterhead } from './base64Images/eurasiaTrading';
import { exoticaTradersLetterhead } from './base64Images/exoticaTraders';
import { hashemhead } from './base64Images/hashem';
import { infoTechLetterhead } from './base64Images/infoTech';
import { ispatLetterhead } from './base64Images/ispat';
import { kafilLetterhead } from './base64Images/kafil';
import { lineAsiaTradingLetterhead } from './base64Images/lineAsiaTrading';
import { magnumLetterhead } from './base64Images/magnum';
import { mariTimeLetterhead } from './base64Images/mariTime';
import { MTSLetterhead } from './base64Images/mts';
import { nobayonTradersLetterhead } from './base64Images/nobayonTraders';
import { oceanLetterhead } from './base64Images/ocean';
import { oneTradingLetterhead } from './base64Images/oneTrading';
import { optimaTradersLetterhead } from './base64Images/optimaTraders';
import { polyFibreLetterhead } from './base64Images/polyFibre';
import { readymixLetterhead } from './base64Images/readymix';
import { resourceTradersLetterhead } from './base64Images/resourceTraders';
import { seaLineLetterhead } from './base64Images/seaLine';
import { seaLineShippingLetterhead } from './base64Images/seaLineShip';
import { southAsiaLetterhead } from './base64Images/southAsia';
import { tradersLetterhead } from './base64Images/traders';
import { tradingLetterhead } from './base64Images/trading';

export function commonGetLetterHead({ buId }) {
  // key value
  // buId : base64 image file
  const letterHeadObj = {
    175: readymixLetterhead,
    94: MTSLetterhead,
    144: essentialLetterhead,
    4: cementLetterhead,
    186: bluePillLetterhead,
    8: polyFibreLetterhead,
    224: ispatLetterhead,
    220: buildingLetterhead,
    171: magnumLetterhead,
    221: commoditiesLetterhead,
    216: tradersLetterhead,
    213: tradingLetterhead,
    181: oneTradingLetterhead,
    212: batayonTradersLetterhead,
    178: bongoTradersLetterhead,
    182: dailyTradingLetterhead,
    180: directTradingLetterhead,
    183: eurasiaTradingLetterhead,
    218: exoticaTradersLetterhead,
    209: lineAsiaTradingLetterhead,
    211: nobayonTradersLetterhead,
    214: optimaTradersLetterhead,
    210: resourceTradersLetterhead,
    136: akijResourcehead,
    188: hashemhead,
    225: akijLogisticshead,
    208: seaLineLetterhead,
    233: seaLineShippingLetterhead,
    12: oceanLetterhead,
    117: mariTimeLetterhead,
    17: akijShippingLine,
    232: akijAgroLetterhead,
    138: infoTechLetterhead,
    184: akijIbosLetterHead,
    189: kafilLetterhead,
    234: southAsiaLetterhead,
    102: akijShippingLinePteSingaporeLetterhead,
  };

  return letterHeadObj[buId] || '';
}
