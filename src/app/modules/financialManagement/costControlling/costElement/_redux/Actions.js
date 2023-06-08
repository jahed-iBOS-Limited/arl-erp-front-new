import * as requestFromServer from "./Api";
import { costElementSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = costElementSlice;

// save cost element data
export const saveCostElement = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload?.data)
    .then((res) => {
      if (res?.status === 200) {
        toast.success(res?.data?.message || "Submitted successfully");
        payload.cb();
        payload.setDisabled(false);
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};

// get general ledger ddl from server
export const getGeneralLedgerDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getGeneralLedgerDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      const ddlTemp = [];
      data.forEach((itm) => {
        const items = {
          value: itm.generalLedgerId,
          label: itm.generalLedgerName,
        };
        ddlTemp.push(items);
      });
      return dispatch(slice.SetgeneralLedgerDDL(ddlTemp));
    }
  });
};

// get cost center grid data
export const getCostCenterData = (
  accId,
  buId,
  setLoading,
  pageNo,
  pageSize
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, pageNo, pageSize)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      setLoading(false);
     
    });
};

// Save Edited cost element into DB
export const saveEditedCostElementData = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setDisabled(false);
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};

// getCostCenter action for get single data by id
export const getCostCenterById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          controllingUnit: {
            value: item.controllingUnitId,
            label: item.controllingUnitName,
          },
          costCenter: item?.costCenterInfoList.map((itm) => ({
            value: itm?.value,
            label: itm?.label,
          })) || "",
          generalLedger: {
            value: item.generalLedgerId,
            label: item.generalLedgerName,
          },
          businessTransaction: {
            value: item.businessTransactionId,
            label: item.businessTransactionName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};

// cost element single to empty
export const setCostElementSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
