import { Field, Form, Formik } from "formik";
import React from "react";
import Select from "react-select";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import customStyles from "../../../../selectCustomStyle";

// Validation schema
const validationSchema = Yup.object().shape({
  routeAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Address is required"),
  routeName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Route Name Name is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  TZDDL,
  isEdit,
  id,
  setter,
  rowDto,
  remover,
  objHeader,
  objRow,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          initData,
          routeName: objHeader?.routeName || "",
          routeAddress: objHeader?.routeAddress || "",
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
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right global-form">
              {!id ? (
                <div className="form-group row">
                  <div className="col-lg-4">
                    <Field
                      value={values.routeName || ""}
                      name="routeName"
                      component={Input}
                      placeholder="Route Name"
                      label="Route Name"
                      disabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-4">
                    <Field
                      value={values.routeAddress || ""}
                      name="routeAddress"
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
                        value={values.routeName || ""}
                        name="routeName"
                        component={Input}
                        placeholder="Route Name"
                        label="Route Name"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <Field
                        value={values.routeAddress || ""}
                        name="routeAddress"
                        component={Input}
                        disabled={isEdit}
                        placeholder="Address"
                        label="Address"
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Transport Zone</label>
                      <Field
                        name="transportZone"
                        placeholder="Transport Zone"
                        component={() => (
                          <Select
                            options={TZDDL}
                            placeholder="Transport Zone"
                            defaultValue={values.transportZone}
                            onChange={(valueOption) => {
                              setFieldValue("transportZone", valueOption);
                            }}
                            isSearchable={true}
                            styles={customStyles}
                          />
                        )}
                      />
                    </div>
                    <div className="col-lg-3">
                      <button
                        onClick={() =>
                          setter({
                            transportZoneId: values?.transportZone?.value,
                            transportZoneName: values?.transportZone?.label,
                          })
                        }
                        disabled={!values?.transportZone?.value}
                        style={{ marginTop: "19px" }}
                        type="button"
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                    </div>
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

            {id && (
              <div
                className="form-group row px-4 table-responsive"
                style={{ marginTop: "25px" }}
              >
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th scope="col">SL</th>
                      <th scope="col">Transport Zone</th>
                      <th scope="col">Actione</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto.map((itm, idx) => (
                      <tr key={itm.value}>
                        <td className="text-center">{idx + 1}</td>
                        <td>{itm.transportZoneName}</td>
                        <td className="text-center">
                          <span onClick={() => remover(itm.transportZoneId)}>
                            <IDelete />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Formik>
    </>
  );
}
