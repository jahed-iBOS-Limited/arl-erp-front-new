/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import { getDDL } from "../helper";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  isEdit,
  tableDataGetFunc,
  rowDto,
  setRowDto,
  addItemToTheGrid,
  remover,
}) {
  // All DDL State
  const [, setBSCPerspectiveDDL] = useState([]);
  const [objectiveDDL, setObjectiveDDL] = useState([]);

  // const KPIFormatDDL = [
  //   { value: 1, label: "% of" },
  //   { value: 2, label: "# of" },
  //   { value: 3, label: "Amount" },
  // ];

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      // Get BSC Perspective DDL
      getDDL(`/pms/CommonDDL/BSCPerspectiveDDL`, setBSCPerspectiveDDL);
      // Get Objective DDL
      getDDL(
        `/pms/CommonDDL/StrategicObjectiveTypeDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
        setObjectiveDDL
      );
    }
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, additionalRent: 0 }}
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
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="">
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="BSCPerspective"
                      value={values?.BSCPerspective}
                      label="BSC Perspective"
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>KPI Name</label>
                    <InputField
                      name="KPIName"
                      value={values?.KPIName}
                      placeholder="KPI Name"
                      type="text"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="KPIFormat"
                      value={values?.KPIFormat}
                      label="KPI Format"
                      isDisabled={true}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Comments</label>
                    <InputField
                      name="Comments"
                      value={values?.Comments}
                      type="text"
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="Objective"
                      options={objectiveDDL || []}
                      value={values?.Objective}
                      label="Objective"
                      onChange={(valueOption) => {
                        setFieldValue("Objective", valueOption);
                      }}
                      placeholder="Objective"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 mt-5">
                    <button
                      className="btn btn-primary pt-2 pb-2"
                      type="button"
                      onClick={() => {
                        addItemToTheGrid(values);
                      }}
                      disabled={!values?.Objective}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ width: "35px" }}>SL</th>
                          <th>Objective</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto.map((itm, index) => (
                          <tr className="text-center">
                            <td className="text-center">{index + 1}</td>
                            <td>{itm?.Objective}</td>
                            <td className="text-center">
                              <IDelete remover={remover} id={index} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
