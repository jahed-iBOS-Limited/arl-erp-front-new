import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../../_helper/_inputField";
import CashRegisterReportTable from "../Table/table";
import { getBusinessUnitDDL, getCashRegisterReport } from "./helper";

const validationSchema = Yup.object().shape({});

export default function 
_Form({ initData }) {
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    getBusinessUnitDDL(profileData?.accountId, setBusinessUnitDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitDDL || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                    }}
                    placeholder="Business Unit"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      min={values?.fromDate}
                      onChange={(e) => {
                        setFieldValue("toDate", e?.target?.value);
                      }}
                    />
                  </div>
                <div style={{ marginTop: "18px" }}>
                  <button
                    type="button"
                    disabled={!values?.businessUnit||!values?.fromDate ||!values?.toDate}
                    onClick={() => {
                      getCashRegisterReport({
                        fromDate: values?.fromDate,
                        toDate: values?.toDate,
                        buId: values?.businessUnit?.value,
                        setter: setRowDto,
                      });
                    }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
              </div>
              <div>
                <CashRegisterReportTable rowDto = {rowDto} />
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
