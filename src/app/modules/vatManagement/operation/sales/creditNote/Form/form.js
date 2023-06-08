import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import {
  getViewData_api,
  getAmountSdVat,
  getAllItemDetails,
  getPurchaseInvoiceDDl,
} from "../helper";
import { useEffect } from "react";
import { toast } from "react-toastify";
import IDelete from "./../../../../../_helper/_helperIcons/_delete";
import NewSelect from "./../../../../../_helper/_select";
import { _dateFormatter } from "./../../../../../_helper/_dateFormate";
import InputField from "./../../../../../_helper/_inputField";
import FormikError from "./../../../../../_helper/_formikError";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
// import { getBusinessPartnerbyIdDDL_api } from "../../../../transaction/adjustment/credit_NoteAdjustment/helper";
import { _fixedPoint } from "./../../../../../_helper/_fixedPoint";

// Validation schema
const validationSchema = Yup.object().shape({
  partnerName: Yup.object().shape({
    label: Yup.string().required("Partner Name/Bin No is required"),
    value: Yup.string().required("Partner Name/Bin No is required"),
  }),
  fiscalYear: Yup.object().shape({
    label: Yup.string().required("Fiscal Year is required"),
    value: Yup.string().required("Fiscal Year is required"),
  }),
  salesInvoice: Yup.object().shape({
    label: Yup.string().required("Sales Invoice is required"),
    value: Yup.string().required("Sales Invoice is required"),
  }),
  vehicleNo: Yup.string().required("Vehicle No is required"),
  narration: Yup.string().required("Narration is required"),
  invoiceCode: Yup.string().required("Invoice Code is required"),
});

