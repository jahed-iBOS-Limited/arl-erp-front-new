import * as requestFromServer from "./Api";
import { rfqSlice } from "./Slice";
import { toast } from "react-toastify";
import axios from "axios";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
const { actions: slice } = rfqSlice;

// save rfq
export const saveRfq = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        // payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

// save quotation entry
export const saveQuotationEntry = (payload) => () => {
  return requestFromServer
    .saveQuotationEntryData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        // payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};
export const updateQuotationEntry = (payload) => () => {
  return requestFromServer
    .updateQuotationEntryData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        // payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

// save cs data
export const saveCSDataAction = (payload) => () => {
  return requestFromServer
    .saveCSData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        // payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

// grid data
export const getRfqGridData = (
  accId,
  buId,
  plantId,
  warehouseId,
  sbuId,
  POId,
  reqId
) => (dispatch) => {
  return requestFromServer
    .getGridData(accId, buId, plantId, warehouseId, sbuId, POId, reqId)
    .then((res) => {
      if (!res?.data?.data?.length) {
        toast.warning("No data found");
      }
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {});
};

// quotation data
export const getQuotationData = (accId, buId, rfqId) => (dispatch) => {
  return requestFromServer
    .getQuotationData(accId, buId, rfqId)
    .then((res) => {
      if (!res?.data?.data?.length) {
        toast.warning("No data found");
      }
      return dispatch(slice.SetQuotationData(res.data?.data));
    })
    .catch((err) => {});
};

// cs data
export const getCsDataAction = (accId, buId, rfqId) => (dispatch) => {
  return requestFromServer
    .getCsData(accId, buId, rfqId)
    .then((res) => {
      if (!res?.data?.length) {
        toast.warning("No data found");
      }
      return dispatch(slice.SetCsData(res.data));
    })
    .catch((err) => {});
};

// Save edited data into DB
export const saveEditedRFQ = (payload) => () => {
  return requestFromServer
    .saveEditedData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

// action for get data by id single
export const getDataById = (rfqId) => (dispatch) => {
  requestFromServer
    .getDataById(rfqId)
    .then((res) => {
      if (res.status === 200) {
        dispatch(slice.SetSingleData(res.data));
      }
    })
    .catch((err) => {});
};

// rfq single to empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

// grid data single to empty
export const setGridDataEmptyAction = () => async (dispatch) => {
  return dispatch(slice.SetGridDataEmpty());
};

// uom ddl
export const getUomDDLAction = (accId, buId, itemId) => (dispatch) => {
  requestFromServer
    .getUomDDL(accId, buId, itemId)
    .then((res) => {
      if (res.status === 200) {
        dispatch(slice.SetuoMDDL(res.data));
      }
    })
    .catch((err) => {});
};

// getRefNoDDL ddl
export const getRefNoDDLAction = (
  accId,
  buId,
  sbuId,
  POId,
  plantId,
  wareHouseId
) => (dispatch) => {
  requestFromServer
    .getRefNoDDL(accId, buId, sbuId, POId, plantId, wareHouseId)
    .then((res) => {
      if (res.status === 200) {
        dispatch(slice.SetRefNoDDL(res.data));
      }
    })
    .catch((err) => {});
};

// item ddl
export const getItemDDLAction = (accId, buId, plantId, whId) => (dispatch) => {
  requestFromServer
    .getItemDDLWithOutRef(accId, buId, plantId, whId)
    .then((res) => {
      if (res.status === 200) {
        dispatch(slice.SetItemDDL(res.data));
      }
    })
    .catch((err) => {});
};

// item ddl when reference type === with reference
export const getItemDDLWithRefAction = (
  accId,
  buId,
  sbu,
  poId,
  plantId,
  whId,
  prId,
  ref
) => (dispatch) => {
  requestFromServer
    .getItemDDLWithRef(accId, buId, sbu, poId, plantId, whId, prId, ref)
    .then((res) => {
      if (res.status === 200) {
        dispatch(slice.SetItemDDL(res.data));
      }
    })
    .catch((err) => {});
};

export const getSupplierNameDDLAction = async (accId, buId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${buId}&SBUId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSupplierItemRowNameDDLAction = async (
  PartnerRFQId,
  setter,
  setFieldValue
) => {
  try {
    const res = await axios.get(
      `/procurement/RequestForQuotation/GetItemListByPartnerRFQId?PartnerRFQId=${PartnerRFQId}`
    );
    if (res.status === 200 && res?.data) {
      res.data.itemList.forEach((item) => {
        item["rfqQty"] = item["requestQuantity"];
        item["purchaseDescription"] = item["narration"];
        item["comments"] = item["remarks"] || "";
        item["rowid"] = item["rowId"];
      });
      setter(res.data.itemList);
      setFieldValue("supplierRef", res.data.headerData.supplierRefNo || "");
      setFieldValue(
        "supplierDate",
        res.data.headerData.supplierRefDate
          ? _dateFormatter(res.data.headerData.supplierRefDate)
          : ""
      );
    }
  } catch (error) {}
};
export const getRFQSupplierList = async (accId, buId, rfqId) => {
  return axios.get(
    `/procurement/RequestForQuotation/GetRFQSupplierDDL?AccountId=${accId}&BusinessUnitId=${buId}&RequestForQuotationId=${rfqId}`
  );
};

export const getRFQSupplierNameDDLAction = async (
  accId,
  buId,
  rfqId,
  setter
) => {
  try {
    const res = await axios.get(
      `/procurement/RequestForQuotation/GetRFQSupplierDDL?AccountId=${accId}&BusinessUnitId=${buId}&RequestForQuotationId=${rfqId}`
    );
    if (res.status === 200 && res?.data) {
      console.log(res.data, "data");
      setter(res?.data);
    }
  } catch (error) {}
};
