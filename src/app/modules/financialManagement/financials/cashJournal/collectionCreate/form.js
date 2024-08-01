import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { IInput } from "../../../../_helper/_input";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
  generalLedgerTypeId_Api,
  getBankAccountDDL_api,
  getCostElementDDL,
  getPartnerTypeDDLAction,
} from "../helper";
import FormikError from "../../../../_helper/_formikError";
import placeholderImg from "./../../../../_helper/images/placeholderImg.png";
import DebitCredit from "./DebitCredit";
import ReceiveAndPaymentsTable from "./ReceiveAndPaymentsTable";
import TransferTable from "./TransferTable";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import TextArea from "antd/lib/input/TextArea";
import {
  getCostCenterDDL,
  getRevenueCenterListDDL,
  getRevenueElementListDDL,
} from "../../bankJournal/helper";
import { attachmentUpload } from "../../../../_helper/attachmentUpload";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";

const receiptsJournal = Yup.object().shape({
  receiveFrom: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(1000, "Maximum 100 symbols")
    .required("Receive From required"),
  narration: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(10000000000000000000, "Maximum 10000000000000000000 symbols"),
  headerNarration: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(10000000000000000000, "Maximum 10000000000000000000 symbols")
    .required("Narration required"),
  cashGLPlus: Yup.object().shape({
    label: Yup.string().required("Cash GL is required"),
    value: Yup.string().required("Cash GL is required"),
  }),
  transaction: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
});

const paymentsJournal = Yup.object().shape({
  paidTo: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(
      1000000000000000000000000000000,
      "Maximum 1000000000000000000000000000000 symbols"
    )
    .required("Paid To required"),
  narration: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(10000000000000000000, "Maximum 10000000000000000000 symbols"),
  headerNarration: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(10000000000000000000, "Maximum 10000000000000000000 symbols")
    .required("Narration required"),
  cashGLPlus: Yup.object().shape({
    label: Yup.string().required("Cash GL is required"),
    value: Yup.string().required("Cash GL is required"),
  }),
  transaction: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
});

