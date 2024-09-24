import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { imarineBaseUrl, marineBaseUrlPythonAPI } from "../../../../App";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { getVesselDDL, getVoyageDDLNew } from "../../helper";
import customStyles from "../../../selectCustomStyle";
import FormikSelect from "../../_chartinghelper/common/formikSelect";

const initialValues = {};

export default function DischargePort() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const dispatch = useDispatch();

  const [gridData, getGridData, loading] = useAxiosGet();
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [loading2, setLoading] = useState(false);

  const getLandingData = (values, pageNo, pageSize) => {
    const shipTypeSTR = values?.shipType
      ? `shipType=${values?.shipType?.label}`
      : "";
    const voyageTypeSTR = values?.voyageType
      ? `&voyageType=${values?.voyageType?.label}`
      : "";
    const vesselNameSTR = values?.vesselName
      ? `&vesselName=${values?.vesselName?.label}`
      : "";
    const voyageNoSTR = values?.voyageNo
      ? `&voyageNo=${values?.voyageNo?.value}`
      : "";
    getGridData(
      `${imarineBaseUrl}/domain/VesselNomination/DepartureDocumentsDischargePortLanding?${shipTypeSTR}${voyageTypeSTR}${vesselNameSTR}${voyageNoSTR}`
    );
  };

  useEffect(() => {
    getLandingData();
  }, []);

  const getVoyageDDL = (values) => {
    getVoyageDDLNew({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      id: values?.vesselName?.value,
      setter: setVoyageNoDDL,
      setLoading: setLoading,
      shipType: 0,
      isComplete: 0,
      voyageTypeId: 0,
    });
  };

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
              <div className="form-group global-form row mb-5">
                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.shipType}
                    isSearchable={true}
                    options={[
                      { value: 1, label: "Own Ship" },
                      { value: 2, label: "Charterer Ship" },
                    ]}
                    styles={customStyles}
                    name="shipType"
                    placeholder="Ship Type"
                    label="Ship Type"
                    onChange={(valueOption) => {
                      setFieldValue("shipType", valueOption);
                      setFieldValue("vesselName", "");
                      setFieldValue("voyageNo", "");
                      setVesselDDL([]);
                      if (valueOption) {
                        getVesselDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          setVesselDDL,
                          valueOption?.value === 2 ? 2 : ""
                        );
                      }
                    }}
                  />
                </div>

                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.voyageType}
                    isSearchable={true}
                    options={[
                      { value: 1, label: "Time Charter" },
                      { value: 2, label: "Voyage Charter" },
                    ]}
                    styles={customStyles}
                    name="voyageType"
                    placeholder="Voyage Type"
                    label="Voyage Type"
                    onChange={(valueOption) => {
                      setFieldValue("vesselName", "");
                      setFieldValue("voyageNo", "");
                      setFieldValue("voyageType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.vesselName}
                    isSearchable={true}
                    options={vesselDDL || []}
                    styles={customStyles}
                    name="vesselName"
                    placeholder="Vessel Name"
                    label="Vessel Name"
                    onChange={(valueOption) => {
                      setFieldValue("vesselName", valueOption);
                      setFieldValue("voyageNo", "");
                      if (valueOption) {
                        getVoyageDDL({ ...values, vesselName: valueOption });
                      }
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.voyageNo || ""}
                    isSearchable={true}
                    options={voyageNoDDL || []}
                    styles={customStyles}
                    name="voyageNo"
                    placeholder="Voyage No"
                    label="Voyage No"
                    onChange={(valueOption) => {
                      setFieldValue("voyageNo", valueOption);
                    }}
                    isDisabled={!values?.vesselName}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    disabled={!values?.shipType}
                    onClick={() => {
                      getLandingData(values);
                    }}
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary"
                  >
                    Show
                  </button>
                </div>
              </div>
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
