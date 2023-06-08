/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { getOutletSurveyReportData, getSurveyDDL } from "../helper";
import { Formik } from "formik";
import { Form } from "formik";
import "../style.css";

// React Pivote Table module Import
import "react-pivottable/pivottable.css";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";

const initData = {
  surveyName: "",
};

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

function OutletSurveyReportLanding() {
  const [state, setState] = useState();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [surveyDDL, setSurveyDDL] = useState([]);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    getSurveyDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSurveyDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const getReportView = (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getOutletSurveyReportData(
        values?.surveyName?.value,
        setGridData,
        setLoading
      );
    }
  };

  return (
    <>
      <ICustomCard title="Survey Report">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, errors, touched, setFieldValue }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="surveyName"
                      options={surveyDDL}
                      value={values?.surveyName}
                      label="Survey Name"
                      onChange={(valueOption) => {
                        setFieldValue("surveyName", valueOption);
                        setGridData([]);
                      }}
                      placeholder="Survey Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getReportView(values);
                      }}
                      disabled={!values?.surveyName}
                    >
                      Show
                    </button>
                  </div>
                </div>

                {gridData?.length > 0 && (
                  <div className="pivoteTable-sales-order-Report overflow-auto">
                    <PivotTableUI
                      data={gridData}
                      onChange={(s) => setState(s)}
                      renderers={Object.assign(
                        {},
                        TableRenderers,
                        PlotlyRenderers
                      )}
                      {...state}
                    />
                  </div>
                )}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default OutletSurveyReportLanding;
