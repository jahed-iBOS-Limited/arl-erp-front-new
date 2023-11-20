import axios from "axios";
import { toast } from "react-toastify";
import { imarineBaseUrl } from "../../../../App";

export const getASLLAgencyRegistrationLandingApi = async (
  accId,
  buId,
  verselType,
  verselId,
  VoyageNo,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  setter([]);
  try {
    const _VoyageNo = VoyageNo ? `&VoyageNo=${VoyageNo}` : "";
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetASLLAgencyRegistrationLanding?AccountId=${accId}&BusinessUnitId=${buId}&VesselTypeId=${verselType}&VesselId=${verselId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc${_VoyageNo}`
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
export const getVesselTypeDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetVesselTypeDDL`
    );
    setter(res?.data?.map(itm => {
      return {
        value: itm?.vesselTypeId,
        label: itm?.vesselTypeName,
      };
    }));
  } catch (error) {}
};
export const getVoyageNoDDLApi = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetVoyageNoDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data?.map((voyageNo, idx) => {
      return {
        value: voyageNo,
        label: voyageNo
      };
    }));
  } catch (error) {}
};

export const getVesselDDL = async (accId, buId, setter, vesselId) => {
  const vesselIdStr = vesselId ? `&IsVessel=${vesselId}` : ""; // first perameter so not (?)
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/Voyage/GetVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}${vesselIdStr}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};
export const GetDomesticPortDDL = async (setter) => {
  try {
    const res = await axios.get(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    setter(res?.data);
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

export const vesselTypeDDL = [
  { value: 1, label: "Rental Vessel" },
  { value: 2, label: "Own Vessel" },
];

export const createUpdateASLLAgencyRegistration = async (
  payload,
  setDisabled,
  cb
) => {
  try {
    setDisabled(true);
    await axios.post(
      `${imarineBaseUrl}/domain/ASLLAgency/CreateUpdateASLLAgencyRegistration`,
      payload
    );

    toast.success("Submitted Successfully");
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
