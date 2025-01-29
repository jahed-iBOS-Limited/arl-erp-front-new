/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PaginationTable from "../../../chartering/_chartinghelper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import NewSelect from "../../../_helper/_select";
import { ITable } from "../../../_helper/_table";
import { _todayDate } from "../../../_helper/_todayDate";
import { _timeFormatter } from "./../../../chartering/_chartinghelper/_timeFormatter";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function QualityReport() {
  const [landigData, getlandingData, lodar] = useAxiosGet();
  const history = useHistory();

  return (
    <div>
      <ITable
        link="/production-management/msil-Rolling/QualityReport/create"
        title="Quality Report"
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
                {lodar && <Loading />}
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      min={values?.fromDate}
                    />
                  </div>

                  <div style={{ marginTop: "15px" }} className="col-lg-1">
                    <button
                      type="button"
                      onClick={() => {
                        getlandingData(
                          `/mes/MSIL/QualityReportLanding?fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                        );
                      }}
                      className="btn btn-primary mt-1"
                      disabled={!values?.fromDate || !values?.toDate}
                    >
                      Show
                    </button>
                  </div>
                </div>

                <div
                  style={{ marginTop: "15px" }}
                  className="loan-scrollable-table"
                >
                  <div className="scroll-table _table">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ minWidth: "50px" }}>SL</th>
                            <th style={{ minWidth: "70px" }}>Heat No</th>
                            <th style={{ minWidth: "110px" }}>
                              Date of Physical test
                            </th>
                            <th style={{ minWidth: "110px" }}>
                              Physical test time
                            </th>
                            <th style={{ minWidth: "150px" }}>Grade</th>
                            <th style={{ minWidth: "90px" }}>Actual Area</th>
                            <th style={{ minWidth: "90px" }}>Nominal dia mm</th>
                            <th style={{ minWidth: "90px" }}>Actual Dia mm</th>
                            <th style={{ minWidth: "90px" }}>
                              Actual unit Wt Kg
                            </th>
                            <th style={{ minWidth: "90px" }}>
                              Elongation After fracture %
                            </th>
                            <th style={{ minWidth: "90px" }}>Yield Load Kn</th>
                            <th style={{ minWidth: "90px" }}>
                              Yield strength MPa
                            </th>
                            <th style={{ minWidth: "90px" }}>
                              Maximum force Kn
                            </th>
                            <th style={{ minWidth: "90px" }}>
                              Tensile Strength MPa
                            </th>
                            <th style={{ minWidth: "90px" }}>Rupture Load</th>
                            <th style={{ minWidth: "90px" }}>TS/YS Ratio</th>
                            <th style={{ minWidth: "90px" }}>Bend Test</th>
                            <th style={{ minWidth: "90px" }}>
                              Production by nature of billet
                            </th>
                            <th style={{ minWidth: "90px" }}>
                              Billet Tempreture C
                            </th>
                            <th style={{ minWidth: "90px" }}>
                              Furnace Tempreture C
                            </th>
                            <th style={{ minWidth: "90px" }}>
                              TMT Water Tempreture C
                            </th>
                            <th style={{ minWidth: "90px" }}>
                              Bar entry Tempreture C
                            </th>
                            <th style={{ minWidth: "90px" }}>
                              Bar exite Tempreture C
                            </th>
                            <th style={{ minWidth: "90px" }}>Water flow</th>
                            <th style={{ minWidth: "90px" }}>Water Pressure</th>
                            <th>Remarks</th>
                            <th style={{ minWidth: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {landigData?.length > 0 &&
                            landigData?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  {item.strHeatNo}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteTestDate)}
                                </td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmTestTime)}
                                </td>
                                <td>{item.strGrade}</td>
                                <td className="text-center">
                                  {item?.numActualArea}
                                </td>
                                <td>{item?.strNominalDia}</td>
                                <td className="text-center">
                                  {item?.numActualDia}
                                </td>
                                <td className="text-center">
                                  {item?.numActualUnitWtKg}
                                </td>
                                <td className="text-center">
                                  {item?.numElongationAfterFracture}
                                </td>
                                <td className="text-center">
                                  {item?.numYieldLoad}
                                </td>
                                <td className="text-center">
                                  {item?.numYieldStrengthCal.toFixed(6)}
                                </td>
                                <td className="text-center">
                                  {item?.numMaximumForce}
                                </td>
                                <td className="text-center">
                                  {item?.numTensileStrengthCal.toFixed(6)}
                                </td>
                                <td className="text-center">
                                  {item?.numRuptureLoad}
                                </td>
                                <td className="text-center">
                                  {item?.numTsYsratioCal}
                                </td>
                                <td>{item?.strBendTest}</td>
                                <td>{item?.strNatureOfBillet}</td>
                                <td className="text-center">
                                  {item?.numBilletTempreture}
                                </td>
                                <td className="text-center">
                                  {item?.numFurnaceTempreture}
                                </td>
                                <td className="text-center">
                                  {item?.numTmtwaterTempreture}
                                </td>
                                <td className="text-center">
                                  {item?.numBarEntryTempreture}
                                </td>
                                <td className="text-center">
                                  {item?.numBarExitTempreture}
                                </td>
                                <td className="text-center">
                                  {item?.numWaterFlow}
                                </td>
                                <td className="text-center">
                                  {item?.numWaterPressure}
                                </td>
                                <td>{item?.strRemarks}</td>
                                <td className="text-center">
                                  <IEdit
                                    onClick={() => {
                                      history.push({
                                        pathname: `/production-management/msil-Rolling/QualityReport/edit/${item?.intRollingQualityDataId}`,
                                        state: { ...item },
                                      });
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ITable>
    </div>
  );
}
