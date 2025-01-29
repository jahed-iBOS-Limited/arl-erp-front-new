import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getBusinessUnitDDL } from "../../../report/balanceReport/helper";
import NewSelect from "../../../../_helper/_select";
// Validation schema
const validationSchema = Yup.object().shape({
  currentPeriodEndDate: Yup.string().required("Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  accountId,
}) {
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const { handleSubmit, resetForm, values, setFieldValue } = useFormik({
    initialValues: initData,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      saveHandler(values, () => {
        resetForm(initData);
      });
    },
  });
  useEffect(() => {
    getBusinessUnitDDL(accountId, (businessUnitDDLData) => {
      setBusinessUnitDDL(businessUnitDDLData);
    });
  }, [accountId]);
  return (
    <>
      <>
        <div className="form global-form form-label-right">
          <div className="row">
            <div className="col-md-3">
              <NewSelect
                name="businessUnit"
                options={businessUnitDDL}
                value={values?.businessUnit}
                label="Business Unit"
                onChange={(valueOption) => {
                  setFieldValue("businessUnit", valueOption);
                }}
                placeholder="Business Unit"
              />
            </div>
            <div className="col-md-3">
              <div>From Date</div>
              <input
                className="form-control trans-date cj-landing-date"
                value={values?.fromDate}
                name="fromDate"
                onChange={(e) => {
                  setFieldValue("fromDate", e.target.value);
                }}
                type="date"
              />
            </div>
            <div className="col-md-3">
              <div>To Date</div>
              <input
                className="form-control trans-date cj-landing-date"
                value={values?.toDate}
                name="fromDate"
                onChange={(e) => {
                  setFieldValue("toDate", e.target.value);
                }}
                type="date"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
             <div className="table-responsive">
             <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm">
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
              </table>
             </div>
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
        </div>
      </>
    </>
  );
}
