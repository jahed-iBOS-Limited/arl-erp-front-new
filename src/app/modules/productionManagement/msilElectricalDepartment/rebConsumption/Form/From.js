import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

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

  const setTotalConsumptionUnit = (fieldValue, values, setFieldValue) => {
    if (
      values?.rebConsumptionDDL?.value === 3 ||
      values?.rebConsumptionDDL?.value === 4
    ) {
      setFieldValue(
        "totalConsumptionUnit",
        (+fieldValue +
          (+values?.presentPressureTwo || 0) -
          ((+values?.previousPressure || 0) +
            (+values?.previousPressureTwo || 0))) *
          13750 // 13750 given by user
      );
    }
    if (
      selectedBusinessUnit?.value === 4 &&
      (values?.rebConsumptionDDL?.value === 5 ||
        values?.rebConsumptionDDL?.value === 6)
    ) {
      setFieldValue(
        "totalConsumptionUnit",
        (+fieldValue +
          (+values?.presentPressureTwo || 0) -
          ((+values?.previousPressure || 0) +
            (+values?.previousPressureTwo || 0))) *
          30000 // 30000 given by user
      );
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
                      setFieldValue("date", e.target.value);
                      if (values?.rebConsumptionDDL?.value) {
                        getPreviousPressureData(
                          `/mes/MSIL/GetPreviousEntryOfRebconsumption?UserDate=${e.target.value}&REBConsumptionTypeId=${values?.rebConsumptionDDL?.value}&BusinessUnitId=${selectedBusinessUnit?.value}`,
                          (data) => {
                            setFieldValue(
                              "previousPressure",
                              data?.intPreviousKwh
                            );
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
                        setFieldValue("rebConsumptionDDL", valueOption);
                        getPreviousPressureData(
                          `/mes/MSIL/GetPreviousEntryOfRebconsumption?UserDate=${values?.date}&REBConsumptionTypeId=${valueOption?.value}&BusinessUnitId=${selectedBusinessUnit?.value}`,
                          (data) => {
                            setFieldValue(
                              "previousPressure",
                              data?.intPreviousKwh
                            );
                            setFieldValue(
                              "previousPressureTwo",
                              data?.intPreviousKwhm2
                            );
                          }
                        );
                      } else {
                        setFieldValue("totalConsumption", "");
                        setFieldValue("totalConsumptionUnit", "");
                        setFieldValue("presentPressure", "");
                        setFieldValue("presentPressureTwo", "");
                        setFieldValue("rebConsumptionDDL", "");
                        setFieldValue("previousPressure", "");
                        setFieldValue("previousPressureTwo", "");
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
                      if (!e.target.value && !values?.presentPressureTwo) {
                        setFieldValue("totalConsumption", "");
                        setFieldValue("presentPressure", "");
                        return;
                      }
                      if (+e.target.value < 0) return null;
                      setFieldValue("presentPressure", e.target.value);
                      setFieldValue(
                        "totalConsumption",
                        +e.target.value +
                          (+values?.presentPressureTwo || 0) -
                          ((+values?.previousPressure || 0) +
                            (+values?.previousPressureTwo || 0))
                      );
                      setTotalConsumptionUnit(
                        +e.target.value,
                        values,
                        setFieldValue
                      );
                    }}
                  />
                </div>
                {(selectedBusinessUnit?.value === 171 ||
                  selectedBusinessUnit?.value === 224) &&
                values?.rebConsumptionDDL?.value === 1 ? (
                  <div className="col-lg-3">
                    <InputField
                      disabled
                      value={values?.previousPressureTwo}
                      label="Previous KWH M2 (Meter Reading)"
                      name="previousPressure"
                      type="number"
                    />
                  </div>
                ) : null}
                {(selectedBusinessUnit?.value === 171 ||
                  selectedBusinessUnit?.value === 224) &&
                values?.rebConsumptionDDL?.value === 1 ? (
                  <div className="col-lg-3">
                    <InputField
                      // disabled={location?.state}
                      value={values?.presentPressureTwo}
                      label="Present KWH M2 (Meter Reading)"
                      name="presentPressureTwo"
                      type="number"
                      onChange={(e) => {
                        if (!e.target.value && !values?.presentPressure) {
                          setFieldValue("totalConsumption", "");
                          setFieldValue("presentPressureTwo", "");
                          return;
                        }
                        if (+e.target.value < 0) return null;
                        setFieldValue("presentPressureTwo", e.target.value);
                        setFieldValue(
                          "totalConsumption",
                          +e.target.value +
                            (+values?.presentPressure || 0) -
                            ((+values?.previousPressure || 0) +
                              (+values?.previousPressureTwo || 0))
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
