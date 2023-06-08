import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../_helper/_input";
import IDelete from "../../../_helper/_helperIcons/_delete";
import MeasuringScale from "../../_helper/_measuringScale";
import ICustomTable from "../../../_helper/_customTable";
import { useDispatch } from "react-redux";
import { getCoreValuesById } from "../_redux/Actions";

const headers = ["SL", "Demonstrated Behaviour", "Type", "Action"];

// Validation schema
const validationSchema = Yup.object().shape({
  coreValueName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Core value name is required"),
  coreValueDefinition: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Core value definition is required"),
  numDesiredValue: Yup.number()
    .min(0, "Minimum 0")
    .max(1000, "Maximum 1000")
    .required("Desired value is required"),
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
  id,
  rowDtoHandler
}) {
  const [valid, setValid] = useState(true);
  const dispatch = useDispatch();
  
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            if (!id) {
              resetForm(initData);
            } else {
              dispatch(getCoreValuesById(id));
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
            {console.log(values)}
            {disableHandler(!isValid || !valid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <IInput
                    value={values?.coreValueName}
                    label="Core value name"
                    name="coreValueName"
                    // disabled={isEdit}
                  />
                </div>

                <div className="col-lg-4">
                  <IInput
                    value={values?.coreValueDefinition}
                    label="Core value definition"
                    name="coreValueDefinition"
                    // disabled={isEdit}
                  />
                </div>

                <div className="col-lg-4">
                  <IInput
                    value={values?.numDesiredValue}
                    label="Desired value"
                    name="numDesiredValue"
                    type="number"
                    min="0"
                    isInfo={true}
                    content={() => <MeasuringScale />}
                    // disabled={isEdit}
                  />
                </div>
              </div>

              <div className="row my-3">
                <div className="col-lg-10 disable-border disabled-feedback">
                  <IInput
                    value={values?.demonstratedBehaviour}
                    label="Demonstrated behaviour"
                    name="demonstratedBehaviour"
                  />
                </div>
                <div style={{marginTop: "24px"}} className="col-lg-1 disable-border disabled-feedback">
                  <label className="mr-1">Is Positive</label>
                  <input
                    style={{transform: "translateY(3px)"}}
                    type="checkbox"
                    checked={values?.isPositive}
                    name="isPositive"
                    onChange={e => setFieldValue("isPositive", e.target.checked)}
                  />
                </div>
                <div className="col-lg-1">
                  <button
                    type="button"
                    style={{ marginTop: "17px" }}
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

              {/* Row d tos one */}
              {rowDto.length > 0 && (
                <ICustomTable ths={headers}>
                  {rowDto?.map((td, index) => {
                    return (
                      <tr key={index}>
                        <td className="align-middle text-center">
                          {index + 1}
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
