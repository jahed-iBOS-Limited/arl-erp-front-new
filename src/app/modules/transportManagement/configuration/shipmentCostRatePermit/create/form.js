import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getEmployeeDDL } from "../helper";
import NewSelect from "./../../../../_helper/_select";
import { GetAllowModificationEmployeeInfo_api } from "./../helper";

// Validation schema for bank transfer
const validationSchema = Yup.object().shape({
  employeeName: Yup.object().shape({
    label: Yup.string().required("EmployeeName is required"),
    value: Yup.string().required("EmployeeName is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  selectedBusinessUnit,
  profileData,
}) {
  const [employeeDDL, setEmployeeDDL] = useState([]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getEmployeeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setEmployeeDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
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
          setValues,
        }) => (
          <>
          {console.log(values)}
            <Form className="global-form from-label-right">
              <div className="form-group row align-items-center">
                <div className="col-lg-3">
                  <NewSelect
                    name="employeeName"
                    options={employeeDDL || []}
                    value={values?.employeeName}
                    label="EmployeeName"
                    onChange={(valueOption) => {
                      setFieldValue("employeeName", valueOption);
                      const modifyValues = {
                        ...values,
                        employeeName: valueOption,
                      };
                      GetAllowModificationEmployeeInfo_api(
                        valueOption?.value,
                        setValues,
                        modifyValues
                      );
                    }}
                    placeholder="EmployeeName"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>

                <div className="col-lg-2 ">
                  <label for="ysnGhatInfo">Ghat Permission</label>
                  <Field
                    name="ysnGhatInfo"
                    type="checkbox"
                    className="checkbox ml-3"
                    checked={values?.ysnGhatInfo}
                    onChange={(e) => {
                      setFieldValue("ysnGhatInfo", e.target.checked);
                    }}
                    id="ysnGhatInfo"
                  />
                </div>
                <div className="col-lg-2 ">
                  <label for="ysnTransportZoneInfo">
                    TransportZone Permission
                  </label>
                  <Field
                    name="ysnTransportZoneInfo"
                    type="checkbox"
                    className="checkbox ml-3"
                    checked={values?.ysnTransportZoneInfo}
                    onChange={(e) => {
                      setFieldValue("ysnTransportZoneInfo", e.target.checked);
                    }}
                    id="ysnTransportZoneInfo"
                  />
                </div>
                <div className="col-lg-2 ">
                  <label for="itemInfo">Item Permission</label>
                  <Field
                    name="ysnItemInfo"
                    type="checkbox"
                    className="checkbox ml-3"
                    checked={values?.ysnItemInfo}
                    onChange={(e) => {
                      setFieldValue("ysnItemInfo", e.target.checked);
                    }}
                    id="ysnItemInfo"
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
