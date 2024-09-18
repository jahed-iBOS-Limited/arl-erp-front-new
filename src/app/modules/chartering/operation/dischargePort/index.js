import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { imarineBaseUrl, marineBaseUrlPythonAPI } from "../../../../App";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initialValues = {};

export default function DischargePort() {
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const dispatch = useDispatch();

  const [gridData, getGridData, loading] = useAxiosGet();

  const getLandingData = (values, pageNo, pageSize) => {
    getGridData(
      `${marineBaseUrlPythonAPI}/domain/VesselNomination/DepartureDocumentsDischargePortLanding`
    );
  };

  useEffect(()=>{
    getLandingData();
  },[])

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
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
      }) => (
        <>
          {loading && <Loading />}
          <IForm
            title="Discharge Port"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              {gridData?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Vessel Name</th>
                        <th>Voyage No</th>
                        <th>Code</th>
                        <th>SOF</th>
                        <th>NOR</th>
                        <th>Final Draft Survey Report</th>
                        <th>Final Stowage Plan</th>
                        <th>Mate's Receipt</th>
                        <th>Cargo Manifest</th>
                        <th>Master Receipt of Sample</th>
                        <th>Authorization Letter</th>
                        <th>Sealing Report</th>
                        <th>Hold Inspection Report</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={item.intAutoId}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">{item.strVesselName}</td>
                          <td className="text-center">{item.strVoyageNo}</td>
                          <td className="text-center">{item.strCode}</td>
                          <td className="text-center">
                            {item.strSoffile && (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="sof-icon">View SOF</Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item.strSoffile
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className="fa pointer fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td className="text-center">
                            {item.strNorfile && (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="nor-icon">View NOR</Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item.strNorfile
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className="fa pointer fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td className="text-center">
                            {item.strFinalDraftSurveyReportFile && (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="draft-survey-icon">
                                    View Final Draft Survey Report
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item.strFinalDraftSurveyReportFile
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className="fa pointer fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td className="text-center">
                            {item.strFinalStowagePlanFile && (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="stowage-plan-icon">
                                    View Final Stowage Plan
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item.strFinalStowagePlanFile
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className="fa pointer fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td className="text-center">
                            {item.strMatesReceiptFile && (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="mates-receipt-icon">
                                    View Mate's Receipt
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item.strMatesReceiptFile
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className="fa pointer fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td className="text-center">
                            {item.strCargoManifestFile && (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cargo-manifest-icon">
                                    View Cargo Manifest
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item.strCargoManifestFile
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className="fa pointer fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td className="text-center">
                            {item.strMasterReceiptOfSampleFile && (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="master-receipt-icon">
                                    View Master Receipt of Sample
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item.strMasterReceiptOfSampleFile
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className="fa pointer fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td className="text-center">
                            {item.strAuthorizationLetterFile && (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="authorization-letter-icon">
                                    View Authorization Letter
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item.strAuthorizationLetterFile
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className="fa pointer fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td className="text-center">
                            {item.strSealingReportFile && (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="sealing-report-icon">
                                    View Sealing Report
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item.strSealingReportFile
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className="fa pointer fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td className="text-center">
                            {item.strHoldInspectionReportFile && (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="hold-inspection-report-icon">
                                    View Hold Inspection Report
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item.strHoldInspectionReportFile
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className="fa pointer fa-eye"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td className="text-center">{item.strRemarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
