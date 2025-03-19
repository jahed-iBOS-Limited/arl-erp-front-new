/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import NewSelect from "../../../../_helper/_select";
import IButton from "../../../../_helper/iButton";

const IndustrialTestingCostLandingForm = ({ obj }) => {
  const {
    values,
    pageNo,
    pageSize,
    testTypes,
    projectTypes,
    performPlaces,
    setFieldValue,
    getLandingData,
  } = obj;

  return (
    <>
      <form className="form form-label-right">
        <div className="global-form row">
          <div className="col-lg-3">
            <NewSelect
              name="projectType"
              options={[{ value: 0, label: "All" }, ...projectTypes] || []}
              value={values?.projectType}
              label="Project Type"
              onChange={(valueOption) => {
                setFieldValue("projectType", valueOption);
              }}
              placeholder="Project Type"
            />
          </div>
          <div className="col-lg-3">
            <NewSelect
              name="testType"
              options={[{ value: 0, label: "All" }, ...testTypes] || []}
              value={values?.testType}
              label="Test Type"
              onChange={(valueOption) => {
                setFieldValue("testType", valueOption);
              }}
              placeholder="Test Type"
            />
          </div>
          <div className="col-lg-3">
            <NewSelect
              name="testPerformPlace"
              options={[{ value: 0, label: "All" }, ...performPlaces] || []}
              value={values?.testPerformPlace}
              label="Test Perform Place"
              onChange={(valueOption) => {
                setFieldValue("testPerformPlace", valueOption);
              }}
              placeholder="Test Perform Place"
            />
          </div>

          <IButton
            onClick={() => {
              getLandingData(pageNo, pageSize, values);
            }}
            disabled={!values?.fromDate || !values?.toDate}
          />
        </div>
      </form>
    </>
  );
};

export default IndustrialTestingCostLandingForm;
