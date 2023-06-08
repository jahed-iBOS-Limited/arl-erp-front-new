/* eslint-disable eqeqeq */
// update price structure when user changes order qty and basic price
import axios from "axios";
import Axios from "axios";
import { isArray } from "lodash-es";
import { toast } from "react-toastify";

export const lastPriceFunc = (arr) => {
  if (!isArray(arr)) return 0;

  if (arr.length < 1) return 0;
  let newData = arr.map((item) => item?.lastPrice);
  let lastPrice = Math.min.apply(null, newData);
  if (lastPrice === Infinity) return 0;
  return (lastPrice || 0).toFixed(2);
};

export const updatePriceStructure = (
  orderQty,
  basicPrice,
  rowDto,
  setRowDto,
  currentIndex
) => {
  const data = rowDto[currentIndex]?.priceStructure;
  if (!data) return;
  data[0].value = orderQty * basicPrice;
  data[0].amount = orderQty * basicPrice;
  data.forEach((item, index) => {
    if (item?.baseComponentId === -1 && index > 0) {
      // find sum from and sum to value
      // let sumObj = findSumFromAndSumTo(
      //   data,
      //   item?.sumFromSerial,
      //   item?.sumToSerial
      // );

      // update value and amount

      item?.mannual === false &&
        (data[index].value = findSumFromAndSumTo(
          data,
          item?.sumFromSerial,
          item?.sumToSerial
        ));
      data[index].amount = findSumFromAndSumTo(
        data,
        item?.sumFromSerial,
        item?.sumToSerial
      );
    } else if (item?.baseComponentId >= 1 && index > 0) {
      // find baseComponent value by id,
      let baseComponentValue = findPriceComponentId(
        data,
        item?.baseComponentId
      );

      let currentValue = item?.value;

      if (item?.valueType === "amount") {
        item?.mannual === false && (data[index].value = +currentValue);
        data[index].amount = data[index].factor * +currentValue;
      } else {
        let percentageValue = (baseComponentValue * currentValue) / 100;

        item?.mannual === false && (data[index].value = +percentageValue);
        data[index].amount = data[index].factor * +percentageValue;
      }
    }

    let newData = [...rowDto];
    newData[currentIndex].priceStructure = data;
    newData[currentIndex].netValue = data[data?.length - 1]?.value;
    setRowDto(newData);
  });
};

export const updateCalculatedValueForPriceStructureModal = (
  priceStructureData,
  setter
) => {
  const newData = [...priceStructureData];
  newData &&
    newData.forEach((item, index) => {
      if (item?.baseComponentId === -1 && index > 0) {
        // find sum from and sum to value
        // let sumObj = findSumFromAndSumTo(
        //   newData,
        //   item?.sumFromSerial,
        //   item?.sumToSerial
        // );

        item?.mannual === false &&
          (newData[index].value = findSumFromAndSumTo(
            newData,
            item?.sumFromSerial,
            item?.sumToSerial
          ));
        newData[index].amount = findSumFromAndSumTo(
          newData,
          item?.sumFromSerial,
          item?.sumToSerial
        );
      } else if (item?.baseComponentId >= 1 && index > 0) {
        // find baseComponent value by id,

        let baseComponentValue = findPriceComponentId(
          newData,
          item?.baseComponentId
        );

        let currentValue = item?.value;

        if (item?.valueType === "amount") {
          item?.mannual === false && (newData[index].value = +currentValue);
          newData[index].amount = newData[index].factor * +currentValue;
        } else {
          let percentageValue = (baseComponentValue * currentValue) / 100;

          item?.mannual === false && (newData[index].value = +percentageValue);
          newData[index].amount = newData[index].factor * +percentageValue;
        }
      }
    });
  setter(newData);
};

// find priceComponentId and return that value
export const findPriceComponentId = (priceStructureData, id) => {
  let value = 0;
  priceStructureData &&
    priceStructureData.forEach((item) => {
      if (item?.priceComponentId === id) {
        value = item?.value;
      }
    });
  return value;
};

