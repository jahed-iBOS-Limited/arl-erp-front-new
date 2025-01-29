/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from "react";
import { Formik, Form } from "formik";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import * as Yup from "yup";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getPaymentOrReceiveLandingPasignation_Api,
  getReferenceNoDDL_Api,
} from "../helper";
import Select from "react-select";
import GridData from "./grid";
import FormikError from "../../../../_helper/_formikError";
import customStyles from "../../../../selectCustomStyle";
import { setReceiveOrPaymentAction } from "./../../../../_helper/reduxForLocalStorage/Actions";
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
  transactionType: "",
  ReferanceNo: "",
  employeeEnroll: "",
};

export default function HeaderForm({
  rowDto,
  allGridCheck,
  itemSlectedHandler,
  remover,
  singleApprovalndler,
  employeeDDL,
  SetReferanceNo,
  referanceNo,
  setGirdData,
  loading,
  setLoading,
}) {
  const history = useHistory();
  let receivepaymentAuthData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        receiveOrPaymentIntData: state.localStorage.receiveOrPayment,
      };
    },
    { shallowEqual }
  );
  let {
    profileData,
    selectedBusinessUnit,
    receiveOrPaymentIntData,
  } = receivepaymentAuthData;
  const backHandler = () => {
    history.goBack();
  };
  const dispatch = useDispatch();

  const gridDataFunc = (values) => {
    getPaymentOrReceiveLandingPasignation_Api(
      values?.transactionType?.label,
      values?.referanceNo?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.employeeEnroll?.value,
      setGirdData,
      values,
      setLoading
    );
  };

  useEffect(() => {
    if(receiveOrPaymentIntData?.transactionType?.value) {
      gridDataFunc(receiveOrPaymentIntData)
    }
  }, [receiveOrPaymentIntData]) 
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={receiveOrPaymentIntData || initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Form className="form form-label-right cj">
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Receive Or Payment"}>
                  <CardHeaderToolbar>
                    <button
                      type="button"
                      onClick={backHandler}
                      className={"btn btn-light"}
                    >
                      <i className="fa fa-arrow-left"></i>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFieldValue("referanceNo", "");
                        setFieldValue("employeeEnroll", "");
                      }}
                      className={"btn btn-light ml-2"}
                    >
                      <i className="fa fa-redo"></i>
                      Reset
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="content_box d-flex response-content-box mb-1">
                        {/* box-one start */}
                        <div
                          className="box_one mr-2"
                          style={{ width: "590px" }}
                        >
                          <div
                            style={{
                              paddingBottom: "7px",
                              marginLeft: "-13px",
                              paddingLeft: ".50rem",
                              paddingRight: ".50rem",
                            }}
                            className="d-flex mt-3 bank-journal bank-journal-custom bj-left"
                          >
                            <div style={{ width: "195px" }} className="mr-2">
                              <label>Transaction Type</label>
                              <Select
                                onChange={(valueOption) => {
                                  setFieldValue("transactionType", valueOption);
                                  setFieldValue("referanceNo", "");
                                  setFieldValue("employeeEnroll", "");
                                  getReferenceNoDDL_Api(
                                    valueOption?.label,
                                    profileData?.accountId,
                                    selectedBusinessUnit?.value,
                                    0,
                                    SetReferanceNo
                                  );
                                  setGirdData([])
                                }}
                                options={[
                                  { value: 3, label: "Advance Pay" },
                                  { value: 4, label: "Expense Pay" },
                                  {
                                    value: 1,
                                    label: "Receive Against Advance",
                                  },
                                  {
                                    value: 2,
                                    label: "Receive Without Reference",
                                  },
                                ]}
                                value={values?.transactionType}
                                isSearchable={true}
                                styles={customStyles}
                                placeholder="Transaction Type"
                                name="transactionType"
                              />
                              <FormikError
                                errors={errors}
                                name="transactionType"
                                touched={touched}
                              />
                            </div>
                            <div className="mr-2" style={{ width: "195px" }}>
                              <label>Referance No</label>
                              <Select
                                options={referanceNo || []}
                                value={values.referanceNo}
                                name="referanceNo"
                                setFieldValue={setFieldValue}
                                errors={errors}
                                touched={touched}
                                isSearchable={true}
                                styles={customStyles}
                                placeholder="Referance No"
                                onChange={(valueOption) => {
                                  setFieldValue("referanceNo", valueOption);
                                  setFieldValue("employeeEnroll", {
                                    value: valueOption?.employeeId,
                                    label: `${valueOption?.employeeName} (${valueOption?.employeeId})`,
                                  });
                                  setGirdData([])
                                }}
                                isDisabled={
                                  values?.transactionType?.value === 2
                                }
                              />
                              <FormikError
                                errors={errors}
                                name="referanceNo"
                                touched={touched}
                              />
                            </div>
                            <div className="mr-2" style={{ width: "195px" }}>
                              <label>Employee Enroll</label>
                              <Select
                                options={employeeDDL || []}
                                value={values.employeeEnroll}
                                name="employeeEnroll"
                                setFieldValue={setFieldValue}
                                errors={errors}
                                touched={touched}
                                isSearchable={true}
                                styles={customStyles}
                                placeholder="Employee Enroll"
                                onChange={(valueOption) => {
                                  setFieldValue("employeeEnroll", valueOption);
                                  setFieldValue("referanceNo", "");
                                  getReferenceNoDDL_Api(
                                    values.transactionType.label,
                                    profileData?.accountId,
                                    selectedBusinessUnit?.value,
                                    valueOption?.value,
                                    SetReferanceNo
                                  );
                                  setGirdData([])
                                }}
                              />
                              <FormikError
                                errors={errors}
                                name="employeeEnroll"
                                touched={touched}
                              />
                            </div>

                            <div
                              className="text-right"
                              style={{ marginTop: "11px" }}
                            >
                              {values?.transactionType?.value === 2 ? (
                                <button
                                  type="button"
                                  className="btn btn-primary mt-1"
                                  style={{ padding: "4px 6px" }}
                                  onClick={() => {
                                    dispatch(setReceiveOrPaymentAction(values));
                                    history.push({
                                      pathname: `/financial-management/expense/receivepayment/cash/${1}`,
                                      state: {
                                        values,
                                        gridBtnType: "Cash",
                                      },
                                    });
                                  }}
                                  disabled={
                                    !values?.employeeEnroll ||
                                    !values.transactionType
                                  }
                                >
                                  Cash
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => {
                                    gridDataFunc(values);
                                    dispatch(setReceiveOrPaymentAction(values));
                                  }}
                                >
                                  View
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* box-one-end */}
                      </div>
                    </div>
                  </div>
                  <GridData
                    rowDto={rowDto}
                    allGridCheck={allGridCheck}
                    itemSlectedHandler={itemSlectedHandler}
                    remover={remover}
                    type={values.type}
                    singleApprovalndler={singleApprovalndler}
                    completeDate={values.completeDate}
                    journalTypeValue={values?.accountingJournalTypeId?.value}
                    values={values}
                    loading={loading}
                  />
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
