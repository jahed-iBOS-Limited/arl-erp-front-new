import * as requestFromServer from "./Api";
import { invTransactionSlice } from "./Slice";
import { toast } from "react-toastify";
import { setLastInvDataAction } from "../../../../_helper/reduxForLocalStorage/Actions";
const { actions: slice } = invTransactionSlice;

export const getGridDataAction = (
  fromDate,
  toDate,
  grId,
  accId,
  buId,
  sbuId,
  plId,
  wrId,
  setLoading,
  pageNo,
  pageSize,
  search
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(
      fromDate,
      toDate,
      grId,
      accId,
      buId,
      sbuId,
      plId,
      wrId,
      pageNo,
      pageSize,
      search
    )
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        setLoading(false);
        dispatch(slice.setGridDataDDL(data));
      }
    })
    .catch((err) => {
      setLoading(false);
    });
};

// inventory transaction save created data
export const saveInventoryTransactionOrder = (
  payload,
  setRowDto,
  setDisabled,
  setFileObjects,
  IConfirmModal
) => async (dispatch) => {
  setDisabled(true);
  try {
    let { data } = await requestFromServer.saveCreateData(payload.data);
    //toast.success(data?.message || "Submitted successfully");
    setRowDto([]);
    payload.cb();
    const obj = {
      title: data?.message,
      noAlertFunc: () => {
        //window.location.reload();
      },
    };
    IConfirmModal(obj);
    dispatch(setLastInvDataAction(data?.message));
    setFileObjects([]);
    setDisabled(false);
  } catch (err) {
    setDisabled(false);
    toast.error(err?.response?.data?.message);
  }
  // let formData = new FormData();
  // formData.append("files", attachment[0]);
  // requestFromServer
  //   .attachmentSave(formData)
  //   .then((res) => {
  //     console.log(res.response?.data[0]?.fileName);
  //     return requestFromServer
  //       .saveCreateData(payload.data)
  //       .then((res) => {
  //         if (res.status === 200) {
  //           toast.success(res.data?.message || "Submitted successfully");
  //           setRowDto([]);
  //           payload.cb();
  //         }
  //       })
  //       .catch((err) => {
  //
  //         toast.error(err?.response?.data?.message);
  //       });
  //   })
  //   .catch((err) => {
  //
  //     toast.error(err?.response?.data?.message);
  //   });
};

export const attachment_action = (attachment) => async () => {
  try {
    let formData = new FormData();
    formData.append("files", attachment[0]);
    let { data } = await requestFromServer.attachmentSave(formData);
    //toast.success("Upload  successfully");
    console.log(data);
    return data;
  } catch (err) {
    toast.error(err?.response?.data?.message);
  }
};

// inventory transaction save created data for issue Inventory
export const saveInventoryTransactionForIssue = (
  payload,
  setRowDto,
  setDisabled
) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateDataforIssue(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setRowDto([]);
        payload.cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};

// inventory transaction save created data for issue Inventory
export const saveInventoryTransactionForPurchaseReturn = (
  payload,
  setRowDto,
  setDisabled
) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateDataforpurchaseReturn(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setRowDto([]);
        payload.cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};

// inventory transaction save created data for Transfer Inv
export const saveInventoryTransactionForTransferInv = (
  payload,
  setRowDto,
  setDisabled
) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateDataforTransfer(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setRowDto([]);
        payload.cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};

// inventory transaction save created data for Release Inventory
export const saveInventoryTransactionForReleaseInv = (
  payload,
  setRowDto,
  setDisabled
) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateDataforRelease(payload.data)
    .then((res) => {
      if (res.data.statuscode === 401) {
        setDisabled(false);
        return toast.warning(res?.data?.message, "Item not found");
      }
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setRowDto([]);
        payload.cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};

// inventory transaction save created data for Release Inventory
export const saveInventoryTransactionForRemoveInventory = (
  payload,
  setRowDto,
  setDisabled
) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateDataforRemove(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setRowDto([]);
        payload.cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};

// inventory transaction save created data for Adjust Inventory
export const saveInventoryTransactionForAdjustInv = (
  payload,
  setRowDto,
  setDisabled
) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateDataforAdjustInv(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setRowDto([]);
        payload.cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};

// inventory transaction save created data for Adjust Inventory
export const saveInventoryTransactionForCancelInv = (
  payload,
  setRowDto,
  setTransaType,
  setDisabled
) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateDataforInvPosting(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setRowDto([]);
        setTransaType("");
        payload.cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};

// inventory transaction save created data for Transfer Inventory
export const saveInventoryTransactionForTransferInternal = (
  payload,
  setRowDto,
  setDisabled
) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateDataforInternalTransfer(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setRowDto([]);
        payload.cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};

// inventory transaction

export const getreferenceTypeDDLAction = (id) => (dispatch) => {
  return requestFromServer.getreferenceTypeDDL(id).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setreferenceTypeDDL(data));
    }
  });
};

