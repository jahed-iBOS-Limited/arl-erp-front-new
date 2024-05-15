import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import ICalendar from "../../../../_helper/_inputCalender";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "./../../../../_helper/_inputField";

// createSchema
const createSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  rowDto,
  plantDDL,
  salesOrgDDL,
  distributionChannelDDL,
  salesOfficeDDL,
  soldToPartyDDL,
  itemSaleDDL,
  BUsalesOrgIncotermDDL,
  paymentTermsDDL,
  salesOfficeDDLDispatcher,
  addBtnHandler,
  total,
  remover,
}) {
  const [controls, setControls] = useState([]);
  useEffect(() => {
    setControls([
      {
        label: "Select Plant",
        placeholder: "Plant",
        name: "plant",
        options: plantDDL,
        value: initData.plant,
      },
      {
        label: "Select Sales Organization",
        placeholder: "Sales Organization",
        name: "salesOrg",
        options: salesOrgDDL || [],
        value: initData.salesOrg,
        isDisabled: true,
        dependencyFunc: (currentValue, values, setter) => {
          salesOfficeDDLDispatcher(currentValue);
          setter("salesOffice", "");
          setter("BUsalesOrgIncoterm", "");
        },
      },
      {
        label: "Select Distribution Channel",
        placeholder: "Distribution Channel",
        name: "distributionChannel",
        options: distributionChannelDDL,
        value: initData.distributionChannel,
        isDisabled: true,
      },
      {
        label: "Select Sales Office",
        placeholder: "Sales Office",
        name: "salesOffice",
        options: salesOfficeDDL,
        value: initData.salesOffice,
        isDisabled: true,
      },
      {
        label: "Select Sold to Party",
        placeholder: "Sold to Party",
        name: "soldToParty",
        options: soldToPartyDDL,
        value: initData.soldToParty,
        isDisabled: true,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    plantDDL,
    salesOrgDDL,
    distributionChannelDDL,
    salesOfficeDDL,
    soldToPartyDDL,
  ]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={createSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ values, errors, touched, setFieldValue, isValid }) => (
          <>
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="row mt-2">
                <div className="col-lg-12">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <>
                      {controls.map((itm, idx) => {
                        return (
                          <div className="col-xl-2 col-lg-3" key={idx}>
                            <ISelect
                              label={itm.label}
                              placeholder={itm.placeholder}
                              options={itm.options}
                              value={values[itm.name]}
                              name={itm.name}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              values={values}
                              touched={touched}
                              dependencyFunc={itm.dependencyFunc}
                              isDisabled={true}
                            />
                          </div>
                        );
                      })}
                      <div className="col-lg-2">
                        <IInput
                          value={values.partnerReffNo || ""}
                          label="Reference No"
                          name="partnerReffNo"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <ICalendar
                          value={_dateFormatter(values.pricingDate || "")}
                          label="Pricing Date"
                          name="pricingDate"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <ISelect
                          label="Select Payment Term"
                          options={paymentTermsDDL}
                          value={values.paymentTerms}
                          name="paymentTerms"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          placeholder="Payment Term"
                          isDisabled={true}
                        />
                      </div>
                      <div className="col-lg-2 d-flex justify-content-around text-center">
                        <div>
                          <label className="d-block" htmlFor="partialShipment">
                            Is Partial Shipment
                          </label>
                          <Field
                            name={values.partialShipment}
                            component={() => (
                              <input
                                id="partialShipment"
                                type="checkbox"
                                className="ml-2"
                                disabled={true}
                                value={values.partialShipment || ""}
                                checked={values.partialShipment}
                                name={values.partialShipment}
                                onChange={(e) => {
                                  setFieldValue(
                                    "partialShipment",
                                    e.target.checked
                                  );
                                }}
                              />
                            )}
                            label="Is Partial Shipment"
                          />
                        </div>
                        <div>
                          <label className="d-block" htmlFor="unlimited">
                            Is Unlimited
                          </label>
                          <Field
                            name={values.unlimited}
                            component={() => (
                              <input
                                id="unlimited"
                                type="checkbox"
                                className="ml-2"
                                disabled={true}
                                value={values.unlimited || ""}
                                checked={values.unlimited}
                                name={values.unlimited}
                                onChange={(e) => {
                                  setFieldValue("unlimited", e.target.checked);
                                }}
                              />
                            )}
                            label="IS Unlimited"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <ICalendar
                          value={_dateFormatter(values.startDate || "")}
                          label="Start Date"
                          name="startDate"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <ICalendar
                          value={_dateFormatter(values.endDate || "")}
                          label="End Date"
                          name="endDate"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <ISelect
                          label="Select Vehicle By"
                          options={[
                            { value: 1, label: "Company" },
                            { value: 2, label: "Customer" },
                          ]}
                          value={values.vehicleBy}
                          name="vehicleBy"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          placeholder="Vehicle By"
                          isDisabled={true}
                        />
                      </div>
                      <div className="col-lg-2 pb-2">
                        <IInput
                          value={values.deliveryAddress}
                          label="Delivery Address"
                          name="deliveryAddress"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>Remarks</label>
                        <InputField
                          value={values?.remark || ""}
                          name="remark"
                          placeholder="Remarks"
                          type="text"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2 d-flex align-items-center flex-column">
                        <label htmlFor="offerInclude">Offer Include</label>
                        <Field
                          name={values.offerInclude}
                          component={() => (
                            <input
                              id="offerInclude"
                              type="checkbox"
                              className="ml-2"
                              disabled={true}
                              value={values.offerInclude || ""}
                              checked={values.offerInclude}
                              name={values.offerInclude}
                              onChange={(e) => {
                                setFieldValue("offerInclude", e.target.checked);
                              }}
                            />
                          )}
                          label="Offer Include"
                        />
                      </div>
                      {true && (
                        <div className="col-lg-2 pb-2 text-warning">
                          <IInput
                            value={values.salesContactCode}
                            label="Contact Code"
                            name="salesContactCode"
                            disabled={true}
                          />
                        </div>
                      )}
                      <div className="col-lg-4 mt-2 col-lg-6 mt-2 d-flex justify-content-end align-items-center">
                        <div className="">
                          <div className="left">
                            <div className="d-flex justify-content-start">
                              <b className="mx-2">
                                Total Qty : {total.totalQty}{" "}
                              </b>{" "}
                              <b>Total Amount : {total.totalAmount}</b>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  </div>
                </div>
              </div>

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
                            <th>UoM Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.map((itm, index) => (
                            <tr key={itm?.itemId}>
                              <td className="text-center">{++index}</td>
                              <td className="pl-2">{itm?.itemName}</td>
                              <td className="pl-2">{itm?.itemCode}</td>
                              <td className="pl-2">{itm.uomName}</td>
                              <td className="text-right pr-2">
                                {itm?.contactQuantity}
                              </td>
                              <td className="text-right pr-2">
                                {_formatMoney(itm?.itemPrice)}
                              </td>
                              <td className="text-right pr-2">
                                {_formatMoney(
                                  Math.abs(
                                    +itm?.itemPrice * +itm?.contactQuantity
                                  )
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>{" "}
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
