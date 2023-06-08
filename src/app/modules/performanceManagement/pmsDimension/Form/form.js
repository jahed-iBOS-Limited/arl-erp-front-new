import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../_helper/_input";
import ICustomTable from "../../../_helper/_customTable";
import { useHistory } from "react-router-dom";
const headers = ["SL", "Dimension Type", "Weight"];

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  rowDto,
  rowDtoHandler,
  total,
}) {
  const history = useHistory();
  return (
    
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            history.push("/performance-management/configuration/pms-dimension")
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
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row mt-5">
                {rowDto.length > 0 && (
                  <ICustomTable ths={headers}>
                    {rowDto?.map((td, index) => {
                      return (
                        <tr key={index}>
                          <td
                            style={{ width: "100px" }}
                            className="align-middle"
                          >
                            {index + 1}
                          </td>
                          <td className="align-middle">
                            {td?.total || td.dimentionTypeName}
                          </td>
                          <td className="align-middle disable-border">
                            <IInput
                              value={rowDto[index]?.weight}
                              required
                              onChange={(e) => {
                                rowDtoHandler("weight", e.target.value, index);
                              }}
                              type="number"
                              min="0"
                              name="weight"
                            />
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td></td>
                      <td>Total (Total must be 100)</td>
                      <td className="text-center">{total} </td>
                    </tr>
                  </ICustomTable>
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
