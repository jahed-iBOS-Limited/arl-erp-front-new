/* eslint-disable no-undef */
// /* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
// import * as Yup from "yup";
// eslint-disable-next-line no-unused-vars
// import Axios from "axios";
import { _formatMoney } from "../../../../_helper/_formatMoney";
// import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
// const validationSchema = Yup.object().shape({
//   orderAmount: Yup.number()
//   .required("Received Amount is required"),
// });

export default function _Form({
  initData,
  btnRef,
  resetBtnRef,
  disableHandler,
  isEdit,
  setter,
  rowDtoHandler,
  state,
  disabled,
  setRowDto,
  total,
  remover,
  rowDto,
}) {
  // eslint-disable-next-line no-unused-vars
  // const [rateForm, setRateForm] = useState("");

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
          setValues,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}

            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-10">
                  {/* Table Header input end */}
                  <div className="row">
                    <div
                      className="col-lg-12"
                      style={{
                        marginLeft: "-4px",
                        marginRight: "0px",
                      }}
                    >
                      <table className={"table mt-1 bj-table"}>
                        <thead>
                          {/* className={rowDto?.length < 1 && "d-none"} */}
                          <tr>
                            <th style={{ width: "50px" }}>SL</th>
                            <th style={{ width: "100px" }}>Item Name</th>
                            <th style={{ width: "100px" }}>UoM</th>
                            <th style={{ width: "100px" }}>Qty</th>
                            <th style={{ width: "100px" }}>Rate</th>
                            <th style={{ width: "100px" }}>Received Amount</th>
                            <th style={{ width: "100px" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="text-center">
                                  {item?.productName}
                                </div>
                              </td>
                              <td>
                                <div className="text-center pl-2">
                                  {item?.uomname}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.orderQuantity}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-4">
                                  <div className=" pl-0 bank-journal">
                                    {_formatMoney(item?.price)}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-4">
                                  {item?.orderAmount}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.orderStatus ? "true" : "false"}
                                </div>
                              </td>
                              {/* <td className="text-center">
                                <IDelete remover={remover} id={index} />
                              </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
