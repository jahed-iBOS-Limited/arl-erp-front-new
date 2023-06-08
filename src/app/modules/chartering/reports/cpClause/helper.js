import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";

// Validation schema
export const validationSchema = Yup.object().shape({
  fileName: Yup.string().required("File name is required"),
});

export const getChartererCPData = async ({
  accId,
  buId,
  reportType,
  docId,
  setter,
  setLoading,
  cb,
}) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/ChartererCP/GetChartererCPData?AccountId=${accId}&BusinessUnitId=${buId}&rptType=${reportType}&DocId=${docId}`
    );
    setter(res?.data);
    cb && cb();
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};

export const saveCPClause = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `https://imarine.ibos.io/domain/ChartererCP/UplaodCharterCP`,
      data
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getCPLandingData = async (
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/ChartererCP/GetChartererCPLandingData?AccountId=${accId}&BusinessUnitId=${buId}&fromCreateDate=${fromDate}&toCreateDate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};
