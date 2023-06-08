import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../../_helper/_inputField";
import NewSelect from "../../../../../_helper/_select";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import Axios from "axios";
import FormikError from "./../../../../../_helper/_formikError";
import { toast } from "react-toastify";
import IViewModal from "./../../../../../_helper/_viewModal";
import PurchaseView from "./../../parchase/view/addEditForm";
import { _fixedPoint } from "./../../../../../_helper/_fixedPoint";
import {
  getFiscalYearDDL,
  getPurchaseInvoiceDDl,
  getTaxItemByPurchaseInvoiceId_api,
  getTaxPurchaseItemDetailsALL_api,
  getTaxPurchaseItemDetailsSingle_api,
  getViewDataApi,
} from "../helper/helper";

const validationSchema = Yup.object().shape({
  // purchaseInvoice: Yup.string().purchaseInvoice("required")
  partnerName: Yup.object().shape({
    label: Yup.string().required("Partner Name/Bin No is required"),
    value: Yup.string().required("Partner Name/Bin No is required"),
  }),
  purchaseInvoice: Yup.object().shape({
    label: Yup.string().required("Purchase Invoice is required"),
    value: Yup.string().required("Purchase Invoice is required"),
  }),
  fiscalYear: Yup.object().shape({
    label: Yup.string().required("Fiscal Year is required"),
    value: Yup.string().required("Fiscal Year is required"),
  }),
  // itemName: Yup.object().shape({
  //   label: Yup.string().required("Item Name is required"),
  //   value: Yup.string().required("Item name is required"),
  // }),
  vehicleNo: Yup.string().required("Vehicle No is required"),
  narration: Yup.string().required("Narration is required"),
});

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
  // const [partnerDDl, setPartnerDDl] = useState([]);
  const [view, setView] = useState(false);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const [singleData, setSingleData] = useState({});
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      getFiscalYearDDL(setFiscalYearDDl);

      // getPartnerDDl(
      //   profileData.accountId,
      //   selectedBusinessUnit.value,
      //   setPartnerDDl
      // );
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
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            setViewData("");
            resetForm(initData);
            setRowData([]);
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-8 pr-1">
                  <div className="global-form h-100">
                    <div className="form-group row ">
                      {/* <div className="col-lg-4">
                        <NewSelect
                          name="partnerName"
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
                          label="Partner Name"
                          placeholder="Partner Name"
                        />
                      </div> */}

                      <div className="col-lg-4">
                        <label>Supplier Name/Bin No</label>
                        <SearchAsyncSelect
                          selectedValue={values?.partnerName}
                          handleChange={(valueOption) => {
                            setFieldValue("partnerName", valueOption);
                            setFieldValue("purchaseInvoice", "");
                            getPurchaseInvoiceDDl(
                              valueOption?.value,
                              setPurchaseInvoiceDDl
                            );
                          }}
                          loadOptions={(v) => {
                            if (v?.length < 2) return [];
                            return Axios.get(
                              `/vat/TaxDDL/GetPartnerBinDDL?PartnerTypeId=${1}&AccountId=${
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
                      {/* <div className="col-lg-4">
                        <NewSelect
                          placeholder="Supplier Name/Bin No"
                          label="Supplier Name/Bin No"
                          name="partnerName"
                          options={partnerDDl}
                          value={values?.partnerName}
                          onChange={(valueOption) => {
                            setRowData([]);
                            setFieldValue("partnerName", valueOption);
                            setFieldValue("itemName", "");
                            // getTaxItemByPurchaseInvoiceId_api(
                            //   valueOption?.value,
                            //   setItemNameDDl
                            // );
                            // getViewDataApi(valueOption?.value, setViewData);
                            // // multiple item api call
                            // getTaxPurchaseItemDetailsALL_api(
                            //   valueOption?.label,
                            //   setPurchaseItemDetailsMultipleAll
                            // );
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div> */}
                      <div className="col-lg-4">
                        <NewSelect
                          placeholder="Purchase Invoice"
                          label="Purchase Invoice"
                          name="purchaseInvoice"
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
                              valueOption?.value,
                              setPurchaseItemDetailsMultipleAll
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-4">
                        <NewSelect
                          name="fiscalYear"
                          options={fiscalYearDDl}
                          value={values?.fiscalYear}
                          onChange={(valueOption) => {
                            setFieldValue("fiscalYear", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                          label="Fiscal Year"
                          placeholder="Fiscal Year"
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

                      <div className="col-lg-12 mb-1">
                        <hr />
                      </div>
                      <div className="col-lg-4">
                        <NewSelect
                          name="itemName"
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
                          placeholder="Item Name"
                          label="Item Name"
                        />
                      </div>
                      <div className="col-lg-2 d-flex justify-content-start align-items-end">
                        <div>
                          <label className="p-2" htmlFor="checkAllItem">
                            All item
                          </label>
                          <Field
                            id="checkAllItem"
                            className="p-0"
                            type="checkbox"
                            name="checkAllItem"
                            checked={values?.checkAllItem || ""}
                            onChange={(e) => {
                              setFieldValue("checkAllItem", e.target.checked);
                              setFieldValue("item", "");
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 mt-6">
                        <button
                          className="btn btn-primary"
                          type="button"
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

                <div className="col-lg-4 pl-0">
                  <div className={"row global-form h-100"}>
                    <div className="col-lg-6 pr-1">
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
                        <b>Supplier Name: </b>
                        {viewData?.objHeaderDTO?.supplierName}
                      </p>
                    </div>
                    <div className="col-lg-6 pl-1">
                      <p>
                        <b>Purchase No: </b>
                        <span
                          className="underLine"
                          onClick={() => {
                            setView(true);
                            setSingleData({
                              taxPurchaseId:
                                viewData?.objHeaderDTO?.taxPurchaseId,
                            });
                          }}
                        >
                          {" "}
                          {viewData?.objHeaderDTO?.taxPurchaseCode}
                        </span>
                      </p>
                      <p>
                        <b>Purchase Date: </b>
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
              <div className="row">
                <div className="col-lg-12 mt-4">
                  {/* table  start*/}
                  <table className="table global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>SL</th>
                        <th style={{ width: "150px" }}>Item Name </th>
                        <th style={{ width: "150px" }}>UoM</th>
                        <th style={{ width: "150px" }}>Purchase Qty</th>
                        <th style={{ width: "150px" }}>Prev. Rtn. Qty</th>
                        <th style={{ width: "150px" }}>Purchase Amount</th>
                        <th style={{ width: "150px" }}>Purchase SD</th>
                        <th style={{ width: "150px" }}>Purchase VAT</th>
                        <th style={{ width: "150px" }}>Return Qty</th>
                        <th style={{ width: "150px" }}>Return Vat</th>
                        <th style={{ width: "150px" }}>Return SD</th>
                        <th style={{ width: "35px" }}> Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData.map((itm, i) => {
                        return (
                          <tr key={i}>
                            <td className="text-center"> {i + 1}</td>
                            <td className=""> {itm?.itemNameLabel}</td>
                            <td className=""> {itm?.uomname}</td>
                            <td className="text-center">
                              {" "}
                              {itm?.apiQuantity?.toFixed(2)}
                            </td>
                            <td className="text-center">
                              {" "}
                              {itm?.returnedQuantity?.toFixed(2)}
                            </td>
                            <td className="text-right">
                              {" "}
                              {itm?.invoiceTotal.toFixed(2)}
                            </td>
                            <td className="text-right">
                              {" "}
                              {itm?.apiSdtotal.toFixed(2)}
                            </td>
                            <td className="text-right">
                              {" "}
                              {itm?.apivatTotal.toFixed(2)}
                            </td>
                            <td className="">
                              <InputField
                                value={itm?.quantity}
                                name="increaseQty"
                                type="number"
                                max={itm?.apiQuantity}
                                required
                                onChange={(e) => {
                                  const qtyTotal =
                                    +itm?.apiQuantity -
                                    (+itm?.returnedQuantity || 0);
                                  if (+qtyTotal < e.target.value) {
                                    toast.warning("Purchase Qty No Available");
                                    return;
                                  }
                                  changeHandler("quantity", e.target.value, i);
                                }}
                                step="any"
                                min="1"
                              />
                            </td>
                            <td className="text-right">
                              {/* <InputField
                                value={itm?.vatTotal}
                                name="IncreseVat"
                                type="number"
                                max={itm?.apivatTotal}
                                required
                                onChange={(e) => {
                                  if (+itm?.apivatTotal < e.target.value) {
                                    toast.warning(
                                      "Purchase Vat Value No Available"
                                    );
                                    return;
                                  }
                                  changeHandler("vatTotal", e.target.value, i);
                                }}
                                step="any"
                                min="0"
                              /> */}
                              {_fixedPoint(itm?.vatTotal)}
                            </td>
                            <td className="text-right">
                              {/* <InputField
                                value={itm?.sdtotal}
                                name="IncreseSd"
                                type="number"
                                max={itm?.apiSdtotal}
                                required
                                onChange={(e) => {
                                  if (+itm?.apiSdtotal < e.target.value) {
                                    toast.warning(
                                      "Purchase SD Value No Available"
                                    );
                                    return;
                                  }
                                  changeHandler("sdtotal", e.target.value, i);
                                }}
                                step="any"
                                min="0"
                              /> */}
                              {_fixedPoint(itm?.sdtotal)}
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
              <IViewModal
                show={view}
                onHide={() => {
                  setView(false);
                }}
                title={"View Purchase"}
                btnText="Close"
              >
                <PurchaseView viewClick={singleData} />
              </IViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
