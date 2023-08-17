import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import IViewModal from "../../../_helper/_viewModal";
import IEdit from "../../../_helper/_helperIcons/_edit";

const initData = {
  sbu: "",
  year: "",
  gl: "",
  subGl: "",
  glType: "",
  standardValue: "",
};

// const validationSchema = Yup.object().shape({
//   item: Yup.object()
//     .shape({
//       label: Yup.string().required("Item is required"),
//       value: Yup.string().required("Item is required"),
//     })
//     .typeError("Item is required"),

//   remarks: Yup.string().required("Remarks is required"),
//   amount: Yup.number().required("Amount is required"),
//   date: Yup.date().required("Date is required"),
// });

export default function ManufacturingOverheadPlanLanding() {
  const [objProps, setObjprops] = useState({});
  const [isShowModal, setisShowModal] = useState(false);

  const saveHandler = (values, cb) => {
    alert("Working...");
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={validationSchema}
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
          {false && <Loading />}
          <IForm title="Manufacturing Overhead Plan" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="sbu"
                    options={[
                      { value: 1, label: "Item-1" },
                      { value: 2, label: "Item-2" },
                    ]}
                    value={values?.sbu}
                    label="SBU"
                    onChange={(valueOption) => {
                      setFieldValue("sbu", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="year"
                    options={[
                      { value: 1, label: "Item-1" },
                      { value: 2, label: "Item-2" },
                    ]}
                    value={values?.year}
                    label="Year"
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="gl"
                    options={[
                      { value: 1, label: "Item-1" },
                      { value: 2, label: "Item-2" },
                    ]}
                    value={values?.gl}
                    label="GL Name"
                    onChange={(valueOption) => {
                      setFieldValue("gl", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="subGl"
                    options={[
                      { value: 1, label: "Item-1" },
                      { value: 2, label: "Item-2" },
                    ]}
                    value={values?.subGl}
                    label="SUB GL"
                    onChange={(valueOption) => {
                      setFieldValue("subGl", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="glType"
                    options={[
                      { value: 1, label: "Item-1" },
                      { value: 2, label: "Item-2" },
                    ]}
                    value={values?.glType}
                    label="GL Type"
                    onChange={(valueOption) => {
                      setFieldValue("glType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.standardValue}
                    label="Standard Value"
                    name="standardValue"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("standardValue", e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered  global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Code</th>
                        <th>Sub GL Name</th>
                        <th>Overhead Type</th>
                        <th>Standard Value Per Unit/Montly</th>
                        <th>Add Details</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1]?.map((item, index) => (
                        <tr key={index}>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td><div>
                            <IEdit/>
                            </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
          <IViewModal show={isShowModal} onHide={() => setisShowModal(false)}>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Code</th>
                  <th>Sub GL Name</th>
                  <th>Overhead Type</th>
                  <th>Standard Value Per Unit/Montly</th>
                  <th>Add Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[1]?.map((item, index) => (
                  <tr key={index}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </IViewModal>
        </>
      )}
    </Formik>
  );
}
