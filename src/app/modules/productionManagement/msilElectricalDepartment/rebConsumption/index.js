/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PaginationTable from "../../../chartering/_chartinghelper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { setRebConsumptionLandingAction } from "../../../_helper/reduxForLocalStorage/Actions";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { ITable } from "../../../_helper/_table";
import IViewModal from "../../../_helper/_viewModal";
import JVModalView from "./jvView";

export default function REBConsumption() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landingData, getLandingData, lodar, setLandingData] = useAxiosGet();
  const history = useHistory();
  const dispatch = useDispatch();
  const [showJVModal, setShowJVModal] = useState(false);

  const rebConsumptionLanding = useSelector((state) => {
    return state.localStorage.rebConsumptionLanding;
  });
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getLandingData(
      `/mes/MSIL/GetElectricalRebconsumptionLanding?FromDate=${rebConsumptionLanding?.fromDate}&ToDate=${rebConsumptionLanding?.toDate}&Shift=${rebConsumptionLanding?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}&BusinessUnitId=${selectedBusinessUnit.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(
      `/mes/MSIL/GetElectricalRebconsumptionLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}&BusinessUnitId=${selectedBusinessUnit.value}`
    );
  };

  const timeFormatter = (time) => {
    if (time) {
      const timeArray = time.split(":");
      const hour = timeArray[0];
      const min = timeArray[1];
      const sec = timeArray[2];
      if (hour > 12) {
        return `${hour - 12}:${min} PM`;
      } else {
        return `${hour}:${min} AM`;
      }
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={rebConsumptionLanding}
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
            title="REB Consumption"
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
                        "/production-management/msil-Electrical/REBConsumption/create"
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
                      setLandingData([]);
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
                      setLandingData([]);
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
                      setFieldValue("shift", valueOption);
                      setLandingData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div style={{ marginTop: "15px" }} className="col-lg-1">
                  <button
                    type="button"
                    onClick={() => {
                      getLandingData(
                        `/mes/MSIL/GetElectricalRebconsumptionLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}&BusinessUnitId=${selectedBusinessUnit.value}`
                      );
                      dispatch(
                        setRebConsumptionLandingAction({
                          ...values,
                        })
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
                <div className="col-log-1">
                  <button
                    onClick={() => {
                      setShowJVModal(true);
                    }}
                    type="button"
                    className="btn btn-primary mt-5"
                  >
                    Month End
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "50px" }}>SL</th>
                          <th>Date</th>
                          <th>Shift</th>
                          <th>REB Consumption Type Name</th>
                          <th>Previous KWH (Meter Reading)</th>
                          <th>Present KWH (Meter Reading)</th>
                          <th>Total REB Consumption</th>
                          <th>Total REB Consumption Unit</th>
                          {selectedBusinessUnit?.value === 4 ? (
                            <th>Time</th>
                          ) : null}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landingData?.data?.length > 0 &&
                          landingData?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">
                                {_dateFormatter(item?.dteDate)}
                              </td>
                              <td>{item?.strShift}</td>
                              <td>{item?.stRebconsumptionTypeName}</td>
                              <td className="text-center">
                                {(item?.intStartKwh || 0) +
                                  (item?.intStartKwh2 || 0) +
                                  (item?.intStartKwh3 || 0) +
                                  (item?.intStartKwh4 || 0)}
                              </td>
                              <td className="text-center">
                                {(item?.intEndKwh || 0) +
                                  (item?.intEndKwh2 || 0) +
                                  (item?.intEndKwh3 || 0) +
                                  (item?.intEndKwh4 || 0)}
                              </td>
                              <td className="text-center">
                                {item?.intTotalRebconsumedUnitCal}
                              </td>
                              <td className="text-center">
                                {item?.intTotalRebconsumpedAfterMultiplyCal}
                              </td>
                              {selectedBusinessUnit?.value === 4 ? (
                                <td className="text-center">
                                  {/* {convertTime(item?.tmReadingTime)} */}
                                  {timeFormatter(item?.tmReadingTime)}
                                </td>
                              ) : null}
                              <td className="text-center">
                                <IEdit
                                  onClick={() => {
                                    history.push({
                                      pathname: `/production-management/msil-Electrical/REBConsumption/edit/${item?.intRebconsumptionId}`,
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
                {landingData?.data?.length > 0 && (
                  <PaginationTable
                    count={landingData.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={rebConsumptionLanding}
                  />
                )}
                {showJVModal && (
                  <IViewModal
                    title={"JV View for REB Consumption"}
                    show={showJVModal}
                    onHide={() => {
                      setShowJVModal(false);
                    }}
                  >
                    <JVModalView
                      values={values}
                      buId={selectedBusinessUnit?.value}
                      setShowJVModal={setShowJVModal}
                    />
                  </IViewModal>
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
    // if there is any issue please comment upper formic block and uncomment below code.
    // <div>
    //   <ITable
    //     link="/production-management/msil-Electrical/REBConsumption/create"
    //     title="REB Consumption"
    //   >
    //     <Formik
    //       enableReinitialize={true}
    //       initialValues={rebConsumptionLanding}
    //       onSubmit={(values, { setSubmitting, resetForm }) => { }}
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
    //       onChange={(e) => {
    //         setFieldValue("fromDate", e.target.value);
    //       }}
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
    //         setFieldValue("shift", valueOption);
    //       }}
    //       errors={errors}
    //       touched={touched}
    //     />
    //   </div>
    //   <div style={{ marginTop: "15px" }} className="col-lg-1">
    //     <button
    //       type="button"
    //       onClick={() => {
    //         getLandingData(
    //           `/mes/MSIL/GetElectricalRebconsumptionLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}&BusinessUnitId=${selectedBusinessUnit.value}`
    //         );
    //         dispatch(
    //           setRebConsumptionLandingAction({
    //             ...values,
    //           })
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
    //           <th style={{ minWidth: "50px" }}>SL</th>
    //           <th>Date</th>
    //           <th>Shift</th>
    //           <th>REB Consumption Type Name</th>
    //           <th>Previous KWH (Meter Reading)</th>
    //           <th>Present KWH (Meter Reading)</th>
    //           <th>Total REB Consumption</th>
    //           <th>Total REB Consumption Unit</th>
    //           {
    //             selectedBusinessUnit?.value === 4 ? <th>Time</th> : null
    //           }
    //           <th>Action</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {landingData?.data?.length > 0 &&
    //           landingData?.data?.map((item, index) => (
    //             <tr key={index}>
    //               <td>{index + 1}</td>
    //               <td className="text-center">
    //                 {_dateFormatter(item?.dteDate)}
    //               </td>
    //               <td>{item?.strShift}</td>
    //               <td>{item?.stRebconsumptionTypeName}</td>
    //               <td className="text-center">
    //                 {item?.intStartKwh}
    //               </td>
    //               <td className="text-center">{item?.intEndKwh}</td>
    //               <td className="text-center">
    //                 {item?.intTotalRebconsumedUnitCal}
    //               </td>
    //               <td className="text-center">
    //                 {item?.intTotalRebconsumpedAfterMultiplyCal}
    //               </td>
    //               {
    //                 selectedBusinessUnit?.value === 4 ? <td className="text-center">
    //                   {/* {convertTime(item?.tmReadingTime)} */}
    //                   {timeFormatter(item?.tmReadingTime)}
    //                 </td> : null
    //               }
    //               <td className="text-center">
    //                 <IEdit
    //                   onClick={() => {
    //                     history.push({
    //                       pathname: `/production-management/msil-Electrical/REBConsumption/edit/${item?.intRebconsumptionId}`,
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
    //   {landingData?.data?.length > 0 && (
    //     <PaginationTable
    //       count={landingData.totalCount}
    //       setPositionHandler={setPositionHandler}
    //       paginationState={{
    //         pageNo,
    //         setPageNo,
    //         pageSize,
    //         setPageSize,
    //       }}
    //       values={rebConsumptionLanding}
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
