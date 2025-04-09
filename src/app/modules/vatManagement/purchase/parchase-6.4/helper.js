import Axios from 'axios';
import { toast } from 'react-toastify';
import shortid from 'shortid';
import { _dateFormatter } from '../../../_helper/_dateFormate';

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
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=1`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getTaxConfig = async (accId, buId, tradeType, setter) => {
  try {
    const res = await Axios.get(
      `/vat/BusinessUnitTaxConfig/GetPurchaseTaxConfig?AccountId=${accId}&BusinessUnitId=${buId}&TradeTypeId=${tradeType}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {}
};

export const getTradeTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTradeTypeDDL?TradeGroup=purchase`
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

export const getSinglePurchaseview = async (
  puId,
  setSingleData,
  setRowDto,
  setDisabled
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/vat/TaxPurchase/GetTaxPurchaseById?TaxPurchaseId=${puId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      const taxPurchase = res?.data?.objHeaderDTO;
      const objHeader = {
        ...taxPurchase,
        supplier: {
          value: taxPurchase.supplierId,
          label: taxPurchase.supplierName,
        },
        address: taxPurchase.supplierAddress,
        transactionDate: _dateFormatter(taxPurchase.purchaseDateTime),
        tradeType: {
          value: taxPurchase.tradeTypeId,
          label: taxPurchase.tradeTypeName,
        },
        port: {
          value: taxPurchase.portId,
          label: taxPurchase.portName,
        },
        paymentTerm: {
          value: taxPurchase.paymentTerms,
          label: taxPurchase.paymentTermsName,
        },
        grnCode: taxPurchase.grnid
          ? {
              value: taxPurchase.grnid,
              label: taxPurchase.grncode,
            }
          : '',
        vehicalInfo: taxPurchase?.vehicleNo,
        refferenceNo: taxPurchase.referanceNo,
        refferenceDate: _dateFormatter(taxPurchase.referanceDate),
        totalTdsAmount: taxPurchase.tdstotal,
        totalVdsAmount: taxPurchase.vdstotal,
        totalAtv: taxPurchase.atvtotal,
        totalAit: taxPurchase.aittotal,
        selectedItem: '',
        selectedUom: '',
        quantity: '',
        rate: '',
        purchaseType: { value: 10, label: taxPurchase?.purchaseType },
        // new field add
        lcDate: taxPurchase?.lcdate ? _dateFormatter(taxPurchase?.lcdate) : '',
        customsHouse: taxPurchase?.customHouseId
          ? {
              value: taxPurchase?.customHouseId,
              label: taxPurchase?.customHouseName,
              code: taxPurchase?.customHouseCode,
            }
          : '',
        CustomsHouseCode: taxPurchase?.customHouseCode || '',
        country: taxPurchase?.orginCountryId
          ? {
              value: taxPurchase?.orginCountryId,
              label: taxPurchase?.orginCountryName,
            }
          : '',
        CPCCode: taxPurchase?.cpcCode || '',
        numberOfItem: taxPurchase?.noItem || taxPurchase?.noProduct || '',
        lcNumber: taxPurchase?.lcNumber || '',
      };
      setSingleData(objHeader);
      const objRow = res?.data?.objListRowDTO;
      const row = objRow.map((item) => {
        const amount = item.invoiceTotal;
        const cdtotal = +item.cdtotal;
        const rdtotal = +item.rdtotal;
        const sdtotal = item?.sdtotal;
        const vatTotal = +item.vatTotal;
        const atTotal = +item.attotal;
        const totalAmount =
          amount + item?.cdtotal + item.rdtotal + item.sdtotal + item.attotal;
        // const refund = item.rebateTotal;
        return {
          ...item,
          value: item.taxItemGroupId,
          label: item.taxItemGroupName,
          uom: {
            value: item.uomid,
            label: item.uomname,
          },
          quantity: item?.quantity || 0,
          rate: item?.invoicePrice || 0,
          cd: cdtotal || 0,
          rd: rdtotal || 0,
          sd: sdtotal || 0,
          vat: vatTotal || 0,
          ait: 0,
          atv: 0,
          // get percentage
          refund: vatTotal || 0,
          rebateAmount: item?.rebateTotal || 0,
          at: atTotal || 0,
          totalAmount: totalAmount || 0,
          amount: +amount || 0,
        };
      });
      setRowDto(row);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

export const getSinglePurchase = async (
  puId,
  setSingleData,
  setRowDto,
  setDisabled,
  selectedBusinessUnit
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/vat/TaxPurchase/GetTaxPurchaseById?TaxPurchaseId=${puId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      const taxPurchase = res?.data?.objHeaderDTO;
      const objHeader = {
        ...taxPurchase,
        grnCode: taxPurchase.grnid
          ? {
              value: taxPurchase.grnid,
              label: taxPurchase.grncode,
            }
          : '',
        supplier: {
          value: taxPurchase.supplierId,
          label: taxPurchase.supplierName,
        },
        address: taxPurchase.supplierAddress,
        transactionDate: _dateFormatter(taxPurchase.purchaseDateTime),
        tradeType: {
          value: taxPurchase.tradeTypeId,
          label: taxPurchase.tradeTypeName,
        },
        port: {
          value: taxPurchase.portId,
          label: taxPurchase.portName,
        },
        paymentTerm: {
          value: taxPurchase.paymentTerms,
          label: taxPurchase.paymentTermsName,
        },
        vehicalInfo: taxPurchase?.vehicleNo,
        refferenceNo: taxPurchase.referanceNo,
        refferenceDate: _dateFormatter(taxPurchase.referanceDate),
        totalTdsAmount: taxPurchase.tdstotal,
        totalVdsAmount: taxPurchase.vdstotal,
        totalAtv: taxPurchase.atvtotal,
        totalAit: taxPurchase.aittotal,
        selectedItem: '',
        selectedUom: '',
        quantity: '',
        rate: '',
        purchaseType: { value: 10, label: taxPurchase?.purchaseType },
        // new field add
        lcDate: taxPurchase?.lcdate ? _dateFormatter(taxPurchase?.lcdate) : '',
        customsHouse: taxPurchase?.customHouseId
          ? {
              value: taxPurchase?.customHouseId,
              label: taxPurchase?.customHouseName,
              code: taxPurchase?.customHouseCode,
            }
          : '',
        CustomsHouseCode: taxPurchase?.customHouseCode || '',
        country: taxPurchase?.orginCountryId
          ? {
              value: taxPurchase?.orginCountryId,
              label: taxPurchase?.orginCountryName,
            }
          : '',
        CPCCode: taxPurchase?.cpcCode || '',
        numberOfItem: taxPurchase?.noItem || taxPurchase?.noProduct || '',
        lcNumber: taxPurchase?.lcNumber || '',
      };
      setSingleData(objHeader);
      const objRow = res?.data?.objListRowDTO;
      const isFixedRate =
        (selectedBusinessUnit?.value === 171 ||
          selectedBusinessUnit?.value === 224) &&
        taxPurchase.tradeTypeName === 'Import'
          ? true
          : false;
      const row = objRow.map((item) => {
        const amount = item.invoiceTotal;
        const cdtotal = item?.cdtotal;
        const rdtotal = item?.rdtotal;
        const sdtotal = item.sdtotal;
        const vatTotal = item.vatTotal;
        const atTotal = item.attotal;
        const totalAmount =
          amount +
          item?.cdtotal +
          item?.rdtotal +
          item?.sdtotal +
          item?.attotal;
        return {
          ...item,
          value: item?.taxItemGroupId,
          label: item?.taxItemGroupName,
          uom: item?.uomid
            ? {
                value: item?.uomid,
                label: item?.uomname,
              }
            : '',
          quantity: item?.quantity,
          rate: item?.invoicePrice?.toFixed(2),
          cd: cdtotal.toFixed(2),
          rd: rdtotal.toFixed(2),
          sd: sdtotal.toFixed(2),
          vat: vatTotal.toFixed(2),
          ait: 0,
          atv: 0,
          // get percentage
          refund: 0,
          rebateAmount: item.rebateTotal.toFixed(2),
          at: atTotal.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          amount: +amount.toFixed(2),
          isFixedRate: isFixedRate,
        };
      });
      setRowDto(row);

      // setter(res?.data);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

export const getCountryDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/hcm/HCMDDL/GetCountryDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
