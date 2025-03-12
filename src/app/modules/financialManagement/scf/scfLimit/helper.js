import * as Yup from "yup";

//===Common Page===//

//===Landing Page===//
export const landingInitData = {};

export const scfLimitLandingTableHeader = [
  "SL",
  "Supplier",
  "Bank Name",
  "Acc No",
  "Limit",
  "Updated Date",
  "Tenor",
  "Transaction Ref",
  "Limit Expiry Date",
  "Interest Rate",
  "Remarks",
  "Actions",
];

// fetch scf limit data
export const fetchSCFLimitData = ({
  pageSize,
  pageNo,
  selectedBusinessUnit,
  getScfLimitLandingData,
}) => {
  getScfLimitLandingData(
    `/fino/PaymentRequest/ScfLimitLanding?businessUnit=${selectedBusinessUnit?.value}&pageNo=${pageNo}&pageSize=${pageSize}`
  );
};

//===Create Page===//
// init data
export const createInitData = {
  supplier: "",
  bankAccountNo: "",
  disbursementType: "",
  limit: "",
  tenorDays: "",
  transactionRef: "",
  limitExpiryDate: "",
  interestRate: "",
  remarks: "",
};

// disbursement type ddl
export const disbursementTypeDDL = [
  {
    value: "Individual",
    label: "Individual",
  },
  { value: "Consolidated", label: "Consolidated" },
];

// validation
export const createValidationSchema = Yup.object().shape({
  item: Yup.object()
    .shape({
      label: Yup.string().required("Item is required"),
      value: Yup.string().required("Item is required"),
    })
    .typeError("Item is required"),

  remarks: Yup.string().required("Remarks is required"),
  amount: Yup.number().required("Amount is required"),
  date: Yup.date().required("Date is required"),
});
