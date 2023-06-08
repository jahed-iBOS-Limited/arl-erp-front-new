import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import InputField from "../../../../../_helper/_inputField";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import { getBankDDL, getFacilityDLL, getFundLimitById } from "../../helper";

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
}) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [bankDDL, setBankDDL] = useState([]);
  const [facilityDDL, setFacilityDDL] = useState([]);
  const [singleData, setSingleData] = useState({});

  useEffect(() => {
    getBankDDL(setBankDDL, setLoading);
    getFacilityDLL(setFacilityDDL, setLoading);
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
        initialValues={isEdit ? singleData : initData}
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
                    isDisabled={isEdit}
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
