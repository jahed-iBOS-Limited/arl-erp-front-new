import axios from "axios";

export const ministryReportLanding = async (
  accId,
  buId,
  fromDate,
  toDate,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/wms/WmsReport/GetFertilizerMinistryReport?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    if (res?.status === 200) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const internalReport1Landing = async (
  accId,
  buId,
  fromDate,
  toDate,
  itemId,
  type,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/wms/WmsReport/GetFertilizerInternalReport1?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&ItemId=${itemId}&Type=${type}`
    );
    if (res?.status === 200) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const internalReport2Landing = async (
  accId,
  buId,
  fromDate,
  toDate,
  itemId,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/wms/WmsReport/GetFertilizerInternalReport2?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&ItemId=${itemId}`
    );
    if (res?.status === 200) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getItemDDLFertilizerReport = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/item/ItemSales/GetItemSalesDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
