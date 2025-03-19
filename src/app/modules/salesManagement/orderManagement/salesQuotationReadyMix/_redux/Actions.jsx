import * as requestFromServer from "./Api";
import { salesQuotationSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = salesQuotationSlice;

// action for get data by id single
export const getSalesQuotationById = (id, setDisabled) => (dispatch) => {
  setDisabled && setDisabled(true);
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && res.data) {
        const item = res.data;
        const data = {
          ...item,
          objHeader: {
            ...item.objHeader,
            salesOrg: {
              value: item.objHeader?.salesOrganizationId,
              label: item.objHeader?.salesOrganizationName,
            },
            channel: {
              value: item.objHeader?.distributionChannelId,
              label: item.objHeader?.distributionChannelName,
            },
            salesOffice: {
              value: item.objHeader?.salesOfficeId,
              label: item.objHeader?.salesOfficeName,
            },
            soldtoParty: {
              value: item.objHeader?.soldToPartnerId,
              label: item.objHeader?.soldToPartnerName,
            },
            quotationCode: item.objHeader?.quotationCode,
            isSpecification: false,
            remark: item?.objHeader?.remark || "",
          },

          validityDays: item.objHeader?.validityDays || 0,
          transportType: {
            value: item.objHeader?.transportTypeId,
            label: item.objHeader?.transportType,
          },
          creditBackUp: {
            value: item.objHeader?.creditBackUpTypeId,
            label: item.objHeader?.creditBackUpType,
          },
          destination: item.objHeader?.finalDestination || "",
          creditLimitDaysPropose: item.objHeader?.creditLimitDaysPropose || 0,
          creditLimitAmountsPropose:
            item.objHeader?.creditLimitAmountsPropose || 0,
        };
        setDisabled && setDisabled(false);
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
      setDisabled && setDisabled(true);
    });
};

export const getSpecificationDDLAction = (buId) => (dispatch) => {
  return requestFromServer.getSpecificationDDL(buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSpctionDDL(data));
    }
  });
};

export const getSalesOrgDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getSalesOrgDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSalesOrg(data));
    }
  });
};

export const getSoldToPartyDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getSoldToPartyDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSoldToParty(data));
    }
  });
};

// action for save created data
export const saveSalesquotation = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        payload.setDisabled(false);
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb(res?.data);
      }
    })
    .catch((err) => {
      //
      payload.setDisabled(false);
      toast.error(err?.response?.data?.message);
    });
};
// action for save edited data
export const saveEditedSalesquotation = (payload, setLoading) => () => {
  setLoading(true);
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        // console.log(res.data);
        setLoading(false);
        toast.success(res.data?.message || "Submitted successfully");
      }
    })
    .catch((err) => {
      // console.log(err?.response);
      setLoading(false);
      toast.error(err?.response?.data?.message);
    });
};
// action for get grid data
export const getSalesquotationGridData = (
  accId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  searchValue,
  status,
  fromDate,
  toDate
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(
      accId,
      buId,
      pageNo,
      pageSize,
      searchValue,
      status,
      fromDate,
      toDate
    )
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res?.data));
    })
    .catch((err) => {
      setLoading(false);
      //
    });
};

// set single store empty
export const setSalesQuotationSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
// action for save edited data
export const editSalesQuotationStatusAction = (
  QId,
  actionBy,
  setLoading,
  history
) => () => {
  setLoading(true);
  return requestFromServer
    .editSalesQuotationStatus(QId, actionBy)
    .then((res) => {
      if (res.status === 200) {
        setLoading(false);
        toast.success(res.data?.message || "Submitted successfully");
        history.push("/sales-management/ordermanagement/salesquotation");
      }
    })
    .catch((err) => {
      // console.log(err?.response);
      setLoading(false);
      toast.error(err?.response?.data?.message);
    });
};
