/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../_metronic/_partials/controls";
import NewSelect from "../../_helper/_select";
import IView from "../../_helper/_helperIcons/_view";
import IViewModal from "../../_helper/_viewModal";
import ViewModal from "./ViewModal";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import Loading from "../../_helper/_loading";
import { _dateFormatter } from "../../_helper/_dateFormate";
import IEdit from "../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import { getBusinessUnitDDL_api } from "../createDocument/helper";
// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  unit: "",
  wpGroup: "",
  wp: "",
};

export default function LegalDocReport() {
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [tableSize, setTableSize] = useState("Small");
  const [currentItem, setCurrentItem] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [unit, setUnitDDL] = useState([]);
  const [rowDto, getRowDto, loading] = useAxiosGet();
  const [wpGroup, getWpGroup] = useAxiosGet();
  const [wp, getWp] = useAxiosGet();
  const history = useHistory();

  useEffect(() => {
    getBusinessUnitDDL_api(profileData?.userId, profileData?.accountId, setUnitDDL )
  }, [profileData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Legal Document Report"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              {loading && <Loading />}
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="unit"
                        options={[{ value: 0, label: "All" }, ...unit]}
                        value={values?.unit}
                        label="Unit"
                        onChange={(valueOption) => {
                          setFieldValue("unit", valueOption);
                          setFieldValue("wpGroup", "");
                          getWpGroup(
                            `/hcm/SafetyAndCompliance/LegalDocumentALLGET?intBusinessUnitId=${valueOption?.value}&strPartType=WorkplaceGroupIdByBusinessUnitId`
                          );
                        }}
                        placeholder="Unit"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="wpGroup"
                        options={[{ value: 0, label: "All" }, ...wpGroup]}
                        value={values?.wpGroup}
                        label="Workplace Group"
                        onChange={(valueOption) => {
                          setFieldValue("wpGroup", valueOption);
                          setFieldValue("wp", "");
                          getWp(
                            `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=WorkplaceByWorkplaceGroupId&intBusinessUnitId=${values?.unit?.value}&intWorkplaceGroupId=${valueOption?.value}`
                          );
                        }}
                        placeholder="Workplace Group"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="wp"
                        options={[{ value: 0, label: "All" }, ...wp]}
                        value={values?.wp}
                        label="Workplace"
                        onChange={(valueOption) => {
                          setFieldValue("wp", valueOption);
                        }}
                        placeholder="Workplace"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div style={{ marginTop: "19px" }} className="col-lg-3">
                      <button
                        className="btn btn-primary mr-1"
                        type="button"
                        onClick={() => {
                          getRowDto(
                            `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=LegalDocumentRegistrationLanding&intBusinessUnitId=${values?.unit?.value}&intWorkplaceGroupId=${values?.wpGroup?.value}&intWorkplaceId=${values?.wp?.value}`
                          );
                        }}
                        disabled={
                          !values?.unit || !values?.wpGroup || !values?.wp
                        }
                      >
                        View
                      </button>
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={rowDto?.length < 1}
                        onClick={() =>
                          setTableSize(
                            tableSize === "Small" ? "Large" : "Small"
                          )
                        }
                      >
                        {tableSize === "Small" ? "Large" : "Small"} View
                      </button>
                    </div>
                  </div>
                  <div className="loan-scrollable-table employee-overall-status">
                    <div
                      style={
                        tableSize === "Small"
                          ? { maxHeight: "400px" }
                          : { maxHeight: "800px" }
                      }
                      className="scroll-table _table"
                    >
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ minWidth: "50px" }}>SL</th>
                            <th>
                              Name of Legal Documents License & Certificates
                            </th>
                            <th>Unit</th>
                            <th>Workplace Group</th>
                            <th>Workplace</th>
                            <th>Renewal Type</th>
                            <th>Cont. Persons</th>
                            <th>Concern Authority</th>
                            <th>Address/City</th>
                            <th style={{ minWidth: "100px" }}>
                              Present Status
                            </th>
                            <th style={{ minWidth: "100px" }}>Renewal Date</th>
                            <th style={{ minWidth: "85px" }}>Expiry Date</th>
                            <th style={{ minWidth: "85px" }}>
                              Reminder Date/ Notification Date
                            </th>
                            <th style={{ minWidth: "100px" }}>Document Name</th>
                            <th style={{ minWidth: "85px" }}>
                              First Issue Date
                            </th>
                            <th style={{ minWidth: "100px" }}>Documents No.</th>
                            <th style={{ minWidth: "100px" }}>
                              Documents Status
                            </th>
                            <th style={{ minWidth: "100px" }}>
                              Last Updated Date
                            </th>
                            <th>Remarks & Justification</th>
                            <th style={{ minWidth: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.length > 0 &&
                            rowDto?.map((item, index) => (
                              <tr
                                style={{
                                  background: item?.color,
                                }}
                                key={index}
                              >
                                <td>{index + 1}</td>
                                <td>{item?.strDocumentName}</td>
                                <td>{item?.strBusinessUnitName}</td>
                                <td>{item?.strWorkplaceGroupName}</td>
                                <td>{item?.strWorkplaceName}</td>
                                <td>{item?.strRenualType}</td>
                                <td>{item?.strEmployeeFullName}</td>
                                <td>{item?.strAuthorName}</td>
                                <td>{item?.strAddress}</td>
                                <td>{item?.strStatus}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteRenewalDate)}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteExpiryDate)}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteNotifyReminderDate)}
                                </td>
                                <td>{item?.strDocumentName}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteFirstIssueDate)}
                                </td>
                                <td className="text-center">
                                  {item?.strDocumentNo}
                                </td>
                                <td className="text-center">
                                  {item?.strStatus}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteLastUpdateDate)}
                                </td>
                                <td>{item?.strRemarks}</td>
                                <td className="text-center">
                                  <IView
                                    title="File"
                                    clickHandler={() => {
                                      setCurrentItem(item);
                                      setIsModal(true);
                                    }}
                                  />
                                  <span
                                    onClick={(e) => {
                                      history.push({
                                        pathname: `/safety-compliance/nestedsf/legal-document-registration/edit/${item?.intLegalDocumentRegId}`,
                                        state: {
                                          id: item?.intLegalDocumentRegId,
                                        },
                                      });
                                    }}
                                    className="ml-2"
                                  >
                                    <IEdit title="Edit" />
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Form>
                <IViewModal
                  title="File List"
                  show={isModal}
                  onHide={() => setIsModal(false)}
                >
                  <ViewModal currentItem={currentItem} />
                </IViewModal>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
