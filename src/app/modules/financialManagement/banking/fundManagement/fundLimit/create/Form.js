import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import InputField from "../../../../../_helper/_inputField";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import { getBankDDL, getFacilityDLL, getFundLimitById } from "../../helper";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { shallowEqual, useSelector } from "react-redux";

const fundLimit = Yup.object().shape({
  limit: Yup.string().required("Limit is required"),
  bank: Yup.object()
    .shape({
      label: Yup.string().required("Bank is required"),
      value: Yup.string().required("Bank is required"),
    })
    .nullable(),
  facility: Yup.object()
    .shape({
      label: Yup.string().required("Facility is required"),
      value: Yup.string().required("Facility is required"),
    })
    .nullable(),
});

export default function LimitForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  landingRowData,
}) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [bankDDL, setBankDDL] = useState([]);
  const [facilityDDL, setFacilityDDL] = useState([]);
  const [singleData, setSingleData] = useState({});
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  useEffect(() => {
    getBankDDL(setBankDDL, setLoading);
    getFacilityDLL(selectedBusinessUnit?.value, 0, setFacilityDDL, setLoading);
  }, []);
  useEffect(() => {
    if (isEdit) {
      getFundLimitById(isEdit, setSingleData, setLoading);
    }
  }, [isEdit]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? {
                ...singleData,
                tenorDays: landingRowData?.tenureDays || "",
                sanctionReference: landingRowData?.sanctionReference || "",
                limitExpiryDate:
                  _dateFormatter(landingRowData?.limitExpiryDate) || "",
              }
            : initData
        }
        validationSchema={fundLimit}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            history.push("/financial-management/banking/fund-limit");
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
            {loading && <Loading />}
            <Form className="form form-label-right">
              <div className="row global-form h-100">
                <div className="col-lg-4">
                  <NewSelect
                    name="bank"
                    options={bankDDL}
                    value={values?.bank}
                    onChange={(valueOption) => {
                      setFieldValue("bank", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                    label="Bank"
                    placeholder="Bank"
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="facility"
                    options={facilityDDL}
                    value={values?.facility}
                    onChange={(valueOption) => {
                      setFieldValue("facility", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    // isDisabled={isEdit}
                    label="Facility"
                    placeholder="Facility"
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Limit</label>
                  <InputField
                    value={values?.limit}
                    name="limit"
                    placeholder="Limit"
                    onChange={(e) => {
                      if (isEdit) {
                        if (e?.target?.value >= 0) {
                          setFieldValue("limit", e?.target?.value);
                        } else {
                          setFieldValue("limit", "");
                        }
                      } else {
                        if (e.target.value > 0) {
                          setFieldValue("limit", e.target.value);
                        } else {
                          setFieldValue("limit", "");
                        }
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Updated Date</label>
                  <InputField
                    value={values?.updatedDate}
                    name="updatedDate"
                    placeholder="Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Tenor Days</label>
                  <InputField
                    value={values?.tenorDays}
                    name="tenorDays"
                    placeholder="Tenor Days"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue("tenorDays", e.target.value);
                      } else {
                        setFieldValue("tenorDays", "");
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                    // disabled={isEdit}
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Sanction Reference</label>
                  <InputField
                    value={values?.sanctionReference}
                    name="sanctionReference"
                    placeholder="Sanction Reference"
                    onChange={(e) => {
                      setFieldValue("sanctionReference", e.target.value);
                    }}
                    type="string"
                    step="any"
                    // disabled={isEdit}
                  />
                </div>
                <div className="col-lg-2">
                  <label>Limit Expiry Date</label>
                  <InputField
                    value={values?.limitExpiryDate}
                    name="limitExpiryDate"
                    placeholder="Limit Expiry Date"
                    type="date"
                    // disabled={isEdit}
                  />
                </div>
                {/* 
                <div className="col-lg-2 ">
                  <label>Interest Rate</label>
                  <InputField
                    value={values?.rate}
                    name="rate"
                    placeholder="Interest Rate"
                    onChange={(e) => {
                      setFieldValue("rate", e?.target?.value);
                    }}
                    type="number"
                    min="0"
                    step="any"
                  />
                </div>

                <div className="col-lg-2 ">
                  <label>Rate Review</label>
                  <InputField
                    value={values?.rateReview}
                    name="rateReview"
                    placeholder="Rate Review"
                    onChange={(e) => {
                      setFieldValue("rateReview", e?.target?.value);
                    }}
                    type="number"
                    min="0"
                    step="any"
                  />
                </div>
                <div className="col-lg-2 ">
                  <label>Remarks</label>
                  <InputField
                    value={values?.remarks}
                    name="remarks"
                    placeholder="Remarks"
                    onChange={(e) => {
                      setFieldValue("remarks", e?.target?.value);
                    }}
                    type="number"
                    min="0"
                    step="any"
                  />
                </div> */}
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
