/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  supplierValidationSchema,
  insuranceValidationSchema,
  validationSchema,
  validationSchemaForTypeBank,
  validationSchemaForCRF,
  GetSupplierListDDL,
  // GetBusinessPartnerDetails
} from "../helper";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { useHistory } from "react-router";
import FormikError from "../../../../_helper/_formikError";
import { toast } from "react-toastify";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setterForCnfAgency,
  setRowDto,
  rowDto,
  supplierListDDL,
  businessPartnerTypeDDL,
  type,
  bankListDDL,
  profileData,
  selectedBusinessUnit,
  setSupplierListDDL,
}) {
  // const saveBtnRef = useRef();
  // const resetBtnRef = useRef();

  const history = useHistory();

  const backHandler = () => {
    history.goBack();
  };
  const hide = {
    display: "none",
  };
  const show = {
    display: "block",
  };
  const [validation, setValidationSchema] = useState(validationSchema);

  const rightBorder = {
    borderRight: "1px solid rgba(0, 0, 0, 0.2)",
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validation}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (values["type"]["label"] === "Shipping Forwarding Agent") {
            values["supplier"] = {
              label: values?.shippingAgent,
              value: 0,
            };
          }
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
          setValues,
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader
                title={`${type === "view" ? "" : "Create "}Business Partner`}
              >
                <CardHeaderToolbar>
                  <>
                    <button
                      type='reset'
                      onClick={backHandler}
                      ref={resetBtnRef}
                      className='btn btn-light ml-2'
                    >
                      <i className='fa fa-arrow-left'></i>
                      Back
                    </button>
                    <button
                      type='reset'
                      onClick={resetForm}
                      ref={resetBtnRef}
                      style={type === "view" ? hide : show}
                      className='btn btn-light ml-2'
                    >
                      <i className='fa fa-redo'></i>
                      Reset
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary ml-2'
                      onClick={handleSubmit}
                      style={type === "view" ? hide : show}
                      // ref={saveBtnRef}
                      // disabled={!isAvailable}
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className='form form-label-right'>
                  <div className='row'>
                    <div className='col-lg-6 d-flex align-items-center'>
                      <span className='d-flex align-items-center mr-2'>
                        {/* <span className="ml-2">Enlisted Supplier</span> */}
                      </span>
                    </div>
                    <div className='col-lg-12'>
                      <div className='row global-form'>
                        <>
                          <div className='col-lg-3 pt-2'>
                            <NewSelect
                              options={businessPartnerTypeDDL || []}
                              value={values?.type}
                              label='Partner Type'
                              placeholder='Partner type'
                              name='type'
                              onChange={(valueOption) => {
                                setFieldValue("type", valueOption);
                                setFieldValue("supplier", "");
                                setValues({
                                  ...initData,
                                  type: valueOption,
                                });
                                if (
                                  valueOption?.label === "Insurance Company"
                                ) {
                                  setValidationSchema(
                                    insuranceValidationSchema
                                  );
                                } else if (valueOption?.label === "Bank") {
                                  setValidationSchema(
                                    validationSchemaForTypeBank
                                  );
                                } else if (
                                  valueOption?.label === "CnF Agency"
                                ) {
                                  setValidationSchema(validationSchemaForCRF);
                                } else if (
                                  valueOption?.label !==
                                  "Shipping Forwarding Agent"
                                ) {
                                  setValidationSchema(validationSchema);
                                } else {
                                  setValidationSchema(supplierValidationSchema);
                                }
                                if (valueOption) {
                                  GetSupplierListDDL(
                                    profileData?.accountId,
                                    selectedBusinessUnit?.value,
                                    valueOption?.value,
                                    setSupplierListDDL
                                  );
                                }
                              }}
                              errors={errors}
                              touched={touched}
                              isDisabled={type === "view" ? true : false}
                            />
                          </div>
                          {values?.type?.label !==
                            "Shipping Forwarding Agent" && (
                            <div className='col-lg-3 pt-2'>
                              <NewSelect
                                options={supplierListDDL || []}
                                value={values?.supplier}
                                label={`Supplier ${
                                  values?.type?.label === "Bank"
                                    ? "(As a Bank)"
                                    : ""
                                } `}
                                placeholder='Supplier'
                                name='supplier'
                                onChange={(valueOption) => {
                                  setFieldValue("supplier", valueOption);
                                }}
                                errors={errors}
                                touched={touched}
                                isDisabled={type === "view" ? true : false}
                              />
                            </div>
                          )}
                          {/* for tyep == bank */}
                          {values?.type?.label === "Bank" && (
                            <div className='col-lg-3 pt-2'>
                              <NewSelect
                                options={bankListDDL || []}
                                value={values?.bank}
                                label='Bank Name'
                                placeholder='Bank name'
                                name='bank'
                                onChange={(valueOption) => {
                                  setFieldValue("bank", valueOption);
                                }}
                                errors={errors}
                                touched={touched}
                                isDisabled={type === "view" ? true : false}
                              />
                            </div>
                          )}
                          {values?.type?.label ===
                            "Shipping Forwarding Agent" && (
                            <div className='col-lg-3 pt-2'>
                              <InputField
                                value={values?.shippingAgent}
                                label='Supplier'
                                placeholder='Supplier'
                                name='shippingAgent'
                                // errors={errors}
                                touched={touched}
                                disabled={type === "view" ? true : false}
                              />
                            </div>
                          )}
                          {values?.type?.label === "Insurance Company" && (
                            <>
                              <div className='col-lg-3 pt-2'>
                                <label htmlFor='coverNotePrefix'>
                                  Cover Note Prefix
                                </label>
                                <InputField
                                  value={values?.coverNotePrefix}
                                  placeholder='Cover Note Prefix'
                                  name='coverNotePrefix'
                                  // errors={errors}
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label htmlFor='policyPrefix'>
                                  Policy Prefix
                                </label>
                                <InputField
                                  value={values?.policyPrefix}
                                  placeholder='Policy Prefix'
                                  name='policyPrefix'
                                  // errors={errors}
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label htmlFor='commissionPercentage'>
                                  Commission Percentage
                                </label>
                                <InputField
                                  value={values?.commissionPercentage}
                                  placeholder='Commission (%)'
                                  name='commissionPercentage'
                                  type='number'
                                  min={0}
                                  step='any'
                                  // errors={errors}
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div
                                style={{ marginTop: "15px" }}
                                className='col-lg-3 pt-2 d-flex justify-content-start align-items-center'
                              >
                                <label className='d-flex justify-content-start align-items-center'>
                                  <Field
                                    onClick={() => {
                                      setFieldValue(
                                        "commissionAdjustWithBill",
                                        ""
                                      );
                                    }}
                                    style={{ marginRight: "5px" }}
                                    type='checkbox'
                                    name='commissionAdjustWithBill'
                                    // value={}
                                    checked={values?.commissionAdjustWithBill}
                                    disabled={type === "view" ? true : false}
                                  />
                                  Commission Adjust With Bill
                                </label>
                                <FormikError
                                  errors={errors && errors}
                                  name='commissionAdjustWithBill'
                                  touched={touched}
                                />
                              </div>
                              <div className='col-lg-6'></div>
                              <div className='col-lg-3 pt-2'>
                                <label htmlFor='insuredAmount'>
                                  Insured Amount Add Percent
                                </label>
                                <InputField
                                  value={values?.insuredAmount}
                                  placeholder='Insured Amount (%)'
                                  name='insuredAmount'
                                  type='number'
                                  min={1}
                                  step='any'
                                  // errors={errors}
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label htmlFor='premiumRate'>
                                  Premium Rate
                                </label>
                                <InputField
                                  value={values?.premiumRate}
                                  placeholder='Premium Rate (%)'
                                  name='premiumRate'
                                  type='number'
                                  min={1}
                                  step='any'
                                  // errors={errors}
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label htmlFor='vatRate'>VAT Rate</label>
                                <InputField
                                  value={values?.vatRate}
                                  placeholder='VAT Rate (%)'
                                  name='vatRate'
                                  type='number'
                                  min={1}
                                  step='any'
                                  // errors={errors}
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label htmlFor='discountRate'>
                                  Discount Rate
                                </label>
                                <InputField
                                  value={values?.discountRate}
                                  placeholder='Discount Rate (%)'
                                  name='discountRate'
                                  type='number'
                                  min={1}
                                  step='any'
                                  // errors={errors}
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-12'>
                                <hr />
                              </div>
                              <div className='col-lg-12'>
                                <h6>Stamp Charge (On Insured Amount)</h6>
                                <div className='row'>
                                  <div className='col-lg-4' style={rightBorder}>
                                    <b className='pt-1 pb-1'>Air Charge</b>
                                    <div className='row'>
                                      <div className='col-lg-6'>
                                        <label htmlFor='airStampFixed'>
                                          Fixed
                                        </label>
                                        <InputField
                                          name='airStampFixed'
                                          value={values?.airStampFixed}
                                          type='number'
                                          step='any'
                                          placeholder='Air Charge'
                                          min={0}
                                          disabled={
                                            type === "view" ||
                                            values?.airStampCharges
                                              ? true
                                              : false
                                          }
                                        />
                                      </div>
                                      <div className='col-lg-6'>
                                        <label htmlFor='airStampCharges'>
                                          Rate
                                        </label>
                                        <InputField
                                          type='number'
                                          step='any'
                                          name='airStampCharges'
                                          min={1}
                                          value={values?.airStampCharges}
                                          placeholder='Rate'
                                          disabled={
                                            type === "view" ||
                                            values?.airStampFixed
                                              ? true
                                              : false
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-lg-4' style={rightBorder}>
                                    <b className='pt-1 pb-1'>Land Charge</b>
                                    <div className='row'>
                                      <div className='col-lg-6'>
                                        <label htmlFor='landStampFixed'>
                                          Fixed
                                        </label>
                                        <InputField
                                          name='landStampFixed'
                                          value={values?.landStampFixed}
                                          type='number'
                                          min={0}
                                          step='any'
                                          placeholder='Land Charge'
                                          disabled={
                                            type === "view" ||
                                            values?.landStampCharges
                                              ? true
                                              : false
                                          }
                                        />
                                      </div>
                                      <div className='col-lg-6'>
                                        <label htmlFor='landStampCharges'>
                                          Rate
                                        </label>
                                        <InputField
                                          type='number'
                                          name='landStampCharges'
                                          step='any'
                                          value={values?.landStampCharges}
                                          placeholder='Rate'
                                          disabled={
                                            type === "view" ||
                                            values?.landStampFixed
                                              ? true
                                              : false
                                          }
                                          min={1}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-lg-4'>
                                    <b className='pt-1 pb-1'>Sea Charge</b>
                                    <div className='row'>
                                      <div className='col-lg-6'>
                                        <label htmlFor='seaStampFixed'>
                                          Fixed
                                        </label>
                                        <InputField
                                          name='seaStampFixed'
                                          value={values?.seaStampFixed}
                                          placeholder='Sea Charge'
                                          type='number'
                                          step='any'
                                          min={0}
                                          disabled={
                                            type === "view" ||
                                            values?.seaStampCharges
                                              ? true
                                              : false
                                          }
                                        />
                                      </div>
                                      <div className='col-lg-6'>
                                        <label htmlFor='seaStampCharges'>
                                          Rate
                                        </label>
                                        <InputField
                                          type='number'
                                          name='seaStampCharges'
                                          value={values?.seaStampCharges}
                                          placeholder='Rate'
                                          disabled={
                                            type === "view" ||
                                            values?.seaStampFixed
                                              ? true
                                              : false
                                          }
                                          min={1}
                                          step='any'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          {values?.type?.label === "Bank" && (
                            <>
                              <div className='col-lg-3'></div>
                              <div className='col-lg-3 pt-2'>
                                <label>Atsight Commission Q1</label>
                                <InputField
                                  value={values?.atsightCommissionQ1}
                                  placeholder='Atsight Commission Q1 (%)'
                                  name='atsightCommissionQ1'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label>Atsight Commission Q2</label>
                                <InputField
                                  value={values?.atsightCommissionQ2}
                                  placeholder='Atsignt Commission Q2 (%)'
                                  name='atsightCommissionQ2'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label>UPAS Commission Q1</label>
                                <InputField
                                  value={values?.upasCommissionQ1}
                                  placeholder='UPAS Commission Q1 (%)'
                                  name='upasCommissionQ1'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label>UPAS Commission Q2</label>
                                <InputField
                                  value={values?.upasCommissionQ2}
                                  placeholder='UPAS Commission Q2 (%)'
                                  name='upasCommissionQ2'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label>Swift Charge</label>
                                <InputField
                                  value={values?.swiftCharge}
                                  placeholder='Swift Charge'
                                  name='swiftCharge'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label>Stamp Charge</label>
                                <InputField
                                  value={values?.stampCharge}
                                  placeholder='Stamp Charge'
                                  name='stampCharge'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label>Stationary Charge</label>
                                <InputField
                                  value={values?.stationaryCharge}
                                  placeholder='Stationary Charge'
                                  name='stationaryCharge'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label>Other Charge</label>
                                <InputField
                                  value={values?.otherCharge}
                                  placeholder='Other Charge'
                                  name='otherCharge'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 mt-5 d-flex align-items-center'>
                                <input
                                  type='checkbox'
                                  name='isToleranceIncluded'
                                  id='isToleranceIncluded'
                                  checked={values?.isToleranceIncluded}
                                  onChange={(e) =>
                                    setFieldValue(
                                      "isToleranceIncluded",
                                      e.target.checked
                                    )
                                  }
                                  disabled={type === "view" ? true : false}
                                />
                                <label
                                  className='ml-2'
                                  htmlFor='isToleranceIncluded'
                                >
                                  Is Tolerance Included
                                </label>
                              </div>
                              <div className='col-lg-3 mt-5 d-flex align-items-center'>
                                <input
                                  type='checkbox'
                                  name='isMinChargeIncluded'
                                  id='isMinChargeIncluded'
                                  checked={values?.isMinChargeIncluded}
                                  onChange={(e) =>
                                    setFieldValue(
                                      "isMinChargeIncluded",
                                      e.target.checked
                                    )
                                  }
                                  disabled={type === "view" ? true : false}
                                />
                                <label
                                  className='ml-2'
                                  htmlFor='isMinChargeIncluded'
                                >
                                  Is Min Charge Applicable
                                </label>
                              </div>
                              {values?.isMinChargeIncluded && (
                                <div className='col-lg-3 pt-2'>
                                  <label>Minimum Charge</label>
                                  <InputField
                                    value={values?.minCharge}
                                    placeholder='Min Charge'
                                    name='minCharge'
                                    type='number'
                                    min={0}
                                    step='any'
                                    touched={touched}
                                    disabled={type === "view" ? true : false}
                                  />
                                </div>
                              )}
                              <div
                                className={`${
                                  values?.isMinChargeIncluded
                                    ? "col-lg-3"
                                    : "col-lg-6"
                                } pt-2`}
                              ></div>
                              <div className='col-lg-12'>
                                <hr />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label>DD Commission Rate</label>
                                <InputField
                                  value={values?.ddCommissionRate}
                                  placeholder='DD Commission (%)'
                                  name='ddCommissionRate'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label>DD Commission Minimum</label>
                                <InputField
                                  value={values?.ddCommissionMinimum}
                                  placeholder='DD Commission (%)'
                                  name='ddCommissionMinimum'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label>TT Commission Rate</label>
                                <InputField
                                  value={values?.ttCommissionRate}
                                  placeholder='TT Commission (%)'
                                  name='ttCommissionRate'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                              <div className='col-lg-3 pt-2'>
                                <label>TT Commission Minimum</label>
                                <InputField
                                  value={values?.ttCommisionMinimum}
                                  placeholder='TT Commission (%)'
                                  name='ttCommisionMinimum'
                                  type='number'
                                  min={0}
                                  step='any'
                                  touched={touched}
                                  disabled={type === "view" ? true : false}
                                />
                              </div>
                            </>
                          )}
                          {values?.type?.label === "CnF Agency" &&
                            type !== "view" && (
                              <>
                                <div className='col-lg-6'></div>
                                <div className='col-lg-3 pt-2'>
                                  <label>From Amount</label>
                                  <InputField
                                    value={values?.from}
                                    placeholder='From amount'
                                    name='from'
                                    type='number'
                                    min={0}
                                    step='any'
                                    touched={touched}
                                    disabled='true'
                                  />
                                </div>
                                <div className='col-lg-3 pt-2'>
                                  <label>To Amount</label>
                                  <InputField
                                    value={values?.to}
                                    placeholder='To amount'
                                    name='to'
                                    type='number'
                                    min={0}
                                    step='any'
                                    touched={touched}
                                    disabled={type === "view" ? true : false}
                                  />
                                </div>
                                <div className='col-lg-3 pt-2'>
                                  <label>Rate (%)</label>
                                  <InputField
                                    value={values?.rate}
                                    placeholder='Rate'
                                    name='rate'
                                    type='number'
                                    min={0}
                                    step='any'
                                    touched={touched}
                                    disabled={type === "view" ? true : false}
                                  />
                                </div>
                                <div className='col-lg-3 pt-2 mt-4'>
                                  <button
                                    type='button'
                                    disabled={
                                      !values?.type ||
                                      !values?.supplier ||
                                      !values?.rate ||
                                      (rowDto.length > 0 &&
                                        rowDto[rowDto?.length - 1]
                                          .numToAmount === "")
                                    }
                                    onClick={() => {
                                      console.log(values?.to);
                                      if (values?.to <= values?.from) {
                                        if (!values?.to) {
                                          setFieldValue("to", "");
                                          setFieldValue("rate", "");
                                          setFieldValue("from", values?.from);
                                          setterForCnfAgency(values);
                                        } else {
                                          return toast?.warn(
                                            "To amount should be greater than From amount"
                                          );
                                        }
                                      } else {
                                        setFieldValue("to", "");
                                        setFieldValue("rate", "");
                                        setFieldValue("from", values?.to + 1);
                                        setterForCnfAgency(values);
                                      }
                                      console.log(rowDto, "rowDto");
                                    }}
                                    className='btn btn-primary mr-2'
                                  >
                                    Add
                                  </button>
                                </div>
                              </>
                            )}
                        </>
                      </div>
                    </div>
                  </div>
                  {values?.type?.label === "CnF Agency" && (
                    <div className='form-group row'>
                      <div className='col-lg-12'>
                        <div className='table-responsive'>
                          <table className='table table-striped table-bordered global-table'>
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>From Amount</th>
                                <th>To Amount</th>
                                <th>Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {console.log(rowDto)}
                              {rowDto?.length > 0 &&
                                rowDto?.map((item, i) => (
                                  <tr key={i + 1}>
                                    <td className='text-center'>{i + 1}</td>
                                    <td className='text-center'>
                                      {item?.numFromAmount}
                                    </td>
                                    <td className='text-center'>
                                      {item?.numToAmount || "infinity"}
                                    </td>
                                    <td className='text-center'>
                                      {item?.numRate}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type='submit'
                    style={{ display: "none" }}
                    ref={btnRef}
                    onSubmit={() => handleSubmit()}
                  ></button>
                  <button
                    type='reset'
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
