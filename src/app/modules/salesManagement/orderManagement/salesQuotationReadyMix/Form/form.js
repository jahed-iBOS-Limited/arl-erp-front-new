/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import ICalendar from "../../../../_helper/_inputCalender";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import NewSelect from "../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { _numberValidation } from "./../../../../_helper/_numberValidation";
import InvoiceRecept from "../invoice/invoiceRecept";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import TextArea from "../../../../_helper/TextArea";
import { shallowEqual, useSelector } from "react-redux";
// import CementInvoice from "../invoice/cementInvoice";
import SalesQuotationForCement from "../../salesQuotation/cementSalesQuotation/invoiceRecept";

// Validation schema
const validationSchema = Yup.object().shape({
  salesOrg: Yup.object().shape({
    label: Yup.string().required("Sales organization is required"),
    value: Yup.string().required("Sales organization is required"),
  }),
  channel: Yup.object().shape({
    label: Yup.string().required("Channel is required"),
    value: Yup.string().required("Channel is required"),
  }),
  salesOffice: Yup.object().shape({
    label: Yup.string().required("Sales office is required"),
    value: Yup.string().required("Sales office is required"),
  }),
  // soldToParty: Yup.object().shape({
  //   label: Yup.string().required("Sales office is required"),
  //   value: Yup.string().required("Sales office is required"),
  // }),
  itemList: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
  uom: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
  partnerReffNo: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Reference no is required"),
  quantity: Yup.number()
    .min(1, "Minimum 1 number")
    .max(10000000000000, "Maximum 10000000000000 number"),
  price: Yup.number()
    .min(1, "Minimum 1 number")
    .max(10000000000000, "Maximum 10000000000000 number"),
  pricingDate: Yup.date().required("Date is required"),
  quotationEndDate: Yup.date().required("Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  editItemOnChange,
  total,
  salesOrg,
  soldToParty,
  channel,
  salesOffice,
  rowDto,
  removerTwo,
  setter,
  setterTwo,
  remover,
  itemSalesDDL,
  salesOfficeDDLDispatcher,
  uomDDL,
  isEdit,
  specTableData,
  spctionDDL,
  itemListHandelar,
  setEditItemOnChange,
  quotationClosedFunc,
  printRef,
  handleInvoicePrint,
  shippingPointList,
  accId,
  buId,
}) {
  const [savedData, setSavedData] = useState(null);

  const loadEmployeeInfo = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${accId}&BusinessUnitId=${buId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };
  const {
    selectedBusinessUnit: { value: sbuId, label },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
              }
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, (_savedData) => {
            setSavedData(_savedData);
            handleInvoicePrint();
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
            <Form className="form form-label-right mt-2">
              <div className="row mt-0">
                <div className="col-lg-12 p-0 m-0">
                  <div className="row global-form m-0">
                    <div className="col-lg-2">
                      <NewSelect
                        name="salesOrg"
                        options={salesOrg || []}
                        value={values?.salesOrg}
                        label="Sales Organization"
                        onChange={(valueOption) => {
                          setFieldValue("salesOrg", valueOption);
                          setFieldValue("salesOffice", "");
                          salesOfficeDDLDispatcher(valueOption?.value);
                        }}
                        placeholder="Sales Organization"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="channel"
                        options={channel || []}
                        value={values?.channel}
                        label="Dest. Channel"
                        onChange={(valueOption) => {
                          setFieldValue("channel", valueOption);
                        }}
                        placeholder="Dest. Channel"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="salesOffice"
                        options={salesOffice || []}
                        value={values?.salesOffice}
                        label="Sales Office"
                        onChange={(valueOption) => {
                          setFieldValue("salesOffice", valueOption);
                        }}
                        placeholder="Sales Office"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="customerType"
                        options={[
                          { label: "Existing Customer", value: 1 },
                          { label: "New Customer", value: 2 },
                        ]}
                        value={values?.customerType}
                        label="Customer Type"
                        onChange={(valueOption) => {
                          setFieldValue("customerType", valueOption);
                        }}
                        placeholder="Customer Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    {values?.customerType?.value === 1 && (
                      <div className="col-lg-2">
                        <NewSelect
                          name="soldToParty"
                          options={soldToParty || []}
                          value={values?.soldToParty}
                          label="Sold to Party"
                          onChange={(valueOption) => {
                            setFieldValue("soldToParty", valueOption);
                          }}
                          placeholder="Sold to Party"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                    )}
                    {values?.customerType?.value === 2 && (
                      <>
                        <div className="col-lg-2">
                          <InputField
                            value={values?.customerName}
                            label="Customer Name"
                            name="customerName"
                            disabled={isEdit}
                            placeholder="Customer Name"
                          />
                        </div>
                        <div className="col-lg-2">
                          <InputField
                            label="Customer Address"
                            value={values?.customerAddress || ""}
                            name="customerAddress"
                            placeholder="Customer Address"
                            type="text"
                            disabled={isEdit}
                          />
                        </div>
                      </>
                    )}
                    <div className="col-lg-2">
                      <NewSelect
                        name="includeVat"
                        options={[
                          { label: "Yes", value: 1 },
                          { label: "No", value: 2 },
                        ]}
                        value={values?.includeVat}
                        label="Include VAT"
                        onChange={(valueOption) => {
                          setFieldValue("includeVat", valueOption);
                        }}
                        placeholder="Include VAT"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="includeAit"
                        options={[
                          { label: "Yes", value: 1 },
                          { label: "No", value: 2 },
                        ]}
                        value={values?.includeAit}
                        label="Include AIT"
                        onChange={(valueOption) => {
                          setFieldValue("includeAit", valueOption);
                        }}
                        placeholder="Include AIT"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="shippingPoint"
                        options={shippingPointList || []}
                        value={values?.shippingPoint}
                        label="Shipping Point"
                        onChange={(valueOption) => {
                          setFieldValue("shippingPoint", valueOption);
                        }}
                        placeholder="Shipping Point"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values.paymentMode}
                        label="Payment Mode"
                        name="paymentMode"
                        disabled={isEdit}
                        placeholder="Payment Mode"
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values.partnerReffNo}
                        label="Supplier Ref. No."
                        name="partnerReffNo"
                        disabled={isEdit}
                        placeholder="Supplier Ref. No."
                      />
                    </div>
                    <div className="col-lg-2">
                      <ICalendar
                        value={_dateFormatter(values.pricingDate || "")}
                        label="Submission Date"
                        name="pricingDate"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-2">
                      <ICalendar
                        value={_dateFormatter(values.quotationEndDate || "")}
                        label="Quotation End Date"
                        name="quotationEndDate"
                        disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-2">
                      <label>Officer Name</label>
                      <SearchAsyncSelect
                        selectedValue={values?.officerName}
                        handleChange={(valueOption) => {
                          setFieldValue("officerName", valueOption);
                        }}
                        loadOptions={loadEmployeeInfo}
                      />
                      <FormikError
                        errors={errors}
                        name="officerName"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-2">
                      <InputField
                        label="Delivery Address"
                        value={values?.address || ""}
                        name="address"
                        placeholder="Delivery Address"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        label="Distance"
                        value={values?.distance || ""}
                        name="distance"
                        placeholder="Distance"
                        type="text"
                      />
                    </div>

                    <div className="col-lg-4">
                      <label>Remarks</label>
                      <TextArea
                        value={values?.remark || ""}
                        name="remark"
                        placeholder="Remarks"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr className="m-1"></hr>
              <div className="row">
                <div className="col-lg-12 m-0 p-0">
                  <div className="row global-form m-0">
                    <div className="col-lg-2">
                      <NewSelect
                        label="Item list"
                        placeholder="Item list"
                        options={itemSalesDDL || []}
                        name="itemList"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        value={values.itemList}
                        onChange={(valueOption) => {
                          itemListHandelar(valueOption?.value, setFieldValue);
                          setFieldValue("itemList", valueOption);
                          setFieldValue("specification", "");
                          setFieldValue("value", "");
                          setEditItemOnChange(true);
                        }}

                        // dependencyFunc={(currentValue, values, setter) => {
                        //   itemListHandelar(currentValue, setFieldValue);
                        //   setter("specification", "");
                        //   setter("value", "");
                        //   setEditItemOnChange(true);
                        // }}
                      />
                    </div>

                    <div className="col-lg-2 disable-border disabled-feedback">
                      <IInput
                        value={values?.quantity}
                        label="Quantity"
                        name="quantity"
                        type="tel"
                        min="1"
                        onChange={(e) => {
                          setFieldValue("quantity", _numberValidation(e));
                        }}
                      />
                    </div>

                    <div className="col-lg-2">
                      <IInput
                        type="tel"
                        value={values.price}
                        label="Price"
                        name="price"
                        min="1"
                        onChange={(e) => {
                          setFieldValue("price", _numberValidation(e));
                        }}
                      />
                    </div>

                    <div className="col-lg-2">
                      <NewSelect
                        label="Item UoM"
                        placeholder="Item UoM"
                        options={uomDDL}
                        name="uom"
                        onChange={(valueOption) => {
                          setFieldValue("uom", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        value={values.uom}
                      />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-between">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="w-10" style={{ width: "75px" }}>
                          <Field
                            name="isSpecification"
                            component={() => (
                              <input
                                id="isSpecification"
                                type="checkbox"
                                label="Want to specification?"
                                className="ml-2"
                                value={values?.isSpecification || false}
                                checked={values?.isSpecification}
                                name="isSpecification"
                                onChange={(e) => {
                                  setFieldValue(
                                    "isSpecification",
                                    e.target.checked
                                  );
                                }}
                              />
                            )}
                          />
                          <label htmlFor="isSpecification" className="ml-1">
                            Want to specification?
                          </label>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary ml-2"
                          disabled={
                            !values.itemList ||
                            !values.quantity ||
                            !values.price ||
                            !values.uom
                          }
                          onClick={() => {
                            setter(values);
                            setFieldValue("itemList", "");
                            setFieldValue("quantity", "");
                            setFieldValue("price", "");
                            setFieldValue("uom", "");
                          }}
                        >
                          Add
                        </button>
                      </div>

                      <div className="d-flex justify-content-center flex-column-reverse align-content-end">
                        <p className="mb-1">
                          <b>Total Qty :</b> {total.totalQty}
                        </p>
                        <p className="mb-1">
                          <b>Total Amount :</b> {total.totalAmount}
                        </p>
                      </div>
                    </div>
                    {isEdit && (
                      <div className="col-lg-2 mb-2">
                        <IInput
                          type="text"
                          value={values?.quotationCode}
                          label="Quotation Code"
                          name="quotationCode"
                          disabled={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <hr className="m-1"></hr>
              {/* specication start*/}

              <>
                {values?.isSpecification === true && (
                  <div className="row">
                    <div className="col-lg-12 p-0 m-0">
                      <div className="row global-form m-0">
                        <div className="col-lg-2">
                          <ISelect
                            label="Specification"
                            placeholder="Specification"
                            options={spctionDDL}
                            name="specification"
                            setFieldValue={setFieldValue}
                            errors={errors}
                            touched={touched}
                            value={values.specification}
                            isDisabled={!values.itemList}
                          />
                        </div>
                        <div className="col-lg-2">
                          <IInput
                            type="tel"
                            value={values.value}
                            label="Value"
                            name="value"
                            min="0"
                            disabled={!values.itemList}
                            onChange={(e) => {
                              setFieldValue("value", _numberValidation(e));
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <button
                            type="button"
                            style={{ marginTop: "14px" }}
                            className="btn btn-primary ml-2"
                            disabled={
                              !values.itemList ||
                              !values.specification ||
                              !values.value
                            }
                            onClick={() => {
                              setterTwo(values);
                              setFieldValue("specification", "");
                              setFieldValue("value", "");
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row cash_journal bank-journal bank-journal-custom">
                  <div className="col-lg-6 pr-0 pl-0">
                    {specTableData?.length >= 0 && (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                          <thead>
                            <tr>
                              <th style={{ width: "35px" }}>SL</th>
                              <th>Specification</th>
                              <th>Value</th>
                              <th>Item Id</th>
                              {editItemOnChange && <th>Action</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {specTableData.map((itm, index) => (
                              <tr key={itm.specificationId}>
                                <td className="text-center">{index + 1}</td>
                                <td className="pl-2">{itm.specification}</td>
                                <td className="text-right pr-2">{itm.value}</td>
                                <td className="text-right pr-2">
                                  {itm.itemId}
                                </td>
                                {editItemOnChange && (
                                  <td className="text-center">
                                    <i
                                      className="fa fa-trash"
                                      onClick={() =>
                                        removerTwo(index, itm.itemId)
                                      }
                                    ></i>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>{" "}
                      </div>
                    )}
                  </div>
                  {!values?.isClosed && isEdit && (
                    <div className="col-lg-2 offset-4 d-flex justify-content-center align-items-center">
                      <button
                        type="button"
                        style={{ marginTop: "14px", padding: "6px 16px" }}
                        className="btn btn-primary ml-2"
                        onClick={() => {
                          quotationClosedFunc();
                        }}
                      >
                        Quotation Closed
                      </button>
                    </div>
                  )}
                </div>
              </>

              <div className="row cash_journal bank-journal bank-journal-custom">
                <div className="col-lg-12 pr-0 pl-0">
                  {rowDto?.length >= 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            <th style={{ width: "35px" }}>SL</th>
                            <th>Item Name</th>
                            <th>Item Code</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>UoM Name</th>
                            <th>Specification</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.map((itm, index) => (
                            <tr key={itm?.itemId}>
                              <td className="text-center">{++index}</td>
                              <td className="pl-2">{itm?.itemName}</td>
                              <td className="pl-2">{itm?.itemCode}</td>
                              <td className="text-right pr-2">
                                {itm?.quotationQuantity}
                              </td>
                              <td className="text-right pr-2">
                                {itm?.itemPrice}
                              </td>
                              <td className="text-right pr-2">
                                {itm?.quotationValue}
                              </td>
                              <td className="pl-2">{itm?.uomName}</td>
                              <td className="pl-2">{itm?.specification}</td>
                              <td className="text-center">
                                <i
                                  className="fa fa-trash"
                                  onClick={() => remover(itm?.itemId)}
                                ></i>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>{" "}
                    </div>
                  )}
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

              {savedData && sbuId === 175 ? (
                // || (sbuId === 4 && values?.customerType?.value === 1))
                <InvoiceRecept
                  printRef={printRef}
                  invoiceData={savedData?.customResponse}
                  businessPartnerInfo={savedData?.businessPartnerInfo}
                />
              ) : (
                <SalesQuotationForCement
                  printRef={printRef}
                  invoiceData={savedData?.customResponse}
                  businessPartnerInfo={savedData?.businessPartnerInfo}
                />
                // <CementInvoice
                //   printRef={printRef}
                //   invoiceData={savedData?.customResponse}
                //   businessPartnerInfo={savedData?.businessPartnerInfo}
                // />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
