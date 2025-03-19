import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { ITable } from "../../../_helper/_table";
import PaginationTable from "../../../_helper/_tablePagination";

const initData = {
  trainigName: { value: 0, label: "All" },
  monthYear: "",
};
export default function TrainingSchedule() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [trainingNameDDL, getTrainingName] = useAxiosGet();
  const [rowData, getRowData] = useAxiosGet();
  const history = useHistory();
  useEffect(() => {
    getTrainingName(`/hcm/Training/TrainingNameDDL`);
    // getRowData(`/hcm/Training/GetTrainingScheduleLanding?intMonthId=0&intYearId=0&pageNo=${pageNo}&pageSize=${pageSize}&intTrainingId=0`);
    getRowData(`/hcm/Training/GetTrainingScheduleLanding?pageNo=${pageNo}&pageSize=${pageSize}&intTrainingId=0`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/hcm/Training/GetTrainingScheduleLanding?intMonthId=${values?.monthYear?.split(
        "-"
      )[1] || 0}&intYearId=${values?.monthYear?.split("-")[0] ||
        0}&pageNo=${pageNo}&pageSize=${pageSize}&intTrainingId=${
        values?.trainigName?.value
      }`
    );
  };

  return (
    <div>
      <ITable
        link="/learningDevelopment/training/schedule/create"
        title="Training Schedule"
      >
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
                          getRowData(`/hcm/Training/GetTrainingScheduleLanding?pageNo=${pageNo}&pageSize=${pageSize}&intTrainingId=0`);
                        }
                      }}
                      errors={errors}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.monthYear}
                      label="Month-Year"
                      name="monthYear"
                      type="month"
                    />
                  </div>
                  <div style={{ marginTop: "15px" }} className="col-lg-1">
                    <button
                      type="button"
                      onClick={() => {
                        getRowData(
                          `/hcm/Training/GetTrainingScheduleLanding?intMonthId=${values?.monthYear?.split(
                            "-"
                          )[1] || 0}&intYearId=${values?.monthYear?.split(
                            "-"
                          )[0] ||
                            0}&pageNo=${pageNo}&pageSize=${pageSize}&intTrainingId=${
                            values?.trainigName?.value
                          }`
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
                          <th>BatchSize</th>
                          <th>BatchNo</th>
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
                              <td className="text-center">
                                {item?.intBatchSize}
                              </td>
                              <td>{item?.strBatchNo}</td>
                              <td className="text-center">
                                <IEdit
                                  onClick={() =>
                                    history.push({
                                      pathname: `/learningDevelopment/training/schedule/edit/${item?.intScheduleId}`,
                                      state: { ...item },
                                    })
                                  }
                                />
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
      </ITable>
    </div>
  );
}
