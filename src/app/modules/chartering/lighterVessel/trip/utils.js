import moment from "moment";
import * as Yup from "yup";
import { getDifference } from "../../_chartinghelper/_getDateDiff";
import { updateOilRateApi } from "./helper";

// Validation schema For Trip Create
export const validationSchemaTripCreate = Yup.object().shape({
  lighterVessel: Yup.object().shape({
    label: Yup.string().required("Lighter Vessel is required"),
    value: Yup.string().required("Lighter Vessel is required"),
  }),
  vesselType :Yup.object().shape({
    label: Yup.string().required("Vessel Type is required"),
    value: Yup.string().required("Vessel Type is required")
  }),
  loadPort: Yup.object().shape({
    label: Yup.string().required("Load Port is required"),
    value: Yup.string().required("Load Port is required"),
  }),

  dteTripCommencedDate: Yup.string().required("Field is required"),
  // dteTripCompletionDate: Yup.string().required("Field is required"),
  // numTotalTripDuration: Yup.string().required("Field is required"),
});

export const rateUpdateModalHandler = async (
  values,
  setRateUpdateModal,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  const arr = [
    {
      oilRateId: values?.numDiesel?.oilRateId,
      numOilRate: values?.numDiesel?.numOilRate,
    },
    {
      oilRateId: values?.numLub?.oilRateId,
      numOilRate: values?.numLub?.numOilRate,
    },
    {
      oilRateId: values?.numHydrolic?.oilRateId,
      numOilRate: values?.numHydrolic?.numOilRate,
    },
  ];

  for (let i = 0; i < 3; i++) {
    await updateOilRateApi(arr[i]);
  }

  setLoading && setLoading(false);
  setRateUpdateModal(false);
  cb();
};

export const calculateTotalExpense = (values) => {
  const totalOilCost =
    +values?.numDieselCost + +values?.numLubCost + +values?.numHydrolicCost;
  const otherCost =
    +values?.numPilotCoupon + +values?.numTripCost + +values?.numStoreExpense;

  return {
    totalOilCost: totalOilCost?.toFixed(2) || 0,
    otherCost: otherCost.toFixed(2) || 0,
    result: (+totalOilCost + +otherCost).toFixed(0) || 0,
  };
};

const RowDatasField = [
  { label: "motherVessel", type: "string" },
  { label: "voyageNo", type: "string" },
  { label: "srnumber", type: "string" },
  { label: "eta", type: "string" },
  { label: "numBlqty", type: "number" },
  { label: "consigneeParty", type: "string" },
  { label: "lcnumber", type: "string" },
  { label: "cargo", type: "string" },
  // { label: "numEstimatedCargoQty", type: "number" },
  { label: "numFreight", type: "number" },
  { label: "numActualCargoQty", type: "number" },
  { label: "numTotalFreight", type: "number" },
];

export const setOperationFieldClear = (setFieldValue) => {
  for (let item of RowDatasField) {
    if (item?.type === "string") {
      setFieldValue(item?.label, "");
    } else {
      setFieldValue(item?.label, 0);
    }
  }
};

export const editRowDataClick = (
  item,
  values,
  setValues,
  setEditMode,
  index
) => {
  const formikValuesPayload = {
    ...item,
    srnumber: item?.srnumber
      ? {
          label: item?.srnumber,
          value: item?.srnumber,
        }
      : "",
    motherVessel: item?.motherVesselId
      ? {
          value: item?.motherVesselId,
          label: item?.motherVesselName,
        }
      : "",
    voyageNo: item?.voyageId
      ? {
          value: item?.voyageId,
          label: item?.voyageNo,
        }
      : "",
    consigneeParty: item?.consigneePartyName
      ? {
          label: item?.consigneePartyName,
          value: item?.consigneePartyId,
        }
      : "",
    cargo: item?.cargoName
      ? {
          label: item?.cargoName,
          value: item?.cargoId,
        }
      : "",
    isEdit: true,
  };

  setValues({ ...values, ...formikValuesPayload });
  setEditMode({ mode: true, index, data: item });
};

export const removeRowData = (index, rowData, setRowData) => {
  const filterData = rowData.filter((_, i) => i !== index);
  setRowData(filterData);
};

