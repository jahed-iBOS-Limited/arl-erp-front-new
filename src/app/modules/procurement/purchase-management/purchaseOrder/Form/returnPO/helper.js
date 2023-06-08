import Axios from "axios";
import * as Yup from "yup";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../../_helper/_todayDate";

export const initData = {
  //header
  supplierName: "",
  deliveryAddress: "",
  orderDate: "",
  lastShipmentDate: "",
  currency: "",
  paymentTerms: { value: 2, label: "Credit" },
  cash: "",
  payDays: "",
  incoterms: { value: 1, label: "CFR (Cost And Freight)" },
  supplierReference: "",
  referenceDate: "",
  validity: "",
  returnDate: _todayDate(),
  otherTerms: "",

  // row
  referenceNo: "",
  item: "",
  isAllItem: false,
  freight:"",
  discount:"",
  commision:""
};

//  Validation schema
export const validationSchema = Yup.object().shape({
  supplierName: Yup.object().shape({
    label: Yup.string().required("Supplier name is required"),
    value: Yup.string().required("Supplier name is required"),
  }),
  // deliveryAddress: Yup.string().required("Delivery address is required"),
  // orderDate: Yup.date().required("Order date is required"),
  // lastShipmentDate: Yup.date().required("Last shipment date is required"),
  // currency: Yup.object().shape({
  //   label: Yup.string().required("Currency is required"),
  //   value: Yup.string().required("Currency is required"),
  // }),
  // paymentTerms: Yup.object().shape({
  //   label: Yup.string().required("Payment terms is required"),
  //   value: Yup.string().required("Payment terms is required"),
  // }),
  //
  // payDays: Yup.number().required("Pay days is required"),
  // incoterms: Yup.object().shape({
  //   label: Yup.string().required("Incoterm is required"),
  //   value: Yup.string().required("Incoterm is required"),
  // }),
  // supplierReference: Yup.string().required("Supplier reference is required"),
  // referenceDate: Yup.date().required("Reference date is required"),
  // validity: Yup.date().required("Validity date is required"),
});

export const getReturnPOInfoById = async (poIdRefId, setFieldValue) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPurchaseOrderInformationByPO_Id?PurchaseOrderId=${poIdRefId}`
    );
    if (res.status === 200 && res?.data) {
      const { objHeaderDTO } = res?.data[0];
      setFieldValue("deliveryAddress", objHeaderDTO?.deliveryAddress);
      setFieldValue("payDays", objHeaderDTO?.paymentDaysAfterDelivery);
      setFieldValue("cash", objHeaderDTO?.cashOrAdvancePercent);
      setFieldValue("supplierReference", objHeaderDTO?.supplierReference);
      setFieldValue(
        "referenceDate",
        _dateFormatter(objHeaderDTO?.referenceDate)
      );
      setFieldValue("validity", _dateFormatter(objHeaderDTO?.validityDate));
      setFieldValue(
        "orderDate",
        _dateFormatter(objHeaderDTO?.purchaseOrderDate)
      );
      setFieldValue(
        "lastShipmentDate",
        _dateFormatter(objHeaderDTO?.lastShipmentDate)
      );
      setFieldValue("currency", {
        value: objHeaderDTO?.currencyId,
        label: objHeaderDTO?.currencyCode,
      });
      setFieldValue("paymentTerms", {
        value: objHeaderDTO?.paymentTerms,
        label: objHeaderDTO?.paymentTermsName,
      });
      setFieldValue("incoterms", {
        value: objHeaderDTO?.incotermsId,
        label: objHeaderDTO?.incotermsName,
      });
    }
  } catch (error) {}
};

export const getRefNoDDL = (
  accId,
  buId,
  orderTypeId,
  partnerId,
  sbuId,
  plantId,
  whId,
  refTypeId,
  setRefNoDDL
) => {
  Axios.get(
    `/procurement/PurchaseOrder/GetPOReferenceNoDDL?OrderTypeId=${orderTypeId}&PartnerId=${partnerId}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plantId}&WarehouseId=${whId}&RefTypeId=${refTypeId}`
  )
    .then((res) => setRefNoDDL(res?.data))
    .catch((err) => console.log(err));
};



export const getItemDdlBySupplierForReturn = async (
  orderTypeId,
      accId,
      buId,
      sbuId,
      orgId,
      plantId,
      whId,
      partnerId,
      refTypeId,
      refNoId, 
      setter
  ) => {
  try {
    const res = await Axios.get(
      //`/procurement/PurchaseOrder/GetPOReferenceNoWiseItemDDL?OrderTypeId=${orderTypeId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&PurchaseOrgId=${orgId}&PlantId=${plantId}&WearhouseId=${whId}&PartnerId=${partnerId}&RefTypeId=${refTypeId}&RefNoId=${refNoId}`
      `/procurement/PurchaseOrder/GetPOReferenceNoWiseItemDDL?OrderTypeId=${orderTypeId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&PurchaseOrgId=${orgId}&PlantId=${plantId}&WearhouseId=${whId}&PartnerId=${partnerId}&RefTypeId=${refTypeId}&RefNoId=${refNoId}`
    );
    console.log(res);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};


export const getRefNoDdlForReturnPo = async (
  accId,
  buId,
  sbuId,
  orgId,
  plantId,
  whId,
  refTyp, 
  supplierId,
  setter
  ) => {
  try {
    const res = await Axios.get(
      //`/procurement/PurchaseOrderReferenceNo/GetReturnPOreferenceNoDDL?accountId=${accId}&businessUnitId=${buId}&sbuId=${sbuId}&purchaseOrgId=${orgId}&plantId=${plantId}&warehouseId=${whId}&refType=${refTyp}`
      `/procurement/PurchaseOrderReferenceNo/GetReturnPOreferenceNoDDL?accountId=${accId}&businessUnitId=${buId}&sbuId=${sbuId}&purchaseOrgId=${orgId}&plantId=${plantId}&warehouseId=${whId}&refType=${refTyp}&supplierId=${supplierId}`
    );
    console.log(res);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
