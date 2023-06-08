import axios from "axios";
import * as Yup from "yup";
// GetInsuranceTypeDDL
export const GetInsuranceTypeDDL = async (setter) => {
  try {
    const res = await axios.get("/imp/InsurancePolicy/GetInsuranceTypeDDL");
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

// GetProviderDDL
export const GetProviderDDL = async (setter) => {
  try {
    const res = await axios.get("/imp/InsurancePolicy/GetProviderDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

// validation Schema for insurance policy
export const validationSchema = Yup.object().shape({
  coverage: Yup.object().shape({
    label: Yup.string().required("Coverage is required"),
    value: Yup.string().required("Coverage is required"),
  }),
  type: Yup.object().shape({
    label: Yup.string().required("Type is required"),
    value: Yup.string().required("Type is required"),
  }),
  provider: Yup.object().shape({
    label: Yup.string().required("Provider is required"),
    value: Yup.string().required("Provider is required"),
  }),
  paymentBy: Yup.object().shape({
    label: Yup.string().required("Payment By is required"),
    value: Yup.string().required("Payment By is required"),
  }),
  date: Yup.string().required("Date is required"),
  coverNoteNumber: Yup.string().required("Cover note number is required"),
  piAmount: Yup.string().required("PI Amount is required"),
  currency: Yup.string().required("Currency is required"),
  exchangeRate: Yup.string().required("Exchange Rate is required"),
  totalPIAmount: Yup.string().required("Total PI Amount is required"),
  insuredAmount: Yup.string().required("Insured Amount is required"),
  premium: Yup.string().required("Premium is required"),
  stamp: Yup.string().required("Stamp is required"),
  vat: Yup.string().required("VAT is required"),
  total: Yup.string().required("Total is required"),
  discountOnCommission: Yup.string().required(
    "Discount On Commission is required"
  ),
  // coverNoteNumber: Yup.string()
  //   .min(13, "Minimum 13 symbols")
  //   .max(15, "Maximum 15 Symbols")
  //   .required("Account Number required"),
});
