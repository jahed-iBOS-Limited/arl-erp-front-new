/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../chartering/_chartinghelper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { setGeneratorRunningHourLandingAction } from "../../../_helper/reduxForLocalStorage/Actions";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { ITable } from "../../../_helper/_table";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import IViewModal from "../../../_helper/_viewModal";
import BreakdownViewModal from "./Form/View";

export default function GeneratorRunningHour() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landigData, getlandingData, lodar, setlandingData] = useAxiosGet();
  const history = useHistory();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [currentItem, setCurrentItem] = useState("");
  const onClose = () => {
    setShow(!show);
  };

  const generatorRunningHourLanding = useSelector((state) => {
    return state.localStorage.generatorRunningHourLanding;
  });

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getlandingData(
      `/mes/MSIL/GetElectricalGeneratorRunningHourLanding?FromDate=${generatorRunningHourLanding?.fromDate}&ToDate=${generatorRunningHourLanding?.toDate}&Shift=${generatorRunningHourLanding?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}&BusinessUnitId=${selectedBusinessUnit.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getlandingData(
      `/mes/MSIL/GetElectricalGeneratorRunningHourLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}&BusinessUnitId=${selectedBusinessUnit.value}`
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={generatorRunningHourLanding}
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
            title="Generator Running Hour"
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
                        "/production-management/msil-Electrical/GeneratorRunningHour/create"
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
                      setFieldValue("shift", valueOption);
                      setlandingData([]);
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
                        `/mes/MSIL/GetElectricalGeneratorRunningHourLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}&BusinessUnitId=${selectedBusinessUnit.value}`
                      );
                      dispatch(
                        setGeneratorRunningHourLandingAction({
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
              </div>
              <div style={{ marginTop: "15px" }}>
                <div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "25px" }}>SL</th>
                          <th>Date</th>
                          <th>Shift</th>
                          <th>Generator Name</th>
                          {/* <th>{selectedBusinessUnit.value === 4 ? "Generation" : "Running Load"}</th> */}
                          {selectedBusinessUnit.value !== 4 && (
                            <th>Running Load</th>
                          )}
                          <th>Start Time</th>
                          <th>End Time</th>
                          <th>Total Hour</th>
                          {selectedBusinessUnit.value === 4 ? (
                            <th>Previous Reading</th>
                          ) : null}
                          {selectedBusinessUnit.value === 4 ? (
                            <th>Present Reading</th>
                          ) : null}
                          {selectedBusinessUnit.value === 4 ? (
                            <th>Generation(KWh)</th>
                          ) : null}
                          {selectedBusinessUnit.value === 4 ? (
                            <th>Generation(KW)</th>
                          ) : null}

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
                              <td className="text-center">{item?.strShift}</td>
                              <td className="text-center">
                                {item?.strGeneratorName}
                              </td>
                              {/* <td className="text-center">{selectedBusinessUnit.value === 4 ? item.numGeneration : item.intRunningLoad}</td> */}
                              {selectedBusinessUnit.value !== 4 && (
                                <td className="text-center">
                                  {item.intRunningLoad}
                                </td>
                              )}
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

                              {selectedBusinessUnit.value === 4 ? (
                                <td className="text-center">
                                  {item?.numPreviousReading}
                                </td>
                              ) : null}
                              {selectedBusinessUnit.value === 4 ? (
                                <td className="text-center">
                                  {item?.numPresentReading}
                                </td>
                              ) : null}
                              {selectedBusinessUnit.value === 4 && (
                                <td className="text-center">
                                  {item?.numGeneration}
                                </td>
                              )}
                              {selectedBusinessUnit.value === 4 ? (
                                <td>{item?.numGenerationKw}</td>
                              ) : null}

                              <td className="text-center">
                                <IEdit
                                  onClick={() => {
                                    history.push({
                                      pathname: `/production-management/msil-Electrical/GeneratorRunningHour/edit/${item?.intGeneratorRunningHourId}`,
                                      state: { ...item },
                                    });
                                  }}
                                />
                                {selectedBusinessUnit?.value === 4 ? (
                                  <span className="ml-2">
                                    <IView
                                      title="Breakdown Details"
                                      clickHandler={() => {
                                        setCurrentItem(item);
                                        setShow(true);
                                      }}
                                    />
                                  </span>
                                ) : null}
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
                    values={generatorRunningHourLanding}
                  />
                )}
              </div>
              <IViewModal
                title="Breakdown Details"
                show={show}
                onHide={onClose}
              >
                <BreakdownViewModal currentItem={currentItem} values={values} />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
    // if there is any issue please comment upper formic block and uncomment below code
    // <div>
    //   <ITable
    //     link="/production-management/msil-Electrical/GeneratorRunningHour/create"
    //     title="Generator Running Hour"
    //   >
    //     <Formik
    //       enableReinitialize={true}
    //       initialValues={generatorRunningHourLanding}
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
    //         getlandingData(
    //           `/mes/MSIL/GetElectricalGeneratorRunningHourLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&Shift=${values?.shift?.value}&pageNumber=${pageNo}&pageSize=${pageSize}&BusinessUnitId=${selectedBusinessUnit.value}`
    //         );
    //         dispatch(
    //           setGeneratorRunningHourLandingAction({
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
    //             <div style={{ marginTop: "15px" }}>
    //               <div>
    //                 <table className="table table-striped table-bordered global-table">
    //                   <thead>
    //                     <tr>
    //                       <th style={{ minWidth: "25px" }}>SL</th>
    //                       <th>Date</th>
    //                       <th>Shift</th>
    //                       <th>Generator Name</th>
    //                       {/* <th>{selectedBusinessUnit.value === 4 ? "Generation" : "Running Load"}</th> */}
    //                       {
    //                         selectedBusinessUnit.value !== 4 && <th>Running Load</th>
    //                       }
    //                       <th>Start Time</th>
    //                       <th>End Time</th>
    //                       <th>Total Hour</th>
    //                       {selectedBusinessUnit.value === 4 ? <th>Previous Reading</th> : null}
    //                       {selectedBusinessUnit.value === 4 ? <th>Present Reading</th> : null}
    //                       {selectedBusinessUnit.value === 4 ? <th>Generation(KWh)</th> : null}
    //                       {selectedBusinessUnit.value === 4 ? <th>Generation(KW)</th> : null}

    //                       <th>Action</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {landigData?.data?.length > 0 &&
    //                       landigData?.data?.map((item, index) => (
    //                         <tr key={index}>
    //                           <td>{index + 1}</td>
    //                           <td className="text-center">
    //                             {_dateFormatter(item?.dteDate)}
    //                           </td>
    //                           <td className="text-center">{item?.strShift}</td>
    //                           <td className="text-center">
    //                             {item?.strGeneratorName}
    //                           </td>
    //                           {/* <td className="text-center">{selectedBusinessUnit.value === 4 ? item.numGeneration : item.intRunningLoad}</td> */}
    //                           {selectedBusinessUnit.value !== 4 && <td className="text-center">{item.intRunningLoad}</td>}
    //                           <td className="text-center">
    //                             {_timeFormatter(item?.tmStartTime)}
    //                           </td>
    //                           <td className="text-center">
    //                             {_timeFormatter(item?.tmEndTime)}
    //                           </td>
    //                           <td className="text-center">
    //                             {item?.tmTotalHour &&
    //                               item?.tmTotalHour?.split(":")?.[0] + "H"}{" "}
    //                             {item?.tmTotalHour &&
    //                               item?.tmTotalHour?.split(":")?.[1] + "M"}
    //                           </td>

    //                           {selectedBusinessUnit.value === 4 ?
    //                             <td className="text-center">
    //                               {item?.numPreviousReading}
    //                             </td>
    //                             : null
    //                           }
    //                           {selectedBusinessUnit.value === 4 ?
    //                             <td className="text-center">
    //                               {item?.numPresentReading}
    //                             </td>
    //                             : null
    //                           }
    //                           {
    //                             selectedBusinessUnit.value === 4 && <td className="text-center">{item?.numGeneration}</td>
    //                           }
    //                           {selectedBusinessUnit.value === 4 ?
    //                             <td>
    //                               {item?.numGenerationKw}
    //                             </td>
    //                             : null
    //                           }

    //                           <td className="text-center">
    //                             <IEdit
    //                               onClick={() => {
    //                                 history.push({
    //                                   pathname: `/production-management/msil-Electrical/GeneratorRunningHour/edit/${item?.intGeneratorRunningHourId}`,
    //                                   state: { ...item },
    //                                 });
    //                               }}
    //                             />
    //                             {selectedBusinessUnit?.value === 4 ?
    //                               <span className="ml-2">
    //                                 <IView
    //                                   title="Breakdown Details"
    //                                   clickHandler={() => {
    //                                     setCurrentItem(item)
    //                                     setShow(true)
    //                                   }}
    //                                 />
    //                               </span>
    //                               : null}
    //                           </td>

    //                         </tr>
    //                       ))}
    //                   </tbody>
    //                 </table>
    //               </div>
    //               {landigData?.data?.length > 0 && (
    //                 <PaginationTable
    //                   count={landigData.totalCount}
    //                   setPositionHandler={setPositionHandler}
    //                   paginationState={{
    //                     pageNo,
    //                     setPageNo,
    //                     pageSize,
    //                     setPageSize,
    //                   }}
    //                   values={generatorRunningHourLanding}
    //                 />
    //               )}
    //             </div>
    //             <IViewModal title="Breakdown Details" show={show} onHide={onClose}>
    //               <BreakdownViewModal currentItem={currentItem} values={values} />
    //             </IViewModal>
    //           </Form>
    //         </>
    //       )}
    //     </Formik>
    //   </ITable>
    // </div>
  );
}
