import Axios from 'axios';
import { toast } from 'react-toastify';
import { rowDtoCalculationFunc } from '../../../report/auditLog/helper';
import { _dateFormatter } from './../../../../_helper/_dateFormate';
import { _fixedPoint } from './../../../../_helper/_fixedPoint';

export const getSupplierDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/PartnerManagementForVat/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=1`
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
    const res = await Axios.get(`/vat/TaxDDL/GetPaymentTermsFinoDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
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
      // setDisabled && setDisabled(false);
      // const taxPurchase = res?.data?.objHeaderDTO;
      // const objHeader = {
      //   supplier: {
      //     value: taxPurchase.supplierId,
      //     label: taxPurchase.supplierName,
      //   },
      //   address: taxPurchase.supplierAddress,
      //   transactionDate: _dateFormatter(taxPurchase.purchaseDateTime),
      //   tradeType: {
      //     value: taxPurchase.tradeTypeId,
      //     label: taxPurchase.tradeTypeName,
      //   },
      //   port: {
      //     value: taxPurchase.portId,
      //     label: taxPurchase.portName,
      //   },
      //   paymentTerm: {
      //     value: taxPurchase.paymentTerms,
      //     label: taxPurchase.paymentTermsName,
      //   },
      //   vehicalInfo: taxPurchase?.vehicleNo,
      //   refferenceNo: taxPurchase.referanceNo,
      //   refferenceDate: _dateFormatter(taxPurchase.referanceDate),
      //   totalTdsAmount: taxPurchase.tdstotal,
      //   totalVdsAmount: taxPurchase.vdstotal,
      //   totalAtv: taxPurchase.atvtotal,
      //   totalAit: taxPurchase.aittotal,
      //   selectedItem: "",
      //   selectedUom: "",
      //   quantity: "",
      //   rate: "",
      //   purchaseType: { value: 10, label: taxPurchase?.purchaseType },
      // };
      // setSingleData(objHeader);
      // const objRow = res?.data?.objListRowDTO;
      // const row = objRow.map((item) => {
      //   const amount = item.invoiceTotal;
      //   const cdtotal = +item.rdtotal;
      //   const rdtotal = +item.rdtotal;
      //   const sdtotal = item?.cdtotal;
      //   const vatTotal = +item.vatTotal;
      //   const atTotal = +item.attotal;
      //   const aittotal = +item.aittotal;
      //   const totalAmount =
      //     amount + item?.cdtotal + item.rdtotal + item.sdtotal + item.attotal;
      //   const refund = item.rebateTotal;
      //   return {
      //     ...item,
      //     value: item.taxItemGroupId,
      //     label: item.taxItemGroupName,
      //     uom: {
      //       value: item.uomid,
      //       label: item.uomname,
      //     },
      //     quantity: item.quantity,
      //     rate: item.invoicePrice.toFixed(2),
      //     cd: cdtotal.toFixed(2),
      //     rd: rdtotal.toFixed(2),
      //     sd: sdtotal.toFixed(2),
      //     vat: vatTotal.toFixed(2),
      //     ait: aittotal?.toFixed(2),
      //     atv: 0,
      //     // get percentage
      //     refund: refund.toFixed(2),
      //     rebateAmount: item.rebateTotal.toFixed(2),
      //     at: atTotal.toFixed(2),
      //     totalAmount: totalAmount.toFixed(2),
      //     amount: +amount.toFixed(2),
      //   };
      // });
      // setRowDto(rowDtoCalculationFunc(row));

      // Last Added Assign By HM Ikbal | View as Like Edit
      setDisabled && setDisabled(false);
      const taxPurchase = res?.data?.objHeaderDTO;
      const objHeader = {
        ...taxPurchase,
        supplier: taxPurchase?.supplierId
          ? {
              value: taxPurchase?.supplierId,
              label: `${taxPurchase?.supplierName}(${taxPurchase?.supplierBin})`,
            }
          : '',
        address: taxPurchase?.supplierAddress || '',
        transactionDate: taxPurchase?.purchaseDateTime
          ? _dateFormatter(taxPurchase?.purchaseDateTime)
          : '',
        tradeType: taxPurchase?.tradeTypeId
          ? {
              value: taxPurchase?.tradeTypeId,
              label: taxPurchase?.tradeTypeName,
            }
          : '',
        port: taxPurchase?.portId
          ? {
              value: taxPurchase?.portId,
              label: taxPurchase?.portName,
            }
          : '',
        paymentTerm: taxPurchase?.paymentTerms
          ? {
              value: taxPurchase?.paymentTerms,
              label: taxPurchase?.paymentTermsName,
            }
          : '',
        vehicalInfo: { value: 1, label: taxPurchase?.vehicleNo || '' },
        refferenceNo: taxPurchase?.referanceNo || '',
        refferenceDate: taxPurchase?.referanceDate
          ? _dateFormatter(taxPurchase?.referanceDate)
          : '',
        totalTdsAmount: taxPurchase?.tdstotal || 0,
        totalVdsAmount: taxPurchase?.vdstotal || 0,
        totalAtv: taxPurchase?.atvtotal || 0,
        totalAit: taxPurchase?.aittotal || 0,
        selectedItem: '',
        selectedUom: '',
        quantity: '',
        rate: '',
        purchaseType: taxPurchase?.purchaseType
          ? { value: 10, label: taxPurchase?.purchaseType }
          : '',
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
        CPCCode: taxPurchase?.cpcCode
          ? {
              value: taxPurchase?.cpcID,
              label: taxPurchase?.cpcCode,
              details: taxPurchase?.cpcDetails,
            }
          : '',
        numberOfItem: taxPurchase?.noItem || '',
      };
      setSingleData(objHeader);
      const objRow = res?.data?.objListRowDTO;
      const row = objRow.map((item) => {
        const amount = item.invoiceTotal;
        const cdtotal = (+item?.cdtotal / +amount) * 100 || 0;
        const rdtotal = (+item.rdtotal / +amount) * 100 || 0;
        const aittotal = (+item.aittotal / +amount) * 100 || 0;
        const sdtotal =
          (item?.sdtotal / (amount + item?.cdtotal + item?.rdtotal)) * 100 || 0;
        const vatTotal =
          (item.vatTotal /
            (amount + item?.cdtotal + item?.rdtotal + item?.sdtotal)) *
            100 || 0;
        const atTotal =
          (item.attotal /
            (amount + item?.cdtotal + item?.rdtotal + item?.sdtotal)) *
            100 || 0;
        const totalAmount =
          amount +
          item?.cdtotal +
          item?.rdtotal +
          item?.sdtotal +
          item?.attotal;
        const refund =
          (item?.rebateTotal / (item?.quantity * item?.invoicePrice)) * 100;
        return {
          ...item,
          value: item?.taxItemGroupId,
          label: item?.taxItemGroupName,
          uom: {
            value: item?.uomid,
            label: item?.uomname,
          },
          quantity: item.quantity,
          rate: item?.invoicePrice,
          cd: cdtotal,
          rd: rdtotal,
          sd: sdtotal,
          vat: vatTotal,
          ait: aittotal || 0,
          atv: 0,
          // get percentage
          refund: refund,
          rebateAmount: item?.rebateTotal,
          at: atTotal,
          totalAmount: totalAmount,
          amount: +amount,
          supplyTypeName: item.supplyTypeName || '',
          supplyTypeId: item?.supplyTypeId || 0,
        };
      });
      setRowDto(rowDtoCalculationFunc(row));

      // setter(res?.data);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

