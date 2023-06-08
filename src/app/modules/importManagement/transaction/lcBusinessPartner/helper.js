import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import decimalToPercentage from "../../../_helper/_decimalToPercentage";
import { _formatMoney } from "../../../_helper/_formatMoney";
import percentageToDecemal from "../../../_helper/_percentageToDecemal";

// Get Supplier List DDL
// https://localhost:44396/imp/LCBusinessPartner/GetSupplierListDDL?accountId=2&businessUnitId=164&partnerTypeId=16
export const GetSupplierListDDL = async (
  accId,
  buId,
  partnerTypeId,
  setter
) => {
  try {
    const res = await axios.get(
      `/imp/LCBusinessPartner/GetSupplierListDDL?accountId=${accId}&businessUnitId=${buId}&partnerTypeId=${partnerTypeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetBankListDDL = async (setter) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetBankListForLCBusinessPartnerDDL`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

// Get Business Type DDL
export const BusinessPartnerTypeDDL = async (setter) => {
  try {
    const res = await axios.get(
      `/imp/LCBusinessPartner/BusinessPartnerTypeDDL`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

// Create Business Partner"
export const CreateBusinessPartner = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/imp/LCBusinessPartner/CreateBusinessPartner`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.message || "Submitted  successfully");
      cb();
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// Create Business Partner for Bank"
export const CreateBusinessPartnerForBank = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/imp/FormulaForCalculation/CreateFormulaForBankCharge`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.message || "Submitted  successfully");
      cb();
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// Create Business Partner fot cnf"
export const CreateBusinessPartnerForCnF = async (payload, cb) => {
  if (payload.length < 1) return toast.warn("Please add atleast one row");
  try {
    const res = await axios.post(
      `/imp/FormulaForCalculation/CreateFormulaForCnFCharge`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.message || "Submitted  successfully");
      cb();
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

// Create Insurance Company"
export const CreateInsuranceCompany = async (
  setDisabled,
  values,
  accountId,
  businessUnitId,
  userId,
  cb
) => {
  try {
    setDisabled(true);
    const payload = {
      accountId: accountId,
      businessUnitId: businessUnitId,
      lcbusinesspartnerId: +values?.supplier?.value,
      businessPartnerName: values?.supplier?.label,
      lcPartnerTypeId: +values?.type?.value,
      lcPartnerTypeName: values?.type?.label,
      numInsuredAddRate: percentageToDecemal(+values?.insuredAmount),
      numPremiumRate: percentageToDecemal(+values?.premiumRate),
      numStampChargeAir: percentageToDecemal(+values?.airStampCharges),
      airStampFixed: +values?.airStampFixed,
      numStampChargeLand: percentageToDecemal(+values?.landStampCharges),
      landStampFixed: +values?.landStampFixed,
      numStampChargeSea: percentageToDecemal(values?.seaStampCharges),
      seaStampFixed: +values?.seaStampFixed,
      numVatrate: percentageToDecemal(+values?.vatRate),
      numDiscountRate: percentageToDecemal(+values?.discountRate),
      coverNotePrefix: values?.coverNotePrefix,
      policyPrefix: values?.policyPrefix,
      numCommissionPercentage: percentageToDecemal(
        +values?.commissionPercentage
      ),
      isCommissionAdjustWithBill: values?.commissionAdjustWithBill || false,
      actionBy: userId,
    };
    const res = await axios.post(
      `/imp/FormulaForCalculation/CreateFormulaForInsurance`,
      payload
    );
    if (res.status === 200 && res?.data) {
      setDisabled(false);
      toast.success(res.data.message || "Submitted  successfully");
      cb();
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error.response.data.message);
  }
};
// https://localhost:44396/imp/LCBusinessPartner/BusinessPartnerLandingPasignation?accountId=2&businessUnitId=164&searchTerm=AGRANI%20BANK%20LTD&PageSize=100&PageNo=1&viewOrder=asc
// Get Landing Data
export const getLandingData = async (
  accId,
  buId,
  searchValue,
  PageNo,
  PageSize,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    let query = `/imp/LCBusinessPartner/BusinessPartnerLandingPasignation?accountId=${accId}&businessUnitId=${buId}`;
    if (searchValue) {
      query += `&searchTerm=${searchValue}`;
    }
    query += `&PageSize=${PageSize}&PageNo=${PageNo}&viewOrder=dsce`;
    const res = await axios.get(query);
    setLoading(false);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
    toast.warning(error?.response?.data?.message);
  }
};
// https://localhost:44396/imp/ImportCommonDDL/GetChargeInformation?accountId=2&businessUnitid=164&chargeTypeId=17&supplierId=1249
export const checkBusinessPartner = async (
  accId,
  buId,
  chargeTypeId,
  supplierId,
  setter,
  setRowDto,
  setAvailable
) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetChargeInformation?accountId=${accId}&businessUnitid=${buId}&chargeTypeId=${chargeTypeId}&supplierId=${supplierId}`
    );

    if (res?.status === 200) {
      // res.data = {res.data}
      const data = {
        type: {
          value: res?.data?.partnerTypeId,
          label: res?.data?.partnerType,
        },
        supplier: {
          value: res?.data?.businessPartnerId,
          label: res?.data?.businessPartnerName,
        },
        shippingAgent: "",
        bank: {
          value: res?.data?.bankId,
          label: res?.data?.bankName,
        },
        provider: "",
        coverNotePrefix: res?.data?.coverNotePrefix,
        policyPrefix: res?.data?.policyPrefix,
        commissionPercentage: decimalToPercentage(
          res?.data?.commissionPercentage
        ),
        commissionAdjustWithBill: res?.data?.isCommissionAdjustWithBill,
        insuredAmount: decimalToPercentage(res?.data?.insuredAddRate),
        premiumRate: decimalToPercentage(res?.data?.premiumRate),
        vatRate: decimalToPercentage(res?.data?.numVatrate),
        discountRate: decimalToPercentage(res?.data?.discountRate),
        airStampFixed: res?.data?.airStampFixed,
        airStampCharges: decimalToPercentage(res?.data?.stampChargeAir),
        landStampFixed: res?.data?.landStampFixed,
        landStampCharges: decimalToPercentage(res?.data?.stampChargeLand),
        seaStampFixed: res?.data?.seaStampFixed,
        seaStampCharges: decimalToPercentage(res?.data?.stampChargeSea),
        atsightCommissionQ1: decimalToPercentage(res?.data?.numComSightQ1),
        atsightCommissionQ2: decimalToPercentage(res?.data?.numComSightQ2),
        upasCommissionQ1: decimalToPercentage(res?.data?.numComUpasQ1),
        upasCommissionQ2: decimalToPercentage(res?.data?.numComUpasQ2),
        swiftCharge: res?.data?.numSwift,
        stampCharge: res?.data?.numStamp,
        stationaryCharge: res?.data?.numStationary,
        otherCharge: res?.data?.numOtherBankCharge,
        isToleranceIncluded: res?.data?.isToleranceInclude,
        isMinChargeIncluded: res?.data?.isMinimumApplied,
        minCharge: "",
        ddCommissionRate: decimalToPercentage(res?.data?.numComDdrate),
        ddCommissionMinimum: decimalToPercentage(res?.data?.numComDdminimum),
        ttCommissionRate: decimalToPercentage(res?.data?.numComTtrate),
        ttCommisionMinimum: decimalToPercentage(res?.data?.numComTtminimum),
      };
      setter(data);
      setRowDto(
        res?.data?.row.map((item) => {
          return {
            ...item,
            numRate: item?.numRate * 100,
            numToAmount: item?.numToAmount || "",
          };
        })
      );
      // setter(res?.data);
      setAvailable(true);
    }
  } catch (error) {
    if (error) toast.warning(error?.response?.data?.message);
    setter({});
    setAvailable(false);
  }
};

// Delete Business Partner
export const DeleteBusinessPartner = async (lcPartnerId, getLandingData) => {
  try {
    const res = await axios.get(
      `/imp/LCBusinessPartner/DeleteBusinessPartner?LCPartnerId=${lcPartnerId}`
    );
    if (res.status === 200) {
      toast.success(res.message || "Deleted  successfully");
      getLandingData();
    }
  } catch (error) {
    toast.warning(error?.response?.data?.message);
  }
};
export const GetBusinessPartnerDetails = async (
  profileID,
  businessUnitId,
  businessID,
  businessPartnerTypeId,
  setter,
  setRowDto
) => {
  try {
    const res = await axios.get(
      `/imp/FormulaForCalculation/GetFormulaInsuranceChargeByBusinessPartnerId?accountId=${profileID}&businessUnitId=${businessUnitId}&lcBusinessPartnerId=${businessID}&businessPartnerTyepId=${businessPartnerTypeId}`
    );
    const data = {
      type: {
        value: res?.data?.partnerTypeId,
        label: res?.data?.partnerType,
      },
      supplier: {
        value: res?.data?.businessPartnerId,
        label: res?.data?.businessPartnerName,
      },
      shippingAgent: "",
      bank: {
        value: res?.data?.bankId,
        label: res?.data?.bankName,
      },
      provider: "",
      coverNotePrefix: res?.data?.coverNotePrefix,
      policyPrefix: res?.data?.policyPrefix,
      commissionPercentage: decimalToPercentage(
        res?.data?.commissionPercentage
      ),
      commissionAdjustWithBill: res?.data?.isCommissionAdjustWithBill,
      insuredAmount: decimalToPercentage(res?.data?.insuredAddRate),
      premiumRate: decimalToPercentage(res?.data?.premiumRate),
      vatRate: decimalToPercentage(res?.data?.numVatrate),
      discountRate: decimalToPercentage(res?.data?.discountRate),
      airStampFixed: res?.data?.airStampFixed,
      airStampCharges: decimalToPercentage(res?.data?.stampChargeAir),
      landStampFixed: res?.data?.landStampFixed,
      landStampCharges: _formatMoney(
        decimalToPercentage(res?.data?.stampChargeLand)
      ),
      seaStampFixed: res?.data?.seaStampFixed,
      seaStampCharges: decimalToPercentage(res?.data?.stampChargeSea),
      atsightCommissionQ1: decimalToPercentage(res?.data?.numComSightQ1),
      atsightCommissionQ2: decimalToPercentage(res?.data?.numComSightQ2),
      upasCommissionQ1: decimalToPercentage(res?.data?.numComUpasQ1),
      upasCommissionQ2: decimalToPercentage(res?.data?.numComUpasQ2),
      swiftCharge: res?.data?.numSwift,
      stampCharge: res?.data?.numStamp,
      stationaryCharge: res?.data?.numStationary,
      otherCharge: res?.data?.numOtherBankCharge,
      isToleranceIncluded: res?.data?.isToleranceInclude,
      isMinChargeIncluded: res?.data?.isMinimumApplied,
      minCharge: "",
      ddCommissionRate: decimalToPercentage(res?.data?.numComDdrate),
      ddCommissionMinimum: decimalToPercentage(res?.data?.numComDdminimum),
      ttCommissionRate: decimalToPercentage(res?.data?.numComTtrate),
      ttCommisionMinimum: decimalToPercentage(res?.data?.numComTtminimum),
    };
    setter(data);
    const rows = res?.data?.row.map((item) => {
      return {
        ...item,
        numRate: item?.numRate * 100,
        numToAmount: item?.numToAmount || "",
      };
    });
    console.log(res);
    console.log(rows);
    console.log(rows);
    setRowDto(rows);
  } catch (error) {
    toast.warning(error?.response?.data?.message);
  }
};

export const validationSchema = Yup.object().shape({
  type: Yup.object()
    .shape({
      label: Yup.string().required("Type is required"),
      value: Yup.string().required("Type is required"),
    })
    .typeError("Type is required"),
  supplier: Yup.object()
    .shape({
      label: Yup.string().required("Supplier is required"),
      value: Yup.string().required("Supplier is required"),
    })
    .typeError("Supplier is required"),
});

export const supplierValidationSchema = Yup.object().shape({
  type: Yup.object()
    .shape({
      label: Yup.string().required("Type is required"),
      value: Yup.string().required("Type is required"),
    })
    .typeError("Type is required"),
  // shippingAgent: Yup.string().required("Supplier is required"),
});
export const insuranceValidationSchema = Yup.object().shape({
  type: Yup.object()
    .shape({
      label: Yup.string().required("Type is required"),
      value: Yup.string().required("Type is required"),
    })
    .typeError("Type is required"),
  supplier: Yup.object()
    .shape({
      label: Yup.string().required("Supplier is required"),
      value: Yup.string().required("Supplier is required"),
    })
    .typeError("Supplier is required"),
  // coverNotePrefix: Yup.string().required("Cover note prefix is required"),
  // policyPrefix: Yup.string().required("Policy prefix is required"),
  // commissionPercentage: Yup.number()
  //   .min(0, "Commission has to be a valid number")
  //   .required("Commission is required"),
  // insuredAmount: Yup.number()
  //   .min(0, "Insured Amount has to be a valid number")
  //   .required("Insured Amount is required"),
  // premiumRate: Yup.number()
  //   .min(0, "Premium Rate has to be a valid number")
  //   .required("Premium Rate is required"),
  // vatRate: Yup.number()
  //   .min(0, "VAT Rate has to be a valid number")
  //   .required("VAT Rate is required"),

  // discountRate: Yup.number()
  //   .min(0, "Discount Rate has to be a valid number")
  //   .required("Discount Rate is required"),
  // airStampCharges: Yup.number()
  //   .min(0, "Amount has to be a valid number")
  //   .required("Amount is required"),
  // landStampCharges: Yup.number()
  //   .min(0, "Amount has to be a valid number")
  //   .required("Amount is required"),
  // seaStampCharges: Yup.number()
  //   .min(0, "Amount has to be a valid number")
  //   .required("Amount is required"),
});

//for type Bank
export const validationSchemaForTypeBank = Yup.object().shape({
  type: Yup.object()
    .shape({
      label: Yup.string().required("Type is required"),
      value: Yup.string().required("Type is required"),
    })
    .typeError("Type is required"),
  supplier: Yup.object()
    .shape({
      label: Yup.string().required("Supplier is required"),
      value: Yup.string().required("Supplier is required"),
    })
    .typeError("Supplier is required"),

  bank: Yup.object()
    .shape({
      label: Yup.string().required("Bank is required"),
      value: Yup.string().required("Bank is required"),
    })
    .typeError("Bank is required"),
  // atsightCommissionQ1: Yup.number()
  //   .min(0, "Atsight Commission Q1 has to be a valid number")
  //   .required("Atsight Commission Q1 is required"),
  // atsightCommissionQ2: Yup.number()
  //   .min(0, "Atsight Commission Q2 has to be a valid number")
  //   .required("Atsight Commission Q2 is required"),
  // upasCommissionQ1: Yup.number()
  //   .min(0, "UPAS Commission Q1 has to be a valid number")
  //   .required("UPAS Commission Q1 is required"),
  // upasCommissionQ2: Yup.number()
  //   .min(0, "UPAS Commission Q2 has to be a valid number")
  //   .required("UPAS Commission Q2 is required"),
  // swiftCharge: Yup.number()
  //   .min(0, "Swift Charge has to be a valid number")
  //   .required("Swift Charge is required"),
  // stampCharge: Yup.number()
  //   .min(0, "Stamp Charge has to be a valid number")
  //   .required("Stamp Charge is required"),
  // stationaryCharge: Yup.number()
  //   .min(0, "Stationary Charge has to be a valid number")
  //   .required("Stationary Charge is required"),
  // otherCharge: Yup.number()
  //   .min(0, "Other Charge has to be a valid number")
  //   .required("Other Charge is required"),
  // ddCommissionRate: Yup.number()
  //   .min(0, "DD Commission Rate has to be a valid number")
  //   .required("DD Commission Rate is required"),
  // ddCommissionMinimum: Yup.number()
  //   .min(0, "DD Commission Minimum has to be a valid number")
  //   .required("DD Commission Minimum is required"),
  // ttCommissionRate: Yup.number()
  //   .min(0, "TT Commission Rate has to be a valid number")
  //   .required("TT Commission Rate is required"),
  // ttCommisionMinimum: Yup.number()
  //   .min(0, "TT Commission Minimum has to be a valid number")
  //   .required("TT Commission Minimum is required"),
});

export const validationSchemaForCRF = Yup.object().shape({
  type: Yup.object()
    .shape({
      label: Yup.string().required("Type is required"),
      value: Yup.string().required("Type is required"),
    })
    .typeError("Type is required"),
  supplier: Yup.object()
    .shape({
      label: Yup.string().required("Supplier is required"),
      value: Yup.string().required("Supplier is required"),
    })
    .typeError("Supplier is required"),
  from: Yup.number()
    .min(0, "From has to be a valid number")
    .required("From is required"),
  // to: Yup.number()
  //   .min(0, "To has to be a valid number")
  //   .required("To is required"),
  // rate: Yup.number()
  //   .min(0, "Rate has to be a valid number")
  //   .required("Rate is required"),

  // shippingAgent: Yup.string().required("Supplier is required"),
});
