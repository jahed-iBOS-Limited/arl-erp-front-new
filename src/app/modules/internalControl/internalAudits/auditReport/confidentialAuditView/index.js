import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import {
  calculateDaysDifference,
  confidentialAuditViewTableHead,
  getSingleScheduleDataHandler,
} from "../../auditschedules/helper";
import { handleSubmitConfAuditWithAttachement } from "../helper";

const ConfidentialAuditView = ({ objProps }) => {
  // obj props
  const { singleAuditReport } = objProps;

  // use hook
  const dispatch = useDispatch();

  // redux selector
  // const { profileData } = useSelector((state) => {
  //   return state.authData;
  // }, shallowEqual);

  // axios get
  const [
    singleConfidentialAuditData,
    getSingleConfidentialData,
    singleConfidentialAuditDataLoading,
    setConfidentialAuditData,
  ] = useAxiosGet();

  // axios post
  const [
    ,
    submitConfAuditWithAttachemnt,
    submitConfReportWithAttachemntLoading,
  ] = useAxiosPost();

  useEffect(() => {
    // fetch single audit report data with audit schedule id from audit schedule func
    getSingleScheduleDataHandler(
      singleAuditReport?.intAuditScheduleId || 0,
      getSingleConfidentialData
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auditForm = (singleConfidentialAuditData, setFieldValue, values) => {
    // distructure single confidential audit data
    const {
      strAuditObservationName,
      strFinancialImpact,
      strEmployeeNameResponsibleMgtfeedBack,
      strManagementFeedBack,
      strAuditEmpEvidenceAttastment,
    } = singleConfidentialAuditData;

    return (
      <tr>
        <td></td>
        <td>{strAuditObservationName}</td>
        <td>{strFinancialImpact}</td>
        <td>{strEmployeeNameResponsibleMgtfeedBack}</td>
        <td className="text-center">
          {strAuditEmpEvidenceAttastment && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  getDownlloadFileView_Action(strAuditEmpEvidenceAttastment)
                );
              }}
            >
              <ICon title={`View Attachment`}>
                <i class="far fa-file-image"></i>
              </ICon>
            </span>
          )}
        </td>
        <td>
          <InputField
            name="mgmtFeedback"
            value={strManagementFeedBack}
            onChange={(e) => {
              setFieldValue("mgmtFeedback", e.target.value);
              setConfidentialAuditData((prevData) => ({
                ...prevData,
                strManagementFeedBack: e?.target?.value,
              }));
            }}
            disabled={strManagementFeedBack}
          />
          {/* {strManagementFeedBack} */}
        </td>
      </tr>
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { resetForm }) => {}}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <Form>
          {(singleConfidentialAuditDataLoading ||
            submitConfReportWithAttachemntLoading) && <Loading />}
          <main className="row mt-2">
            <div className="col-12 d-flex flex-row justify-content-center">
              <h4>Confidential Audit Report</h4>
              <button
                className="btn btn-primary ml-auto"
                type="button"
                disabled={false}
                onClick={() =>
                  handleSubmitConfAuditWithAttachement({
                    submitConfAuditWithAttachemnt,
                    submitURL: "saveURL",
                    singleConfidentialAuditData,
                    getSingleScheduleDataHandler,
                    getSingleConfidentialData,
                  })
                }
              >
                Save
              </button>
            </div>
            <div className="col-12 my-5">
              <div>
                <h5 className="d-inline-block">Audit visited statement</h5>
                <p className="d-inline">
                  ___________________________________________________________________________________
                  __________________________________________________________________________________________________________________
                  <br />
                  __________________________________________________________________________________________________________________
                  <br />
                </p>
              </div>
              <table className="confedintialAuditInfoTable">
                <tbody>
                  {/* Confidential Audit Info IIFE  */}
                  {(() => {
                    const {
                      strAuditEngagementName,
                      strAuditorName,
                      dteStartDate,
                      dteEndDate,
                      strAuditEngagementCode,
                    } = singleAuditReport || [];

                    return (
                      <>
                        <tr>
                          <td colSpan={3}>Audit Engagement Reference No</td>
                          <td>: {strAuditEngagementCode}</td>
                        </tr>
                        <tr>
                          <td>Auditee Name</td>
                          <td>: {strAuditEngagementName}</td>
                          <td>Period</td>
                          <td>
                            :{" "}
                            {calculateDaysDifference(dteStartDate, dteEndDate)}
                          </td>
                        </tr>
                        <tr>
                          <td>Audit Type</td>
                          <td>: </td>
                          <td>Auditor Name</td>
                          <td>: {strAuditorName}</td>
                        </tr>
                        <tr>
                          <td colSpan={3}>
                            Audit report submission date for supervisor revew
                          </td>
                          <td>:</td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>

            <div className="col-12">
              <h5>The following Audit observations are given below:</h5>
              <table className="table table-striped table-bordered global-table bj-table bj-table-landing">
                <thead>
                  <tr>
                    {confidentialAuditViewTableHead?.map((item, index) => (
                      <th key={index}>{item}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Audit Form */}
                  {auditForm(
                    singleConfidentialAuditData,
                    setFieldValue,
                    values
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </Form>
      )}
    </Formik>
  );
};

export default ConfidentialAuditView;
