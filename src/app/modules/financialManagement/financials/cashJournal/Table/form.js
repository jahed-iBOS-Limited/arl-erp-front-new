/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import customStyles from "./../../../../selectCustomStyle";
import { useEffect } from "react";
import { useState } from "react";
import { cashJournalSbuApi } from "../helper";
import FormikError from "./../../../../_helper/_formikError";
import { getCashJournalGridData } from "../_redux/Actions";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { IInput } from "./../../../../_helper/_input";
import {
  getCashJournalGridDatabyCode,
  EmptyCashJournalGridData,
} from "./../_redux/Actions";
import GridData from "./grid";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import { setCashJournalLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import PaginationTable from "../../../../_helper/_tablePagination";

// Validation schema
const validationSchema = Yup.object().shape({
  controllingUnitCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Code is required"),
  sbu: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),
  accountingJournalTypeId: Yup.object().shape({
    label: Yup.string().required("Journal Type is required"),
    value: Yup.string().required("Journal Type is required"),
  }),
});

const initData = {
  id: undefined,
  sbu: "",
  accountingJournalTypeId: "",
  transactionDate: _todayDate(),
  completeDate: _todayDate(),
  toDate: _todayDate(),
  fromDate: _todayDate(),
  code: "",
  type: "notComplated",
};

