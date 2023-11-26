import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";

export const validationSchema = Yup.object().shape({
  billNo: Yup.string().required("Bill No is required"),
});

export const getSurveyNoDDL = async (accId, buId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LighterVessel/GetLighterVssSurveyNoDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    setter(
      res?.data?.map((item) => ({ value: item?.label, label: item?.label }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getTripInformation = async (
  accId,
  buId,
  fromDate,
  toDate,
  surveyNo,
  // reportDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
        const res = await axios.get(
          `${imarineBaseUrl}/domain/LighterVessel/GetLighterVesselTripBySurveyNo?AccountId=${accId}&BusinessUnitId=${buId}&SurveyNo=${surveyNo}&fromDate=${fromDate}&toDate=${toDate}`
        );
        // &ReportDate=${reportDate}
        setter(res?.data);
        setLoading(false);
      } catch (error) {
    setter([]);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const saveInvoice = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/LighterInvoice/CreateLighterInvoice`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getInvoiceList = async (
  accId,
  buId,
  searchTerm,
  pageNo,
  pageSize,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  const search = searchTerm ? `&searchData=${searchTerm}` : "";
  const from = fromDate ? `&FromDate=${fromDate}` : "";
  const to = toDate ? `&ToDate=${toDate}` : "";
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LighterInvoice/GetLighterInVoiceLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}${search}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${from}${to}`
    );

    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export async function getInvoiceById(id, setter, setLoading, cb) {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LighterInvoice/GetLighterInVoiceById?InvoiceId=${id}`
    );
    setter(res?.data);
    cb();
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
}