const validationSchemaForEdit = Yup.object().shape({
  salesInvoice: Yup.object().shape({
    label: Yup.string().required("Sales Invoice is required"),
    value: Yup.string().required("Sales Invoice is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  salesInvoice,
  rowDtoHandler,
  // partnerNameDDL,
  fiscalYear,
  setRowDto,
  profileData,
  selectedBusinessUnit,
  remover,
  rowDto,
}) {
  const [viewData, setViewData] = useState([]);
  const [itemNameDDL, setItemNameDDL] = useState([]);
  const [salesInvoiceDDL, setSalesInvoiceDDL] = useState([]);

  useEffect(() => {
    if (isEdit) {
      getViewData_api(
        profileData?.accountId,
        selectedBusinessUnit.value,
        isEdit,
        setViewData
      );
    }
  }, [isEdit, profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    // getBusinessPartnerbyIdDDL_api(
    //   profileData?.accountId,
    //   selectedBusinessUnit?.value,
    //   1,
    //   setBusinessPartnerbyIdDDL
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Row data
  const addRowDtoData = (values) => {
    if (values?.allItem === false) {
      let found = rowDto?.filter(
        (item) => item?.itemName?.value === values?.itemName?.value
      );
      if (found?.length > 0) {
        toast.warn("Not allowed to duplicate items");
      } else {
        setRowDto([
          ...rowDto,
          {
            quantity: values?.quantity,
            itemName: {
              value: values?.itemName?.value,
              label: values?.itemName?.label,
            },
            salesAmount: values?.salesAmount,
            salesSd: values?.salesSd,
            salesVat: values?.salesVat,
            returnQty: "",
            returnVat: "",
            returnSd: "",
            uomid: values?.uomid,
            uomname: values?.uomname,
            basePrice: values?.basePrice,
            returnedQuantity: values?.returnedQuantity || 0,
          },
        ]);
      }
    } else {
      let data = itemNameDDL?.map((data) => {
        return {
          ...data,
          itemName: {
            label: data?.label,
            value: data?.value,
          },
          salesAmount: data?.basetotal,
          salesSd: data?.sdtotal,
          salesVat: data?.vatTotal,
          returnQty: "",
          returnVat: "",
          returnSd: "",
          uomid: data?.uomid,
          uomname: data?.uomname,
        };
      });
      if (data?.length > 0) {
        setRowDto(data);
      } else {
        toast.warning("Data not found");
      }
    }
  };
  useEffect(() => {
    if (initData?.salesInvoice?.value) {
      getAllItemDetails(initData?.salesInvoice?.value, setItemNameDDL);
    }
  }, [initData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? validationSchemaForEdit : validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          setValues,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-8 pr-1">
                  <div className=" global-form h-100">
                    <div className="row">
                      {/* <div className="col-lg-4">
                        <NewSelect
                          name="partnerName"
                          options={partnerNameDDL}
                          value={values?.partnerName}
                          onChange={(valueOption) => {
                            setFieldValue("salesInvoice", "");
                            getPurchaseInvoiceDDl(
                              valueOption?.value,
                              setSalesInvoiceDDL
                            );
                            setFieldValue("partnerName", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                          label="Partner Name"
                          placeholder="Partner Name"
                        />
                      </div> */}
                      <div className="col-lg-4 mb-1">
                        <label>Customer Name/Bin No</label>
                        <SearchAsyncSelect
                          selectedValue={values?.partnerName}
                          handleChange={(valueOption) => {
                            setFieldValue("salesInvoice", "");
                            getPurchaseInvoiceDDl(
                              valueOption?.value,
                              setSalesInvoiceDDL
                            );
                            setFieldValue("partnerName", valueOption);
                          }}
                          loadOptions={(v) => {
                            if (v?.length < 2) return [];
                            return Axios.get(
                              `/vat/TaxDDL/GetPartnerBinDDL?PartnerTypeId=${2}&AccountId=${
                                profileData?.accountId
                              }&BusinessUnitId=${
                                selectedBusinessUnit?.value
                              }&BinNo=${v}&TradeType=0`
                            ).then((res) => {
                              const updateList = res?.data.map((item) => ({
                                ...item,
                                label: `${item?.name}(${item?.label})`,
                              }));
                              return updateList;
                            });
                          }}
                          isDisabled={isEdit}
                        />
                        <FormikError
                          errors={errors}
                          name="partnerName"
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-4 mb-1">
                        <NewSelect
                          name="salesInvoice"
                          options={salesInvoiceDDL}
                          value={values?.salesInvoice}
                          label="Sales Invoice"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            getViewData_api(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              setViewData
                            );
                            getAllItemDetails(
                              valueOption?.value,
                              setItemNameDDL
                            );
                            setFieldValue("salesInvoice", valueOption);
                            setFieldValue("itemName", "");
                          }}
                          placeholder="Sales Invoice"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-4 mb-1">
                        <NewSelect
                          name="fiscalYear"
                          options={fiscalYear || []}
                          value={values?.fiscalYear}
                          label="Fiscal Year"
                          onChange={(valueOption) => {
                            setFieldValue("fiscalYear", valueOption);
                          }}
                          placeholder="Fiscal Year"
                          uomname
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-4 mb-1">
                        <label>Vehicle No</label>
                        <InputField
                          value={values?.vehicleNo}
                          name="vehicleNo"
                          placeholder="Vehicle No"
                          type="text"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-4 mb-1">
                        <label>Narration</label>
                        <InputField
                          value={values?.narration}
                          name="narration"
                          placeholder="Narration"
                          type="text"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-4 mb-1">
                        <label>Invoice Code</label>
                        <InputField
                          value={values?.invoiceCode || ""}
                          name="invoiceCode"
                          placeholder="Invoice Code"
                          type="text"
                          disabled={isEdit}
                        />
                      </div>

                      <div className="col-lg-12 mb-1">
                        <hr />
                      </div>
                      <div className="col-lg-4 mb-1">
                        <NewSelect
                          name="itemName"
                          options={itemNameDDL}
                          value={values?.itemName}
                          label="Item Name"
                          onChange={(valueOption) => {
                            if (valueOption) {
                              getAmountSdVat(
                                valueOption?.value,
                                values?.salesInvoice?.value,
                                setFieldValue
                              );
                            }
                            setFieldValue("itemName", valueOption);
                          }}
                          placeholder="Item Name"
                          errors={errors}
                          touched={touched}
                          isDisabled={values?.allItem === true}
                        />
                      </div>
                      <div className="col-lg-5 my-5">
                        <label htmlFor="allItem">All Item</label>
                        <Field
                          name="allItem"
                          component={() => (
                            <input
                              id="allItem"
                              type="checkbox"
                              className="ml-2 mt-1"
                              // disabled={
                              //   values.allItem === "NA (Without Reference)"
                              // }
                              value={values?.allItem || ""}
                              checked={values?.allItem}
                              name="allItem"
                              onChange={(e) => {
                                setFieldValue("allItem", e.target.checked);
                                setFieldValue("item", "");
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3">
                        <button
                          type="button"
                          style={{
                            marginBottom: "-36px",
                            marginLeft: "-135px",
                          }}
                          className="btn btn-primary"
                          disabled={
                            !values?.fiscalYear ||
                            !values?.salesInvoice ||
                            (values?.allItem
                              ? false
                              : values?.itemName
                              ? false
                              : true)
                          }
                          onClick={() => addRowDtoData(values)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 pl-0">
                  <div className={"row global-form h-100"}>
                    <div className="col-lg-6">
                      <p className="mb-1">
                        <b>Transaction Date: </b>
                        {viewData?.transactionDate &&
                          _dateFormatter(viewData?.transactionDate)}
                      </p>
                      <p className="mb-1">
                        <b>Transaction Type: </b>
                        {viewData?.transactionType}
                      </p>
                      <p className="mb-1">
                        <b>Trade Type: </b>
                        {viewData?.tradeType}
                      </p>
                      <p className="mb-1">
                        <b>Customer Info: </b>
                        {viewData?.customerInfo}
                      </p>
                    </div>
                    <div className="col-lg-6">
                      <p className="mb-1">
                        <b>Deliverery Info: </b>
                        {viewData?.deliveryInfo}
                      </p>
                      <p className="mb-1">
                        <b>Deliverery Date: </b>
                        {viewData?.deliveryDate &&
                          _dateFormatter(viewData?.deliveryDate)}
                      </p>
                      <p className="mb-1">
                        <b>Vehicle Info: </b>
                        {viewData?.vehicleInfo}
                      </p>
                      <p className="mb-1">
                        <b>Reference No:</b>
                        {viewData?.referenceNo}
                      </p>
                      <p className="mb-1">
                        <b>Reference Date: </b>
                        {viewData?.referenceDate &&
                          _dateFormatter(viewData?.referenceDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 mt-4">
                  <table className={"table global-table"}>
                    <thead className={rowDto?.length < 1 && "d-none"}>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "35px" }}>Item Name</th>
                        <th style={{ width: "35px" }}>Sales Quantity</th>
                        <th style={{ width: "35px" }}>Prev. Rtn. Qty</th>
                        <th style={{ width: "35px" }}>Sales Amount</th>
                        <th style={{ width: "35px" }}>Sales SD</th>
                        <th style={{ width: "35px" }}>Sales VAT</th>
                        <th style={{ width: "35px" }}>Return Qty</th>
                        <th style={{ width: "35px" }}>Return VAT</th>
                        <th style={{ width: "35px" }}>Return SD</th>
                        <th style={{ width: "30px" }}>Action</th>
                      </tr>
                    </thead>
                    {/*T-body  */}

                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td style={{ width: "30px" }}>
                            <div className="text-center">
                              {item?.itemName?.label}
                            </div>
                          </td>
                          <td style={{ width: "30px" }}>
                            <div className="text-center">
                              {_fixedPoint(item?.quantity)}
                            </div>
                          </td>
                          <td style={{ width: "30px" }}>
                            <div className="text-center">
                              {_fixedPoint(item?.returnedQuantity || 0)}
                            </div>
                          </td>
                          <td style={{ width: "30px" }}>
                            <div className="text-center pl-2 ">
                              {_fixedPoint(item?.salesAmount)}
                            </div>
                          </td>
                          <td style={{ width: "30px" }}>
                            <div className="text-center pl-2">
                              {_fixedPoint(item?.salesSd)}
                            </div>
                          </td>
                          <td style={{ width: "30px" }}>
                            <div className="text-center">
                              {_fixedPoint(item?.salesVat)}
                            </div>
                          </td>
                          <td style={{ width: "50px" }}>
                            <div className="text-left">
                              <input
                                onChange={(e) => {
                                  const qtyTotal =
                                    +item?.quantity -
                                    (+item?.returnedQuantity || 0);

                                  if (+qtyTotal < e.target.value) {
                                    toast.warning("Sales Qty No Available");
                                    return;
                                  }

                                  rowDtoHandler(
                                    "returnQty",
                                    e.target.value,
                                    index
                                  );
                                }}
                                className="form-control"
                                type="number"
                                name="returnQty"
                                min="1"
                                required
                                placeholder="Return Qty"
                                value={item?.returnQty}
                                step="any"
                              />
                            </div>
                          </td>
                          <td style={{ width: "30px" }}>
                            <div className="text-right">
                              {_fixedPoint(item?.returnVat)}
                              {/* <input
                                onChange={(e) => {
                                  if (+item?.salesVat < e.target.value) return;
                                  rowDtoHandler(
                                    "returnVat",
                                    e.target.value,
                                    index
                                  );
                                }}
                                className="form-control"
                                type="number"
                                name="returnVat"
                                min="0"
                                required
                                placeholder="Return VAT"
                                value={item?.returnVat}
                                step="any"
                                max={item?.salesVat}
                              /> */}
                            </div>
                          </td>
                          <td style={{ width: "30px" }}>
                            <div className="text-right">
                              {_fixedPoint(item?.returnSd)}
                              {/* <input
                                value={rowDto[index]?.returnSd}
                                onChange={(e) => {
                                  if (+item?.salesSd < e.target.value) return;
                                  rowDtoHandler(
                                    "returnSd",
                                    e.target.value,
                                    index
                                  );
                                }}
                                min="0"
                                required
                                className="form-control"
                                type="number"
                                name="returnSd"
                                placeholder="Return SD"
                                // eslint-disable-next-line react/jsx-no-duplicate-props
                                value={item?.returnSd}
                                step="any"
                                max={item?.salesSd}
                              /> */}
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
