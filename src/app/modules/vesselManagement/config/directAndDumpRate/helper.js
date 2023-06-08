import { toast } from "react-toastify";

export const initData = {
  type: "",
  shipPoint: "",
  directDeliveryRate: "",
  dumpDeliveryRate: "",
  decDamToTruckRate: "",
  decTruckToDamRate: "",
  decLighterToBolgateRate: "",
  decBolgateToDamRate: "",
  decOthersCostRate: "",
  supplier: "",
};

export const saveHandler = (rowDto, createEditHandler, cb) => {
  if (!rowDto?.length) {
    return toast.warn("Add at least one");
  }
  createEditHandler(
    `/wms/ShipPoint/CreateG2GShippointLoadUnloadRate`,
    rowDto,
    cb,
    true
  );
};

export const addHandler = ({ values, rowDto, setRowDto, userId, buId }) => {
  const isExist = rowDto.some(
    (item) =>
      item?.strShipPointName?.replace(/\s/g, "").toLocaleLowerCase() ===
      values?.shipPoint?.label?.replace(/\s/g, "").toLocaleLowerCase()
  );

  if (isExist) {
    return toast.warn("Ship Point already exists");
  }
  const dataset = {
    intTypeId: values?.type?.value,
    strTypeName: values?.type?.label,
    intShippingPointId: values?.shipPoint?.value,
    strShipPointName: values?.shipPoint?.label,
    decDirectRate: +values?.directDeliveryRate || 0,
    decDumpDeliveryRate: +values?.dumpDeliveryRate || 0,
    decDamToTruckRate: +values?.decDamToTruckRate || 0,
    decTruckToDamRate: +values?.decTruckToDamRate || 0,
    decLighterToBolgateRate: +values?.decLighterToBolgateRate || 0,
    decBolgateToDamRate: +values?.decBolgateToDamRate || 0,
    decOthersCostRate: +values?.decOthersCostRate || 0,
    intSupplierId: values?.supplier?.value,
    strSupplierName: values?.supplier?.label,
    intAutoid: 0,
    intGoDownId: 0,
    strGoDownName: "",
    decUnloadLabourRate: 0,
    intInsertby: userId,
    dteLastActionTime: "2023-05-20T06:55:44.132Z",
    dteServerDatetime: "2023-05-20T06:55:44.132Z",
    isActive: true,
    intBusinessUnitId:buId,
  };

  setRowDto((prev) => {
    return [...prev, dataset];
  });
};

export const typeDDL = [
  // { value: 1, label: "Delivery Labour Rate" },
  { value: 1, label: "Warehouse Load Unload Rate" },
];

export const intDataForEdit = (rowDto) => {
  return {
    type: rowDto[0]?.intTypeId
      ? typeDDL?.find((item) => item?.value === rowDto[0]?.intTypeId)
      : "",
    shipPoint:
      rowDto[0]?.intShippingPointId && rowDto[0].strShipPointName
        ? {
            value: rowDto[0]?.intShippingPointId,
            label: rowDto[0].strShipPointName,
          }
        : "",
    directDeliveryRate: rowDto[0]?.decDirectRate || "",
    dumpDeliveryRate: rowDto[0]?.decDumpDeliveryRate || "",
    decTruckToDamRate: rowDto[0]?.decTruckToDamRate || "",
    decLighterToBolgateRate: rowDto[0]?.decLighterToBolgateRate || "",
    decBolgateToDamRate: rowDto[0]?.decBolgateToDamRate || "",
    decOthersCostRate: rowDto[0]?.decOthersCostRate || "",
    supplier:
      rowDto[0]?.intSupplierId && rowDto[0].strSupplierName
        ? {
            value: rowDto[0]?.intSupplierId,
            label: rowDto[0].strSupplierName,
          }
        : "",
  };
};
