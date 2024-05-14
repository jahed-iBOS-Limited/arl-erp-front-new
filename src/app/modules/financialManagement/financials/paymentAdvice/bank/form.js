import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { IInput } from "../../../../_helper/_input";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { useEffect } from "react";
import {
  getBankAc,
  // getPartner,
  getBusinessPartnerSalesDDLAction,
  // getBusinessPartnerPurchaseDDLAction,
  // getPartnerDetailsDDL,
  getTransaction,
  getSendToGLBank,
  // getOthersPartner,
  getNextBankCheque,
  generateAdviceNo
} from "../../../financials/bankJournal/helper";
import FormikError from "../../../../_helper/_formikError";
import {getInstrumentType} from "../helper"

// Validation schema for bank receive
const ReceivevalidationSchema = Yup.object().shape({
  bankAcc: Yup.object().shape({
    label: Yup.string().required("Bank Account is required"),
    value: Yup.string().required("Bank Account is required"),
  }),
  // partner: Yup.object().shape({
  //   label: Yup.string().required("Partner is required"),
  //   value: Yup.string().required("Partner is required"),
  // }),
  receiveFrom: Yup.string().required("Receive from is required"),
  instrumentType: Yup.object().shape({
    label: Yup.string().required("Instrument type is required"),
    value: Yup.string().required("Instrument type is required"),
  }),
  instrumentNo: Yup.string().required("Instrument no is required"),
  instrumentDate: Yup.string().required("Instrument date is required"),
  headerNarration: Yup.string().required("Narration is required"),
  placingDate: Yup.string().required("Placing date is required"),
});

