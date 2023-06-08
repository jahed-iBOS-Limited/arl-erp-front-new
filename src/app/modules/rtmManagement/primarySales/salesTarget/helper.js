import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const SalesTargetLanding = async (
  accountId,
  buId,
  TerritoryId,
  Month,
  Year,
  routeId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/rtm/SalesTarget/SalesTargetLandingPasignation?AccountId=${accountId}&BusinessUnitId=${buId}&TerritoryId=${TerritoryId}&RouteId=${routeId}&Month=${Month}&Year=${Year}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      if (res?.data?.data?.length > 0) {
        setter(res?.data);
      } else {
        toast.warn("Data not found");
        setter(res?.data);
      }
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetProductionView = async (TaxPurchaseId, setter, setRowDto) => {
  try {
    const res = await Axios.get(
      `/vat/ProductionInvoice/GetProductionInvoiceById?TaxPurchaseId=${TaxPurchaseId}
      `
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;

      const newData = {
        objHeader: {
          ...data?.objHeader,
          branchName: {
            value: data?.objHeaderDTO?.taxBranchId,
            label: data?.objHeaderDTO?.taxBranchName,
          },
          branchAddress: data?.objHeaderDTO?.taxBranchAddress,
          transactionType: {
            value: data?.objHeaderDTO?.taxTransactionTypeId,
            label: data?.objHeaderDTO?.taxTransactionTypeName,
          },
          transactionDate: _dateFormatter(data?.objHeaderDTO?.transactionDate),
          referanceNo: data?.objHeaderDTO?.referanceNo,
          referenceDate: _dateFormatter(data?.objHeaderDTO?.referanceDate),
        },
        objRow: [...data?.objListRowDTO],
      };
      const newRowDto = newData?.objRow.map((item) => ({
        itemName: {
          value: item?.taxItemGroupName,
          label: item?.taxItemGroupName,
        },
        quantity: item?.quantity,
        uom: item?.uomname,
        rate: item?.basePrice,
        sd: item?.sdpercentage,
        vat: item?.vatTotal,
        surcharge: item?.surchargePercentage,
        totalAmount: item?.totalAmount,
      }));
      setRowDto(newRowDto);
      setter(newData);
    }
  } catch (error) {}
};

export const GetSalesTargetView = async (
  AccountId,
  buId,
  TerritoryId,
  Month,
  Year,
  setter,
  setRowDto
) => {
  try {
    const res = await Axios.get(
      `/rtm/SalesTarget/GetSalesTargetByDetailsId?AccountId=${AccountId}&BusinessUnitId=${buId}&TerritoryId=${TerritoryId}&Month=${Month}&Year=${Year}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;

      const newData = {
        objHeader: {
          ...data?.objHeader,
          accountId: 0,
          businessUnitId: 0,
          targetMonth: data?.objCreateHeader?.targetMonth,
          targetMonthName: data?.objCreateHeader?.targetMonthName,
          targetYear: data?.objCreateHeader?.targetYear,
          territoryId: data?.objCreateHeader?.territoryId,
          targetYearName: data?.objCreateHeader?.targetYearName,
          territoryName: data?.objCreateHeader?.territoryName,
          actionBy: 0,
          currentDate: "0001-01-01T00:00:00",
          fromDate: data?.objHeader?.fromDate,
          toDate: data?.objHeader?.toDate,
          // accountId: 0,
          // businessUnitId: 0,
          // targetMonth: data?.objCreateHeader?.targetMonth,
          // targetYear: data?.objCreateHeader?.targetYear,
          // territoryId: data?.objCreateHeader?.territoryId,
          // actionBy: 0,
          // currentDate: "0001-01-01T00:00:00",
          // fromDate:  data?.objHeader?.fromDate,
          // toDate:  data?.objHeader?.toDate,
        },
        objRow: [...data?.objCreateRowList],
      };
      const newRowDto = newData?.objRow?.map((item) => ({
        itemId: item?.itemName?.value,
        itemName: item?.itemName?.label,
        price: item?.rate,
        quantity: item?.quantity,
        targetId: 0,
        totalAmount: item?.totalAmount,
        // targetId: 0,
        // itemId: item?.itemName?.value,
        // quantity: item?.quantity,
        // price: item?.rate,
        // totalAmount: item?.totalAmount,
      }));
      setRowDto(newRowDto);
      setter(newData);
      console.log(newData, "call data");
      console.log(data, "helper");
    }
  } catch (error) {}
};

export const saveSalesTarget = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/rtm/SalesTarget/CreateSalesTarget`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editSalesTarget = async (data, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.put(`/rtm/SalesTarget/EditSalesTarget`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getTerritoryDDL_api = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetTerritoryDDL?AccountId=${accid}&BusinessUnitId=${buid}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getTransactionTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTransactionTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getMonthDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/rtm/RTMDDL/GetMonthDDl`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getCustomerNameDDL_api = async (
  accId,
  buId,
  terrytoryId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/GetCustomerDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerrytoryId=${terrytoryId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getRate_api = async (accId, buId, PartnerId, ItemId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/GetItemRateByPartnerItemId?AccountId=${accId}&BusinessUnitId=${buId}&PartnerId=${PartnerId}&ItemId=${ItemId}`
    );
    if (res.status === 200) {
      setter("rate", res?.data);
    }
    console.log(res?.data, "data", setter, "setter");
  } catch (error) {}
};

export const getItemNameDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/CustomerSalesTarget/GetitemDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=4
      `
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      const newData = data.map((item) => {
        return {
          value: item.itemId,
          label: item.itemName,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};

export const GetSalesTargetRtmView = async (
  accId,
  buId,
  TerritoryId,
  Month,
  Year,
  setter
) => {
  try {
    const res = await Axios.get(
      `/rtm/SalesTarget/GetSalesTargetByDetailsId?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${TerritoryId}&Month=${Month}&Year=${Year}`
    );

    let {
      businessUnitId,
      accountId,
      territoryId,
      targetMonthName,
      targetYearName,
      territoryName,
      currentDate,
      fromDate,
      toDate,
    } = res?.data?.objCreateHeader;
    let row = res?.data?.objCreateRowList;

    let obj = {
      accountId: accountId,
      businessUnitId: businessUnitId,
      territoryId: territoryId,
      territoryName: territoryName,
      month: targetMonthName,
      year: targetYearName,
      currentDate: currentDate,
      startDate: fromDate,
      endDate: toDate,
      row,
    };
    setter(obj);
    console.log(obj);
  } catch (error) {}
};

export const getRouteDDL_api = async (accId, buId, tId, setter) => {
  try {
    let res = await Axios.get(
      `/rtm/RTMDDL/RouteByTerritoryIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${tId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