export default function HeaderForm({
  cashJournalLanding,
  approval,
  approvalHandler,
  local,
  gridDataLoad,
  rowDto,
  allGridCheck,
  itemSlectedHandler,
  remover,
  singleApprovalndler,
  loading,
  setLoading,
  paginationState,
  setRowDto
}) {
  const [sbuDDl, setSbuDDl] = useState([]);
  const [journalTypeDDL, setJournalTypeDDL] = useState([]);
  const {
    pageNo,
    setPageNo,
    pageSize,
    setPageSize,
    totalCountRowDto,
  } = paginationState;

  let cashJournal = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );
  let { profileData, selectedBusinessUnit } = cashJournal;
  const history = useHistory();
  const dispatch = useDispatch();

  //Dispatch Get getEmpDDLAction
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      cashJournalSbuApi(
        profileData?.accountId,
        selectedBusinessUnit.value,
        setSbuDDl
      );
      setJournalTypeDDL([
        { value: 1, label: "Cash Receipts" },
        { value: 2, label: "Cash Payments" },
        { value: 3, label: "Cash Transfer" },
      ]);
    }
    return () => dispatch(EmptyCashJournalGridData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize,values) => {
    gridDataLoad(
      values.sbu.value,
      values?.accountingJournalTypeId?.value,
      values.fromDate,
      values.toDate,
      values.type,
      pageNo,
      pageSize
    );
  };


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          ...cashJournalLanding,
          sbu: cashJournalLanding?.sbu || sbuDDl[0],
          accountingJournalTypeId:
            cashJournalLanding?.accountingJournalTypeId || journalTypeDDL[0],
          fromDate:  _todayDate(),
          toDate: _todayDate(),
          completeDate: _todayDate(),
          type: cashJournalLanding?.type || "notComplated",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Form className="form form-label-right cj">
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Cash Journal"}>
                  <CardHeaderToolbar>
                    <button
                      onClick={() => {
                        dispatch(
                          setCashJournalLandingAction({ ...values, code: "" })
                        );
                        history.push({
                          pathname: `${window.location.pathname}/create`,
                          state: {
                            ...values,
                            accountingJournalTypeId:
                              values?.accountingJournalTypeId?.value,
                          },
                        });
                      }}
                      className="btn btn-primary"
                      disabled={
                        !values?.sbu || !values?.accountingJournalTypeId
                      }
                    >
                      Create
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="content_box d-flex response-content-box">
                        {/* box-one start */}
                        <div
                          className="box_one mr-2"
                          style={{ width: "610px" }}
                        >
                          <div
                            style={{
                              paddingBottom: "1px",
                              marginLeft: "-13px",
                              paddingLeft: ".50rem",
                              paddingRight: ".50rem",
                            }}
                            className="d-flex mt-3 bank-journal bank-journal-custom bj-left"
                          >
                            <div style={{ width: "175px" }} className="mr-2">
                              <label>Select SBU</label>
                              <Select
                                onChange={(valueOption) => {
                                  setFieldValue("sbu", valueOption);
                                  setRowDto([]);
                                }}
                                options={sbuDDl || []}
                                value={values?.sbu}
                                isSearchable={true}
                                styles={customStyles}
                                placeholder="SBU"
                                name="sbu"
                              />
                              <FormikError
                                errors={errors}
                                name="sbu"
                                touched={touched}
                              />
                            </div>
                            <div className="mr-2" style={{ width: "175px" }}>
                              <label>Select Journal Type</label>
                              <Select
                                label="Select Journal Type"
                                options={journalTypeDDL || []}
                                value={values.accountingJournalTypeId}
                                name="accountingJournalTypeId"
                                setFieldValue={setFieldValue}
                                errors={errors}
                                touched={touched}
                                isSearchable={true}
                                styles={customStyles}
                                placeholder="Journal Type"
                                onChange={(valueOption) => {
                                  setFieldValue(
                                    "accountingJournalTypeId",
                                    valueOption
                                  );
                                  setRowDto([]);
                                }}
                              />
                              <FormikError
                                errors={errors}
                                name="accountingJournalTypeId"
                                touched={touched}
                              />
                            </div>

                            <div
                              className="mr-2"
                              style={{ width: "175px", position: "relative" }}
                            >
                              <span style={{ paddingRight: "10px" }}>
                                Journal Code
                              </span>
                              <IInput value={values.code} name="code" />

                              <i
                                class="fas fa-search"
                                style={{
                                  position: "absolute",
                                  right: "4px",
                                  top: "21px",
                                  fontSize: "13px",
                                }}
                              ></i>
                            </div>

                            <div
                              className="text-right"
                              style={{ marginTop: "9px" }}
                            >
                              <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={() => {
                                  dispatch(
                                    setCashJournalLandingAction({
                                      ...values,
                                      code: "",
                                    })
                                  );
                                  if (!values.code) {
                                    gridDataLoad(
                                      values.sbu.value,
                                      values?.accountingJournalTypeId?.value,
                                      values.fromDate,
                                      values.toDate,
                                      values.type,
                                      pageNo,
                                      pageSize
                                    );
                                  } else {
                                    dispatch(
                                      getCashJournalGridDatabyCode(
                                        selectedBusinessUnit.value,
                                        values,
                                        setFieldValue,
                                        values?.accountingJournalTypeId?.value
                                      )
                                    );
                                  }
                                }}
                              >
                                View
                              </button>
                            </div>
                          </div>

                          <div
                            style={{
                              paddingBottom: "4px",
                              marginLeft: "-13px",
                              paddingLeft: ".50rem",
                              paddingRight: ".50rem",
                            }}
                            className="d-flex bank-journal bank-journal-custom cashJournal_buttom"
                          >
                            <div
                              style={{ width: "170px" }}
                              className="mr-2 bank-journal bank-journal-custom bank-journal-date d-flex align-items-center"
                            >
                              <div style={{ width: "80px" }}>From Date</div>
                              <input
                                className="trans-date cj-landing-date"
                                value={values?.fromDate}
                                name="fromDate"
                                onChange={(e) => {
                                  setFieldValue("fromDate", e.target.value);
                                }}
                                type="date"
                              />
                            </div>

                            <div
                              style={{ width: "170px" }}
                              className="mr-2 bank-journal bank-journal-custom bank-journal-date d-flex align-items-center"
                            >
                              <div style={{ width: "70px" }}>To Date</div>
                              <input
                                className="trans-date cj-landing-date"
                                value={values?.toDate}
                                name="toDate"
                                onChange={(e) => {
                                  setFieldValue("toDate", e.target.value);
                                }}
                                type="date"
                              />
                            </div>
                            <div
                              role="group"
                              aria-labelledby="my-radio-group"
                              className="d-flex justify-content-between align-items-center cashJournalCheckbox"
                            >
                              {/* style={{width: "105px"}} */}
                              <label>
                                <input
                                  type="radio"
                                  name="type"
                                  checked={values.type === "notComplated"}
                                  className="mr-1 pointer"
                                  onChange={(e) => {
                                    setFieldValue("searchEmployee", {
                                      value: profileData.userId,
                                      label: profileData.userName,
                                    });
                                    setFieldValue("type", "notComplated");
                                    setRowDto([]);
                                    dispatch(
                                      getCashJournalGridData(
                                        selectedBusinessUnit.value,
                                        values.sbu.value,
                                        values?.accountingJournalTypeId?.value,
                                        false,
                                        true,
                                        values.fromDate,
                                        values.toDate,
                                        setLoading,
                                        pageNo,
                                        pageSize
                                      )
                                      //accId, buId, sbuId, accJournalTypeId, isPosted, //isActive, fromdate, todate
                                    );
                                  }}
                                />
                                Not Completed
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="type"
                                  checked={values.type === "complated"}
                                  className="mr-1 pointer"
                                  onChange={(e) => {
                                    setFieldValue("type", "complated");
                                    setRowDto([])
                                    dispatch(
                                      getCashJournalGridData(
                                        selectedBusinessUnit.value,
                                        values.sbu.value,
                                        values?.accountingJournalTypeId?.value,
                                        true,
                                        true,
                                        values.fromDate,
                                        values.toDate,
                                        setLoading,
                                        pageNo,
                                        pageSize
                                      )
                                      //accId, buId, sbuId, accJournalTypeId, isPosted, //isActive, fromdate, todate
                                    );
                                  }}
                                />
                                Completed
                              </label>

                              <label>
                                <input
                                  type="radio"
                                  name="type"
                                  checked={values.type === "canceled"}
                                  className="mr-1 pointer"
                                  onChange={(e) => {
                                    setFieldValue("type", "canceled");
                                    setRowDto([])
                                    dispatch(
                                      getCashJournalGridData(
                                        selectedBusinessUnit.value,
                                        values.sbu.value,
                                        values?.accountingJournalTypeId?.value,
                                        false,
                                        false,
                                        values.fromDate,
                                        values.toDate,
                                        setLoading,
                                        pageNo,
                                        pageSize
                                      )
                                      //accId, buId, sbuId, accJournalTypeId, isPosted, //isActive, fromdate, todate
                                    );
                                  }}
                                />
                                Canceled
                              </label>
                              {/* <div className=" d-flex bj-add-btn pl-1 h-narration disable-border disabled-feedback border-gray caushJournalButtomCode">
                            
                          </div> */}
                            </div>
                          </div>
                        </div>
                        {/* box-one-end */}

                        {/* box-three-start */}
                        <div
                          className="box_three ml-2"
                          style={{ width: "max-content" }}
                        >
                          <div
                            style={{
                              paddingBottom: "30px",
                              marginLeft: "-13px",
                              paddingLeft: ".50rem",
                              paddingRight: ".50rem",
                            }}
                            className="d-flex mt-3 bank-journal bank-journal-custom bj-left"
                          >
                            <div
                              style={{ width: "100px" }}
                              className="mr-2 bank-journal bank-journal-custom bank-journal-date"
                            >
                              <div>Complete Date</div>
                              <input
                                className="trans-date cj-landing-date"
                                value={values?.completeDate}
                                name="completeDate"
                                onChange={(e) =>
                                  setFieldValue("completeDate", e.target.value)
                                }
                                type="date"
                              />
                            </div>
                            <div
                              className="text-right"
                              style={{ marginTop: "9px" }}
                            >
                              <button
                                type="button"
                                disabled={approval}
                                className="btn btn-primary"
                                onClick={() =>
                                  approvalHandler(values.completeDate, values?.accountingJournalTypeId?.value)
                                }
                              >
                                Complete
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* box-three-end */}
                      </div>
                    </div>
                  </div>
                  <GridData
                    rowDto={rowDto}
                    pageNo={pageNo}
                    pageSize={pageSize}
                    allGridCheck={allGridCheck}
                    itemSlectedHandler={itemSlectedHandler}
                    remover={remover}
                    type={values.type}
                    singleApprovalndler={singleApprovalndler}
                    completeDate={values.completeDate}
                    journalTypeValue={values?.accountingJournalTypeId?.value}
                    loading={loading}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                      totalCountRowDto,
                    }}
                    values={values}
                    setRowDto={setRowDto}
                    selectedBusinessUnit={selectedBusinessUnit}
                    profileData={profileData}
                  />
                   {rowDto?.length > 0 && (
                    <PaginationTable
                      count={paginationState?.totalCountRowDto}
                      setPositionHandler={setPositionHandler}
                      paginationState={{ ...paginationState }}
                      values={values}
                    />
                  )}
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
