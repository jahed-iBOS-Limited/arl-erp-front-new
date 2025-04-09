import Axios from 'axios';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../_helper/_dateFormate';

export const getVatBranches = async (userId, accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSupplierDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getDeliveryToDDL = async (soldToPrtnrId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetDeliveredToDDL?SoldToPartnerId=${soldToPrtnrId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPaymentTermDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/fino/BusinessTransaction/GetPaymentTermsFinoDDL`
    );
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

export const getViewModalDataBySalesId = async (id, setter) => {
  try {
    const res = await Axios.get(`/vat/Mushak69/GetMushak69?ChallanNo=${id}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getTaxPayerInfo = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/Mushak91/GetTaxPayerInformation?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getUomDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getItemAmounts = (item, selectedItemInfo) => {
  const extraItemInfo = selectedItemInfo ? selectedItemInfo : item;
  // extract all percentage
  const vatPercent = extraItemInfo.vatpercentage || extraItemInfo.vat || 0;
  const sdPercent = extraItemInfo.sdpercentage || extraItemInfo.sd || 0;
  const surchargePercent =
    extraItemInfo.surchargePercentage || extraItemInfo.surcharge || 0;

  const totalPrice = item.quantity * (item.rate || item.basePrice);
  const sdAmount = (totalPrice * sdPercent) / 100;
  const vatAmount = ((totalPrice + sdAmount) * vatPercent) / 100;
  const surchargeAmount = (totalPrice * surchargePercent) / 100;
  const finalTotal = totalPrice + surchargeAmount + sdAmount + vatAmount;

  return {
    totalAmount: finalTotal,
    sdAmount,
    vatAmount,
    surchargeAmount,
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
        selectedItem: '',
        selectedUom: '',
        quantity: '',
        rate: '',
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
              ait: '',
              atv: '',
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
        setFieldValue('rate', res?.data[0]?.basePrice);
        setter(res?.data[0]);
      } else {
        toast.warn('Data not found');
        setFieldValue('rate', '');
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
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=2`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};
