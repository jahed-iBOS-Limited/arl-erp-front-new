/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from './../../../../../_helper/_select';
import InputField from './../../../../../_helper/_inputField';
import {
  salesInvoiceByBranchIdDDL,
  getDeliveryDetailsById,
  getTaxSalesById,
  getPurchaseSalesById,
} from "../helper";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IDelete from './../../../../../_helper/_helperIcons/_delete';
import FormikError from "../../../../../_helper/_formikError";


// Validation schema
const validationSchema = Yup.object().shape({
  transferNo: Yup.object().shape({
    label: Yup.string().required("Transfer Branch required"),
    value: Yup.string().required("Transfer Branch required"),
  }),
  itemType: Yup.object().shape({
    label: Yup.string().required("Item Type required"),
    value: Yup.string().required("Item Type required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  remover,
  rowDto,
  setRowDto,
  profileData,
  selectedBusinessUnit,
  location,
  itemType,
  setTransferNo,
  transferNo,
  createPageGrid,
  setCreatePageGrid,
  setQuantity,
}) {
  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      location?.state?.selectedTaxBranchDDL?.value &&
      location?.state?.selectedItemType?.value
    )
      salesInvoiceByBranchIdDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        location?.state?.selectedTaxBranchDDL?.value,
        location?.state?.selectedItemType?.value,
        setTransferNo
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, location]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          itemType: location?.state?.selectedItemType,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
            setCreatePageGrid([])
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          setValues,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-8 p-0 pr-1">
                  <div className="row global-form h-100">
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <NewSelect
                        name="itemType"
                        options={itemType}
                        value={values?.itemType}
                        label="Item Type"
                        onChange={(valueOption) => {
                          setFieldValue("itemType", valueOption);
                          salesInvoiceByBranchIdDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            location?.state?.selectedTaxBranchDDL?.value,
                            valueOption?.value,
                            setTransferNo
                          );
                          setFieldValue("transferNo", {});
                        }}
                        placeholder="Item Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <NewSelect
                        name="transferNo"
                        options={transferNo}
                        value={values?.transferNo}
                        label="Transfer No."
                        onChange={(valueOption) => {
                          getDeliveryDetailsById(
                            values?.itemType?.value,
                            valueOption?.value,
                            setCreatePageGrid,
                            setFieldValue
                          );
                          setFieldValue("transferNo", valueOption);
                        }}
                        placeholder="Transfer No."
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <NewSelect
                        name="otherBranchName"
                        value={values?.otherBranchName}
                        isDisabled={true}
                        label="Branch (From)"
                        onChange={(valueOption) => {
                          setFieldValue("otherBranchName", valueOption);
                          setValues({
                            ...values,
                            otherBranchName: valueOption,
                            otherBranchAddress: valueOption?.taxBranchAddress,
                          });
                        }}
                        placeholder="From Branch"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>From Address</label>
                      <InputField
                        value={values?.otherBranchAddress}
                        name="otherBranchAddress"
                        placeholder="From Address"
                        type="text"
                        disabled={true || isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="otherBranchAddress"
                        touched={touched}
                      />
                    </div>
                    {!isEdit && (
                      <div className="col-lg-3 bank-journal">
                        <button
                          type="button"
                          disabled={
                            !values?.transferNo || !values?.otherBranchName
                          }
                          className="btn btn-primary"
                          onClick={() => {
                            if (values?.itemType?.value === 1) {
                              getPurchaseSalesById(
                                values?.transferNo?.value,
                                setRowDto
                              );
                            } else {
                              getTaxSalesById(
                                values?.transferNo?.value,
                                setRowDto
                              );
                            }
                          }}
                        >
                          View
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 p-0">
                  <div className={"row global-form h-100"}>
                    <div className="col-lg-6 p-0">
                      {/* {createPageGrid?.map((item, index) => ( */}
                      <div>
                        <p className="mb-1">
                          Transfer Date:
                          <b>
                            {createPageGrid
                              ? _dateFormatter(
                                  createPageGrid?.getByIdHeader
                                    ?.purchaseDateTime
                                )
                              : "No Data"}
                          </b>
                        </p>
                        <p className="mb-1">
                          Item Type:{" "}
                          <b>
                            {values?.itemType && values?.transferNo
                              ? values?.itemType?.label
                              : "No Data"}
                          </b>
                        </p>
                        <p className="mb-1">
                          Transfer From:{" "}
                          <b>
                            {createPageGrid
                              ? createPageGrid?.getByIdHeader?.taxBranchName
                              : "No Data"}
                          </b>
                        </p>
                        <p className="mb-1">
                          Reference No:{" "}
                          <b>
                            {createPageGrid
                              ? createPageGrid?.getByIdHeader?.referanceNo
                              : "No Data"}
                          </b>
                        </p>
                      </div>
                      {/* ))} */}
                    </div>
                    <div className="col-lg-6 p-0">
                      <p className="mb-1">
                        Transaction Type:
                        <b>
                          {createPageGrid
                            ? createPageGrid?.getByIdHeader
                                ?.taxTransactionTypeName
                            : "No Data"}{" "}
                        </b>
                      </p>
                      <p className="mb-1">
                        Vehicle Info:
                        <b>
                          {createPageGrid
                            ? createPageGrid?.getByIdHeader?.vehicleNo
                            : "No Data"}
                        </b>
                      </p>
                      <p className="mb-1">
                        Address:{" "}
                        <b>
                          {createPageGrid
                            ? createPageGrid?.getByIdHeader?.otherBranchAddress
                            : "No Data"}
                        </b>
                      </p>
                      <p className="mb-1">
                        Reference Date:{" "}
                        <b>
                          {createPageGrid
                            ? _dateFormatter(
                                createPageGrid?.getByIdHeader?.referanceDate
                              )
                            : "No Data"}
                        </b>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 mt-3 p-0">
                  <table className={"table global-table"}>
                    <thead className={rowDto?.length < 1 && "d-none"}>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "120px" }}>Item Name</th>
                        <th style={{ width: "100px" }}>UOM</th>
                        <th style={{ width: "50px" }}>Quantity</th>
                        <th style={{ width: "50px" }}>Rate</th>
                        <th style={{ width: "50px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="text-left pl-2">
                              {item?.taxItemGroupName}
                            </div>
                          </td>
                          <td>
                            <div className="text-left pl-2">
                              {item?.uomname}
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="text-right pr-2">
                                <input
                                  type="number"
                                  name="quantity"
                                  className="trans-date cj-landing-date"
                                  style={{
                                    padding: "0 10px",
                                    maxWidth: "98%",
                                  }}
                                  min="0"
                                  required
                                  value={item?.quantity || values?.quantity}
                                  onChange={(e) =>
                                    setQuantity(
                                      index,
                                      e.target.value,
                                      e.target.name
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {Math.abs(item?.basePrice)}
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
