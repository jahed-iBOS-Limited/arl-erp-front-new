import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  rosterGroupName: Yup.string()
    .min(2, "Minimum 2 strings")
    .max(100, "Maximum 100 strings"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  calenderList,
  rowDto,
  setRowDto,
  remover,
  isEdit,
  setter,
  employeeList,
}) {
  

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
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
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Holiday Group Name</label>
                    <InputField
                      value={values?.holidayGroupName}
                      name="holidayGroupName"
                      placeholder="Holiday Group Name"
                      type="text"
                      disabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-9"></div>
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      disabled={isEdit}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      disabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Description</label>
                    <InputField
                      value={values?.description}
                      name="description"
                      placeholder="Description"
                      type="text"
                      disabled={isEdit}
                    />
                  </div>
                  <div style={{ marginTop: "14px" }} className="col-lg">
                    <button
                      disabled={
                        !values?.holidayGroupName ||
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.description
                      }
                      className="btn btn-primary"
                      onClick={() => {
                        const uniq = {
                          ...values,
                          fromDate: values?.fromDate,
                          toDate: values?.toDate,
                          description: values?.description,
                        };
                        setter(uniq, setRowDto);
                      }}
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* RowDto */}

              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="text-center">
                        {_dateFormatter(item?.fromDate)}
                      </td>
                      <td className="text-center">
                        {_dateFormatter(item?.toDate)}
                      </td>
                      <td>{item?.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
