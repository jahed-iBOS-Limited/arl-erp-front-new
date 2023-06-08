import { Form, Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getDifferenceBetweenTime } from "../helper";

export default function MeltingProductionForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  loading,
  profileData,
  validationSchema,
  id,
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
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.heatNo}
                    label="Heat No"
                    name="heatNo"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shift"
                    options={[
                      { value: "A", label: "A" },
                      { value: "B", label: "B" },
                      { value: "C", label: "C" },
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
                <div className="col-lg-3">
                  <InputField
                    value={values?.heatStartTime}
                    label="Heat Start Time"
                    name="heatStartTime"
                    type="time"
                    onChange={(e) => {
                      if (!values?.date)
                        return toast.warn("Please select date");
                      setFieldValue("heatStartTime", e.target.value);
                      if (values?.date && values?.heatEndTime) {
                        let difference = getDifferenceBetweenTime(
                          values?.date,
                          e.target.value,
                          values?.heatEndTime
                        );
                        setFieldValue("totalHeatTime", difference);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.heatEndTime}
                    label="Heat End Time"
                    name="heatEndTime"
                    type="time"
                    onChange={(e) => {
                      if (!values?.date)
                        return toast.warn("Please select date");
                      setFieldValue("heatEndTime", e.target.value);
                      if (values?.date && values?.heatStartTime) {
                        let difference = getDifferenceBetweenTime(
                          values?.date,
                          values?.heatStartTime,
                          e.target.value
                        );
                        setFieldValue("totalHeatTime", difference);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    disabled={true}
                    value={values?.totalHeatTime}
                    label="Total Heat Time"
                    name="totalHeatTime"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.siliconManganese}
                    label="Silicon Manganese"
                    name="siliconManganese"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.ferroSilicon}
                    label="Ferro Silicon"
                    name="ferroSilicon"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.numFerroManganese}
                    label="Ferro Manganese"
                    name="numFerroManganese"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.productionQty}
                    label="Production Qty"
                    name="productionQty"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.perBilletWeight}
                    label="Per Billet Weight"
                    name="perBilletWeight"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.wastage}
                    label="Wastage %"
                    name="wastage"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    disabled
                    value={values?.rebConsumption}
                    label="REB Consumption"
                    name="rebConsumption"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.hours}
                    label="Power Cut Hours"
                    name="hours"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value > 24) return;
                      if (+e.target.value === 24) {
                        setFieldValue("hours", 23);
                        setFieldValue("minutes", 59);
                        return;
                      }
                      setFieldValue("hours", e.target.value);
                      setFieldValue("minutes", "");
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.minutes}
                    label="Power Cut Minutes"
                    name="minutes"
                    type="number"
                    disabled={+values?.hours === 23 && +values?.minutes > 58}
                    onChange={(e) => {
                      if (+e.target.value > 59) return;
                      setFieldValue("minutes", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.mpanelNo}
                    label="M.Panel No"
                    name="mpanelNo"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value < 0) return;
                      if (e.target.value.includes(".")) return;
                      setFieldValue("mpanelNo", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.crucibleNo}
                    label="Crucible No"
                    name="crucibleNo"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value < 0) return;
                      if (e.target.value.includes(".")) return;
                      setFieldValue("crucibleNo", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.crucibleLiningHeatNo}
                    label="Crucible Lining Heat No"
                    name="crucibleLiningHeatNo"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value < 0) return;
                      if (e.target.value.includes(".")) return;
                      setFieldValue("crucibleLiningHeatNo", e.target.value);
                    }}
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
