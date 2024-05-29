import { toast } from "react-toastify";
import * as requestFromServer from "./Api";
import { commonDDLSlice } from "./Slice";
const { actions: slice } = commonDDLSlice;

// Employee DDL
export const getEmpDDLCommonAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmpDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetEmpDDL(data));
    }
  });
};

// Employee DDL
export const getPMSFrequencyDDLAction = () => (dispatch) => {
  return requestFromServer.getPMSFrequencyDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPMSFrequencyDDL(data));
    }
  });
};

// Business Unit DDL
export const getBUDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getBUDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetBuDDL(res.data));
    }
  });
};

// plant DDL
export const getPlantDDLAction = (userId, accId, buId) => (dispatch) => {
  requestFromServer.getPlantDDL(userId, accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPlantDDL(res.data));
    }
  });
};

// sbu DDL
export const getSbuDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getSbuDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSbuDDL(res.data));
    }
  });
};

// getItemSaleDDL
export const getItemSaleDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getItemSaleDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetItemSaleDDL(res.data));
    }
  });
};

// ShippingDDL
export const getShippingDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getShippingDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetShippingDDL(res.data));
    }
  });
};

// getCostCenterDDL
export const getCostCenterDDLAction = (accId, buId, cuId) => (dispatch) => {
  requestFromServer.getCostCenterDDL(accId, buId, cuId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetCostCenterDDL(res.data));
    }
  });
};

// getCurrencyDDL
export const getCurrencyDDLAction = () => (dispatch) => {
  requestFromServer.getCurrencyDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetCurrencyDDL(res.data));
    }
  });
};

// purchase ddl
export const getPurchaseOrgDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer
    .getPurchaseOrgDDL(accId, buId)
    .then((res) => {
      if (res.status === 200) {
        dispatch(slice.SetPurchaseDDL(res.data));
      }
    })
    .catch((err) => {});
};

// wareHouse ddl
export const getWareHouseDDLAction = (query) => (dispatch) => {
  requestFromServer
    .getWareHouseDDL(query)
    .then((res) => {
      if (res.status === 200) {
        dispatch(slice.SetWareHouseDDL(res.data));
      }
    })
    .catch((err) => {});
};

// getUomDDL
export const getUomDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getUomDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetUomDDL(res.data));
    }
  });
};

// getCountryDDL
export const getCountryDDLAction = () => (dispatch) => {
  requestFromServer.getCountryDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetCountryDDL(res.data));
    }
  });
};

// getPartnerDDL
export const getPartnerDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getPartnerDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPartnerDDL(res.data));
    }
  });
};

// getControllingUnitDDL
export const getControllingUnitDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getControllingUnitDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetControllingDDL(res.data));
    }
  });
};

// getSalesOfficeDDL by org id
export const getSalesOfficeDDLAction = (accId, buId, salesOrgId) => (
  dispatch
) => {
  requestFromServer.getSalesOfficeDDL(accId, buId, salesOrgId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSalesOfficeDDL(res.data));
    }
  });
};

// getSalesOrgDDL
export const getSalesOrgDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getSalesOrgDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSalesOrgDDL(res.data));
    }
  });
};

// getDistributionChannelDDL
export const getDistributionChannelDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getDistributionChannelDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetDistributionChannelDDL(res.data));
    }
  });
};

// supplier ddld
export const getSupplierDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getSupplierDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSupplierDDL(res.data));
    }
  });
};
export const getShippointDDLCommon_action = (userId, clientId, buId) => (
  dispatch
) => {
  requestFromServer
    .getShippointDDL(userId, clientId, buId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        const newData = res?.data.map((data) => {
          return {
            ...data,
            label: data?.organizationUnitReffName,
            value: data?.organizationUnitReffId,
            address: data?.address,
          };
        });
        dispatch(slice.SetShippointDDL(newData));
      }
    })
    .catch((err) => {
      dispatch(slice.SetShippointDDL([]));
    });
};

// getUomDDL
export const getUomDDLItemId_Action = (accId, buId, itemId, setFieldValue) => (
  dispatch
) => {
  requestFromServer.getuomDDLItemId(accId, buId, itemId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetUomDDL(res.data));
      setFieldValue && setFieldValue("uom", res.data[0] || "");
    }
  });
};
// getDownlloadFileView_Action
export const getDownlloadFileView_Action = (id, closeModal, cb, setLoading) => (
  dispatch
) => {
  setLoading && setLoading(true);
  requestFromServer
    .getDownlloadFileView(id)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        // console.log(res)
        const obj = {
          url: res?.config?.url,
          type: res?.headers?.["content-type"],
          model: closeModal ? false : true,
        };

        dispatch(slice.SetImageView(obj));
        cb && cb();
        setLoading && setLoading(false);
      }
    })
    .catch((err) => {
      setLoading && setLoading(false);
    });
};

// getDownlloadFileView_Action
export const setDownlloadFileViewEmpty = () => async (dispatch) => {
  return dispatch(slice.SetDownlloadFileViewEmpty());
};
export const setSerialPortAction = (payload) => (dispatch) => {
  return dispatch(slice.setSerialPort(payload));
};
export const getOID_Action = (empId) => (dispatch) => {
  requestFromServer.getYIDByEnrollId(empId).then((res) => {
    dispatch(slice.setOID(res.data?.[0]?.yid));
  });
};

// action getGenerateExcelDataFormat_Action
export const getGenerateExcelDataFormat_Action = (payload) => () => {
  return requestFromServer
    .getGenerateExcelDataFormat(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `hello.xlsx`);
        document.body.appendChild(link);
        link.click();
      }
    })
    .catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
    });
};

// getMultipleFileView_Action
export const getMultipleFileView_Action = (ids) => (dispatch) => {
  const obj = {
    url: ids,
    type: "",
    model: true,
  };
  dispatch(slice.SetMultipleImageView(obj));
};
export const getMultipleFileViewEmpty = (ids) => (dispatch) => {
  const obj = {
    url: [],
    type: "",
    model: false,
  };
  dispatch(slice.SetMultipleImageView(obj));
};

export const createERPUserInfoAcion = (payload) => (dispatch) => {
  requestFromServer
    .createERPUserInfo(payload)
    .then((res) => {
      // if (res.status === 200) {
      //   toast.success(res.data?.message || "Submitted successfully");
      // }
    })
    .catch((err) => {
      console.log(err);
    });
};
