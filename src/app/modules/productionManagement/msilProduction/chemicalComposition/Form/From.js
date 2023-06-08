import { Form, Formik } from "formik";
import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

export default function ChemicalCompositionForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  loading,
  profileData,
  validationSchema,
  setTotalHeatTime,
  id,
  state,
  singleData,
  getSingleData,
  buId,
}) {
  const editShiftValue = (shift) => {
    switch (shift) {
      case "B":
        return 2;

      case "C":
        return 3;

      default:
        return 1;
    }
  };
  const editSampleTypeValue = (type) => {
    switch (type) {
      case "Bath Sample":
        return 1;

      case "Final Sample":
        return 2;

      default:
        return;
    }
  };

  const setCarbonEquivalent = (
    manganeseValue = 0,
    carbonValue = 0,
    setFieldValue
  ) => {
    const v = manganeseValue / 6 + carbonValue;
    setFieldValue("carbonEquivalent", v);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          id
            ? {
                ...initData,
                date: _dateFormatter(state?.dteDate) || "",
                shift: {
                  value: state?.strShift ? editShiftValue(state?.strShift) : "",
                  label: state?.strShift || "",
                },
                heatNo: state?.strHeatNo || "",
                sampleType: {
                  value: state?.strSampleType
                    ? editSampleTypeValue(state?.strSampleType)
                    : "",
                  label: state?.strSampleType || "",
                },
                carbone: state?.numC || "",
                silicon: state?.numSi || "",
                manganese: state?.numMn || "",
                phosphorus: state?.numP || "",
                shulfer: state?.numS || "",
                chromium: state?.numCr || "",
                copper: state?.numCu || "",
                nickel: state?.numNi || "",
                carbonEquivalent: state?.numCe || "",
              }
            : initData
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (id) {
              getSingleData(
                `/mes/MSIL/GetAllMSIL?PartName=MeltingQC&FromDate=${state?.dteDate}&ToDate=${state?.dteDate}&BusinessUnitId=${buId}&AutoId=${state?.intAutoId}`
              );
            } else {
              resetForm(initData);
            }
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
                  <NewSelect
                    name="shift"
                    options={[
                      { value: 1, label: "A" },
                      { value: 2, label: "B" },
                      { value: 3, label: "C" },
                    ]}
                    value={values?.shift}
                    label="Shift"
                    onChange={(valueOption) => {
                      setFieldValue("shift", valueOption);
                    }}
                    setClear={false}
                    errors={errors}
                    touched={touched}
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
                    name="sampleType"
                    options={[
                      { value: 1, label: "Bath Sample" },
                      { value: 2, label: "Final Sample" },
                    ]}
                    value={values?.sampleType}
                    label="Sample Type"
                    onChange={(valueOption) => {
                      setFieldValue("sampleType", valueOption);
                      if (valueOption?.value === 2) {
                        setCarbonEquivalent(
                          +values?.manganese,
                          +values?.carbone,
                          setFieldValue
                        );
                      } else {
                        setFieldValue("carbonEquivalent", 0);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.carbone}
                    label="Carbon (C)"
                    name="carbone"
                    type="number"
                    min="0"
                    onChange={(e) => {
                      setFieldValue("carbone", e.target.value);
                      if (values?.sampleType?.value === 2) {
                        setCarbonEquivalent(
                          +values?.manganese,
                          +e.target.value,
                          setFieldValue
                        );
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.silicon}
                    label="Silicon (Si)"
                    name="silicon"
                    type="number"
                    min="0"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.manganese}
                    label="Manganese (Mn)"
                    name="manganese"
                    type="number"
                    min="0"
                    onChange={(e) => {
                      setFieldValue("manganese", e.target.value);
                      if (values?.sampleType?.value === 2) {
                        setCarbonEquivalent(
                          +e.target.value,
                          +values?.carbone,
                          setFieldValue
                        );
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.phosphorus}
                    label="Phosphorus (P)"
                    name="phosphorus"
                    type="number"
                    min="0"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.shulfer}
                    label="Shulfer (S)"
                    name="shulfer"
                    type="number"
                    min="0"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.chromium}
                    label="Chromium (Cr)"
                    name="chromium"
                    type="number"
                    min="0"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.copper}
                    label="Copper (Cu)"
                    name="copper"
                    type="number"
                    min="0"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.nickel}
                    label="Nickel (Ni)"
                    name="nickel"
                    type="number"
                    min="0"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    disabled
                    value={values?.carbonEquivalent}
                    label="Carbon Equivalent"
                    name="carbonEquivalent"
                    type="number"
                    min="0"
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
