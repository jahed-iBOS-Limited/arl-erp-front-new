import Axios from "axios";

export const GetFartilizerSubsidy_api = async (
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/wms/Challan/GetFartilizerSubsidy?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(
      res?.data?.map((itm) => ({
        ...itm,
        Allotment: itm.Allotment?.toFixed(2),
        Dqty: itm.Dqty?.toFixed(2),
        Residual: itm.Residual?.toFixed(2),
      }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetFartilizerOutsideSubsidy_api = async (
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/wms/Challan/GetFartilizerOutsideSubsidy?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(
      res?.data?.map((itm) => ({
        ...itm,
        ADeliveryQty: itm.ADeliveryQty?.toFixed(2),
        aavgrate: itm.aavgrate?.toFixed(2),
        AAmount: itm.AAmount?.toFixed(2),
        RDeliveryQty: itm.RDeliveryQty?.toFixed(2),
        ravgRate: itm.ravgRate?.toFixed(2),
        RAmount: itm.RAmount?.toFixed(2),
      }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetBusinessUnitName_api = async (setter) => {
  try {
    const res = await Axios.get(`/wms/WmsReport/GetBusinessUnitName`);
    setter(
      res?.data?.map((itm) => ({
        ...itm,
        value: itm?.businessUnitId,
        label: itm?.businessUnitName,
      }))
    );
  } catch (error) {
    setter([]);
  }
};
