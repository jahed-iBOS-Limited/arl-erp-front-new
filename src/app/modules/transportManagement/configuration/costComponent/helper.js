import Axios from "axios";
import { toast } from "react-toastify";

//Get Business Transaction type DDL
export const getBusinessTransactionDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//Get Tax Branch DDL (not nessecary)
export const getTaxBranchDDL = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxBranchDDL?AccountId=${accid}&BusinessUnitId=${buid}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//Get Tax Component DDL
export const getTaxComponentDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxComponentDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//create cost component
export const createRouteCostComponent = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/tms/CostComponent/CreateRouteCostComponent`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    // console.log(error.response.data?.message);
    toast.warn(error.response.data?.message);
    setDisabled(false);
  }
};

//vat adjustment landing pagination
export const getTransportrouteCCPagination = async (
  accId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  search
) => {
  try {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    const res = await Axios.get(
      `/tms/CostComponent/GetTransportrouteCCSearchPagination?${searchPath}AccountId=${accId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200) {
      console.log("pagi", res?.data);
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
// get by id
export const getRouteCostComponent = async (
  accId,
  costCompId,
  setter,
  setDisabled
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/tms/CostComponent/GetRouteCostComponent?AccountId=${accId}&TransportRouteCostComponentId=${costCompId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      const newData = {
        transportRouteCostComponent: res?.data[0]?.transportRouteCostComponent,
        generalLedger: {
          value: res?.data[0]?.generalLedgerId,
          label: res?.data[0]?.generalLedgerName,
          code: res?.data[0]?.generalLedgerCode,
        },
      };
      setter(newData);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};
// edit cost component
export const editRouteCostComponent = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/tms/CostComponent/EditRouteCostComponent`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};
export const getGeneralLedgerDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${buId}&AccountGroupId=0`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data?.map((itm) => ({
        value: itm?.generalLedgerId,
        label: itm?.generalLedgerName,
        code: itm?.generalLedgerNameCode,
      }));
      setter(newData);
    }
  } catch (error) {}
};
