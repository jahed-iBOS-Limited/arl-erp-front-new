/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import NewSelect from "../../../../_helper/_select";
import { getMonthDDL, getSalesCalender } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { setSalesCalendarSetupAction } from "../../../../_helper/reduxForLocalStorage/Actions";

// Validation schema
const validationSchema = Yup.object().shape({
  month: Yup.object().shape({
    label: Yup.string().required("Month is required"),
    value: Yup.string().required("Month is required"),
  }),
  year: Yup.object().shape({
    label: Yup.string().required("Year is required"),
    value: Yup.string().required("Year is required"),
  }),
  // itemLists: Yup.array().of(
  //   Yup.object().shape({
  //     calendarStatus: Yup.object().shape({
  //       label: Yup.string().required("Calendar Status required"),
  //       value: Yup.string().required("Calendar Status required"),
  //     }),
  //   })
  // ),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  setIsLoading,
  yearDDL,
  setGridData,
  gridDta,
}) {
  const [monthDDL, setMonthDDL] = useState([]);
  const dispatch = useDispatch();

  const salesCalendarSetup = useSelector((state) => {
    return state.localStorage.salesCalendarSetup;
  });

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getMonthDDL(setMonthDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...salesCalendarSetup, itemLists: gridDta }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(salesCalendarSetup);
            getSalesCalender(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              values?.month?.value,
              values?.year?.value,
              setGridData
              // setFieldValue
            );
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
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="month"
                      options={monthDDL || []}
                      value={values?.month}
                      label="Month"
                      onChange={(valueOption) => {
                        setFieldValue("month", valueOption);
                      }}
                      placeholder="Month"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="year"
                      options={yearDDL || []}
                      value={values?.year}
                      label="Year"
                      onChange={(valueOption) => {
                        setFieldValue("year", valueOption);
                      }}
                      placeholder="Year"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2" style={{ marginTop: "18px" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getSalesCalender(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.month?.value,
                          values?.year?.value,
                          setGridData,
                          setFieldValue
                        );
                        setFieldValue("month", values?.month);
                        setFieldValue("year", values?.year);
                        dispatch(setSalesCalendarSetupAction(values));
                      }}
                      disabled={!values?.month || !values?.year}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>

              <>
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>SL</th>
                      <th>Date</th>
                      <th>Day Count</th>
                      <th>Day Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values?.itemLists?.map((td, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>
                          <div className="text-right pr-2">
                            {_dateFormatter(td?.salesDate)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">{td?.dayCount}</div>
                        </td>
                        <td>
                          <div className="pl-2">{td?.dayName}</div>
                        </td>
                        <td>
                          <div className="px-2 routesetupDDL">
                            <NewSelect
                              options={td?.calendarStatusDDL || []}
                              value={
                                values?.itemLists[index]?.calendarStatus || ""
                              }
                              onChange={(valueOption) => {
                                setFieldValue(
                                  `itemLists.${index}.calendarStatus`,
                                  valueOption
                                );
                              }}
                              // placeholder="Calendar Status"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
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
