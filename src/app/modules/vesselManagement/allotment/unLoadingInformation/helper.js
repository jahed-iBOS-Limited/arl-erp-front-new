import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const getUnloadingInformationById = async (
  rowId,
  voyageId,
  lvId,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetLighterUnloadingInfoById?VoyageNo=${voyageId}&LighterVesselId=${lvId}&RowId=${rowId}`
    );
    const {
      shipPointName,
      shipPointId,
      progarm,
      lighterVesselId,
      lighterVesselName,
      motherVesselId,
      motherVesselName,
      receivedDate,
      unloadStartDate,
      unloadCompleteDate,
      itemId,
      itemName,
      lighterDestinationName,
      lighterDestinationId,
    } = res?.data;

    const singleData = {
      ...res?.data,
      shipPoint: {
        value: shipPointId,
        label: shipPointName,
      },
      programNo: {
        value: progarm,
        label: progarm,
      },
      lighterVessel: {
        value: lighterVesselId,
        label: lighterVesselName,
      },
      motherVessel: {
        value: motherVesselId,
        label: motherVesselName,
      },
      receivedAt: receivedDate,
      unloadingStart: unloadStartDate,
      unloadingDate: "",
      unloadedQty: "",
      unloadingComplete: unloadCompleteDate || "",
      isComplete: unloadCompleteDate ? true : false,
      item: {
        value: itemId,
        label: itemName,
      },
      lighterDestination: {
        value: lighterDestinationId,
        label: lighterDestinationName,
      },
    };
    cb(singleData);
    setter(singleData);
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};

export const getLoadingInfoByVoyageNo = async (
  rowId,
  voyageNo,
  lvId,
  setter,
  setRowData,
  setLoading,
  type
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/ViewLighterUnloadingInfoByVoyageNo?VoyageNo=${voyageNo}&LighterVesselId=${lvId}&RowId=${rowId}`
    );
    const { motherVesselId, motherVesselName, progarm } = res?.data;

    const row = res?.data?.rowDataList[0];

    const singleData = {
      ...res?.data,
      shipPoint: {
        value: row?.shipPointId,
        label: row?.shipPointName,
      },
      programNo: {
        value: progarm,
        label: progarm,
      },
      lighterVessel: {
        value: row?.lighterVesselId,
        label: row?.lighterVesselName,
      },
      motherVessel: {
        value: motherVesselId,
        label: motherVesselName,
      },
      receivedAt: row?.receiveDate,
      unloadingStart: row?.unloadStartDate,
      unloadingDate: "",
      unloadedQty: type === "modify" ? row?.receiveQnt : "",
      unloadingComplete: row.unloadCompleteDate || "",
      rowId: type === "modify" ? row?.rowId : "",
      isComplete: row.unloadCompleteDate ? true : false,
      item: {
        value: row?.itemId,
        label: row?.itemName,
      },
      lighterDestination: {
        value: row?.lighterDestinationId,
        label: row?.lighterDestinationName,
      },
    };

    setter(singleData);
    setRowData(res?.data?.rowDataList);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getInfoForUnloading = async (
  lighterDestination,
  motherVesselId,
  lighterVesselId,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetLighterLoadingInfoToUnload?DestinationId=${lighterDestination}&MotherVesselId=${motherVesselId}&LighterVesselId=${lighterVesselId}`
    );
    // /tms/LigterLoadUnload/GetLighterLoadingInfoToUnload?DestinationId=2&MotherVesselId=127&LighterVesselId=330

    if (res?.data?.length < 1) {
      toast.warn("Loading Information not Found for This Lighter!");
    } else {
      cb(res?.data[0]);
    }
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getLightersByVesselNLighterDestination = async (
  shipPointId,
  vesselId,
  setter,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/LighterVesselFromGeneralInfoDDL?DestinationId=${shipPointId}&MotherVesselId=${vesselId}`
    );
    setter(res?.data);
    cb(res?.data[0]);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const editUnloadinfo = async (data, cb) => {
  try {
    const res = await axios.put(
      `/tms/LigterLoadUnload/EditLighterUnLoadingInfo`,
      data
    );
    toast.success(res?.data?.message);
    cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const updateUnloadingQtyAndRates = async (data, cb) => {
  try {
    const res = await axios.put(
      `/tms/LigterLoadUnload/UpdateLighterLoadUnLoadBillDetails`,
      data
    );
    toast.success(res?.data?.message);
    cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const CreateLighterDumpBill = async (data, cb) => {
  try {
    const res = await axios.post(
      `/tms/LigterLoadUnload/CreateLighterDumpBill`,
      data
    );
    toast.success(res?.data?.message);
    cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

// Validation schema
export const validationSchema = Yup.object().shape({
  shipPoint: Yup.object().shape({
    label: Yup.string().required("ShipPoint is required"),
    value: Yup.string().required("ShipPoint is required"),
  }),
  motherVessel: Yup.object().shape({
    label: Yup.string().required("Mother Vessel is required"),
    value: Yup.string().required("Mother Vessel is required"),
  }),
  // programNo: Yup.object().shape({
  //   label: Yup.string().required("Program is required"),
  //   value: Yup.string().required("Program is required"),
  // }),
  lighterVessel: Yup.object().shape({
    label: Yup.string().required("Lighter Vessel is required"),
    value: Yup.string().required("Lighter Vessel is required"),
  }),
  // lighterDestination: Yup.object().shape({
  //   label: Yup.string().required("Lighter Destination is required"),
  //   value: Yup.string().required("Lighter Destination is required"),
  // }),
  receivedAt: Yup.string().required("Received At is required"),
  unloadingStart: Yup.string().required("Unloading Start Date is required"),
  // unloadingDate: Yup.string().required("Unloading Date is required"),
  unloadedQty: Yup.string().required("Unloaded Qty is required"),
  // unloadingComplete: Yup.string().when("isComplete", {
  //   is: true,
  //   then: Yup.string().required("Unloading completion date is required"),
  //   otherwise: false,
  // }),

  // Unloading Completion Date is required only values?.unloadingComplete is true
  unloadingComplete: Yup.string().when("isComplete", {
    is: true,
    then: Yup.string().required("Unloading completion date is required"),
    otherwise: false,
  }),
});

export const GetLighterDestinationDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/FertilizerOperation/GetLighterDestinationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
