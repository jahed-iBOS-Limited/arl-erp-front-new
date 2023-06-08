import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";


export const validationSchema = Yup.object().shape({
         strCertificateName: Yup.string().required(
           "Certificate Name is required"
         ),
         strCertificateTypeName: Yup.object().shape({
           label: Yup.string().required("Certificate Type Name is required"),
           value: Yup.string().required("Certificate Type Name is required"),
         }),
         strDateRangeType: Yup.object().shape({
           label: Yup.string().required("Date Range Type is required"),
           value: Yup.string().required("Date Range Type is required"),
         }),
       });

//Create Certificate Name
export const createCertificateName= async (payload, setLoading, cb) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `/hcm/VesselCertificate/VesselCertificateCreate?partName=CreateCertificate`,
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
      console.log("res",res?.data)
      const modifiedData = {
        strCertificateTypeName: {
          value: res?.data[0]?.intCertificateTypeId,
          label: res?.data[0]?.strCertificateTypeName,
        },
        strCertificateName: res?.data[0]?.strCertificateName,
        strDateRangeType: {
          value: res?.data[0]?.intDateRangeTypeId,
          label: res?.data[0]?.strDateRangeTypeName,
        },
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
