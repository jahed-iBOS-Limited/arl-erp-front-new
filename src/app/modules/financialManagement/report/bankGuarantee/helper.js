import { dateFormatterForInput } from "../../../productionManagement/msilProduction/meltingProduction/helper";

export const initData = {
  sbu: "",
  bank: "",
  bankGuaranteeNumber: "",
  beneficiary: "",
  beneficiaryTitle: "",
  issuingDate: "",
  endingDate: "",
  tDays: "",
  currency: "",
  marginRef: "",

  //   =========
  securityType: "",
  retirementDate: "",
  amount: "",
  inFavOf: "",
  purpose: "",
  responsiblePerson: "",
  note: "",
  attachment: "",
};

export const makePayload = ({
  values,
  entryType,
  attachmentFile,
  selectedBusinessUnit,
  typeId,
  userId,
  location,
}) => {
  return {
    strPartName: entryType || "",
    intSl: 0,
    intId: location?.state?.intId || 0,
    strCode: "",
    intBusinessUnitId: selectedBusinessUnit?.value || 0,
    strBusinessUnit: selectedBusinessUnit?.label || "",
    intSbuId: +values?.sbu?.value || 0,
    strSbu: values?.sbu?.label || "",
    strTransactionType:
      +typeId === 1
        ? "Bank Guarantee"
        : +typeId === 2
        ? "Security Deposit Register"
        : "",
    strSecurityType: values?.securityType?.label || "",
    intBankId: +values?.bank?.value || 0,
    strBankName: values?.bank?.label || "",
    strBankGuaranteeNumber: values?.bankGuaranteeNumber || "",
    strBeneficiaryName: values?.beneficiary?.accountName || "",
    strBeneficiaryNumber: values?.beneficiary?.bankAccNo || "",
    strBeneficiaryTitle: values?.beneficiaryTitle || "",
    dteIssueDate: values?.issuingDate || null,
    dteEndingDate: values?.endingDate || null,
    intTdays: +values?.tDays || 0,
    intCurrencyId: +values?.currency?.value || 0,
    strCurrency: values?.currency?.label || "",
    numAmount: +values?.amount || 0,
    strMarginRef: values?.marginRef || "",
    strInFavOf: values?.inFavOf || "",
    strPurpose: values?.purpose || "",
    strRemarks: values?.note || "",
    intResponsiblePersonId: +values?.responsiblePerson?.value || 0,
    strResponsiblePerson: values?.responsiblePerson?.label || "",
    strAttachment: attachmentFile || "",
    dteReportingDate: values?.dteReportingDate || null,
    isLatestVersion: true,
    intActionBy: userId || 0,
    strStatus: "",
  };
};

export const getModifyData = ({ location }) => {
  return {
    sbu: {
      value: location?.state?.intSbuId,
      label: location?.state?.strSbu,
    },
    bank: {
      value: location?.state?.intBankId,
      label: location?.state?.strBankName,
    },
    bankGuaranteeNumber: location?.state?.strBankGuaranteeNumber,
    beneficiary: {
      value: location?.state?.intBankAccountId,
      label: location?.state?.strBeneficiaryLabel,
      accountName: location?.state?.strBeneficiaryName,
      bankAccNo: location?.state?.strBeneficiaryNumber,
    },
    beneficiaryTitle: location?.state?.strBeneficiaryTitle || "",
    issuingDate: dateFormatterForInput(location?.state?.dteIssueDate),
    endingDate: dateFormatterForInput(location?.state?.dteEndingDate),
    tDays: location?.state?.intTdays,
    currency: {
      value: location?.state?.intCurrencyId,
      label: location?.state?.strCurrency,
    },
    marginRef: location?.state?.strMarginRef,
    securityType: {
      value: location?.state?.strSecurityType,
      label: location?.state?.strSecurityType,
    },
    retirementDate: dateFormatterForInput(location?.state?.dteEndingDate),
    amount: location?.state?.numAmount,
    inFavOf: location?.state?.strInFavOf,
    purpose: location?.state?.strPurpose,
    responsiblePerson: {
      value: location?.state?.intResponsiblePersonId,
      label: location?.state?.strResponsiblePerson,
    },
    note: location?.state?.strRemarks,
  };
};
