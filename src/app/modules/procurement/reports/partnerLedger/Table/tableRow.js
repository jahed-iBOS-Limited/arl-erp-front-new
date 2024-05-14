/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getControllingUnitGridData,
  getSoldToPartyDDL_Action,
  getPartnerLedgerGridData_Action,
  getSbuDDLAction,
  SetPartnerledgerGridDataEmptyAction,
  getBusinessPartnerDetails,
  SetBusinessPartnerDetailsEmptyAction,
} from "../_redux/Actions";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { useHistory, useLocation } from "react-router-dom";
import { SetReportPartnerLedgerAction } from "../../../../_helper/reduxForLocalStorage/Actions";

const validationSchema = Yup.object().shape({
  supplierName: Yup.object().shape({
    label: Yup.string().required("Responsible Person is required"),
    value: Yup.string().required("Responsible Person is required"),
  }),
});

export function TableRow({ btnRef, saveHandler, resetBtnRef, modalData }) {
  const [selectedPartnerLedger, setSelectedPartnerLedger] = useState("");
  const [party, setParty] = useState("");
  const printRef = useRef();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(useLocation().state);

  const { reportPartnerLedger } = useSelector((state) => state?.localStorage);

  const initData = {
    id: undefined,
    supplierName: reportPartnerLedger?.supplierName || "",
    sbu: reportPartnerLedger?.sbu || "",
    fromDate: reportPartnerLedger?.fromDate || _todayDate(),
    toDate: reportPartnerLedger?.toDate || _todayDate(),
  };

  const history = useHistory();

  const dispatch = useDispatch();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get controlling unit list  from store
  const partnerLedgerGridData = useSelector((state) => {
    return state.partnerLedger?.partnerLedgerGridData;
  }, shallowEqual);

  const businessPartnerDetails = useSelector((state) => {
    return state.partnerLedger?.businessPartnerDetails;
  }, shallowEqual);

  const {
    businessPartnerName,
    businessPartnerCode,
    businessPartnerTypeName,
    bin,
    licenseNo,
    businessPartnerAddress,
    // distributionChannelName,
  } = businessPartnerDetails;

  console.log(businessPartnerDetails, "businessPartnerDetails");

  const sbuDDL = useSelector((state) => {
    return state.partnerLedger?.sbuDDL;
  }, shallowEqual);

  const backHandler = () => {
    history.goBack();
  };
  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getControllingUnitGridData(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(
        getSbuDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (modalData) {
      setState(modalData);
    }
  }, [modalData]);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getSoldToPartyDDL_Action(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    return () => {
      dispatch(SetPartnerledgerGridDataEmptyAction());
      dispatch(SetBusinessPartnerDetailsEmptyAction());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        // initialValues={initData}
        initialValues={{ ...initData, ...state }}
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
          isValid,
        }) => (
          <>
            <ICard
              printTitle="Print"
              title="Partner Ledger"
              isPrint={true}
              isShowPrintBtn={true}
              isBackBtn={state?.isDisabled}
              backHandler={backHandler}
              componentRef={printRef}
            >
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row global-form">
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="sbu"
                            options={sbuDDL || []}
                            value={values?.sbu}
                            label="SBU"
                            onChange={(valueOption) => {
                              setFieldValue("sbu", valueOption);
                              setFieldValue("supplierName", "");
                              dispatch(
                                SetReportPartnerLedgerAction({
                                  ...values,
                                  sbu: valueOption,
                                  supplierName: "",
                                })
                              );
                            }}
                            placeholder="SBU"
                            errors={errors}
                            touched={touched}
                            isDisabled={state?.isDisabled}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Supplier Name</label>
                          <SearchAsyncSelect
                            selectedValue={values.supplierName}
                            handleChange={(valueOption) => {
                              dispatch(SetPartnerledgerGridDataEmptyAction());
                              setFieldValue("supplierName", valueOption);
                            }}
                            loadOptions={(v) => {
                              if (v.length < 3) return [];
                              return axios
                                .get(
                                  `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${values?.sbu?.value}`
                                )
                                .then((res) => {
                                  const updateList = res?.data.map((item) => ({
                                    ...item,
                                  }));
                                  return updateList;
                                });
                            }}
                            isDisabled={
                              state?.isDisabled || !values?.sbu?.value
                            }
                          />
                        </div>
                        {/* <div className="col-lg-3">
                          <ISelect
                            label="Select Sold To Party"
                            options={soldToPartyDDL}
                            defaultValue={values.soldToParty}
                            name="soldToParty"
                            setFieldValue={setFieldValue}
                            dependencyFunc={(
                              currentValue,
                              allvalue,
                              setter,
                              label
                            ) => {
                              setParty(label);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div> */}
                        <div className="col-lg-2">
                          <label>From Date</label>
                          <InputField
                            value={values?.fromDate}
                            name="fromDate"
                            placeholder="From Date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e.target.value);
                              dispatch(SetPartnerledgerGridDataEmptyAction());
                              dispatch(
                                SetReportPartnerLedgerAction({
                                  ...values,
                                  fromDate: e.target.value,
                                })
                              );
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <label>To Date</label>
                          <InputField
                            value={values?.toDate}
                            name="toDate"
                            placeholder="To Date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                              dispatch(SetPartnerledgerGridDataEmptyAction());
                              dispatch(
                                SetReportPartnerLedgerAction({
                                  ...values,
                                  toDate: e.target.value,
                                })
                              );
                            }}
                          />
                        </div>

                        <div className="col-lg-2">
                          <button
                            className="btn btn-primary mt-4"
                            type="submit"
                            onClick={() => {
                              dispatch(
                                getPartnerLedgerGridData_Action(
                                  profileData.accountId,
                                  selectedBusinessUnit.value,
                                  values.supplierName?.value,
                                  values?.fromDate,
                                  values?.toDate,
                                  setLoading
                                )
                              );
                              dispatch(
                                getBusinessPartnerDetails(
                                  profileData.accountId,
                                  selectedBusinessUnit.value,
                                  values.supplierName?.value,
                                  setLoading
                                )
                              );
                            }}
                            disabled={!values?.supplierName}
                          >
                            View
                          </button>
                        </div>
                      </>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>

              <div className="mt-1" ref={printRef}>
                <div>
                  <h2 style={{ textAlign: "center" }}>Partner Ledger</h2>
                  <h6 style={{ textAlign: "center" }}>{party}</h6>
                </div>
                {/* <div className="row"></div> */}
                {/* Table Start */}
                {loading && <Loading />}
                <div className="row ">
                  {businessPartnerName && (
                    <>
                      <div className="col-lg-12 text-center">
                        <span>Partner Name: {businessPartnerName},</span>
                        <span className="ml-2">
                          Partner Address: {businessPartnerAddress}
                        </span>
                      </div>
                      <div className="col-lg-12 text-center">
                        <span>Partner Code: {businessPartnerCode},</span>
                        <span className="ml-2">
                          Partner Type: {businessPartnerTypeName},
                        </span>
                        <span className="ml-2">Bin No: {bin},</span>
                        <span className="ml-2">License No: {licenseNo}</span>
                      </div>
                    </>
                  )}
                  <div className="col-lg-12 text-center">
                    <span>
                      <b>From Date:</b> {_dateFormatter(values?.fromDate)}
                    </span>
                    <span className="ml-2">
                      <b>To Date:</b> {_dateFormatter(values?.toDate)}
                    </span>
                  </div>
                  <div className="col-lg-12">
                    {partnerLedgerGridData?.length >= 0 && (
                        <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table table-font-size-sm">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th style={{ width: "90px" }}>Date</th>
                            <th style={{ width: "90px" }}>Voucher No</th>
                            <th>Description</th>
                            <th style={{ width: "90px" }}>Debit Amount</th>
                            <th style={{ width: "90px" }}>Credit Amount</th>
                            <th style={{ width: "90px" }}>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {partnerLedgerGridData?.map((td, index) => (
                            <tr key={index}>
                              <td className="text-center">{td?.sl}</td>
                              <td>
                                <div className="text-right pr-2">
                                  {_dateFormatter(td?.transactionDate)}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {td?.transactionId === 0
                                    ? ""
                                    : td?.transactionId}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">{td?.narration}</div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {td?.dbAmount === 0
                                    ? ""
                                    : numberWithCommas(
                                        (td?.dbAmount || 0).toFixed(2)
                                      )}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {td?.crAmount === 0
                                    ? ""
                                    : numberWithCommas(
                                        (td?.crAmount || 0).toFixed(2)
                                      )}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {td?.balance === 0
                                    ? ""
                                    : numberWithCommas(
                                        (td?.balance || 0).toFixed(2)
                                      )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}
