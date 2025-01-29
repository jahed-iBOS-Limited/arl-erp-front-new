import { Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { quaterDDL } from "../../../hashPerformanceCommon";
import { getYearDDL } from "../../../performancePlanning/helper";
import { getPerformanceDialogReport } from "../helper";
import PerformanceDialogTable from "./performanceDialogTable";

const initialValues = {
  quarterDDLgroup: {
    label: "",
    value: 0,
  },
};

const reportType = [
  {
    value: 1,
    label: "Work Plan",
  },
  {
    value: 2,
    label: "Action Plan",
  },
  {
    value: 3,
    label: "Eisenhower Matrix",
  },
  {
    value: 4,
    label: "Johari Window",
  },
  {
    value: 5,
    label: "Action Plan Johari Window",
  },
  {
    value: 6,
    label: "Grow Model",
  },
  {
    value: 7,
    label: "Action Plan Grow Model",
  },
];

const PerformanceDialogReport = () => {
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // eslint-disable-next-line no-unused-vars
  const { accountId, employeeId } = profileData;

  const [yearDDL, setYearDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    getYearDDL(accountId, setYearDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { handleSubmit, setFieldValue, values, errors } = useFormik({
    initialValues,
  });

  return (
    <Formik>
      <ICard title="Performance Dialog Report">
        {loading && <Loading />}
        <form className="form form-label-right" onSubmit={handleSubmit}>
          <div className="global-form">
            <div className="row">
              <div className="col-md-3">
                <NewSelect
                  name="reportTypeDDL"
                  options={reportType || []}
                  value={values?.reportTypeDDL}
                  label="Report Type"
                  onChange={(valueOption) => {
                    setFieldValue("reportTypeDDL", valueOption);
                    setRowDto([]);
                    // getPerformanceDialogReport(
                    //   valueOption?.value || 0,
                    //   valueOption?.label || 0,
                    //   values?.yearDDLgroup?.value || 0,
                    //   values?.quarterDDLgroup?.value || 0,
                    //   0,
                    //   0,
                    //   setLoading,
                    //   setRowDto
                    // );
                  }}
                  placeholder="Select Report Type"
                  errors={errors}
                />
              </div>
              <div className="col-md-3">
                <NewSelect
                  name="yearDDLgroup"
                  options={yearDDL || []}
                  value={values?.yearDDLgroup}
                  label="Select Year"
                  onChange={(valueOption) => {
                    setFieldValue("yearDDLgroup", valueOption);
                    setRowDto([]);
                    // getPerformanceDialogReport(
                    //   values?.reportTypeDDL?.value || 0,
                    //   values?.reportTypeDDL?.label || 0,
                    //   valueOption?.value || 0,
                    //   values?.quarterDDLgroup?.value || 0,
                    //   0,
                    //   0,
                    //   setLoading,
                    //   setRowDto
                    // );
                  }}
                  placeholder="Select Year"
                  errors={errors}
                />
              </div>
              {values?.reportTypeDDL?.value !== 4 && 
                <div className="col-md-3">
                  <NewSelect
                    name="quarterDDLgroup"
                    options={quaterDDL || []}
                    value={values?.quarterDDLgroup}
                    label="Quarter"
                    onChange={(valueOption) => {
                      setFieldValue("quarterDDLgroup", valueOption);
                      setRowDto([]);
                      // getPerformanceDialogReport(
                      //   values?.reportTypeDDL?.value || 0,
                      //   values?.reportTypeDDL?.label || 0,
                      //   values?.yearDDLgroup?.value || 0,
                      //   valueOption?.value || 0,
                      //   0,
                      //   0,
                      //   setLoading,
                      //   setRowDto
                      // );
                    }}
                    placeholder="Select Quarter"
                    errors={errors}
                  />
                </div>
              }
              <div className="col-md-3 pt-5">
                <button 
                className="btn btn-primary" 
                type="button"
                onClick={ ()=>{
                  getPerformanceDialogReport(
                    values?.reportTypeDDL?.value || 0,
                    values?.reportTypeDDL?.label || 0,
                    values?.yearDDLgroup?.value || 0,
                    values?.quarterDDLgroup?.value || 0,
                    0,
                    0,
                    setLoading,
                    setRowDto
                  );
                }}
                >
                  View
                </button>
              </div>
            </div>
            <div className="row">
            </div>
          </div>
        </form>
        <div>
          <PerformanceDialogTable rowDto={rowDto} />
        </div>
      </ICard>
    </Formik>
  );
};

export default PerformanceDialogReport;
