/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { ISelect } from "../../../../_helper/_inputDropDown";
import ICalendar from "../../../../_helper/_inputCalender";
import ICustomTable from "../../../../_helper/_customTable";
import toArray from "lodash/toArray";
import {  getRFQSupplierNameDDLAction } from "../_redux/Actions"
import { getSupplierItemRowNameDDLAction } from "../_redux/Actions"


// Validation schema
const validationSchema = Yup.object().shape({
  supplierName: Yup.object().shape({
    label: Yup.string().required("Supplier name is required"),
    value: Yup.string().required("Supplier name is required"),
  }),
  supplierRef: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Supplier reference is required"),
  supplierDate: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Date is required"),
});

const ths = [
  "SL",
  "Item Code",
  "Item Name",
  "UoM",
  "Purchase Description",
  "RFQ Qty.",
  "Rate",
  "Value",
  "Comments",
];

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  rowDto,
  setRowDto,
  id,
  supplierDDL,
  rowDtoHandler,
  profileData,
  selectedBusinessUnit
}) {
  const [supplierNameDDL, setsupplierNameDDL] = useState([])

  useEffect(() => {
    // getSupplierNameDDLAction(profileData?.accountId, selectedBusinessUnit?.value,usersDDLdata?.sbu?.value,setsupplierNameDDL)
    getRFQSupplierNameDDLAction(profileData?.accountId, selectedBusinessUnit?.value, id, setsupplierNameDDL)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value])
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
          isValid,
        }) => (
          <>
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <ISelect
                    label="Supplier name"
                    placeholder="Supplier name"
                    options={supplierNameDDL}
                    value={values.supplierName}
                    name="supplierName"
                    errors={errors}
                    touched={touched}
                    onChange={selected => {
                      resetForm()
                      setFieldValue("supplierName", selected)
                      getSupplierItemRowNameDDLAction(selected?.rfqId, setRowDto, setFieldValue)
                      console.log(values)
                    }}
                  />
                </div>
                <div className="col-lg-3 disable-border disabled-feedback">
                  <IInput
                    value={values.supplierRef}
                    label="Supplier Ref. No."
                    name="supplierRef"
                  />
                </div>
                <div className="col-lg-3 disable-border disabled-feedback">
                  <ICalendar
                    value={values.supplierDate}
                    label="Supplier Ref. Date"
                    name="supplierDate"
                  />
                </div>
                <div className="col-lg">
                  <button
                    type="button"
                    style={{ marginTop: "24px" }}
                    className="btn btn-primary ml-2"
                  >
                    Attachment
                  </button>
                </div>
              </div>

              {/* Row d tos one */}
              <ICustomTable ths={ths}>
                {toArray(rowDto)?.map((td, index) => {
                  return (
                    <tr key={index}>
                      <td> {td?.sl || index + 1} </td>
                      <td> {td?.itemCode} </td>
                      <td> {td?.itemName} </td>
                      <td> {td?.uomName} </td>
                      <td> {td?.purchaseDescription} </td>
                      <td> {td?.rfqQty} </td>
                      <td className="disable-border disabled-feedback">
                        <IInput
                          value={rowDto[index]?.rate}
                          type="number"
                          min="0"
                          required
                          onChange={(e) =>
                            rowDtoHandler("rate", e.target.value, index)
                          }
                          name="rate"
                        />
                      </td>
                      <td>
                        {" "}
                        {rowDto[index]?.rfqQty && rowDto[index]?.rate
                          ? +rowDto[index]?.rfqQty * +rowDto[index]?.rate
                          : 0}{" "}
                      </td>
                      <td className="disable-border disabled-feedback">
                        <IInput
                          value={rowDto[index]?.comments}
                          onChange={(e) =>
                            rowDtoHandler("comments", e.target.value, index)
                          }
                          name="comments"
                        />
                      </td>
                    </tr>
                  );
                })}
              </ICustomTable>

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