export const getSinglePurchase = async (
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
        supplier: taxPurchase?.supplierId
          ? {
              value: taxPurchase?.supplierId,
              label: `${taxPurchase?.supplierName}(${taxPurchase?.supplierBin})`,
            }
          : '',
        address: taxPurchase?.supplierAddress || '',
        transactionDate: taxPurchase?.purchaseDateTime
          ? _dateFormatter(taxPurchase?.purchaseDateTime)
          : '',
        tradeType: taxPurchase?.tradeTypeId
          ? {
              value: taxPurchase?.tradeTypeId,
              label: taxPurchase?.tradeTypeName,
            }
          : '',
        port: taxPurchase?.portId
          ? {
              value: taxPurchase?.portId,
              label: taxPurchase?.portName,
            }
          : '',
        paymentTerm: taxPurchase?.paymentTerms
          ? {
              value: taxPurchase?.paymentTerms,
              label: taxPurchase?.paymentTermsName,
            }
          : '',
        vehicalInfo: taxPurchase?.vehicleNo
          ? { value: 1, label: taxPurchase?.vehicleNo || '' }
          : '',
        refferenceNo: taxPurchase?.referanceNo || '',
        refferenceDate: taxPurchase?.referanceDate
          ? _dateFormatter(taxPurchase?.referanceDate)
          : '',
        totalTdsAmount: taxPurchase?.tdstotal || 0,
        totalVdsAmount: taxPurchase?.vdstotal || 0,
        totalAtv: taxPurchase?.atvtotal || 0,
        totalAit: taxPurchase?.aittotal || 0,
        selectedItem: '',
        selectedUom: '',
        quantity: '',
        rate: '',
        purchaseType: taxPurchase?.purchaseType
          ? { value: 10, label: taxPurchase?.purchaseType }
          : '',
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
        CPCCode: taxPurchase?.cpcCode
          ? {
              value: taxPurchase?.cpcID,
              label: taxPurchase?.cpcCode,
              details: taxPurchase?.cpcDetails,
            }
          : '',
        numberOfItem: taxPurchase?.noItem || '',
      };
      setSingleData(objHeader);
      const objRow = res?.data?.objListRowDTO;
      const row = objRow.map((item) => {
        const amount = item?.invoiceTotal;
        const cdtotal = (+item?.cdtotal / +amount) * 100 || 0;
        const rdtotal = (+item?.rdtotal / +amount) * 100 || 0;
        const aittotal = (+item?.aittotal / +amount) * 100 || 0;
        const sdtotal =
          (item.sdtotal / (amount + item?.cdtotal + item?.rdtotal)) * 100 || 0;
        const vatTotal =
          (item.vatTotal /
            (amount + item?.cdtotal + item?.rdtotal + item?.sdtotal)) *
            100 || 0;
        const atTotal =
          (item.attotal /
            (amount + item?.cdtotal + item?.rdtotal + item?.sdtotal)) *
            100 || 0;
        const totalAmount =
          amount +
          item?.cdtotal +
          item?.rdtotal +
          item?.sdtotal +
          item?.attotal;
        const refund =
          (item?.rebateTotal / (item?.quantity * item?.invoicePrice)) * 100;
        return {
          ...item,
          value: item?.taxItemGroupId,
          label: item?.taxItemGroupName,
          uom: {
            value: item?.uomid,
            label: item?.uomname,
          },
          quantity: item?.quantity,
          rate: item?.invoicePrice,
          cd: cdtotal,
          rd: rdtotal,
          sd: sdtotal,
          vat: vatTotal,
          ait: aittotal || 0,
          atv: 0,
          // get percentage
          refund: refund,
          rebateAmount: item?.rebateTotal,
          at: atTotal,
          totalAmount: totalAmount,
          amount: +amount,
          supplyTypeName: item.supplyTypeName || '',
          supplyTypeId: item?.supplyTypeId || 0,
        };
      });

      const result = rowDtoCalculationFunc(row);
      setRowDto(
        result.map((itm) => ({
          ...itm,
          amount: _fixedPoint(itm.amount),
          quantity: _fixedPoint(itm?.quantity),
          rate: _fixedPoint(itm?.rate),
          isCd: _fixedPoint(itm?.isCd),
          cd: _fixedPoint(itm?.cd),
          rd: _fixedPoint(itm?.rd),
          sd: _fixedPoint(itm?.sd),
          vat: _fixedPoint(itm?.vat),
          isAt: _fixedPoint(itm?.isAt),
          at: _fixedPoint(itm?.at),
          rebateAmount: _fixedPoint(itm?.rebateAmount),
          totalAmount: _fixedPoint(itm?.totalAmount),
        }))
      );

      // setter(res?.data);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

