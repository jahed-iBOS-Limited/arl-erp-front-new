import axios from 'axios';
// import { toast } from "react-toastify";

// get selected business unit from store

export const getDetailsReportData = (
  userId,
  fromDate,
  toDate,
  setter,
  setLoader
) => {
  setLoader(true);
  axios
    .get(
      `/hcm/HCMCafeteriaReport/GetCafeteriaReportALL?PartId=1&FromDate= ${fromDate}&ToDate= ${toDate}&ReportType=1&LoginBy= ${userId}`
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

export const getSalesForceMonthlyTaDaById = async (
  accountId,
  businessUnitId,
  employeeId,
  monthId,
  yearId,
  values,
  setValues,
  setRowData
) => {
  try {
    let res = await axios.get(
      `/rtm/SalesForceMonthlyTADA/GetSalesForceMonthlyTadaById?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&EmployeId=${employeeId}&MonthId=${monthId}&YeardId=${yearId}`
    );
    if (res?.status === 200) {
      setValues({ ...values, ...res.data.objHeader });
      setRowData(res.data.objRowList);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
    setValues({
      ...values,
      additionalAmount: '',
      deductionAmount: '',
      department: '',
      designation: '',
      employeeName: '',
      averageDaamount: '',
      monthlyMeetingExpAmount: '',
      monthlyOthersAmount: '',
      monthlyTaamount: '',
      totalDaamount: '',
      totalPresentDay: '',
      totalWorkingDay: '',
      meetingExpense: '',
    });
    setRowData([]);
  }
};

export const getSalesForceMonthlyTaDa = async (
  accountId,
  businessUnitId,
  employeeId,
  monthId,
  yearId,
  values,
  setValues,
  setRowData
) => {
  try {
    let res = await axios.get(
      `/rtm/SalesForceMonthlyTADA/GetSalesForceMonthlyDaSetup?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&EmployeId=${employeeId}&MonthId=${monthId}&YeardId=${yearId}`
    );
    if (res?.status === 200) {
      setValues({ ...values, ...res.data.objHeader });
      setRowData(res.data.objRowList);
    }
  } catch (err) {
    setValues({
      ...values,
      additionalAmount: '',
      deductionAmount: '',
      department: '',
      designation: '',
      employeeName: '',
      averageDaamount: '',
      monthlyMeetingExpAmount: '',
      monthlyOthersAmount: '',
      monthlyTaamount: '',
      totalDaamount: '',
      totalPresentDay: '',
      totalWorkingDay: '',
      meetingExpense: '',
    });
    setRowData([]);
    console.log(err?.response?.data?.message);
  }
};

export const getEmployee = async (accountId, businessUnitId, setter) => {
  try {
    let res = await axios.get(
      `rtm/RTMDDL/GetSalesForceEmployeeDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
  }
};

export const saveData = async (data, acc, bu, actionBy) => {
  data.objHeader['accountId'] = acc;
  data.objHeader['businessUnitId'] = bu;
  data.objHeader['monthId'] = data.objHeader['monthDDL'].value;
  data.objHeader['yearId'] = data.objHeader['yearDDL'].value;
  data.objHeader['employeeId'] = data.objHeader['employeeDDL'].value;
  data.objHeader['actionBy'] = actionBy;

  data.objRowList = data.objRowList.map((item) => {
    return {
      rowId: item['rowId'],
      workingDay: item['workingDayStatus'] === 'WD' ? true : false,
      present: item['Present'] ? true : false,
      dadate: item['date'],
      daamount: item['dailyDaAmount'],
      additionalAmount: item['additionalAmount'],
      deductionAmount: item['deductionAmount'],
    };
  });

  return axios.post(
    `/rtm/SalesForceMonthlyTADA/CreateSalesForceMonthlyTADA`,
    data
  );
};
