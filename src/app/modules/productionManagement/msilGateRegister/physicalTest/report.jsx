/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "./../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shift: "",
  vrmName: "",
};
export default function PhysicalTestReport() {
  const [landingData, getLandingData, loading] = useAxiosGet();
  const [machineList, getMachineList] = useAxiosGet();

  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getMachineList(
      `/hcm/QCTest/GetTransactionMachineNameDDL?BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);
  const saveHandler = (values, cb) => {};

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
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
          {loading && <Loading />}
          <IForm title="Physical Test Report" isHiddenReset isHiddenSave>
            <Form>
              <div>
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shift"
                      options={[
                        { value: "1", label: "A" },
                        { value: "2", label: "B" },
                        { value: "3", label: "C" },
                      ]}
                      value={values?.shift}
                      label="Shift"
                      onChange={(valueOption) => {
                        setFieldValue("shift", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="vrmName"
                      options={machineList || []}
                      value={values?.vrmName}
                      label="VRM Name"
                      onChange={(valueOption) => {
                        setFieldValue("vrmName", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      disabled={!values?.fromDate || !values.toDate}
                      onClick={() => {
                        const FromDate = values?.fromDate
                          ? `&FromDate=${values?.fromDate}`
                          : "";
                        const ToDate = values?.toDate
                          ? `&Todate=${values?.toDate}`
                          : "";
                        const ShiftName = values?.shift
                          ? `&ShiftName=${values?.shift?.label}`
                          : "";
                        const MachineName = values?.vrmName
                          ? `&MachineName=${values?.vrmName?.label}`
                          : "";

                        getLandingData(
                          `/hcm/QCTest/DailyPhysicalTestReport?BusinessUnitId=${selectedBusinessUnit?.value}&QcTestType=PhysicalTest${FromDate}${ToDate}${ShiftName}${MachineName}`
                        );
                      }}
                      style={{ marginTop: "17px" }}
                      className="btn btn-primary ml-5"
                    >
                      View
                    </button>
                  </div>
                </div>
                {landingData?.data?.headerData[0]?.row?.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing mr-1">
                      <thead>
                        <tr>
                          <th rowSpan={2}>Sample Collect. Time</th>
                          <th rowSpan={2}>Shift</th>
                          <th rowSpan={2}>Machine Name</th>
                          {landingData?.data?.headerData[0]?.row?.map(
                            (item) => (
                              <th>{item?.testName}</th>
                            )
                          )}
                          <th>Initial set</th>
                          <th>Final set</th>
                          <th rowSpan={2}>Remarks</th>
                        </tr>
                        <tr>
                          {landingData?.data?.headerData[0]?.row?.map(
                            (item) => (
                              <th>{item?.uomName}</th>
                            )
                          )}
                          <th>min</th>
                          <th>min</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landingData?.data?.headerData?.map((item, i) => (
                          <tr key={i}>
                            <td className="text-center">{item?.tmStartTime}</td>
                            <td>{item?.shiftName}</td>
                            <td>{item?.machineName}</td>
                            {item.row?.map((item) => (
                              <td className="text-center">
                                {item?.numQuantity}
                              </td>
                            ))}
                            <td className="text-center">{item?.initialSet}</td>
                            <td className="text-center">{item?.finalSet}</td>
                            <td>{item?.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
