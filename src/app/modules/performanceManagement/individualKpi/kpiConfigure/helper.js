import axios from "axios";
import { toast } from "react-toastify";

// get DDL
export const getDDL = async (api, setter) => {
  try {
    const res = await axios.get(api);
    if (res.status === 200 && res?.data) {
      setter(res.data);
    }
  } catch (error) {}
};

// Get Landing Data
export const getKPIConfigureLanding = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  searchValue,
  bscPerspective
) => {
  const searchPath = searchValue ? `&search=${searchValue}` : "";
  const bscPerspectiveId = bscPerspective
    ? `&bscPerspectiveId=${bscPerspective}`
    : "";
  try {
    setLoading(true);
    const res = await axios.get(
      `/pms/KpiConfigure/KpiConfigureLandingPagination?accountId=${accId}&businessUnitId=${buId}${searchPath}${bscPerspectiveId}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

// get single data for extend
export const getSingleKPIConfigureForExtend = async (id, setter) => {
  try {
    const res = await axios.get(
      `/pms/KpiConfigure/GetBiKpiConfigureId?kpiId=${id}`
    );
    if (res.status === 200) {
      let singleData = res.data[0];
      let newdata = {
        BSCPerspective: {
          value: singleData.intBscperspectiveId,
          label: singleData.strBscperspective,
        },
        KPIFormat: {
          value: singleData.intKpiformatId,
          label: singleData.strKpiformat,
        },
        KPIName: singleData.strKpiName,
        Comments: singleData.strComments,
      };
      setter(newdata);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

// create KPI configure
export const createKPIConfigure = async (payload, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/pms/KpiConfigure/CreateKpiConfigure`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

// save extend
export const SaveExtendKPIConfigure = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/pms/KpiConfigure/CreateKPIConfigureExtend`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Extended successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

// save edited data
export const SaveEditedKPIConfigure = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.put(`/pms/KpiConfigure/EditKpiConfigure`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

// get single data for edit
export const getSingleKPIConfigureById = async (id, setter) => {
  try {
    const res = await axios.get(
      `/pms/KpiConfigure/GetBiKpiConfigureId?kpiId=${id}`
    );
    if (res.status === 200) {
      let singleData = res.data[0];
      let newdata = {
        BSCPerspective: {
          value: singleData.intBscperspectiveId,
          label: singleData.strBscperspective,
        },
        KPIFormat: {
          value: singleData.intKpiformatId,
          label: singleData.strKpiformat,
        },
        KPIName: singleData.strKpiName,
        Comments: singleData.strComments,
      };
      setter(newdata);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

// Search handling
// export const getKPIConfigureDataBySearch = async (
//   accId,
//   buId,
//   bscPerspectiveId,
//   pageNo,
//   pageSize,
//   setLoading,
//   setter,
//   search
// ) => {
//   const searchPath = search ? search : "";
//   try {
//     setLoading(true);
//     const res = await axios.get(
//       `/pms/KpiConfigure/KpiConfigureLandingPagination?accountId=${accId}&businessUnitId=${buId}&search=${searchPath ||
//         ""}&bscPerspectiveId=${bscPerspectiveId ||
//         ""}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}`
//     );
//     if (res.status === 200 && res?.data) {
//       const data = res?.data;
//       setter(data);
//       setLoading(false);
//     }
//   } catch (error) {
//     setLoading(false);
//   }
// };