export const getreferenceNoDDLAction = (
  refTNm,
  accId,
  buId,
  sbuId,
  plId,
  whId
) => (dispatch) => {
  return requestFromServer
    .getreferenceNoDDL(refTNm, accId, buId, sbuId, plId, whId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setreferenceNoDDL(data));
      }
    });
};

// refference no for receive inv

export const getreferenceNoReceiveInvDDLAction = (
  refId,
  refTNm,
  accId,
  buId,
  sbuId,
  plId,
  whId,
  setFieldValue
) => (dispatch) => {
  return requestFromServer
    .getreferenceNoReceiveInvDDL(refId, refTNm, accId, buId, sbuId, plId, whId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        if (setFieldValue) {
          setFieldValue(
            "othersCharge",
            data.length > 0 ? data[0]["othersCharge"] : 0
          );
        }

        dispatch(slice.setreferenceNoDDL(data));
      }
    });
};

export const getreferenceNoForTransferInInvDDLAction = (
  refId,
  accId,
  buId,
  plId,
  whId
) => (dispatch) => {
  return requestFromServer
    .getreferenceNoTransferInvInvDDL(refId, accId, buId, plId, whId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setreferenceNoDDL(data));
      }
    });
};

//refference no for issue
export const getreferenceNoDDLActionforIssue = (
  refId,
  refTNm,
  accId,
  buId,
  plId,
  whId
) => (dispatch) => {
  return requestFromServer
    .getreferenceNoDDLForIssue(refId, refTNm, accId, buId, plId, whId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setreferenceNoDDL(data));
      }
    });
};

//refference no for return Deleviry
export const getreferenceNoDDLActionforreturnDeleviry = (
  refId,
  refTNm,
  accId,
  buId,
  sbuId,
  plId,
  whId
) => (dispatch) => {
  return requestFromServer
    .getreferenceNoDDLForReturnDeleviry(
      refId,
      refTNm,
      accId,
      buId,
      sbuId,
      plId,
      whId
    )
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setreferenceNoDDL(data));
      }
    });
};

//refference no for transfer inventory
export const getreferenceNoDDLActionforTransferInv = (
  refTNm,
  accId,
  buId,
  sbuId,
  plId,
  whId
) => (dispatch) => {
  return requestFromServer
    .getreferenceNoDDLForTransferInv(refTNm, accId, buId, sbuId, plId, whId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setreferenceNoDDL(data));
      }
    });
};

//refference no for release inventory
export const getreferenceNoDDLActionforReleaseInv = (
  refTNm,
  accId,
  buId,
  sbuId,
  plId,
  whId
) => (dispatch) => {
  return requestFromServer
    .getreferenceNoDDLForReleaseInv(refTNm, accId, buId, sbuId, plId, whId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setreferenceNoDDL(data));
      }
    });
};

//refference no for Cancel inventory
export const getreferenceNoDDLActionforCancelInv = (
  rfId,
  refTNm,
  accId,
  buId,
  sbuId,
  plId,
  whId
) => (dispatch) => {
  return requestFromServer
    .getreferenceNoDDLForCancelInv(rfId, refTNm, accId, buId, sbuId, plId, whId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setreferenceNoDDL(data));
      }
    });
};

export const getTransactionTypeDDLAction = (GrpId, refTId, setFieldValue) => (
  dispatch
) => {
  return requestFromServer.getTransactionTypeDDL(GrpId, refTId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      if (setFieldValue) {
        setFieldValue("transType", data[0]);
      }
      dispatch(slice.setTransactionTypeDDL(data));
    }
  });
};

//Transaction type for cancel inventory
export const getTransactionTypeforCancelInv = (refNoId) => (dispatch) => {
  return requestFromServer
    .getTransactionTypeDDLForCencelInv(refNoId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setTransactionTypeDDL(data));
      }
    });
};

export const getBusinessPartnerDDLAction = (GrpId, refTId) => (dispatch) => {
  return requestFromServer.getbusiPartnerDDL(GrpId, refTId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setbusinessPartDDL(data));
    }
  });
};

