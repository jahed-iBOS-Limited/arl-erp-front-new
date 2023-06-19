import Axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const GetLighterAllotmentPagination = async (
  accId,
  buId,
  motherVesselId,
  portId,
  setter,
  setLoading,
  pageNo,
  pageSize
  // fromDate,
  // toDate
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/wms/FertilizerOperation/GetLighterAllotmentPagination?AccountId=${accId}&BusinessUnitId=${buId}&MotherVesselId=${motherVesselId ||
        0}&PortId=${portId || 0}&PageNo=${pageNo}&PageSize=${pageSize}`
    );

    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

// create
export const CreateLighterAllotment = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.post(
      `/wms/FertilizerOperation/CreateLighterAllotment`,
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

export const EditLighterAllotment = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.put(
      `/wms/FertilizerOperation/EditLighterAllotment`,
      payload
    );
    if (res.status === 200) {
      cb && cb();
      toast.success(res?.message || "Submitted successfully");
      setLoading && setLoading(false);
    }
  } catch (error) {
    cb && cb();
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const GetLighterCNFDDL = async (setter) => {
  try {
    const res = await Axios.get(`/wms/FertilizerOperation/GetLighterCNFDDL`);
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
export const GetLighterDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/FertilizerOperation/GetLighterDestinationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const GetLighterVesselList = async (
  portId,
  vesselId,
  programNo,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/wms/FertilizerOperation/GetLighterVesselForAllotment?PortId=${portId}&MotherVesselId=${vesselId}&ProgramNo=${programNo}`
    );
    if (res?.data?.length < 1) {
      toast.warn("Please configure lighter vessel, port, program no, etc.");
    } else {
      setter(
        res?.data?.map((item) => ({
          ...item,
          surveyQty: "",
          unloadingPort: "",
          isSelected: false,
        }))
      );
    }

    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
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

export const DeleteLighterAllotment = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/wms/FertilizerOperation/DeleteLighterAllotment?AllotmentNo=${id}`
    );

    toast.success(res?.data?.message || "Delete Casting Schedule");
    cb();
    setLoading(false);
  } catch (error) {
    toast.warning(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetLighterAllotmentById = async ({
  id,
  setter,
  setRowDto,
  setLoading,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/wms/FertilizerOperation/ViewLighterAllotmentDetails?AllotmentNo=${id}`
    );
    let h = res?.data[0];
    const singleHeader = {
      motherVessel: {
        value: h?.motherVesselId,
        label: h?.motherVesselName,
      },
      programNo: h?.program,
      loadingPort: {
        value: h?.portId,
        label: h?.portName,
      },
      item: {
        value: h?.itemId,
        label: h?.itemName,
      },
      cnf: {
        value: h?.cnfid,
        label: h?.cnfname,
      },
      steveDore: {
        value: h?.stevedoreId,
        label: h?.stevedoreName,
      },
      allotmentDate: _dateFormatter(h?.allotmentDate),
      lotNo: h?.lotNo,
      type: h?.type || "badc",
    };

    setter && setter(singleHeader);
    setRowDto(
      res?.data?.map((item) => {
        return {
          ...item,
          label: item?.lighterVesselName,
          surveyQty: item?.surveyQnt,
          unloadingPort: {
            value: item?.shipPointId,
            label: item?.shipPointName,
          },
          lighterDestination: {
            value: item?.lighterDestinationId,
            label: item?.lighterDestinationName,
          },
          isSelected: false,
        };
      })
    );
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const validationSchema = Yup.object().shape({
  motherVessel: Yup.object().shape({
    label: Yup.string().required("Mother Vessel is required"),
    value: Yup.string().required("Mother Vessel is required"),
  }),
  loadingPort: Yup.object().shape({
    label: Yup.string().required("Loading Port is required"),
    value: Yup.string().required("Loading Port is required"),
  }),
  item: Yup.object().shape({
    label: Yup.string().required("Item is required"),
    value: Yup.string().required("Item is required"),
  }),
  lotNo: Yup.string().required("Lot No is required"),
  cnf: Yup.object().shape({
    label: Yup.string().required("CNF is required"),
    value: Yup.string().required("CNF is required"),
  }),
  steveDore: Yup.object().shape({
    label: Yup.string().required("Steve dore is required"),
    value: Yup.string().required("Steve dore is required"),
  }),
  allotmentDate: Yup.string().required("Allotment date is required"),
});

export const updateCNFInfo = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/tms/LigterLoadUnload/UpdateG2GProgramInfoRate`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb && cb();
      setLoading(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
