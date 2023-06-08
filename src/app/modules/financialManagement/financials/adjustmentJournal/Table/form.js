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
import FormikError from "./../../../../_helper/_formikError";
import { getCashJournalGridData, getSbuDDLAction } from "../_redux/Actions";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { IInput } from "./../../../../_helper/_input";
import {
  getCashJournalGridDatabyCode,
  EmptyAdjustmentJournalGridData,
} from "./../_redux/Actions";
import GridData from "./grid";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import { setAdjustmentJournalLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
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
  approval,
  approvalHandler,
  adjustmentJournalLanding,
  gridDataLoad,
  rowDto,
  allGridCheck,
  itemSlectedHandler,
  remover,
  singleApprovalndler,
  loading,
  setLoading,
  paginationState,

  setRowDto,
}) {
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
  // get sbuDDl ddl from store
  const sbuDDl = useSelector((state) => {
    return state?.adjustmentJournal?.sbuDDL;
  }, shallowEqual);

  let { profileData, selectedBusinessUnit } = cashJournal;
  const history = useHistory();
  const dispatch = useDispatch();

  //Dispatch Get getEmpDDLAction
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getSbuDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
    }
    return () => dispatch(EmptyAdjustmentJournalGridData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize,values) => {
    gridDataLoad(
      values?.sbu?.value,
      7,
      values?.fromDate,
      values?.toDate,
      values?.type,
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
          sbu: adjustmentJournalLanding?.sbu || sbuDDl[0],
          accountingJournalTypeId:
            adjustmentJournalLanding?.accountingJournalTypeId || "",
          fromDate: adjustmentJournalLanding?.fromDate || _todayDate(),
          toDate: adjustmentJournalLanding?.toDate || _todayDate(),
          type: adjustmentJournalLanding?.type || "notComplated",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Form className="form form-label-right">
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Adjustment Journal"}>
                  <CardHeaderToolbar>
                    <button
                      onClick={() => {
                        dispatch(
                          setAdjustmentJournalLandingAction({
                            ...values,
                            code: "",
                          })
                        );
                        history.push({
                          pathname:
                            `${window.location.pathname}/create`,
                          state: {
                            selectedSbu: values.sbu,
                          },
                        });
                      }}
                      className="btn btn-primary"
                    >
                      Create
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <div className="row cj adJustmentJournal">
                    <div className="col-lg-12">
                      <div className="content_box d-flex response-content-box">
                        {/* box-one start */}
                        <div
                          className="box_one mr-2"
                          style={{ width: "620px" }}
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
                            <div style={{ width: "260px" }} className="mr-2">
                              <label>Select SBU</label>
                              <Select
                                onChange={(valueOption) => {
                                  setFieldValue("sbu", valueOption);
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
                            <div
                              className="mr-2"
                              style={{ width: "260px", position: "relative" }}
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
                                    setAdjustmentJournalLandingAction({
                                      ...values,
                                      code: "",
                                    })
                                  );
                                  if (!values.code) {
                                    gridDataLoad(
                                      values?.sbu?.value,
                                      7,
                                      values?.fromDate,
                                      values?.toDate,
                                      values?.type,
                                      pageNo,
                                      pageSize
                                    );
                                  } else {
                                    dispatch(
                                      getCashJournalGridDatabyCode(
                                        selectedBusinessUnit?.value,
                                        values?.sbu?.value,
                                        values?.code,
                                        setFieldValue,
                                        setLoading
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
                              role="group"
                              aria-labelledby="my-radio-group"
                              className="d-flex justify-content-between align-items-center cashJournalCheckbox"
                            >
                              <div
                                style={{ width: "175" }}
                                className="mr-2 bank-journal bank-journal-custom bank-journal-date d-flex align-items-center"
                              >
                                <div style={{ width: "80px" }}>From Date</div>
                                <input
                                  className="trans-date cj-landing-date "
                                  value={values?.fromDate}
                                  name="fromDate"
                                  onChange={(e) => {
                                    setFieldValue("fromDate", e.target.value);
                                  }}
                                  type="date"
                                />
                              </div>

                              <div
                                style={{ width: "175px" }}
                                className="mr-2 bank-journal bank-journal-custom bank-journal-date d-flex align-items-center"
                              >
                                <div style={{ width: "80px" }}>To Date</div>
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

                                    dispatch(
                                      getCashJournalGridData(
                                        selectedBusinessUnit.value,
                                        values.sbu.value,
                                        7,
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

                                    dispatch(
                                      getCashJournalGridData(
                                        selectedBusinessUnit.value,
                                        values.sbu.value,
                                        7,
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

                              <label className="pr-0">
                                <input
                                  type="radio"
                                  name="type"
                                  checked={values.type === "canceled"}
                                  className="mr-1 pointer"
                                  onChange={(e) => {
                                    setFieldValue("type", "canceled");

                                    dispatch(
                                      getCashJournalGridData(
                                        selectedBusinessUnit.value,
                                        values.sbu.value,
                                        7,
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
                                onClick={() => approvalHandler(values)}
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
                    gridDataLoad={gridDataLoad}
                    pageNo={pageNo}
                    pageSize={pageSize}
                    rowDto={rowDto}
                    allGridCheck={allGridCheck}
                    itemSlectedHandler={itemSlectedHandler}
                    remover={remover}
                    type={values.type}
                    singleApprovalndler={singleApprovalndler}
                    completeDate={values.completeDate}
                    loading={loading}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                      totalCountRowDto,
                    }}
                    values={values}
                    selectedBusinessUnit={selectedBusinessUnit}
                    profileData={profileData}
                    setRowDto={setRowDto}
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