// find sumFrom and SumTo value
export const findSumFromAndSumTo = (priceStructureData, sumFromSl, sumToSl) => {
  const sumFromAndSumToArr = priceStructureData?.filter(
    (item) => item.serialNo >= sumFromSl && item.serialNo <= sumToSl
  );

  let sumFromAndSumToTotal = 0;

  sumFromAndSumToArr &&
    sumFromAndSumToArr.forEach((item) => {
      // find base component value
      let baseComponentValue = findPriceComponentId(
        priceStructureData,
        item?.baseComponentId
      );

      let currentValue = item?.value;

      if (item?.valueType === "amount") {
        sumFromAndSumToTotal =
          item?.factor === 1
            ? sumFromAndSumToTotal + +currentValue
            : sumFromAndSumToTotal - currentValue;
      } else {
        sumFromAndSumToTotal =
          item?.factor === 1
            ? sumFromAndSumToTotal + (baseComponentValue * currentValue) / 100
            : sumFromAndSumToTotal - (baseComponentValue * currentValue) / 100;
      }
    });
  return sumFromAndSumToTotal;
};

export const calculateNetValue = (
  updatedDataPriceStructureData,
  rowDto,
  rowDtoCurrentIndex,
  setRowDto
) => {
  const xData = [...rowDto];

  xData[rowDtoCurrentIndex].netValue =
    updatedDataPriceStructureData[
      updatedDataPriceStructureData?.length - 1
    ]?.value;
  setRowDto(xData);
};

