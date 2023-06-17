import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  calculateTotalConsumption,
  setPreviousPressure,
  setTotalConsumptionUnit,
} from "./helper";

export default function REBConsumptionForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  location,
  validationSchema,
  getPreviousPressureData,
  selectedBusinessUnit,
}) {
  const [consumptionDDL, setConsumptionDDL] = useAxiosGet();
  const params = useParams();
  useEffect(() => {
    setConsumptionDDL(
      `/mes/MSIL/GetAllMSIL?PartName=ElectricalREBConsumptionType&BusinessUnitId=${selectedBusinessUnit.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                    // disabled={location?.state?.dteDate}
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("totalConsumption", "");
                      setFieldValue("totalConsumptionUnit", "");
                      setFieldValue("presentPressure", "");
                      setFieldValue("presentPressureTwo", "");
                      setFieldValue("presentPressureThree", "");
                      setFieldValue("presentPressureFour", "");
                      setFieldValue("date", e.target.value);
                      if (values?.rebConsumptionDDL?.value) {
                        getPreviousPressureData(
                          `/mes/MSIL/GetPreviousEntryOfRebconsumption?UserDate=${e.target.value}&REBConsumptionTypeId=${values?.rebConsumptionDDL?.value}&BusinessUnitId=${selectedBusinessUnit?.value}`,
                          (data) => {
                            setPreviousPressure(setFieldValue, data);
                          }
                        );
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="rebConsumptionDDL"
                    // isDisabled={location?.state}
                    options={consumptionDDL || []}
                    value={values?.rebConsumptionDDL}
                    label="REB Consumption Type Name"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("totalConsumption", "");
                        setFieldValue("totalConsumptionUnit", "");
                        setFieldValue("presentPressure", "");
                        setFieldValue("presentPressureTwo", "");
                        setFieldValue("presentPressureThree", "");
                        setFieldValue("presentPressureFour", "");
                        setFieldValue("rebConsumptionDDL", valueOption);
                        getPreviousPressureData(
                          `/mes/MSIL/GetPreviousEntryOfRebconsumption?UserDate=${values?.date}&REBConsumptionTypeId=${valueOption?.value}&BusinessUnitId=${selectedBusinessUnit?.value}`,
                          (data) => {
                            setPreviousPressure(setFieldValue, data);
                          }
                        );
                      } else {
                        setFieldValue("totalConsumption", "");
                        setFieldValue("totalConsumptionUnit", "");
                        setFieldValue("presentPressure", "");
                        setFieldValue("presentPressureTwo", "");
                        setFieldValue("presentPressureThree", "");
                        setFieldValue("presentPressureFour", "");
                        setFieldValue("rebConsumptionDDL", "");
                        setFieldValue("previousPressure", "");
                        setFieldValue("previousPressureTwo", "");
                        setFieldValue("previousPressureThree", "");
                        setFieldValue("previousPressureFour", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
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
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    disabled
                    value={values?.previousPressure}
                    label="Previous KWH M1 (Meter Reading)"
                    name="previousPressure"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    // disabled={location?.state}
                    value={values?.presentPressure}
                    label="Present KWH M1 (Meter Reading)"
                    name="presentPressure"
                    type="number"
                    onChange={(e) => {
                      if (!e.target.value) {
                        setFieldValue("totalConsumption", "");
                        setFieldValue("presentPressure", "");
                        return;
                      }
                      if (+e.target.value < 0) return null;
                      setFieldValue("presentPressure", e.target.value);
                      setFieldValue(
                        "totalConsumption",
                        calculateTotalConsumption(
                          e.target.value,
                          values,
                          "presentPressure"
                        )
                      );
                      setTotalConsumptionUnit(
                        +e.target.value,
                        values,
                        setFieldValue,
                        selectedBusinessUnit
                      );
                    }}
                  />
                </div>
                {[171, 144, 224].includes(selectedBusinessUnit?.value) &&
                [1, 7].includes(values?.rebConsumptionDDL?.value) ? (
                  <div className="col-lg-3">
                    <InputField
                      disabled
                      value={values?.previousPressureTwo}
                      label="Previous KWH M2 (Meter Reading)"
                      name="previousPressureTwo"
                      type="number"
                    />
                  </div>
                ) : null}
                {[171, 144, 224].includes(selectedBusinessUnit?.value) &&
                [1, 7].includes(values?.rebConsumptionDDL?.value) ? (
                  <div className="col-lg-3">
                    <InputField
                      // disabled={location?.state}
                      value={values?.presentPressureTwo}
                      label="Present KWH M2 (Meter Reading)"
                      name="presentPressureTwo"
                      type="number"
                      onChange={(e) => {
                        if (!e.target.value) {
                          // setFieldValue("totalConsumption", "");
                          setFieldValue("presentPressureTwo", "");
                          return;
                        }
                        if (+e.target.value < 0) return null;
                        setFieldValue("presentPressureTwo", e.target.value);
                        setFieldValue(
                          "totalConsumption",
                          calculateTotalConsumption(
                            e.target.value,
                            values,
                            "presentPressureTwo"
                          )
                        );
                        if (
                          values?.rebConsumptionDDL?.value === 3 ||
                          values?.rebConsumptionDDL?.value === 4
                        ) {
                          setFieldValue(
                            "totalConsumptionUnit",
                            (+e.target.value +
                              (+values?.presentPressure || 0) -
                              ((+values?.previousPressure || 0) +
                                (+values?.previousPressureTwo || 0))) *
                              13750 // 13750 given by user
                          );
                        }
                      }}
                    />
                  </div>
                ) : null}

                {[144].includes(selectedBusinessUnit?.value) ? (
                  <>
                    <div className="col-lg-3">
                      <InputField
                        disabled
                        value={values?.previousPressureThree}
                        label="Previous KWH M3 (Meter Reading)"
                        name="previousPressureThree"
                        type="number"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        // disabled={location?.state}
                        value={values?.presentPressureThree}
                        label="Present KWH M3 (Meter Reading)"
                        name="presentPressureThree"
                        type="number"
                        onChange={(e) => {
                          if (!e.target.value) {
                            // setFieldValue("totalConsumption", "");
                            setFieldValue("presentPressureThree", "");
                            return;
                          }
                          if (+e.target.value < 0) return null;
                          setFieldValue("presentPressureThree", e.target.value);
                          setFieldValue(
                            "totalConsumption",
                            calculateTotalConsumption(
                              e.target.value,
                              values,
                              "presentPressureThree"
                            )
                          );
                          setTotalConsumptionUnit(
                            +e.target.value,
                            values,
                            setFieldValue,
                            selectedBusinessUnit
                          );
                        }}
                      />
                    </div>
                  </>
                ) : null}

                {[144].includes(selectedBusinessUnit?.value) ? (
                  <>
                    <div className="col-lg-3">
                      <InputField
                        disabled
                        value={values?.previousPressureFour}
                        label="Previous KWH M4 (Meter Reading)"
                        name="previousPressureFour"
                        type="number"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        // disabled={location?.state}
                        value={values?.presentPressureFour}
                        label="Present KWH M4 (Meter Reading)"
                        name="presentPressureFour"
                        type="number"
                        onChange={(e) => {
                          if (!e.target.value) {
                            // setFieldValue("totalConsumption", "");
                            setFieldValue("presentPressureFour", "");
                            return;
                          }
                          if (+e.target.value < 0) return null;
                          setFieldValue("presentPressureFour", e.target.value);
                          setFieldValue(
                            "totalConsumption",
                            calculateTotalConsumption(
                              e.target.value,
                              values,
                              "presentPressureFour"
                            )
                          );
                          setTotalConsumptionUnit(
                            +e.target.value,
                            values,
                            setFieldValue,
                            selectedBusinessUnit
                          );
                        }}
                      />
                    </div>
                  </>
                ) : null}

                {/* Total Part */}
                <div className="col-lg-3">
                  <InputField
                    disabled
                    value={values?.totalConsumption}
                    label="Total REB Consumption"
                    name="totalConsumption"
                    type="number"
                  />
                </div>
                {values?.rebConsumptionDDL?.value === 3 ||
                values?.rebConsumptionDDL?.value === 4 ||
                values?.rebConsumptionDDL?.value === 5 ||
                values?.rebConsumptionDDL?.value === 6 ? (
                  <div className="col-lg-3">
                    <InputField
                      disabled
                      value={values?.totalConsumptionUnit}
                      label="Total REB Consumption Unit"
                      name="totalConsumptionUnit"
                      type="number"
                    />
                  </div>
                ) : null}
                {selectedBusinessUnit?.value === 4 ? (
                  <div className="col-lg-3">
                    <InputField
                      value={values?.tmReadingTime}
                      label="Time span"
                      name="tmReadingTime"
                      type="time"
                      onChange={(e) => {
                        setFieldValue("tmReadingTime", e.target.value);
                        console.log("tmReadingTime", e.target.value);
                      }}
                      disabled={params?.id}
                    />
                  </div>
                ) : null}
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
