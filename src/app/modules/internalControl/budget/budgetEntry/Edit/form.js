import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import ICustomTable from "../../../../_helper/_customTable";

const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  state,
  rowDto,
  rowDtoHandler,
}) {
  const tableHeader = (id) => {
    switch (id) {
      case 4:
        return [
          "SL",
          "Budget Type Name",
          "Code",
          "Description",
          "Plan/Target Qty",
          "Plan/Target Amount",
        ];

      case 2:
      case 3:
        return [
          "SL",
          "Budget Type Name",
          "Code",
          "Cost Revenue Center Name",
          "Description",
          "Plan/Target Amount",
        ];

      default:
        return [
          "SL",
          "Budget Type Name",
          "Code",
          "Description",
          "Plan/Target Amount",
        ];
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
              <div className="row">
                <ICustomTable ths={tableHeader(state?.intBudgetTypeId)}>
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="pl-2">{state?.strBudgetTypeName}</td>
                      <td className="pl-2">{item?.strElementCode}</td>
                      {(state?.intBudgetTypeId === 2 ||
                        state?.intBudgetTypeId === 3) && (
                        <td>{item?.costRevCenterName}</td>
                      )}
                      <td className="pl-2">{item?.strElementName}</td>
                      {state?.intBudgetTypeId === 4 ? (
                        <>
                          <td style={{ width: "100px" }}>
                            <input
                              placeholder=" "
                              type="number"
                              value={item[item?.levelVariableQty]}
                              name={item?.levelVariableQty}
                              onChange={(e) =>
                                rowDtoHandler(
                                  `${item?.levelVariableQty}`,
                                  index,
                                  e.target.value
                                )
                              }
                              required
                            />
                          </td>

                          <td style={{ width: "100px" }}>
                            <input
                              placeholder=" "
                              type="number"
                              value={item[item?.levelVariableAmount]}
                              name={item?.levelVariableAmount}
                              onChange={(e) =>
                                rowDtoHandler(
                                  `${item?.levelVariableAmount}`,
                                  index,
                                  e.target.value
                                )
                              }
                              step="any"
                              required
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ width: "100px" }}>
                            <input
                              placeholder=" "
                              type="number"
                              value={item[item?.levelVariableAmount]}
                              name={item?.levelVariableAmount}
                              onChange={(e) =>
                                rowDtoHandler(
                                  `${item?.levelVariableAmount}`,
                                  index,
                                  e.target.value
                                )
                              }
                              step="any"
                              required={item?.numBudgetValue <= 0}
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </ICustomTable>
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
