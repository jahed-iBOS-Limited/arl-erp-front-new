import * as Yup from "yup";
import axios from "axios";

export const initData = {
  refType: {
    address: null,
    amount: 0,
    binNumber: null,
    challanNo: null,
    currentStock: 0,
    duePaymentDate: "0001-01-01T00:00:00",
    fromPlantId: null,
    fromPlantName: null,
    fromWarehouseId: null,
    fromWarehouseName: null,
    grnDate: "0001-01-01T00:00:00",
    intReferenceTypeId: 0,
    inventoryTransectionGroupId: null,
    inventoryTransectionGroupName: null,
    isPOS: null,
    label: "PO (Purchase Order)",
    locationId: 0,
    locationName: null,
    monVatAmount: null,
    numCommission: null,
    numFreight: null,
    numGrossDiscount: null,
    othersAmount: null,
    partner: null,
    partnerId: null,
    personalId: 0,
    personalName: null,
    referenceId: null,
    shipToPartnerId: 0,
    shipToPartnerName: null,
    value: 1,
    vatAmount: null,
    wareHouseId: 0,
    wareHouseName: null,
  },
  refNo: "",
  transType: {
    address: null,
    amount: 0,
    binNumber: null,
    challanNo: null,
    currentStock: 0,
    duePaymentDate: "0001-01-01T00:00:00",
    fromPlantId: null,
    fromPlantName: null,
    fromWarehouseId: null,
    fromWarehouseName: null,
    grnDate: "0001-01-01T00:00:00",
    intReferenceTypeId: 0,
    inventoryTransectionGroupId: null,
    inventoryTransectionGroupName: null,
    isPOS: null,
    label: "Receive For PO To Open Stock",
    locationId: 0,
    locationName: null,
    monVatAmount: null,
    numCommission: null,
    numFreight: null,
    numGrossDiscount: null,
    othersAmount: null,
    partner: null,
    partnerId: null,
    personalId: 0,
    personalName: null,
    referenceId: null,
    shipToPartnerId: 0,
    shipToPartnerName: null,
    value: 1,
    vatAmount: null,
    wareHouseId: 0,
    wareHouseName: null,
  },
  busiPartner: "",
  personnel: "",
  remarks: "",
  item: "",
  costCenter: "",
  projName: "",
  isAllItem: false,
  getEntry: "",
  file: "",
  challanNO: "",
  challanDate: "",
  vatChallan: "",
  vatAmmount: "",
  freight: "",
  grossDiscount: "",
  commission: "",
  foreignPurchase: "",
  othersCharge: "",

  /* NEw Added */
  lighterVessel: "",
  motherVessel: "",
  surveyNo: "",
  surveyQty: "",
};

// // Validation schema
export const validationSchema = Yup.object().shape({
  refType: Yup.object().shape({
    label: Yup.string().required("Refference Type is required"),
    value: Yup.string().required("Refference Type is required"),
  }),
  transType: Yup.object().shape({
    label: Yup.string().required("Transaction Type is required"),
    value: Yup.string().required("Transaction Type is required"),
  }),
  // item: Yup.object().shape({
  //   label: Yup.string().required("Item is required"),
  //   value: Yup.string().required("Item is required")
  // })
});

export const getSupplierDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${buId}&SBUId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      let newData = res?.data?.map((data) => {
        return {
          ...data,
          label: data?.labelValue,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};
