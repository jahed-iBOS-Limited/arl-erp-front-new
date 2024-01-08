import axios from "axios";
import * as requestFromServer from "./Api";
import { salesContactSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = salesContactSlice;

export const getSalesOfficeDDLAction = (accId, buId, SalesOrgId) => (
  dispatch
) => {
  return requestFromServer
    .GetSalesOfficeDDLbyId(accId, buId, SalesOrgId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetSalesOfficeDDL(data));
      }
    });
};
export const getSoldToPDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.GetSoldToPPId(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSoldToPPDDL(data));
    }
  });
};
export const getBUsalesOrgIncotermDDLAction = (accId, buId, salesOrgId) => (
  dispatch
) => {
  return requestFromServer
    .GetBUsalesOrgIncotermDDL(accId, buId, salesOrgId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetBUsalesOrgIncotermDDL(data));
      }
    });
};
export const getPaymentTermsDDLAction = (accId, buId, salesOrgId) => (
  dispatch
) => {
  return requestFromServer.GetPaymentTermsDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPaymentTermsDDL(data));
    }
  });
};
// action for save created data
export const saveSalesContact = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        payload.setDisabled(false);
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
      //
      payload.setDisabled(false);
      toast.error(err?.response?.data?.message);
    });
};
// action for save edited data
export const saveEditedSalesContact = (payload, setLoading) => () => {
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
export const getSalesContactGridData = (
  accId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  searchValue
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, pageNo, pageSize, searchValue)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res?.data));
    })
    .catch((err) => {
      setLoading(false);
      //
    });
};
// action for get data by id single
export const getSalesContactById = (accId, buId, id) => (dispatch) => {
  return requestFromServer
    .getDataById(accId, buId, id)
    .then((res) => {
      if (res.status === 200 && res.data) {
        const item = res.data;
        // row data
        const objListRowDTO = item?.objListRowDTO?.map((itm) => ({
          ...itm,
        }));
        const data = {
          ...item,
          objHeaderDTO: {
            ...item.objHeaderDTO,
            plant: {
              value: item.objHeaderDTO.plantId,
              label: item.objHeaderDTO.plantName,
            },
            salesOrg: {
              value: item.objHeaderDTO.salesOrganizationId,
              label: item.objHeaderDTO.salesOrganizationName,
            },
            distributionChannel: {
              value: item.objHeaderDTO.distributionChannelId,
              label: item.objHeaderDTO.distributionChannelName,
            },
            salesOffice: {
              value: item.objHeaderDTO.salesOfficeId,
              label: item.objHeaderDTO.salesOfficeName,
            },
            soldToParty: {
              value: item.objHeaderDTO.soldToPartnerId,
              label: item.objHeaderDTO.soldToPartnerName,
            },
            BUsalesOrgIncoterm: {
              value: item.objHeaderDTO.incotermId,
              label: item.objHeaderDTO.incotermsName,
            },
            paymentTerms: {
              value: item.objHeaderDTO.paymentTermId,
              label: item.objHeaderDTO.paymentTermsName,
            },
            vehicleBy: {
              label: item.objHeaderDTO.vehicleBy,
              value: item.objHeaderDTO.vehicleBy,
            },
            itemLists: objListRowDTO,
            remark: item.objHeaderDTO.vehicleBy,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {});
};
// set single store empty
export const setSalesContactSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

// getSalesOrgDDL
export const getSalesOrgDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getSalesOrgDDL_api(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSalesOrgDDL(res.data));
    }
  });
};
export const getDeliveryAddressAction = (accId, buId, partnerId, setter) => (
  dispatch
) => {
  requestFromServer
    .getDeliveryAddress(accId, buId, partnerId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        setter("deliveryAddress", res?.data || "");
      }
    })
    .catch((error) => {
      setter("deliveryAddress", "");
    });
};

export const GetSalesContractInfoApi = async (
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesContact/GetSalesContractInfo?businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    setter(res?.data);
    cb();
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
