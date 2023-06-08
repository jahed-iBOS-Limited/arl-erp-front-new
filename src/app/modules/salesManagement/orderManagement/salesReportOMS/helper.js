import Axios from "axios";
import { toast } from "react-toastify";

export const getTaxSalesReport_api = async (
  buId,
  itemId,
  shippointId,
  fromDate,
  toDate,
  customerId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/OMSPivotReport/TaxSalesReport?BusinessUnitId=${buId}&ItemId=${itemId}&DepoId=${shippointId}&FromDate=${fromDate}&ToDate=${toDate}&CustomerId=${customerId}`
    );
    if (res?.data?.length === 0) toast.warning("Data not found");
    const result = res?.data?.map((itm) => ({
      ...itm,
      qty: Math.round(itm?.qty),
      rate: Math.round(itm?.rate),
      totalAmount: Math.round(itm?.totalAmount),
    }));
    setter(result);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getItemDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxItemForSalesDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetBranchDDL = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxBranchDDL?AccountId=${accid}&BusinessUnitId=${buid}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPartnerNameDDL_api = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accid}&BusinessUnitId=${buid}&PartnerTypeId=2`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
