
import axios from "axios";

// get selected business unit from store

export const getSummaryReportData = (userId, fromDate, toDate, setter, setLoader) => {
  setLoader(true);
  axios
    .get(
      `/hcm/HCMCafeteriaReport/GetCafeteriaReportALL?PartId=2&FromDate=${fromDate}&ToDate=${toDate}&ReportType=1&LoginBy=${userId}`
    )
    .then((res) => {
      const { data, status } = res;

      if (status === 200 && data) {
        setter(data);
        console.log(data);
        setLoader(false);
      }
    });
};
