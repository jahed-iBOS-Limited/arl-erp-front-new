import Axios from "axios";
import { toast } from "react-toastify";
// Plant DDL Call
export const getPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetBillTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/fino/FinanceCommonDDL/GetBillTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetBillRegister_api = async (
  values,
  accId,
  buId,
  typeId,
  approvalType,
  plantId,
  sbu,
  costCenterId,
  pageSize,
  PageNo,
  setter,
  setDisabled,
  search
) => {
  setDisabled(true);
  try {
    const searchPath = search ? `&Search=${search}` : "";
    const pageNo = search ? 0 : PageNo;
    const res = await Axios.get(
      `/fino/PaymentRequest/GetBillRegister?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&SBUId=${sbu}&TypeId=${typeId}&ApprovalType=${approvalType}&PageSize=${pageSize}&PageNo=${pageNo}&ViewOrder=desc${searchPath}&fromDate=${
        values?.fromDate
      }&toDate=${values?.toDate}&CostCenterId=${costCenterId || 0}`
    );
    setDisabled(false);
    const modifyGridData = {
      ...res?.data,
      data: res?.data?.data?.map((itm) => ({ ...itm, itemCheck: false })),
    };
    setter(modifyGridData);
  } catch (error) {
    setDisabled(false);
    setter([]);
  }
};

export const CreatePaymentRequest_api = async (
  data,
  setDisabled,
  girdDataFunc,
  values,
  setModalShow
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/PaymentRequest/CreatePaymentRequest`,
      data
    );
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res?.data?.message || "Submitted successfully", {
        toastId: "CreatePaymentRequest",
      });
      girdDataFunc(values);
      setModalShow && setModalShow(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message, {
      toastId: "CreatePaymentRequest",
    });
  }
};

export const BillApproved_api = async (
  actionById,
  data,
  setDisabled,
  girdDataFunc,
  values,
  setModalShow
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/BillRegister/BillApproved?ActionById=${actionById}`,
      data
    );
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res?.data?.message || "Submitted successfully", {
        toastId: "BillApproved",
      });
      girdDataFunc(values);
      setModalShow && setModalShow(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message, {
      toastId: "BillApproved",
    });
  }
};
export const rejectBillRegister_api = async (
  data,
  setDisabled,
  girdDataFunc,
  values,
  setIsReject
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/fino/BillRegister/RejectBillRegister`, data);
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res?.data?.message || "Submitted successfully", {
        toastId: "RejectBillRegister",
      });
      girdDataFunc(values);
      setIsReject(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message, {
      toastId: "RejectBillRegister",
    });
  }
};

export const GetSupplierInvoiceById_api = async (
  id,
  buId,
  setter,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/procurement/SupplierInvoice/GetSupplierInvoiceById?BillId=${id}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled(false);
      setter(res?.data);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const GetFairPriceInvoiceById_api = async (id, setter, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/fino/Odoo/GetFairPriceInvoiceById?BillId=${id}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled(false);
      setter(res?.data);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const GetAdvanceForSupplierById = async (poId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/SupplierInvoiceInfo/GetAdvanceForSupplierById?PoId=${poId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetSupplierAdvancesByBill_api = async (
  accId,
  buId,
  billId,
  setter,
  setDisabled,
  setAdvanceForSupplierById
) => {
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/fino/BillRegister/GetSupplierAdvancesByBill?AccountId=${accId}&BusinessUnitId=${buId}&BillId=${billId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled(false);
      setter(res?.data);
      GetAdvanceForSupplierById(res?.data?.poid, setAdvanceForSupplierById);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const GetInternalAdvancesByBill_api = async (
  accId,
  buId,
  billId,
  setter,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/fino/BillRegister/GetInternalAdvancesByBill?AccountId=${accId}&BusinessUnitId=${buId}&BillId=${billId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled(false);
      setter(res?.data);
    }
  } catch (error) {
    setDisabled(false);
  }
};
export const GetExpensesByBill_api = async (
  accId,
  buId,
  billId,
  setter,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/fino/BillRegister/GetExpensesByBill?AccountId=${accId}&BusinessUnitId=${buId}&BillId=${billId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled(false);
      setter(res?.data);
    }
  } catch (error) {
    setDisabled(false);
  }
};
export const getSbuDDL = async (accId, buId, setter, cb) => {
  try {
    let res = await Axios.get(
      `/hcm/HCMDDL/GetSBUDDL?AccountId=${accId}&BusineessUnitId=${buId}`
    );

    setter(res?.data);
    cb&& cb(res?.data)
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
export const getExpanseBillDetail = async ({
  buId,
  billId,
  setter,
  setLoading,
}) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/Expense/ExpanseBillDetail?BusinessUnitId=${buId}&BillId=${billId}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(
        res?.data?.map((itm) => ({
          ...itm,
          requestAmount: itm?.lineManagerAmount || 0,
        }))
      );
    }
  } catch (error) {
    setLoading(false);
  }
};
export const getCostCenterDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
