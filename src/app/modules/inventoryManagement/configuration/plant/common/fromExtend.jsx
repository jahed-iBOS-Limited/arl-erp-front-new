import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  plantName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Warehouse is required"),
  plantCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Code is required"),
  plantAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(300, "Maximum 300 symbols")
    .required("Address is required"),
});

export default function FormExtend({
  product,
  btnRef,
  saveWarehouse,
  resetBtnRef,
  disableHandler,
  plantCode,
  plantName,
  accountId,
  selectedBusinessUnit,
  unit,
  rowDto,
  addHandler,
  id,
  remover,
  getGridData,
}) {
  useEffect(() => {
    getGridData(id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveWarehouse(values, () => {
            resetForm(product);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
           
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    value={values.plantName || ""}
                    name="plantName"
                    component={Input}
                    placeholder="Plant"
                    label="Plant"
                    disabled={!plantName}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.plantCode || ""}
                    name="plantCode"
                    component={Input}
                    placeholder="Code"
                    label="Code"
                    disabled={plantCode}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.plantAddress || ""}
                    name="plantAddress"
                    component={Input}
                    placeholder="Address"
                    label="Address"
                    disabled={!plantName}
                  />
                </div>

                <div className="col-lg-4">
                  <label>Business Unit Name</label>
                  <Field
                    name="businessUnitName"
                    component={() => (
                      <Select
                        value={values.businessUnitName}
                        options={unit}
                        placeholder="Business Unit Name"
                        onChange={(valueOption) => {
                          setFieldValue("businessUnitName", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        name="businessUnitName"
                      />
                    )}
                    placeholder="businessUnitName"
                    label="businessUnitName"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      marginTop: "0.25rem",
                      width: "100%",
                    }}
                    className="text-danger"
                  >
                    {touched &&
                    touched.businessUnitName &&
                    errors &&
                    errors.businessUnitName
                      ? errors.businessUnitName.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <button
                    onClick={() => {
                      const payload = {
                        plantId: +id,
                        accountId: accountId,
                        businessUnitId: values.businessUnitName?.value,
                        businessUnitName: values.businessUnitName?.label,
                        deleteId: values.businessUnitName?.value,
                      };
                      addHandler(payload);
                    }}
                    type="button"
                    className="btn btn-primary addBtn"
                    disabled={!values?.businessUnitName}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div>
                {rowDto?.length ? (
                  <table className="table table-striped table-bordered mt-2">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Business Unit</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto.map((itm, idx) => {
                        return (
                          <tr key={itm.businessUnitId}>
                            <td>{idx + 1}</td>
                            <td>{itm.businessUnitName}</td>
                            <td className="text-center">
                              <span onClick={() => remover(idx)}>
                                <i
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  ""
                )}
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
                onSubmit={() => resetForm(product)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
