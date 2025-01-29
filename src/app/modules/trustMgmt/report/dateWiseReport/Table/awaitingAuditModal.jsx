import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export const AwaitingAuditModal = ({
  awaitingAuditState: { data },
  filterObj,
  setAwaitingAuditState,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [landingData, getApproveData] = useAxiosGet();
  const [, saveData] = useAxiosGet();

  const dispatch = useDispatch();

  const profileData = useSelector(
    (state) => state?.authData?.profileData,
    shallowEqual
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        // validationSchema={validationSchema}
        initialValues={{}}
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
              <div className="text-right mt-3">
                <button
                  onClick={() => {
                    saveData(
                      `/hcm/TrustManagement/GetTrustAllLanding?PartName=DonationApplicationAuditCheck&UnitId=&FromDate=&ToDate=&amount=&userId=${profileData?.userId}&typeId=1&ApplicationId=${data?.intApplicationID}&RejectionCause=`,
                      () => {
                        filterObj.saveHandler(filterObj.values);
                        setAwaitingAuditState({ data: {}, isShowModal: false });
                      }
                    );
                  }}
                  type="button"
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
              <div className="application-details mb-3">
                <div className="details-title text-center mt-4 mb-5">
                  <h4>Awaiting Audit Details</h4>
                </div>
                <div style={{ marginLeft: "50px" }} className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Applicant's Name :</strong>{" "}
                      {data?.strApplicantName}
                    </p>
                    <p>
                      <strong>Name of Beneficiary :</strong>{" "}
                      {data?.strPatientName}
                    </p>
                    <p>
                      <strong>Account Holder's Name :</strong>{" "}
                      {data?.strAccountHolderName}
                    </p>
                    <p>
                      <strong>Address :</strong> {data?.strAddress}
                    </p>
                    <p>
                      <strong>Contact No :</strong> {data?.strContactNo}
                    </p>
                    <p>
                      <strong>Remarks :</strong> {data?.strRemarks}
                    </p>
                    <p>
                      <strong>Effective Date :</strong>
                      {_dateFormatter(data?.dteEffectiveDate)}
                    </p>
                    <p>
                      <strong>Expiry Date : </strong>{" "}
                      {_dateFormatter(data?.dteEndDate)}
                    </p>
                    <p>
                      <strong>Bank Name :</strong> {data?.strBankName}
                    </p>
                    <p>
                      <strong>Bank Branch :</strong> {data?.strBankBranchName}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Amount :</strong> {data?.monAmount}
                    </p>
                    <p>
                      <strong>Mode of Payment :</strong>{" "}
                      {data?.strModeOfPayment}
                    </p>
                    <p>
                      <strong>Donation Name :</strong> {data?.strDonationName}
                    </p>
                    <p>
                      <strong>Cause of Donation/Zakat :</strong>{" "}
                      {data?.strDonationType}
                    </p>
                    <p>
                      <strong>Donation Purpose :</strong>{" "}
                      {data?.strDonationPurpose}
                    </p>
                    <p>
                      <strong>Hospitals/Institutes :</strong>{" "}
                      {data?.strOrganizationName}
                    </p>
                    <p>
                      <strong>National ID :</strong> {data?.strNationalID}
                    </p>

                    <p>
                      <strong>Account Holder :</strong>{" "}
                      {data?.strAccountHolderName}
                    </p>
                    <p>
                      <strong>Account Type :</strong> {data?.strAccountType}
                    </p>
                    <p>
                      <strong>Account No :</strong> {data?.strAccountNo}
                    </p>
                    <p
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(data?.strAttachmentUrl)
                        );
                      }}
                    >
                      <strong>Attachment :</strong>{" "}
                      <span style={{ color: "#3699FF", cursor: "pointer" }}>
                        {data?.strAttachmentUrl}
                      </span>
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
