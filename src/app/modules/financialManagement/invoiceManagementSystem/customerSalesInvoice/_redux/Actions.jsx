import * as requestFromServer from "./Api";
import { customerInvoiceSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = customerInvoiceSlice;

export const getEmpDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmpDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetEmpDDL(data));
    }
  });
};

// get orderTypeDDL
export const getOrderTypeListDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getOrderTypeListDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetOrderTypeDDL(data));
    }
  });
};

// get poreference type ddl
export const getPoReferenceTypeDDLAction = (orderTypeId) => (dispatch) => {
  return requestFromServer.getPOReferenceTypeDDL(orderTypeId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPoReferenceTypeDDL(data));
    }
  });
};

// get POReferenceNoDDL
export const getPOReferenceNoDDLAction = (id) => (dispatch) => {
  return requestFromServer.getPOReferenceNoDDL(id).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPoReferenceNoDDL(data));
    }
  });
};

// get POReferenceNoDDL
export const getPOItemDDLAction = (refId, refNo) => (dispatch) => {
  return requestFromServer.getPOItemDDL(refId, refNo).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPoItemsDDL(data));
    }
  });
};

// get payment terms list ddl
export const getPaymentTermsListDDLAction = () => (dispatch) => {
  return requestFromServer.getPaymentTermsListDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPaymentTermsDDL(data));
    }
  });
};

// get inco terms list ddl
export const getIncoTermsListDDLAction = () => (dispatch) => {
  return requestFromServer.getIncotermListDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetIncoTermsListDDL(data));
    }
  });
};

// action for save created data
export const saveCustomerSalesInvoice = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload.data, payload.typeId)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.gridRefresh();
      }
    })
    .catch((err) => {
      payload.gridRefresh();
      toast.error(err?.response?.data?.message);
    });
};

// action for save edited data
export const saveEditedControllingUnit = (payload) => () => {
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        toast.success(res.data?.message || "Submitted successfully");
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
    });
};
// action for get grid data
export const getGridData = (
  accId,
  buId,
  sbuId,
  Billtypeid,
  fromDeliveryDte,
  toDeliveryDte,
  setLoading,
  // customerId,
  pageNo,
  pageSize,
  search
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(
      accId,
      buId,
      sbuId,
      Billtypeid,
      fromDeliveryDte,
      toDeliveryDte,
      search,
      // customerId,
      pageNo,
      pageSize
    )
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      setLoading(false);
    });
};

// action for get data by id single
export const getControllingUnitById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          responsiblePerson: {
            value: item.responsiblePerson,
            label: item.responsiblePersonName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {});
};
// set single store empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
