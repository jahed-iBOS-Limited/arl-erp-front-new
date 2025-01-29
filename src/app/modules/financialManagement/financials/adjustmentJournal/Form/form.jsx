import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import customStyles from "../../../../selectCustomStyle";
import { attachmentUpload } from "../../../../_helper/attachmentUpload";
import placeholderImg from "../../../../_helper/images/placeholderImg.png";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../_helper/_input";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import {
  getCostCenterDDL,
  getProfitCenterDDL,
  getRevenueCenterListDDL,
  getRevenueElementListDDL,
} from "../../bankJournal/helper";
import { getCostElementByCostCenterDDL } from "../helper";
import "./adjustmentJournalStyles.css";
import { confirmAlert } from "react-confirm-alert";
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
  const dispatch = useDispatch();
  const [partnerType, setPartnerType] = useState("");
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [costElementDDL, setCostElementDDL] = useState([]);
  const [revenueCenterDDL, setRevenueCenterDDL] = useState([]);
  const [revenueElementDDL, setRevenueElementDDL] = useState([]);
  const [profitCenterDDL, setProfitCenterDDL] = useState([]);
  const inputAttachFile = useRef(null);
  const onButtonAttachmentClick = () => {
    inputAttachFile.current.click();
  };
  const [loading, setLoading] = useState(false);
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
    // getCostElementDDL(
    //   selectedBusinessUnit.value,
    //   profileData.accountId,
    //   setCostElementDDL
    // );
    getCostCenterDDL(
      selectedBusinessUnit.value,
      profileData.accountId,
      setCostCenterDDL
    );
    getRevenueElementListDDL(selectedBusinessUnit.value, setRevenueElementDDL);
    getRevenueCenterListDDL(selectedBusinessUnit.value, setRevenueCenterDDL);
  }, [profileData, selectedBusinessUnit]);
  useEffect(() => {
    getProfitCenterDDL(selectedBusinessUnit.value, setProfitCenterDDL);
  }, [selectedBusinessUnit]);

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          sbu: state?.selectedSbu,
          profitCenter: "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          return confirmAlert({
            title: "Are you sure?",
            message: "",
            buttons: [
              {
                label: "Yes",
                onClick: () => {
                  saveHandler(values, () => {
                    resetForm(initData);
                    setRowDto([]);
                  });
                },
              },
              {
                label: "No",
                onClick: () => "",
              },
            ],
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
            <Form className="form form-label-right adjustment-journal-wrapper">
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
                          setFieldValue("profitCenter", "");
                          setFieldValue("costRevenue", "");
                          setFieldValue("revenueCenter", "");
                          setFieldValue("revenueElement", "");
                          setFieldValue("costCenter", "");
                          setFieldValue("costElement", "");
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
                          setFieldValue("profitCenter", "");
                          setFieldValue("costRevenue", "");
                          setFieldValue("revenueCenter", "");
                          setFieldValue("revenueElement", "");
                          setFieldValue("costCenter", "");
                          setFieldValue("costElement", "");
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
                    <div className="col-lg-12 my-2">
                      <label>Profit Center</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("profitCenter", valueOption);
                          setFieldValue("costRevenue", "");
                          setFieldValue("revenueCenter", "");
                          setFieldValue("revenueElement", "");
                          setFieldValue("costCenter", "");
                          setFieldValue("costElement", "");
                        }}
                        isClearable={true}
                        options={profitCenterDDL}
                        value={values?.profitCenter}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Profit Center"
                      />
                      <FormikError
                        errors={errors}
                        name="profitCenter"
                        touched={touched}
                      />
                    </div>
                    {values?.profitCenter && (
                      <>
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
                                  if (valueOption) {
                                    setFieldValue("costCenter", valueOption);
                                    getCostElementByCostCenterDDL(
                                      selectedBusinessUnit.value,
                                      profileData.accountId,
                                      valueOption?.value,
                                      setCostElementDDL
                                    );
                                    setFieldValue("costElement", "");
                                  } else {
                                    setCostElementDDL([]);
                                    setFieldValue("costCenter", "");
                                    setFieldValue("costElement", "");
                                  }
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
                      </>
                    )}
                    {!isEdit && (
                      <div className="col-lg-12">
                        <label className="w-100">Attachment </label>
                        {!values?.attachment?.[0]?.id && (
                          <div
                            style={{
                              backgroundColor: "white",
                              borderRadius: "6px",
                            }}
                          >
                            <div
                              className={
                                values?.attachment?.[0]?.id
                                  ? "image-upload-box with-img"
                                  : "image-upload-box"
                              }
                              onClick={onButtonAttachmentClick}
                              style={{
                                cursor: "pointer",
                                position: "relative",
                                height: "35px",
                              }}
                            >
                              <input
                                onChange={async (e) => {
                                  if (e.target.files?.[0]) {
                                    const attachmentResponse = await attachmentUpload(
                                      e.target.files,
                                      setLoading
                                    );

                                    setFieldValue(
                                      "attachment",
                                      attachmentResponse
                                    );
                                  }
                                }}
                                type="file"
                                ref={inputAttachFile}
                                id="file"
                                style={{ display: "none" }}
                              />

                              <div className="w-100 d-flex align-items-center justify-content-center">
                                <img
                                  style={{ maxWidth: "50px" }}
                                  src={placeholderImg}
                                  className="img-fluid"
                                  alt="Upload or drag documents"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {values?.attachment?.[0]?.id && (
                          <>
                            <div className="w-100">
                              <p
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  color: "#0072E5",
                                  cursor: "pointer",
                                  margin: "0px",
                                }}
                              >
                                {values?.attachment?.[0]?.fileName}{" "}
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
                                          values?.attachment?.[0]?.id
                                        )
                                      );
                                    }}
                                    className="ml-2"
                                  >
                                    <i
                                      style={{ fontSize: "16px" }}
                                      className={`fa pointer fa-eye`}
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    <div className="col-lg-12">
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

                          if (
                            values?.gl?.accountGroupId === 3 ||
                            values?.gl?.accountGroupId === 4
                          ) {
                            if (!values?.profitCenter)
                              return toast.warn("Select profit center");
                          }

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
                          !values?.gl ||
                          (!isEdit && !values?.attachment)
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
                                <th>Element</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto.map((itm, idx) => {
                                let str = `${itm?.amount}`;
                                let amount = str.replace(/-/g, "");
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
                                            value={amount}
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
                                            value={amount}
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
                                        {/* {itm?.headerNarration} */}
                                        {itm?.costRevenueName || ""}
                                        {itm?.elementName
                                          ? `, ${itm?.elementName || ""}`
                                          : ""}
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
