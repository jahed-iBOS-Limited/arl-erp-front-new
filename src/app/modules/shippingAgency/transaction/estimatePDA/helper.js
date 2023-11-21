import axios from "axios";
import { toast } from "react-toastify";
import { imarineBaseUrl } from "../../../../App";

export const complainLandingPasignation = async (
  accId,
  buId,
  respondentTypeId,
  fromDate,
  toDate,
  statusId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  search
) => {
  setLoading(true);
  setter([]);
  try {
    const _search = search ? `&search=${search}` : "";
    const res = await axios.get(
      `/oms/CustomerPoint/ComplainLandingPasignation?accountId=${accId}&businessUnitId=${buId}&respondentTypeId=${respondentTypeId}&statusId=${statusId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}${_search}`
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
