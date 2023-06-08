/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { ISelect } from "../../../../_helper/_inputDropDown";
import ICalendar from "../../../../_helper/_inputCalender";
import ICustomTable from "../../../../_helper/_customTable";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { toast } from "react-toastify";
import customStyles from "../../../../selectCustomStyle";
import Select from "react-select";
import { getSupplierNameDDLAction } from "../_redux/Actions"
import { useSelector, shallowEqual } from 'react-redux'

// Validation schema
const validationSchema = Yup.object().shape({
  requestDate: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Request Date is required"),
  validityDate: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Validity date is required"),
  currency: Yup.object().shape({
    label: Yup.string().required("Currency is required"),
    value: Yup.string().required("Currency is required"),
  }),
});

const headersWithPR = [
  "SL",
  "PR Reference",
  "Item Code",
  "Item Name",
  "Item Type",
  "UoM",
  "Purchase Description",
  "Ref. Qty.",
  "Request Qty.",
  "Action",
];
const headersWithOutPR = [
  "SL",
  "Item Code",
  "Item Name",
  "Item Type",
  "UoM",
  "Purchase Description",
  "Request Qty.",
  "Action",
];

const headersTwo = [
  "SL",
  "Supplier Name",
  "Address",
  "Email",
  "Contact Number",
  "Action",
];

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  rowDto,
  remover,
  setter,
  id,
  currencyDDL,
  supplierDDL,
  refNoDDL,
  itemDDL,
  refFunc,
  dependencyFunc,
  rowDtoHandler,
  setterTwo,
  rowDtoTwo,
  removerTwo,
  setRefNo,
  usersDDLdata
}) {


  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  const [supplierNameDDL, setsupplierNameDDL] = useState([])

  useEffect(() => {
    getSupplierNameDDLAction(profileData?.accountId, selectedBusinessUnit?.value, usersDDLdata?.sbu?.value, setsupplierNameDDL)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value])


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={id ? "" : validationSchema}
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
          isValid,
        }) => (
          <>
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <ICalendar
                    value={values?.requestDate}
                    label="Request Date"
                    name="requestDate"
                    disabled={id}
                  />
                </div>

                <div className="col-lg-4">
                  <ICalendar
                    value={values?.validityDate}
                    label="Validity"
                    name="validityDate"
                    disabled={id}
                  />
                </div>

                <div className="col-lg-4">
                  <ISelect
                    label="Currency"
                    placeholder="Currency"
                    options={currencyDDL}
                    value={values?.currency}
                    name="currency"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isDisabled={id}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg">
                  <ISelect
                    label="Reference Type"
                    placeholder="Reference Type"
                    options={[
                      { value: "with reference", label: "With reference" },
                      {
                        value: "without reference",
                        label: "Without reference",
                      },
                    ]}
                    value={values?.refType}
                    dependencyFunc={refFunc}
                    isDisabled={id}
                    name="refType"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg">
                  <label>Reference No.</label>
                  <Select
                    options={refNoDDL || []}
                    isDisabled={values.refType?.value === "without reference"}
                    placeholder="Reference No."
                    value={values?.refNo}
                    onChange={(valueOption) => {
                      setRefNo(valueOption);
                      setFieldValue("item", null);
                      setFieldValue("refNo", valueOption);
                    }}
                    isSearchable={true}
                    styles={customStyles}
                  />

                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors && errors.refNo && touched && touched.refNo
                      ? errors.refNo.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg">
                  <ISelect
                    label="Item"
                    placeholder="Item"
                    isDisabled={!values.refType || (values.refType?.value === "with reference" && !values.refNo?.value)}
                    options={itemDDL || []}
                    dependencyFunc={dependencyFunc}
                    value={values.item}
                    name="item"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg">
                  <label
                    style={{
                      position: "absolute",
                      top: "24px",
                    }}
                  >
                    All Item
                  </label>
                  <Field
                    name={values.isAllItem}
                    component={() => (
                      <input
                        style={{
                          position: "absolute",
                          top: "28px",
                          left: "65px",
                        }}
                        id="rfqIsAllItem"
                        type="checkbox"
                        className="ml-2"
                        disabled={values.refType?.value === "without reference"}
                        value={values.isAllItem || ""}
                        checked={values.isAllItem}
                        name="isAllItem"
                        onChange={(e) => {
                          setFieldValue("isAllItem", e.target.checked);
                        }}
                      />
                    )}
                    label="isAllItem"
                  />

                  <button
                    type="button"
                    style={{ marginTop: "14px", transform: "translateX(95px)" }}
                    className="btn btn-primary ml-2"
                    disabled={
                      !values.refType ||
                      (values.isAllItem ? false : !values.item)
                    }
                    onClick={() => {
                      if (
                        values.refType?.value === "with reference" &&
                        !values.refNo
                      ) {
                        toast.warning("Reference no is required");
                      } else {
                        // debugger;
                        setter(values);
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Row d tos one */}
              <div className="customTable_hide_overflow_x">
                {rowDto.length > 0 && (
                  <ICustomTable ths={values.refType?.value === 'with reference' ? headersWithPR : headersWithOutPR}>
                    {rowDto?.map((td, index) => {
                      return (
                        <tr key={index}>
                          <td className="align-middle"> {index + 1} </td>
                          {
                            values.refType?.value === 'with reference' &&
                            <td className="align-middle"> {td.purchaseRequestCode} </td>
                          }

                          <td className="align-middle"> {td.itemCode} </td>
                          <td className="align-middle"> {td.itemName} </td>
                          <td className="align-middle"> {td.itemtypeName} </td>
                          <td className="align-middle">
                            {td.uomDDL.label}
                            {/* <Field
                              name="UoM"
                              placeholder="Select UoM"
                              component={() => (
                                <Select
                                  options={td.uomDDL || []}
                                  defaultValue={rowDto[index]?.selectedUom}
                                  onChange={(valueOption) => {
                                    setFieldValue("UoM", valueOption);
                                    rowDtoHandler(
                                      "selectedUom",
                                      valueOption,
                                      index
                                    );
                                  }}
                                  isSearchable={true}
                                  styles={customStyles}
                                />
                              )}
                            /> */}
                          </td>
                          <td className="align-middle disable-border">
                            <IInput
                              value={rowDto[index]?.description}
                              required
                              onChange={(e) => {
                                rowDtoHandler(
                                  "description",
                                  e.target.value,
                                  index
                                );
                              }}
                              name="description"
                            />
                          </td>
                          {/* <td className="align-middle">
                            {" "}
                            {td.refNo && td.refNo}{" "}
                          </td> */}
                          {/* <td className="align-middle">
                            {" "}
                            {td.refQty && td.refQty}{" "}
                          </td> */}
                          {
                            values.refType?.value === 'with reference' &&
                            <td className="align-middle">
                              {" "}
                              {td.refQty && td.refQty}{" "}
                            </td>
                          }
                          <td className="align-middle disable-border">
                            <IInput
                              value={rowDto[index]?.reqQty}
                              required
                              min="0"
                              max={values.refType?.value === "with reference" ? td?.refQty : Infinity}
                              type="number"
                              onChange={(e) => {
                                rowDtoHandler("reqQty", e.target.value, index);
                              }}
                              name="reqQty"
                            />
                          </td>
                          <td className="align-middle text-center">
                            <IDelete remover={remover} id={td?.itemId} />
                          </td>
                        </tr>
                      );
                    })}
                  </ICustomTable>
                )}
              </div>

              {/* rowdtos two */}
              <h3 style={{ fontSize: "1.275rem" }}>
                Add Supplier for Send REQ/RFI/RFP
              </h3>
              <div className="row">
                <div className="col-lg">
                  <ISelect
                    label="Supplier Name"
                    placeholder="Supplier Name"
                    options={supplierNameDDL}
                    onChange={value => {
                      setFieldValue("supplierName", value)
                      setFieldValue("email", value.supplierEmail)
                    }}
                    defaultValue={values.supplierName}
                    name="supplierName"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg disable-border disabled-feedback">
                  <IInput label="Email" value={values?.email} name="email" />
                </div>
                <div className="col-lg">
                  <button
                    type="button"
                    style={{ marginTop: "14px" }}
                    className="btn btn-primary ml-2"
                    disabled={!values.supplierName || !values.email}
                    onClick={() => setterTwo(values)}
                  >
                    Add
                  </button>
                </div>
              </div>

              {rowDtoTwo.length > 0 && (
                <ICustomTable ths={headersTwo}>
                  {rowDtoTwo.map((td, index) => {
                    return (
                      <tr>
                        <td> {index + 1} </td>
                        <td> {td.supplierName} </td>
                        <td> {td.address} </td>
                        <td> {td.email} </td>
                        <td> {td.contact} </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <button
                              style={{ border: "none", background: "none" }}
                            >
                              <IDelete
                                remover={removerTwo}
                                id={td?.supplierId}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </ICustomTable>
              )}

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
