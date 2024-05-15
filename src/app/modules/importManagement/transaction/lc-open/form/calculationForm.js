/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { Formik } from "formik";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
// import InputField from "../../../../_helper/_inputField";
// import ICustomTable from "../../../../_helper/_customTable";
const CalculationForm = ({ initData }) => {
  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            {/* {console.log(values)} */}
            <Card>
              <CardHeader title="LC Opening Break Down"></CardHeader>
              <CardBody style={{ background: "#dde3e8", paddingTop: "20px" }}>
                {/* <h5>Bank</h5> */}
                <div className="react-bootstrap-table table-responsive">
                  <table className="table table-striped table-bordered mt-3 global-table">
                    <tbody>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                            fontWeight: "bold",
                          }}
                        >
                          Swift
                        </td>
                        <td>{numberWithCommas(values?.swift)}</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                            fontWeight: "bold",
                          }}
                        >
                          Stamp
                        </td>
                        <td>{numberWithCommas(values?.stamp)}</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                            fontWeight: "bold",
                          }}
                        >
                          Stationary
                        </td>
                        <td>{numberWithCommas(values?.stationary)}</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                            fontWeight: "bold",
                          }}
                        >
                          Stamp Charge for Other
                        </td>
                        <td>{numberWithCommas(values?.stampChargeforOther)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* <ICustomTable ths={[]}>
                  <tr>
                    <td>Swift</td>
                    <td>{values?.swift}</td>
                  </tr>
                  <tr>
                    <td>Stamp</td>
                    <td>{values?.stamp}</td>
                  </tr>
                  <tr>
                    <td>Stationary</td>
                    <td>{values?.stationary}</td>
                  </tr>
                  <tr>
                    <td>Stamp Charge for Other</td>
                    <td>{values?.stampChargeforOther}</td>
                  </tr>


                </ICustomTable> */}

                {/* <div className="d-flex  my-2">
                  <span style={{ width: "11rem" }}>Swift</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={values?.swift}
                    name="swift"
                    type="text"
                    disabled
                  />
                </div>
                <div className="d-flex">
                  <span style={{ width: "11rem" }}>Stamp</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={values?.stamp}
                    name="stamp"
                    type="text"
                    disabled
                  />
                </div>

                <div className="d-flex my-2">
                  <span style={{ width: "11rem" }}>Stationary</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={values?.stationary}
                    name="stationary"
                    type="text"
                    disabled
                  />
                </div>
                <div className="d-flex">
                  <span style={{ width: "11rem" }}>Stamp Charge for Other</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={values?.stampChargeforOther}
                    name="stampChargeforOther"
                    type="text"
                    disabled
                  />
                </div> */}
                {/* <div className="d-flex my-2">
                  <span style={{ width: "11rem" }}>LC Confirm</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={values?.lcConfirm}
                    name="lcConfirm"
                    type="text"
                    disabled
                  />
                </div> */}
                {/* <div className="d-flex">
                  <span style={{ width: "11rem" }}>Tenor Quarter</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={values?.tenorQuarter}
                    name="tenorQuarter"
                    type="text"
                    disabled
                  />
                </div> */}
                {/* <div className="d-flex my-2">
                  <span style={{ width: "11rem" }}>VAT Rate</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={values?.vatRate}
                    name="vatRate"
                    type="text"
                    disabled
                  />
                </div> */}
                {/* <div className="row"> */}
                {/* </div> */}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </div>
  );
};

export default CalculationForm;