// Validation schema for bank payment
const PaymentvalidationSchema = Yup.object().shape({
  bankAcc: Yup.object().shape({
    label: Yup.string().required("Bank Account is required"),
    value: Yup.string().required("Bank Account is required"),
  }),
  // partner: Yup.object().shape({
  //   label: Yup.string().required("Partner is required"),
  //   value: Yup.string().required("Partner is required"),
  // }),
  instrumentType: Yup.object().shape({
    label: Yup.string().required("Instrument type is required"),
    value: Yup.string().required("Instrument type is required"),
  }),
  paidTo: Yup.string().required("Paid to is required"),
  instrumentNo: Yup.string().required("Instrument no is required"),
  instrumentDate: Yup.string().required("Instrument date is required"),
  headerNarration: Yup.string().required("Header narration is required"),
});
// Validation schema for bank transfer
const TransfervalidationSchema = Yup.object().shape({
  bankAcc: Yup.object().shape({
    label: Yup.string().required("Bank Account is required"),
    value: Yup.string().required("Bank Account is required"),
  }),
  transferTo: Yup.object().shape({
    label: Yup.string().required("Transfer to is required"),
    value: Yup.string().required("Transfer to is required"),
  }),
  sendToGLBank: Yup.object().shape({
    label: Yup.string().required("GL/BL is required"),
    value: Yup.string().required("GL/BL is required"),
  }),
  instrumentType: Yup.object().shape({
    label: Yup.string().required("Instrument type is required"),
    value: Yup.string().required("Instrument type is required"),
  }),
  transferAmount: Yup.string().required("Amount is required"),
  instrumentNo: Yup.string().required("Instrument no is required"),
  instrumentDate: Yup.date().required("Instrument date is required"),
  headerNarration: Yup.string().required("Header narration is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  remover,
  setter,
  profileData,
  selectedBusinessUnit,
  jorunalType,
  netAmount,
  partnerTypeDDL,
  landingValues
}) {
  const [sendToGLBank, setSendToGLBank] = useState([]);
  const [bankAcc, setBankAcc] = useState([]);
  const [partner, setPartner] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [instrumentType, setInstrumentType] = useState([]);

  useEffect(() => {
    if ((profileData?.accountId && selectedBusinessUnit?.value)) {
      getBankAc(profileData.accountId, selectedBusinessUnit.value, setBankAcc);
      // getPartner(profileData.accountId, selectedBusinessUnit.value, setPartner);
      // getPartnerDetailsDDL(profileData.accountId, selectedBusinessUnit.value, setPartner);
      getBusinessPartnerSalesDDLAction(
        profileData?.accountId,
        selectedBusinessUnit.value,
        setPartner
      );
      getInstrumentType(setInstrumentType);
      getTransaction(
        profileData.accountId,
        selectedBusinessUnit.value,
        setTransaction
      );
      getSendToGLBank(
        profileData.accountId,
        selectedBusinessUnit.value,
        3,
        setSendToGLBank
      );
    }
  }, [profileData, selectedBusinessUnit]);


  return (
    <>
      <Formik
        initialValues={{
          ...initData,
          customerSupplierStatus: "customer",
        }}
        validationSchema={
          jorunalType === 4
            ? ReceivevalidationSchema
            : jorunalType === 5
            ? PaymentvalidationSchema
            : TransfervalidationSchema
        }
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-4">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-6 pl pr-1 mb-2">
                      <div>Transaction Date</div>
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
                    <div className="col-lg-6 pl pr-1 mb-2">
                      <label>Select Bank AC</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("bankAcc", valueOption);
                          if(values?.instrumentType?.value === 2){
                            getNextBankCheque(
                              profileData?.accountId,
                              selectedBusinessUnit.value,
                              valueOption?.bankId,
                              valueOption?.bankBranch_Id,
                              valueOption?.value,
                              setFieldValue,
                              "instrumentNo"
                            );
                          }
                        }}
                        options={bankAcc || []}
                        value={values?.bankAcc}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Bank Ac"
                      />
                      <FormikError
                        errors={errors}
                        name="bankAcc"
                        touched={touched}
                      />
                    </div>

                    {/* This dropdown field will be changed based on previous page */}
                    {jorunalType === 6 ? (
                      <div className="col-lg-6 pr pl-1 mb-2">
                        <label>Select Transfer To</label>
                        <Select
                          onChange={(valueOption) => {
                            setFieldValue("transferTo", valueOption);
                            setFieldValue("sendToGLBank", "");
                          }}
                          options={[
                            { value: 1, label: "Cash" },
                            { value: 2, label: "Bank" },
                          ]}
                          value={values?.transferTo}
                          isSearchable={true}
                          styles={customStyles}
                          placeholder="Transfer to"
                        />
                        <FormikError
                          errors={errors}
                          name="transferTo"
                          touched={touched}
                        />
                      </div>
                    ) : (
                       <> <div className="col-lg-6 pr pl-1 mb-2">
                          <label>Partner Type</label>
                          <Select
                            label="Partner Type"
                            options={partnerTypeDDL || []}
                            value={values.partnerType}
                            name="partnerType"
                            setFieldValue={setFieldValue}
                            errors={errors}
                            touched={touched}
                            isDisabled={true}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Partner Type"
                            onChange={(valueOption) => {
                              setFieldValue("partnerType", valueOption);
                              // setFieldValue("partner", "");

                              // if (valueOption?.value === 2) {
                              //   getBusinessPartnerSalesDDLAction(
                              //     profileData?.accountId,
                              //     selectedBusinessUnit.value,
                              //     setPartner
                              //   );
                              // }else if (valueOption?.value === 1){
                              //   getBusinessPartnerPurchaseDDLAction(
                              //     profileData?.accountId,
                              //     selectedBusinessUnit.value,
                              //     setPartner
                              //   );
                              // }else {
                              //   getOthersPartner(
                              //     profileData?.accountId,
                              //     selectedBusinessUnit.value,
                              //     setPartner
                              //   );
                              // }
                              // setFieldValue("receiveFrom", valueOption?.label);
                              // setFieldValue("paidTo", valueOption?.label);
                            }}
                          />
                          <FormikError
                            errors={errors}
                            name="partner"
                            touched={touched}
                          />
                        </div>

                        <div className="col-lg-6 pr pl-1 mb-2">
                          <label>Select Partner</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue("receiveFrom", valueOption?.label);
                              setFieldValue("paidTo", valueOption?.label);
                              setFieldValue("partner", valueOption);
                            }}
                            isDisabled={true}
                            value={values?.partner}
                            options={partner || []}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Partner"
                          />
                          <FormikError
                            errors={errors}
                            name="partner"
                            touched={touched}
                          />
                        </div> 
                      </> 
                    )}

                    {/* This input field will be changed based on previous page */}
                    {jorunalType === 4 ? (
                      <div className="col-lg-6 pl pr-1 mb-2 border-gray">
                        <IInput
                          value={values.receiveFrom}
                          label="Receive From"
                          name="receiveFrom"
                        />
                      </div>
                    ) : jorunalType === 5 ? (
                      <div className="col-lg-6 pr-1 pl mb-2 border-gray">
                        <IInput
                          value={values.paidTo}
                          label="Paid to"
                          name="paidTo"
                        />
                      </div>
                    ) : (
                      <div className="col-lg-6 pl pr-1 mb-2">
                        <label>Select Send to GL/Bank</label>
                        <Select
                          onChange={(valueOption) => {
                            setFieldValue("sendToGLBank", valueOption);
                          }}
                          isDisabled={!values?.transferTo}
                          value={values?.sendToGLBank}
                          options={
                            values?.transferTo?.value === 1
                              ? sendToGLBank
                              : bankAcc
                          }
                          isSearchable={true}
                          styles={customStyles}
                          placeholder="Send To GL/Bank"
                        />
                        <FormikError
                          errors={errors}
                          name="sendToGLBank"
                          touched={touched}
                        />
                      </div>
                    )}
                    <div className="col-lg-6 pr pl-1 mb-2">
                      <label>Select Instrument Type</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("instrumentType", valueOption);
                            if (valueOption?.value === 2) {
                              if(values?.bankAcc){
                                getNextBankCheque(
                                  profileData?.accountId,
                                  selectedBusinessUnit.value,
                                  values?.bankAcc?.bankId,
                                  values?.bankAcc?.bankBranch_Id,
                                  values?.bankAcc?.value,
                                  setFieldValue,
                                  "instrumentNo"
                                );
                              }
                           
                            } else {
                              generateAdviceNo(
                                selectedBusinessUnit?.value,
                                setFieldValue
                              );
                            }
                        }}
                        value={values?.instrumentType}
                        isSearchable={true}
                        options={instrumentType || []}
                        styles={customStyles}
                        placeholder="Instrument Type"
                      />
                      <FormikError
                        errors={errors}
                        name="instrumentType"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-2 disable-border disabled-feedback border-gray">
                      <IInput
                        value={values.instrumentNo}
                        label="Instrument No"
                        name="instrumentNo"
                      />
                    </div>
                    <div className="col-lg-6 pl-date pr pl-1 mb-2 bank-journal-date border-gray">
                      <IInput
                        value={values.instrumentDate}
                        label="Instrument Date"
                        name="instrumentDate"
                        type="date"
                      />
                    </div>
                    {/* it will be changed if user select bank transfer from previous page */}
                    {jorunalType === 6 ? (
                      <>
                        <div className="col-lg-6 pl pr-1 mb-2 h-narration border-gray">
                          <Field
                            type="number"
                            component={Input}
                            value={values.transferAmount}
                            min="0"
                            placeholder="Amount"
                            label="Amount"
                            name="transferAmount"
                          />
                        </div>
                        <div className="col-lg-12 pl-1 pr mb-2 h-narration border-gray">
                          <IInput
                            value={values.headerNarration}
                            label="Narration"
                            name="headerNarration"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="col-lg-12 pl pr mb-2 h-narration border-gray">
                        <IInput
                          value={values.headerNarration}
                          label="Narration"
                          name="headerNarration"
                        />
                      </div>
                    )}
                    {/* it will be hidden if user select bank payment/bank transfer from previous page */}
                    <div
                      className={
                        jorunalType === 5 || jorunalType === 6
                          ? "d-none"
                          : "col-lg-6 pl pr-1 mb-2 align-items-center"
                      }
                      style={{ marginTop: "18px" }}
                    >
                      <div className="d-flex align-items-center">
                        <span className="mr-2">Placed in Bank</span>
                        <Field
                          type="checkbox"
                          name="placedInBank"
                          checked={values.placedInBank}
                          onChange={(e) => {
                            setFieldValue("placedInBank", e.target.checked);
                          }}
                        />
                      </div>
                    </div>
                    {/* it will be hidden if user select bank payment/bank transfer from previous page */}
                    <div
                      className={
                        jorunalType === 5 || jorunalType === 6
                          ? "d-none"
                          : "col-lg-6 pl-date pr pl-1 mb-2 bank-journal-date border-gray"
                      }
                    >
                      <IInput
                        value={values.placingDate}
                        disabled={!values?.placedInBank}
                        label="Placing Date"
                        name="placingDate"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  {/* It will be hidden when user select bank tranfer from previous page */}
                  {/* Table Header input */}
                  <div
                    className={
                      jorunalType === 6
                        ? "d-none"
                        : "row bank-journal-custom bj-right"
                    }
                  >
                    <div className="col-lg-3 pl pr-1">
                      <label>Select Transaction</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("transaction", valueOption);
                        }}
                        value={values?.transaction}
                        isSearchable={true}
                        options={transaction || []}
                        styles={customStyles}
                        placeholder="Transaction"
                      />
                    </div>
                    <div className="col-lg-2 pr-1 pl-1 disable-border disabled-feedback border-gray">
                      <Field
                        type="number"
                        component={Input}
                        value={values.amount}
                        min="0"
                        placeholder="Amount"
                        label="Amount"
                        name="amount"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-6 bj-add-btn pl-1 h-narration disable-border disabled-feedback border-gray">
                      <IInput
                        value={values.narration}
                        label="Narration"
                        name="narration"
                      />
                    </div>
                    <div className="col-lg-1 pl-0 bank-journal">
                      <button
                        style={{ marginTop: "10px" }}
                        type="button"
                        disabled={
                          !values?.transaction ||
                          !values?.amount ||
                          !values?.narration ||
                          rowDto.length
                        }
                        className="btn btn-primary"
                        onClick={() => {
                          setFieldValue("transaction", "");
                          setFieldValue("amount", "");
                          setFieldValue("headerNarration",values.narration);
                          setFieldValue("narration", "");
                          setter(values);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  {/* Table Header input end */}
                  {/* It will be hidden when user select bank tranfer from previous page */}
                  <div className="row">
                  <div className="offset-8 col-lg-4 mt-2">
                        <h6>Net Amount : {netAmount}</h6>
                      </div>
                    <div className="col-lg-12 pr-0">
                    <div className="table-responsive">
                    <table
                        className={
                          jorunalType === 6 ? "d-none" : "table mt-1 bj-table"
                        }
                      >
                        <thead className={rowDto?.length < 1 && "d-none"}>
                          <tr>
                            <th style={{ width: "20px" }}>SL</th>
                            <th style={{ width: "260px" }}>Transaction</th>
                            <th style={{ width: "100px" }}>Amount</th>
                            <th>Narration</th>
                            <th style={{ width: "50px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="text-left pl-2">
                                  {item?.transaction?.label}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {item?.amount}
                                </div>
                              </td>
                              <td>
                                <div className="text-left pl-2">
                                  {item?.narration}
                                </div>
                              </td>
                              <td className="text-center">
                                <IDelete remover={remover} id={index} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
      </div>
                    </div>
                  </div>
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
