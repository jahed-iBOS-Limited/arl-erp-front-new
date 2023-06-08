import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import {
  getFiscalYearDDL_api,
  getTaxItemByPurchaseInvoiceId_api,
  getPurchaseInvoiceDDL,
} from "../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  getBusinessPartnerbyIdDDL_api,
  getTaxPurchaseItemDetailsSingle_api,
  getTaxPurchaseItemDetailsALL_api,
} from "./../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  transactionDate: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Transaction Date is required"),
  partner: Yup.object().shape({
    label: Yup.string().required("Partner(Purchase) is required"),
    value: Yup.string().required("Partner(Purchase) is required"),
  }),
  purchaseInvoice: Yup.object().shape({
    label: Yup.string().required("Purchase Invoice is required"),
    value: Yup.string().required("Purchase Invoice is required"),
  }),
  fiscalYear: Yup.object().shape({
    label: Yup.string().required("Fiscal Year is required"),
    value: Yup.string().required("Fiscal Year is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  empDDL,
  isEdit,
  setRowDto,
  rowDto,
  remover,
  rowDataAddHandler,
  setPurchaseItemDetailsSingle,
  setPurchaseItemDetailsMultipleAll,
  changeHandler,
  total,
}) {
  const [purchaseInvoiceDDL, setPurchaseInvoiceDDL] = useState([]);
  const [fiscalYearDDL, setFiscalYearDDL] = useState([]);
  const [itemNameDDL, serItemNameDDL] = useState([]);
  const [businessPartnerbyIdDDL, setBusinessPartnerbyIdDDL] = useState([]);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;
  //FETCHING ALL DATA FROM helper.js
  useEffect(() => {
    getFiscalYearDDL_api(setFiscalYearDDL);
  }, []);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getBusinessPartnerbyIdDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        1,
        setBusinessPartnerbyIdDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const partnerDDLChangeFunc = (parnerId) => {
    getPurchaseInvoiceDDL(parnerId, setPurchaseInvoiceDDL);
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
            {console.log("Values   lll=> ", values)}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="partner"
                    options={businessPartnerbyIdDDL || []}
                    value={values?.partner}
                    label="Partner(Purchase)"
                    onChange={(valueOption) => {
                      setFieldValue("partner", valueOption);
                      partnerDDLChangeFunc(valueOption?.value);
                    }}
                    placeholder="Partner(Purchase)"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="purchaseInvoice"
                    options={purchaseInvoiceDDL || []}
                    value={values?.purchaseInvoice}
                    label="Purchase Invoice"
                    onChange={(valueOption) => {
                      setRowDto([]);
                      setFieldValue("purchaseInvoice", valueOption);
                      setFieldValue("itemName", "");
                      getTaxItemByPurchaseInvoiceId_api(
                        valueOption?.value,
                        serItemNameDDL
                      );
                      // multiple item api call
                      getTaxPurchaseItemDetailsALL_api(
                        valueOption?.label,
                        setPurchaseItemDetailsMultipleAll
                      );
                    }}
                    placeholder="Purchase Invoice"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="fiscalYear"
                    options={fiscalYearDDL || []}
                    value={values?.fiscalYear}
                    label="Fiscal Year"
                    onChange={(valueOption) => {
                      setFieldValue("fiscalYear", valueOption);
                    }}
                    placeholder="Fiscal Year"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Transaction Date</label>
                  <InputField
                    value={values?.transactionDate}
                    name="transactionDate"
                    placeholder="Transaction Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-12"></div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemName"
                    options={itemNameDDL || []}
                    value={values?.itemName}
                    label="Item Name"
                    onChange={(valueOption) => {
                      setFieldValue("itemName", valueOption);
                      // single item api call
                      getTaxPurchaseItemDetailsSingle_api(
                        valueOption?.value,
                        values?.purchaseInvoice?.label,
                        setPurchaseItemDetailsSingle
                      );
                    }}
                    placeholder="Item Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-1 mt-4 d-flex justify-content-start align-items-center">
          
                </div> */}
                <div className="col-lg-3 mt-6 d-flex justify-content-around align-items-center">
                  <div>
                    <input
                      type="checkbox"
                      id="checkbox_id"
                      checked={values?.allItem}
                      name="allItem"
                      onChange={(event) => {
                        setFieldValue("allItem", event.target.checked);
                      }}
                    />
                    <label for="checkbox_id" className="mr-2 ml-3">
                      All Item
                    </label>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => rowDataAddHandler(values?.allItem, values)}
                    type="button"
                    disabled={
                      !values?.partner ||
                      !values?.purchaseInvoice ||
                      !values?.transactionDate
                    }
                  >
                    Add
                  </button>
                </div>
                <div className="col-lg-2 offset-4 mt-6">
                  <p>
                    <b>Total Amount: </b> {total.toFixed(2)}
                  </p>
                </div>
              </div>

              <table className="table table-striped table-bordered global-table">
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
                  {rowDto.map((itm, i) => {
                    return (
                      <tr key={i}>
                        <td className="text-center"> {i + 1}</td>
                        <td className=""> {itm?.itemName}</td>
                        <td className=""> {itm?.uomname}</td>
                        <td className=""> {itm?.quantity_api}</td>
                        <td className=""> {itm?.invoicePrice}</td>
                        <td className=""> {itm?.sdtotal_api}</td>
                        <td className=""> {itm?.vatTotal_api}</td>
                        <td className="">
                          <InputField
                            value={itm?.quantity}
                            name="increaseQty"
                            type="number"
                            min="0"
                            required
                            onChange={(e) => {
                              changeHandler(e.target?.name, e.target.value, i);
                            }}
                            step="any"
                          />
                        </td>
                        <td className="">
                          <InputField
                            value={itm?.vatTotal}
                            name="IncreseVat"
                            type="number"
                            min="0"
                            required
                            onChange={(e) => {
                              changeHandler(e.target?.name, e.target.value, i);
                            }}
                            step="any"
                          />
                        </td>
                        <td className="">
                          <InputField
                            value={itm?.sdtotal}
                            name="IncreseSd"
                            type="number"
                            min="0"
                            required
                            onChange={(e) => {
                              changeHandler(e.target?.name, e.target.value, i);
                            }}
                            step="any"
                          />
                        </td>
                        <td className="text-center">
                          <span onClick={() => remover(i)}>
                            <IDelete />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

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
