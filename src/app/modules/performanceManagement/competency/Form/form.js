import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../_helper/_input";
import ICustomTable from "../../../_helper/_customTable";
import { ISelect } from "../../../_helper/_inputDropDown";
import ITooltip from "../../../_helper/_tooltip";
import IDelete from "../../../_helper/_helperIcons/_delete";
import MeasuringScale from "../../_helper/_measuringScale";
const headers = ["SL", "Demonstrated Behaviour", "Type", "Action"];

// Validation schema
const validationSchema = Yup.object().shape({
  competencyType: Yup.object().shape({
    label: Yup.string().required("Competency type is required"),
    value: Yup.string().required("Competency type is required"),
  }),
  competencyName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Competency name is required"),
  competencyDefinition: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Competency definition is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  empDDL,
  isEdit,
  setter,
  remover,
  rowDto,
  rowDtoTwo,
  rowDtoHandler,
  setRowDto,
  id,
}) {
  const [valid, setValid] = useState(true);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            // if id is present, we dont need to reset form
            if (!id) {
              resetForm(initData);
            }
            setValid(true);
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
            {disableHandler(!isValid || !valid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <ISelect
                    label="Select competency type"
                    options={[
                      { value: true, label: "Core competency" },
                      { value: false, label: "Functional competency" },
                    ]}
                    defaultValue={values.competencyType}
                    name="competencyType"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    placeholder="Competency type"
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-4">
                  <IInput
                    value={values.competencyName}
                    label="Competency name"
                    name="competencyName"
                  />
                </div>

                <div className="col-lg-4">
                  <IInput
                    value={values.competencyDefinition}
                    label="Competency definition"
                    name="competencyDefinition"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4 mt-4">
                  {/* table */}
                  {rowDtoTwo.length > 0 && (
                    <div>
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>Employee Cluster</th>
                            <th>
                              Desired Value
                              <ITooltip content={() => <MeasuringScale />} />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDtoTwo?.map((td, index) => {
                            return (
                              <tr key={index}>
                                <td style={{ textAlign: "left" }}>
                                  {td.employeeCompetencyClusterName ||
                                    td.employeeClusterName}
                                </td>
                                <td className="align-middle disable-border disabled-feedback">
                                  <IInput
                                    value={rowDtoTwo[index]?.desiredValue}
                                    placeholder="Desired value"
                                    required
                                    min="1"
                                    name="desiredValue"
                                    type="number"
                                    onChange={(e) => {
                                      rowDtoHandler(
                                        "desiredValue",
                                        e.target.value,
                                        index
                                      );
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* row dto header */}
              <div className="row my-3">
                <div className="col-lg-10 disable-border disabled-feedback">
                  <IInput
                    value={values.demonstratedBehaviour || ""}
                    label="Demonstrated behaviour"
                    name="demonstratedBehaviour"
                  />
                </div>
                <div
                  style={{ marginTop: "24px" }}
                  className="col-lg-1 disable-border disabled-feedback"
                >
                  <label className="mr-1">Is Positive</label>
                  <input
                    style={{ transform: "translateY(3px)" }}
                    type="checkbox"
                    checked={values?.isPositive}
                    name="isPositive"
                    onChange={(e) =>
                      setFieldValue("isPositive", e.target.checked)
                    }
                  />
                </div>
                <div className="col-lg-1">
                  <button
                    type="button"
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary ml-2"
                    onClick={() => {
                      setter(values);
                      setFieldValue("demonstratedBehaviour", "");
                    }}
                    disabled={!values?.demonstratedBehaviour}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Row d tos */}
              {rowDto.length > 0 && (
                <ICustomTable ths={headers}>
                  {rowDto?.map((td, index) => {
                    return (
                      <tr key={index}>
                        <td className="align-middle text-center">
                          {" "}
                          {index + 1}{" "}
                        </td>
                        <td className="align-middle">
                          {td.demonstratedBehaviour}
                        </td>
                        <td className="align-middle text-center">
                          {td?.isPositive ? "Positive" : "Negative"}
                        </td>
                        <td className="align-middle text-center">
                          <IDelete
                            remover={remover}
                            id={td?.demonstratedBehaviour}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </ICustomTable>
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
