import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";
import * as Yup from "yup";
export const onUnloadingRegister = (
  createHandler,
  values,
  selectedRawMaterial,
  setSelectedRawMaterial,
  id,
  profileData,
  selectedBusinessUnit,
  cb
) => {
  let rowFullFilled = true;
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
    uoMName: item?.uoM,
    uomId: item?.uoMId,
    isActive: true,
  }));
  createHandler(
    `/mes/MSIL/CreateAndEditCargoUnloadingStatement`,

    {
      intCargoUnloadingStatementId: id ? +id : 0,
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      dteStartDate: values?.startDTime?.split("T")[0] || null,
      tmStartTime: values?.startDTime?.split("T")[1] || null,
      dteEndDate: values?.endDTime?.split("T")[0] || null,
      tmEndTime: values?.endDTime?.split("T")[1] || null,
      intLighterVesselId: values?.lighterVessel?.value || 0,
      strLighterVesselName:
        values?.lighterVessel?.label || values?.lighterVessel || "",
      strUoM: values?.uom || "",
      intUnloadingPointId: values?.unloadPoint?.value || 0,
      strUnloadingPointName: values?.unloadPoint?.label || "",
      intRawMaterialId: values?.rawMaterialName?.value || 0,
      strRawMaterialName: values?.rawMaterialName?.label || "",
      strRemarks: values?.remarks || "",
      intRegisteredLighterVesselId: values?.lighterVessel?.value || 0,
      strRegisteredLighterVesselName: values?.lighterVessel?.label || "",
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

export const onGetUnloadingRegister = (
  id,
  getCargoUnloadingStatementById,
  setModifyData,
  setSelectedRawMaterial
) => {
  getCargoUnloadingStatementById(
    `/mes/MSIL/GetCargoUnloadingStatementById?intCargoUnloadingStatementId=${id}`,
    (data) => {
      const { objHeader, objRow } = data;
      setModifyData({
        lighterVessel:
          objHeader?.intLighterVesselId && objHeader?.strLighterVesselName
            ? {
                value: objHeader?.intLighterVesselId,
                label: objHeader?.strLighterVesselName,
              }
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
        unloadPoint: {
          value: objHeader?.intUnloadingPointId,
          label: objHeader?.strUnloadingPointName,
        },
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
          uoM: item?.uoMName,
          uoMId: item?.uomId,
        };
        modifiedRow.push(modifiedRowObj);
      });
      setSelectedRawMaterial(modifiedRow);
    }
  );
};

export const unloadingRegisterValidationSchema = ({ isOwnLighterVessel }) => {
  const validationSchema = Yup.object().shape({
    lighterVessel: isOwnLighterVessel
      ? Yup.object()
          .shape({
            label: Yup.string()
              .required("Lighter Vessel is required")
              .typeError("Lighter Vessel is required"),
            value: Yup.number()
              .min(1, "Invalid Ligher Vessel")
              .required("Lighter Vessel is required")
              .typeError("Lighter Vessel is required"),
          })
          .required("Lighter Vessel is required")
          .typeError("Lighter Vessel is required")
      : Yup.string()
          .required("Lighter Vessel is required")
          .typeError("Lighter Vessel is required"),

    unloadPoint: Yup.object()
      .shape({
        label: Yup.string()
          .required("Unloading Point is required")
          .typeError("Unloading Point is required"),
        value: Yup.number()
          .required("Unloading Point is required")
          .typeError("Unloading Point is required"),
      })
      .required("Unloading Point is required")
      .typeError("Unloading Point is required"),
  });
  return validationSchema;
};

export const breakdownTypeDDLForCraneStopageDetails = [
  {
    label: "Electrical",
    value: 1,
  },
  {
    label: "Mechanical",
    value: 2,
  },
  {
    label: "Electrical & Mechanical,",
    value: 3,
  },
  {
    label: "labour Strike",
    value: 4,
  },
  {
    label: "Power Problem",
    value: 5,
  },
];
export const craneNameDDLForCraneStopageDetails = [
  {
    label: "Crane-1 (700 Series)",
    value: 1,
  },
  {
    label: "Crane-2 (1500 Series)",
    value: 2,
  },
];

export const onGetCraneStopageDetailsLanding = ({
  getCranStopageDetailsLanding,
  accountId,
  businessUnitId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  search,
}) => {
  getCranStopageDetailsLanding(
    `/mes/MSIL/CraneStopageDetailsLandingPagination?accountId=${accountId}&businessUnitId=${businessUnitId}${
      search ? `&search=${search}` : ""
    }&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}`
  );
};

export const onCreateOrEditCraneStopageDetails = ({
  accountId,
  businessUnitId,
  userId,
  createCraneStopesDetails,
  formValues,
  cb = () => {},
}) => {
  const payload = {
    craneStopageId: formValues?.id || 0,
    accountId: accountId,
    businessUnitId,
    entryDate: formValues?.date,
    shiftId: formValues?.shift?.value,
    craneId: formValues?.craneName?.value,
    craneName: formValues?.craneName?.label,
    breakdownTypeId: formValues?.breakdownType?.value,
    breakdownTypeName: formValues?.breakdownType?.label,
    duration: +formValues?.duration,
    stopesDetails: formValues?.stopageDetails,
    isActive: true,
    createdAt: formValues?.createdAt || _todayDate(),
    createdBy: formValues?.createdBy || userId,
    updatedAt: formValues?.id ? _todayDate() : "",
    updatedBy: formValues?.id ? userId : 0,
  };
  createCraneStopesDetails(
    `mes/MSIL/SaveCraneStopageDetails`,
    payload,
    () => {
      cb();
    },
    true
  );
};
