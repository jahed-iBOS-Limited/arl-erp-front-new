import { Form, Formik } from "formik";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

export default function WastageProductionForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  loading,
  profileData,
  validationSchema,
  addHandler,
  removeHandler,
  productList,
  productDDL,
  otherProductDDL,
  editData,
  setProductList,
}) {
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
          setFieldValue,
          isValid,
          errors,
          touched,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.date}
                      label="Date"
                      name="date"
                      type="date"
                      disabled={
                        editData?.header?.intWastageAndProductionHourHeaderId
                      }
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shift"
                      options={[
                        { value: "A", label: "A" },
                        { value: "B", label: "B" },
                        { value: "C", label: "C" },
                        { value: "General", label: "General" },
                      ]}
                      value={values?.shift}
                      label="Shift"
                      onChange={(valueOption) => {
                        setFieldValue("shift", valueOption);
                      }}
                      isDisabled={false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="productName"
                      options={productDDL}
                      value={values?.productName}
                      label="Product Name"
                      onChange={(valueOption) => {
                        setFieldValue("productName", valueOption);
                        setProductList([]);
                      }}
                      isDisabled={false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.millRunningHour}
                      label="Mill Running Hour"
                      name="millRunningHour"
                      type="number"
                      onChange={(e) => {
                        if (+e.target.value > 24) return;
                        if (+e.target.value === 24) {
                          setFieldValue("millRunningHour", 23);
                          setFieldValue("millRunningMinute", 59);
                          return;
                        }
                        setFieldValue("millRunningHour", e.target.value);
                        setFieldValue("millRunningMinute", "");
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.millRunningMinute}
                      label="Mill Running Minute"
                      name="millRunningMinute"
                      type="number"
                      disabled={
                        +values?.millRunningHour === 23 &&
                        +values?.millRunningMinute > 58
                      }
                      onChange={(e) => {
                        if (+e.target.value > 59) return;
                        setFieldValue("millRunningMinute", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.actualProductionHour}
                      label="Actual Production Hour"
                      name="actualProductionHour"
                      type="number"
                      onChange={(e) => {
                        if (+e.target.value > 24) return;
                        if (+e.target.value === 24) {
                          setFieldValue("actualProductionHour", 23);
                          setFieldValue("actualProductionMinute", 59);
                          return;
                        }
                        setFieldValue("actualProductionHour", e.target.value);
                        setFieldValue("actualProductionMinute", "");
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.actualProductionMinute}
                      label="Actual Production Minute"
                      name="actualProductionMinute"
                      type="number"
                      disabled={
                        +values?.actualProductionHour === 23 &&
                        +values?.actualProductionMinute > 58
                      }
                      onChange={(e) => {
                        if (+e.target.value > 59) return;
                        setFieldValue("actualProductionMinute", e.target.value);
                      }}
                    />
                  </div>
                </div>
                <h5 style={{ marginTop: "23px" }}>Add Others Product</h5>
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="othersProductName"
                      options={otherProductDDL}
                      value={values?.othersProductName}
                      label="Others Product Name"
                      onChange={(valueOption) => {
                        setFieldValue("othersProductName", valueOption);
                      }}
                      isDisabled={false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {values?.othersProductName?.value === 91408 && (
                    <div className="col-lg-3">
                      <InputField
                        value={values?.quantity}
                        label="Quantity [Pcs]"
                        name="quantity"
                        type="number"
                      />
                    </div>
                  )}
                  <div className="col-lg-3">
                    <InputField
                      value={values?.avgWeight}
                      label="Avg Weight Kgs Per Billet"
                      name="avgWeight"
                      type="number"
                    />
                  </div>
                  <div style={{ marginTop: "17px" }}>
                    <button
                      onClick={() => {
                        addHandler(values, setFieldValue);
                      }}
                      className="btn btn-primary"
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }}>SL</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Avg Weight</th>
                        <th style={{ width: "50px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList?.length > 0 &&
                        productList.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.othersProductName?.othersItemName}</td>
                            <td className="text-center">{item?.quantity}</td>
                            <td className="text-center">{item?.avgWeight}</td>
                            <td className="text-center">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">{"Remove"}</Tooltip>
                                }
                              >
                                <span>
                                  <i
                                    className={`fa fa-trash`}
                                    onClick={() => {
                                      removeHandler(index);
                                    }}
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
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
