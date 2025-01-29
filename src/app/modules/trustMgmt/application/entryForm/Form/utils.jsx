import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export const generatePayload = (obj) => {
  const { appId, values, attachmentFile, userId } = obj;
  return {
    // intType 1 = Create
    // intType 2 = Update
    intType: appId ? 2 : 1,
    intAppId: appId || 0,
    dteApplicationDate: values?.applicationDate,
    strApplicantName: values?.applicantsName,
    strAccntholdername: values?.accountHolder,
    strPatientName: values?.beneficiary,
    strAddress: values?.address,
    strContactNo: values?.contactNo,
    strNationalID: values?.nationalId,
    intOrganizationID: values?.hospitals?.value,
    intDonationPurposeID: values?.donationPurpose?.value,
    intDonationTypeID: values?.donationCause?.value,
    intDonationNameID: values?.donationName?.value,
    intModeOfPaymentID: values?.modeOfPayment?.value,
    monAmount: values?.amount,
    strRemarks: values?.remarks || "",
    intInsertBy: userId,
    intRelizionID: values?.religion === "Zakat" ? 1 : 2,
    strRegistrationNo: "",
    intBankID: values?.bankName?.value || 0,
    intBranchID: values?.branchName?.value || 0,
    strAccountNo: values?.accountNo || "",
    strAccountType: values?.accountType || "",
    dteEffectiveDate: values?.effectiveDate,
    dteEndDate: values?.expiryDate,
    intUnitID: values?.businessUnit?.value,
    strAttachmentUrl: attachmentFile,
  };
};

export const setFormikData = (data, setValues, setAttachmentFile) => {
  const {
    dteApplicationDate,
    dteEffectiveDate,
    dteEndDate,
    intApplicationID,
    intBankID,
    intBranchID,
    intDonationNameID,
    intDonationPurposeID,
    intDonationTypeID,
    intModeOfPaymentID,
    intOrganizationID,
    intRelizionID,
    intUnitID,
    monAmount,
    strAccountHolderName,
    strAccountNo,
    strAccountType,
    strAddress,
    strApplicantName,
    strContactNo,
    strDonationName,
    strDonationPurpose,
    strDonationType,
    strModeOfPayment,
    strNationalID,
    strOrganizationName,
    strPatientName,
    strRegistrationNo,
    strRemarks,
    strBankBranchName,
    strBankName,
    strBusinessUnitCode,
    strAttachmentUrl,
    strBankBranchAddress,
    strRoutingNo
  } = data;
  setValues({
    businessUnit:
      intUnitID && strBusinessUnitCode
        ? { value: intUnitID, label: strBusinessUnitCode }
        : "",
    applicationId: intApplicationID || "",
    religion:
      intRelizionID === 1 ? "Zakat" : intRelizionID === 2 ? "Donation/Sadaka" : "",
    applicationDate: _dateFormatter(dteApplicationDate) || "",
    nationalId: strNationalID || "",
    registrationNo: strRegistrationNo || "",
    routing: strRoutingNo ? {value : strRoutingNo, label: strRoutingNo} : "",
    hospitals:
      intOrganizationID && strOrganizationName
        ? { value: intOrganizationID, label: strOrganizationName }
        : "",
      branchAddress:
      strBankBranchAddress 
        ? { value: strBankBranchAddress, label: strBankBranchAddress }
        : "",
    donationPurpose:
      intDonationPurposeID && strDonationPurpose
        ? { value: intDonationPurposeID, label: strDonationPurpose }
        : "",
    applicantsName: strApplicantName || "",
    donationCause:
      intDonationTypeID && strDonationType
        ? { value: intDonationTypeID, label: strDonationType }
        : "",
    donationName:
      intDonationNameID && strDonationName
        ? { value: intDonationNameID, label: strDonationName }
        : "",
    beneficiary: strPatientName || "",
    accountHolder: strAccountHolderName || "",
    modeOfPayment:
      intModeOfPaymentID && strModeOfPayment
        ? { value: intModeOfPaymentID, label: strModeOfPayment }
        : "",
    address: strAddress || "",
    contactNo: strContactNo || "",
    amount: monAmount || "",
    remarks: strRemarks || "",
    effectiveDate: _dateFormatter(dteEffectiveDate) || "",
    expiryDate: _dateFormatter(dteEndDate) || "",
    bankName:
      intBankID && strBankName ? { value: intBankID, label: strBankName } : "",
    accountType: strAccountType || "",
    branchName:
      intBranchID && strBankBranchName
        ? { value: intBranchID, label: strBankBranchName }
        : "",
    accountNo: strAccountNo || "",
  });
  setAttachmentFile && setAttachmentFile(strAttachmentUrl || "");
};

export const cbForAppId = (
  data,
  setValues,
  setAppId,
  getCauseOfDonationAction,
  getDonationNameAction,
  branchAction,
  setAttachmentFile,
  branchAddressAction
) => {
  if (data?.length < 1) return toast.warn("No data found");
  if (data?.[0]?.ysnApprove)
    return toast.warn("You can not modify this, application is approved");

  setAppId(data?.[0]?.intApplicationID);
  setFormikData(data?.[0], setValues, setAttachmentFile);
  getCauseOfDonationAction(data?.[0]?.intDonationPurposeID);
  getDonationNameAction(
    data?.[0]?.intDonationPurposeID,
    data?.[0]?.intDonationTypeID
  );
  if (data?.[0]?.intBankID) {
    branchAddressAction(data?.[0]?.intBankID);
  }
  if(data?.[0]?.intBankID && data?.[0]?.strBankBranchAddress){
    branchAction(data?.[0]?.intBankID, data?.[0]?.strBankBranchAddress);
  }
};

export const cbForRegistrationId = (
  data,
  setValues,
  getCauseOfDonationAction,
  getDonationNameAction,
  branchAction,
  branchAddressAction
) => {
  if (data?.length < 1) return toast.warn("No data found");
  setFormikData(data?.[0], setValues);
  getCauseOfDonationAction(data?.[0]?.intDonationPurposeID);
  getDonationNameAction(
    data?.[0]?.intDonationPurposeID,
    data?.[0]?.intDonationTypeID
  );
  if (data?.[0]?.intBankID) {
    branchAddressAction(data?.[0]?.intBankID);
  }
  if(data?.[0]?.intBankID && data?.[0]?.strBankBranchAddress){
    branchAction(data?.[0]?.intBankID, data?.[0]?.strBankBranchAddress);
  }
};

export const attachment_action = async (attachment, setLoading) => {
  setLoading && setLoading(true);
  let formData = new FormData();
  formData.append("files", attachment[0]);
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setLoading && setLoading(false);
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    setLoading && setLoading(false);
    toast.error("File Size is too large or inValid File!");
    return error;
  }
};
