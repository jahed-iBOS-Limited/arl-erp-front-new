import * as requestFromServer from './Api';
import { salesQuotationSlice } from './Slice';
import { toast } from 'react-toastify';
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
            remark: item?.objHeader?.remark || '',
            salesContract: item.objHeader?.salesContract,
            salesTerm: item.objHeader?.salesTerm,
            modeOfShipment: item.objHeader?.modeOfShipment,
            portOfShipment: item.objHeader?.portOfShipment,
            portOfDischarge: item.objHeader?.portOfDischarge,
            finalDestination: item.objHeader?.finalDestination,
            countryOfOrigin: item.objHeader?.countryOfOrigin,
            contractFor: item.objHeader?.contractFor,
            freightCharge: item.objHeader?.freightCharge,
            termsAndConditions: '',
            currency: {
              value: item.objHeader?.currencyId,
              label: item.objHeader?.currencyName,
            },
            quantity: '',
            strCoraseAggregate: item.objHeader?.strCoraseAggregate || '',
            strFineAggregate: item.objHeader?.strFineAggregate || '',
            strUsesOfCement: item.objHeader?.strUsesOfCement || '',
            paymentMode: item.objHeader?.paymentMode || '',
          },
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
        toast.success(res.data?.message || 'Submitted successfully');
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
        toast.success(res.data?.message || 'Submitted successfully');
      }
    })
    .catch((err) => {
      // console.log(err?.response);
      setLoading(false);
      toast.error(err?.response?.data?.message);
    });
};
// action for get grid data
export const getSalesquotationGridData =
  (
    accId,
    buId,
    setLoading,
    pageNo,
    pageSize,
    searchValue,
    status,
    fromDate,
    toDate
  ) =>
  (dispatch) => {
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
export const editSalesQuotationStatusAction =
  (QId, actionBy, setLoading, history) => () => {
    setLoading(true);
    return requestFromServer
      .editSalesQuotationStatus(QId, actionBy)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          toast.success(res.data?.message || 'Submitted successfully');
          history.push('/sales-management/ordermanagement/salesquotation');
        }
      })
      .catch((err) => {
        // console.log(err?.response);
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };
