import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NewSelect from "../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import {
  getFiscalYearDDL,
  getPartnerDDl,
  getPurchaseInvoiceDDl,
  getTaxItemByPurchaseInvoiceId_api,
  getTaxPurchaseItemDetailsALL_api,
  getTaxPurchaseItemDetailsSingle_api,
  getViewDataApi,
} from "../helper/helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

// const validationSchema = Yup.object().shape({
//   // purchaseInvoice: Yup.string().purchaseInvoice("required")
//   purchaseInvoice: Yup.object().shape({
//     label: Yup.string().required("Purchase Invoice is required"),
//     value: Yup.string().required("Purchase Invoice is required"),
//   }),
//   itemName: Yup.object().shape({
//     label: Yup.string().required("Item Name is required"),
//     value: Yup.string().required("Item name is required"),
//   }),
// });

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  rowData,
  setRowData,
  setPurchaseItemDetailsSingle,
  setPurchaseItemDetailsMultipleAll,
  rowDataAddHandler,
  changeHandler,
  remover,
  viewData,
  setViewData,
}) {
  const [fiscalYearDDl, setFiscalYearDDl] = useState([]);
  const [purchaseInvoiceDDl, setPurchaseInvoiceDDl] = useState([]);
  const [itemNameDDl, setItemNameDDl] = useState([]);
  const [partnerDDl, setPartnerDDl] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      getFiscalYearDDL(setFiscalYearDDl);

      getPartnerDDl(
        profileData.accountId,
        selectedBusinessUnit.value,
        setPartnerDDl
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (initData?.purchaseInvoice?.value) {
      getTaxItemByPurchaseInvoiceId_api(
        initData?.purchaseInvoice?.value,
        setItemNameDDl
      );
    }
  }, [initData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
            <Form className='form form-label-right'>
              <div className='row'>
                <div className='col-lg-8 pr-1'>
                  <div className='global-form h-100'>
                    <div className='form-group row '>
                      <div className='col-lg-4'>
                        <NewSelect
                          name='partnerName'
                          options={partnerDDl}
                          value={values?.partnerName}
                          onChange={(valueOption) => {
                            setFieldValue("partnerName", valueOption);
                            setFieldValue("purchaseInvoice", "");
                            getPurchaseInvoiceDDl(
                              valueOption?.value,
                              setPurchaseInvoiceDDl
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                          label='Partner Name'
                          placeholder='Partner Name'
                        />
                      </div>
                      <div className='col-lg-4'>
                        <NewSelect
                          placeholder='Purchase Invoice'
                          label='Purchase Invoice'
                          name='purchaseInvoice'
                          options={purchaseInvoiceDDl}
                          value={values?.purchaseInvoice}
                          onChange={(valueOption) => {
                            setRowData([]);
                            setFieldValue("purchaseInvoice", valueOption);
                            setFieldValue("itemName", "");
                            getTaxItemByPurchaseInvoiceId_api(
                              valueOption?.value,
                              setItemNameDDl
                            );
                            getViewDataApi(valueOption?.value, setViewData);
                            // multiple item api call
                            getTaxPurchaseItemDetailsALL_api(
                              valueOption?.label,
                              setPurchaseItemDetailsMultipleAll
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className='col-lg-4'>
                        <NewSelect
                          name='fiscalYear'
                          options={fiscalYearDDl}
                          value={values?.fiscalYear}
                          onChange={(valueOption) => {
                            setFieldValue("fiscalYear", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                          label='Fiscal Year'
                          placeholder='Fiscal Year'
                        />
                      </div>
                      <div className='col-lg-4'>
                        <NewSelect
                          name='itemName'
                          options={itemNameDDl}
                          value={values?.itemName}
                          onChange={(valueOption) => {
                            setFieldValue("itemName", valueOption);
                            // single item api call
                            getTaxPurchaseItemDetailsSingle_api(
                              valueOption?.value,
                              values?.purchaseInvoice?.label,
                              setPurchaseItemDetailsSingle
                            );
                          }}
                          isDisabled={values?.checkAllItem ? true : false}
                          errors={errors}
                          touched={touched}
                          placeholder='Item Name'
                          label='Item Name'
                        />
                      </div>
                      <div className='col-lg-2 d-flex justify-content-start align-items-end'>
                        <div>
                          <label className='p-2' htmlFor='checkAllItem'>
                            All item
                          </label>
                          <Field
                            id='checkAllItem'
                            className='p-0'
                            type='checkbox'
                            name='checkAllItem'
                            checked={values?.checkAllItem || ""}
                            onChange={(e) => {
                              setFieldValue("checkAllItem", e.target.checked);
                              setFieldValue("item", "");
                            }}
                          />
                        </div>
                      </div>
                      <div className='col-lg-4 mt-6'>
                        <button
                          className='btn btn-primary'
                          type='button'
                          onClick={() =>
                            rowDataAddHandler(values?.checkAllItem, values)
                          }
                          disabled={
                            !values?.partnerName ||
                            !values?.purchaseInvoice ||
                            !values?.fiscalYear ||
                            values?.checkAllItem
                              ? false
                              : !values?.itemName
                          }
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='col-lg-4 pl-0'>
                  <div className={"row global-form h-100"}>
                    <div className='col-lg-6 pr-1'>
                      <p>
                        <b>Transaction Date: </b>
                        {_dateFormatter(
                          viewData?.objHeaderDTO?.purchaseDateTime || ""
                        )}
                      </p>
                      <p>
                        <b>Transaction Type: </b>
                        {viewData?.objHeaderDTO?.taxTransactionTypeName}
                      </p>
                      <p>
                        <b>Trade Type: </b>
                        {viewData?.objHeaderDTO?.tradeTypeName}
                      </p>
                      <p>
                        <b>Customer Info: </b>
                        {viewData?.objHeaderDTO?.supplierName}
                      </p>
                    </div>
                    <div className='col-lg-6 pl-1'>
                      <p>
                        <b>Delivery Info: </b>
                        {viewData?.objHeaderDTO?.taxPurchaseCode}
                      </p>
                      <p>
                        <b>Delivery Date: </b>
                        {_dateFormatter(
                          viewData?.objHeaderDTO?.referanceDate || ""
                        )}
                      </p>
                      <p>
                        <b>Vehicle Info: </b>
                        {viewData?.objHeaderDTO?.vehicleNo}
                      </p>
                      <p>
                        <b>Reference No:</b>
                        {viewData?.objHeaderDTO?.referanceNo}
                      </p>
                      <p>
                        <b>Reference Date: </b>
                        {_dateFormatter(
                          viewData?.objHeaderDTO?.referanceDate || ""
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-12 mt-4'>
                  {/* table  start*/}
                  <table className='table global-table'>
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>SL</th>
                        <th style={{ width: "150px" }}>Item Name </th>
                        <th style={{ width: "150px" }}>UoM</th>
                        <th style={{ width: "150px" }}>Purchase Qty</th>
                        <th style={{ width: "150px" }}>Purchase Amount</th>
                        <th style={{ width: "150px" }}>Purchase SD</th>
                        <th style={{ width: "150px" }}>Purchase VAT</th>
                        <th style={{ width: "150px" }}>Increse Qty</th>
                        <th style={{ width: "150px" }}>Increse Vat</th>
                        <th style={{ width: "150px" }}>Increse SD</th>
                        <th style={{ width: "35px" }}> Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData.map((itm, i) => {
                        return (
                          <tr key={i}>
                            <td className='text-center'> {i + 1}</td>
                            <td className=''> {itm?.itemNameLabel}</td>
                            <td className=''> {itm?.uomname}</td>
                            <td className='text-center'>
                              {" "}
                              {itm?.apiQuantity?.toFixed(2)}
                            </td>
                            <td className='text-right'>
                              {" "}
                              {itm?.invoicePrice.toFixed(2)}
                            </td>
                            <td className='text-right'>
                              {" "}
                              {itm?.apiSdtotal.toFixed(2)}
                            </td>
                            <td className='text-right'>
                              {" "}
                              {itm?.apivatTotal.toFixed(2)}
                            </td>
                            <td className=''>
                              <InputField
                                value={itm?.quantity}
                                name='increaseQty'
                                type='number'
                                min={itm?.apiQuantity}
                                required
                                onChange={(e) => {
                                  changeHandler("quantity", e.target.value, i);
                                }}
                                step='any'
                              />
                            </td>
                            <td className=''>
                              <InputField
                                value={itm?.vatTotal}
                                name='IncreseVat'
                                type='number'
                                min={itm?.apivatTotal}
                                required
                                onChange={(e) => {
                                  changeHandler("vatTotal", e.target.value, i);
                                }}
                                step='any'
                              />
                            </td>
                            <td className=''>
                              <InputField
                                value={itm?.sdtotal}
                                name='IncreseSd'
                                type='number'
                                min={itm?.apiSdtotal}
                                required
                                onChange={(e) => {
                                  changeHandler("sdtotal", e.target.value, i);
                                }}
                                step='any'
                              />
                            </td>
                            <td className='text-center'>
                              <span onClick={() => remover(i)}>
                                <IDelete />
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

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