export const rowDataAddHandler = (
  values,
  rowData,
  setRowData,
  setTouched,
  setErrors,
  setFieldValue
) => {
  if (addRowValidation(values, setTouched, setErrors)) return;

  // According to Jayant Bhai, the duplicate checks have been removed.

  // const filterDuplicates = rowData?.filter(
  //   (item) => item?.motherVesselId === values?.motherVessel?.value
  // );

  // if (filterDuplicates?.length > 0) {
  //   return toast.warning("Duplicate data not allowed", { toastId: 2345 });
  // }

  const payload = {
    rowId: 0,
    lighterTripId: 0,
    motherVesselId: values?.motherVessel?.value,
    motherVesselName: values?.motherVessel?.label,
    voyageId: 0,
    voyageNo: values?.voyageNo || "",
    srnumber: values?.srnumber?.label,
    eta: values?.eta,
    numBlqty: +values?.numBlqty,
    consigneePartyId: values?.consigneeParty?.value || 1,
    consigneePartyName: values?.consigneeParty?.label || "consigneePartyName",
    lcnumber: values?.lcnumber,
    cargoId: values?.cargo?.value || 1,
    cargoName: values?.cargo?.label || "cargoName",
    numEstimatedCargoQty: +values?.numEstimatedCargoQty,
    numFreight: +values?.numFreight,
    numActualCargoQty: +values?.numActualCargoQty,
    numTotalFreight: +values?.numTotalFreight,
    isEdit: false,
  };

  setRowData([...rowData, payload]);
  setFieldValue && setOperationFieldClear(setFieldValue);
};

/* Used in > From/form.js */
export const dateHandler = (e, values, setFieldValue, type) => {
  /* Calculate Duration */
  const diff = getDifference(
    type === "endDate"
      ? moment(values?.dteTripCommencedDate).format("YYYY-MM-DDTHH:mm:ss")
      : moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss"),
    type === "endDate"
      ? moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss")
      : moment(values?.dteTripCompletionDate).format("YYYY-MM-DDTHH:mm:ss")
  );

  /* Set Trip Duration */
  setFieldValue("numTotalTripDuration", isNaN(diff) ? 0 : parseFloat(diff));

  /* Set Current Input Field Value */
  if (type === "endDate") {
    setFieldValue(
      "dteTripCompletionDate",
      moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss")
    );
  } else {
    setFieldValue(
      "dteTripCommencedDate",
      moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss")
    );
  }
};

export const rowDataEditHandler = (
  values,
  rowData,
  setRowData,
  setTouched,
  setErrors,
  setFieldValue,
  editMode,
  setEditMode
) => {
  if (addRowValidation(values, setTouched, setErrors)) return;

  const payload = {
    rowId: editMode?.data?.rowId || 0,
    lighterTripId: editMode?.data?.lighterTripId || 0,

    motherVesselId: values?.motherVessel?.value,
    motherVesselName: values?.motherVessel?.label,
    voyageId: 0,
    voyageNo: values?.voyageNo || "",
    srnumber: values?.srnumber?.label,
    eta: values?.eta,
    numBlqty: +values?.numBlqty,
    consigneePartyId: values?.consigneeParty?.value || 1,
    consigneePartyName: values?.consigneeParty?.label || "consigneePartyName",
    lcnumber: values?.lcnumber,
    cargoId: values?.cargo?.value || 1,
    cargoName: values?.cargo?.label || "cargoName",
    numEstimatedCargoQty: +values?.numEstimatedCargoQty,
    numFreight: +values?.numFreight,
    numActualCargoQty: +values?.numActualCargoQty,
    numTotalFreight: +values?.numTotalFreight,
    isEdit: false,
    consigneePartyCode: values?.consigneeParty?.code || "",
  };

  const copy = [...rowData];
  copy[editMode?.index] = payload;
  setRowData(copy);
  setFieldValue && setOperationFieldClear(setFieldValue);
  setEditMode({ mode: false });
};

const addRowValidation = (values, setTouched, setErrors) => {
  if (
    !values?.motherVessel?.value ||
    !values?.consigneeParty?.value ||
    !values?.cargo?.value
  ) {
    setTouched({
      motherVessel: !values?.motherVessel?.value ? true : false,
      consigneeParty: !values?.consigneeParty?.value ? true : false,
      cargo: !values?.cargo?.value ? true : false,
    });

    setTimeout(() => {
      setErrors({
        motherVessel: "Mother Vessel is required",
        consigneeParty: "Field is required",
        cargo: "Cargo is required",
      });
    }, 50);

    return true;
  }
  return false;
};
