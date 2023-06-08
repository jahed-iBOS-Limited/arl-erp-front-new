import Axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";

export const rowDtoCalculationFunc = (arr) => {
  // obj row
  let objRow = arr?.map((item) => {
    //rate
    const rate = +item.amount / +item.quantity;

    //Amount
    const amount = +item.amount;
    //cdtotal
    const cdtotal = (+item.cd / 100) * +amount || 0;
    //rdtotal
    const rdtotal = (+item.rd / 100) * +amount || 0;
    //sdtotal
    const sdtotal = (+item.sd / 100) * (+amount + +cdtotal + +rdtotal) || 0;
    //vatTotal
    const vatTotal =
      (+item.vat / 100) * (+amount + +cdtotal + +rdtotal + +sdtotal) || 0;
    //atTotal
    const atTotal =
      (+item.at / 100) * (+amount + +cdtotal + +rdtotal + +sdtotal) || 0;
    //aitTotal
    const aitTotal = (+item.ait / 100) * +amount || 0;
    const totalAmount =
      +amount +
      +cdtotal +
      +rdtotal +
      +sdtotal +
      +vatTotal +
      +atTotal +
      +aitTotal;
    //rebateAmount
    const rebateAmount = vatTotal;
    return {
      ...item,
      rate: +rate,
      rebateAmount: +rebateAmount,
      cal_cdtotal: +cdtotal,
      cal_rdtotal: +rdtotal,
      cal_sdtotal: +sdtotal,
      cal_vatTotal: +vatTotal,
      cal_atTotal: +atTotal,
      cal_aitTotal: +aitTotal,
      totalAmount: +totalAmount,
    };
  });
  return objRow;
};

// Real
export const createPurchase = async (payload, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.post(`/vat/TaxPurchase/CreateTaxPurchase`, payload);
    if (res.status === 200 && res?.data) {
      toast.success("Submitted Successfully", {
        toastId: shortid(),
      });
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editPurchase = async (payload, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.put(`/vat/TaxPurchase/EditTaxPurchase`, payload);
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || "Edited successfully");
      // cb();
      setDisabled(false);
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

export const getItemDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxItemListDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const modifiedData = res?.data?.map((itm) => ({
        ...itm,
        label: `${itm.label} (${itm.uomName})`,
        withoutlabel: itm.label,
      }));
      setter(modifiedData);
    }
  } catch (error) {}
};

