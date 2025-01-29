import axios from 'axios';
import { toast } from 'react-toastify';
import { imarineBaseUrl } from '../../../../../App';

export const getASLLAgencyRegistrationLandingApi = async (
  accId,
  buId,
  verselType,
  verselId,
  VoyageNo,
  pageNo,
  pageSize,
  setter,
  setLoading,
) => {
  setLoading(true);
  setter([]);
  try {
    const _VoyageNo = VoyageNo ? `&VoyageNo=${VoyageNo}` : '';
    const _verselId = verselId ? `&VesselId=${verselId}` : '';
    const _vesselTypeId = verselType ? `&VesselTypeId=${verselType}` : '';
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetASLLAgencyRegistrationLanding?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc${_VoyageNo}${_verselId}${_vesselTypeId}`,
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
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`,
    );
    setter(res?.data);
  } catch (error) {}
};
export const getVesselTypeDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetVesselTypeDDL`,
    );
    setter(res?.data);
  } catch (error) {}
};
export const getVoyageNoDDLApi = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetVoyageNoDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setter(
      res?.data?.map((voyageNo, idx) => {
        return {
          value: voyageNo,
          label: voyageNo,
        };
      }),
    );
  } catch (error) {}
};
export const getASLLAgencyRegistrationById = async (id, setLoading, setter) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetASLLAgencyRegistrationById?id=${id}`,
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
  }
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
  const vesselIdStr = vesselId ? `&IsVessel=${vesselId}` : ''; // first perameter so not (?)
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}${vesselIdStr}`,
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
  setLoading,
) => {
  setLoading(true);
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append('files', file?.file);
  });
  setFieldValue('attachment', '');
  try {
    let { data } = await axios.post('/domain/Document/UploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Upload  successfully');
    setFieldValue('attachment', data?.[0]?.id);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error('Document not upload');
  }
};

export const vesselTypeDDL = [
  { value: 1, label: 'Rental Vessel' },
  { value: 2, label: 'Own Vessel' },
];

export const createUpdateASLLAgencyRegistration = async (
  payload,
  setDisabled,
  cb,
) => {
  try {
    setDisabled(true);
    await axios.post(
      `${imarineBaseUrl}/domain/ASLLAgency/CreateUpdateASLLAgencyRegistration`,
      payload,
    );

    toast.success('Submitted Successfully');
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getCargoDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/HireOwner/GetCargoDDL`,
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};
