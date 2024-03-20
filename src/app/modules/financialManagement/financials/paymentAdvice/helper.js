import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";

export const getAccountNoDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getCashDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBusinessUnitGeneralLedgerDDLTypeById?AccountId=${accId}&BusinssUnitId=${buId}&AccountingGroupId=2`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    setter(res?.data);
  } catch (error) {}
};

export const getBuUnitDDL = async (userId, clientId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${userId}&ClientId=${clientId}`
    );

    if (res.status === 200 && res.data) {
      const data = res?.data.map((itm) => ({
        value: itm?.organizationUnitReffId,
        label: itm?.organizationUnitReffName,
        address: itm?.businessUnitAddress,
      }));
      setter(data);
    }
  } catch (error) {}
};

// create
export const saveItemRequest = async (data) => {
  try {
    const res = await Axios.post(
      `/mes/SalesPlanning/CreateSalesPlanning`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.data?.message);
    }
  } catch (error) {}
};

// Edit Sales Planning
export const editSalesPlanning = async (data) => {
  try {
    const res = await Axios.put(`/mes/SalesPlanning/EditSalesPlanning`, data);
    if (res.status === 200) {
      console.log(res);
      toast.success(res?.data?.message);
    }
  } catch (error) {
    console.log(error.message);
  }
};

// rowData
export const getPaymentAdviceIndoPagination = async (
  accId,
  buId,
  sbuId,
  billType,
  status,
  setter,
  setLoading,
  search
) => {
  setLoading(true);

  const searchPath = search ? `&BillNo=${search}` : "";
  try {
    const res = await Axios.get(
      `/fino/PaymentRequest/PrepareAllVoucher?AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&BillType=${billType}&status=${status}${searchPath}`
    );

    let newdata = res?.data.map((item) => {
      const monAmount = Math.floor(+item?.monAmount || 0);
      const numTds = Math.floor(+item?.numTds || 0);
      const numVds = Math.floor(+item?.numVds || 0);

      const calMonAmount = [1, 2]?.includes(+billType)
        ? monAmount - (numTds + numVds)
        : monAmount;
      return {
        ...item,
        apiAmount: Math.floor(+item?.monAmount),
        monAmount: Math.floor(calMonAmount || 0),
        paymentDate: _todayDate(),
        numTds: numTds,
        numVds: numVds,
        approvedAmount : [1]?.includes(+billType)?monAmount : null
      };
    });
    setter(newdata);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
// get data by single id

export const getSalesPlanById = async (
  salesPlanId,
  setterHeader,
  setterRow
) => {
  try {
    const res = await Axios.get(
      `/mes/SalesPlanning/GetSalesPlanById?SalesPlanId=${salesPlanId}`
    );
    if (res.status === 200) {
      const newRow = res?.data?.objRow;
      //const newHeader = res?.data?.objHeader;
      const newHeader = {
        plant: {
          value: res?.data?.objHeader?.plantId,
          label: res?.data?.objHeader?.plantName,
        },
        year: {
          value: res?.data?.objHeader?.yearId,
          label: res?.data?.objHeader?.yearId,
        },
        startDate: _dateFormatter(res?.data?.objHeader?.startDateTime),
        endDate: _dateFormatter(res?.data?.objHeader?.endDateTime),
        horizon: {
          value: res?.data?.objHeader?.planningHorizonRowId,
          label: res?.data?.objHeader?.planningHorizonRowName,
        },
      };

      setterHeader(newHeader);
      setterRow(newRow);
    }
  } catch (error) {}
};

export const getSBUList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getInstrumentType = async (setter) => {
  try {
    const res = await Axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data?.filter((item) => item.label.toLowerCase() !== "cash"));
    }
  } catch (error) {}
};

export const billTypeList = async (setter) => {
  try {
    const res = await Axios.get(`/fino/FinanceCommonDDL/GetBillTypeDDL`);
    setter(res?.data);
  } catch (error) {}
};

export const createPaymentVoucher = async (
  data,
  cb,
  setBankModelShow,
  setDisabled,
  getLanding,
  values
) => {
  try {
    setDisabled(true);
    const res = await Axios.post(`/fino/PaymentRequest/PreparePayment`, data);
    // get previous page data when save successful
    getLanding && getLanding(values);
    setDisabled(false);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
      cb();
      if (setBankModelShow) {
        setBankModelShow(false);
      }
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

//Get Production plan Data
export const getProductionPlanning = async (
  accId,
  buId,
  plantId,
  salesPlanId,
  setterHeader,
  setterRow
) => {
  try {
    const res = await Axios.get(
      `/mes/ProductionPlanning/GetProductionPlanItemsPagination?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&SalesPlanId=${salesPlanId}&PageNo=1&PageSize=10&viewOrder=desc`
    );
    const newHeader = {
      plant: {
        value: res?.data?.header?.plant.value,
        label: res?.data?.header?.plant.label,
      },
      year: {
        value: res?.data?.header?.intYearId,
        label: res?.data?.header?.intYearId,
      },
      startDate: _dateFormatter(res?.data?.header?.dteStartDateTime),
      endDate: _dateFormatter(res?.data?.header?.dteEndDateTime),
      horizon: {
        value: res?.data?.header?.planningHorizon.value,
        label: res?.data?.header?.planningHorizon.label,
      },
    };

    setterHeader(newHeader);
    setterRow(res?.data?.data);
  } catch (error) {
    console.log(error.message);
  }
};

export const sumSelectedValue = (arr)=>{
  return  arr.reduce((prev, item) => {
    if (item.isSelect) {
        return prev + item.monAmount;
    } else {
        return prev;
    }
}, 0);
}
