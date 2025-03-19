/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { useState } from "react";
import { ISelect } from "../../../../_helper/_inputDropDown";
import KpiEntryGrid from "./kpiEntryGrid";
import KpiReportTable from "./reportTable";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getObjectiveDDLAction } from "../../../_redux/Actions";

// Validation schema
const validationSchema = Yup.object().shape({
  sbu: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("SBU is required"),
  kpiname: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(300, "Maximum 300 symbols")
    .required("Kpi Name is required"),
  bscPerspective: Yup.object().shape({
    label: Yup.string().required("Bscperspective is required"),
    value: Yup.string().required("Bscperspective is required"),
  }),
  kpiformat: Yup.object().shape({
    label: Yup.string().required("Kpi format is required"),
    value: Yup.string().required("Kpi format is required"),
  }),
  // weight: Yup.object().shape({
  //   label: Yup.string().required("Weight is required"),
  //   value: Yup.string().required("Weight is required"),
  // }),
  maxiMini: Yup.object().shape({
    label: Yup.string().required("Field is required"),
    value: Yup.string().required("Field is required"),
  }),
  section: Yup.object()
    .shape({
      label: Yup.string().required("Section is required"),
      value: Yup.string().required("Section is required"),
    })
    .typeError("Section is required"),
  dataSource: Yup.object().shape({
    label: Yup.string().required("Data Source is required"),
    value: Yup.string().required("Data Source is required"),
  }),

  targetFrequency: Yup.object().shape({
    label: Yup.string().required("Target Frequency is required"),
    value: Yup.string().required("Target Frequency is required"),
  }),
  aggregationType: Yup.object().shape({
    label: Yup.string().required("Aggregation Type is required"),
    value: Yup.string().required("Aggregation Type is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  sbuDDL,
  isEdit,
  weightDDL,
  bscPerspectiveDDL,
  objectiveDDL,
  yearDDL,
  viewRowDto,
  frequencyDDL,
  strategicParticularsGrid,
  getStrategicParticularsGridActionDispatcher,
  dataSourceDDL,
  frequencyId,
  selectedBusinessUnit,
  getBscPerspectiveDefaultValue,
  id,
  report,
  setReport,
}) {
  const [objRowTargetAchivment, setObjRowTargetAchivment] = useState({});
  const [allValue, setAllValue] = useState(0);
  const [year, setYear] = useState("");
  const [kpiDDL, getKpiDDL, , setKpiDDL] = useAxiosGet();
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const dispatch = useDispatch();

  const kpiDetails = (values) => {
    return [
      {
        label: "Select Objective",
        name: "objective",
        options: objectiveDDL,
        isDisabled: !values.sbu?.value,
        dependencyFunc: (currentValue, values, setter) => {
          if (currentValue) {
            getBscPerspectiveDefaultValue(currentValue).then((res) => {
              getKpiDDL(
                `/pms/KPI/GetKPIMasterDataDDL?accountId=${profileData?.accountId}&bscId=${res.data[0]?.value}`
              );
              setter("bscPerspective", res.data[0]);
              setter("kpiname", "");
            });
          }
          if (!currentValue) {
            setter("bscPerspective", "");
            setter("kpiname", "");
            setKpiDDL([]);
          }
        },
      },

      {
        label: "Select BSC Perspective",
        name: "bscPerspective",
        options: bscPerspectiveDDL,
        dependencyFunc: (currentValue, values, setter) => {
          if (currentValue) {
            getKpiDDL(
              `/pms/KPI/GetKPIMasterDataDDL?accountId=${profileData?.accountId}&bscId=${currentValue}`
            );
            setter("kpiname", "");
          }
          if (!currentValue) {
            setter("kpiname", "");
            setKpiDDL([]);
          }
        },
        // value: values.bscPerspective?.value
        //   ? values.bscPerspective
        //   : bscPerspectiveDefaultValue,
      },
      {
        label: "KPI Name",
        name: "kpiname",
        options: kpiDDL || [],
        defaultValue: values.kpiname,
        // isInput: true,
      },
      {
        label: "Select KPI Format",
        name: "kpiformat",
        options: [
          { label: "% of", value: "% of" },
          { label: "# of", value: "# of" },
          {
            label: "Amount",
            value: "BDT",
          },
          {
            label: "Amount ($)",
            value: "$",
          },
        ],
        defaultValue: values.kpiformat,
      },
      // {
      //   label: "Select Weight",
      //   name: "weight",
      //   options: weightDDL,
      //   defaultValue: values.weight,
      // },
      {
        label: "Select Data Source",
        name: "dataSource",
        options: dataSourceDDL,
        defaultValue: values.dataSource,
      },
      {
        label: "Select Max/Mini",
        name: "maxiMini",
        options: [
          { label: "Maximization", value: 1 },
          { label: "Minimization", value: 2 },
        ],
        defaultValue: values.maxiMini,
      },
      {
        label: "Select Aggregation Type",
        defaultValue: values.aggregationType,
        name: "aggregationType",
        options: [
          {
            label: "Avarage",
            value: "avarage",
          },
          {
            label: "Sum",
            value: "sum",
          },
        ],
      },
    ];
  };

  // Set and get value in rowdto
  const rowDtoHandler = (name, value, sl) => {
    setObjRowTargetAchivment({
      ...objRowTargetAchivment,
      [sl]: {
        ...objRowTargetAchivment[sl],
        [name]: value,
      },
    });
  };

  useEffect(() => {
    const size = strategicParticularsGrid?.length;
    const key = frequencyId === 2 ? "monthId" : "quarterId";
    if (size) {
      const tempObj = {};
      strategicParticularsGrid.forEach((itm, idx) => {
        tempObj[idx] = { ...itm, [key]: itm.id };
      });
      setObjRowTargetAchivment(tempObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategicParticularsGrid]);

  useEffect(() => {
    const size = strategicParticularsGrid?.length;
    if (size) {
      setObjRowTargetAchivment(
        Object.fromEntries(
          Array.from({ length: size }, (_, i) => [
            i,
            {
              ...objRowTargetAchivment[i],
              target: +allValue,
              actualEndDate: "2020-09-27T12:37:16.694Z",
            },
          ])
        )
      );
    }
  }, [allValue]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          year: { value: yearDDL[0]?.value, label: yearDDL[0]?.label },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ objValues: values, objRowTargetAchivment }, () => {
            // dispatch(setParticullersGridEmpty());
            if (values.sbu && (values.year || year)) {
              getPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                values.sbu?.value,
                values.year?.value || year.value,
                0,
                0,
                false,
                3
              );
            }
            setAllValue(0);
          });
        }}
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
            {console.log({ errors, values })}
            <Form className="form form-label-right">
              {/* Set Kpi */}
              <div className="form-group row">
                {!id && (
                  <>
                    <div className="col-lg-3">
                      <ISelect
                        value={values.sbu}
                        label="Select SBU"
                        name="sbu"
                        isDisabled={isEdit}
                        options={sbuDDL}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        dependencyFunc={(
                          currentValue,
                          allValues,
                          setter,
                          label
                        ) => {
                          resetForm({
                            ...initData,
                            year: {
                              value: yearDDL[0]?.value,
                              label: yearDDL[0]?.label,
                            },
                          });
                          setter("sbu", {
                            value: currentValue,
                            label: label,
                          });
                          getPmsReportAction(
                            setReport,
                            selectedBusinessUnit.value,
                            currentValue,
                            values.year?.value || year?.value,
                            0,
                            0,
                            false,
                            3
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <ISelect
                        label="Select Year"
                        options={yearDDL}
                        name="year"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                        value={year ? year : values.year}
                        dependencyFunc={(value, allValues, setter, label) => {
                          setYear({ value, label });
                          resetForm({
                            ...initData,
                          });
                          setter("year", { value, label });
                          dispatch(
                            getObjectiveDDLAction(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              null,
                              3,
                              value
                            )
                          );
                          setter("objective", "");
                          setter("bscPerspective", "");
                          setter("kpiname", "");
                          if (values.sbu?.value) {
                            setter("sbu", {
                              value: values.sbu?.value,
                              label: values.sbu?.label,
                            });
                          }
                          if (values.sbu?.value) {
                            getPmsReportAction(
                              setReport,
                              selectedBusinessUnit.value,
                              values.sbu?.value,
                              value,
                              0,
                              0,
                              false,
                              3
                            );
                          }
                        }}
                        values={values}
                      />
                    </div>
                    <div className="col-lg-3">
                      <ISelect
                        label="Select Section"
                        options={[
                          { value: 0, label: "None" },
                          { value: 1, label: "Production" },
                          { value: 2, label: "Sales" },
                        ]}
                        name="section"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                        value={values.section}
                        dependencyFunc={(value, allValues, setter, label) => {
                          setter("section", { value, label });
                        }}
                        values={values}
                      />
                    </div>
                  </>
                )}
              </div>
              {/* <hr style=""/> */}

              {/* KPI Details */}
              <div className={isEdit ? "d-none" : "mt-4"}>
                <hr className="mt-0 p-0" />
                <div className="row">
                  {kpiDetails(values).map((itm, idx) =>
                    !itm.isInput ? (
                      <div key={idx} className="col-lg-3">
                        <ISelect
                          value={values[itm.name]}
                          {...itm}
                          setFieldValue={setFieldValue}
                        />
                      </div>
                    ) : (
                      <div key={idx} className="col-lg-6">
                        <IInput
                          value={values.kpiname}
                          label="KPI Name"
                          name="kpiname"
                          // disabled={true}
                        />
                      </div>
                    )
                  )}
                  <div className="col-lg-3">
                    <ISelect
                      label="Select Target Freq."
                      options={frequencyDDL}
                      defaultValue={values.targetFrequency}
                      name="targetFrequency"
                      values={values}
                      setFieldValue={setFieldValue}
                      dependencyFunc={(currentValue, values) => {
                        getStrategicParticularsGridActionDispatcher(
                          currentValue,
                          year || values.year
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      // values={values}/
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      label="Set Target For All"
                      name="allValue"
                      type="number"
                      min="0"
                      onChange={(e) => {
                        setAllValue(e.target.value);
                      }}
                      disabled={!strategicParticularsGrid}
                      value={allValue}
                    />
                  </div>
                </div>
              </div>
              <div>
                {strategicParticularsGrid ? (
                  <KpiEntryGrid
                    pmsfrequencyId={values.targetFrequency?.value}
                    frequencyName={values.targetFrequency?.label}
                    startDate={values.startDate}
                    values={values}
                    allValue={allValue}
                    endDate={values.endDate}
                    objRowTargetAchivment={objRowTargetAchivment}
                    rowDtoHandler={rowDtoHandler}
                    strategicParticularsGrid={strategicParticularsGrid}
                  />
                ) : (
                  ""
                )}
              </div>

              <KpiReportTable report={report} />

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