export const GetPurchaseLogDetails_api = async (
  logId,
  setSingleData,
  setRowDto,
  setDisabled
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `vat/AuditLog/GetPurchaseLogDetails?LogId=${logId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      const taxPurchase = res?.data?.objHeaderDTO;
      const objHeader = {
        ...taxPurchase,
        ...res?.data?.auditLog,
        supplier: taxPurchase?.supplierId
          ? {
              value: taxPurchase?.supplierId,
              label: `${taxPurchase?.supplierName}(${taxPurchase?.supplierBin})`,
            }
          : '',
        address: taxPurchase?.supplierAddress || '',
        transactionDate: taxPurchase?.purchaseDateTime
          ? _dateFormatter(taxPurchase?.purchaseDateTime)
          : '',
        tradeType: taxPurchase?.tradeTypeId
          ? {
              value: taxPurchase?.tradeTypeId,
              label: taxPurchase?.tradeTypeName,
            }
          : '',
        port: taxPurchase?.portId
          ? {
              value: taxPurchase?.portId,
              label: taxPurchase?.portName,
            }
          : '',
        paymentTerm: taxPurchase?.paymentTerms
          ? {
              value: taxPurchase?.paymentTerms,
              label: taxPurchase?.paymentTermsName,
            }
          : '',
        vehicalInfo: { value: 1, label: taxPurchase?.vehicleNo || '' },
        refferenceNo: taxPurchase?.referanceNo || '',
        refferenceDate: taxPurchase?.referanceDate
          ? _dateFormatter(taxPurchase?.referanceDate)
          : '',
        totalTdsAmount: taxPurchase?.tdstotal || 0,
        totalVdsAmount: taxPurchase?.vdstotal || 0,
        totalAtv: taxPurchase?.atvtotal || 0,
        totalAit: taxPurchase?.aittotal || 0,
        selectedItem: '',
        selectedUom: '',
        quantity: '',
        rate: '',
        purchaseType: taxPurchase?.purchaseType
          ? { value: 10, label: taxPurchase?.purchaseType }
          : '',
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
        CPCCode: taxPurchase?.cpcCode
          ? {
              value: taxPurchase?.cpcID,
              label: taxPurchase?.cpcCode,
              details: taxPurchase?.cpcDetails,
            }
          : '',
        numberOfItem: taxPurchase?.noItem || '',
      };
      setSingleData(objHeader);
      const objRow = res?.data?.objListRowDTO;
      const row = objRow.map((item) => {
        const amount = item.invoiceTotal;
        const cdtotal = (+item?.cdtotal / +amount) * 100 || 0;
        const rdtotal = (+item.rdtotal / +amount) * 100 || 0;
        const aittotal = (+item.aittotal / +amount) * 100 || 0;
        const sdtotal =
          (item?.sdtotal / (amount + item?.cdtotal + item?.rdtotal)) * 100 || 0;
        const vatTotal =
          (item.vatTotal /
            (amount + item?.cdtotal + item?.rdtotal + item?.sdtotal)) *
            100 || 0;
        const atTotal =
          (item.attotal /
            (amount + item?.cdtotal + item?.rdtotal + item?.sdtotal)) *
            100 || 0;
        const totalAmount =
          amount +
          item?.cdtotal +
          item?.rdtotal +
          item?.sdtotal +
          item?.attotal;
        const refund =
          (item?.rebateTotal / (item?.quantity * item?.invoicePrice)) * 100;
        return {
          ...item,
          value: item?.taxItemGroupId,
          label: item?.taxItemGroupName,
          uom: {
            value: item?.uomid,
            label: item?.uomname,
          },
          quantity: item.quantity,
          rate: item?.invoicePrice,
          cd: cdtotal,
          rd: rdtotal,
          sd: sdtotal,
          vat: vatTotal,
          ait: aittotal || 0,
          atv: 0,
          // get percentage
          refund: refund,
          rebateAmount: item?.rebateTotal,
          at: atTotal,
          totalAmount: totalAmount,
          amount: +amount,
          supplyTypeName: item.supplyTypeName || '',
          supplyTypeId: item?.supplyTypeId || 0,
        };
      });
      setRowDto(rowDtoCalculationFunc(row));

      // setter(res?.data);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

export const GetHSCodeByTarrifSchedule_api = async (
  hsCode,
  type,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetHSCodeByTarrifSchedule?Code=${hsCode}&Type=${type}
      `
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