export const getItemTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
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
export const GetSupplyTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetSupplyTypeDDL`);
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
          : "",
        address: taxPurchase?.supplierAddress || "",
        transactionDate: taxPurchase?.purchaseDateTime
          ? _dateFormatter(taxPurchase?.purchaseDateTime)
          : "",
        tradeType: taxPurchase?.tradeTypeId
          ? {
              value: taxPurchase?.tradeTypeId,
              label: taxPurchase?.tradeTypeName,
            }
          : "",
        port: taxPurchase?.portId
          ? {
              value: taxPurchase?.portId,
              label: taxPurchase?.portName,
            }
          : "",
        paymentTerm: taxPurchase?.paymentTerms
          ? {
              value: taxPurchase?.paymentTerms,
              label: taxPurchase?.paymentTermsName,
            }
          : "",
        vehicalInfo: { value: 1, label: taxPurchase?.vehicleNo || "" },
        refferenceNo: taxPurchase?.referanceNo || "",
        refferenceDate: taxPurchase?.referanceDate
          ? _dateFormatter(taxPurchase?.referanceDate)
          : "",
        totalTdsAmount: taxPurchase?.tdstotal || 0,
        totalVdsAmount: taxPurchase?.vdstotal || 0,
        totalAtv: taxPurchase?.atvtotal || 0,
        totalAit: taxPurchase?.aittotal || 0,
        selectedItem: "",
        selectedUom: "",
        quantity: "",
        rate: "",
        purchaseType: taxPurchase?.purchaseType
          ? { value: 10, label: taxPurchase?.purchaseType }
          : "",
        lcDate: taxPurchase?.lcdate ? _dateFormatter(taxPurchase?.lcdate) : "",
        customsHouse: taxPurchase?.customHouseId
          ? {
              value: taxPurchase?.customHouseId,
              label: taxPurchase?.customHouseName,
              code: taxPurchase?.customHouseCode,
            }
          : "",
        CustomsHouseCode: taxPurchase?.customHouseCode || "",
        country: taxPurchase?.orginCountryId
          ? {
              value: taxPurchase?.orginCountryId,
              label: taxPurchase?.orginCountryName,
            }
          : "",
        CPCCode: taxPurchase?.cpcCode
          ? {
              value: taxPurchase?.cpcID,
              label: taxPurchase?.cpcCode,
              details: taxPurchase?.cpcDetails,
            }
          : "",
        numberOfItem: taxPurchase?.noItem || "",
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
          supplyTypeName: item.supplyTypeName || "",
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
          : "",
        address: taxPurchase?.supplierAddress || "",
        transactionDate: taxPurchase?.purchaseDateTime
          ? _dateFormatter(taxPurchase?.purchaseDateTime)
          : "",
        tradeType: taxPurchase?.tradeTypeId
          ? {
              value: taxPurchase?.tradeTypeId,
              label: taxPurchase?.tradeTypeName,
            }
          : "",
        port: taxPurchase?.portId
          ? {
              value: taxPurchase?.portId,
              label: taxPurchase?.portName,
            }
          : "",
        paymentTerm: taxPurchase?.paymentTerms
          ? {
              value: taxPurchase?.paymentTerms,
              label: taxPurchase?.paymentTermsName,
            }
          : "",
        vehicalInfo: taxPurchase?.vehicleNo
          ? { value: 1, label: taxPurchase?.vehicleNo || "" }
          : "",
        refferenceNo: taxPurchase?.referanceNo || "",
        refferenceDate: taxPurchase?.referanceDate
          ? _dateFormatter(taxPurchase?.referanceDate)
          : "",
        totalTdsAmount: taxPurchase?.tdstotal || 0,
        totalVdsAmount: taxPurchase?.vdstotal || 0,
        totalAtv: taxPurchase?.atvtotal || 0,
        totalAit: taxPurchase?.aittotal || 0,
        selectedItem: "",
        selectedUom: "",
        quantity: "",
        rate: "",
        purchaseType: taxPurchase?.purchaseType
          ? { value: 10, label: taxPurchase?.purchaseType }
          : "",
        lcDate: taxPurchase?.lcdate ? _dateFormatter(taxPurchase?.lcdate) : "",
        customsHouse: taxPurchase?.customHouseId
          ? {
              value: taxPurchase?.customHouseId,
              label: taxPurchase?.customHouseName,
              code: taxPurchase?.customHouseCode,
            }
          : "",
        CustomsHouseCode: taxPurchase?.customHouseCode || "",
        country: taxPurchase?.orginCountryId
          ? {
              value: taxPurchase?.orginCountryId,
              label: taxPurchase?.orginCountryName,
            }
          : "",
        CPCCode: taxPurchase?.cpcCode
          ? {
              value: taxPurchase?.cpcID,
              label: taxPurchase?.cpcCode,
              details: taxPurchase?.cpcDetails,
            }
          : "",
        numberOfItem: taxPurchase?.noItem || "",
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
          supplyTypeName: item.supplyTypeName || "",
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
export const getGridData = async (
  accId,
  buId,
  tbId,
  fromDate,
  toDate,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/vat/TaxPurchase/GetTaxPurchasePagination?accountId=${accId}&businessUnitId=${buId}&TaxBranchId=${tbId}&TaxTransactionTypeId=1&FromDate=${fromDate}&ToDate=${toDate}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
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

export const purchaseAttachment_action = async (attachment, setUploadImage) => {
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

export const getCountryDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/OMSForVat/GetCountryDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetItemVatInfoByHsCodeImport_api = async (
  accId,
  buId,
  hsCode,
  setter,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/vat/TaxPurchase/GetItemVatInfoByHsCodeImport?AccountId=${accId}&BussinessUnitId=${buId}&HsCode=${hsCode}`
    );
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    setter("");
  }
};
export const GetItemVatInfoByHsCodeLocal = async (
  hsCode,
  supplyTypeId,
  setter,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetItemVatInfoByHsCodeLocal?HsCode=${hsCode}&SupplyType=${supplyTypeId}`
    );
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    setter("");
  }
};

export const GetSupplyTypeByHsLocal_api = async (
  hsCode,
  setter,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/vat/TaxPurchase/GetSupplyTypeByHsLocal?HsCode=${hsCode}`
    );
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    setter([]);
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

