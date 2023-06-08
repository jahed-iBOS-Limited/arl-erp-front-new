import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";

// Validation schema
const validationSchema = Yup.object().shape({
  address: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Address is required"),
  shipPointName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Shipping Point Name is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  warehouseDDL,
  isEdit,
  id,
  setter,
  addHandler,
  rowDto,
  remover,
  objHeader,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          initData,
          shipPointName: objHeader?.shipPointName || "",
          address: objHeader?.address || "",
        }}
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
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              {!id ? (
                <div className="form-group row">
                  <div className="col-lg-4">
                    <Field
                      value={values.shipPointName || ""}
                      name="shipPointName"
                      component={Input}
                      placeholder="Shipping Point Name"
                      label="Shipping Point Name"
                      disabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-4">
                    <Field
                      value={values.address || ""}
                      name="address"
                      component={Input}
                      disabled={isEdit}
                      placeholder="Address"
                      label="Address"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="form-group row">
                    <div className="col-lg-3">
                      <Field
                        value={values.shipPointName || ""}
                        name="shipPointName"
                        component={Input}
                        placeholder="Shipping Point"
                        label="Shipping Point Name"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <Field
                        value={values.address || ""}
                        name="address"
                        component={Input}
                        disabled={isEdit}
                        placeholder="Address"
                        label="Address"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Warehouse</label>
                      <Field
                        name="warehouse"
                        placeholder="Warehouse"
                        component={() => (
                          <Select
                            options={warehouseDDL}
                            placeholder="Warehouse"
                            value={values.warehouse}
                            onChange={(valueOption) => {
                              setFieldValue("warehouse", valueOption);
                            }}
                            isSearchable={true}
                            styles={customStyles}
                          />
                        )}
                      />
                    </div>
                    {console.log(values)}
                    <div className="col-lg-3">
                      <button
                        onClick={() => {
                          const payload = {
                            wearHouseId: values.warehouse.value,
                            wearHouseName: values.warehouse.label,
                            deleteId: values.warehouse.value,
                          };
                          addHandler(payload);
                        }}
                        style={{ marginTop: "25px" }}
                        type="button"
                        className="btn btn-primary addBtn ml-2"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div
                    className="form-group row "
                    style={{ marginTop: "25px" }}
                  >
                    <table className="table table-striped table-bordered table table-head-custom table-vertical-center">
                      <thead>
                        <tr>
                          <th scope="col">SL</th>
                          <th scope="col">Warehouse</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto.map((itm, idx) => (
                          <tr key={itm.value}>
                            <td className="text-center">{idx + 1}</td>
                            <td>{itm.wearHouseName}</td>
                            <td className="text-center">
                              <i
                                className="fa fa-trash "
                                onClick={() => remover(itm.deleteId)}
                              ></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
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
