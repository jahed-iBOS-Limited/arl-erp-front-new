import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";

//create data;
export const createPurchaseOrder = async (
  setDisabled,
  values,
  accountId,
  businessUnitId,
  userId,
  proformaInvoiceValue,
  rowDto,
  cb
) => {
  const obj = createPayloadChange(
    values,
    accountId,
    businessUnitId,
    userId,
    proformaInvoiceValue,
    rowDto
  );
  try {
    // console.log(obj)
    setDisabled(true);
    const res = await axios.post(
      `/imp/PurchaseOrder/CreatePurchaseOrder`,
      obj
    );
    setDisabled(false);
    cb && cb();
    toast.success(res?.data?.message || "Create successfully");
    return res;
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

const createPayloadChange = (
  values,
  accountId,
  businessUnitId,
  userId,
  proformaInvoiceValue,
  rowDto
) => {
  let payload = {
    objHeaderDTO: {
      purchaseRequestNo: values?.purchaseRequestNo,
      sbuId: proformaInvoiceValue?.sbuId,
      accountId: accountId,
      businessUnitId: businessUnitId,
      proformerInvoiceId: proformaInvoiceValue?.proformaInvoiceId,
      plantId: proformaInvoiceValue?.plantId,
      plantName: proformaInvoiceValue?.plantName,
      purchaseOrganizationId: 0,
      warehouseId: values?.warehouseId || 0,
      warehouseName: "",
      supplyingWarehouseId: 0,
      supplyingWarehouseName: "",
      purchaseOrderTypeId: 0,
      referenceTypeId: 2,
      businessPartnerId: values?.supplierName?.value,
      deliveryAddress: values?.deliveryAddress,
      purchaseOrderDate: values?.orderDate,
      returnDate: _todayDate(),
      lastShipmentDate: values?.lastShipmentDate,
      currencyId: values?.currency?.value,
      paymentTerms: values?.paymentTerms?.value,
      cashOrAdvancePercent: values?.castAdvance || 0,
      paymentDaysAfterDelivery: values?.payDays || 0,
      incotermsId: values?.incoTerm?.value,
      supplierReference: values?.supplierReference,
      referenceDate: values?.PIDate,
      poValidityDate: values?.lastShipmentDate,
      otherTerms: values?.otherTerms || "",
      actionBy: userId,
      priceStructureId: 0,
      creditPercent: values?.castAdvance || 0,
      grossDiscount: values?.grossDiscount || 0,
      freight: values?.freight || 0,
      commission: values?.commission || 0,
      businessPartnerName: values?.supplierName?.label,
      currencyCode: values?.currencyCode,
    },
    objRowListDTO: rowDto?.map((data) => ({
      referenceQty: 0,
      controllingUnitId: 0,
      controllingUnitName: "",
      costCenterId: 0,
      costCenterName: "",
      costElementId: 0,
      costElementName: "",
      purchaseDescription: "",
      lastActionDateTime: _todayDate(),
      discount: 0,
      itemId: data?.value,
      itemName: data?.label,
      uoMid: data?.uom?.value,
      uoMname: data?.uom?.label,
      referenceId: values?.purchaseRequestId,
      referenceCode: values?.purchaseRequestNo || "",
      orderQty: +data?.quantity,
      basePrice: +data?.rate,
      finalPrice: +data?.totalAmount,
      totalValue: +data?.totalAmount,
      actionBy: userId,
      bomId: 0,
      vatAmount: 0,
      vatPercentage: 0,
    })),
  };
  return payload;
};

//get single data;
export const getSingleData = async (id, setter, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.get(
      `/imp/ProformaInvoice/GetProformaInvoiceById?proformaInvoiceId=${id}`
    );
    setDisabled(false);
    // console.log(res?.data)
    const payload = {
      ...res?.data,
      supplierName: {
        value: res?.data?.objHeader?.supplierId,
        label: res?.data?.objHeader?.supplierName,
      },
      lastShipmentDate: _dateFormatter(res?.data?.objHeader?.lastShipDate),
      currency: {
        value: res?.data?.objHeader?.currencyId,
        label: res?.data?.objHeader?.currencyName,
      },
      incoTerm: {
        value: res?.data?.objHeader?.incotermId,
        label: res?.data?.objHeader?.incotermName,
      },
      supplierReference: res?.data?.objHeader?.pinumber,
      purchaseRequestNo: res?.data?.objHeader?.purchaseRequestNo,
      currencyCode: res?.data?.objHeader?.currencyCode,
      warehouseId: res?.data?.objHeader?.warehouseId,
      purchaseRequestId: res?.data?.objHeader?.purchaseRequestId,
      // deliveryAddress:
    };
    setter(payload);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

//ddl load
export const getPaymentTermDDL = async (setter) => {
  try {
    let res = await axios.get(
      "/procurement/PurchaseOrder/GetPaymentTermsListDDL"
    );
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

//item list ddl
export const getItemListDDL = async (id, setter) => {
  try {
    let res = await axios.get(
      `/imp/ProformaInvoice/GetItemListForPO?proformaInvoiceId=${id}`
    );
    const payload = res?.data?.map((item) => ({
      ...item,
      uom: { value: item?.uomId, label: item?.uomName },
    }));
    setter(payload);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

// Check Purchase Request No validation
export const ValidatePoNo = async (accId, buId, purchaseOrderNo, setter) => {
  try {
    const res = await axios.get(
      `/imp/PurchaseOrder/GetCheckPurchaseRequestNo?accountId=${accId}&businessUnitId=${buId}&purchaseRequestNo=${purchaseOrderNo}`
    );

    setter(res?.data);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

//view po data api
export const getSingleDataForPoView = async (
  accId,
  businessUnitId,
  poId,
  settter,
  setRowDto
) => {
  try {
    const res = await axios.get(
      `/imp/ProformaInvoice/GetPOInfoByPOId?accountId=${accId}&businessUnitId=${businessUnitId}&poId=${poId}`
    );
    let modifyData = {
      ...res?.data?.objHeader,
      incoTerm: {
        value: res?.data?.objHeader?.incotermsId,
        label: res?.data?.objHeader?.incotermsName,
      },
      paymentTerms: {
        value: res?.data?.objHeader?.paymentTermsId,
        label: res?.data?.objHeader?.paymentTermsName,
      },
      supplierName: {
        value: res?.data?.objHeader?.businessPartnerId,
        label: res?.data?.objHeader?.businessPartnerName,
      },
      currency: {
        value: res?.data?.objHeader?.currencyId,
        label: res?.data?.objHeader?.currencyName,
      },
      lastShipmentDate: _dateFormatter(res?.data?.objHeader?.lastShipmentDate),
      orderDate: _dateFormatter(res?.data?.objHeader?.purchaseOrderDate),
      PIDate: _dateFormatter(res?.data?.objHeader?.piDate),
      purchaseRequestNo: res?.data?.objHeader?.purchaseRequestNo,
    };
    let modifyArray = res?.data?.objRow?.map((item) => ({
      label: item?.itemName,
      uom: { value: item?.uoMid, label: item?.uoMname },
      quantity: item?.orderQty,
      rate: item?.basePrice,
      totalAmount: item?.finalPrice,
      currency: {
        value: res?.data?.objHeader?.currencyId,
        label: res?.data?.objHeader?.currencyName,
      },
    }));
    settter(modifyData);
    setRowDto(modifyArray);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