const transferJournal = Yup.object().shape({
  headerNarration: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(10000000000000000000, "Maximum 10000000000000000000 symbols")
    .required("Narration required"),
  cashGLPlus: Yup.object().shape({
    label: Yup.string().required("Cash GL is required"),
    value: Yup.string().required("Cash GL is required"),
  }),
  gLBankAc: Yup.object().shape({
    label: Yup.string().required("GL/Bank Ac is required"),
    value: Yup.string().required("GL/Bank Ac is required"),
  }),
  trasferTo: Yup.object().shape({
    label: Yup.string().required("Trasfer To is required"),
    value: Yup.string().required("Trasfer To is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  rowDto,
  remover,
  headerData,
  setter,
  setRowDto,
  netAmount,
  attachmentFile,
  setAttachmentFile,
}) {
  const [generalLedgerDDL, setGeneralLedgerDDL] = useState([]);
  const [bankAccountDDL, setBankAccountDDL] = useState([]);
  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);
  const [partnerType, setPartnerType] = useState("");
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [costElementDDL, setCostElementDDL] = useState([]);
  const [revenueCenterDDL, setRevenueCenterDDL] = useState([]);
  const [revenueElementDDL, setRevenueElementDDL] = useState([]);
  const inputAttachFile = useRef(null);
  const dispatch = useDispatch();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      if (
        headerData?.accountingJournalTypeId === 1 ||
        headerData?.accountingJournalTypeId === 2
      ) {
        generalLedgerTypeId_Api(
          profileData?.accountId,
          selectedBusinessUnit.value,
          2,
          setGeneralLedgerDDL
        );
      } else if (headerData?.accountingJournalTypeId === 3) {
        generalLedgerTypeId_Api(
          profileData?.accountId,
          selectedBusinessUnit.value,
          3,
          setGeneralLedgerDDL
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    getPartnerTypeDDLAction(setPartnerTypeDDL);
    getCostCenterDDL(
      selectedBusinessUnit.value,
      profileData.accountId,
      setCostCenterDDL
    );
    getRevenueElementListDDL(selectedBusinessUnit.value, setRevenueElementDDL);
    getRevenueCenterListDDL(selectedBusinessUnit.value, setRevenueCenterDDL);
  }, [selectedBusinessUnit, profileData]);

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

  const onButtonAttachmentClick = () => {
    inputAttachFile.current.click();
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          partnerType: {
            value: 2,
            label: "Customer",
            reffPrtTypeId: 2,
          },
          gl:initData?.transaction?.glData?.length === 1 ? initData?.transaction?.glData[0] : "",
          receiveFrom: headerData?.accountingJournalTypeId === 1 ? initData?.transaction?.label : "",
          paidTo : headerData?.accountingJournalTypeId === 2 ? initData?.transaction?.label : "",
          transaction : initData?.transaction,
        }}
        validationSchema={
          headerData?.accountingJournalTypeId === 1
            ? receiptsJournal
            : headerData?.accountingJournalTypeId === 2
            ? paymentsJournal
            : transferJournal
        }
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
            <Form className="form form-label-right">
              <div className="row cash-journal-wrapper">
                {/* Start Left */}
                <div className="col-lg-4">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-6 pl pr-1 mb-2">
                      <div>Journal Date</div>
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

                    {/* col-lg-6 */}
                    {(headerData?.accountingJournalTypeId === 1 ||
                      headerData?.accountingJournalTypeId === 2) && (
                      <div className="col-lg-6 pl pr-1 mb-2">
                        <label>Select Cash GL</label>
                        <Select
                          label="Select Cash GL"
                          options={generalLedgerDDL || []}
                          value={values.cashGLPlus}
                          name="cashGLPlus"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          isSearchable={true}
                          styles={customStyles}
                          placeholder="Select Cash GL"
                          onChange={(valueOption) => {
                            setFieldValue("cashGLPlus", valueOption);
                          }}
                        />
                        <FormikError
                          errors={errors}
                          name="cashGLPlus"
                          touched={touched}
                        />
                      </div>
                    )}

                    {/* col-lg-6 */}
                    {headerData?.accountingJournalTypeId === 3 ? (
                      <>
                        <div className="col-lg-6 pr pl-1 mb-2">
                          <label>Select Trasfer To</label>
                          <Select
                            label="Select Trasfer To"
                            options={
                              [
                                { value: 2, label: "Cash" },
                                { value: 3, label: "Bank" },
                              ] || []
                            }
                            value={values.trasferTo}
                            name="trasferTo"
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Select Trasfer To"
                            onChange={(valueOption) => {
                              setFieldValue("trasferTo", valueOption);
                              generalLedgerTypeId_Api(
                                profileData?.accountId,
                                selectedBusinessUnit.value,
                                2,
                                setGeneralLedgerDDL
                              );
                              if (valueOption?.value === 3) {
                                getBankAccountDDL_api(
                                  profileData?.accountId,
                                  selectedBusinessUnit.value,
                                  setBankAccountDDL
                                );
                              }

                              setFieldValue("cashGLPlus", "");
                              setFieldValue("gLBankAc", "");
                            }}
                          />
                          <FormikError
                            errors={errors}
                            name="trasferTo"
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-6 pr pl-1 mb-2">
                          <label>Select Cash GL</label>
                          <Select
                            label="Select Cash GL"
                            options={generalLedgerDDL || []}
                            value={values.cashGLPlus}
                            name="cashGLPlus"
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Select Cash GL"
                            onChange={(valueOption) => {
                              setFieldValue("cashGLPlus", valueOption);
                            }}
                          />
                          <FormikError
                            errors={errors}
                            name="cashGLPlus"
                            touched={touched}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-lg-12 pl pr-1 mb-2">
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
                            isDisabled
                          />

                          <FormikError
                            errors={errors}
                            name="partnerType"
                            touched={touched}
                          />
                        </div>

                        <div
                          style={{ marginBottom: "12px" }}
                          className="col-lg-12 pl pr"
                        >
                          <label>
                            {(values?.partnerType?.label === "Others"
                              ? "Transaction"
                              : values?.partnerType?.label) || "Transaction"}
                          </label>
                          <SearchAsyncSelect
                            selectedValue={values?.transaction}
                            isSearchIcon={true}
                            handleChange={(valueOption) => {
                              setFieldValue("gl", "");
                              if (valueOption?.glData?.length === 1) {
                                setFieldValue("gl", valueOption?.glData[0]);
                              }
                              if (headerData?.accountingJournalTypeId === 1) {
                                setFieldValue(
                                  "receiveFrom",
                                  valueOption?.label
                                );
                              } else if (
                                headerData?.accountingJournalTypeId === 2
                              ) {
                                setFieldValue("paidTo", valueOption?.label);
                              }

                              setFieldValue("transaction", valueOption);
                            }}
                            loadOptions={loadTransactionList}
                            isDisabled={true}
                          />
                          <FormikError
                            errors={errors}
                            name="transaction"
                            touched={touched}
                          />
                        </div>

                        <div className="col-lg-12 pl pr mb-2">
                          <label>General Ledger</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue("gl", valueOption);
                            }}
                            isDisabled={true}
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
                      </>
                    )}

                    {headerData?.accountingJournalTypeId === 1 && (
                      <div className="col-lg-6 pl pr-1 mb-2 border-gray">
                        <IInput
                          value={values.receiveFrom}
                          label="Receive From"
                          name="receiveFrom"
                          disabled
                        />
                      </div>
                    )}
                    {headerData?.accountingJournalTypeId === 2 && (
                      <div className="col-lg-6 pr pl-1 mb-2">
                        <IInput
                          value={values.paidTo}
                          label="Paid To"
                          name="paidTo"
                        />
                      </div>
                    )}
                    {headerData?.accountingJournalTypeId !== 3 && (
                      <div className="col-lg-6 pl pr mb-1 disable-border disabled-feedback border-gray">
                        <IInput
                          value={values?.amount}
                          label="Amount"
                          name="amount"
                          step="any"
                          type="number"
                          min="0"
                          disabled
                        />
                      </div>
                    )}
                    {/* col-lg-6 */}
                    {headerData?.accountingJournalTypeId === 3 && (
                      <div className="col-lg-6 pr pl-1 mb-2">
                        <label>Select GL/Bank Ac</label>
                        <Select
                          label="Select GL/Bank Ac"
                          options={
                            values.trasferTo.value === 2
                              ? generalLedgerDDL
                              : bankAccountDDL || []
                          }
                          value={values.gLBankAc}
                          name="gLBankAc"
                          isSearchable={true}
                          styles={customStyles}
                          placeholder="Select GL/Bank Ac"
                          onChange={(valueOption) => {
                            setFieldValue("gLBankAc", valueOption);
                          }}
                        />
                        <FormikError
                          errors={errors}
                          name="gLBankAc"
                          touched={touched}
                        />
                      </div>
                    )}
                    {/* col-lg-2 */}
                    {headerData?.accountingJournalTypeId === 3 && (
                      <div className="col-lg-12 pr-1 pl mb-2 disable-border disabled-feedback border-gray">
                        <IInput
                          value={values.amount}
                          label="Amount"
                          name="amount"
                          step="any"
                          type="number"
                          min="0"
                        />
                      </div>
                    )}
                    <div className="col-lg-12 pl pr mb-2 h-narration border-gray">
                      <label>Narration</label>
                      <TextArea
                        value={values?.headerNarration}
                        name="headerNarration"
                        placeholder="Narration"
                        rows="3"
                        onChange={(e) => {
                          setFieldValue("narration", e.target.value);
                          setFieldValue("headerNarration", e.target.value);
                        }}
                        max={1000}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* it will be changed if user select bank receipt from previous page */}
                    {headerData?.accountingJournalTypeId === 1 ? (
                      <>
                        <div className="col-lg-6 pr pl-1 mb-2">
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
                          />
                          <FormikError
                            errors={errors}
                            name="revenueElement"
                            touched={touched}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-lg-6 pr pl-1 mb-2">
                          <label>Cost Center</label>
                          <Select
                            onChange={(valueOption) => {
                              if (valueOption) {
                                setFieldValue("costCenter", valueOption);
                                getCostElementDDL(
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
                            }}
                            value={values?.costCenter}
                            options={costCenterDDL || []}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Cost Center"
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
                          />
                          <FormikError
                            errors={errors}
                            name="costElement"
                            touched={touched}
                          />
                        </div>
                      </>
                    )}
                    {headerData?.accountingJournalTypeId === 2 && !isEdit ? (
                      <div className="col-lg-12">
                        <label>Attachment </label>
                        <div
                          className={
                            attachmentFile
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
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                attachmentUpload(e.target.files)
                                  .then((data) => {
                                    setAttachmentFile(data?.[0]?.id);
                                  })
                                  .catch((error) => {
                                    setAttachmentFile("");
                                  });
                              }
                            }}
                            type="file"
                            ref={inputAttachFile}
                            id="file"
                            style={{ display: "none" }}
                          />
                          <div>
                            {!attachmentFile && (
                              <img
                                style={{ maxWidth: "50px" }}
                                src={placeholderImg}
                                className="img-fluid"
                                alt="Upload or drag documents"
                              />
                            )}
                          </div>
                          {attachmentFile && (
                            <div className="d-flex align-items-center">
                              <p
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  color: "#0072E5",
                                  cursor: "pointer",
                                  margin: "0px",
                                }}
                              >
                                {attachmentFile}
                              </p>
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
                                        attachmentFile
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
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                    {headerData?.accountingJournalTypeId !== 3 && (
                      <div className="col-lg-12 text-right pl-0 bank-journal">
                        <button
                          style={{
                            padding: "5px 20px",
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                          type="button"
                          disabled={
                            !values?.transaction ||
                            !values?.amount ||
                            !values?.narration
                          }
                          className="btn btn-primary"
                          onClick={() => {
                            if (!values?.transaction)
                              return toast.warn("Select transaction");
                            if (!values?.gl)
                              return toast.warn("Select General Ledger");
                            if (!values?.cashGLPlus)
                              return toast.warn("Please add cash GL");
                            if (!values?.headerNarration)
                              return toast.warn("Please add header narration");
                            setter(values);
                            // setFieldValue("transaction", "");
                            setFieldValue("amount", "");
                          }}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* End Left */}

                {/* start right */}

                <div className="col-lg-8 pr-0">
                  <div
                    style={{ paddingBottom: "6px", paddingTop: "1px" }}
                    className="row bank-journal bank-journal-custom bj-left"
                  >
                    <div style={{ paddingTop: "4px" }} className="col-lg-12">
                      <DebitCredit
                        type={headerData?.accountingJournalTypeId}
                        amount={values?.amount}
                        netAmount={netAmount}
                      />
                    </div>
                  </div>

                  {/* <div className="row">
                    <div
                      style={{ paddingLeft: "8px" }}
                      className="col-lg-12 p-0 pl-1 m-0"
                    >
                      
                    </div>
                  </div> */}
                  <ReceiveAndPaymentsTable
                    jorunalType={headerData?.accountingJournalTypeId}
                    rowDto={rowDto}
                    values={values}
                    netAmount={netAmount}
                    remover={remover}
                  />
                  <TransferTable
                    jorunalType={headerData?.accountingJournalTypeId}
                    values={values}
                  />
                </div>
              </div>

              {/* Row Dto Table End */}

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
