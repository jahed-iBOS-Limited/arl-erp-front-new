import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";

// Validation schema
const validationSchema = Yup.object().shape({
  invoiceNumber: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Invoice Number is required"),
  comments: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Comments Name is required"),
  SBU: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  resetBtnRef,
  disableHandler,
  singleData,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
              <div className="form-group row">
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>SBU</span>
                  </div>
                  <InputField
                    value={singleData?.objHeaderDTO?.sbuname}
                    name="invoiceNumber"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Purchase Org.</span>
                  </div>
                  <InputField
                    value={singleData?.objHeaderDTO?.purchaseOrganizationName}
                    name="invoiceNumber"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Plant</span>
                  </div>
                  <InputField
                    value={singleData?.objHeaderDTO?.plantName}
                    name="invoiceNumber"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Warehouse</span>
                  </div>
                  <InputField
                    value={singleData?.objHeaderDTO?.warehouseName}
                    name="invoiceNumber"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Supplier Name</span>
                  </div>
                  <InputField
                    value={singleData?.objHeaderDTO?.businessPartnerName}
                    name="invoiceNumber"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Purchase Order</span>
                  </div>
                  <InputField
                    value={singleData?.objHeaderDTO?.purchaseOrderNo}
                    name="invoiceNumber"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Bill No.</span>
                  </div>
                  <InputField
                    value={singleData?.objHeaderDTO?.invoiceNumber}
                    name="invoiceNumber"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Invoice Date</span>
                  </div>
                  <InputField
                    value={_dateFormatter(
                      singleData?.objHeaderDTO?.invoiceDate
                    )}
                    name="invoiceDate"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Comments</span>
                  </div>
                  <InputField
                    value={singleData?.objHeaderDTO?.remarks}
                    name="comments"
                    disabled={true}
                  />
                </div>
                {/* <div className="col-lg-1 offset-8">
                  <div className="align-right pt-5">
                    <span>
                      <IView />
                    </span>
                  </div>
                </div> */}
              </div>

              <div className="form-group row mt-2">
                <div className="col-lg-8">
                  <div className="row px-5">
                    {/* Start Table Part */}
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>GRN No.</th>
                            <th>GRN Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {singleData?.objRowListDTO?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center align-middle">
                                {index + 1}
                              </td>
                              <td className="text-center align-middle">
                                {item?.referenceName}
                              </td>

                              <td className="text-center align-middle table-input">
                                {item?.referenceAmount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* End Table Part */}
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="bg-secondary">
                    <div className="p-2">
                      <div
                        className="payment-border d-flex justify-content-between"
                        style={{ marginTop: "10px" }}
                      >
                        <span>Total GRN Amount</span>
                        <span>
                          {singleData?.objHeaderDTO?.totalReferenceAmount} TK
                        </span>
                      </div>
                      <div
                        className="payment-border d-flex justify-content-between"
                        style={{ marginTop: "10px" }}
                      >
                        <span>Gross Invoice Amount</span>
                        <span>
                          {" "}
                          {singleData?.objHeaderDTO?.grossInvoiceAmount} TK
                        </span>
                      </div>
                      <div
                        className="payment-border d-flex justify-content-between"
                        style={{ marginTop: "10px" }}
                      >
                        <span>Deduction Amount</span>
                        <span>
                          {" "}
                          {singleData?.objHeaderDTO?.deductionAmount} TK
                        </span>
                      </div>
                      <div
                        className="payment-border d-flex justify-content-between"
                        style={{ marginTop: "10px" }}
                      >
                        <span>Advance Adjustment Amount</span>
                        <span>
                          {singleData?.objHeaderDTO?.advanceAdjustmentAmount} TK{" "}
                          <span>
                            <IView />
                          </span>
                        </span>
                      </div>
                      <div
                        className="payment-border d-flex justify-content-between"
                        style={{ marginTop: "10px" }}
                      >
                        <span>Net Payment Amount</span>
                        <span>
                          {" "}
                          {singleData?.objHeaderDTO?.netPaymentAmount} TK
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