// export const GetItemInfoBySelection_api = async (
//   accId,
//   buId,
//   itemId,
//   setter
// ) => {
//   try {
//     const res = await Axios.get(
//       `/vat/TaxItemGroup/GetItemInfoBySelection?AccountId=${accId}&BusinessUnitId=${buId}&ItemId=${itemId}`
//     );
//     setter(res?.data);
//   } catch (error) {
//     setter("");
//   }
// };
export const GetItemInfoByItemHs_api = async (accId, buId, code, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetItemInfoByItemHs?AccountId=${accId}&BusinessUnitId=${buId}&SearchTerm=${code}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter("");
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
          : "",
        address: taxPurchase?.supplierAddress || "",
        transactionDate: taxPurchase?.purchaseDateTime
          ? _dateFormatter(taxPurchase?.purchaseDateTime)
          : "",
        tradeType: taxPurchase?.tradeTypeId
          ? {
              value: taxPurchase?.tradeTypeId,
              label: taxPurchase?.tradeTypeName,
            }
          : "",
        port: taxPurchase?.portId
          ? {
              value: taxPurchase?.portId,
              label: taxPurchase?.portName,
            }
          : "",
        paymentTerm: taxPurchase?.paymentTerms
          ? {
              value: taxPurchase?.paymentTerms,
              label: taxPurchase?.paymentTermsName,
            }
          : "",
        vehicalInfo: { value: 1, label: taxPurchase?.vehicleNo || "" },
        refferenceNo: taxPurchase?.referanceNo || "",
        refferenceDate: taxPurchase?.referanceDate
          ? _dateFormatter(taxPurchase?.referanceDate)
          : "",
        totalTdsAmount: taxPurchase?.tdstotal || 0,
        totalVdsAmount: taxPurchase?.vdstotal || 0,
        totalAtv: taxPurchase?.atvtotal || 0,
        totalAit: taxPurchase?.aittotal || 0,
        selectedItem: "",
        selectedUom: "",
        quantity: "",
        rate: "",
        purchaseType: taxPurchase?.purchaseType
          ? { value: 10, label: taxPurchase?.purchaseType }
          : "",
        lcDate: taxPurchase?.lcdate ? _dateFormatter(taxPurchase?.lcdate) : "",
        customsHouse: taxPurchase?.customHouseId
          ? {
              value: taxPurchase?.customHouseId,
              label: taxPurchase?.customHouseName,
              code: taxPurchase?.customHouseCode,
            }
          : "",
        CustomsHouseCode: taxPurchase?.customHouseCode || "",
        country: taxPurchase?.orginCountryId
          ? {
              value: taxPurchase?.orginCountryId,
              label: taxPurchase?.orginCountryName,
            }
          : "",
        CPCCode: taxPurchase?.cpcCode
          ? {
              value: taxPurchase?.cpcID,
              label: taxPurchase?.cpcCode,
              details: taxPurchase?.cpcDetails,
            }
          : "",
        numberOfItem: taxPurchase?.noItem || "",
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
          supplyTypeName: item.supplyTypeName || "",
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
