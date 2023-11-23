import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../_chartinghelper/_dateFormatter";
import { imarineBaseUrl } from "../../../../App";

export const getTripLandingData = async ({
  accId,
  buId,
  lighterVesselId,
  vesselType,
  fromDate,
  toDate,
  Status,
  pageNo,
  pageSize,
  setter,
  setLoading,
}) => {
  setLoading(true);
  const lighterIdStr = lighterVesselId
    ? `&LighterVesselId=${lighterVesselId}`
    : "";
  const statusStr = Status ? `&Status=${Status}` : "";
  const fromDateStr = fromDate ? `&FromDate=${fromDate}` : "";
  const toDateStr = toDate ? `&ToDate=${toDate}` : "";
  const vesselTypeStr = vesselType ? `&vesselType=${vesselType}` : "";

  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LighterVesselTrip/GetLighterVesselTripLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${lighterIdStr}${statusStr}${fromDateStr}${toDateStr}${vesselTypeStr}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const updateOilRateApi = async (payload) => {
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/LighterVessel/EditLighterVesselOilRate`,
      payload
    );
    toast.success(res?.data?.message, { toastId: 34567890 });
  } catch (err) {
    toast.warning(err?.message || err?.data?.response?.message, {
      toastId: 34567890,
    });
  }
};

export const getOilRateApi = async ({ values, setFieldValue }) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LighterVessel/GetLighterVesselOilRate`
    );

    setFieldValue("numDieselRate", res?.data[0]?.numOilRate);
    setFieldValue("numLubRate", res?.data[1]?.numOilRate);
    setFieldValue("numHydrolicRate", res?.data[2]?.numOilRate);

    setFieldValue(
      "numDieselCost",
      (res?.data[0]?.numOilRate * values?.numDieselSupply)?.toFixed(2) || 0
    );
    setFieldValue(
      "numLubCost",
      (res?.data[1]?.numOilRate * values?.numLubSupply)?.toFixed(2) || 0
    );
    setFieldValue(
      "numHydrolicCost",
      (res?.data[2]?.numOilRate * values?.numHydrolicSupply)?.toFixed(2) || 0
    );

    setFieldValue("numDiesel", res?.data[0]);
    setFieldValue("numLub", res?.data[1]);
    setFieldValue("numHydrolic", res?.data[2]);
  } catch (err) {}
};

export const getItemRateForBunker = async ({
  accId,
  buId,
  vesselId,
  voyageId,
  setter,
  setLoading,
}) => {
  setLoading(true);
  try {
    const { data } = await axios.get(
      `${imarineBaseUrl}/domain/BunkerInformation/GetItemRateForBunker?AccountId=${accId}&BusinessUnitId=${buId}&VoyageNoId=${voyageId}&VesselId=${vesselId}`
    );
    setter("lsfotripRate", data?.lsifoPrice);
    setter("lsmgotripRate", data?.lsmgoPrice);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const createTrip = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      "${imarineBaseUrl}/domain/LighterVesselTrip/CreateLighterVesselTrip",
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const editTrip = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      "${imarineBaseUrl}/domain/LighterVesselTrip/EditLighterVesselTrip",
      data
    );
    if (res?.status === 200) {
      toast.success("Updated Successfully", {
        toastId: 123,
      });
    }
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message || err?.message, {
      toastId: 1234,
    });
    setLoading(false);
  }
};

export const getTripDataById = async ({
  id,
  setLoading,
  setSingleData,
  setRowData,
}) => {
  setLoading(true);
  try {
    const { data } = await axios.get(
      `${imarineBaseUrl}/domain/LighterVesselTrip/LighterVesselTripGetById?LighterTripId=${id}`
    );

    const exp = data?.exp;
    const header = data?.header;
    const rows = data?.rows;

    const payload = {
      tripNo: header?.tripNo,
      lighterTripId: header?.lighterTripId,
      tripExpenseId: exp?.tripExpenseId,

      /* Expense */
      numDieselSupply: exp?.numDieselSupply || 0,
      numDieselRate: exp?.numDieselRate || 0,
      numDieselCost: exp?.numDieselCost || 0,
      numLubSupply: exp?.numLubSupply || 0,
      numLubRate: exp?.numLubRate || 0,
      numLubCost: exp?.numLubCost || 0,
      numHydrolicSupply: exp?.numHydrolicSupply || 0,
      numHydrolicRate: exp?.numHydrolicRate || 0,
      numHydrolicCost: exp?.numHydrolicCost || 0,
      numTripCost: exp?.numTripCost || 0,
      numPilotCoupon: exp?.numPilotCoupon || 0,
      numTotalExpense: exp?.numTotalExpense || 0,
      numStoreExpense: 0, // It is no longer to used. It will add monthly for a single Lighter Vessel

      /* Header State */
      lighterVessel: {
        value: header?.lighterVesselId,
        label: header?.lighterVesselName,
      }, // DDL
      loadPort: {
        value: header?.loadPortId,
        label: header?.loadPortName,
      }, // DDL
      dischargePort: header?.dischargePortId
        ? {
            value: header?.dischargePortId,
            label: header?.dischargePortName,
          }
        : "", // DDL
      dteTripCommencedDate: header?.dteTripCommencedDate,
      dteTripCompletionDate: header?.dteTripCompletionDate,
      numTotalTripDuration: header?.numTotalTripDuration,
      isComplete: header?.isComplete,

      completeDate: header?.completeDate,
      receiveDate: header?.receiveDate || "",
      dischargeStartDate: header?.dischargeStartDate || "",
      dischargeComplDate: header?.dischargeComplDate || "",

      // tripNo: "",
      arrivalAtCtg: header?.arrivalCtgDate || "",
      loadingCommenceAtCtg: header?.loadCommCtgDate || "",
      loadingCompleteAtCtg: header?.loadComplCtgDate || "",
      departureAtCtg: header?.departureCtgDate || "",

      /* Row State */
      motherVessel: "", // DDL
      voyageNo: "", // DDL
      srnumber: "",
      eta: "",
      numBlqty: "",
      consigneeParty: "", // DDL
      lcnumber: "",
      cargo: "", // DDL
      numEstimatedCargoQty: "",
      numFreight: "",
      numActualCargoQty: "",
      numTotalFreight: "",
    };

    setSingleData(payload);
    setRowData(rows);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    setRowData([]);
  }
};


export const setValue = async (
  id,
  setFieldValue,
) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LighterVesselSurvey/GetLighterVesselSurveyByID?SurveyId=${id}`
    );
  if(res?.data){
    setFieldValue("eta", _dateFormatter(res?.data?.arrivalDate));
    setFieldValue("numBlqty", res?.data?.blqty);
    setFieldValue("lcnumber", res?.data?.lcno);
  }
  } catch (err) {

  }
};
