import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import { getDownlloadFileView_Action } from '../../../_helper/_redux/Actions';
import AttachmentUploaderNew from '../../../_helper/attachmentUploaderNew';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import SearchAsyncSelect from '../../../_helper/SearchAsyncSelect';
import ICon from '../../../chartering/_chartinghelper/icons/_icon';
import {
  auditFormInitData,
  calculateDaysDifference,
  confidentialAuditFormTableHead,
  generateConfidentialInitData,
  getSingleScheduleDataHandler,
  handleConfidentialAuditSubmit,
  loadEmployeeInfo,
} from './helper';

const ConfidentialAuditForm = ({ objProps }) => {
  // obj props
  const { singleAuditData, setSingleAuditData } = objProps;

  // use hooks
  const dispatch = useDispatch();

  // redux selector
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // axios get
  const [
    singleConfidentialAuditData,
    getSingleConfidentialData,
    singleConfidentialAuditDataLoading,
    setSingleConfidentialAuditData,
  ] = useAxiosGet();
  // axios post
  const [, submitConfidentialAuditData, submitConfidentialAuditDataLoading] =
    useAxiosPost();

  useEffect(() => {
    getSingleScheduleDataHandler(
      singleAuditData?.intAuditScheduleId || 0,
      getSingleConfidentialData
    );
  }, []);

  const auditForm = (
    values,
    setFieldValue,
    singleConfidentialAuditData,
    setSingleConfidentialAuditData
  ) => (
    <tr>
      <td></td>
      <td>
        <InputField
          value={values?.auditObservation}
          name="auditObservation"
          onChange={(e) => {
            setFieldValue('auditObservation', e.target.value);
          }}
        />
      </td>
      <td>
        <InputField
          value={values?.financialImpact}
          name="financialImpact"
          onChange={(e) => {
            setFieldValue('financialImpact', e.target.value);
          }}
        />
      </td>
      <td>
        <SearchAsyncSelect
          selectedValue={values?.responsibleEmployee}
          isSearchIcon={true}
          handleChange={(valueOption) => {
            setFieldValue('responsibleEmployee', valueOption);
          }}
          loadOptions={(searchInput) =>
            loadEmployeeInfo(profileData?.accountId, searchInput)
          }
          name={'responsibleEmployee'}
        />
      </td>
      <td className="d-flex flex-row justify-content-between">
        {!singleConfidentialAuditData?.strAuditEmpEvidenceAttastment && (
          <AttachmentUploaderNew
            isExistAttachment={
              singleConfidentialAuditData?.strAuditEmpEvidenceAttastment
            }
            fileUploadLimits={1}
            CBAttachmentRes={(attachmentData) => {
              if (Array.isArray(attachmentData)) {
                setSingleConfidentialAuditData((prevState) => ({
                  ...prevState,
                  strAuditEmpEvidenceAttastment: attachmentData[0]?.id || '',
                }));
              }
            }}
          />
        )}
        {singleConfidentialAuditData?.strAuditEmpEvidenceAttastment && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                getDownlloadFileView_Action(
                  singleConfidentialAuditData?.strAuditEmpEvidenceAttastment
                )
              );
            }}
          >
            <ICon title={`View Attachment`}>
              <i class="far fa-file-image"></i>
            </ICon>
          </span>
        )}
      </td>
      <td>{singleConfidentialAuditData?.strManagementFeedBack}</td>
      <td>
        <InputField
          value={values?.strAuditRecommendation}
          name="strAuditRecommendation"
          onChange={(e) => {
            setFieldValue('strAuditRecommendation', e.target.value);
          }}
        />
      </td>
    </tr>
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={generateConfidentialInitData(
        singleConfidentialAuditData,
        auditFormInitData
      )}
      onSubmit={(values, { resetForm }) =>
        handleConfidentialAuditSubmit({
          submitConfidentialAuditData,
          singleConfidentialAuditData,
          setSingleAuditData,
          values,
          profileData,
          getSingleScheduleDataHandler,
          getSingleScheduleData: getSingleConfidentialData,
        })
      }
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
            submitConfidentialAuditDataLoading) && <Loading />}
          <main className="row mt-2">
            <div className="col-12 d-flex flex-row justify-content-center">
              <h4>Confidential Audit Report</h4>
              <button className="btn btn-primary ml-auto" type="submit">
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
                  {(() => {
                    const {
                      strAuditEngagementName,
                      strAuditorName,
                      dteStartDate,
                      dteEndDate,
                      strAuditEngagementCode,
                    } = singleAuditData || [];

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
                            :{' '}
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
                    {confidentialAuditFormTableHead?.map((item, index) => (
                      <th key={index}>{item}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Audit Form */}
                  {auditForm(
                    values,
                    setFieldValue,
                    singleConfidentialAuditData,
                    setSingleConfidentialAuditData
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

export default ConfidentialAuditForm;
