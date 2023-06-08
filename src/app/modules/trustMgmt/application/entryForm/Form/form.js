/* eslint-disable react-hooks/exhaustive-deps */
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import TextArea from "../../../../_helper/TextArea";
import InputField from "../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import { attachment_action, cbForAppId, cbForRegistrationId } from "./utils";
import placeholderImg from "../../../../_helper/images/placeholderImg.png";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setDisabled,
  setAppId,
  getDataById,
  setAttachmentFile,
  attachmentFile,
}) {
  const dispatch = useDispatch();
  // attachment file
  const inputAttachFile = useRef(null);

  //ddl
  const [causeOfDonation, getCauseOfDonation] = useAxiosGet();
  const [donationName, getDonationName] = useAxiosGet();
  const [branchName, getBranchName] = useAxiosGet();
  const [branchAddressDDL, getBranchAddressDDL] = useAxiosGet();
  const [combineddl, getCombineddl] = useAxiosGet();

  const generateAPI = (name, autoId = 0, typeId = 0, keyword = null) => {
    return `/hcm/TrustManagement/GetTrustAllDDL?PartName=${name}&AutoId=${autoId}&TypeId=${typeId}&Keyword=${keyword}`;
  };

  useEffect(() => {
    getCombineddl("/hcm/TrustManagement/GetTrustCombineDDL");
  }, []);

  const getCauseOfDonationAction = (donationPurposeId) => {
    getCauseOfDonation(
      generateAPI("CauseOfDonationOrZakat", donationPurposeId)
    );
  };

  const getDonationNameAction = (donationPurposeId, donationCauseId) => {
    getDonationName(
      generateAPI("DonationName", donationPurposeId, donationCauseId)
    );
  };

  const branchAction = (bankId, addressKeyword) => {
    getBranchName(generateAPI("BankBranchDDL", bankId, 0, addressKeyword));
  };

  const branchAddressAction = (bankId) => {
    getBranchAddressDDL(generateAPI("BankBranchAddress", bankId));
  };

  const onButtonAttachmentClick = () => {
    inputAttachFile.current.click();
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        // validationSchema={validationSchema}
        initialValues={{
          ...initData,
          businessUnit:
            combineddl?.unitDDL?.length > 0 ? combineddl?.unitDDL?.[0] : "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, (data) => {
            alert(data?.message);
            resetForm(initData);
            setAppId(null);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          setFieldValue,
          isValid,
          errors,
          touched,
          setValues,
        }) => (
          <>
            <Form className="form form-label-right trustmanagement-entry">
              <div className="form-group row global-form">
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Unit Name
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <NewSelect
                          isHiddenToolTip={true}
                          name="businessUnit"
                          isHiddenLabel={true}
                          options={combineddl?.unitDDL}
                          value={values?.businessUnit}
                          onChange={(valueOption) => {
                            setFieldValue("businessUnit", valueOption);
                          }}
                          placeholder="Business Unit"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Application ID
                      </div>
                    </div>
                    <div className="col-lg-3 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            type="number"
                            value={values?.applicationId}
                            name="applicationId"
                            onChange={(e) => {
                              setFieldValue("applicationId", e.target.value);
                            }}
                            placeholder="Application ID"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1 mb-2 pl-0">
                      <button
                        onClick={(e) => {
                          setAppId(null);
                          if (!values?.applicationId)
                            return toast.warn("Please add application ID");
                          getDataById(
                            `/hcm/TrustManagement/GetTrustAllLanding?PartName=DonationApplicationById&AutoId=${values?.applicationId}&TypeId=0&StatusId=0&Status=`,
                            (data) => {
                              cbForAppId(
                                data,
                                setValues,
                                setAppId,
                                getCauseOfDonationAction,
                                getDonationNameAction,
                                branchAction,
                                setAttachmentFile,
                                branchAddressAction
                              );
                            }
                          );
                        }}
                        type="button"
                        className="btn btn-sm btn-primary"
                      >
                        Show
                      </button>
                    </div>
                    <div className="col-lg-2 mb-2">Payment Type</div>
                    <div className="col-lg-4 d-flex mb-2">
                      <label className="mr-3 ml-2 d-flex">
                        <div>
                          <Field type="radio" name="religion" value="Zakat" />
                        </div>
                        <span className="ml-2">Zakat</span>
                      </label>
                      <label className="d-flex">
                        <div>
                          <Field
                            type="radio"
                            name="religion"
                            value="Donation/Sadaka"
                          />
                        </div>
                        <span className="ml-2">Donation/Sadaka</span>
                      </label>
                    </div>
                    <div className="col-lg-6 mb-2"></div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Application Date
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center trustmgmt-application-date">
                        <span className="mr-2">:</span>
                        <InputField
                          value={values?.applicationDate}
                          name="applicationDate"
                          onChange={(e) => {
                            setFieldValue("applicationDate", e.target.value);
                          }}
                          type="date"
                          placeholder="Application Date"
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        National ID
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.nationalId}
                            name="nationalId"
                            onChange={(e) => {
                              setFieldValue("nationalId", e.target.value);
                            }}
                            placeholder="National ID"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Registration No
                      </div>
                    </div>
                    <div className="col-lg-3 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.registrationNo}
                            name="registrationNo"
                            onChange={(e) => {
                              setFieldValue("registrationNo", e.target.value);
                            }}
                            placeholder="Registration No"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1 mb-2 pl-0">
                      <button
                        onClick={(e) => {
                          setAppId(null);
                          setAttachmentFile();
                          getDataById(
                            `/hcm/TrustManagement/GetTrustAllLanding?PartName=DonationApplicationById&AutoId=0&TypeId=0&StatusId=0&Status=${values?.registrationNo}`,
                            (data) => {
                              cbForRegistrationId(
                                data,
                                setValues,
                                getCauseOfDonationAction,
                                getDonationNameAction,
                                branchAction,
                                branchAddressAction
                              );
                            }
                          );
                        }}
                        type="button"
                        className="btn btn-sm btn-primary"
                      >
                        Show
                      </button>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Hospitals/Institutes
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <NewSelect
                          isHiddenToolTip={true}
                          name="hospitals"
                          isHiddenLabel={true}
                          options={combineddl?.hospitalOrInstituteDDL}
                          value={values?.hospitals}
                          onChange={(valueOption) => {
                            setFieldValue("donationPurpose", "");
                            setFieldValue("hospitals", valueOption);
                          }}
                          placeholder="Hospitals/Institutes"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2"></div>
                    <div className="col-lg-4 mb-2"></div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Donation Purpose
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <NewSelect
                          isHiddenToolTip={true}
                          name="donationPurpose"
                          isHiddenLabel={true}
                          options={combineddl?.donationPurposeDDL}
                          value={values?.donationPurpose}
                          onChange={(valueOption) => {
                            setFieldValue("donationCause", "");
                            setFieldValue("donationPurpose", valueOption);
                            getCauseOfDonationAction(valueOption?.value);
                          }}
                          placeholder="Donation Purpose"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Applicant's Name
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.applicantsName}
                            name="applicantsName"
                            onChange={(e) => {
                              setFieldValue("applicantsName", e.target.value);
                            }}
                            placeholder="Applicant's Name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Cause of Donation/Zakat
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <NewSelect
                          isHiddenToolTip={true}
                          name="donationCause"
                          isHiddenLabel={true}
                          options={causeOfDonation}
                          value={values?.donationCause}
                          onChange={(valueOption) => {
                            setFieldValue("donationName", "");
                            setFieldValue("donationCause", valueOption);
                            getDonationNameAction(
                              values?.donationPurpose?.value,
                              valueOption?.value
                            );
                          }}
                          placeholder="Cause of Donation/Zakat"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Name of Beneficiary
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.beneficiary}
                            name="beneficiary"
                            onChange={(e) => {
                              setFieldValue("beneficiary", e.target.value);
                            }}
                            placeholder="Name of Beneficiary"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Donation Name
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <NewSelect
                          isHiddenToolTip={true}
                          name="donationName"
                          isHiddenLabel={true}
                          options={donationName}
                          value={values?.donationName}
                          onChange={(valueOption) => {
                            setFieldValue("donationName", valueOption);
                          }}
                          placeholder="Donation Name"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Account Holder's Name
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.accountHolder}
                            name="accountHolder"
                            onChange={(e) => {
                              setFieldValue("accountHolder", e.target.value);
                            }}
                            placeholder="Account Holder's Name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2"></div>
                    <div className="col-lg-4 mb-2"></div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Address
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.address}
                            name="address"
                            onChange={(e) => {
                              setFieldValue("address", e.target.value);
                            }}
                            placeholder="Address"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Mode of Payment
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <NewSelect
                          isHiddenToolTip={true}
                          name="modeOfPayment"
                          isHiddenLabel={true}
                          options={combineddl?.modeOfPaymentDDL}
                          value={values?.modeOfPayment}
                          onChange={(valueOption) => {
                            setFieldValue("bankName", "");
                            setFieldValue("accountType", "");
                            setFieldValue("branchName", "");
                            setFieldValue("accountNo", "");
                            setFieldValue("modeOfPayment", valueOption);
                          }}
                          placeholder="Mode of Payment"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Contact No.
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.contactNo}
                            name="contactNo"
                            onChange={(e) => {
                              setFieldValue("contactNo", e.target.value);
                            }}
                            placeholder="Contact No."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Amount
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.amount}
                            name="amount"
                            onChange={(e) => {
                              setFieldValue("amount", e.target.value);
                            }}
                            placeholder="Amount"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Remarks
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <TextArea
                            name="remarks"
                            value={values?.remarks}
                            label="Remarks"
                            placeholder="Remarks"
                            touched={touched}
                            rows="3"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      {values?.modeOfPayment?.label === "Online Advice" && (
                        <div className="d-flex align-items-start h-100">
                          Bank Name
                        </div>
                      )}
                    </div>
                    <div className="col-lg-4 mb-2">
                      {values?.modeOfPayment?.label === "Online Advice" && (
                        <div className="d-flex align-items-start h-100">
                          <span className="mr-2">:</span>
                          <NewSelect
                            isHiddenToolTip={true}
                            name="bankName"
                            isHiddenLabel={true}
                            options={combineddl?.bankDDL}
                            value={values?.bankName}
                            onChange={(valueOption) => {
                              setFieldValue("routing", "");
                              setFieldValue("branchName", "");
                              setFieldValue("branchAddress", "");
                              setFieldValue("bankName", valueOption);
                              branchAddressAction(valueOption?.value);
                            }}
                            placeholder="Bank Name"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                    </div>

                    <div className="col-lg-2 mb-2">
                      {values?.modeOfPayment?.label === "Online Advice" && (
                        <div className="d-flex align-items-start h-100">
                          Address
                        </div>
                      )}
                    </div>
                    <div className="col-lg-4 mb-2">
                      {values?.modeOfPayment?.label === "Online Advice" && (
                        <div className="d-flex align-items-start h-100">
                          <span className="mr-2">:</span>
                          <NewSelect
                            isHiddenToolTip={true}
                            name="branchAddress"
                            isHiddenLabel={true}
                            options={branchAddressDDL}
                            value={values?.branchAddress}
                            onChange={(valueOption) => {
                              setFieldValue("branchName", "");
                              setFieldValue("routing", "");
                              setFieldValue("branchAddress", valueOption);
                              branchAction(
                                values?.bankName?.value,
                                valueOption?.label
                              );
                            }}
                            placeholder="Address"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                    </div>

                    {values?.modeOfPayment?.label === "Online Advice" && (
                      <>
                        <div className="col-lg-2 mb-2">
                          <div className="d-flex align-items-center h-100">
                            Account Type
                          </div>
                        </div>
                        <div className="col-lg-4 mb-2">
                          <div className="d-flex align-items-center">
                            <span className="mr-2">:</span>
                            <div className="w-100">
                              <InputField
                                value={values?.accountType}
                                name="accountType"
                                onChange={(e) => {
                                  setFieldValue("accountType", e.target.value);
                                }}
                                placeholder="Account Type"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-2 mb-2">
                          <div className="d-flex align-items-center h-100">
                            Branch Name
                          </div>
                        </div>
                        <div className="col-lg-4 mb-2">
                          <div className="d-flex align-items-center">
                            <span className="mr-2">:</span>
                            <NewSelect
                              isHiddenToolTip={true}
                              name="branchName"
                              isHiddenLabel={true}
                              options={branchName}
                              value={values?.branchName}
                              onChange={(valueOption) => {
                                setFieldValue(
                                  "routing",
                                  {value : valueOption?.strRoutingNo, label: valueOption?.strRoutingNo}
                                );
                                setFieldValue("branchName", valueOption);
                              }}
                              placeholder="Branch Name"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2 mb-2">
                          <div className="d-flex align-items-center h-100">
                            Routing
                          </div>
                        </div>
                        <div className="col-lg-4 mb-2">
                          <div className="d-flex align-items-center">
                            <span className="mr-2">:</span>
                            <NewSelect
                              isHiddenToolTip={true}
                              name="routing"
                              isHiddenLabel={true}
                              options={[]}
                              value={values?.routing}
                              onChange={(valueOption) => {
                                setFieldValue("routing", valueOption);
                              }}
                              isDisabled
                              placeholder="Routing"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2 mb-2">
                          <div className="d-flex align-items-center h-100">
                            Account No
                          </div>
                        </div>
                        <div className="col-lg-4 mb-2">
                          <div className="d-flex align-items-center">
                            <span className="mr-2">:</span>
                            <div className="w-100">
                              <InputField
                                value={values?.accountNo}
                                name="accountNo"
                                onChange={(e) => {
                                  setFieldValue("accountNo", e.target.value);
                                }}
                                placeholder="Account No"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Effective Date
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center trustmgmt-application-date">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.effectiveDate}
                            name="effectiveDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("effectiveDate", e.target.value);
                            }}
                            placeholder="Effective Date"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Expiry Date
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center trustmgmt-application-date">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.expiryDate}
                            type="date"
                            name="expiryDate"
                            onChange={(e) => {
                              setFieldValue("expiryDate", e.target.value);
                            }}
                            placeholder="Expiry Date"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Attachment
                        {attachmentFile && (
                          <span
                            className="ml-2 pointer"
                            onClick={() => {
                              dispatch(
                                getDownlloadFileView_Action(attachmentFile)
                              );
                            }}
                          >
                            <i
                              className="fa fa-eye"
                              aria-hidden="true"
                              style={{ marginRight: "5px", color: "#0072E5" }}
                            ></i>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div
                        className={
                          attachmentFile
                            ? "image-upload-box with-img"
                            : "image-upload-box"
                        }
                        onClick={onButtonAttachmentClick}
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          height: "35px",
                        }}
                      >
                        <input
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              attachment_action(e.target.files)
                                .then((data) => {
                                  setAttachmentFile(data?.[0]?.id);
                                })
                                .catch((error) => {
                                  setAttachmentFile("");
                                });
                            }
                          }}
                          type="file"
                          ref={inputAttachFile}
                          id="file"
                          style={{ display: "none" }}
                        />
                        <div>
                          {!attachmentFile && (
                            <img
                              style={{ maxWidth: "65px" }}
                              src={placeholderImg}
                              className="img-fluid"
                              alt="Upload or drag documents"
                            />
                          )}
                        </div>
                        {attachmentFile && (
                          <div className="d-flex align-items-center">
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: "500",
                                color: "#0072E5",
                                cursor: "pointer",
                                margin: "0px",
                              }}
                            >
                              {attachmentFile}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
