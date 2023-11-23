/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { getSingleData, createPurchaseOrder, getItemListDDL } from "../helper";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import {
  initData,
  loadPartsList,
  setRowAmount,
  setter,
  Warning,
} from "../utils";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { Formik } from "formik";
import InputField from "./../../../../../_helper/_inputField";
import SearchAsyncSelect from "../../../../../_helper/SearchAsyncSelect";
import NewSelect from "../../../../../_helper/_select";
import ICustomTable from "../../../../../_helper/_customTable";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { _formatMoney } from "./../../../../../_helper/_formatMoney";
import { getPaymentTermDDL } from "./../helper";
import { getPoInfoByPoId } from "./../helper";
import { Form } from "react-bootstrap";
import { Card } from "@material-ui/core";
import { shadows } from "@material-ui/system";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

export default function PoAddEditForm({ poId, view }) {
  const [objProps, setObjprops] = useState({});

  const [currencyDDL, setCurrencyDDL] = useState([]);
  const [paymentTermsDDL, setPaymentTermsDDL] = useState([]);
  const [incoTermsDDL, setIncoTermsDDL] = useState([]);
  const [supplierDDL, setSupplierDDL] = useState([]);

  const header = ["SL", "Item", "HS Code", "UoM", "Quantity", "Rate", "Amount"];

  // useEffect(() => {
  //   if (poId) {
  //     getPaymentTermDDL(setPaymentTermsDDL);
  //     // getItemListDDL(proformaInvoiceValue?.proformaInvoiceId, setItemDDL);
  //   }
  // }, [poId]);

  // get data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // get singleData
  const [singleData, setSingleData] = useState("");
  const [rowDto, setRowDto] = useState([]);

  const data = singleData?.objRow?.map((item) => ({
    label: item?.itemName,
    uom: { value: item?.uoMid, label: item?.uoMname },
    orderQty: item?.orderQty,
    rate: item?.basePrice,
    totalAmount: item?.finalPrice,
  }));

  useEffect(() => {
    if (poId) {
      getPoInfoByPoId(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        poId,
        setSingleData
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (singleData) {
      setSupplierDDL(singleData?.objHeader?.objSupplier);
      setCurrencyDDL(singleData?.objHeader?.objCurrency);
      setPaymentTermsDDL(singleData?.objHeader?.objPaymentTerms);
      setIncoTermsDDL(singleData?.objHeader?.objIncoTerms);
    }
  }, [singleData]);

  return (
    <Formik
      {...objProps}
      enableReinitialize={true}
      initialValues={{
        ...initData,
      }}
      // validationSchema={validationSchema}
      // onSubmit={(values, { setSubmitting, resetForm }) => {
      //   saveHandler({ ...values }, () => {
      //     resetForm(initData);
      //   });
      // }}
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
            <div className="d-flex justify-content-center align-items-center my-3">
              <div style={{ fontWeight: "900", marginRight: "30px" }}>
                SBU Name : {singleData?.objHeader?.sbuName}
              </div>
              <div style={{ fontWeight: "900", marginRight: "30px" }}>
                Plant Name : {singleData?.objHeader?.plantName}
              </div>
            </div>

            <div className="global-form">
              <div className="row">
                <div className="col-lg-3">
                  <label>Purchase Request No</label>
                  <InputField
                    value={singleData?.objHeader?.purchaseRequestNo}
                    name="purchaseRequestNo"
                    placeholder="Purchase Request No"
                    type="text"
                    disabled
                  />
                </div>
                <div className="col-lg-3 col-md-3">
                  <label>Supplier Name</label>
                  <SearchAsyncSelect
                    selectedValue={supplierDDL}
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
                    value={singleData?.objHeader?.deliveryAddress}
                    name="deliveryAddress"
                    placeholder="Delivery Address"
                    type="text"
                    disabled={poId}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Order Date</label>
                  <InputField
                    value={_dateFormatter(
                      singleData?.objHeader?.purchaseOrderDate
                    )}
                    name="orderDate"
                    placeholder="Order Date"
                    type="date"
                    disabled={poId}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Last Shipment Date</label>
                  <InputField
                    value={_dateFormatter(
                      singleData?.objHeader?.lastShipmentDate
                    )}
                    name="lastShipmentDate"
                    placeholder="Last shipment Date"
                    type="date"
                    disabled={poId}
                  />
                </div>

                <div className="col-md-3 col-lg-3">
                  <NewSelect
                    value={currencyDDL}
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
                    value={paymentTermsDDL}
                    options={paymentTermsDDL || []}
                    label="Payment Terms"
                    placeholder="Payment Terms"
                    name="paymentTerms"
                    onChange={(valueOption) => {
                      setFieldValue("paymentTerms", valueOption);
                    }}
                    isDisabled={poId}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-md-3 col-lg-3">
                  <NewSelect
                    value={incoTermsDDL}
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
                    value={singleData?.objHeader?.supplierReference}
                    name="supplierReference"
                    placeholder="Supplier Reference"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>PI Date</label>
                  <InputField
                    value={_dateFormatter(singleData?.objHeader?.piDate)}
                    name="PIDate"
                    placeholder="PI Date"
                    type="date"
                    disabled={poId}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Freight/Packing</label>
                  <InputField
                    value={singleData?.objHeader?.freight}
                    name="freight"
                    placeholder="Freight/Packing"
                    type="number"
                    disabled={poId}
                  />
                </div>
              </div>
              <div>
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <ICustomTable
                      ths={
                        view === "view"
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
                      {data?.length > 0 &&
                        data?.map((item, index) => {
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
                                  value={item?.orderQty}
                                  name="quantity"
                                  placeholder="Order Quantity"
                                  type="number"
                                  min="0"
                                  className="text-center"
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
                                  disabled={view === "view"}
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
                                  className="text-center"
                                  step="any"
                                  onChange={(e) => {
                                    setRowAmount(
                                      "rate",
                                      index,
                                      +e?.target?.value,
                                      rowDto,
                                      setRowDto
                                    );
                                  }}
                                  disabled={view === "view"}
                                />
                              </td>

                              <td
                                style={{ width: "100px" }}
                              >
                                <InputField
                                  value={item?.totalAmount}
                                  name="totalAmount"
                                  placeholder="Amount"
                                  type="number"
                                  min="0"
                                  className="text-right"
                                  disabled
                                />
                              </td>
                              {/* <td className="text-center" style={{width: '100px'}}>{item?.currency}</td> */}
                              {view !== "view" && (
                                <td
                                  className="text-center"
                                  style={{ width: "100px" }}
                                >
                                  <IDelete id={index} />
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      <tr>
                        <td colspan="4"></td>
                        <td style={{ fontWeight: "700" }}>
                          {`Total (${singleData?.objHeader?.objCurrency?.label})`}
                        </td>
                        <td
                          className="text-right"
                          style={{ fontWeight: "700" }}
                        >
                          {_formatMoney(
                            data?.reduce(
                              (acc, item) => acc + +item?.totalAmount,
                              0
                            )
                          )}
                        </td>
                        {/* <td></td> */}
                        {view !== "view" && <td></td>}
                      </tr>
                    </ICustomTable>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}
