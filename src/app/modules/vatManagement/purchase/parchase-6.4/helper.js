import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import shortid from "shortid";

// //vatPercentORTaka calculaion
// const vatPercentORTakaCalFunc = (item) => {
//   if (item?.isTariff) {
//     return +item?.vat;
//   } else {
//     return +item?.vat / 100;
//   }
// };

// //rebateAmount calculaiton func
// const rebateAmountCalFunc = (item, vatResult) => {
//   if (item?.isTariff) {
//     return +vatResult * +item?.quantity;
//   } else {
//     return +vatResult * +item?.amount;
//   }s
// };

// rate func calculation
const rateCalFunc = (item) => {
  if (item?.isFixedRate) {
    const sum =
      (+item?.cd || 0) +
      (+item?.rd || 0) +
      (+item?.sd || 0) +
      (+item?.amount || 0);
    return sum / +item.quantity || 0;
  } else {
    return +item?.amount / +item?.quantity;
  }
};

export const rowDtoCalculationFunc = (arr) => {
  // obj row
  let objRow = arr?.map((item) => {
    // const vatResult = vatPercentORTakaCalFunc(item);
    // //rate
    const rateResult =
      rateCalFunc(item) === Infinity ? 0 : Number(rateCalFunc(item) || 0);
    // //rebateAmount
    // const rebateAmountResult = rebateAmountCalFunc(item, vatResult);
    // //Amount
    // const amount = +item?.amount;
    // //cdtotal
    // const cdtotal = (+item.cd / 100) * +amount || 0;
    // //rdtotal
    // const rdtotal = (+item.rd / 100) * +amount || 0;
    // //sdtotal
    // const sdtotal = (+item.sd / 100) * (+amount + +cdtotal + +rdtotal) || 0;
    // //vatTotal
    // const vatTotal = item?.isTariff
    //   ? vatResult
    //   : +vatResult * (+amount + +cdtotal + +rdtotal + +sdtotal) || 0;
    // //atTotal
    // const atTotal =
    //   (+item.at / 100) * (+amount + +cdtotal + +rdtotal + +sdtotal) || 0;
    // const totalAmount =
    //   +amount + +cdtotal + +rdtotal + +sdtotal + +vatTotal + +atTotal;
    return {
      ...item,
      rate: rateResult,
      // ============old calculation========
      // rebateAmount: rebateAmountResult.toFixed(2),
      // cal_cdtotal: cdtotal.toFixed(2),
      // cal_rdtotal: rdtotal.toFixed(2),
      // cal_sdtotal: sdtotal.toFixed(2),
      // cal_vatTotal: vatTotal.toFixed(2),
      // cal_atTotal: atTotal.toFixed(2),
      // totalAmount: totalAmount.toFixed(2),

      rebateAmount: item?.rebateAmount || 0,
      cal_cdtotal: item?.cd || 0,
      cal_rdtotal: item?.rd || 0,
      cal_sdtotal: item?.sd || 0,
      cal_vatTotal: item?.vat || 0,
      cal_atTotal: item?.at || 0,
      totalAmount:
        (+item?.amount || 0) +
        (+item?.cd || 0) +
        (+item?.rd || 0) +
        (+item?.sd || 0) +
        (+item?.vat || 0) +
        (+item?.at || 0),
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
      toast.success(res.data?.message || "Edited successfully");
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
export const GetGrnNumberDDLApi = async (buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxPurchase/GetGrnNumberDDL?businessUnitId=${buId}`
    );
    setter(res?.data);
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
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
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
          : "",
        vehicalInfo: taxPurchase?.vehicleNo,
        refferenceNo: taxPurchase.referanceNo,
        refferenceDate: _dateFormatter(taxPurchase.referanceDate),
        totalTdsAmount: taxPurchase.tdstotal,
        totalVdsAmount: taxPurchase.vdstotal,
        totalAtv: taxPurchase.atvtotal,
        totalAit: taxPurchase.aittotal,
        selectedItem: "",
        selectedUom: "",
        quantity: "",
        rate: "",
        purchaseType: { value: 10, label: taxPurchase?.purchaseType },
        // new field add
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
        CPCCode: taxPurchase?.cpcCode || "",
        numberOfItem: taxPurchase?.noItem || taxPurchase?.noProduct || "",
        lcNumber: taxPurchase?.lcNumber || "",
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

// export const getSinglePurchase = async (
//   puId,
//   setSingleData,
//   setRowDto,
//   setDisabled
// ) => {
//   try {
//     setDisabled && setDisabled(true);
//     const res = await Axios.get(
//       `/vat/TaxPurchase/GetTaxPurchaseById?TaxPurchaseId=${puId}`
//     );
//     if (res.status === 200 && res?.data) {
//       setDisabled && setDisabled(false);
//       const taxPurchase = res?.data?.objHeaderDTO;
//       const objHeader = {
//         ...taxPurchase,
//         supplier: {
//           value: taxPurchase.supplierId,
//           label: taxPurchase.supplierName,
//         },
//         address: taxPurchase.supplierAddress,
//         transactionDate: _dateFormatter(taxPurchase.purchaseDateTime),
//         tradeType: {
//           value: taxPurchase.tradeTypeId,
//           label: taxPurchase.tradeTypeName,
//         },
//         port: {
//           value: taxPurchase.portId,
//           label: taxPurchase.portName,
//         },
//         paymentTerm: {
//           value: taxPurchase.paymentTerms,
//           label: taxPurchase.paymentTermsName,
//         },
//         vehicalInfo: taxPurchase?.vehicleNo,
//         refferenceNo: taxPurchase.referanceNo,
//         refferenceDate: _dateFormatter(taxPurchase.referanceDate),
//         totalTdsAmount: taxPurchase.tdstotal,
//         totalVdsAmount: taxPurchase.vdstotal,
//         totalAtv: taxPurchase.atvtotal,
//         totalAit: taxPurchase.aittotal,
//         selectedItem: "",
//         selectedUom: "",
//         quantity: "",
//         rate: "",
//         purchaseType: { value: 10, label: taxPurchase?.purchaseType },
//         // new field add
//         lcDate: taxPurchase?.lcdate ? _dateFormatter(taxPurchase?.lcdate) : "",
//         customsHouse: taxPurchase?.customHouseId
//           ? {
//               value: taxPurchase?.customHouseId,
//               label: taxPurchase?.customHouseName,
//               code: taxPurchase?.customHouseCode,
//             }
//           : "",
//         CustomsHouseCode: taxPurchase?.customHouseCode || "",
//         country: taxPurchase?.orginCountryId
//           ? {
//               value: taxPurchase?.orginCountryId,
//               label: taxPurchase?.orginCountryName,
//             }
//           : "",
//         CPCCode: taxPurchase?.cpcCode || "",
//         numberOfItem: taxPurchase?.noItem || taxPurchase?.noProduct || "",
//         lcNumber: taxPurchase?.lcNumber || "",
//       };
//       setSingleData(objHeader);
//       const objRow = res?.data?.objListRowDTO;
//       const row = objRow.map((item) => {
//         const amount = item.invoiceTotal;
//         const cdtotal = (+item?.cdtotal / +amount) * 100 || 0;
//         const rdtotal = (+item?.rdtotal / +amount) * 100 || 0;
//         const sdtotal =
//           (item.sdtotal / (amount + item?.cdtotal + item?.rdtotal)) * 100 || 0;
//         const vatTotal = item?.isTariff
//           ? item.vatTotal
//           : (item.vatTotal /
//               (amount + item?.cdtotal + item?.rdtotal + item?.sdtotal)) *
//               100 || 0;
//         const atTotal =
//           (item.attotal /
//             (amount + item?.cdtotal + item?.rdtotal + item?.sdtotal)) *
//             100 || 0;
//         const totalAmount =
//           amount +
//           item?.cdtotal +
//           item?.rdtotal +
//           item?.sdtotal +
//           item?.attotal;
//         const refund =
//           (item?.rebateTotal / (item?.quantity * item?.invoicePrice)) * 100;
//         return {
//           ...item,
//           value: item?.taxItemGroupId,
//           label: item?.taxItemGroupName,
//           uom: item?.uomid
//             ? {
//                 value: item?.uomid,
//                 label: item?.uomname,
//               }
//             : "",
//           quantity: item?.quantity,
//           rate: item?.invoicePrice?.toFixed(2),
//           cd: cdtotal.toFixed(2),
//           rd: rdtotal.toFixed(2),
//           sd: sdtotal.toFixed(2),
//           vat: vatTotal.toFixed(2),
//           ait: 0,
//           atv: 0,
//           // get percentage
//           refund: refund.toFixed(2),
//           rebateAmount: item.rebateTotal.toFixed(2),
//           at: atTotal.toFixed(2),
//           totalAmount: totalAmount.toFixed(2),
//           amount: +amount.toFixed(2),
//         };
//       });
//       setRowDto(rowDtoCalculationFunc(row));

//       // setter(res?.data);
//     }
//   } catch (error) {
//     setDisabled && setDisabled(false);
//   }
// };

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
          : "",
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
        selectedItem: "",
        selectedUom: "",
        quantity: "",
        rate: "",
        purchaseType: { value: 10, label: taxPurchase?.purchaseType },
        // new field add
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
        CPCCode: taxPurchase?.cpcCode || "",
        numberOfItem: taxPurchase?.noItem || taxPurchase?.noProduct || "",
        lcNumber: taxPurchase?.lcNumber || "",
      };
      setSingleData(objHeader);
      const objRow = res?.data?.objListRowDTO;
      const isFixedRate =
        (selectedBusinessUnit?.value === 171 ||
          selectedBusinessUnit?.value === 224) &&
        taxPurchase.tradeTypeName === "Import"
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
            : "",
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
      // setRowDto(rowDtoCalculationFunc(row));
      setRowDto(row);

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
  pageSize,
  search
) => {
  try {
    setLoading(true);
    const searchPath = search ? `&search=${search}` : "";
    const res = await Axios.get(
      `/vat/TaxPurchase/GetTaxPurchasePagination?accountId=${accId}&businessUnitId=${buId}&TaxBranchId=${tbId}&TaxTransactionTypeId=1&FromDate=${fromDate}&ToDate=${toDate}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc${searchPath}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const CancelPurchaseEntry_Api = async (purchaseId, setDisabled, cb) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/vat/TaxPurchase/CancelPurchaseEntry?TaxPurchaseId=${purchaseId}`
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
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

export const getCountryDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/hcm/HCMDDL/GetCountryDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const purchaseAttachment_action = async (
  attachment,
  setUploadImage,
  setDisabled
) => {
  setDisabled(true);
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Upload  successfully");
    setDisabled(false);
    setUploadImage(data);
  } catch (error) {
    setDisabled(false);
    toast.error("Document not upload");
  }
};
export const GetHSCodeByTarrifSchedule_api = async (hsCode, type, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetHSCodeByTarrifSchedule?Code=${hsCode}&Type=${type}
      `
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