export const getpersonnelDDLAction = (GrpId, refTId) => (dispatch) => {
  return requestFromServer.getpersonelDDL(GrpId, refTId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      let newData = data.map((data) => {
        return {
          ...data,
          label: `${data?.label} [${data?.code}]`,
        };
      });
      dispatch(slice.setpersonelDDL(newData));
    }
  });
};

export const getItemDDLAction = (accId, buId, plId, whId) => (dispatch) => {
  return requestFromServer.getItemDDL(accId, buId, plId, whId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setItemDDL(data));
    }
  });
};

//get item for adjust inv
export const getItemAdjustInvDDLAction = (accId, buId, plId, whId) => (
  dispatch
) => {
  return requestFromServer
    .getAdjustInvItemDDL(accId, buId, plId, whId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setItemDDL(data));
      }
    });
};

//get item for adjust inv
export const getItemForTransferInvInInvDDLAction = (transId) => (dispatch) => {
  return requestFromServer.getTransferInInvItemDDL(transId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setItemDDL(data));
    }
  });
};

export const getItemDDLForWithoutRefAction = (accId, buId, plId, whId) => (
  dispatch
) => {
  return requestFromServer.getItemDDL(accId, buId, plId, whId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      let newdata = data?.map((data) => {
        return {
          ...data,
          label: data?.itemDetails,
        };
      });
      dispatch(slice.setItemDDL(newdata));
    }
  });
};

export const getItemDDLForInternalInvAction = (accId, buId, plId, whId) => (
  dispatch
) => {
  return requestFromServer
    .getItemForInternalDDL(accId, buId, plId, whId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        let newdata = data?.map((data) => {
          return {
            ...data,
            label: data?.itemDetails,
          };
        });
        dispatch(slice.setItemDDL(newdata));
      }
    });
};

export const getItemDDLForWithoutRefReceiveInvAction = (
  accId,
  buId,
  plId,
  whId,
  prId
) => (dispatch) => {
  return requestFromServer
    .getItemForWithoutRefDDLreceiveInv(accId, buId, plId, whId, prId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        let newdata = data?.map((data) => {
          return {
            ...data,
            label: data?.itemDetails,
          };
        });
        dispatch(slice.setItemDDL(newdata));
      }
    });
};

export const getCostCenterDDLAction = (accId, buId, sbuId) => (dispatch) => {
  return requestFromServer.getCostCenterDDL(accId, buId, sbuId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      let newData = data.map((data) => {
        return {
          value: data?.value,
          label: `${data.label},${data.code},${data.controllingUnitName}`,
        };
      });
      dispatch(slice.setCostCenterDDL(newData));
    }
  });
};

export const getprojectNameDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getProjectNameDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setProjectNameDDL(data));
    }
  });
};

export const getLocationTypeDDLAction = (accId, buId, plId, whId) => (
  dispatch
) => {
  return requestFromServer
    .getLocationTypeDDL(accId, buId, plId, whId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setLocationTypeDDL(data));
      }
    });
};

export const getLocationTypeDDLActionForInternalInv = (
  accId,
  buId,
  plId,
  whId,
  itemId,
  locId
) => (dispatch) => {
  return requestFromServer
    .getLocationTypeDDLForInternal(accId, buId, plId, whId, itemId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        let nuwLocation = data.filter((data) => data?.value !== locId);
        dispatch(slice.setLocationTypeDDL(nuwLocation));
      }
    });
};

export const getStockDDLAction = () => (dispatch) => {
  return requestFromServer.getStockDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setstockDDL(data));
    }
  });
};

export const getItemforReftypeAction = (refName, refNo) => (dispatch) => {
  return requestFromServer.getItemWithRefTypeDDL(refName, refNo).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setItemDDL(data));
    }
  });
};

export const getItemforCancelInvAction = (refId, refName, refNo) => (
  dispatch
) => {
  return requestFromServer
    .getItemWithCancelInvDDL(refId, refName, refNo)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setItemDDL(data));
      }
    });
};

export const getItemforReceiveInvAction = (refId, refName, refNo) => (
  dispatch
) => {
  return requestFromServer
    .getItemWithReceiveInvDDL(refId, refName, refNo)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setItemDDL(data));
      }
    });
};
export const getItemListForIssueReturnAction = (refNo) => (dispatch) => {
  return requestFromServer.getItemListForIssueReturnDDL(refNo).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setItemDDL(data));
    }
  });
};

