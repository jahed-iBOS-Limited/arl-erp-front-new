import axios from "axios";
import { toast } from "react-toastify";
import { imarineBaseUrl } from "../../../../App";

export const getExpensePDALandingApi = async (
  sbu,
  vesselid,
  voyageNo,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  accId,
  buId,
  setter,
  setLoading
) => {
  setLoading(true);
  setter([]);
  try {
    const _VoyageNo = voyageNo ? `&VoyageNo=${voyageNo}` : "";
    const _sbuID = sbu ? `&sbuID=${sbu}` : "";
    const _Vesselid = vesselid ? `&Vesselid=${vesselid}` : "";

    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetExpensePDALanding?FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc${_VoyageNo}&accountId=${accId}&businessUnitId=${buId}${_sbuID}${_Vesselid}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getSBUListDDLApi = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {}
};

// export const getVesselDDL = async (accId, buId, setter, vesselId) => {
//   try {
//     const res = await axios.get(
//       `/asset/Asset/GetAssetVesselDdl?IntBussinessUintId=${buId}`
//     );
//     setter(res.data);
//   } catch (error) {
//     setter([]);
//   }
// };

export const getVesselDDL = async (accId, buId, setter, vesselId) => {
  const vesselIdStr = vesselId ? `&IsVessel=${vesselId}` : ""; // first perameter so not (?)
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}${vesselIdStr}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};
export const attachment_action = async (
  attachment,
  setFieldValue,
  setLoading
) => {
  setLoading(true);
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  setFieldValue("attachment", "");
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Upload  successfully");
    setFieldValue("attachment", data?.[0]?.id);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error("Document not upload");
  }
};
export const getVoyageNoDDLApi = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetVoyageNoDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(
      res?.data?.map((voyageNo, idx) => {
        return {
          value: voyageNo,
          label: voyageNo,
        };
      })
    );
  } catch (error) {}
};

export const GetDomesticPortDDL = async (setter) => {
  try {
    const res = await axios.get(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getExpenseParticularsList = async (setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetExpenseParticulars`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        estimatedAmount: "",
        customerFinalAmount: "",
        actualAmount: "",
        estimatePDABillCreateDtos: [],
        isEditExpPart: false
      }))
    );
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const createUpdateEstimatePDA = async (payload, setDisabled, cb) => {
  try {
    setDisabled(true);
    const res = await axios.post(
      `${imarineBaseUrl}/domain/ASLLAgency/CreateUpdateEstimatePDA`,
      payload
    );

    toast.success("Submitted Successfully");
    cb(res?.data);
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getEstimatePDAById = async (id, setLoading, setter) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetEstimatePDAById?estimatePdaId=${id}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
  }
};

export const getBuUnitDDL = async (userId, clientId, setter) => {
  try {
    const res = await axios.get(`/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${userId}&ClientId=${clientId}`)

    if (res.status === 200 && res.data) {
      const data = res?.data.map((itm) => ({
        value: itm?.organizationUnitReffId,
        label: itm?.organizationUnitReffName,
        address: itm?.businessUnitAddress,
      }))
      setter(data)
    }
  } catch (error) {
    
  }
};

export const getBankAc = async (accId, BuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getBusinessUnitDDL_api = async (actionBy, accountId,setLoading, setter) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${actionBy}&ClientId=${accountId}`
    );
    if (res.status === 200 && res?.data) {
      const newdata = res?.data.map((itm) => {
        return {
          value: itm?.organizationUnitReffId,
          label: itm?.organizationUnitReffName,
        };
      });
      setter(newdata);
    }
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
