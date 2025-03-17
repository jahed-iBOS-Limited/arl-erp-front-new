import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

// expense for api
export const getExpenseFor = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      const ddlWithNameID = res?.data.map((item) => {
        return {
          label: `${item.label} (${item.value}) `,
          value: item.value,
        };
      });
      setter(ddlWithNameID);
      // setter(res?.data);
    }
  } catch (error) { }
};
export const getBankAccountNumberDDL_Api = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/BankAccountNumberDDL?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      // setter(res?.data);
    }
  } catch (error) { }
};


// country api
export const getCountry = async (setter) => {
  try {
    const res = await Axios.get(`/domain/CreateSignUp/GetCountryList`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
//
// currency api
export const getCurrency = async (BuId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/BusinessUnitDomain/GetExpenceBusinessUnitCurrancyDDL?BusinessUnitId=${BuId}`
    );
    // console.log("res currency", res);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
//
// Payment Type api
export const getPaymentType = async (setter) => {
  try {
    const res = await Axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    // console.log("res payment type", res);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
//
// category api
export const getCategory = async (accId, BuId, SBUID, setter) => {
  //accId, BuId, SbuId,
  try {
    const res = await Axios.get(
      `/costmgmt/ExpenseCategory/GetExpenseCategoryDDL?IsActive=true&AccountId=${accId}&BusinessUnitId=${BuId}&SBUId=${SBUID}`
    );
    // console.log("category", res);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
//
// project Name api
export const getProjectName = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/ProjectName/GetProjectNameDDL?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    // console.log('project name',res)
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
//
// cost center api
export const getCostCenter = async (accId, BuId, SBUID, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${BuId}&SBUId=${SBUID}`
    );
    // console.log('cost center',res);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
//
// get disbursment api
export const getDisbursementCenter = async (accId, BuId, SBUID, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/DisbursementCenter/GetDisbursementCenterDDL?AccountId=${accId}&BusineesUnitId=${BuId}&SBUId=${SBUID}&IsActive=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
//
export const getBankAc = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

//create expense register
export const CreateExpenceRegister = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/Expense/CreateExpenceRegisterForVessel`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
//getExpenseLandingPagination api
export const getExpenseLandingPagination = async (
  accId,
  BuId,
  expForId,
  SBUID,
  countryId,
  currId,
  supervisor,
  BillSubmitted,
  isApproved,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/Expense/ExpenseLandingPaginationForVessel?AccountId=${accId}&BusinessUnitId=${BuId}&ExpenseForId=${expForId}&SbuId=${SBUID}&CountryId=${countryId}&CurrencyId=${currId}&IsActive=true&isBillSubmitted=${BillSubmitted}&isApproved=${isApproved}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}&IsSuppervisor=${supervisor}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
//single data api
export const getExpenseById = async (expId, setter, setRowDto, setLoding) => {
  try {
    setLoding && setLoding(true);
    const res = await Axios.get(
      `/fino/Expense/GetExpenseByIdForVessel?ExpenseId=${expId}`
    );
    if (res.status === 200 && res?.data[0]) {
      const data = res?.data[0];
      setLoding && setLoding(false);
      const newData = {
        objHeader: {
          ...data?.objHeader,
          expenseFrom: _dateFormatter(data?.objHeader?.fromDate),
          expenseTo: _dateFormatter(data?.objHeader?.toDate),
          reference: data?.objHeader?.vehicleId,
          comments1: data?.objHeader?.comments,
          expenseDate: "",
          expenseCategory: {
            value: data?.objHeader?.advExpCategoryId,
            label: data?.objHeader?.advExpCategoryName,
          },
          projectName: {
            value: data?.objHeader?.projectId,
            label: data?.objHeader?.projectName,
          },
          costCenter: {
            value: data?.objHeader?.costCenterId,
            label: data?.objHeader?.costCenterName,
          },
          paymentType: {
            value: data?.objHeader?.instrumentId,
            label: data?.objHeader?.instrumentName,
          },
          disbursmentCenter: {
            value: data?.objHeader?.disbursementCenterId,
            label: data?.objHeader?.disbursementCenterName,
          },
          expenseGroup:
            data?.objHeader?.expenseGroup === "TaDa"
              ? {
                value: "TaDa",
                label: "Ta/Da",
              }
              : {
                value: "Other",
                label: "Other",
              },
        },
        objRow: [...data?.objRow],
      };

      const newRowDto = newData?.objRow.map((item) => {
        const expenseAmount =
          item?.linemanagerAmount || item?.supervisorAmount || item.amount || 0;
        return {
          ...item,
          expenseRowId: item.expenseRowId,
          expenseDate: item.expenseDate,
          transaction: {
            value: item.businessTransactionId,
            label: item.businessTransactionName,
          },
          quantity: item.quantity,
          expenseAmount: expenseAmount,
          prvExpenseAmount: expenseAmount,
          location: item.expenseLocation,
          comments2: item.comments,
          attachmentLink: item.attachmentLink,
          driverName: item?.driverName,
          driverId: item?.driverId,
          expenseGroupName:
            data?.objHeader?.expenseGroup === "TaDa" ? "Ta/Da" : "Other",
          profitCenterId: item?.profitCenterId || 0,
          profitCenterName: item?.profitCenterName || "",
          costCenterName: item?.costCenterName || "",
          costCenterId: item?.costCenterId || 0,
          costElementName: item?.costElementName || "",
          costElementId: item?.costElementId || 0,
        };
      });
      setRowDto(newRowDto);
      setter(newData);
    }
  } catch (error) {
    setLoding && setLoding(false);
  }
};
//EditExpenseRegister
export const editExpenseRegister = async (data, setDisabled, history) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/fino/Expense/EditExpenseRegisterForVessel`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Updated successfully");
      // cb();
      setDisabled(false);
      history && history.push("/financial-management/expense/vesselexpense");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
//Get Sum Of Balance Ammount api
export const GetSumOfBalanceAmmount = async (
  accId,
  BuId,
  empId,
  SBUID,
  countryId,
  expenseId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/Expense/GetSumOfBalanceAmmount?AccountId=${accId}&BusinessUnitId=${BuId}&EmployeeId=${empId}&SBUId=${SBUID}&CountryId=${countryId}&ExpenseId=${expenseId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) { }
};
//GetSumOfAdjustedAmmount
export const GetSumOfAdjustedAmmount = async (
  accId,
  BuId,
  empId,
  SBUID,
  countryId,
  expenseId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/Expense/GetSumOfAdjustedAmmount?accountId=${accId}&businessUnitId=${BuId}&employeeId=${empId}&sbuId=${SBUID}&CountryId=${countryId}&expenseId=${expenseId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
//GetSumOfTotalExpense
export const GetSumOfTotalExpense = async (
  accId,
  BuId,
  empId,
  SBUID,
  countryId,
  expenseId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/Expense/GetSumOfTotalExpense?accountId=${accId}&businessUnitId=${BuId}&employeeId=${empId}&sbuId=${SBUID}&CountryId=${countryId}&expenseId=${expenseId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
//Get Advance Code DDL api
export const GetAdvanceCodeDDL = async (accId, BuId, SBUID, empId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/AdvanceCode/GetAdvanceCodeDDL?AccountId=${accId}&BusinessUnitId=${BuId}&SBUId=${SBUID}&EmployeeId=${empId}`
    );
    if (res.status === 200 && res?.data) {
      const addVanceDDL = res?.data.map((item) => {
        return {
          value: item.value,
          label: `${item.code} (${(+item.label).toFixed(2)})`,
          code: item.code,
          amount: item.label,
        };
      });
      setter(addVanceDDL);
    }
  } catch (error) { }
};
//created adjust with advance api
export const createAdjustWithAdvance = async (data, cb) => {
  try {
    const res = await Axios.post(
      `/fino/AdjustWithAdvance/CreateAdjustWithAdvance`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
//Get AdjustAdvance Info By AdvanceId api

export const getAdjustAdvanceInfoByAdvanceId = async (advanceId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/AdjustWithAdvance/GetAdjustAdvanceInfoByAdvanceId?AdvanceId=${advanceId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

// vehicle api
export const getVehicleDDL = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/Vehicle/GetVehicleDDL?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = [
        { value: 1, label: "Select Vehicle Number.." },
        ...res?.data,
      ];
      setter(newData);
    }
  } catch (error) { }
};

//BillSubmit_Api
export const BillSubmit_Api = async (
  data,
  gridDataCB,
  values,
  pageNo,
  pageSize
) => {
  try {
    const res = await Axios.put(`/fino/Expense/BillSubmitApi`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      gridDataCB(values, pageNo, pageSize, false, false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getExpensePlantDDLAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/SalesInformation/GetTransportzoneInformationforzonechange?PartID=5&UnitID=${buId}&Delivercode=DC01020211376&ShippingPoint=60&Customerid=14750&UpdateBy=521235&Transportzoneid=737&Reasons=test`
    );
    const modifyData = res?.data.map((item) => ({
      ...item,
      value: item?.intPlantid,
      label: item?.strPlantname,
    }));
    setter(modifyData);
  } catch (error) { }
};

export const getFuelLogCash = async (enroll, date, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/InternalTransport/GetFuelLogCashAmount?Partid=2&ApplicantEnroll=${enroll}&VehicleId=0&ExpenseDate=${date}`
    );
    setLoading(false);
    return Number(res?.data[0]?.numCashAmount || 0);
  } catch (error) {
    setLoading(false);
    return 0;
  }
};

// getProfitCenter List
export const getProfitCenterDDL = async (buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/CostSheet/ProfitCenterDetails?UnitId=${buId}`
    );
    const modifiedData = res?.data?.map((item) => ({
      ...item,
      value: item?.profitCenterId,
      label: item?.profitCenterName,
    }));
    setter(modifiedData);
  } catch (error) {
    console.log(error);
  }
};
// getCostElementDDL
export const getCostElementDDL = async (UnitId, AccountId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/CostElement?AccountId=${AccountId}&UnitId=${UnitId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};
