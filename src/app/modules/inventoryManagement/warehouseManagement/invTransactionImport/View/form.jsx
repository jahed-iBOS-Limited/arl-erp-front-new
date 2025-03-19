import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

// Validation schema
const validationSchema = Yup.object().shape({
  referenceTypeName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Remarks is required"),
});

export default function _Form({
  initData,
  btnRef,
  resetBtnRef,
  disableHandler,
  singleData,
}) {
  const dispatch = useDispatch();

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
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Reference Type</span>
                  </div>
                  <InputField
                    value={values?.referenceTypeName}
                    disabled={true}
                    name="referenceTypeName"
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Reference No.</span>
                  </div>
                  <InputField
                    value={values?.referenceCode}
                    disabled={true}
                    name="referenceCode"
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Transaction Type</span>
                  </div>
                  <InputField
                    value={values?.transactionTypeName}
                    disabled={true}
                    name="transactionTypeName"
                  />
                </div>
                {values?.businessPartnerName && (
                  <div className="col-lg-3">
                    <div className="my-1">
                      <span>Business Partner</span>
                    </div>
                    <InputField
                      value={values?.businessPartnerName || ""}
                      disabled={true}
                      name="businessPartnerName"
                    />
                  </div>
                )}
                {values?.transactionGroupId !== 1 && (
                  <div className="col-lg-3">
                    <div className="my-1">
                      <span>Personnel</span>
                    </div>
                    <InputField
                      value={values?.personnelName || ""}
                      disabled={true}
                      name="personnelName"
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Comments</span>
                  </div>
                  <InputField
                    value={values?.comments || ""}
                    disabled={true}
                    name="comments"
                  />
                </div>
                {values?.documentId && (
                  <div className="col-lg-3 mt-8">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(values?.documentId)
                        );
                      }}
                    >
                      Attachment
                    </button>
                  </div>
                )}
              </div>
              {singleData[0]?.objTransfer &&
                Object.keys(singleData[0]?.objTransfer).length && (
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="my-1">
                        <span>From Plant</span>
                      </div>
                      <InputField
                        value={singleData[0]?.objTransfer?.fromPlantName || ""}
                        disabled={true}
                        name="comments"
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="my-1">
                        <span>To Plant</span>
                      </div>
                      <InputField
                        value={singleData[0]?.objTransfer?.toPlantName || ""}
                        disabled={true}
                        name="comments"
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="my-1">
                        <span>From Warehouse</span>
                      </div>
                      <InputField
                        value={singleData[0]?.objTransfer?.fromWhName || ""}
                        disabled={true}
                        name="comments"
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="my-1">
                        <span>To WareHouse</span>
                      </div>
                      <InputField
                        value={singleData[0]?.objTransfer?.toWhName || ""}
                        disabled={true}
                        name="comments"
                      />
                    </div>
                  </div>
                )}

              <div className="form-group row mt-2">
                <div className="col-lg-12">
                  <div className="row px-5">
                    {/* Start Table Part */}
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Value</th>
                            <th>Location</th>
                            <th>Bin Number</th>
                            <th>Stock Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {singleData[0]?.objRow?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center align-middle">
                                {index + 1}
                              </td>
                              <td className="text-center align-middle">
                                {item?.itemCode}
                              </td>

                              <td className="text-center align-middle table-input">
                                {item?.itemName}
                              </td>
                              <td className="text-center align-middle table-input">
                                {item?.numTransactionQuantity}
                              </td>
                              <td className="text-center align-middle table-input">
                                {item?.monTransactionValue}
                              </td>
                              <td className="text-center align-middle table-input">
                                {item?.inventoryLocationName}
                              </td>
                              <td className="text-center align-middle table-input">
                                {item?.binNumber}
                              </td>
                              <td className="text-center align-middle table-input">
                                {item?.inventoryStockTypeName}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* End Table Part */}
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
