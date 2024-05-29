/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik } from "formik";
import {
  Card,
  CardHeader,
  CardBody,
} from "../../../../../../../../_metronic/_partials/controls";
// import InputField from "../../../../../../_helper/_inputField";
import numberWithCommas from "../../../../../../_helper/_numberWithCommas";

const CalculationForm = ({ initData }) => {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              <CardHeader title="Insurance Service Break Down"></CardHeader>
              <CardBody style={{ background: "#dde3e8", paddingTop: "20px" }}>
                <div className="react-bootstrap-table table-responsive">
                  <table className="table table-striped table-bordered mt-3 global-table insurance-table">
                    <tbody>
                      <tr>
                        {/* <td style={{
                            width: "50%",
                            textAlign:"right !important"
                      }} className="text-right">{"Insured Amount (+" +values?.InsuredAddRate +"%)"}</td>
                      <td>{numberWithCommas(values?.insuredAmount)}</td> */}
                      </tr>
                      <tr>
                        {/* <td></td> */}
                        <td
                          style={{
                            width: "50%",
                            textAlign: "right !important",
                          }}
                        >
                          {"Insured Amount (+" +
                            values?.insuredAddRate * 100 +
                            "%)"}
                        </td>
                        <td className="text-center">
                          {numberWithCommas(values?.insuredAmount)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                          }}
                        >
                          Premium
                        </td>
                        <td className="text-center">
                          {numberWithCommas(values?.premium)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                          }}
                        >
                          Stamp
                        </td>
                        <td className="text-center">
                          {numberWithCommas(values?.stamp)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                          }}
                        >
                          VAT
                        </td>
                        <td className="text-center">
                          {numberWithCommas(values?.vat)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                            fontWeight: "bold",
                          }}
                        >
                          Total
                        </td>
                        <td className="text-center">
                          {numberWithCommas(
                            Number(values?.premium) +
                              Number(values?.stamp) +
                              Number(values?.vat)
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                          }}
                        >
                          Discount On Commision
                        </td>
                        <td className="text-center">
                          {numberWithCommas(values?.discountOnCommision)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                            fontWeight: "bold",
                          }}
                        >
                          Net Paid
                        </td>
                        <td className="text-center">
                          {numberWithCommas(values?.netPaid)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* <div className="d-flex">
                  <span style={{ width: "11rem" }}>{"Insured Amount (+" +values?.InsuredAddRate +"%)"}</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={numberWithCommas(values?.insuredAmount)}
                    name="insuredAmount"
                    type="text"
                    disabled
                  />
                </div>
                <div className="d-flex my-2">
                  <span style={{ width: "11rem" }}>Premium</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={numberWithCommas(values?.premium)}
                    name="premium"
                    type="text"
                    disabled
                  />
                </div>
         
                <div className="d-flex">
                  <span style={{ width: "11rem" }}>Stamp</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={numberWithCommas(values?.stamp)}
                    name="stamp"
                    type="text"
                    disabled
                  />
                </div>

             
                <div className="d-flex my-2">
                  <span style={{ width: "11rem" }}>VAT</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={numberWithCommas(values?.vat)}
                    name="vat"
                    type="text"
                    disabled
                  />
                </div> */}
                {/* <div className="d-flex">
                  <span style={{ width: "11rem" }}>Total</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={numberWithCommas(values?.total)}
                    name="total"
                    type="text"
                    disabled
                  />
                </div> */}
                {/* <div className="d-flex my-2">
                  <span style={{ width: "11rem" }}>Discount On Commision</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={numberWithCommas(values?.discountOnCommision)}
                    name="discountOnCommision"
                    type="text"
                    disabled
                  />
                </div>
                <div className="d-flex">
                  <span style={{ width: "11rem" }}>Net Paid</span>
                  <InputField
                    style={{ width: "12rem" }}
                    value={numberWithCommas(values?.netPaid)}
                    name="netPaid"
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
    </>
  );
};

export default CalculationForm;
