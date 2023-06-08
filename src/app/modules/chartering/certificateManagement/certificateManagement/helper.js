import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../_chartinghelper/_dateFormatter";


export const validationSchema = Yup.object().shape({
         vesselName: Yup.object().shape({
           label: Yup.string().required("Vessel name is required"),
           value: Yup.string().required("Vessel name is required"),
         }),
         strCertificateTypeName: Yup.object().shape({
           label: Yup.string().required("Certificate Type is required"),
           value: Yup.string().required("Certificate Type is required"),
         }),
         strCertificateName: Yup.object().shape({
           label: Yup.string().required("Certificate Name is required"),
           value: Yup.string().required("Certificate Name is required"),
         }),
         dteIssueDate: Yup.string().required("Issue Date is required"),
         dteToDate: Yup.string().required("To Date is required"),
         strIssuePlace: Yup.string().required("Issue Place is required"),
         strIssuingAuthority: Yup.string().required(
           "Issuing Authority is required"
         ),
         dteLastSurvey: Yup.string().required("Last Survey Date is required"),
         strRemarks: Yup.string().required("remarks is required"),
       });

  //Create and Edit Certificate
export const createAndEditCertificate= async (payload, setLoading, cb) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `/hcm/VesselCertificate/VesselCertificateCreate?partName=CreateVesselCertificate`,
        payload
      );
      cb();
      toast.success(res?.data?.message);
      setLoading(false);
    } catch (err) {
      toast.error(err?.response?.data?.message);
      setLoading(false);
    }
  };
  //
  //Certificate Type DDL
  export const getCertificateDDL= async (setter, type, payload) => {
    try {
        let res = await axios.post(
        `/hcm/VesselCertificate/VesselCertificateDDL?partName=${type}`,
        payload
      );
      setter(res?.data);
    } catch (err) {
      toast.error(err?.response?.data?.message);
      setter([]);
    }
  };
    //Certificate 
export const getCertificateLanding= async (setter, type, payload, setLoading, cb, id = null) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/hcm/VesselCertificate/VesselCertificateLanding?partName=${type}`,
      payload
    );
    
    const modifiedData = {
      vesselName: {
        value: res?.data[0]?.intVesselId,
        label: res?.data[0]?.strVesselName,
      },
      strCertificateTypeName: {
        value: res?.data[0]?.intCertificateTypeId,
        label: res?.data[0]?.strCertificateTypeName,
      },
      strCertificateName: {
        value: res?.data[0]?.intCertificateId,
        label: res?.data[0]?.strCertificateName,
      },
      dteIssueDate: _dateFormatter(res?.data[0]?.dteIssueDate),
      dteFromDate: _dateFormatter(res?.data[0]?.dteFromDate),
      dteToDate: _dateFormatter(res?.data[0]?.dteToDate),
      strIssuePlace: res?.data[0]?.strIssuePlace,
      strIssuingAuthority: res?.data?.[0]?.strIssuingAuthority,
      dteLastSurvey: _dateFormatter(res?.data[0]?.dteLastSurvey),
      intDateRangeTypeId: res?.data?.[0]?.intDateRangeTypeId,
      strDateRangeTypeName: res?.data?.[0]?.strDateRangeTypeName,
      strRemarks: res?.data[0]?.strRemarks,
    };
    //setter(res?.data)
    id ? setter(modifiedData) : setter(res?.data)
    cb && cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};
  //Attachment
  export const certificateAttachment_action = async (attachment, setLoading) => {
    setLoading && setLoading(true);
    let formData = new FormData();
    formData.append("files", attachment[0]);
    try {
      let { data } = await axios.post("/domain/Document/UploadFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading && setLoading(false);
      toast.success("Upload  successfully");
      return data;
    } catch (error) {
      setLoading && setLoading(false);
      toast.error("File Size is too large or inValid File!");
      return error;
    }
  };