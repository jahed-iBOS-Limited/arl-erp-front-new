/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
const initData = {
  trainigName: { value: 0, label: "All" },
};
export default function RequisitionApproval() {
  const [isDisabled] = useState(false);
  const [, setObjprops] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData] = useAxiosGet();
  const history = useHistory();
  const [trainingNameDDL, getTrainingName] = useAxiosGet();

  useEffect(() => {
    getRowData(
      `/hcm/Training/GetTrainingScheduleLanding?pageNo=${pageNo}&pageSize=${pageSize}&intTrainingId=0`
    );
  }, []);

  useEffect(() => {
    getTrainingName(`/hcm/Training/TrainingNameDDL`);
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/hcm/Training/GetTrainingScheduleLanding?pageNo=${pageNo}&pageSize=${pageSize}&intTrainingId=${values
        ?.trainigName?.value || 0}`
    );
  };

  return (
    <IForm
      title="Training Requisition Approval"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      {false && <Loading />}
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // saveHandler(values, () => {
            //   resetForm(initData);
            // });
          }}
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
                {false && <Loading />}
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="trainigName"
                      options={
                        [{ value: 0, label: "All" }, ...trainingNameDDL] || []
                      }
                      value={values?.trainigName}
                      label="Training Name"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("trainigName", valueOption);
                        } else {
                          setFieldValue("trainigName", {
                            value: 0,
                            label: "All",
                          });
                          getRowData(
                            `/hcm/Training/GetTrainingScheduleLanding?pageNo=${pageNo}&pageSize=${pageSize}&intTrainingId=0`
                          );
                        }
                      }}
                      errors={errors}
                    />
                  </div>

                  <div style={{ marginTop: "15px" }} className="col-lg-1">
                    <button
                      type="button"
                      onClick={() => {
                        getRowData(
                          `/hcm/Training/GetTrainingScheduleLanding?pageNo=${pageNo}&pageSize=${pageSize}&intTrainingId=${values
                            ?.trainigName?.value || 0}`
                        );
                      }}
                      className="btn btn-primary"
                    >
                      Show
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Training Name</th>
                          <th>Resource Person</th>
                          <th>Month-Year</th>
                          <th style={{ width: "180px" }}>Date</th>
                          <th>Duration</th>
                          <th>Venue</th>
                          <th>Batch No (Size)</th>
                          <th style={{ width: "50px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.data?.length > 0 &&
                          rowData?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strTrainingName}</td>
                              <td>{item?.strResourcePersonName}</td>
                              <td className="text-center">{item?.monthYear}</td>
                              <td className="text-center">{`${_dateFormatter(
                                item?.dteFromDate
                              )} to ${_dateFormatter(item?.dteToDate)}`}</td>
                              <td className="text-center">
                                {`${item?.numTotalDuration}`}
                                {item?.numTotalDuration > 1
                                  ? ` hours`
                                  : ` hour`}
                              </td>
                              <td>{item?.strVenue}</td>
                              <td>{`${item?.strBatchNo} (${item?.intBatchSize})`}</td>
                              <td className="text-center">
                                <div className="d-flex justify-content-between align-items-center">
                                  <IView
                                    clickHandler={() => {
                                      // history.push(
                                      //   `/learningDevelopment/training/approval/view/${item?.intScheduleId}`
                                      // );
                                      history.push({
                                        pathname: `/learningDevelopment/training/approval/view/${item?.intScheduleId}`,
                                        state: { ...item},
                                      })
                                    }}
                                  />
                                  <IEdit
                                    onClick={() =>
                                      history.push(
                                        `/learningDevelopment/training/approval/edit/${item?.intScheduleId}`
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {rowData?.data?.length > 0 && (
                      <PaginationTable
                        count={rowData?.totalCount}
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
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </IForm>
  );
}
