import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
// import NewSelect from "../../../../_helper/_select";
// import { getBusinessUnitPermissionbyUser } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  numObeyRadius: Yup.string().required("Obey Radius is required"),
  // businessUnit: Yup.object().shape({
  //   value: Yup.string().required("Business Unit is required"),
  //   label: Yup.string().required("Business Unit is required"),
  // }),
});

const editvalidationSchema = Yup.object().shape({
  numObeyRadius: Yup.string().required("Obey Radius is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  profileData,
  selectedBusinessUnit,
  isEdit,
}) {
  // business unit DDL
  // const [businessUnit, setBusinessUnit] = useState();
  // useEffect(() => {
  //   getBusinessUnitPermissionbyUser(
  //     profileData?.userId,
  //     profileData?.accountId,
  //     setBusinessUnit
  //   );
  // }, [profileData, selectedBusinessUnit]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? editvalidationSchema : validationSchema}
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
          setFieldValue,
          isValid,
          errors,
          touched,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnit}
                    value={values?.businessUnit}
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                    }}
                    placeholder="Business Unit"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div> */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.numObeyRadius}
                    label="Obey Radius (Meter)"
                    name="numObeyRadius"
                    placeholder="Obey Radius (Meter)"
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
