import React from "react";
import { Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

export default function RowForm({
  customerDDL,
  index,
  productNameDDL,
  upozilaList,
  values,
  errors,
  touched,
  setFieldValue,
  removeHandler,
}) {
  return (
    <Form className="form form-label-right">
      <div className="global-form partnerProductAllocation-row">
        <div className="partnerProductAllocation-row-delete-btn">
          <button
            onClick={() => removeHandler(index)}
            type="button"
            className="btn btn-danger px-2 py-1 d-flex justify-content-center align-items-center"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <label>From Date</label>
            <InputField
              value={values?.fromDate}
              placeholder="From Date"
              name={`${index + "fromDate"}`}
              type="date"
              touched={touched}
              disabled={true}
            />
          </div>
          <div className="col-lg-3">
            <label>To Date</label>
            <InputField
              value={values?.toDate}
              placeholder="To Date"
              name={`${index + "toDate"}`}
              type="date"
              touched={touched}
              disabled={true}
            />
          </div>
          <div className="col-lg-3">
            <NewSelect
              name={`${index + "customer"}`}
              label="Customer"
              options={customerDDL || []}
              value={values?.customer}
              onChange={(valueOption) => {
                setFieldValue("customer", valueOption);
              }}
              errors={errors}
              touched={touched}
              isDisabled={true}
            />
          </div>
          <div className="col-lg-3">
            <NewSelect
              name={`${index + "upozila"}`}
              label="Zone"
              options={upozilaList || []}
              value={values?.upozila}
              onChange={(valueOption) => {
                setFieldValue("upozila", valueOption);
              }}
              errors={errors}
              touched={touched}
              isDisabled={true}
            />
          </div>
          <div className="col-lg-3">
            <NewSelect
              name={`${index + "productName"}`}
              label="Product Name"
              options={productNameDDL || []}
              value={values?.productName}
              onChange={(valueOption) => {
                setFieldValue("productName", valueOption);
                setFieldValue("uomName", valueOption?.uomName);
              }}
              errors={errors}
              touched={touched}
              isDisabled={true}
            />
          </div>
          <div className="col-lg-3">
            <label>Uom Name</label>
            <InputField
              value={values?.uomName}
              placeholder="Uom Name"
              name={`${index + "uomName"}`}
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
              name={`${index + "allotedQnt"}`}
              type="number"
              onChange={(e) => {
                setFieldValue("allotedQnt", e.target.value);
                setFieldValue(
                  "grandTotal",
                  Number(e.target.value * Number(values?.rate))
                );
              }}
              touched={touched}
              disabled={true}
            />
          </div>
          <div className="col-lg-3">
            <label>Rate</label>
            <InputField
              value={values?.rate}
              placeholder="Rate"
              name={`${index + "rate"}`}
              type="number"
              onChange={(e) => {
                setFieldValue("rate", e.target.value);
                setFieldValue(
                  "grandTotal",
                  Number(e.target.value * Number(values?.allotedQnt))
                );
              }}
              touched={touched}
              disabled={true}
            />
          </div>
          <div className="col-lg-3">
            <label>Grand Total</label>
            <InputField
              value={values?.grandTotal}
              placeholder="Grand Total"
              name={`${index + "grandTotal"}`}
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
              name={`${index + "remarks"}`}
              type="text"
              touched={touched}
              disabled={true}
            />
          </div>
          <div className="col-lg-3">
            <label>Permission No</label>
            <InputField
              value={values?.permissionNo}
              placeholder="Permission No"
              name={`${index + "permissionNo"}`}
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
              name={`${index + "permissionDate"}`}
              type="date"
              touched={touched}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </Form>
  );
}
