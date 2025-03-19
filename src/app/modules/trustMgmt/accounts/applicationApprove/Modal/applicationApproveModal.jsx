import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import TextArea from "../../../../_helper/TextArea";

const initData = {
  effectiveDate: "",
  expiryDate: "",
  amount: "",
  remarks: "",
};

export const ApplicationApproveModal = ({
  singleData,
  getData,
  setisShowModal,
  filterObj,
}) => {
  const [modifyData, setModifyData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [landingData, getApproveData] = useAxiosGet();

  const dispatch = useDispatch();

  const profileData = useSelector(
    (state) => state?.authData?.profileData,
    shallowEqual
  );
  const getLadingData = (
    name,
    fromDate,
    toDate,
    unitId,
    amount,
    userId,
    typeId,
    applicationId,
    rejectionCause
  ) => {
    return `/hcm/TrustManagement/GetTrustAllLanding?PartName=${name}&UnitId=${unitId}&FromDate=${fromDate}&ToDate=${toDate}&amount=${amount}&userId=${userId}&typeId=${typeId}&ApplicationId=${applicationId}&RejectionCause=${rejectionCause}`;
  };

  useEffect(() => {
    if (singleData) {
      setModifyData({
        effectiveDate: _dateFormatter(singleData?.dteEffectiveDate),
        expiryDate: _dateFormatter(singleData?.dteEndDate),
        amount: singleData?.monAmount,
        remarks: singleData?.strRemarks,
      });
    }
  }, [singleData]);

  const callBack = (data) => {
    toast.success(data[0]?.Column1 || "Successfully Submitted");
    setisShowModal(false);
    if (filterObj) {
      getData(
        getLadingData(
          "GetAllPendingDonationApplicationList",
          filterObj?.fromDate,
          filterObj?.toDate,
          filterObj?.unitId || 4,
          "",
          "",
          "",
          "",
          ""
        )
      );
    }
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        // validationSchema={validationSchema}
        initialValues={singleData ? modifyData : initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group row global-form">
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Effective Date
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.effectiveDate}
                            name="effectiveDate"
                            type="date"
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
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.expiryDate}
                            name="expiryDate"
                            type="date"
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
                            type="number"
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
                            placeholder="Remarks..."
                            touched={touched}
                            rows="2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="text-right">
                        <button
                          type="button"
                          style={{ fontSize: "12px" }}
                          className="btn btn-primary"
                          onClick={() => {
                            getApproveData(
                              getLadingData(
                                "DonationApplicationApproval",
                                values?.effectiveDate,
                                values?.expiryDate,
                                "",
                                values?.amount,
                                profileData?.userId,
                                1,
                                singleData?.intApplicationID,
                                values?.remarks
                              ),
                              callBack
                            );
                          }}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="application-details mb-3">
                <div className="details-title text-center mt-4 mb-5">
                  <h4>Application Details Information</h4>
                </div>
                <div style={{ marginLeft: "50px" }} className="row">
                  <div className="col-md-6">
                    <p><strong>Applicant's Name :</strong> {singleData?.strApplicantName}</p>
                    <p><strong>Name of Beneficiary :</strong> {singleData?.strPatientName}</p>
                    <p>
                      <strong>Account Holder's Name :</strong> {singleData?.strAccountHolderName}
                    </p>
                    <p><strong>Address :</strong> {singleData?.strAddress}</p>
                    <p><strong>Contact No :</strong> {singleData?.strContactNo}</p>
                    <p><strong>Remarks :</strong> {singleData?.strRemarks}</p>
                    <p>
                      <strong>Effective Date :</strong> 
                      {_dateFormatter(singleData?.dteEffectiveDate)}
                    </p>
                    <p><strong>Expiry Date : </strong> {_dateFormatter(singleData?.dteEndDate)}</p>
                    <p><strong>Bank Name :</strong> {singleData?.strBankName}</p>
                    <p><strong>Bank Branch :</strong> {singleData?.strBankBranchName}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Amount :</strong> {singleData?.monAmount}</p>
                    <p><strong>Mode of Payment :</strong> {singleData?.strModeOfPayment}</p>
                    <p><strong>Donation Name :</strong> {singleData?.strDonationName}</p>
                    <p>
                      <strong>Cause of Donation/Zakat :</strong> {singleData?.strDonationType}
                    </p>
                    <p><strong>Donation Purpose :</strong> {singleData?.strDonationPurpose}</p>
                    <p>
                      <strong>Hospitals/Institutes :</strong> {singleData?.strOrganizationName}
                    </p>
                    <p><strong>National ID :</strong> {singleData?.strNationalID}</p>
                    
                    <p><strong>Account Holder :</strong> {singleData?.strAccountHolderName}</p>
                    <p><strong>Account Type :</strong> {singleData?.strAccountType}</p>
                    <p><strong>Account No :</strong> {singleData?.strAccountNo}</p>
                    <p
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(
                            singleData?.strAttachmentUrl
                          )
                        );
                      }}
                    >
                      <strong>Attachment :</strong> <span style={{color: "#3699FF" ,cursor: "pointer"}}>{singleData?.strAttachmentUrl}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
