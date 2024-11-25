import Axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  selectedEmp: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .required("Employee is required"),
  sbu: Yup.object()
    .shape({
      label: Yup.string().required("SBU is required"),
      value: Yup.string().required("SBU is required"),
    })
    .required("SBU is required"),
  currency: Yup.object()
    .shape({
      label: Yup.string().required("Currency is required"),
      value: Yup.string().required("Currency is required"),
    })
    .required("Currency is required"),
  plant: Yup.object()
    .shape({
      label: Yup.string().required("Plant is required"),
      value: Yup.string().required("Plant is required"),
    })
    .required("Plant is required"),
});

//SBU API
export const getSBU = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${BuId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

///EMP API will show both id and name here
export const getEMP = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      const addVanceDDL = res?.data.map((item) => {
        return {
          label: `${item.label} (${item.value}) `,
          value: item.value,
        };
      });
      setter(addVanceDDL);
    }
  } catch (error) {}
};

//CURRENCY API
export const getCURRENCY = async (BuId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/BusinessUnitDomain/GetExpenceBusinessUnitCurrancyDDL?BusinessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

///Requested Employee Api
export const getRequestedEmp = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      const addVanceDDL = res?.data.map((item) => {
        return {
          label: `${item.label} (${item.value}) `,
          value: item.value,
        };
      });
      setter(addVanceDDL);
    }
  } catch (error) {}
};

////Category
export const getAdvExpCategoryName = async (accId, BuId, SbuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/ExpenseCategory/GetExpenseCategoryDDL?IsActive=true&AccountId=${accId}&BusinessUnitId=${BuId}&SBUId=${SbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

///Payment APi
export const getPaymentType = async (setter) => {
  try {
    const res = await Axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

///Disbursement Api
export const getDisbursementCenterName = async (accId, BuId, SbuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/DisbursementCenter/GetDisbursementCenterDDL?AccountId=${accId}&BusineesUnitId=${BuId}&SBUId=${SbuId}&IsActive=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetBusTransDDLForExp_api = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionDDLForExpense?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const singleDataById = async (advId, setter, setDisabled) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/fino/AdvanceExpense/GetAdvanceExpenseById?AdvanceId=${advId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data[0];
      setDisabled && setDisabled(false);
      const newData = {
        ...data,
        requestedEmp: {
          value: data.employeeId,
          label: data.employeeName,
        },
        advExpCategoryName: {
          value: data.categoryId,
          label: data.categoryName,
        },
        numRequestedAmount: data.requestedAmount,
        dueDate: _dateFormatter(data.dueDate),
        paymentType: {
          value: data.instrumentId,
          label: data.instrumentName,
        },
        costCenter: {
          value: data.costCenterid,
          label: data.costCenterName,
        },
        costElement: {
          value: data.costElementid,
          label: data.costElementName,
        },
        profitCenter: {
          value: data.profitCenterid,
          label: data.profitCenterName,
        },
        disbursementCenterName: {
          value: data.disbursementCenterId,
          label: data.disbursementCenterName,
        },
        SBU: {
          value: data.sbuid,
          label: data.sbuname,
        },
        expenseHead: {
          value: data.businessTransactionId,
          label: data.businessTransactionName,
        },
        accountHead: {
          value: data.subGlaccountHeadId,
          label: data.strSubGlaccountHead,
        },
        expenseGroup:
          data?.expenseGroup === ""
            ? ""
            : data?.expenseGroup === "TaDa"
            ? {
                value: "TaDa",
                label: "Ta/Da",
              }
            : {
                value: "Other",
                label: "Other",
              },
      };
      setter(newData);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

export const getExpenseAdvanceDDLAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/Plant/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getExpensePlantDDLAction = async (buId, setter) => {
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
  } catch (error) {}
};
