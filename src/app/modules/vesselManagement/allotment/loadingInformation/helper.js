import Axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

// ddl
export const GetShipPointDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const GetLighterStevedoreDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/wms/FertilizerOperation/GetLighterStevedoreDDL`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const GetDomesticPortDDL = async (setter) => {
  try {
    const res = await Axios.get(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetLighterVesselDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/FertilizerOperation/GetLighterVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getMotherVesselDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const CreateLighterLoadUnloadInfo = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.post(
      `/tms/LigterLoadUnload/CreateLighterLoadingInfo`,
      payload
    );
    if (res.status === 200) {
      cb && cb();
      toast.success(res?.message || "Submitted successfully");
      setLoading && setLoading(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const EditLighterLoadingInfo = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.put(
      `/tms/LigterLoadUnload/EditLighterLoadingInfo`,
      payload
    );
    if (res.status === 200) {
      cb && cb();
      toast.success(res?.message || "Submitted successfully");
      setLoading && setLoading(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getLighterLoadUnloadPagination = async (
  accId,
  buId,
  searchValue,
  portId,
  orgId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/tms/LigterLoadUnload/GetLighterLoadingInfoPagination?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&port=${portId}&OrganizationId=${orgId}&SearchTerm=${searchValue}`
    );

    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const DeleteLoadingInformation = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/tms/LigterLoadUnload/DeleteLighterLoadingInfo?VoyageNo=${id}`
    );

    toast.success(res?.data?.message || "Deleted Loading Information");
    cb();
    setLoading(false);
  } catch (error) {
    toast.warning(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getAllotmentDDLByMotherVessel = async (
  motherVesselId,
  buId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/LigterLoadUnload/GetLighterAllotmentByMotherVessel?MotherVesselId=${motherVesselId}&BusinessUniteId=${buId}`
      // `/tms/LigterLoadUnload/GetLighterAllotmentDDl?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getLoadingInfoById = async (
  voyageId,
  rowId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/LigterLoadUnload/GetLighterLoadingInfoById?VoyageNo=${voyageId}&RowId=${rowId}`
    );

    const d = res?.data;

    const setData = {
      ...d,
      allotment: {
        value: d?.allotmentNo,
        label: d?.progarm,
      },
      lighterVessel: {
        value: d?.lighterVesselId,
        label: d?.lighterVesselName,
      },
      motherVessel: {
        value: d?.motherVesselId,
        label: d?.motherVesselName,
      },
      loadingPort: {
        value: d?.loadingPointId,
        label: d?.loadingPoint,
      },
      sideAt: d?.sideAt,
      loadingStart: d?.loadingStartDate,
      loadingComplete: d?.loadingCompleteDate || "",
      // customerPassNo: "",
      // boatNote: "",
      // customRotationNumber: "",
      loadingDate: "",
      loadedQty: "",
      // loadedQty: d?.surveyQnt,
    };

    setter(setData);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getLoadingInfoByVoyageNo = async (
  voyageNo,
  setter,
  setRowData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/LigterLoadUnload/ViewLighterLoadingInfoByVoyageNo?VoyageNo=${voyageNo}`
    );

    const d = res?.data;

    const setData = {
      ...d,
      allotment: {
        value: d?.allotmentNo,
        label: d?.progarm,
      },
      lighterVessel: {
        value: d?.lighterVesselId,
        label: d?.lighterVesselName,
      },
      motherVessel: {
        value: d?.motherVesselId,
        label: d?.motherVesselName,
      },
      loadingPort: {
        value: d?.loadingPointId,
        label: d?.loadingPoint,
      },
      sideAt: d?.sideAt,
      loadingStart: d?.loadingStartDate,
      loadingComplete: d?.loadingCompleteDate || "",
      programNo: d?.progarm,
    };

    setter(setData);
    setRowData(
      d?.rowDataList?.map((item) => ({
        ...item,
        surveyQty: item?.surveyQnt,
        lighterVessel: item?.lighterVesselName,
        loadingStart: item?.loadingStartDate,
        loadingComplete: item?.loadingCompleteDate,
        itemName: item?.itemName,
      }))
    );
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getLighterVesselDDLFromAllotment = async (
  buId,
  vesselId,
  portId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/LigterLoadUnload/GetLighterVesselByMotherVesselDDl?MotherVesselId=${vesselId}&BusinessUniteId=${buId}&PortId=${portId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getAllotmentDDLByVessel = async (
  buId,
  vesselId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/LigterLoadUnload/GetLighterAllotmentByMotherVessel?MotherVesselId=${vesselId}&BusinessUniteId=${buId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getAllotmentInformation = async (
  allotmentNo,
  lighterId,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/LigterLoadUnload/GetAllotmentHeaderDataForLoading?AllotmentNo=${allotmentNo}&LighterVesselId=${lighterId}`
    );
    cb(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getAllotmentDataForLoading = async (
  portId,
  motherVesselId,
  programNo,
  setter,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/LigterLoadUnload/GetAllotmentDataForLoading?portId=${portId}&MotherVesselId=${motherVesselId}&ProgramNo=${programNo}`
    );
    if (res?.data?.length < 1) {
      toast.warn(
        "Loading information for this program is already entered OR You have to insert Allotment information first!"
      );
    } else {
      setter(
        res?.data?.map((item) => ({
          ...item,
          surveyQty: item?.allottedQnt,
          lighterVessel: item?.lighterVesselName,
          sideAt: "",
          loadingStart: "",
          loadingComplete: "",
          isSelected: false,
          boatNote: "",
          sailingDate: "",
        }))
      );
    }
    cb && cb(res?.data[0]);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

// Validation schema
export const validationSchema = Yup.object().shape({
  motherVessel: Yup.object().shape({
    label: Yup.string().required("Mother Vessel is required"),
    value: Yup.string().required("Mother Vessel is required"),
  }),
  // customerPassNo: Yup.string().required("Customer Pass No is required"),
});
