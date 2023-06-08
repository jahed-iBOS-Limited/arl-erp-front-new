/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import ICalendar from "../../../../_helper/_inputCalender";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import NewSelect from "../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { _numberValidation } from "./../../../../_helper/_numberValidation";

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
  soldtoParty: Yup.object().shape({
    label: Yup.string().required("Sales office is required"),
    value: Yup.string().required("Sales office is required"),
  }),
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
  accountId,
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
  selectedBusinessUnit,
  objTerms,
  setObjTerms,
  currencyDDL,
  profileData
}) {
  let [datas, setData] = useState([]);

  useEffect(() => {
    setData([
      {
        label: "Dest. Channel",
        name: "channel",
        options: channel,
        value: initData.channel,
        isDisabled: true,
      },
      {
        label: "Sales Office",
        name: "salesOffice",
        options: salesOffice,
        value: initData.salesOffice,
        isDisabled: true,
      },
      {
        label: "Sold to Party",
        name: "soldtoParty",
        options: soldToParty,
        value: initData.soldtoParty,
        isDisabled: true,
      },
    ]);
  }, [salesOrg, soldToParty, salesOffice, channel]);

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
            <Form className='form form-label-right mt-2'>
              <div className='row mt-0'>
                <div className='col-lg-12 p-0 m-0'>
                  <div className='row global-form m-0'>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='salesOrg'
                        options={salesOrg}
                        value={values?.salesOrg}
                        label='Sales Organization'
                        onChange={(valueOption) => {
                          setFieldValue("salesOrg", valueOption);
                          setFieldValue("salesOffice", "");
                          salesOfficeDDLDispatcher(valueOption?.value);
                        }}
                        placeholder='Sales Organization'
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <>
                      {datas.map((data, index) => {
                        return (
                          <div key={index} className='col-lg-3'>
                            <ISelect
                              label={data.label}
                              placeholder={data.label}
                              options={data.options}
                              value={values[data.name]}
                              name={data.name}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              values={values}
                              touched={touched}
                              dependencyFunc={data.dependencyFunc}
                              isDisabled={isEdit}
                            />
                          </div>
                        );
                      })}
                      <div className='col-lg-3'>
                        <IInput
                          value={values.partnerReffNo}
                          label='Supplier Ref. No.'
                          name='partnerReffNo'
                          disabled={isEdit}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <ICalendar
                          value={_dateFormatter(values.pricingDate || "")}
                          label='Pricing Date'
                          name='pricingDate'
                          disabled={isEdit}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <ICalendar
                          value={_dateFormatter(values.quotationEndDate || "")}
                          label='Quotation End Date'
                          name='quotationEndDate'
                          disabled={isEdit}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <label>Remarks</label>
                        <InputField
                          value={values?.remark || ""}
                          name='remark'
                          placeholder='Remarks'
                          type='text'
                          disabled={isEdit}
                        />
                      </div>
                      {
                        (selectedBusinessUnit?.value === 144 && values?.salesOrg?.value === 7 && values?.channel?.value === 96) && (
                          <>
                            <div className='col-lg-3'>
                              <IInput
                                value={values?.salesContract || ""}
                                label='Sales Contract'
                                name='salesContract'
                                onChange={(e) => {
                                  setFieldValue("salesContract", e.target.value);
                                }}
                              />
                            </div>
                            <div className='col-lg-3'>
                              <IInput
                                value={values?.salesTerm || ""}
                                label='Sales Term'
                                name='salesTerm'
                                onChange={(e) => {
                                  setFieldValue("salesTerm", e.target.value);
                                }}
                              />
                            </div>
                            <div className='col-lg-3'>
                              <IInput
                                value={values?.modeOfShipment || ""}
                                label='Mode Of Shipment'
                                name='modeOfShipment'
                                onChange={(e) => {
                                  setFieldValue("modeOfShipment", e.target.value);
                                }}
                              />
                            </div>
                            <div className='col-lg-3'>
                              <IInput
                                value={values?.portOfShipment || ""}
                                label='Port Of Shipment'
                                name='portOfShipment'
                                onChange={(e) => {
                                  setFieldValue("portOfShipment", e.target.value);
                                }}
                              />
                            </div>
                            <div className='col-lg-3'>
                              <IInput
                                value={values?.portOfDischarge || ""}
                                label='Port Of Discharge'
                                name='portOfDischarge'
                                onChange={(e) => {
                                  setFieldValue("portOfDischarge", e.target.value);
                                }}
                              />
                            </div>
                            <div className='col-lg-3'>
                              <IInput
                                value={values?.finalDestination || ""}
                                label='Final Destination'
                                name='finalDestination'
                                onChange={(e) => {
                                  setFieldValue("finalDestination", e.target.value);
                                }}
                              />
                            </div>
                            <div className='col-lg-3'>
                              <IInput
                                value={values?.countryOfOrigin || ""}
                                label='Country Of Origin'
                                name='countryOfOrigin'
                                onChange={(e) => {
                                  setFieldValue("countryOfOrigin", e.target.value);
                                }}
                              />
                            </div>
                            <div className='col-lg-3'>
                              <IInput
                                value={values?.contractFor || ""}
                                label='Contract For'
                                name='contractFor'
                                onChange={(e) => {
                                  setFieldValue("contractFor", e.target.value);
                                }}
                              />
                            </div>
                            <div className='col-lg-3'>
                              <IInput
                                value={values?.freightCharge || ""}
                                label='Freight Charge'
                                name='freightCharge'
                                type='number'
                                onChange={(e) => {
                                  setFieldValue("freightCharge", _numberValidation(e));
                                }}
                              />
                            </div>
                          </>
                        )
                      }
                    </>
                  </div>
                </div>
              </div>
              <hr className='m-1'></hr>
              <div className='row'>
                <div className='col-lg-12 m-0 p-0'>
                  <div className='row global-form m-0'>
                    <div className='col-lg-3'>
                      <NewSelect
                        label='Item list'
                        placeholder='Item list'
                        options={itemSalesDDL || []}
                        name='itemList'
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
                      />
                    </div>
                    <div className='col-lg-3 disable-border disabled-feedback'>
                      <IInput
                        value={values?.quantity}
                        label='Quantity'
                        name='quantity'
                        type='tel'
                        min='1'
                        onChange={(e) => {
                          setFieldValue("quantity", _numberValidation(e));
                        }}
                      />
                    </div>
                    <div className='col-lg-3'>
                      <NewSelect
                        label='Currency'
                        placeholder='Currency'
                        options={currencyDDL || []}
                        name='currency'
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        value={values.currency}
                        onChange={(valueOption) => {
                          setFieldValue("currency", valueOption);
                        }}
                      />
                    </div>
                    <div className='col-lg-3'>
                      <IInput
                        type='number'
                        value={values.price}
                        label={
                          selectedBusinessUnit?.value === 144 && values?.salesOrg?.value === 7 && values?.channel?.value === 96
                            ? "Price (USD)"
                            : "Price"
                        }
                        name='price'
                        min='1'
                        disabled={!values.currency}
                        onChange={(e) => {
                          setFieldValue("price", e.target.value);
                        }}
                      />
                    </div>

                    <div className='col-lg-3'>
                      <NewSelect
                        label='Item UoM'
                        placeholder='Item UoM'
                        options={uomDDL}
                        name='uom'
                        onChange={(valueOption) => {
                          setFieldValue("uom", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        value={values.uom}
                      />
                    </div>
                    <div className='col-lg-6 d-flex align-items-center justify-content-between'>
                      <div className='d-flex justify-content-center align-items-center'>
                        <div className='w-10'>
                          <Field
                            name='isSpecification'
                            component={() => (
                              <input
                                id='isSpecification'
                                type='checkbox'
                                label='Want to specification?'
                                className='ml-2'
                                value={values?.isSpecification || false}
                                checked={values?.isSpecification}
                                name='isSpecification'
                                onChange={(e) => {
                                  setFieldValue(
                                    "isSpecification",
                                    e.target.checked
                                  );
                                }}
                              />
                            )}
                          />
                          <label htmlFor='isSpecification' className='ml-1 mt-2'>
                            Want to specification?
                          </label>
                        </div>
                        <button
                          type='button'
                          className='btn btn-primary ml-4'
                          disabled={
                            !values.itemList ||
                            !values.quantity ||
                            !values.price ||
                            !values.currency ||
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
                      <div className='d-flex justify-content-center flex-column-reverse align-content-end'>
                        <p className='mb-1'>
                          <b>Total Qty :</b> {total.totalQty}
                        </p>
                        <p className='mb-1'>
                          <b>Total Amount :</b> {total.totalAmount}
                        </p>
                      </div>
                    </div>
                    {isEdit && (
                      <div className='col-lg-2 mb-2'>
                        <IInput
                          type='text'
                          value={values?.quotationCode}
                          label='Quotation Code'
                          name='quotationCode'
                          disabled={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <hr className='m-1'></hr>
              {/* specication start*/}
              <>
                {values?.isSpecification === true && (
                  <div className='row'>
                    <div className='col-lg-12 p-0 m-0'>
                      <div className='row global-form m-0'>
                        <div className='col-lg-2'>
                          <ISelect
                            label='Specification'
                            placeholder='Specification'
                            options={spctionDDL}
                            name='specification'
                            setFieldValue={setFieldValue}
                            errors={errors}
                            touched={touched}
                            value={values.specification}
                            isDisabled={!values.itemList}
                          />
                        </div>
                        <div className='col-lg-2'>
                          <IInput
                            type='number'
                            value={values.value}
                            label='Value'
                            name='value'
                            min='0'
                            disabled={!values.itemList}
                            onChange={((e) => {
                              setFieldValue("value", e.target.value);
                            })}
                          />
                        </div>
                        <div className='col-lg-2'>
                          <button
                            type='button'
                            style={{ marginTop: "14px" }}
                            className='btn btn-primary ml-2'
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
                <div className='row cash_journal bank-journal bank-journal-custom'>
                  <div className='col-lg-6 pr-0 pl-0'>
                    {specTableData?.length >= 0 && (
                      <table className='table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table'>
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
                              <td className='text-center'>{index + 1}</td>
                              <td className='pl-2'>{itm.specification}</td>
                              <td className='text-right pr-2'>{itm.value}</td>
                              <td className='text-right pr-2'>{itm.itemId}</td>
                              {editItemOnChange && (
                                <td className='text-center'>
                                  <i
                                    className='fa fa-trash'
                                    onClick={() =>
                                      removerTwo(index, itm.itemId)
                                    }
                                  ></i>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  {!values?.isClosed && isEdit && (
                    <div className='col-lg-2 offset-4 d-flex justify-content-center align-items-center'>
                      <button
                        type='button'
                        style={{ marginTop: "14px", padding: "6px 16px" }}
                        className='btn btn-primary ml-2'
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
              <div className='row cash_journal bank-journal bank-journal-custom'>
                <div className='col-lg-12 pr-0 pl-0'>
                  {rowDto?.length >= 0 && (
                    <table className='table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table'>
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
                          <tr key={itm.itemId}>
                            <td className='text-center'>{++index}</td>
                            <td className='pl-2'>{itm.itemName}</td>
                            <td className='pl-2'>{itm.itemCode}</td>
                            <td className='text-right pr-2'>
                              {itm.quotationQuantity}
                            </td>
                            <td className='text-right pr-2'>{itm.itemPrice}</td>
                            <td className='text-right pr-2'>
                              {itm.quotationValue}
                            </td>
                            <td className='pl-2'>{itm.uomName}</td>
                            <td className='pl-2'>{itm.specification}</td>
                            <td className='text-center'>
                              <i
                                className='fa fa-trash'
                                onClick={() => remover(itm.itemId)}
                              ></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              <>
                <hr className='m-1'></hr>
                {/* terms and conditions start */}
                <div className='row'>
                  <div className='col-lg-12 p-0 m-0'>
                    <div className='row global-form m-0'>
                      <div className='col-lg-3'>
                        <IInput
                          type='text'
                          value={values.termsAndConditions}
                          label='Terms And Conditions'
                          name='termsAndConditions'
                          onChange={((e) => {
                            setFieldValue("termsAndConditions", e.target.value);
                          })}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <button
                          type='button'
                          style={{ marginTop: "17px" }}
                          className='btn btn-primary ml-2'
                          disabled={!values?.termsAndConditions}
                          onClick={() => {
                            setObjTerms([
                              ...objTerms,
                              {
                                quotationId: values?.quotationId,
                                sl: objTerms?.length + 1,
                                terms: values?.termsAndConditions,
                                actionBy: profileData?.userId,
                              }
                            ])
                            setFieldValue("termsAndConditions", "");
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row cash_journal bank-journal bank-journal-custom'>
                  <div className='col-lg-6 pr-0 pl-0'>
                    <table className='table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table'>
                      <thead>
                        <tr>
                          <th style={{ width: "35px" }}>SL</th>
                          <th>Terms and conditions</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {objTerms?.map((itm, index) => (
                          <tr key={itm.intSl}>
                            <td className='text-center'>{index + 1}</td>
                            <td className='pl-2'>{itm.terms}</td>
                            <td className='text-center'>
                              <i className='fa fa-trash'
                                onClick={() => {
                                  let filteredTermsAndConditions = objTerms.filter((item) => item.intSl !== itm.intSl);
                                  setObjTerms(filteredTermsAndConditions);
                                }}
                              ></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
