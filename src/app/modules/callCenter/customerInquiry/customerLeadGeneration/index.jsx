import React from "react";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../_helper/_customCard";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";

const validationSchema = Yup.object().shape({
  statusAndStage: Yup.string().required("Status & Stage  is required"),
  division: Yup.object().shape({
    value: Yup.number().required("Division is required"),
    label: Yup.string().required("Division is required"),
  }),
  district: Yup.object().shape({
    value: Yup.number().required("District is required"),
    label: Yup.string().required("District is required"),
  }),
  thana: Yup.object().shape({
    value: Yup.number().required("Thana is required"),
    label: Yup.string().required("Thana is required"),
  }),
  fromDate: Yup.string().required("From Date is required"),
  toDate: Yup.string().required("To Date is required"),
});

export default function CustomerLeadGeneration() {
  let history = useHistory();
  const formikRef = React.useRef(null);
  const saveHandler = (values, cb) => {};

  return (
    <ICustomCard
      title="Customer Lead Generation"
      createHandler={() => {
        history.push(
          "/call-center-management/customer-inquiry/customerleadgeneration/create"
        );
      }}
      backHandler={() => {
        history.goBack();
      }}
      resetHandler={() => {
        formikRef.current.resetForm();
      }}
    >
      <Formik
        enableReinitialize={true}
        initialValues={{
          statusAndStage: "",
          division: "",
          district: "",
          thana: "",
          fromDate: "",
          toDate: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            {/* <h1>
                            {JSON.stringify(errors)}
                        </h1> */}
            <Form className="form form-label-right">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "10px",
                }}
              >
                <div className="form-group row global-form">
                  {/* name */}
                  <div className="col-lg-3">
                    <InputField
                      label="Status & Stage"
                      type="text"
                      name="statusAndStage"
                      value={values?.statusAndStage}
                      onChange={(e) => {
                        setFieldValue("statusAndStage", e.target.value);
                      }}
                    />
                  </div>

                  {/* division */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Division"}
                      options={[]}
                      value={values?.division}
                      name="division"
                      onChange={(valueOption) => {
                        setFieldValue("division", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* district */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"District"}
                      options={[]}
                      value={values?.district}
                      name="district"
                      onChange={(valueOption) => {
                        setFieldValue("district", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* thana */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Thana"}
                      options={[]}
                      value={values?.thana}
                      name="thana"
                      onChange={(valueOption) => {
                        setFieldValue("thana", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* from date */}
                  <div className="col-lg-3">
                    <InputField
                      label="From Date"
                      type="date"
                      name="fromDate"
                      value={values?.fromDate}
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  {/* to date */}
                  <div className="col-lg-3">
                    <InputField
                      label="To Date"
                      type="date"
                      name="toDate"
                      value={values?.toDate}
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button type="submit" className="btn btn-primary  mt-6">
                      Show
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>IHB Name</th>
              <th>IHB Contact</th>
              <th>IHB Email </th>
              <th>No. of Storeys</th>
              <th>Project Status</th>
              <th>Inquiry Quantity</th>
              <th>District Name</th>
              <th>Transport Zone</th>
              <th>Area</th>
              <th>Territory</th>
              <th>Stage</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </ICustomCard>
  );
}
