import { Form, Formik } from "formik";
import React from "react";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

export default function BilletConsumptionForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  productDDL,
  validationSchema,
  id
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
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <InputField
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    disabled={id}
                  />
                </div>
                <div className="col-lg-4">
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
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="mainProductName"
                    options={productDDL}
                    value={values?.mainProductName}
                    label="Main Product Name"
                    onChange={(valueOption) => {
                      setFieldValue("mainProductName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values?.billetWtKgs}
                    label="Re-Heating Billet Consumed Wt Kgs Per Billet"
                    name="billetWtKgs"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value < 0) return null;
                      setFieldValue("billetWtKgs", e.target.value);
                      setFieldValue(
                        "billetInKgs",
                        Number(e.target.value) * values?.billetInPcs || 0
                      );
                    }}
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values?.billetInPcs}
                    label="Re-Heating Billet Consumed in Pcs"
                    name="billetInPcs"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value < 0) return null;
                      setFieldValue("billetInPcs", e.target.value);
                      setFieldValue(
                        "billetInKgs",
                        Number(e.target.value) * values?.billetWtKgs || 0
                      );
                      setFieldValue(
                        "totalBilletConsumedInPcs",
                        Number(e.target.value) +
                          Number(values?.directBilletConsumedInPcs) || 0
                      );
                    }}
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    disabled
                    value={values?.billetInKgs}
                    label="Re-Heating Billet Consumed in Kgs"
                    name="billetInKgs"
                    type="number"
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values?.directBilletWtKgs}
                    label="Direct Charging Billet Consumed Wt Kgs Per Billet"
                    name="directBilletWtKgs"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value < 0) return null;
                      setFieldValue("directBilletWtKgs", e.target.value);
                      setFieldValue(
                        "directBilletConsumedInKgs",
                        Number(e.target.value) *
                          values?.directBilletConsumedInPcs || 0
                      );
                    }}
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values?.directBilletConsumedInPcs}
                    label="Direct Charging Billet Consumed in Pcs"
                    name="directBilletConsumedInPcs"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value < 0) return null;
                      setFieldValue(
                        "directBilletConsumedInPcs",
                        e.target.value
                      );
                      setFieldValue(
                        "directBilletConsumedInKgs",
                        Number(e.target.value) * values?.directBilletWtKgs || 0
                      );
                      setFieldValue(
                        "totalBilletConsumedInPcs",
                        Number(e.target.value) + Number(values?.billetInPcs) ||
                          0
                      );
                    }}
                  />
                </div>

                <div className="col-lg-4">
                  <InputField
                    disabled
                    value={values?.directBilletConsumedInKgs}
                    label="Direct Charging Billet Consumed in Kgs"
                    name="directBilletConsumedInKgs"
                    type="number"
                  />
                </div>

                {/* Total Part */}
                <div className="col-lg-4">
                  <InputField
                    disabled
                    value={values?.totalBilletConsumedInPcs}
                    label="Total Billet consumption in pcs"
                    name="totalBilletConsumedInPcs"
                    type="number"
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    disabled
                    value={
                      values?.billetInKgs + values?.directBilletConsumedInKgs
                    }
                    label="Total Billet Consumed in Kgs"
                    name="totalBilletConsumedInKgs"
                    type="number"
                  />
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
