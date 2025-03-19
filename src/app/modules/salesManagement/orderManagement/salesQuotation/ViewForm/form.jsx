/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import ICalendar from "../../../../_helper/_inputCalender";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import NewSelect from "../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { _numberValidation } from "../../../../_helper/_numberValidation";

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  total,
  salesOrg,
  soldToParty,
  channel,
  salesOffice,
  rowDto,
  salesOfficeDDLDispatcher,
  isEdit,
  specTableData,
  selectedBusinessUnit,
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
            <Form className="form form-label-right mt-2">
              <div className="row mt-0">
                <div className="col-lg-12 p-0 m-0">
                  <div className="row global-form m-0">
                    <div className="col-lg-3">
                      <NewSelect
                        name="salesOrg"
                        options={salesOrg}
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
                    <>
                      {datas.map((data, index) => {
                        return (
                          <div key={index} className="col-lg-3">
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
                      <div className="col-lg-3">
                        <IInput
                          value={values.partnerReffNo}
                          label="Supplier Ref. No."
                          name="partnerReffNo"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <ICalendar
                          value={_dateFormatter(values.pricingDate || "")}
                          label="Pricing Date"
                          name="pricingDate"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <ICalendar
                          value={_dateFormatter(values.quotationEndDate || "")}
                          label="Quotation End Date"
                          name="quotationEndDate"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Remarks</label>
                        <InputField
                          value={values?.remark || ""}
                          name="remark"
                          placeholder="Remarks"
                          type="text"
                          disabled={isEdit}
                        />
                      </div>
                      {selectedBusinessUnit?.value === 144 &&
                        values?.salesOrg?.value === 7 &&
                        values?.channel?.value === 96 && (
                          <>
                            <div className="col-lg-3">
                              <IInput
                                value={values?.salesContract || ""}
                                label="Sales Contract"
                                name="salesContract"
                                onChange={(e) => {
                                  setFieldValue(
                                    "salesContract",
                                    e.target.value
                                  );
                                }}
                                disabled={isEdit}
                              />
                            </div>
                            <div className="col-lg-3">
                              <IInput
                                value={values?.salesTerm || ""}
                                label="Sales Term"
                                name="salesTerm"
                                onChange={(e) => {
                                  setFieldValue("salesTerm", e.target.value);
                                }}
                                disabled={isEdit}
                              />
                            </div>
                            <div className="col-lg-3">
                              <IInput
                                value={values?.modeOfShipment || ""}
                                label="Mode Of Shipment"
                                name="modeOfShipment"
                                onChange={(e) => {
                                  setFieldValue(
                                    "modeOfShipment",
                                    e.target.value
                                  );
                                }}
                                disabled={isEdit}
                              />
                            </div>
                            <div className="col-lg-3">
                              <IInput
                                value={values?.portOfShipment || ""}
                                label="Port Of Shipment"
                                name="portOfShipment"
                                onChange={(e) => {
                                  setFieldValue(
                                    "portOfShipment",
                                    e.target.value
                                  );
                                }}
                                disabled={isEdit}
                              />
                            </div>
                            <div className="col-lg-3">
                              <IInput
                                value={values?.portOfDischarge || ""}
                                label="Port Of Discharge"
                                name="portOfDischarge"
                                onChange={(e) => {
                                  setFieldValue(
                                    "portOfDischarge",
                                    e.target.value
                                  );
                                }}
                                disabled={isEdit}
                              />
                            </div>
                            <div className="col-lg-3">
                              <IInput
                                value={values?.finalDestination || ""}
                                label="Final Destination"
                                name="finalDestination"
                                onChange={(e) => {
                                  setFieldValue(
                                    "finalDestination",
                                    e.target.value
                                  );
                                }}
                                disabled={isEdit}
                              />
                            </div>
                            <div className="col-lg-3">
                              <IInput
                                value={values?.countryOfOrigin || ""}
                                label="Country Of Origin"
                                name="countryOfOrigin"
                                onChange={(e) => {
                                  setFieldValue(
                                    "countryOfOrigin",
                                    e.target.value
                                  );
                                }}
                                disabled={isEdit}
                              />
                            </div>
                            <div className="col-lg-3">
                              <IInput
                                value={values?.contractFor || ""}
                                label="Contract For"
                                name="contractFor"
                                onChange={(e) => {
                                  setFieldValue("contractFor", e.target.value);
                                }}
                                disabled={isEdit}
                              />
                            </div>
                            <div className="col-lg-3">
                              <IInput
                                value={values?.freightCharge || ""}
                                label="Freight Charge"
                                name="freightCharge"
                                type="number"
                                onChange={(e) => {
                                  setFieldValue(
                                    "freightCharge",
                                    _numberValidation(e)
                                  );
                                }}
                                disabled={isEdit}
                              />
                            </div>
                          </>
                        )}
                    </>
                  </div>
                </div>
              </div>
              <hr className="m-1"></hr>
              <div className="row">
                <div className="col-lg-12 m-0 p-0">
                  <div className="row global-form m-0">
                    {isEdit && (
                      <div className="col-lg-3 mb-2">
                        <IInput
                          type="text"
                          value={values?.quotationCode}
                          label="Quotation Code"
                          name="quotationCode"
                          disabled={true}
                        />
                      </div>
                    )}
                    <div className="col-lg-3 offset-8 d-flex align-items-center justify-content-between">
                      <div className="d-flex justify-content-center flex-column-reverse align-content-end">
                        <p className="mb-1">
                          <b>Total Qty :</b> {total.totalQty}
                        </p>
                        <p className="mb-1">
                          <b>Total Amount :</b> {total.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="m-1"></hr>
              {/* specication start*/}
              <>
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
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
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.map((itm, index) => (
                            <tr key={itm.itemId}>
                              <td className="text-center">{++index}</td>
                              <td className="pl-2">{itm.itemName}</td>
                              <td className="pl-2">{itm.itemCode}</td>
                              <td className="text-right pr-2">
                                {itm.quotationQuantity}
                              </td>
                              <td className="text-right pr-2">
                                {itm.itemPrice}
                              </td>
                              <td className="text-right pr-2">
                                {itm.quotationValue}
                              </td>
                              <td className="pl-2">{itm.uomName}</td>
                              <td className="pl-2">{itm.specification}</td>
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
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
