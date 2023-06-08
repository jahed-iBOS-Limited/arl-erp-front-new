/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { useState } from "react";
import { ISelect } from "../../../../_helper/_inputDropDown";
import KpiEntryGrid from "./kpiEntryGrid";
import { setParticullersGridEmpty } from "../../../_redux/Actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import KpiReportTable from "./reportTable";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

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
  empDDL,
  weightDDL,
  bscPerspectiveDDL,
  objectiveDDL,
  yearDDL,
  employeeBasicInfo,
  getEmployeeBasicInfo,
  dataSourceDDL,
  viewRowDto,
  frequencyDDL,
  getStrategicParticularsGridActionDispatcher,
  frequencyId,
  selectedBusinessUnit,
  getBscPerspectiveDefaultValue,
  id,
  report,
  setReport,
}) {
  const [objRowTargetAchivment, setObjRowTargetAchivment] = useState({});
  const [allValue, setAllValue] = useState(0);
  const dispatch = useDispatch();
  const [kpiDDL, getKpiDDL, loader, setKpiDDL] = useAxiosGet();
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual); 

  const [year, setYear] = useState("");

  const kpiDetails = (values) => {
    return [
      {
        label: "Select Objective",
        name: "objective",
        options: objectiveDDL,
        isDisabled: !values.sbu?.value,
        dependencyFunc: (currentValue, values, setter) => {
          if(currentValue){
            getBscPerspectiveDefaultValue(currentValue).then((res) => {
              getKpiDDL(`/pms/KPI/GetKPIMasterDataDDL?accountId=${profileData?.accountId}&bscId=${res.data[0]?.value}`);
              setter("bscPerspective", res.data[0]);
              setter("kpiname","");
            });
          }
          if(!currentValue){
            setter("bscPerspective", "");
            setter("kpiname","");
            setKpiDDL([]);
          }
        },
      },

      {
        label: "Select BSC Perspective",
        name: "bscPerspective",
        options: bscPerspectiveDDL,
        dependencyFunc: (currentValue, values, setter) => {
          if(currentValue){
            getKpiDDL(`/pms/KPI/GetKPIMasterDataDDL?accountId=${profileData?.accountId}&bscId=${currentValue}`)
            setter("kpiname","");
          } 
          if(!currentValue){
            setter("kpiname","");
            setKpiDDL([])
          }
        }
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
    const size = initData?.objRowTargetAchive?.length;
    const key = frequencyId === 2 ? "monthId" : "quarterId";
    if (size) {
      const tempObj = {};
      initData.objRowTargetAchive.forEach((itm, idx) => {
        tempObj[idx] = { ...itm, [key]: itm.id };
      });
      setObjRowTargetAchivment(tempObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData]);

  useEffect(() => {
    const size = initData?.objRowTargetAchive?.length;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValue]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ objValues: values, objRowTargetAchivment }, () => {
            dispatch(setParticullersGridEmpty());
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
                <div className="col-lg-3">
                  <ISelect
                    value={values.sbu}
                    label="Select SBU"
                    name="sbu"
                    options={[]}
                    isDisabled={true}
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

                      getEmployeeBasicInfo(currentValue);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Select Year"
                    options={[]}
                    isDisabled={true}
                    name="year"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    value={values.year}
                    dependencyFunc={(value, allValues, setter, label) => {
                      // setYear({ value, label });
                      resetForm({
                        ...initData,
                      });
                      setter("year", { value, label });
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
              </div>

              <div className="mt-4">
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
                      isDisabled={true}
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
                      value={allValue}
                    />
                  </div>
                </div>
              </div>
              <div>
                {initData?.objRowTargetAchive?.length > 0 ? (
                  <KpiEntryGrid
                    pmsfrequencyId={values.targetFrequency?.value}
                    frequencyName={values.targetFrequency?.label}
                    startDate={values.startDate}
                    values={values}
                    allValue={allValue}
                    endDate={values.endDate}
                    objRowTargetAchivment={objRowTargetAchivment}
                    rowDtoHandler={rowDtoHandler}
                    strategicParticularsGrid={initData?.objRowTargetAchive}
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
