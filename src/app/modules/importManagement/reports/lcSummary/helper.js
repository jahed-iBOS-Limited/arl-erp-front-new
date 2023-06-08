import axios from "axios";
import { toast } from "react-toastify";

// LC summary left side report
export const getLCSummaryBasicInformation = async (
  accId,
  buId,
  LCNumber,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    let res = await axios.get(
      `/imp/ImportReport/GetLCSummeryBasicInfoReport?accountId=${accId}&businessUnitId=${buId}&searchTerm=${LCNumber}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading(false);
  }
};

// LC summary right side report
export const getLCSummaryCostSummary = async (
  accId,
  buId,
  LCNumber,
  shipmentId,
  setter,
  setTotalLandingCost,
  setLoading
) => {
  setLoading(true);
  try {
    let res = await axios.get(
      `/imp/ImportReport/GetLCCostSummeryReport?accountId=${accId}&businessUnitId=${buId}&searchTerm=${LCNumber}&shipmentId=${shipmentId}`
    );
    const totalLandingCost =
      res?.data?.lcOpeningCharge +
      res?.data?.totalDocReleaseCharges +
      res?.data?.paymentOnMaturity +
      res?.data?.pgAmount +
      res?.data?.customDutyandTaxes +
      res?.data?.portCharges +
      res?.data?.shippingCharges +
      res?.data?.transportCharges +
      res?.data?.cnFCharges +
      res?.data?.surveyCharges +
      res?.data?.cleaningCharges;

    setTotalLandingCost(totalLandingCost);
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading(false);
  }
};

// Get shipment DDL
export const getShipmentListForLCSummaryReport = async (
  accId,
  buId,
  poLc,
  setter
) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetShipmentListForAllCharge?accountId=${accId}&businessUnitId=${buId}&search=${poLc}`
    );
    setter(res?.data);
  } catch (error) {}
};
