import Axios from "axios";

// Get landing data
export const getItemRequestGridData = async (
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/BillPosting/GetSalesUnloadBillingReportbyDateRange?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}`
      // `/oms/BillPosting/GetSalesUnloadBillingReportbyDateRange?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=2020-09-06&ToDate=2020-12-05`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      let gridData = res?.data?.map((data) => {
        return {
          deliveryCode: data.deliveryCode,
          deliveryQty: data.deliveryQty,
          loadAmount: data.loadAmount,
          unLoadAmount: data.unLoadAmount,
        };
      });
      setter(gridData);
    }
  } catch (error) {
    //
    setLoading(false);
  }
};

export const GetLoadUnloadLabourBillTopSheet = async (
  accId,
  buId,
  fromDate,
  toDate,
  shipPointId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/tms/LabourBillInfo/GetPendingUnloadLabourBillTopSheet?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&ShipPointId=${shipPointId}`
    );
    setter(res?.data)
    setLoading(false);
  } catch (error) {
    setter([])
    setLoading(false);
  }
};
