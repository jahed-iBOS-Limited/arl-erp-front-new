import axios from 'axios';
import { toast } from 'react-toastify';
import { imarineBaseUrl } from '../../../../../App';

// get landing page data
export const getBunkerCostLandingData = async (
  accId,
  buId,
  vesselId,
  voyageId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/BunkerCost/GetBunkerCostLanding?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetBunkerCostById = async (
  costId,
  setter,
  setBunkerPurchaseList,
  setConsumption,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/BunkerCost/GetBunkerCostById?CostId=${costId}`
    );
    const modifyList = res?.data?.objRow?.map((item) => ({
      ...item,
      dtePurchaseDate: item?.purchaseDate,
      itemQty: item?.purchaseQty,
      itemRate: item?.purchaseRate,
      consumption: item?.consumptionQty,
      itemCost: item?.consumptionValue,
    }));
    const {
      vesselName,
      vesselId,
      vonageName,
      voyageId,
      consmQtyLsmgo,
      consmQtyLsfo2,
      consmQtyLsfo1,
    } = res?.data?.objHeader;
    const header = {
      vesselName: {
        label: vesselName,
        value: vesselId,
      },
      voyageNo: {
        label: vonageName,
        value: voyageId,
      },
    };
    const consumption = {
      consumptionLsmgoqty: consmQtyLsmgo,
      consumptionLsfo1qty: consmQtyLsfo1,
      consumptionLsfo2qty: consmQtyLsfo2,
    };
    setter(header);
    setBunkerPurchaseList(modifyList);
    setConsumption(consumption);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
