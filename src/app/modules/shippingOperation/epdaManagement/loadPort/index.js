import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { imarineBaseUrl } from "../../../../App";
import IConfirmModal from "../../../_helper/_confirmModal";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import PaginationTable from "../../../_helper/_tablePagination";
import { _previousDate, _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPut from "../../../_helper/customHooks/useAxiosPut";
import IButton from "../../../_helper/iButton";
import FormikSelect from "../../../chartering/_chartinghelper/common/formikSelect";
import customStyles from "../../../chartering/_chartinghelper/common/selectCustomStyle";
import { getVesselDDL, getVoyageDDLNew } from "../../helper";
import EmailEditor from "./emailEditor";

const initData = {};
export default function EDPALoadPort() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading] = useAxiosGet();
  const [isShowMailModal, setIsShowMailModal] = useState(false);
  const [singleRowData, setSingleRowData] = useState({});
  const [, onSelectHandler] = useAxiosPut();
  const [loading2, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);

  useEffect(() => {
    getLandingData({}, pageNo, pageSize, "");
  }, [])

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    const shipTypeSTR = values?.shipType
      ? `&shipType=${values?.shipType?.label}`
      : "";
    const voyageTypeSTR = values?.voyageType
      ? `&voyageType=${values?.voyageType?.label}`
      : "";
    const vesselNameSTR = values?.vesselName
      ? `&vesselName=${values?.vesselName?.label}`
      : "";
    const voyageNoSTR = values?.voyageNo
      ? `&voyageNo=${values?.voyageNo?.label}`
      : "";

    getGridData(
      `${imarineBaseUrl}/domain/VesselNomination/GetEpdaAndPortInfoLanding?BusinessUnitId=${0}&FromDate=${values?.fromDate || _previousDate()
      }&ToDate=${values?.toDate || _todayDate()}&pageNumber=${pageNo ||
      1}&pageSize=${pageSize ||
      600}${shipTypeSTR}${voyageTypeSTR}${vesselNameSTR}${voyageNoSTR}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

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
      initialValues={initData}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        getLandingData(values, pageNo, pageSize);
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
            title="EDPA Load Port"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div className="form-group  global-form row  mb-5">
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
                      setFieldValue("voyageType", "");
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
                      } else {
                        getLandingData({}, pageNo, pageSize);
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
                <div className="col-lg-2">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div>
                  <IButton
                    disabled={!values?.fromDate || !values?.toDate}
                    onClick={handleSubmit}
                  />
                </div>
              </div>

              {gridData?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Vessel Nomination Code</th>
                        <th>Grand Total </th>
                        <th>Attachment For Port</th>
                        <th>Attachment For Port Disbursment</th>
                        <th>Mail</th>
                        <th>Selected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>

                          <td className="text-center">
                            {item?.strVesselNominationCode}
                          </td>
                          <td className="text-center">
                            {item?.numGrandTotalAmount}
                          </td>
                          <td className="text-center">
                            {" "}
                            {item?.strAttachmentForPort ? (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    View Attachment
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item?.strAttachmentForPort
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className={`fa pointer fa-eye`}
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            ) : null}
                          </td>
                          <td className="text-center">
                            {" "}
                            {item?.strAttachmentForPortDisbursment ? (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    View Attachment
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item?.strAttachmentForPortDisbursment
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className={`fa pointer fa-eye`}
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            ) : null}
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSingleRowData({
                                  ...item,
                                  actionType: "SEND MAIL",
                                });
                                setIsShowMailModal(true);
                              }}
                            >
                              Send Mail
                            </button>
                          </td>
                          <td className="text-center">
                            <button
                              disabled={item?.isSelected}
                              type="button"
                              className={
                                item?.isSelected
                                  ? "btn btn-sm btn-success px-1 py-1"
                                  : "btn btn-sm btn-primary px-1 py-1"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                IConfirmModal({
                                  message: `Are you sure to select ?`,
                                  yesAlertFunc: () => {
                                    onSelectHandler(
                                      `${imarineBaseUrl}/domain/VesselNomination/SetSelectedEpdaAgent?VesselNominationId=${item?.intVesselNominationId}&EpdaAndPortInfoId=${item?.intEpdaAndPortInfoId}&AgentName=${item?.strName}&AgentEmail=${item?.strEmail}`,
                                      null,
                                      () => {
                                        setSingleRowData(item);
                                        setIsShowMailModal(true);
                                      },
                                      true
                                    );
                                  },
                                  noAlertFunc: () => { },
                                });
                              }}
                            >
                              {item?.isSelected ? "Selected" : "Select"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gridData?.length > 0 && (
                <PaginationTable
                  count={gridData?.length}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              )}
              <div>
                <IViewModal
                  show={isShowMailModal}
                  onHide={() => {
                    setIsShowMailModal(false);
                  }}
                >
                  <EmailEditor
                    emailEditorProps={{
                      intId: singleRowData?.intVesselNominationId,
                      singleRowData: singleRowData,
                      cb: () => {
                        getLandingData(values, pageNo, pageSize, "");
                        setIsShowMailModal(false);
                      },
                    }}
                  />
                </IViewModal>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
