import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PaginationTable from "../../../chartering/_chartinghelper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { ITable } from "../../../_helper/_table";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function MeltingProduction() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landigData, getlandingData, lodar] = useAxiosGet();
  const history = useHistory();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getlandingData(
      `/mes/MSIL/GetMeltingProductionLandingPagination?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BusinessUnitId=${selectedBusinessUnit?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };

  return (
    <div>
      <ITable
        link="/production-management/msil-Production/meltingproduction/create"
        title="Melting Production"
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
                          `/mes/MSIL/GetMeltingProductionLandingPagination?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BusinessUnitId=${selectedBusinessUnit?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
                        );
                      }}
                      className="btn btn-primary"
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
                            <th>Date</th>
                            <th>Shift</th>
                            <th style={{ width: "180px" }}>Heat No</th>
                            <th>Total ScrapCal</th>
                            <th>Ferro Manganese</th>
                            <th>Silicon Manganese</th>
                            <th>Ferro Silicon</th>
                            <th>Total Chemical Cal</th>
                            <th>Production Qty Pcs</th>
                            <th>Production Qty Kgs Cal</th>
                            <th>Chemical Per MTCal</th>
                            <th>Heat Start Time</th>
                            <th>Heat End Time</th>
                            <th>Total Heat Time</th>
                            <th>Billet Weight</th>
                            <th>Wastage Percentage</th>
                            <th>Wastage Kgs Cal</th>
                            <th>REB Consumption</th>
                            <th>MT REB Used Cal</th>
                            <th>Power Cut Hours</th>
                            <th>Power Cut Mitutes</th>
                            <th>M.Panel No</th>
                            <th>Crucible No</th>
                            <th>Crucible Lining Heat No</th>
                            <th style={{ width: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {landigData?.data?.length > 0 &&
                            landigData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteDate)}
                                </td>
                                <td className="text-center">
                                  {item?.strShift}
                                </td>
                                <td>{item?.strHeatNo}</td>
                                <td className="text-center">
                                  {item?.numTotalScrapCal}
                                </td>
                                <td className="text-center">
                                  {item?.numFerroManganese}
                                </td>
                                <td className="text-center">
                                  {item?.numSiliconManganese}
                                </td>
                                <td className="text-center">
                                  {item?.numFerroSilicon}
                                </td>
                                <td className="text-center">
                                  {item?.numTotalChemicalCal}
                                </td>
                                <td className="text-center">
                                  {item?.intProductionQtyPcs}
                                </td>
                                <td className="text-center">
                                  {item?.numProductionQtyKgsCal}
                                </td>
                                <td className="text-center">
                                  {item?.numChemicalPerMTCal}
                                </td>
                                <td className="text-center">
                                  {item?.tmHeatStartTime &&
                                    _timeFormatter(item?.tmHeatStartTime)}
                                </td>
                                <td className="text-center">
                                  {item?.tmHeatEndTime &&
                                    _timeFormatter(item?.tmHeatEndTime)}
                                </td>
                                <td className="text-center">
                                  {item?.tmTotalHeatTime &&
                                    item?.tmTotalHeatTime?.split(":")?.[0] +
                                      "H"}{" "}
                                  {item?.tmTotalHeatTime &&
                                    item?.tmTotalHeatTime?.split(":")?.[1] +
                                      "M"}
                                </td>
                                <td className="text-center">
                                  {item?.numPerBilletWeight}
                                </td>
                                <td className="text-center">
                                  {item?.numWastagePercentage}
                                </td>
                                <td className="text-center">
                                  {item?.numWastageKgsCal}
                                </td>
                                <td className="text-center">
                                  {item?.numRebconsumption}
                                </td>
                                <td className="text-center">
                                  {item?.numPerMTREBUsedCal}
                                </td>
                                <td className="text-center">
                                  {item?.tmPowerCutHours &&
                                    item?.tmPowerCutHours?.split(":")[0]}
                                </td>
                                <td className="text-center">
                                  {item?.tmPowerCutMitutes &&
                                    item?.tmPowerCutMitutes?.split(":")[1]}
                                </td>
                                <td className="text-center">
                                  {item?.intMpanelNo}
                                </td>
                                <td className="text-center">
                                  {item?.intCrucibleNo}
                                </td>
                                <td className="text-center">
                                  {item?.intCrucibleLiningHeatNo}
                                </td>
                                <td className="text-center">
                                  <IEdit
                                    onClick={() => {
                                      history.push({
                                        pathname: `/production-management/msil-Production/meltingproduction/edit/${item?.intAutoId}`,
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
                  {landigData?.data?.length > 0 && (
                    <PaginationTable
                      count={landigData.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ITable>
    </div>
  );
}
