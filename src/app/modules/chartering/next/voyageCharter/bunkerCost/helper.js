import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  vesselName: Yup.object().shape({
    label: Yup.string().required("Vessel Name is required"),
    value: Yup.string().required("Vessel Name is required"),
  }),
  voyageNo: Yup.object().shape({
    label: Yup.string().required("Voyage No is required"),
    value: Yup.string().required("Voyage No is required"),
  }),
});

export const getConsumption = async (
  vesselId,
  voyageId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/BunkerInformation/GetItemInfoByBunker?VesselId=${vesselId}&VoyageId=${voyageId}`
    );
    setter(res?.data[0]);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getBunkerPurchaseList = async (
  buId,
  vesselId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/PurchaseBunker/GetRemainingItemInfo?BusinessUnitId=${buId}&VesselId=${vesselId}`
    );

    setter(
      res?.data?.map((item) => ({
        ...item,
        itemCost: 0,
        consumption: 0,
        remainingQty: item?.remaining,
      }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const saveBunkerCost = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `https://imarine.ibos.io/domain/BunkerCost/CreateBunkerCost`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

// get landing page data
export const getBunkerCostLandingData = async (
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
      `https://imarine.ibos.io/domain/BunkerCost/GetBunkerCostLanding?VesselId=${vesselId}&VoyageId=${voyageId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
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
      `https://imarine.ibos.io/domain/BunkerCost/GetBunkerCostById?CostId=${costId}`
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
