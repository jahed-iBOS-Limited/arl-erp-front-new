import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.post(
    `/pms/MeasuringScale/CreateMeasuringScale`,
    data
  );
}

export function updateChartType(kpiId, chartId) {
  return axios.put(
    `/pms/Kpi2/UpdateChartType?Kpiid=${kpiId}&chartid=${chartId}`
  );
}

export function updateIsShown(kpiId, tf) {
  return axios.put(
    `/pms/Kpi2/UpdateIsShownDashBoard?Kpiid=${kpiId}&TF=${tf}`
  );
}

export function getChartTypeDDL() {
  return axios.get(`/pms/CommonDDL/ChartDDL`);
}

export function getMonthDDL(yearId) {
  return axios.get(
    `/pms/CommonDDL/MonthDDL?yearid=${yearId}`
  );
}