export const getUOMList = async (itemId, buId, accId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemPlantWarehouse/GetItemUomconversionData?ItemId=${itemId}&BusinessUnitId=${buId}&AccountId=${accId}`
    );
    const data = res?.data?.convertedList;
    const newData = data?.map((item) => {
      return {
        value: item?.value,
        label: item?.label,
      };
    });
    setter(newData);
  } catch (error) {}
};

export const getUniQueItems = (arr, rowDto, values) => {
  // get new items that not exit in rowdto
  const refferenceItems = arr?.filter((item) => {
    // check single item already added or not
    const isExist = rowDto.findIndex(
      (row) =>
        row?.item?.value === item?.value &&
        row?.referenceNo?.value === values?.referenceNo?.value
    );
    // only return new items
    if (isExist === -1) {
      return true;
    } else {
      return false;
    }
  });

  return refferenceItems;
};

export const getRefNoDdlBySupplier = async (
  orderTypeId,
  supplierId,
  accId,
  buId,
  sbuId,
  orgId,
  plantId,
  whId,
  refTypId,
  setter
) => {
  try {
    const res = await Axios.get(
      //`/procurement/PurchaseOrder/GetPOReferenceNoDDL?OrderTypeId=${orderTypeId}&PartnerId=${supplierId}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plantId}&WarehouseId=${whId}&RefTypeId=${refTypId}`
      `/procurement/PurchaseOrder/GetPOReferenceNoDDL?OrderTypeId=${orderTypeId}&PartnerId=${supplierId}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PurchaseOrgId=${orgId}&PlantId=${plantId}&WarehouseId=${whId}&RefTypeId=${refTypId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getRefNoDdlBySupplierForReturn = async (
  orderTypeId,
  supplierId,
  accId,
  buId,
  sbuId,
  orgId,
  plantId,
  whId,
  refTypId,
  setter
) => {
  try {
    const res = await Axios.get(
      //`/procurement/PurchaseOrder/GetPOReferenceNoDDL?OrderTypeId=${orderTypeId}&PartnerId=${supplierId}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plantId}&WarehouseId=${whId}&RefTypeId=${refTypId}`
      `/procurement/PurchaseOrder/GetPOReferenceNoDDL?OrderTypeId=${orderTypeId}&PartnerId=${supplierId}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PurchaseOrgId=${orgId}&PlantId=${plantId}&WarehouseId=${whId}&RefTypeId=${refTypId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getReportPurchaseOrder = async (poId, orId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPurchaseOrderInformationByPOtoPrint_Id?PurchaseOrderId=${poId}&OrderTypeId=${orId}`
    );
    setter(res?.data[0]);
  } catch (error) {}
};

export const getReportPurchaseOrderForShipping = async (poId, orId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPurchaseOrderInformationByPOtoPrint_Id_Shipping?PurchaseOrderId=${poId}&OrderTypeId=${orId}`
    );
    setter(res?.data[0]);
  } catch (error) {}
};

function MailSender(parameterName, valueArr) {
  if(parameterName === "SendTo" && valueArr?.length > 0) {
     const queryArr = valueArr.map(value => parameterName + "=" + value);
        return queryArr.join("&");
  }else{
     return (parameterName + "=" + [] )
  }
}

function toCCMailSend(parameterName, valueArr) {
  if(parameterName === "SendToCC" && valueArr?.length > 0 ) {
     const queryArr = valueArr.map(value => parameterName + "=" + value);
        return queryArr.join("&");   
  }else{
     console.log("parameterName",parameterName + "=" + [] + "&")
     return (parameterName + "=" + [] )
  }
}

function toBCCMailSend(parameterName, valueArr) {
  if(parameterName === "SendToBCC" && valueArr?.length > 0 ) {
     const queryArr = valueArr.map(value => parameterName + "=" + value);
        return queryArr.join("&");
  }else{
     return (parameterName + "=" + [])
  }
}

export const sendEmailPostApi = async (values, setLoading) => {
  //const checkMail = Array.isArray(values?.toMail)
  const toMail = values?.toMail === "" ? [] : values?.toMail?.split(",");
  const sendCCMail = values?.toCC === "" ? [] : values?.toCC?.split(",");

  const checkBCCMail = Array.isArray(values?.toBCC);
  let sendBCCMail = [];
  if (!checkBCCMail) {
    sendBCCMail = values?.toBCC === "" ? [] : values?.toBCC?.split(",");
  }
  let formData = new FormData();
  formData.append("file", values?.attachment);
  setLoading && setLoading(true);
  try {
    let res = await axios.post(
      `/procurement/ShipRequestForQuotation/SendEMailWithAttachment?${MailSender("SendTo", toMail)}&${toCCMailSend("SendToCC",sendCCMail)}&${toBCCMailSend("SendToBCC",sendBCCMail)}&MailSubject=${values?.subject || ""}&MailBody=${values?.message || ""}`, formData );

   toast.success('Mail Send Successfully');
   setLoading && setLoading(false);
   return res;
  } catch (error) {
    setLoading && setLoading(false);
    toast.error(
      error?.response?.data?.message || "Mail cant not send successfully"
    );
  }
};

export const postPoApprovalLandingDataAction = async (
  POId,
  POorderTypeID,
  refTypeId
) => {
  try {
    const res = await Axios.put(
      `/procurement/PurchaseOrder/PurchaseOrderClose?PurchaseOrderId=${POId}`
    );
    if (res.status === 200) {
      //setter(res?.data);
      toast.success("Cancel Successfully");
      //setLoading(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Cancel Failed");
  }
};

export const checkTwoFactorApproval = async (
  otpType,
  unitId,
  transectionType,
  transectionId,
  journalCode,
  actionById,
  strOTP,
  cancelType,
  setDisabledModalButton,
  cb
) => {
  try {
    setDisabledModalButton(true);
    const res = await Axios.get(
      `/fino/CommonFino/CheckTwoFactorApproval?OtpType=${otpType}&intUnitId=${unitId}&strTransectionType=${transectionType}&intTransectionId=${transectionId}&strCode=${journalCode}&intActionById=${actionById}&strOTP=${strOTP}&CancelType=${cancelType}`
    );
    // setFieldValue("instrumentNo",res?.data?.code)
    if (res?.data?.status === 1) {
      toast.success(res?.data?.message);
      cb(res?.data?.status);
    } else {
      toast.error(res?.data?.message);
      cb();
    }
    setDisabledModalButton(false);
    // toast.success("Submitted successfully");
  } catch (error) {
    setDisabledModalButton(false);
    // toast.warn(error?.response?.data?.message);
    // setDisabled(false);
  }
};

export const getInventoryReceiveReportDetails = async (
  accId,
  buId,
  poId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/procurement/Report/GetInventoryReceiveReportDetails?accountId=${accId}&businessUnitId=${buId}&poId=${poId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};
export const getBillRegisterByPo = async (poId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/PaymentRequest/BillRegisterByPo?PoId=${poId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};
export const getActivityCounter = async (buId, activityId, userId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/Activity/ActivityCounter?businessUnitId=${buId}&activityId=${activityId}&userId=${userId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};
