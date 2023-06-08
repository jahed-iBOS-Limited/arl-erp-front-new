import React from "react";
import { Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function HeaderForm({
  customerDDL,
  productNameDDL,
  lcNoDDL,
  upozilaList,
  viewType,
  values,
  errors,
  touched,
  setFieldValue,
  handleSubmit,
  rowData,
}) {
  return (
    <Form className="form form-label-right mb-6">
      <div className="global-form">
        {/* Only For Create */}
        {viewType !== "view" && viewType !== "edit" ? (
          <div className="row">
            <div className="col-lg-3">
              <NewSelect
                name="lCno"
                label="Allotment Permission No"
                options={lcNoDDL}
                value={values?.lCno}
                onChange={(valueOption) => {
                  setFieldValue("lCno", valueOption);
                  setFieldValue(
                    "permissionDate",
                    _dateFormatter(valueOption?.allotmentRefDate)
                  );
                  setFieldValue("permissionNo", valueOption?.allotmentRefNo);
                }}
                errors={errors}
                touched={touched}
                isDisabled={rowData?.length > 0}
              />
            </div>
          </div>
        ) : null}

        <div className="row">
          <div className="col-lg-3">
            <label>From Date</label>
            <InputField
              value={values?.fromDate}
              placeholder="From Date"
              name="fromDate"
              type="date"
              touched={touched}
              disabled={viewType}
            />
          </div>
          <div className="col-lg-3">
            <label>To Date</label>
            <InputField
              value={values?.toDate}
              placeholder="To Date"
              name="toDate"
              type="date"
              touched={touched}
              disabled={viewType}
            />
          </div>
          <div className="col-lg-3">
            <NewSelect
              name="customer"
              label="Customer"
              options={customerDDL || []}
              value={values?.customer}
              onChange={(valueOption) => {
                setFieldValue("customer", valueOption);
                setFieldValue(
                  "upozila",
                  valueOption?.upozilaName
                    ? {
                        value: valueOption?.upozilaId || 0,
                        label: valueOption?.upozilaName || "",
                      }
                    : ""
                );
              }}
              errors={errors}
              touched={touched}
              isDisabled={viewType}
            />
          </div>
          <div className="col-lg-3">
            <NewSelect
              name="upozila"
              label="Zone"
              options={upozilaList || []}
              value={values?.upozila}
              onChange={(valueOption) => {
                setFieldValue("upozila", valueOption);
              }}
              errors={errors}
              touched={touched}
              isDisabled={viewType}
            />
          </div>
          <div className="col-lg-3">
            <NewSelect
              name="productName"
              label="Product Name"
              options={productNameDDL || []}
              value={values?.productName}
              onChange={(valueOption) => {
                setFieldValue("productName", valueOption);
                setFieldValue("uomName", valueOption?.uomName);
              }}
              errors={errors}
              touched={touched}
              isDisabled={viewType === "view"}
            />
          </div>
          <div className="col-lg-3">
            <label>Uom Name</label>
            <InputField
              value={values?.uomName}
              placeholder="Uom Name"
              name="uomName"
              type="text"
              touched={touched}
              disabled={true}
            />
          </div>
          <div className="col-lg-3">
            <label>Alloted Qnt</label>
            <InputField
              value={values?.allotedQnt}
              placeholder="Alloted Qnt"
              name="allotedQnt"
              type="number"
              onChange={(e) => {
                setFieldValue("allotedQnt", e.target.value);
                setFieldValue(
                  "grandTotal",
                  Number(e.target.value * Number(values?.rate))
                );
              }}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>
          <div className="col-lg-3">
            <label>Rate</label>
            <InputField
              value={values?.rate}
              placeholder="Rate"
              name="rate"
              type="number"
              onChange={(e) => {
                setFieldValue("rate", e.target.value);
                setFieldValue(
                  "grandTotal",
                  Number(e.target.value * Number(values?.allotedQnt))
                );
              }}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>
          <div className="col-lg-3">
            <label>Grand Total</label>
            <InputField
              value={values?.grandTotal}
              placeholder="Grand Total"
              name="grandTotal"
              type="number"
              touched={touched}
              disabled={true}
            />
          </div>
          <div className="col-lg-3">
            <label>Remarks</label>
            <InputField
              value={values?.remarks}
              placeholder="Remarks"
              name="remarks"
              type="text"
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>
          <div className="col-lg-3">
            <label>Permission No</label>
            <InputField
              value={values?.permissionNo}
              placeholder="Permission No"
              name="permissionNo"
              type="text"
              touched={touched}
              disabled={true}
            />
          </div>
          <div className="col-lg-3">
            <label>Permission Date</label>
            <InputField
              value={values?.permissionDate}
              placeholder="Permission Date"
              name="permissionDate"
              type="date"
              touched={touched}
              disabled={true}
            />
          </div>

          {viewType !== "view" && viewType !== "edit" ? (
            <div className="col-lg-12 mt-2 d-flex justify-content-end">
              <div>
                <button
                  disabled={!values?.lCno}
                  onClick={() => {
                    handleSubmit();
                  }}
                  type="button"
                  className="btn btn-primary"
                >
                  <i className="fas fa-plus"></i>
                  Add
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Form>
  );
}
