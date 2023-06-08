import Axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Validation schema
export const SaveInventoryLoanValidationSchema = Yup.object().shape({
  partner: Yup.object().shape({
    label: Yup.string().required("Partner is required"),
    value: Yup.string().required("Partner is required"),
  }),

  issueFrom: Yup.object().when("createType", {
    is: 1,
    then: Yup.object()
      .shape({
        value: Yup.string().required("This field is required"),
        label: Yup.string().required("This field is required"),
      })
      .typeError("This Field is required"),
    otherwise: Yup.object(),
  }),

  warehouse: Yup.object().when("issueFrom", (issueFrom) => {
    console.log("Issue From validation", issueFrom);
    if (+issueFrom?.value === 1) {
      return Yup.object().shape({
        value: Yup.string().required("Warehouse is required"),
        label: Yup.string().required("Warehouse is required"),
      });
    } else {
      return Yup.string();
    }
  }),

  shipPoint: Yup.object().when("issueFrom", (issueFrom) => {
    if (+issueFrom?.value === 2) {
      return Yup.object().shape({
        value: Yup.string().required("Ship point is required"),
        label: Yup.string().required("Ship point is required"),
      });
    } else {
      return Yup.string();
    }
  }),

  item: Yup.object().shape({
    label: Yup.string().required("Item is required"),
    value: Yup.string().required("Item is required"),
  }),
  quantity: Yup.number().required("Quantity is required"),
});

export const getLandingPaginationData = async (
  accId,
  buId,
  fromDate,
  toDate,
  partnerId,
  pageNo,
  pageSize,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryLoan/GetInvItemloanListPagination?AccountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&partnerId=${partnerId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );

    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getItemDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemSales/GetItemSalesDDL?AccountId=${accId}&BUnitId=${buId}`
    );

    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getShipmentDDL = async (
  accountId,
  businessUnitId,
  searchValue,
  setter
) => {
  try {
    const res = await Axios.get(
      `/imp/ImportCommonDDL/GetShipmentListForAllCharge?accountId=${accountId}&businessUnitId=${businessUnitId}&search=${searchValue}`
    );

    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getBusinessPartnerDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=4`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getSBUListDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/Disbursement/GetSbuDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getWarehouseDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/Warehouse/GetWarehouseFromPlantWarehouseDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
      setter(res?.data)
  } catch (err) {
    setter([]);
  }
};

export const saveInventoryLoanCreate = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/wms/InventoryLoan/CreateInvItemloan`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message, { toastId: 1234 });
      setLoading(false);
      cb();
    }
  } catch (err) {
    setLoading(false);
    toast.warning(err?.message || err?.response?.data?.message, {
      toastId: 12355,
    });
  }
};


export const getLoanSingleData = async (loanId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryLoan/GetInvItemloanById?LoanId=${loanId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};
