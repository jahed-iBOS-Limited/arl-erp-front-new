import axios from "axios";
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

export const getLandingData = async (
  accId,
  buId,
  itemId,
  monthId,
  pageNo,
  pageSize,
  setIsLoading,
  setter
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/OutletBillProcess/GetOutletBillProcessPagination?AccountId=${accId}&BusinessUnitId=${buId}&ItemId=${itemId}&MonthId=${monthId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res?.status === 200) {
      const payload = {
        currentPage: res?.data?.currentPage,
        data: res?.data?.data?.map((item) => {
          return {
            ...item,
            isSelect: false,
          };
        }),
        pageSize: res?.data?.pageSize,
        totalCount: res?.data?.totalCount,
      };
      setter(payload);
      setIsLoading(false);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
    setIsLoading(false);
  }
};

export const getRouteDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/RouteNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const getBeatDDL = async (RoId, setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${RoId}`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
  }
};

export const getCategoryDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=10`
    );
    if (res?.status === 200) {
      let dataMapping = res?.data?.map((data) => {
        return {
          value: data?.itemCategoryId,
          label: data?.itemCategoryName,
        };
      });
      setter(dataMapping);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const getSubCategoryDDL = async (accId, buId, cat, setter) => {
  try {
    let res = await axios.get(
      `/item/ItemSubCategory/GetItemSubCategoryDDLByCategoryId?accountId=${accId}&businessUnitId=${buId}&itemCategoryId=${cat}&typeId=10`
    );
    if (res?.status === 200) {
      let dataMapping = res?.data?.map((item) => {
        return {
          code: item?.code,
          value: item?.id,
          label: item?.itemSubCategoryName,
        };
      });
      setter(dataMapping);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const getItemDDL = async (catId, subId, accId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetFinishedItemByCatagoryDDL?CatagoryId=${catId}&SubCatagoryId=${subId}&AccountId=${accId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};

export const getMonthDDL = async (setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/GetMonthDDl`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
  }
};
// /rtm/SalesForceMonthlyTADA/GetSalesForceMonthlyTadaById?AccountId=2&BusinessUnitId=164&EmployeId=510079&MonthId=4&YeardId=2021
export const getSalesForceMonthlyTaDaById = async (accountId,businessUnitId,employeeId,monthId,yearId,values,setValues,setRowData) => {
  try {
    let res = await axios.get(`/rtm/SalesForceMonthlyTADA/GetSalesForceMonthlyTadaById?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&EmployeId=${employeeId}&MonthId=${monthId}&YeardId=${yearId}`);
    if (res?.status === 200) {
      setValues({...values,...res.data.objHeader})
      setRowData(res.data.objRowList)
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
    setValues({...values,
      additionalAmount: "",
      deductionAmount: "",
      department: "",
      designation: "",
      employeeName: "",
      averageDaamount: "",
      monthlyMeetingExpAmount: "",
      monthlyOthersAmount: "",
      monthlyTaamount: "",
      totalDaamount: "",
      totalPresentDay: "",
      totalWorkingDay: "",
      meetingExpense:"",})
      setRowData([])
  }
};

export const getSalesForceMonthlyTaDa = async (accountId,businessUnitId,employeeId,monthId,yearId,values,setValues,setRowData) => {
  try {
    let res = await axios.get(`/rtm/SalesForceMonthlyTADA/GetSalesForceMonthlyDaSetup?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&EmployeId=${employeeId}&MonthId=${monthId}&YeardId=${yearId}`);
    if (res?.status === 200) {
      setValues({...values,...res.data.objHeader})
      setRowData(res.data.objRowList)
    }
  } catch (err) {
    setValues({...values,
      additionalAmount: "",
      deductionAmount: "",
      department: "",
      designation: "",
      employeeName: "",
      averageDaamount: "",
      monthlyMeetingExpAmount: "",
      monthlyOthersAmount: "",
      monthlyTaamount: "",
      totalDaamount: "",
      totalPresentDay: "",
      totalWorkingDay: "",
      meetingExpense:"",})
      setRowData([])
    console.log(err?.response?.data?.message);
  }
};

export const getEmployee = async (accountId,businessUnitId,setter) => {
  try {
    let res = await axios.get(`rtm/RTMDDL/GetSalesForceEmployeeDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
  }
};
// /rtm/SalesForceMonthlyTADA/CreateSalesForceMonthlyTADA
export const saveData = async (data,acc,bu,actionBy) => {
  data.objHeader['accountId']= acc
  data.objHeader['businessUnitId']= bu
  data.objHeader['monthId']= data.objHeader['monthDDL'].value
  data.objHeader['yearId']= data.objHeader['yearDDL'].value
  data.objHeader['employeeId']= data.objHeader['employeeDDL'].value
  data.objHeader['actionBy']= actionBy

  data.objRowList=data.objRowList.map(item=>{
    return ({
      "rowId": item['rowId'],
      "workingDay": item['workingDayStatus']==="WD" ? true :false,
      "present": item['Present'] ? true :false,
      "dadate": item['date'],
      "daamount": item['dailyDaAmount'],
      "additionalAmount": item['additionalAmount'],
      "deductionAmount": item['deductionAmount'],
    })
  })
  
  return axios.post(`/rtm/SalesForceMonthlyTADA/CreateSalesForceMonthlyTADA`, data);
};



