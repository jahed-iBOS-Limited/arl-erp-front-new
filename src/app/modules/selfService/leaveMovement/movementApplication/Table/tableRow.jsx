import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IConfirmModal from "../../../../_helper/_confirmModal";
import Loading from "../../../../_helper/_loading";
import {
  leaveAppLandingPagintaion_api,
  removeOfficialMovement_api,
} from "../helper";
import NewSelect from "../../../../_helper/_select";
import { OfficialMoveLandingPagination_api } from "./../helper";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForPLLeave from "./ViewForPLLeave";

// Validation schema
const validationSchema = Yup.object().shape({
  privacyType: Yup.string().required("Privacy Type is required"),
  employee: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
});

const initData = {
  privacyType: "1",
  employee: "",
  employeeInfo: "",
};

export function TableRow({ saveHandler }) {
  const history = useHistory();
  const [, setRowDto] = useState([]);
  const [rowDtoTwo, setRowDtoTwo] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData] = useState([]);

  const [newEmployeeDDL] = useState([]);
  const [loader, setLoader] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // callback to get landing leave approval from modal, when user change request date from modal.
  const changeReqDateCb = (values) => {
    leaveAppLandingPagintaion_api(
      values?.employee?.value,
      setRowDto,
      setLoader
    );
  };

  useEffect(() => {
    if (profileData?.userReferenceId) {
      leaveAppLandingPagintaion_api(
        profileData?.userReferenceId,
        setRowDto,
        setLoader
      );
      OfficialMoveLandingPagination_api(
        profileData?.userReferenceId,
        setRowDtoTwo,
        setLoader
      );
    }
  }, [profileData]);

  const singleLeaveRemoveHandlerTwo = (index) => {
    if (index && profileData?.accountId && selectedBusinessUnit?.value) {
      const removeObj = rowDtoTwo.filter((itm) => itm?.id === index);
      let confirmObject = {
        title: "Are you sure?",

        yesAlertFunc: async () => {
          if (removeObj) {
            const removeComplete = removeObj.map((itm) => {
              return {
                id: itm?.id,
              };
            });
            const modifyFilterRowDto = rowDtoTwo.filter(
              (itm) => itm?.id !== index
            );
            removeOfficialMovement_api(
              { data: removeComplete[0] },
              modifyFilterRowDto,
              setRowDtoTwo
            );
          }
        },
        noAlertFunc: () => {},
      };
      IConfirmModal(confirmObject);
    } else {
      console.log(" ");
    }
  };

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: {
            value: profileData?.employeeId,
            label: profileData?.employeeFullName,
            code:
              newEmployeeDDL[0]?.value === profileData?.userReferenceId
                ? newEmployeeDDL[0]?.code
                : "",
            employeeBusinessUnit:
              newEmployeeDDL[0]?.value === profileData?.userReferenceId
                ? newEmployeeDDL[0]?.employeeBusinessUnit
                : "",
            employeeInfoDepartment:
              newEmployeeDDL[0]?.value === profileData?.userReferenceId
                ? newEmployeeDDL[0]?.employeeInfoDepartment
                : "",
            employeeInfoDesignation:
              newEmployeeDDL[0]?.value === profileData?.userReferenceId
                ? newEmployeeDDL[0]?.employeeInfoDesignation
                : "",
            routingNo:
              newEmployeeDDL[0]?.value === profileData?.userReferenceId
                ? newEmployeeDDL[0]?.routingNo
                : "",
          },
          employeeInfo:
            newEmployeeDDL[0]?.value === profileData?.userReferenceId
              ? `${newEmployeeDDL[0]?.employeeInfoDesignation},${newEmployeeDDL[0]?.employeeInfoDepartment},${newEmployeeDDL[0]?.employeeBusinessUnit}`
              : "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-12 d-flex mb-2">
                      {values?.privacyType === "2" ? (
                        <div style={{ width: "300px" }} className="ml-2">
                          <label>Employee</label>
                          <SearchAsyncSelect
                            selectedValue={values?.employee}
                            isSearchIcon={true}
                            handleChange={(valueOption) => {}}
                            loadOptions={loadUserList}
                          />
                        </div>
                      ) : (
                        <div style={{ width: "300px" }} className="ml-2">
                          <NewSelect
                            name="employee"
                            options={[]}
                            value={values?.employee}
                            label="Employee"
                            onChange={(valueOption) => {}}
                            placeholder="Employee"
                            isSearchable={true}
                            errors={errors}
                            touched={touched}
                            isDisabled={true}
                          />
                        </div>
                      )}
                      {values?.privacyType === "2" && (
                        <div style={{ marginTop: "16px" }} className="ml-2">
                          <ButtonStyleOne
                            type="button"
                            label="View"
                            className="btn btn-primary mr-2"
                            onClick={() => {
                              leaveAppLandingPagintaion_api(
                                values?.employee?.value,
                                setRowDto,
                                setLoader
                              );
                              OfficialMoveLandingPagination_api(
                                values?.employee?.value,
                                setRowDtoTwo,
                                setLoader
                              );
                            }}
                          />
                        </div>
                      )}
                      <div style={{ marginTop: "16px" }} className="ml-2">
                        <ButtonStyleOne
                          type="button"
                          label="Create"
                          onClick={() => {
                            history.push({
                              pathname:
                                "/self-service/movement-application/create",
                              state: {
                                privacyType: values?.privacyType,
                                employee: values?.employee,
                                employeeInfo: values?.employeeInfo,
                                country: {
                                  value: 18,
                                  label: "Bangladesh",
                                  code: null,
                                  employeeInfoDesignation: null,
                                  employeeInfoDepartment: null,
                                  employeeBusinessUnit: null,
                                  routingNo: null,
                                },
                                division: {
                                  value: 3,
                                  label: "Dhaka",
                                  code: null,
                                  employeeInfoDesignation: null,
                                  employeeInfoDepartment: null,
                                  employeeBusinessUnit: null,
                                  routingNo: null,
                                },
                                district: {
                                  value: 18,
                                  label: "Dhaka",
                                  code: null,
                                  employeeInfoDesignation: null,
                                  employeeInfoDepartment: null,
                                  employeeBusinessUnit: null,
                                  routingNo: null,
                                },
                              },
                            });
                          }}
                          disabled={!values?.privacyType || !values?.employee}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
            {/* Table Start */}
            <div className="row cash_journal">
              <div className="col-lg-10 pr-0 pl-0">
                <>
                  {loader && <Loading />}
                  <h6 className="my-2">Movement Application Table</h6>
                  <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1">
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>SL</th>
                        <th style={{ width: "95px" }}>Application Type</th>
                        <th style={{ width: "90px" }}>Submitted Date</th>
                        <th style={{ width: "90px" }}>From Date</th>
                        <th style={{ width: "90px" }}>To Date</th>
                        <th style={{ width: "70px" }}>From Time</th>
                        <th style={{ width: "70px" }}>To Time</th>
                        <th>Reason</th>
                        <th>Address</th>
                        <th style={{ width: "60px" }}>Status</th>
                        <th style={{ width: "50px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDtoTwo?.map((td, index) => (
                        <tr key={index}>
                          <td> {td?.sl} </td>
                          <td>
                            <div className="pl-2">{td?.moveType}</div>
                          </td>
                          <td>
                            <div className="text-center">
                              {_dateFormatter(td?.insertDate)}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {_dateFormatter(td?.startDate)}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {_dateFormatter(td?.endDate)}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {td?.start ? _timeFormatter(td?.start) : ""}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {td?.end ? _timeFormatter(td?.end) : ""}
                            </div>
                          </td>
                          <td>
                            <div className="text-left pl-2">{td?.reason}</div>
                          </td>
                          <td>
                            <div className="text-left pl-2">{td?.address}</div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.status}</div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                  singleLeaveRemoveHandlerTwo(td?.id);
                                }}
                                disabled={
                                  td?.status === "Approved" ||
                                  td?.status === "Rejected"
                                }
                              >
                                <span>
                                  <i
                                    className="fa fa-trash text-danger"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </>
              </div>
            </div>
            <IViewModal
              title="Change Request"
              show={isShowModal}
              onHide={() => setIsShowModal(false)}
            >
              <ViewForPLLeave
                currentRowData={currentRowData}
                setIsShowModal={setIsShowModal}
                PrevValues={values}
                changeReqDateCb={changeReqDateCb}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
