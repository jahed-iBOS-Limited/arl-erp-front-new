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
import NewSelect from "../../../_helper/_select";
import { ITable } from "../../../_helper/_table";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function ProductionBreakdown() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landigData, getlandingData, lodar] = useAxiosGet();
  const history = useHistory();
  const setPositionHandler = (pageNo, pageSize, values) => {
    getlandingData(
      `/mes/MSIL/GetTblProductionBreakDownLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };

  return (
    <div>
      <ITable
        link="/production-management/msil-ProductionBreakdown/ProductionBreakdown/create"
        title="Production Breakdown"
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
                          `/mes/MSIL/GetTblProductionBreakDownLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&pageNumber=${pageNo}&pageSize=${pageSize}`
                        );
                      }}
                      className="btn btn-primary mt-1"
                      disabled={!values?.fromDate || !values?.toDate}
                    >
                      Show
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "15px" }}>
                  <div>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th style={{ width: "50px" }}>SL</th>
                            <th>Shop Floor</th>
                            <th>Breakdown Type</th>
                            <th>Machine Name</th>
                            <th>Sub Machine Name</th>
                            <th>Parts Name</th>
                            <th>Breakdown Date</th>
                            <th>Shift</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Total Time</th>
                            <th>Breakdown Details</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {landigData?.data?.length > 0 &&
                            landigData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.strShopFloorName}</td>
                                <td>{item?.strBreakDownType}</td>
                                <td>{item?.strMachineName}</td>
                                <td>{item?.strBreakDownMachineParts}</td>
                                <td>{item?.strPartsName}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteBreakDownDate)}
                                </td>

                                <td>{item?.strShift}</td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmStartTime)}
                                </td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmEndTime)}
                                </td>
                                <td className="text-center">
                                  {item?.tmTotalTime &&
                                    item?.tmTotalTime?.split(":")?.[0] +
                                      "H"}{" "}
                                  {item?.tmTotalTime &&
                                    item?.tmTotalTime?.split(":")?.[1] + "M"}
                                </td>
                                <td>{item?.strRemarks}</td>
                                <td className="text-center">
                                  <IEdit
                                    onClick={() => {
                                      history.push({
                                        pathname: `/production-management/msil-ProductionBreakdown/ProductionBreakdown/edit/${item?.intProductionBreakDownId}`,
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
