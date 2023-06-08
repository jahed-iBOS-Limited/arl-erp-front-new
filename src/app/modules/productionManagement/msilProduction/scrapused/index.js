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
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function ScrapusedLanding() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landigData, getlandingData, lodar] = useAxiosGet();
  const history = useHistory();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getlandingData(
      `/mes/MSIL/GetMeltingScrapUsedPercentageLandingPagination?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BusinessUnitId=${selectedBusinessUnit?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };

  return (
    <div>
      <ITable
        link="/production-management/msil-Production/scrapused/create"
        title="Scrapused Used"
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
                          `/mes/MSIL/GetMeltingScrapUsedPercentageLandingPagination?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BusinessUnitId=${selectedBusinessUnit?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
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
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "50px" }}>SL</th>
                          <th>Date</th>
                          <th>Shift</th>
                          <th>A Grade</th>
                          <th>Forign Scrap</th>
                          <th>100 Super</th>
                          <th>Cast Iron</th>
                          <th>Hard Scrap</th>
                          <th>Railway Wheel</th>
                          <th>Medium Super</th>
                          <th>MS Barbi</th>
                          <th>Tin Bundle</th>
                          <th>Sponge Iron</th>
                          <th>Scap AvgGrade</th>
                          <th>Total</th>
                          <th style={{ width: "50px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landigData?.data?.length > 0 &&
                          landigData?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-right">
                                {_dateFormatter(item?.dteDate)}
                              </td>
                              <td className="text-center">{item?.strShift}</td>
                              <td className="text-center">{item?.numAgrade}</td>
                              <td className="text-center">
                                {item?.numForeignScrap}
                              </td>
                              <td className="text-center">
                                {item?.num100Super}
                              </td>
                              <td className="text-center">
                                {item?.numCastIron}
                              </td>
                              <td className="text-center">
                                {item?.numHardScrap}
                              </td>
                              <td className="text-center">
                                {item?.numRailwayWheel}
                              </td>
                              <td className="text-center">
                                {item?.numMediumSuper}
                              </td>
                              <td className="text-center">
                                {item?.numMsbabri}
                              </td>
                              <td className="text-center">
                                {item?.numTinBundle}
                              </td>
                              <td className="text-center">
                                {item?.numSpongeIron}
                              </td>
                              <td className="text-center">
                                {item?.numScrapAvgGrade}
                              </td>
                              <td className="text-center">
                                {item?.numTotalPercent}
                              </td>

                              <td className="text-center">
                                <IEdit
                                  onClick={() => {
                                    history.push({
                                      pathname: `/production-management/msil-Production/scrapused/edit/${item?.intAutoId}`,
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
                  {landigData?.data?.length > 0 && (
                    <PaginationTable
                      count={landigData?.totalCount}
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