//for foreign PO
export const getItemforReceiveInvForeignPOAction = (
  acId,
  buId,
  poId,
  shipId
) => (dispatch) => {
  return requestFromServer
    .getItemWithReceiveInvForeignDDL(acId, buId, poId, shipId)
    .then((res) => {
      const { status, data } = res;
      console.log("data",data);
      if (status === 200 && data) {
        let itemData = data.map((item) => {
          return {
            value: item?.intItemId,
            label: `${item?.strItemName} [${item?.strItemCode}]`,
            itemName: item?.strItemName,
            code: item?.strItemCode,
            baseUoMId: item?.intUoMId,
            baseUoMName: item?.strUoMName,
            refQty: item?.numOrderQty,
            restQty: item?.numRestQty,
            vatValue: item?.numVatAmount || 0,
            returnQty: item?.numReturnQty || 0,
            issueQty: item?.numIssueQty || 0,
            baseValue: item?.numBasePrice,
            locationddl: item?.locationddl,
            discount: item?.numDiscount,
            totalPOValue: item?.numTotalValue,
            intReferenceId: item?.intReferenceId,
            isSerialMaintain:item?.isSerialMaintain
          };
        });

        dispatch(slice.setItemDDL(itemData));
      }
    });
};

// Get item for return deleviry
export const getItemReturnInvAction = (refId, refName, refNo) => (dispatch) => {
  return requestFromServer
    .getItemWithReturnDeliveryDDL(refId, refName, refNo)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setItemDDL(data));
      }
    });
};

//get item for release Inv
export const getItemforReleaseInv = (accId, buId, refId, sbuId, plId, whId) => (
  dispatch
) => {
  return requestFromServer
    .getItemForReleaseInv(accId, buId, refId, sbuId, plId, whId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setItemDDL(data));
      }
    });
};

//get item for remove Inv
export const getItemforRemoveInv = (accId, buId, plId, whId, transName) => (
  dispatch
) => {
  return requestFromServer
    .getItemForRemoveInv(accId, buId, plId, whId, transName)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        let newDta = data?.map((data) => {
          return {
            ...data,
            label: data?.labelCodeLocation,
          };
        });
        dispatch(slice.setItemDDL(newDta));
      }
    });
};

//get item for transfer Inv
export const getItemforTransferInv = (
  accId,
  buId,
  fromplId,
  fromwhId,
  toPlId,
  toWhId
) => (dispatch) => {
  return requestFromServer
    .getItemForTransferInv(accId, buId, fromplId, fromwhId, toPlId, toWhId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setItemDDL(data));
      }
    });
};

//get item for issue Inv
export const getItemforIssueInv = (refId, refName, refNo) => (dispatch) => {
  return requestFromServer
    .getItemForIssue(refId, refName, refNo)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        let newdata = data?.map((data) => {
          return {
            ...data,
            label: `${data?.label} [${data?.code}]`,
          };
        });
        dispatch(slice.setItemDDL(newdata));
      }
    });
};

export const getSingleDataAction = (id) => (dispatch) => {
  return requestFromServer.getSingleDDL(id).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setSingleDDL(data));
    }
  });
};

export const getBusinessTransactionDDLAction = (id) => (dispatch) => {
  return requestFromServer.getBusinessTransactionDDL(id).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setBusinessTransactionDDL(data));
    }
  });
};

export const getSingleDataForShowAction = (
  accId,
  buId,
  sbuId,
  plId,
  wrId,
  id
) => (dispatch) => {
  return requestFromServer
    .getGridData(accId, buId, sbuId, plId, wrId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        let newData = data.filter((data) => data.inventoryTransactionId === id);
        dispatch(slice.setGridDataDDL(newData));
      }
    });
};

// export const saveInventoryTransactionOrder = (
//   payload,
//   setRowDto,
//   attachment
// ) => () => {
//   let formData = new FormData();
//   formData.append("files", attachment[0]);
//   requestFromServer
//     .attachmentSave(formData)
//     .then((res) => {
//       console.log(res.response?.data[0]?.fileName);
//       return requestFromServer
//         .saveCreateData(payload.data)
//         .then((res) => {
//           if (res.status === 200) {
//             toast.success(res.data?.message || "Submitted successfully");
//             setRowDto([]);
//             payload.cb();
//           }
//         })
//         .catch((err) => {
//
//           toast.error(err?.response?.data?.message);
//         });
//     })
//     .catch((err) => {
//
//       toast.error(err?.response?.data?.message);
//     });
// };
