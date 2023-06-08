import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getEmployeeDDL, getTerritoryDDL } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  routeDate: Yup.date().required("Route Date is required"),
  routeCategory: Yup.object().shape({
    label: Yup.string().required("Route Category is required"),
    value: Yup.string().required("Route Category is required"),
  }),
  routeLocation: Yup.object().shape({
    label: Yup.string().required("Route Location is required"),
    value: Yup.string().required("Route Location is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  // disableHandler,
  location,
  tourId,
  setIsRoutePlanWeekwise,
  weeklyRowDto,
  setWeeklyCategoryHandler,
  monthlyRowDto,
  setMonthlyCategoryHandler,
  isEdit,
}) {
  const [territoryNameDDL, setTerritoryNameDDL] = useState([]);
  const [employeeDDL, setEmployeeDDL] = useState([]);

  const tourCategoryLocationDDL = [
    { value: 1, label: "Tour" },
    { value: 2, label: "Leave" },
    { value: 3, label: "Movement" },
    { value: 4, label: "Meeting" },
  ];

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getEmployeeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setEmployeeDDL
      );
      getTerritoryDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTerritoryNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  console.log("initData",initData)

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          // routeDate: tourId ? initData?.routeDate : location?.tourDate,
          employeeName: tourId ? initData?.employeeName : "",
          routeCategory: {
            value: tourCategoryLocationDDL[0]?.value,
            label: tourCategoryLocationDDL[0]?.label,
          },
          routeLocation: {
            value: territoryNameDDL[0]?.value,
            label: territoryNameDDL[0]?.label,
          },
        }}
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
                    <InputField
                      type="date"
                      value={values?.routeDate}
                      label="Tour Month"
                      placeholder="Tour Month"
                      name="routeDate"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="employeeName"
                      options={employeeDDL}
                      value={values?.employeeName}
                      label="Employee Name"
                      onChange={(valueOption) => {
                        valueOption?.name === "Level-1"
                          ? setIsRoutePlanWeekwise(false)
                          : setIsRoutePlanWeekwise(true);
                        setFieldValue("employeeName", valueOption);
                      }}
                      placeholder="Employee Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>

              {values?.employeeName?.level && values?.employeeName?.level  !== 2  && (
                <>
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Date</th>
                        <th>Day Name</th>
                        <th>Category</th>
                        <th>Tour Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyRowDto?.map((td, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <div className="pl-2">{td?.dteTourDate}</div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.strDayName}</div>
                          </td>
                          <td>
                            <div className="px-2 routesetupDDL">
                              <NewSelect
                                name="routeCategory"
                                options={tourCategoryLocationDDL}
                                value={td?.routeCategory || ""}
                                // label="Employee Name"
                                onChange={(valueOption) => {
                                  setMonthlyCategoryHandler(
                                    index,
                                    {
                                      value: valueOption?.value,
                                      label: valueOption?.label,
                                    },
                                    "routeCategory"
                                  );
                                }}
                                // placeholder="Route Category"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="px-2 routesetupDDL">
                              <NewSelect
                                name="routeLocation"
                                options={territoryNameDDL}
                                value={td?.routeLocation || ""}
                                // label="Employee Name"
                                onChange={(valueOption) => {
                                  setMonthlyCategoryHandler(
                                    index,
                                    {
                                      value: valueOption?.value,
                                      label: valueOption?.label,
                                    },
                                    "routeLocation"
                                  );
                                }}
                                // placeholder="Route Category"
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
              )}

              {values?.employeeName?.level === 2 && (
                <>
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Day Name</th>
                        <th>Category</th>
                        <th>Tour Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyRowDto?.map((td, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <div className="pl-2">{td?.dayName}</div>
                          </td>
                          <td>
                            <div className="px-2 routesetupDDL">
                              <NewSelect
                                name="routeCategory"
                                options={tourCategoryLocationDDL}
                                value={td?.routeCategory || ""}
                                // label="Employee Name"
                                onChange={(valueOption) => {
                                  setWeeklyCategoryHandler(
                                    index,
                                    {
                                      value: valueOption?.value,
                                      label: valueOption?.label,
                                    },
                                    "routeCategory"
                                  );
                                }}
                                // placeholder="Route Category"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="px-2 routesetupDDL">
                              <NewSelect
                                name="routeLocation"
                                options={territoryNameDDL}
                                value={td?.routeLocation || ""}
                                // label="Employee Name"
                                onChange={(valueOption) => {
                                  setWeeklyCategoryHandler(
                                    index,
                                    {
                                      value: valueOption?.value,
                                      label: valueOption?.label,
                                    },
                                    "routeLocation"
                                  );
                                }}
                                // placeholder="Route Category"
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
              )}

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
