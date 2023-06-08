import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
export const getSalesInvoicePagination = async (
  accId,
  buId,
  taxBranchId,
  startDate,
  endDate,
  pageNo,
  pageSize,
  setter,
  search,
  setDisabled
) => {
  // setDisabled(true);
  const searchPath = search ? `searchTerm=${search}&` : "";
  try {
    const res = await Axios.get(
      `/vat/TaxSalesInvoice/GetTaxSalesInvoiceSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&taxBranchId=${taxBranchId}&startDate=${startDate}&endDate=${endDate}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);

      // setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    // setDisabled(false);
  }
};

export const createSales = async (payload, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/vat/TaxSalesInvoice/CreateTaxSalesInvoice`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editSales = async (payload, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/vat/TaxSalesInvoice/EditTaxSalesInvoice`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
      // cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getVatBranches = async (userId, accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/OrganizationalUnitUserPermissionFotVat/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSupplierDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/PartnerManagementForVat/GetCustomerNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getDeliveryToDDL = async (
  soldToPrtnrId,
  setter,
  setFieldValue
) => {
  try {
    const res = await Axios.get(
      `/vat/PartnerManagementForVat/GetDeliveredToDDL?SoldToPartnerId=${soldToPrtnrId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      if (setFieldValue) {
        setFieldValue(
          "deliveryTo",
          res?.data?.[0]?.value && res?.data?.[0]?.label ? res?.data?.[0] : ""
        );
        setFieldValue("deliveryAddress", res?.data?.[0]?.address || "");
      }
    }
  } catch (error) {}
};

export const getVehicleDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/Vehicle/GetVehicleDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getTaxConfig = async (buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/BusinessUnitTaxConfig/GetPurchaseTaxConfig?BusinessUnitId=${buId}&TradeTypeId=5`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {}
};

export const getTradeTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTradeTypeSalesDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPaymentTermDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetPaymentTermsFinoDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxItemForSalesDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getUomDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/ItemManagementForVat/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemAmounts = (item, selectedItemInfo) => {
  // isOnQty true or false check
  const isOnQty = selectedItemInfo?.isOnQty;

  const extraItemInfo = selectedItemInfo ? selectedItemInfo : item;
  // extract all percentage
  const vatPercent = extraItemInfo.vatpercentage || extraItemInfo.vat || 0;
  const sdPercent = extraItemInfo.sdpercentage || extraItemInfo.sd || 0;
  const surchargePercent =
    extraItemInfo.surchargePercentage || extraItemInfo.surcharge || 0;

  const totalPrice = item.quantity * (item.rate || item.basePrice);
  const sdAmount = (totalPrice * sdPercent) / 100;

  const vatAmount = isOnQty
    ? item.quantity * extraItemInfo.vatpercentage
    : ((totalPrice + sdAmount) * vatPercent) / 100;

  const surchargeAmount = (totalPrice * surchargePercent) / 100;
  const finalTotal = totalPrice + surchargeAmount + sdAmount + vatAmount;

  return {
    totalAmount: finalTotal,
    sdAmount,
    vatAmount,
    surchargeAmount,
    totalPrice,
  };
};

export const getSinglePurchase = async (
  puId,
  setSingleData,
  setRowDto,
  accId,
  buId,
  rowDto
) => {
  try {
    const res = await Axios.get(
      `/vat/TaxSalesInvoice/GetTaxSalesInvoiceById?TaxSalesId=${puId}`
    );
    if (res.status === 200 && res?.data) {
      const taxPurchase = res?.data?.objHeader;
      const objHeader = {
        supplier: {
          value: taxPurchase.soldtoPartnerId,
          label: taxPurchase.soldtoPartnerName,
        },
        address: taxPurchase.soldtoPartnerAddress,
        transactionDate: _dateFormatter(taxPurchase.taxDeliveryDateTime),
        taxDeliveryDateTime: _dateFormatter(taxPurchase.deliveryDateTime),
        tradeType: {
          value: taxPurchase.tradeTypeId,
          label: taxPurchase.tradeTypeName,
        },
        paymentTerm: {
          value: taxPurchase.paymentTerms,
          label: taxPurchase.paymentTermsName,
        },
        vehicalInfo: taxPurchase.vehicleNo,
        deliveryAddress: taxPurchase.shiptoPartnerAddress,
        refferenceNo: taxPurchase.referenceNo,
        refferenceDate: _dateFormatter(taxPurchase.referenceDate),
        totalTdsAmount: taxPurchase.tdstotal,
        totalVdsAmount: taxPurchase.vdstotal,
        deliveryTo: {
          value: taxPurchase.shiptoPartnerId,
          label: taxPurchase.shiptoPartnerName,
        },
        totalAtv: taxPurchase.atvtotal,
        totalAit: taxPurchase.aittotal,
        selectedItem: "",
        selectedUom: "",
        quantity: "",
        rate: "",
      };
      setSingleData(objHeader);
      const objRow = res?.data?.objList;
      let row = [];
      objRow &&
        objRow.forEach((item) => {
          Axios.get(
            `/vat/HsCode/GetCustomsDutyStructureById?TaxItemGroupId=${item?.taxItemGroupId}&AccountId=${accId}&BusinessUnitId=${buId}`
          ).then((res) => {
            let newData = res?.data[0];

            const total = getItemAmounts(item, res?.data[0]);

            let newObj = {
              ...item,
              totalAmount: total.totalAmount.toFixed(2),
              value: item.taxItemGroupId,
              label: item.taxItemGroupName,
              uom: {
                value: item.uomid,
                label: item.uomname,
              },
              quantity: item.quantity,
              rate: item.basePrice,

              sd: newData?.sdpercentage,
              vat: newData?.vatpercentage,
              ait: "",
              atv: "",
              isFree: item.isFree,
              surcharge: newData?.surchargePercentage,
              // get percentage
              refund:
                (item.rebateTotal / (item.quantity * item.invoicePrice)) * 100,
              rebateAmount: item.rebateTotal,
            };

            row.push(newObj);

            setRowDto([...row]);
          });
        });
    }
  } catch (error) {}
};

export const getSelectedItemInfo = async (
  itemId,
  accId,
  buId,
  setter,
  setFieldValue
) => {
  try {
    const res = await Axios.get(
      `/vat/HsCode/GetCustomsDutyStructureById?TaxItemGroupId=${itemId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      if (res.data.length > 0) {
        setFieldValue("rate", res?.data[0]?.basePrice);
        setFieldValue("declarePrice", res?.data[0]?.basePrice);
        setter(res?.data[0]);
      } else {
        toast.warn(
          "Price declaration missing, please create price declaration."
        );
        setFieldValue("rate", "");
        setFieldValue("declarePrice", "");
        setter({});
      }
    }
  } catch (error) {}
};

export const getGridData = async (
  accId,
  buId,
  tbId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      // `/vat/TaxPurchase/GetTaxPurchasePagination?accountId=${accId}&businessUnitId=${buId}&TaxBranchId=${tbId}&TaxTransactionTypeId=1&FromDate=${fromDate}&ToDate=${toDate}&status=true&PageNo=1&PageSize=100&viewOrder=desc`
      `/vat/TaxSalesInvoice/GetTaxSalesInvoicePagination?accountId=${accId}&businessUnitId=${buId}&taxBranchId=${tbId}&startDate=${fromDate}&endDate=${toDate}&status=true&PageNo=1&PageSize=123&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getSalesInvoiceById = async (id, setter, setLoading) => {
  try {
    setLoading && setLoading(true);
    const res = await Axios.get(
      `/vat/TaxSalesInvoice/GetTaxSalesInvoiceById?TaxSalesId=${id}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const GetSalesLogDetails_api = async (logId, setter, setLoading) => {
  try {
    setLoading && setLoading(true);
    const res = await Axios.get(
      `/vat/AuditLog/GetSalesLogDetails?LogId=${logId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
//

export const GetTaxSalesInvoicePrintStatus_api = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxSalesInvoiceIbos/GetTaxSalesInvoicePrintStatus?TaxSalesInvoiceId=${id}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

//
export const EditTaxSalesInvoicePrintStatus_api = async (id, cb) => {
  try {
    const res = await Axios.post(
      `/vat/TaxSalesInvoiceIbos/EditTaxSalesInvoicePrintStatus?TaxSalesInvoiceId=${id}`
    );
    if (res.status === 200 && res?.data) {
      cb(id);
    }
  } catch (error) {}
};
export const getPartnerDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/PartnerManagementForVat/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=2`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const salesAttachment_action = async (attachment, setUploadImage) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await Axios.post("/vat/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Upload  successfully");
    setUploadImage(data);
  } catch (error) {
    toast.error("Document not upload");
  }
};
export const GetCustomHouseDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetCustomHouseDDL`);
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((itm) => ({
          ...itm,
          label: `${itm?.code}: ${itm?.label}`,
          withOutCodeLabel: itm?.label,
        }))
      );
    }
  } catch (error) {}
};
export const getTaxPortDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxPortDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
