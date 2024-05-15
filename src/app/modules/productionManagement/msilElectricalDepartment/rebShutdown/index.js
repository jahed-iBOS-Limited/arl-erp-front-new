/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PaginationTable from "../../../chartering/_chartinghelper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
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
  shift: { value: "", label: "ALL" },
};
export default function RebShutdown() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landigData, getlandingData, lodar, setlandingData] = useAxiosGet();
  const history = useHistory();
  const setPositionHandler = (pageNo, pageSize, values) => {
    getlandingData(
      `/mes/MSIL/GetElectricalRebshutdownHourLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };

  return (
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
          {lodar && <Loading />}
          <IForm
            title="REB Shutdown"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/production-management/msil-Electrical/REBShutdown/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                      setlandingData([]);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    min={values?.fromDate}
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                      setlandingData([]);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shift"
                    options={[
                      { value: "", label: "ALL" },
                      { value: "A", label: "A" },
                      { value: "B", label: "B" },
                      { value: "C", label: "C" },
                      { value: "General", label: "General" },
                    ]}
                    value={values?.shift}
                    label="Shift"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shift", valueOption);
                        setlandingData([]);
                      } else {
                        setFieldValue("shift", { value: "", label: "ALL" });
                        setlandingData([]);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div style={{ marginTop: "15px" }} className="col-lg-1">
                  <button
                    type="button"
                    onClick={() => {
                      getlandingData(
                        `/mes/MSIL/GetElectricalRebshutdownHourLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
                      );
                    }}
                    className="btn btn-primary mt-1"
                    disabled={
                      !values?.fromDate || !values?.toDate || !values?.shift
                    }
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
                          <th>Date</th>
                          <th>Shift</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                          <th>Total Hour</th>
                          <th>Action</th>
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
                              <td>{item?.strShift}</td>
                              <td className="text-center">
                                {_timeFormatter(item?.tmStartTime)}
                              </td>
                              <td className="text-center">
                                {_timeFormatter(item?.tmEndTime)}
                              </td>
                              <td className="text-center">
                                {item?.tmTotalHour &&
                                  item?.tmTotalHour?.split(":")?.[0] + "H"}{" "}
                                {item?.tmTotalHour &&
                                  item?.tmTotalHour?.split(":")?.[1] + "M"}
                              </td>
                              <td className="text-center">
                                <IEdit
                                  onClick={() => {
                                    history.push({
                                      pathname: `/production-management/msil-Electrical/REBShutdown/edit/${item?.intRebshutdownId}`,
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
          </IForm>
        </>
      )}
    </Formik>
    // if there is any issue please comment upper formic block and uncomment below code
    // <div>
    //   <ITable
    //     link="/production-management/msil-Electrical/REBShutdown/create"
    //     title="REB Shutdown"
    //   >
    //     <Formik
    //       enableReinitialize={true}
    //       initialValues={initData}
    //       onSubmit={(values, { setSubmitting, resetForm }) => {}}
    //     >
    //       {({
    //         handleSubmit,
    //         resetForm,
    //         values,
    //         setFieldValue,
    //         isValid,
    //         errors,
    //         touched,
    //       }) => (
    //         <>
    //           <Form className="form form-label-right">
    //             {lodar && <Loading />}
    // <div className="form-group row global-form">
    //   <div className="col-lg-3">
    //     <InputField
    //       value={values?.fromDate}
    //       label="From Date"
    //       name="fromDate"
    //       type="date"
    //     />
    //   </div>
    //   <div className="col-lg-3">
    //     <InputField
    //       value={values?.toDate}
    //       label="To Date"
    //       name="toDate"
    //       type="date"
    //       min={values?.fromDate}
    //     />
    //   </div>
    //   <div className="col-lg-3">
    //     <NewSelect
    //       name="shift"
    //       options={[
    //         { value: "", label: "ALL" },
    //         { value: "A", label: "A" },
    //         { value: "B", label: "B" },
    //         { value: "C", label: "C" },
    //         { value: "General", label: "General" },
    //       ]}
    //       value={values?.shift}
    //       label="Shift"
    //       onChange={(valueOption) => {
    //         if (valueOption) {
    //           setFieldValue("shift", valueOption);
    //         } else {
    //           setFieldValue("shift", { value: "", label: "ALL" });
    //         }
    //       }}
    //       errors={errors}
    //       touched={touched}
    //     />
    //   </div>
    //   <div style={{ marginTop: "15px" }} className="col-lg-1">
    //     <button
    //       type="button"
    //       onClick={() => {
    //         getlandingData(
    //           `/mes/MSIL/GetElectricalRebshutdownHourLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`
    //         );
    //       }}
    //       className="btn btn-primary mt-1"
    //       disabled={
    //         !values?.fromDate || !values?.toDate || !values?.shift
    //       }
    //     >
    //       Show
    //     </button>
    //   </div>
    // </div>

    // <div style={{ marginTop: "15px" }}>
    //   <div>
    //     <table className="table table-striped table-bordered global-table">
    //       <thead>
    //         <tr>
    //           <th style={{ width: "50px" }}>SL</th>
    //           <th>Date</th>
    //           <th>Shift</th>
    //           <th>Start Time</th>
    //           <th>End Time</th>
    //           <th>Total Hour</th>
    //           <th>Action</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {landigData?.data?.length > 0 &&
    //           landigData?.data?.map((item, index) => (
    //             <tr key={index}>
    //               <td>{index + 1}</td>
    //               <td className="text-center">
    //                 {_dateFormatter(item?.dteDate)}
    //               </td>
    //               <td>{item?.strShift}</td>
    //               <td className="text-center">
    //                 {_timeFormatter(item?.tmStartTime)}
    //               </td>
    //               <td className="text-center">
    //                 {_timeFormatter(item?.tmEndTime)}
    //               </td>
    //               <td className="text-center">
    //                 {item?.tmTotalHour &&
    //                   item?.tmTotalHour?.split(":")?.[0] + "H"}{" "}
    //                 {item?.tmTotalHour &&
    //                   item?.tmTotalHour?.split(":")?.[1] + "M"}
    //               </td>

    //               <td className="text-center">
    //                 <IEdit
    //                   onClick={() => {
    //                     history.push({
    //                       pathname: `/production-management/msil-Electrical/REBShutdown/edit/${item?.intRebshutdownId}`,
    //                       state: { ...item },
    //                     });
    //                   }}
    //                 />
    //               </td>
    //             </tr>
    //           ))}
    //       </tbody>
    //     </table>
    //   </div>
    //   {landigData?.data?.length > 0 && (
    //     <PaginationTable
    //       count={landigData.totalCount}
    //       setPositionHandler={setPositionHandler}
    //       paginationState={{
    //         pageNo,
    //         setPageNo,
    //         pageSize,
    //         setPageSize,
    //       }}
    //       values={values}
    //     />
    //   )}
    // </div>
    //           </Form>
    //         </>
    //       )}
    //     </Formik>
    //   </ITable>
    // </div>
  );
}
