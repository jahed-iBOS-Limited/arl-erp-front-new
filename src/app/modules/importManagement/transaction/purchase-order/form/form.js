/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getPaymentTermDDL, getItemListDDL } from "../helper";
import ICustomTable from "../../../../_helper/_customTable";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import {
  // checkPurchaseRequestNo,
  loadPartsList,
  validationSchema,
} from "../utils";
import { _formatMoney } from "../../../../_helper/_formatMoney";

const header = [
  "SL",
  "Item",
  "UOM",
  "Order Quantity",
  "Rate",
  "Amount",
  // "Currency",
  "Action",
];
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  viewType,
  setRowDto,
  rowDto,
  remover,
  setter,
  proformaInvoiceValue,
  setRowAmount,
  viewStateOfModal,
  accountId,
  businessUnitId,
  purchaseRequestValidity,
  setPurchaseRequestValidity,
}) {
  // all ddl
  const [currencyDDL] = useState([]);
  const [paymentTermsDDL, setPaymentTermsDDL] = useState([]);
  const [incoTermsDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);

  useEffect(() => {
    getPaymentTermDDL(setPaymentTermsDDL);
    getItemListDDL(proformaInvoiceValue?.proformaInvoiceId, setItemDDL);
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ ...values }, () => {
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
          setValues,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="d-flex justify-content-center align-items-center">
                <div style={{ fontWeight: "900", marginRight: "30px" }}>
                  SBU Name : {proformaInvoiceValue?.sbuName}
                </div>
                <div style={{ fontWeight: "900", marginRight: "30px" }}>
                  Plant Name : {proformaInvoiceValue?.plantName}
                </div>
                <div style={{ fontWeight: "900", marginRight: "30px" }}>
                  PI Number : {proformaInvoiceValue?.pinumber}
                </div>
              </div>
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Purchase Request No </label>
                    <InputField
                      value={values?.purchaseRequestNo}
                      name="purchaseRequestNo"
                      placeholder="Purchase Request No"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3 col-md-3">
                    <label>Supplier Name</label>
                    <SearchAsyncSelect
                      selectedValue={values?.supplierName}
                      handleChange={(valueOption) => {
                        setFieldValue("supplierName", valueOption);
                      }}
                      loadOptions={loadPartsList}
                      isDisabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Delivery Address</label>
                    <InputField
                      value={values?.deliveryAddress}
                      name="deliveryAddress"
                      placeholder="Delivery Address"
                      type="text"
                      disabled={viewStateOfModal?.view === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Order Date</label>
                    <InputField
                      value={values?.orderDate}
                      name="orderDate"
                      placeholder="Order Date"
                      type="date"
                      disabled={viewStateOfModal?.view === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Last Shipment Date</label>
                    <InputField
                      value={values?.lastShipmentDate}
                      name="lastShipmentDate"
                      placeholder="Last shipment Date"
                      type="date"
                      disabled={viewStateOfModal?.view === "view"}
                    />
                  </div>

                  <div className="col-md-3 col-lg-3">
                    <NewSelect
                      value={values?.currency}
                      options={currencyDDL || []}
                      label="Currency"
                      placeholder="currency"
                      name="currency"
                      type="text"
                      onChange={(valueOption) => {
                        setFieldValue("currency", valueOption);
                      }}
                      isDisabled
                    />
                  </div>
                  <div className="col-md-3 col-lg-3">
                    <NewSelect
                      value={values?.paymentTerms}
                      options={paymentTermsDDL || []}
                      label="Payment Terms"
                      placeholder="Payment Terms"
                      name="paymentTerms"
                      onChange={(valueOption) => {
                        setFieldValue("paymentTerms", valueOption);
                      }}
                      isDisabled={viewStateOfModal?.view === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3 col-lg-3">
                    <NewSelect
                      value={values?.incoTerm}
                      options={incoTermsDDL || []}
                      label="Inco Terms"
                      placeholder="Inco Terms"
                      name="incoTerm"
                      isDisabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Supplier Reference</label>
                    <InputField
                      value={values?.supplierReference}
                      name="supplierReference"
                      placeholder="Supplier Reference"
                      type="text"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>PI Date</label>
                    <InputField
                      value={values?.PIDate}
                      name="PIDate"
                      placeholder="PI Date"
                      type="date"
                      disabled={viewStateOfModal?.view === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Freight/Packing</label>
                    <InputField
                      value={values?.freight}
                      name="freight"
                      placeholder="Freight/Packing"
                      type="number"
                      disabled={viewStateOfModal?.view === "view"}
                    />
                  </div>
                </div>
              </div>
              {viewStateOfModal?.view !== "view" && (
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="item"
                        options={itemDDL}
                        value={values?.item}
                        label="Item"
                        onChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        placeholder="Select Item"
                        errors={errors}
                        touched={touched}
                        isDisabled={values?.isAllItem === true}
                      />
                    </div>
                    <div
                      className="col-lg-1 d-flex align-items-center"
                      style={{ marginTop: "22px", marginLeft: "17px" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="isAllItem"
                        disabled={values?.item}
                        onChange={(e) => {
                          setFieldValue("isAllItem", e?.target?.checked);
                        }}
                      />
                      <label className="">All Item</label>
                    </div>
                    <div
                      className="col-lg-3"
                      style={{ marginTop: "22px", marginLeft: "17px" }}
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={rowDto.length > 0}
                        onClick={() => {
                          if (values?.isAllItem) {
                            return getItemListDDL(
                              proformaInvoiceValue?.proformaInvoiceId,
                              setRowDto
                            );
                          } else {
                            return setter(values, rowDto, setRowDto);
                          }
                        }}
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <ICustomTable
                      ths={
                        viewStateOfModal?.view === "view"
                          ? [
                              "SL",
                              "Item",
                              "UOM",
                              "Order Quantity",
                              "Rate",
                              "Amount",
                              // "Currency"
                            ]
                          : header
                      }
                    >
                      {rowDto?.length > 0 &&
                        rowDto?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td style={{ width: "250px" }}>{item?.label}</td>
                              <td style={{ width: "150px" }}>
                                <NewSelect
                                  name="uom"
                                  value={item?.uom}
                                  onChange={(valueOption) => {
                                    setFieldValue("uom", valueOption);
                                  }}
                                  errors={errors}
                                  touched={touched}
                                  isDisabled
                                />
                              </td>
                              <td
                                style={{ width: "100px" }}
                                className="text-center"
                              >
                                <InputField
                                  value={item?.quantity}
                                  name="quantity"
                                  placeholder="Order Quantity"
                                  type="number"
                                  min="0"
                                  step="any"
                                  onChange={(e) => {
                                    setRowAmount(
                                      "quantity",
                                      index,
                                      +e?.target?.value,
                                      rowDto,
                                      setRowDto
                                    );
                                  }}
                                  disabled={viewStateOfModal?.view === "view"}
                                />
                              </td>
                              <td
                                style={{ width: "100px" }}
                                className="text-center"
                              >
                                <InputField
                                  value={item?.rate}
                                  name="rate"
                                  placeholder="Rate"
                                  type="number"
                                  min="0"
                                  step="any"
                                  onChange={(e) => {
                                    setRowAmount(
                                      "rate",
                                      index,
                                      e?.target?.value,
                                      rowDto,
                                      setRowDto
                                    );
                                  }}
                                  disabled={viewStateOfModal?.view === "view"}
                                />
                              </td>

                              <td
                                style={{ width: "100px" }}
                                className="text-center"
                              >
                                <InputField
                                  value={item?.totalAmount}
                                  name="totalAmount"
                                  placeholder="Amount"
                                  type="number"
                                  min="0"
                                  disabled
                                />
                              </td>
                              {/* <td className="text-center" style={{width: '100px'}}>{item?.currency}</td> */}
                              {viewStateOfModal?.view !== "view" && (
                                <td
                                  className="text-center"
                                  style={{ width: "100px" }}
                                >
                                  <IDelete remover={remover} id={index} />
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      <tr>
                        <td colspan="4"></td>
                        <td style={{ fontWeight: "700" }}>
                          {`Total (${values?.currency?.label})`}
                        </td>
                        <td
                          className="text-right"
                          style={{ fontWeight: "700" }}
                        >
                          {_formatMoney(
                            rowDto?.reduce(
                              (acc, item) => acc + +item?.totalAmount,
                              0
                            ) + +values?.freight
                          )}
                        </td>
                        {/* <td></td> */}
                        {viewStateOfModal?.view !== "view" && <td></td>}
                      </tr>
                    </ICustomTable>
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
