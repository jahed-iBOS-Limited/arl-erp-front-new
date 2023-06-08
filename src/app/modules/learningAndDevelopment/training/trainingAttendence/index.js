import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
const initData = {
  trainingSchedule: "",
  date: "",
};
export default function TrainingAttendence() {
  const [isDisabled] = useState(false);
  const [, setObjprops] = useState({});
  const [trainingScheduleDDL, getTrainingScheduleDDL] = useAxiosGet();
  const [, getlandingData, lodar] = useAxiosGet();
  const [rowData, setRowData] = useState([]);
  const [, saveData] = useAxiosPost();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    getTrainingScheduleDDL(`/hcm/Training/TrainingScheduleDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const saveHandler = (values, cb) => {};

  return (
    <IForm
      title="Training Attendance"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      {lodar && <Loading />}
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
                      name="trainingSchedule"
                      options={trainingScheduleDDL || []}
                      value={values?.trainingSchedule}
                      label="Training Schedule"
                      onChange={(valueOption) => {
                        if (valueOption){
                          setFieldValue("trainingSchedule", valueOption);
                          setFieldValue("date", "");
                          setRowData([]);
                        }else{
                          setFieldValue("trainingSchedule", "");
                          setFieldValue("date", "");
                          setRowData([]);
                        }
                        // setFieldValue("trainingSchedule", valueOption);
                        // setFieldValue("date", "");
                      }}
                      errors={errors}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.date}
                      label="Date"
                      name="date"
                      type="date"
                      min={_dateFormatter(values?.trainingSchedule?.fromDate)}
                      max={_dateFormatter(values?.trainingSchedule?.toDate)}
                      onChange={(e) => {
                        if (!values?.trainingSchedule?.value)
                          return toast.warn(
                            "Please Select Training Schedule First"
                          );
                        setFieldValue("date", e.target.value);
                      }}
                    />
                  </div>

                  <div style={{ marginTop: "15px" }} className="col-lg-1">
                    <button
                      type="button"
                      onClick={() => {
                        getlandingData(
                          `/hcm/Training/GetScheduleEmployeeListForTrainingAttendance?scheduleId=${values?.trainingSchedule?.value}&scheduleDate=${values?.date}`,
                          (data) => setRowData(data)
                        );
                      }}
                      className="btn btn-primary"
                      disabled={!values?.trainingSchedule || !values?.date}
                    >
                      Show
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-5">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      saveData(
                        `/hcm/Training/PresentAbsentProcessOfAttendance`,
                        rowData?.length &&
                          rowData?.map((item) => ({
                            attendanceId: item?.intAttendanceId,
                            isPresent: item?.strAttendanceStatus,
                            actionBy: profileData?.userId,
                          })),
                        () => {
                          getlandingData(
                            `/hcm/Training/GetScheduleEmployeeListForTrainingAttendance?scheduleId=${values?.trainingSchedule?.value}&scheduleDate=${values?.date}`,
                            (data) => setRowData(data)
                          );
                        },
                        true
                      );
                    }}
                  >
                    Save
                  </button>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Enroll</th>
                          <th>Employee Name</th>
                          <th>Designation</th>
                          <th>Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.length > 0 &&
                          rowData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">
                                {item?.intEmployeeId}
                              </td>
                              <td>{item?.strEmployeeName}</td>
                              <td>{item?.designation}</td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={rowData[index]?.strAttendanceStatus}
                                  onChange={(e) => {
                                    let data = [...rowData];
                                    data[index].strAttendanceStatus =
                                      e.target.checked;
                                    setRowData([...data]);
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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
