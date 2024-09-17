import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import TableOne from "../Table/tableOne";
import TableTwo from "../Table/tableTwo";
import { getFinancialRatioApi } from "./helper";
const groupId = "218e3d7e-f3ea-4f66-8150-bb16eb6fc606";
const reportId = "8f548c85-83d5-4c4b-938e-b99be47b0289";
const parameterValues = (values) => {
  const agingParameters = [
    { name: "dteStartDate", value: `${values?.fromDate}` },
    { name: "dteEndDate", value: `${values?.toDate}` },
    { name: "isForecast", value: `${values?.isForecast?.value}` },
  ];
  return agingParameters;
};
export default function _Form({ initData }) {
  const [loading, setLoading] = useState(false);
  const [loadingTow, setLoadingTow] = useState(false);
  const [rowDtoLeft, setLeftRowDto] = useState([]);
  const [rowDtoRight, setRightRowDto] = useState([]);

  const { businessUnitList } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const [showRDLC, setShowRDLC] = useState(false);
  return (
    <>
      {(loading || loadingTow) && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="currentBusinessUnit"
                    options={businessUnitList}
                    value={values?.currentBusinessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("currentBusinessUnit", valueOption || "");
                    }}
                    placeholder="Business Unit"
                  />
                </div>
                <div className="col-md-3">
                  <NewSelect
                    name="isForecast"
                    options={[
                      {
                        value: 0,
                        label: "Budget",
                      },
                      {
                        value: 1,
                        label: "Forecast",
                      },
                    ]}
                    value={values?.isForecast}
                    label="Budget/Forecast"
                    onChange={(valueOption) => {
                      setFieldValue("isForecast", valueOption);
                    }}
                    placeholder="Budget/Forecast"
                  />
                </div>
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                    onChange={(e) => {
                      setShowRDLC(false);
                      setRightRowDto([]);
                      setLeftRowDto([]);
                      setFieldValue("fromDate", e?.target?.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                    min={values?.fromDate}
                    onChange={(e) => {
                      setShowRDLC(false);
                      setRightRowDto([]);
                      setLeftRowDto([]);
                      setFieldValue("toDate", e?.target?.value);
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: "18px",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    disabled={
                      !values?.fromDate ||
                      !values?.toDate ||
                      !values?.currentBusinessUnit
                    }
                    onClick={() => {
                      setShowRDLC(false);
                      setRightRowDto([]);
                      setLeftRowDto([]);
                      // left
                      getFinancialRatioApi({
                        fromDate: values?.fromDate,
                        toDate: values?.toDate,
                        buId: values?.currentBusinessUnit?.value,
                        forecastType: values?.isForecast?.value || 0,
                        typeId: 2,
                        setter: setLeftRowDto,
                        setLoading: setLoading,
                      });
                      getFinancialRatioApi({
                        fromDate: values?.fromDate,
                        toDate: values?.toDate,
                        buId: values?.currentBusinessUnit?.value,
                        forecastType: values?.isForecast?.value || 0,
                        typeId: 1,
                        setter: setRightRowDto,
                        setLoading: setLoadingTow,
                      });
                    }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                  <ButtonStyleOne
                    label="Details"
                    disabled={!values?.fromDate || !values?.toDate}
                    onClick={() => {
                      setRightRowDto([]);
                      setLeftRowDto([]);
                      setShowRDLC(true);
                    }}
                  />
                </div>
              </div>
              {(rowDtoLeft?.length > 0 || rowDtoRight?.length > 0) &&
              !showRDLC ? (
                <div className="row">
                  <div className="col-lg-6">
                    {/* left */}
                    <TableOne rowDto={rowDtoLeft} />
                  </div>
                  <div className="col-lg-6">
                    {/* right */}
                    <TableTwo rowDto={rowDtoRight} />
                  </div>
                </div>
              ) : (
                <></>
              )}
              {showRDLC ? (
                <div>
                  <PowerBIReport
                    reportId={reportId}
                    groupId={groupId}
                    parameterValues={parameterValues(values)}
                    parameterPanel={false}
                  />
                </div>
              ) : (
                <></>
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
