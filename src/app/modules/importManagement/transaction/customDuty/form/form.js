/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React from "react";

import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { validationSchema } from "../helper";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  hsCode,
  customsNameDDL,
  paidByDDL,
  instrumentTypeDDL,
  viewType,
  resetBtnClick,
  currencyName,
  hsCodeInfo,
  // bankListDDL,
  // customsPayment,
  // remover,
  // getHsCode,
  // addCustomPayment,
  // cdId,
  // grandTotal,
  // subTotal,
  // resetHeaders,
  // rowDtoHandler,
  // getOtherCharges,
  cnfAgencyDDL,
  // resetData,
  // setLoading,
  bankDDL,
}) {
  const history = useHistory();
  const { state } = useLocation();

  const [headerDisable] = useState(false);

  const grandTotal = (values, setFieldValue, value, key) => {
    let add =
      (key === "fineBDT" ? +value : +values?.fineBDT) +
      (key === "AITExemptionBDT" ? +value : +values?.AITExemptionBDT) +
      (key === "docProcessFee" ? +value : +values?.docProcessFee) +
      (key === "CnFIncomeTax" ? +value : +values?.CnFIncomeTax) +
      (key === "cnfVat" ? +value : +values?.cnfVat) +
      (key === "scanning" ? +value : +values?.scanning) +
      // (key === "assessmentValue" ? +value : +values?.assessmentValue) +
      (key === "customDuty" ? +value : +values?.customDuty) +
      (key === "regulatoryDuty" ? +value : +values?.regulatoryDuty) +
      (key === "supplementaryDuty" ? +value : +values?.supplementaryDuty) +
      (key === "vat" ? +value : +values?.vat) +
      (key === "ait" ? +value : +values?.ait) +
      (key === "advanceTradeVat" ? +value : +values?.advanceTradeVat) +
      (key === "psi" ? +value : +values?.psi) +
      (key === "at" ? +value : +values?.at);
    return setFieldValue("grandTotal", add);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            // setRowDto([]);
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Customs Duty">
                <CardHeaderToolbar>
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        history.goBack();
                      }}
                      className="btn btn-light"
                    >
                      <i className="fa fa-arrow-left"></i>
                      Back
                    </button>
                    <button
                      type="reset"
                      onClick={() => {
                        resetBtnClick();
                        // resetHeaders();
                      }}
                      ref={resetBtnRef}
                      className="btn btn-light ml-2"
                      disabled={viewType === "view" ? true : false}
                    >
                      <i className="fa fa-redo"></i>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      onClick={handleSubmit}
                      // ref={saveBtnRef}
                      disabled={viewType === "view" ? true : false}
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              {/* {disableHandler(!isValid)} */}
              <div className="d-flex justify-content-center align-items-center">
                <div style={{ fontWeight: "900" }}>PO : {state?.PoNo}</div>
                <div style={{ fontWeight: "900", marginLeft: "30px" }}>
                  {" "}
                  LC : {state?.LcNo}
                </div>
                <div style={{ fontWeight: "900", marginLeft: "30px" }}>
                  {" "}
                  Shipment : {state?.shipment}
                </div>
              </div>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <label>BoE No</label>
                        <InputField
                          value={values?.boeNo}
                          placeholder="BoE No"
                          name="boeNo"
                          touched={touched}
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>BoE Date</label>
                        <InputField
                          value={values?.boeDate}
                          placeholder="BoE Date"
                          name="boeDate"
                          type="date"
                          errors={errors}
                          touched={touched}
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Payment Date</label>
                        <InputField
                          value={values?.paymentDate}
                          placeholder="Payment Date"
                          name="paymentDate"
                          type="date"
                          errors={errors}
                          touched={touched}
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>{`Invoice Amount (${currencyName[0]?.currencyName})`}</label>
                        <InputField
                          value={_formatMoney(values?.invoiceAmount)}
                          placeholder="Invoice Amount"
                          name="invoiceAmount"
                          type="text"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Exchange Rate</label>
                        <InputField
                          value={values?.exRate}
                          placeholder="Exchange Rate"
                          name="exRate"
                          type="number"
                          min={0}
                          onChange={(valueOption) => {
                            setFieldValue("exRate", valueOption?.target?.value);
                            setFieldValue(
                              "invoiceAmountBDT",
                              +values?.invoiceAmount *
                                valueOption?.target?.value
                            );
                          }}
                          disabled={
                            viewType === "view" ||
                            headerDisable ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Invoice Amount (BDT)</label>
                        <InputField
                          value={_formatMoney(values?.invoiceAmountBDT)}
                          placeholder="Invoice Amount (BDT)"
                          name="invoiceAmountBDT"
                          type="text"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Fine (BDT)</label>
                        <InputField
                          value={values?.fineBDT}
                          placeholder="Fine (BDT)"
                          name="fineBDT"
                          type="number"
                          min={0}
                          onChange={(valueOption) => {
                            setFieldValue(
                              "fineBDT",
                              valueOption?.target?.value
                            );
                            grandTotal(
                              values,
                              setFieldValue,
                              valueOption?.target?.value,
                              "fineBDT"
                            );
                          }}
                          disabled={
                            (viewType === "view" || headerDisable
                              ? true
                              : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>AIT Exemption(BDT)</label>
                        <InputField
                          value={values?.AITExemptionBDT}
                          placeholder="AIT Exemption(BDT)"
                          name="AITExemptionBDT"
                          type="number"
                          min={0}
                          onChange={(valueOption) => {
                            setFieldValue(
                              "AITExemptionBDT",
                              valueOption?.target?.value
                            );
                            grandTotal(
                              values,
                              setFieldValue,
                              valueOption?.target?.value,
                              "AITExemptionBDT"
                            );
                          }}
                          disabled={
                            (viewType === "view" || headerDisable
                              ? true
                              : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Doc Process Fee</label>
                        <InputField
                          value={values?.docProcessFee}
                          placeholder="Doc Process Fee"
                          name="docProcessFee"
                          type="number"
                          min={1}
                          onChange={(valueOption) => {
                            setFieldValue(
                              "docProcessFee",
                              valueOption?.target?.value
                            );
                            grandTotal(
                              values,
                              setFieldValue,
                              valueOption?.target?.value,
                              "docProcessFee"
                            );
                          }}
                          disabled={
                            (viewType === "view" || headerDisable
                              ? true
                              : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>CnF Income Tax</label>
                        <InputField
                          value={values?.CnFIncomeTax}
                          placeholder="CnF Income Tax"
                          name="CnFIncomeTax"
                          type="number"
                          min={1}
                          onChange={(valueOption) => {
                            setFieldValue(
                              "CnFIncomeTax",
                              valueOption?.target?.value
                            );
                            grandTotal(
                              values,
                              setFieldValue,
                              valueOption?.target?.value,
                              "CnFIncomeTax"
                            );
                          }}
                          disabled={
                            (viewType === "view" || headerDisable
                              ? true
                              : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>CnF VAT</label>
                        <InputField
                          value={values?.cnfVat}
                          placeholder="CnF VAT"
                          name="cnfVat"
                          type="number"
                          min={1}
                          onChange={(valueOption) => {
                            setFieldValue("cnfVat", valueOption?.target?.value);
                            grandTotal(
                              values,
                              setFieldValue,
                              valueOption.target.value,
                              "cnfVat"
                            );
                          }}
                          disabled={
                            (viewType === "view" || headerDisable
                              ? true
                              : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Scanning Fee</label>
                        <InputField
                          value={values?.scanning}
                          placeholder="Scanning Fee"
                          name="scanning"
                          type="number"
                          min={1}
                          onChange={(valueOption) => {
                            setFieldValue(
                              "scanning",
                              valueOption?.target?.value
                            );
                            grandTotal(
                              values,
                              setFieldValue,
                              valueOption.target.value,
                              "scanning"
                            );
                          }}
                          disabled={
                            (viewType === "view" || headerDisable
                              ? true
                              : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="cnfAgencyDDL"
                          label="CnF Agency"
                          options={cnfAgencyDDL || []}
                          value={values?.cnfAgencyDDL}
                          onChange={(valueOption) => {
                            setFieldValue("cnfAgencyDDL", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={
                            viewType === "view" ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>

                      <div className="col-lg-3 d-flex flex-row mt-5 align-items-center">
                        <input
                          style={{ width: "15px", height: "15px" }}
                          id="is78Guarantee"
                          name="is78Guarantee"
                          checked={values?.is78Guarantee}
                          className="form-control ml-2"
                          type="checkbox"
                          disabled={viewType}
                          onChange={(e) => {
                            setValues({
                              ...values,
                              boeNo: "",
                              invoiceAmountBDT: "",
                              exRate: "",
                              fineBDT: "",
                              AITExemptionBDT: "",
                              docProcessFee: "",
                              CnFIncomeTax: "",
                              cnfVat: "",
                              scanning: "",
                              custom: "",
                              paidBy: "",
                              assessmentValue: "",
                              at: "",
                              bank: "",
                              instrumentType: "",
                            });
                            setFieldValue("is78Guarantee", e.target.checked);
                          }}
                        />

                        {/* <InputField
                          value={values.is78Guarantee}
                          placeholder=""
                          name="is78Guarantee"
                          type="checkbox"
                          onChange={(valueOption) => {
                            console.log({v: valueOption.target.value})
                            setIs78Guarantee(valueOption?.target?.value)
                            setFieldValue(
                              'is78Guarantee',
                              valueOption?.target?.value,
                            );
                          }}
                        /> */}
                        <label htmlFor="is78Guarantee" className="px-2">
                          is78Guarantee
                        </label>
                      </div>

                      {values?.is78Guarantee && (
                        <div className="col-lg-3">
                          <label>Guarantee78 Amount</label>
                          <InputField
                            value={values?.guarantee78Amount}
                            placeholder="Amount"
                            name="guarantee78Amount"
                            type="text"
                            onChange={(valueOption) => {
                              setFieldValue(
                                "guarantee78Amount",
                                valueOption?.target?.value
                              );
                            }}
                            disabled={
                              viewType === "view" ||
                              (viewType === "edit" && values?.is78Guarantee)
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-12 mb-2">
                        <div style={{ fontWeight: "900", fontSize: "12px" }}>
                          HS Code :{" "}
                          {hsCode?.map((code) => (
                            <span className="mr-2">{`[${code.label}]`}</span>
                          ))}
                        </div>
                      </div>
                      {/* <div className='col-lg-3'>
                        <label>HS Code</label>
                        <NewSelect
                          name='HSCode'
                          options={hsCode || []}
                          value={values?.HSCode}
                          onChange={(valueOption) => {
                            if (!values?.exRate) {
                              toast.warning("Please Enter Exchange Rate");
                            } else if (!valueOption) {
                              resetData(setFieldValue);
                            } else {
                              setFieldValue("HSCode", valueOption);
                              setFieldValue(
                                "assessmentValue",
                                valueOption?.invoiceAmount
                              );
                              getOtherCharges(values);

                              setHeaderDisable(true);
                              GetHsCodeInfo(
                                valueOption?.label,
                                valueOption?.invoiceAmount * values?.exRate,
                                setFieldValue,
                                setLoading
                              );
                            }
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={viewType === "view"}
                        />
                      </div> */}
                      <div className="col-lg-3">
                        <label>Custom</label>
                        <NewSelect
                          value={values?.custom}
                          options={customsNameDDL || []}
                          name="custom"
                          onChange={(valueOption) => {
                            setFieldValue("custom", valueOption);
                          }}
                          isDisabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Paid By</label>
                        <NewSelect
                          value={values?.paidBy}
                          options={paidByDDL || []}
                          name="paidBy"
                          onChange={(valueOption) => {
                            setFieldValue("paidBy", valueOption);
                          }}
                          isDisabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      {values?.paidBy?.label === "Own Cheque" && (
                        <div className="col-lg-3">
                          <label>Bank</label>
                          <NewSelect
                            value={values?.bank}
                            options={bankDDL || []}
                            name="bank"
                            onChange={(valueOption) => {
                              setFieldValue("bank", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              viewType === "view" ||
                              (!viewType && values?.is78Guarantee)
                            }
                          />
                        </div>
                      )}
                      {values?.paidBy?.label === "Own Cheque" && (
                        <div className="col-lg-3">
                          <label>Instrument Type</label>

                          <NewSelect
                            options={instrumentTypeDDL || []}
                            value={values?.instrumentType}
                            name="instrumentType"
                            onChange={(valueOption) => {
                              setFieldValue("instrumentType", valueOption);
                            }}
                            isDisabled={
                              (viewType === "view" ? true : false) ||
                              (!viewType && values?.is78Guarantee)
                            }
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      <div className="col-lg-3">
                        <label>Assessment Value(BDT)</label>
                        <InputField
                          value={values?.assessmentValue}
                          placeholder="Assessment Value(BDT)"
                          name="assessmentValue"
                          onChange={(e) => {
                            if (!e?.target?.value.startsWith(0)) {
                              setFieldValue(
                                "assessmentValue",
                                e?.target?.value
                              );
                            } else {
                              toast.warning("Please enter a valid number");
                            }
                            grandTotal(
                              values,
                              setFieldValue,
                              e.target.value,
                              "assessmentValue"
                            );
                          }}
                          type="number"
                          min={0}
                          disabled={
                            viewType === "view" ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Custom Duty</label>
                        <InputField
                          value={values?.customDuty}
                          placeholder="Custom Duty"
                          name="customDuty"
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                          type="number"
                          onChange={(e) => {
                            setFieldValue("customDuty", e.target.value);
                            grandTotal(
                              values,
                              setFieldValue,
                              e.target.value,
                              "customDuty"
                            );
                          }}
                          min="0"
                          required
                          step="any"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Regulatory Duty</label>
                        <InputField
                          value={values?.regulatoryDuty}
                          placeholder="Regulatory Duty"
                          name="regulatoryDuty"
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                          type="number"
                          onChange={(e) => {
                            setFieldValue("regulatoryDuty", e.target.value);
                            grandTotal(
                              values,
                              setFieldValue,
                              e.target.value,
                              "regulatoryDuty"
                            );
                          }}
                          min="0"
                          required
                          step="any"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Supplementary Duty</label>
                        <InputField
                          value={values?.supplementaryDuty}
                          placeholder="Supplementary Duty"
                          name="supplementaryDuty"
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                          type="number"
                          onChange={(e) => {
                            setFieldValue("supplementaryDuty", e.target.value);
                            grandTotal(
                              values,
                              setFieldValue,
                              e.target.value,
                              "supplementaryDuty"
                            );
                          }}
                          min="0"
                          required
                          step="any"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>VAT</label>
                        <InputField
                          value={values?.vat}
                          placeholder="VAT"
                          name="vat"
                          onChange={(e) => {
                            setFieldValue("vat", e.target.value);
                            grandTotal(
                              values,
                              setFieldValue,
                              e.target.value,
                              "vat"
                            );
                          }}
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                          type="number"
                          min="0"
                          required
                          step="any"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>AIT</label>
                        <InputField
                          value={values?.ait}
                          placeholder="AIT"
                          onChange={(e) => {
                            setFieldValue("ait", e.target.value);
                            grandTotal(
                              values,
                              setFieldValue,
                              e.target.value,
                              "ait"
                            );
                          }}
                          name="ait"
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                          type="number"
                          min="0"
                          required
                          step="any"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Advance Trade VAT</label>
                        <InputField
                          value={values?.advanceTradeVat}
                          placeholder="Advance Trade VAT"
                          name="advanceTradeVat"
                          onChange={(e) => {
                            setFieldValue("advanceTradeVat", e.target.value);
                            grandTotal(
                              values,
                              setFieldValue,
                              e.target.value,
                              "advanceTradeVat"
                            );
                          }}
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                          type="number"
                          min="0"
                          required
                          step="any"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>PSI</label>
                        <InputField
                          value={values?.psi}
                          placeholder="PSI"
                          name="psi"
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                          type="number"
                          min="0"
                          required
                          step="any"
                          onChange={(e) => {
                            setFieldValue("psi", e.target.value);
                            grandTotal(
                              values,
                              setFieldValue,
                              e.target.value,
                              "psi"
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>AT</label>
                        <InputField
                          value={values?.at}
                          placeholder="AT"
                          name="at"
                          onChange={(e) => {
                            setFieldValue("at", e.target.value);
                            grandTotal(
                              values,
                              setFieldValue,
                              e.target.value,
                              "at"
                            );
                          }}
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                          type="number"
                          min="0"
                          required
                          step="any"
                        />
                      </div>
                      {/* <div className='col-lg-3'>
                        <button
                          className='btn btn-primary btn-sm'
                          type='button'
                          onClick={() => {
                            addCustomPayment(
                              values?.HSCode?.label,
                              values,
                              setFieldValue
                            );
                          }}
                          disabled={values?.assessmentValue ? false : true}
                        >
                          Add HS Code Wise Duty
                        </button>
                      </div> */}

                      {/* <div className='col-lg-3'>
                        <label>Duty VAT</label>
                        <InputField
                          // value={item?.dutyVat}
                          placeholder='Duty VAT'
                          name='dutyVat'
                          // onChange={(e) => {
                          //   rowDtoHandler(
                          //     "dutyVat",
                          //     e.target.value,
                          //     index
                          //   );
                          // }}
                          disabled={viewType === "view" ? true : false}
                        />
                      </div> */}
                      {/* <div className='col-lg-3'>
                        <label>Other VAT</label>
                        <InputField
                          // value={item?.otherVat}
                          placeholder='Other VAT'
                          name='otherVat'
                          // onChange={(e) => {
                          //   rowDtoHandler(
                          //     "otherVat",
                          //     e.target.value,
                          //     index
                          //   );
                          // }}
                          disabled={viewType === "view" ? true : false}
                        />
                      </div> */}
                      <div className="col-lg-3">
                        <label>Grand Total (Including VAT)</label>
                        <InputField
                          value={values?.grandTotal}
                          placeholder="Grand Total"
                          name="grandTotal"
                          // onChange={(e) => {
                          //   rowDtoHandler(
                          //     "otherVat",
                          //     e.target.value,
                          //     index
                          //   );
                          // }}
                          disabled={
                            (viewType === "view" ? true : false) ||
                            (!viewType && values?.is78Guarantee)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row ml-1 ">
                    {/* <div className='col-lg-4'>
                      <div className='row payment'>
                        <div className='global-form text-center col-lg-12'>
                          <h5 className='text-center'>Customs Duty And Tax</h5>
                        </div>
                        <table className='table table-striped table-bordered bj-table bj-table-landing global-form'>
                          <tbody>
                            <tr>
                              <td>HS Code</td>
                              <td>
                                <NewSelect
                                  name='HSCode'
                                  options={hsCode || []}
                                  value={values?.HSCode}
                                  onChange={(valueOption) => {
                                    if (!values?.exRate) {
                                      toast.warning(
                                        "Please Enter Exchange Rate"
                                      );
                                    } else if (!valueOption) {
                                      resetData(setFieldValue);
                                    } else {
                                      setFieldValue("HSCode", valueOption);
                                      setFieldValue(
                                        "assessmentValue",
                                        valueOption?.invoiceAmount
                                      );
                                      getOtherCharges(values);

                                      setHeaderDisable(true);
                                      GetHsCodeInfo(
                                        valueOption?.label,
                                        valueOption?.invoiceAmount *
                                          values?.exRate,
                                        setFieldValue,
                                        setLoading
                                      );
                                    }
                                  }}
                                  errors={errors}
                                  touched={touched}
                                  isDisabled={viewType === "view"}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Assessment Value(BDT)</td>
                              <td>
                                <InputField
                                  value={values?.assessmentValue}
                                  placeholder='Assessment Value(BDT)'
                                  name='assessmentValue'
                                  onChange={(e) => {
                                    if (!e?.target?.value.startsWith(0)) {
                                      setFieldValue(
                                        "assessmentValue",
                                        e?.target?.value
                                      );
                                    } else {
                                      toast.warning(
                                        "Please enter a valid number"
                                      );
                                    }
                                  }}
                                  type='number'
                                  min={0}
                                  disabled={true}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Custom Duty</td>
                              <td className='text-right'>
                                <InputField
                                  value={values?.customDuty}
                                  placeholder='Custom Duty'
                                  name='customDuty'
                                  disabled={viewType === "view" ? true : false}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Regulatory Duty</td>
                              <td className='text-right'>
                                <InputField
                                  value={values?.regulatoryDuty}
                                  placeholder='Regulatory Duty'
                                  name='regulatoryDuty'
                                  disabled={viewType === "view" ? true : false}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Supplementary Duty</td>
                              <td className='text-right'>
                                <InputField
                                  value={values?.supplementaryDuty}
                                  placeholder='Supplementary Duty'
                                  name='supplementaryDuty'
                                  disabled={viewType === "view" ? true : false}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>VAT</td>
                              <td className='text-right'>
                                <InputField
                                  value={values?.vat}
                                  placeholder='VAT'
                                  name='vat'
                                  disabled={viewType === "view" ? true : false}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>AIT</td>
                              <td className='text-right'>
                                <InputField
                                  value={values?.ait}
                                  placeholder='AIT'
                                  name='ait'
                                  disabled={viewType === "view" ? true : false}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Advance Trade Vat</td>
                              <td className='text-right'>
                                <InputField
                                  value={values?.advanceTradeVat}
                                  placeholder='Advance Trade VAT'
                                  name='advanceTradeVat'
                                  disabled={viewType === "view" ? true : false}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>PSI</td>
                              <td className='text-right'>
                                <InputField
                                  value={values?.psi}
                                  placeholder='PSI'
                                  name='psi'
                                  disabled={viewType === "view" ? true : false}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>AT</td>
                              <td className='text-right'>
                                <InputField
                                  value={values?.at}
                                  placeholder='AT'
                                  name='at'
                                  disabled={viewType === "view" ? true : false}
                                />
                              </td>
                            </tr>
                            <tr className='text-right'>
                              <td></td>
                              <div className='p-1'>
                                <button
                                  className='btn btn-primary btn-sm'
                                  type='button'
                                  onClick={() => {
                                    addCustomPayment(
                                      values?.HSCode?.label,
                                      values,
                                      setFieldValue
                                    );
                                  }}
                                  disabled={
                                    values?.assessmentValue ? false : true
                                  }
                                >
                                  Add HS Code Wise Duty
                                </button>
                              </div>
                            </tr>
                            <tr>
                              <td>Custom</td>
                              <td>
                                <NewSelect
                                  value={values?.custom}
                                  options={customsNameDDL || []}
                                  name='custom'
                                  onChange={(valueOption) => {
                                    setFieldValue("custom", valueOption);
                                  }}
                                  isDisabled={
                                    viewType === "view" ? true : false
                                  }
                                  errors={errors}
                                  touched={touched}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Paid By</td>
                              <td>
                                <NewSelect
                                  value={values?.paidBy}
                                  options={paidByDDL || []}
                                  name='paidBy'
                                  onChange={(valueOption) => {
                                    setFieldValue("paidBy", valueOption);
                                  }}
                                  isDisabled={
                                    viewType === "view" ? true : false
                                  }
                                  errors={errors}
                                  touched={touched}
                                />
                              </td>
                            </tr>
                            {values?.paidBy?.label === "Own Cheque" && (
                              <tr>
                                <td>Bank</td>
                                <td>
                                  <NewSelect
                                    value={values?.bank}
                                    options={[]}
                                    name='bank'
                                    isDisabled
                                    errors={errors}
                                    touched={touched}
                                  />
                                </td>
                              </tr>
                            )}
                            {values?.paidBy?.label === "Own Cheque" && (
                              <tr>
                                <td>Instrument Type</td>
                                <td>
                                  <NewSelect
                                    options={instrumentTypeDDL || []}
                                    value={values?.instrumentType}
                                    name='instrumentType'
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        "instrumentType",
                                        valueOption
                                      );
                                    }}
                                    isDisabled={
                                      viewType === "view" ? true : false
                                    }
                                    errors={errors}
                                    touched={touched}
                                  />
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div> */}
                    {/* <div className='col-lg-8'>
                      <div className='global-form text-center col-lg-12'>
                        <h5 className='text-center'>Total Customs Duty</h5>
                      </div>

                      <table className='table table-striped table-bordered mt-3 bj-table bj-table-landing global-form'>
                        <thead>
                          <tr>
                            <th>HS Code</th>
                            <th>Assessment TK</th>
                            <th>Duty</th>
                            <th>Duty VAT</th>
                            <th>Other Charge</th>
                            <th>Other VAT</th>
                            {viewType !== "view" && <th>Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {customsPayment?.length > 0 &&
                            customsPayment?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td className='text-right'>{item?.hscode}</td>
                                  <td className='text-right'>
                                    {item?.assesmentTk}
                                  </td>
                                  <td className='text-right'>
                                    {_formatMoney(item?.totalDuty)}
                                  </td>
                                  <td className='text-right'>
                                    {" "}
                                    <InputField
                                      value={item?.dutyVat}
                                      placeholder='Duty VAT'
                                      name='dutyVat'
                                      onChange={(e) => {
                                        rowDtoHandler(
                                          "dutyVat",
                                          e.target.value,
                                          index
                                        );
                                      }}
                                      disabled={
                                        viewType === "view" ? true : false
                                      }
                                    />{" "}
                                  </td>
                                  <td className='text-right'>
                                    {_formatMoney(item?.otherCharges)}
                                  </td>
                                  <td className='text-right pl-5 pr-5'>
                                    <InputField
                                      value={item?.otherVat}
                                      placeholder='Other VAT'
                                      name='otherVat'
                                      onChange={(e) => {
                                        rowDtoHandler(
                                          "otherVat",
                                          e.target.value,
                                          index
                                        );
                                      }}
                                      disabled={
                                        viewType === "view" ? true : false
                                      }
                                    />
                                  </td>
                                  {viewType !== "view" && (
                                    <td className='text-center'>
                                      <IDelete remover={remover} id={index} />
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          <tr>
                            <td></td>
                            <td className='text-right font-weight-bold'>
                              SubTotal
                            </td>
                            <td className='text-right'>
                              {_formatMoney(subTotal)}
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {viewType !== "view" && <td></td>}
                          </tr>
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {viewType !== "view" && <td></td>}
                            <td className='text-right font-weight-bold'>
                              Grand Total
                            </td>
                            <td className='text-right'>
                              {_formatMoney(grandTotal)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div> */}
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
                    // onSubmit={() => resetForm(initData)}
                  ></button>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
