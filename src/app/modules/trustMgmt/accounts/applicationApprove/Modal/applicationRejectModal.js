import { Form, Formik } from "formik";
import React from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { toast } from "react-toastify";
import TextArea from "../../../../_helper/TextArea";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {
  reason: "",
};

export const ApplicationRejectModal = ({
  singleData,
  getData,
  setisRejectodal,
  filterObj,
}) => {

  const {profileData} = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  // eslint-disable-next-line no-unused-vars
  const [landingData, getRejectData] = useAxiosGet();


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

  const callBack = (data) => {
    toast.success(data[0]?.Column1 || "Rejected Successfully");
    setisRejectodal(false);
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

  const dispatch = useDispatch();
  return (
    <>
      <Formik
        enableReinitialize={true}
        // validationSchema={validationSchema}
        initialValues={initData}
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
                      <div className="d-flex align-items-start h-100">
                        Rejection Cause
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-start">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <TextArea
                            name="reason"
                            value={values?.reason}
                            placeholder="Rejection cause.."
                            touched={touched}
                            rows="2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-2">
                      <div>
                        <button
                          type="button"
                          style={{ fontSize: "12px" }}
                          className="btn btn-primary"
                          onClick={() => {
                            getRejectData(
                              getLadingData(
                                "DonationApplicationApproval",
                                "",
                                "",
                                "",
                                "",
                                profileData?.userId,
                                2,
                                singleData?.intApplicationID,
                                values?.reason
                              ),
                              callBack
                            );
                          }}
                        >
                          Reject
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
                    <p
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(
                            singleData?.strAttachmentUrl
                          )
                        );
                      }}
                    >
                      <strong>Attachment :</strong> <span style={{color: "#3699FF", cursor: "pointer"}}>{singleData?.strAttachmentUrl}</span>
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
