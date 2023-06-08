import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import "./form.css";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { generatePayload } from "./utils";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  businessUnit: "",
  applicationId: "",
  religion: "Zakat",
  applicationDate: _todayDate(),
  nationalId: "",
  registrationNo: "",
  hospitals: "",
  donationPurpose: "",
  applicantsName: "",
  donationCause: "",
  donationName: "",
  beneficiary: "",
  accountHolder: "",
  modeOfPayment: "",
  address: "",
  branchAddress: "",
  contactNo: "",
  amount: "",
  remarks: "",
  routing: "",
  effectiveDate: "",
  expiryDate: "",
  bankName: "",
  accountType: "",
  branchName: "",
  accountNo: "",
};
export default function ApplicationEntryForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [, saveData, loading] = useAxiosPost();
  const [, getDataById, dataByIdLoading] = useAxiosGet();
  const [appId, setAppId] = useState(null);

  //  attachment file
  const [attachmentFile, setAttachmentFile] = useState("");

  const { profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    const {
      businessUnit,
      religion,
      applicationDate,
      // nationalId,
      hospitals,
      donationPurpose,
      applicantsName,
      donationCause,
      donationName,
      beneficiary,
      accountHolder,
      address,
      modeOfPayment,
      amount,
      contactNo,
      effectiveDate,
      expiryDate,
      accountNo,
      branchName,
      accountType,
      bankName,
    } = values;
    if (!businessUnit) return toast.warn("Unit name is required");
    if (!religion) return toast.warn("Religion is required");
    if (!applicationDate) return toast.warn("Application date is required");
    // if (!nationalId) return toast.warn("National ID is required");
    if (!hospitals) return toast.warn("Hospitals is required");
    if (!donationPurpose) return toast.warn("Donation purpose is required");
    if (!applicantsName) return toast.warn("Applicants name is required");
    if (!donationCause) return toast.warn("Donation cause is required");
    if (!donationName) return toast.warn("Donation name is required");
    if (!beneficiary) return toast.warn("Beneficiary is required");
    if (!accountHolder) return toast.warn("Account holder is required");
    if (!address) return toast.warn("Address is required");
    if (!modeOfPayment) return toast.warn("Mode of payment is required");
    if (!amount) return toast.warn("Amount is required");
    if (amount < 1) return toast.warn("Amount should be positive number");
    if (!contactNo) return toast.warn("Contact no is required");
    if (!effectiveDate) return toast.warn("Effective date is required");
    if (!expiryDate) return toast.warn("Expiry date is required");
    if (!attachmentFile) return toast.warn("Attachment is required");

    if (
      modeOfPayment?.label === "Online Advice" &&
      (!bankName || !accountType || !branchName || !accountNo)
    )
      return toast.warn(
        "Bank name, Account type, Branch name, Account no are required"
      );
      

    saveData(
      `/hcm/TrustManagement/CreateZakarApplication`,
      generatePayload({
        appId: appId,
        values,
        attachmentFile: attachmentFile || "",
        userId: profileData?.userId,
      }),
      cb,
      false
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={"Application Entry"}
      getProps={setObjprops}
      isHiddenBack={true}
      isDisabled={isDisabled}
      submitBtnText={appId ? `Update(Id: ${appId})` : "Save"}
    >
      {(isDisabled || loading || dataByIdLoading) && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        setDisabled={setDisabled}
        setAppId={setAppId}
        getDataById={getDataById}
        setAttachmentFile={setAttachmentFile}
        attachmentFile={attachmentFile}
      />
    </IForm>
  );
}
