import axios from "axios";
import { toast } from "react-toastify";

export const getMotherVesselDDL = async (accId, buId, setter, portId) => {
  try {
    const res = await axios.get(
      `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}&PortId=${portId ||
        0}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const ghatCostInfoEntry = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/tms/LigterLoadUnload/CreateG2GLighterExpenses`,
      payload
    );
    cb(res?.data);
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const ghatCostInfoEdit = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/tms/LigterLoadUnload/EditG2GLighterExpenses`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getGhatCostInfoLanding = async (
  buId,
  vesselId,
  shipPointId,
  lighterId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetG2GLighterExpensePagination?BusinessUnitId=${buId}&MotherVesselId=${vesselId}&ShipPointId=${shipPointId}&LighterVesselId=${lighterId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const deleteCostInfo = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/tms/LigterLoadUnload/DeleteLighterExpense?Id=${id}`
    );
    toast.success(res?.data?.message);
    cb(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getGhatCostInfoById = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetG2GLighterExpenseById?Id=${id}`
    );
    cb(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getVehicleAllColumnTotal = (arrData,setState) => {
 
  let toatlValueDemandVehicle = 0;
  let toatlValueReceiveVehicle = 0;
  let toatlValueTruckLoaded = 0;
  let toatlValuePackingMt = 0;
  let toatlValueLabourRequirement = 0;
  let toatlValueLabourPresent = 0;
  let toatlValueLighterWaiting = 0;
  let toatlValueBufferQty = 0;

  arrData.forEach((item) => {
    toatlValueDemandVehicle  += item.demandVehicle || 0;
    toatlValueReceiveVehicle+= item.receiveVehicle || 0;
    toatlValueTruckLoaded += item.truckLoaded || 0;
    toatlValuePackingMt+= item.packingMt || 0;
    toatlValueLabourRequirement+= item.labourRequirement || 0;
    toatlValueLabourPresent += item.labourPresent || 0;
    toatlValueLighterWaiting+= item.lighterWaiting || 0;
    toatlValueBufferQty  += item.bufferQty || 0;
  });
  setState ({
    toatlValueDemandVehicle,
    toatlValueReceiveVehicle,
    toatlValueTruckLoaded,
    toatlValuePackingMt,
    toatlValueLabourRequirement,
    toatlValueLabourPresent,
    toatlValueLighterWaiting,
    toatlValueBufferQty
  })
};
