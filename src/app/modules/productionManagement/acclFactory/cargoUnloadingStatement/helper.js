import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";
import * as Yup from "yup";
export const onCreateOrEditCargoUnloadingStatement = (
  setFieldValue,
  profileData,
  selectedBusinessUnit,
  id,
  viewType,
  selectedRawMaterial,
  setSelectedRawMaterial,
  values,
  createHandler,
  cb
) => {
  let rowFullFilled = true;
  if (!values?.lighterVessel) {
    setFieldValue("lighterVesselError", "Lighter Vessel is required");
    return;
  }
  if (selectedRawMaterial?.length < 1) {
    rowFullFilled = false;
    toast.warn("Please add some raw metarial");
  }
  const modifiedSelectedRawMaterial = selectedRawMaterial.map((item) => {
    if (!item?.quantity) {
      rowFullFilled = false;
      item.quantityError = "Quantity is required";
    }
    if (item?.quantity && +item?.quantity < 1) {
      rowFullFilled = false;
      item.quantityError = "Quantity should be greater than zero";
    }
    if (!item?.poNo && viewType !== null) {
      rowFullFilled = false;
      item.poNoError = "PO Number is required";
    }
    if (!item?.lcNo && viewType !== null) {
      rowFullFilled = false;
      item.lcNoError = "LC Number is required";
    }

    return item;
  });
  if (!rowFullFilled) {
    setSelectedRawMaterial(modifiedSelectedRawMaterial);
    return;
  }
  const rawMaterialRowPayload = selectedRawMaterial.map((item) => ({
    rowId: item?.rowId || 0,
    cargoUnloadingStatementId: id ? item?.cargoUnloadingStatementId || +id : 0,
    rawMaterialId: item?.value,
    rawMaterialName: item?.label,
    quantity: +item?.quantity,
    poid: item?.poNo?.value || 0,
    ponumber: item?.poNo?.label || "",
    lcid: item?.lcNo?.value || 0,
    lcnumber: item?.lcNo?.label || "",
    uoMName: item?.uoM,
    uomId: item?.uoMId,
    isActive: true,
  }));
  createHandler(
    `/mes/MSIL/CreateAndEditCargoUnloadingStatement`,

    {
      intCargoUnloadingStatementId: +id || 0,
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intPoid: values?.poNo?.value || 0,
      strPonumber: values?.poNo?.label || "",
      intLcid: values?.lcNo?.value || 0,
      strLcnumber: values?.lcNo?.label || "",
      dteReceiveDate: values?.receiveDTime?.split("T")[0] || null,
      tmReceiveTime: values?.receiveDTime?.split("T")[1] || null,
      dteStartDate: values?.startDTime?.split("T")[0] || null,
      tmStartTime: values?.startDTime?.split("T")[1] || null,
      dteEndDate: values?.endDTime?.split("T")[0] || null,
      tmEndTime: values?.endDTime?.split("T")[1] || null,
      intVesselId: 0,
      strVesselName: values?.motherVessel || "",
      intLighterVesselId: values?.lighterVessel?.value || 0,
      strLighterVesselName:
        values?.lighterVessel?.label || values?.lighterVessel || "",
      numBnquantity: +values?.bnQyt || 0,
      strUoM: values?.uom || "",
      strMobileNumber: values?.mobileNo || "",
      intNumberOfHatch: +values?.hatchNo || 0,
      strCountryOfOrigin: values?.coo || "",
      strSurveyNumber: values?.surveyNo || "",
      numSurveyQuantity: +values?.surveyQty || 0,
      intRawMaterialId: values?.rawMaterialName?.value || 0,
      strRawMaterialName: values?.rawMaterialName?.label || "",
      strRemarks: values?.remarks || "",
      strUnloadType:
        viewType === 1
          ? "Own Lighter Vessel"
          : viewType === 0
          ? "Others"
          : "Loan",
      isOwnLighterVessel: viewType,
      isActive: true,
      intCreatedBy: id ? 0 : profileData?.userId,
      dteCreatedDate: _todayDate(),
      intUpdatedBy: id ? profileData?.userId : 0,
      dteUpdatedDate: _todayDate(),
      row: rawMaterialRowPayload,
    },
    cb,
    true
  );
};

