import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import Select from "react-select";
import axios from "axios";
import TextArea from "antd/lib/input/TextArea";
import customStyles from "../../../../../../selectCustomStyle";
import FormikError from "../../../../../../_helper/_formikError";
import SearchAsyncSelect from "../../../../../../_helper/SearchAsyncSelect";
import { IInput } from "../../../../../../_helper/_input";
import IDelete from "../../../../../../_helper/_helperIcons/_delete";
import {
  getCostCenterDDL,
  getCostElementDDL,
  getRevenueCenterListDDL,
  getRevenueElementListDDL,
} from "../helper";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setter,
  remover,
  rowDto,
  state,
  isEdit,
  setRowDto,
  partnerTypeDDL,
  rowDtoHandler,
  selectedBusinessUnit,
  profileData,
}) {
  const [partnerType, setPartnerType] = useState("");
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [costElementDDL, setCostElementDDL] = useState([]);
  const [revenueCenterDDL, setRevenueCenterDDL] = useState([]);
  const [revenueElementDDL, setRevenueElementDDL] = useState([]);

  const loadTransactionList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/BusinessPartnerPurchaseInfo/GetTransactionByTypeSearchDDL?AccountId=${
          profileData?.accountId
        }&BusinessUnitId=${
          selectedBusinessUnit?.value
        }&Search=${v}&PartnerTypeName=${""}&RefferanceTypeId=${
          partnerType?.reffPrtTypeId
        }`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const debitCalc = () => {
    const debit = rowDto
      .filter((itm) => itm.debitCredit === "Debit")
      .map((itm) => Math.abs(itm.amount))
      .reduce((sum, curr) => {
        return (sum += curr);
      }, 0);
    return (debit || 0).toFixed(4);
  };

  const creditCalc = () => {
    let credit = rowDto
      .filter((itm) => itm.debitCredit === "Credit")
      .map((itm) => Math.abs(itm.amount))
      .reduce((sum, curr) => {
        return (sum += curr);
      }, 0);
    return (credit || 0).toFixed(4);
  };
  useEffect(() => {
    getCostElementDDL(
      selectedBusinessUnit.value,
      profileData.accountId,
      setCostElementDDL
    );
    getCostCenterDDL(
      selectedBusinessUnit.value,
      profileData.accountId,
      setCostCenterDDL
    );
    getRevenueElementListDDL(selectedBusinessUnit.value, setRevenueElementDDL);
    getRevenueCenterListDDL(selectedBusinessUnit.value, setRevenueCenterDDL);
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          sbu: state?.selectedSbu,
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-4">
                  <div className="row bank-journal bank-journal-custom bj-left py-5">
                    <div className="col-lg-6">
                      <label>Partner Type</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("gl", "");
                          setFieldValue("partnerType", valueOption);
                          setPartnerType(valueOption);
                          setFieldValue("transaction", "");
                        }}
                        options={partnerTypeDDL}
                        value={values?.partnerType}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Partner Type"
                      />
                            
                      <FormikError
                        errors={errors}
                        name="partnerType"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-6">
                      <label>Journal Date</label>
                      <input
                        className="trans-date cj-landing-date"
                        value={values?.transactionDate}
                        name="transactionDate"
                        onChange={(e) =>
                          setFieldValue("transactionDate", e.target.value)
                        }
                        type="date"
                      />
                    </div>
                    <div style={{ marginBottom: "12px" }} className="col-lg-12">
                      <label>Transaction</label>
                      <SearchAsyncSelect
                        selectedValue={values?.transaction}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setFieldValue("gl", "");
                          if (valueOption?.glData?.length === 1) {
                            setFieldValue("gl", valueOption?.glData[0]);
                          }
                          setFieldValue("transaction", valueOption);
                        }}
                        loadOptions={loadTransactionList}
                        isDisabled={!values?.partnerType}
                      />
                      <FormikError
                        errors={errors}
                        name="transaction"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-12">
                      <label>General Ledger</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("gl", valueOption);
                        }}
                        isDisabled={!values?.transaction}
                        options={values?.transaction?.glData || []}
                        value={values?.gl}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="General Ledger"
                      />
                            
                      <FormikError
                        errors={errors}
                        name="gl"
                        touched={touched}
                      />
                    </div>

                    <div
                      style={{ marginTop: "17px" }}
                      className="col-lg-6 d-flex"
                    >
                      <Field
                        id="debit"
                        type="radio"
                        name="debitCredit"
                        value="Debit"
                      />
                      <label
                        style={{ marginTop: "-1.5px" }}
                        className="ml-2 mr-2"
                        for="debit"
                      >
                        Debit
                      </label>
                      <Field
                        className="ml-3"
                        id="credit"
                        type="radio"
                        name="debitCredit"
                        value="Credit"
                      />
                      <label
                        for="credit"
                        style={{ marginTop: "-1.5px" }}
                        className="ml-2"
                      >
                        Credit
                      </label>
                    </div>
                    <div className="col-lg-6">
                      <IInput
                        type="number"
                        value={values?.amount}
                        label="Amount"
                        name="amount"
                        step="any"
                        min="0"
                      />
                    </div>
                    <div className="col-lg-12 mt-3">
                      <label>Narration</label>
                      <TextArea
                        value={values?.headerNarration}
                        name="headerNarration"
                        placeholder="Narration"
                        rows="3"
                        onChange={(e) =>
                          setFieldValue("headerNarration", e.target.value)
                        }
                        max={1000}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div
                      style={{ marginTop: "10px" }}
                      className="col-lg-10 d-flex"
                    >
                      <Field
                        id="cost"
                        type="radio"
                        name="costRevenue"
                        value="cost"
                        onChange={(e) => {
                          setFieldValue("costRevenue", e.target.value);
                          setFieldValue("revenueCenter", "");
                          setFieldValue("revenueElement", "");
                        }}
                      />
                      <label
                        style={{ marginTop: "-1.5px" }}
                        className="ml-2 mr-2"
                        htmlFor="cost"
                      >
                        Cost
                      </label>
                      <Field
                        className="ml-3"
                        id="revenue"
                        type="radio"
                        name="costRevenue"
                        value="revenue"
                        onChange={(e) => {
                          setFieldValue("costRevenue", e.target.value);
                          setFieldValue("costCenter", "");
                          setFieldValue("costElement", "");
                        }}
                      />
                      <label
                        htmlFor="revenue"
                        style={{ marginTop: "-1.5px" }}
                        className="ml-2"
                      >
                        Revenue
                      </label>
                    </div>
                    {/* it will be changed if user select bank receipt from previous page */}
                    {values?.costRevenue === "revenue" ? (
                      <div className="d-flex" style={{ marginTop: "10px" }}>
                        <div className="col-lg-6  mb-2">
                          <label>Revenue Center</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue("revenueCenter", valueOption);
                            }}
                            value={values?.revenueCenter}
                            options={revenueCenterDDL || []}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Revenue Center"
                            isDisabled={!values?.costRevenue}
                          />
                          <FormikError
                            errors={errors}
                            name="revenueCenter"
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-6 pr  mb-2">
                          <label>Revenue Element</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue("revenueElement", valueOption);
                            }}
                            value={values?.revenueElement}
                            options={revenueElementDDL || []}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Revenue Element"
                            isDisabled={!values?.costRevenue}
                          />
                          <FormikError
                            errors={errors}
                            name="revenueElement"
                            touched={touched}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex" style={{ marginTop: "10px" }}>
                        <div className="col-lg-6 mb-2">
                          <label>Cost Center</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue("costCenter", valueOption);
                            }}
                            value={values?.costCenter}
                            options={costCenterDDL || []}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Cost Center"
                            isDisabled={!values?.costRevenue}
                          />
                          <FormikError
                            errors={errors}
                            name="costCenter"
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-6 pr  mb-2">
                          <label>Cost Element</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue("costElement", valueOption);
                            }}
                            value={values?.costElement}
                            options={costElementDDL || []}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Cost Element"
                            isDisabled={!values?.costRevenue}
                          />
                          <FormikError
                            errors={errors}
                            name="costElement"
                            touched={touched}
                          />
                        </div>
                      </div>
                    )}
                    <div className="col-lg-12 text-right">
                      <button
                        onClick={() => {
                          if (!values?.transaction)
                            return toast.warn("Please select transaction");
                          if (!values?.gl)
                            return toast.warn("Please select general Ledger");

                          if (values?.amount < 1)
                            return toast.error(
                              "Amount Field must be positive !"
                            );
                          setter(values);
                        }}
                        className="btn btn-primary"
                        style={{
                          padding: "5px 20px",
                          marginTop: "12px",
                        }}
                        disabled={
                          !values?.transactionDate ||
                          !values.headerNarration ||
                          !values.debitCredit ||
                          !values.amount ||
                          !values?.transaction ||
                          !values?.gl
                        }
                        type="button"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="row">
                    <div className="col-lg-12 pr-0">
                      <div
                        style={{ padding: "5px" }}
                        className="d-flex justify-content-between global-form m-0"
                      >
                        <div></div>
                        <div>
                          <b className="mr-2">
                            Debit:
                            {rowDto.length > 0 ? debitCalc() : null}
                          </b>
                          <b>
                            Credit:
                            {rowDto.length > 0 ? creditCalc() : null}
                          </b>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 pr-0">
                      <div>
                        {rowDto.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-striped table-bordered mt-1 bj-table">
                              <thead>
                                <tr>
                                  <th>SL</th>
                                  <th>General Ledger</th>
                                  <th>Transaction</th>
                                  <th>Debit</th>
                                  <th>Credit</th>
                                  <th>Narration</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rowDto.map((itm, idx) => {
                                  return (
                                    <tr key={itm?.transactionId}>
                                      <td>{idx + 1}</td>
                                      <td>
                                        <div className="text-left pl-2">
                                          {itm?.gl?.label}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-left pl-2">
                                          {itm?.transaction?.label}
                                        </div>
                                      </td>
                                      {itm?.debitCredit === "Debit" ? (
                                        <td style={{ width: "145px" }}>
                                          <div className="text-center">
                                            {/* {Math.abs(itm?.amount)} */}
                                            <input
                                              value={Math.abs(itm?.amount)}
                                              onChange={(e) => {
                                                // let amount =
                                                //   itm?.debitCredit === "Credit"
                                                //     ? -1 * e.target.value
                                                //     : e.target.value;
                                                rowDtoHandler(
                                                  idx,
                                                  "amount",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </td>
                                      ) : (
                                        <td>{""}</td>
                                      )}
                                      {itm?.debitCredit === "Credit" ? (
                                        <td style={{ width: "145px" }}>
                                          <div className="text-center">
                                            {/* {Math.abs(itm?.amount)} */}
                                            <input
                                              value={Math.abs(itm?.amount)}
                                              onChange={(e) => {
                                                // let amount =
                                                //   itm?.debitCredit === "Credit"
                                                //     ? -1 * e.target.value
                                                //     : e.target.value;
                                                rowDtoHandler(
                                                  idx,
                                                  "amount",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </td>
                                      ) : (
                                        <td>{""}</td>
                                      )}
                                      <td
                                        style={{
                                          width: "100px",
                                          fontSize: "9px",
                                        }}
                                      >
                                        <div className="text-left pl-2">
                                          {itm?.headerNarration}
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <IDelete remover={remover} id={idx} />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
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
          </>
        )}
      </Formik>
    </>
  );
}
