import Axios from "axios";
export const getSalesReportData = async (fromDate, toDate, rtId,setter) => {
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetDeliveryReportInDateRange?FromDate=${fromDate}&ToDate=${toDate}&ReportTypeId=${rtId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getSalesReportDataWithShipPointId = async (fromDate, toDate, rtId, spId,setter) => {
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetDeliveryReportInDateRange?FromDate=${fromDate}&ToDate=${toDate}&ReportTypeId=${rtId}&ShippointId=${spId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