export const renitializeCargoUnloadingState = (
  setModifyData,
  setSelectedRawMaterial,
  id,
  getCargoUnloadingStatementById
) => {
  getCargoUnloadingStatementById(
    `/mes/MSIL/GetCargoUnloadingStatementById?intCargoUnloadingStatementId=${id}`,
    (data) => {
      const { objHeader, objRow } = data;
      setModifyData({
        lighterVessel:
          objHeader?.isOwnLighterVessel === 1
            ? objHeader?.intLighterVesselId && objHeader?.strLighterVesselName
              ? {
                  value: objHeader?.intLighterVesselId,
                  label: objHeader?.strLighterVesselName,
                }
              : ""
            : objHeader?.strLighterVesselName || "",
        motherVessel: objHeader?.strVesselName || "",
        mobileNo: objHeader?.strMobileNumber || "",
        bnQyt: objHeader?.numBnquantity || "",
        surveyQty: objHeader?.numSurveyQuantity || "",
        surveyNo: objHeader?.strSurveyNumber || "",

        receiveDTime:
          `${_dateFormatter(objHeader?.dteReceiveDate)}T${
            objHeader?.tmReceiveTime
          }` || "",
        startDTime:
          objHeader?.dteStartDate && objHeader?.tmStartTime
            ? `${_dateFormatter(objHeader?.dteStartDate)}T${
                objHeader?.tmStartTime
              }`
            : "",
        endDTime:
          objHeader?.dteEndDate && objHeader?.tmEndTime
            ? `${_dateFormatter(objHeader?.dteEndDate)}T${objHeader?.tmEndTime}`
            : "",

        hatchNo: objHeader?.intNumberOfHatch || "",
        coo: objHeader?.strCountryOfOrigin || "",
        remarks: objHeader?.strRemarks || "",
      });
      let modifiedRow = [];
      objRow.forEach((item) => {
        const modifiedRowObj = {
          rowId: item?.rowId,
          cargoUnloadingStatementId: item?.cargoUnloadingStatementId,
          value: item?.rawMaterialId,
          label: item?.rawMaterialName,
          quantity: `${item?.quantity || ""}`,
          poNo: item?.ponumber
            ? {
                value: item?.poid,
                label: item?.ponumber,
              }
            : "",

          lcNo: item?.lcnumber
            ? {
                value: item?.lcid,
                label: item?.lcnumber,
              }
            : "",

          uoM: item?.uoMName,
          uoMId: item?.uomId,
        };
        modifiedRow.push(modifiedRowObj);
      });
      setSelectedRawMaterial(modifiedRow);
    }
  );
};

export const loadPoListForCargoUnloading = (
  v,
  profileData,
  selectedBusinessUnit
) => {
  if (v?.length < 3) return [];
  return axios
    .get(
      `/mes/MSIL/GetPoDDL?intAccountId=${profileData?.accountId}&intBusinessUnitId=${selectedBusinessUnit?.value}&search=${v}`
    )
    .then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
      }));
      return updateList;
    });
};

export const getCargoUnloadingStatementInitialData = () => {
  const initData = {
    lighterVessel: "",
    lighterVesselError: null,
    motherVessel: "",
    mobileNo: "",
    bnQyt: "",
    surveyQty: "",
    surveyNo: "",
    receiveDTime: "",
    startDTime: "",
    endDTime: "",
    lcNo: "",
    hatchNo: "",
    coo: "",
    remarks: "",
    rawMetarialItem: null,
  };
  return initData;
};

export const getCargoUnloadingStatementValidationSchema = () => {
  const validationSchema = Yup.object().shape({
    mobileNo: Yup.string()
      .required("Mobile Number is required")
      .typeError("Mobile Number is required"),
  });
  return validationSchema;
};
