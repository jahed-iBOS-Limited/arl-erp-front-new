import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { initData, validationSchema } from "./helper";

export default function COCReportLandingPage() {
  //hook
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  // state
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // api
  const [
    cocReportData,
    getCocReportData,
    getCocReportDataLoading,
  ] = useAxiosGet();
  const [
    activityNameDDL,
    getActivityNameDDL,
    getActivityNameDDLLoading,
  ] = useAxiosGet();
  const [employeeDDL, getEmployeeDDL, getEmployeeDDLLoading] = useAxiosGet();

  // use effect
  useEffect(() => {
    getActivityNameDDL(`/costmgmt/ServiceLevelAgreementCOC/GetSLAActivityDDL`);
    getEmployeeDDL(
      `/costmgmt/ServiceLevelAgreementCOC/GetCOCReport?partName=SLAEmployeeDDL&businessUnitId=${selectedBusinessUnit?.value}`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch coc report data
  function fetchCOCReportData({
    values,
    getCocReportData,
    pageNo,
    pageSize,
    cb,
  }) {
    const { employee, activityName, fromDate, toDate } = values;

    getCocReportData(
      `/costmgmt/ServiceLevelAgreementCOC/GetCOCReport?partName=COCReport&businessUnitId=${
        selectedBusinessUnit?.value
      }&activityId=${activityName?.value || 0}&employeeId=${employee?.value ||
        0}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  // submit handler
  const saveHandler = (values, cb) => {
    fetchCOCReportData({ values, getCocReportData, pageNo, pageSize, cb });
  };

  // is loading
  const isLoading =
    getCocReportDataLoading ||
    getEmployeeDDLLoading ||
    getActivityNameDDLLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          //   resetForm(initData);
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
          {isLoading && <Loading />}
          <IForm title="COC Report" isHiddenReset isHiddenBack isHiddenSave>
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="activityName"
                    options={activityNameDDL || []}
                    value={values?.activityName}
                    label="Activity Name"
                    onChange={(valueOption) => {
                      setFieldValue("activityName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="employee"
                    options={employeeDDL || []}
                    value={values?.employee}
                    label="Employee"
                    onChange={(valueOption) => {
                      setFieldValue("employee", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    type="date"
                    label="From Date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    type="date"
                    label="To Date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-1 mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onSubmit={saveHandler}
                  >
                    Show
                  </button>
                </div>
              </div>

              {cocReportData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Activity Name</th>
                        <th>Employee Id</th>
                        <th>Employee Name</th>
                        <th>Designation</th>
                        <th>Section</th>
                        <th>Business Unit</th>
                        <th>Reference No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cocReportData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.activityName}</td>
                          <td>{item?.employeeId}</td>
                          <td>{item?.employeeName}</td>
                          <td>{item?.designation}</td>
                          <td>{item?.sectionName}</td>
                          <td>{item?.businessUnitName}</td>
                          <td>{item?.referenceNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <></>
              )}

              {cocReportData?.length > 0 && (
                <PaginationTable
                  count={
                    cocReportData?.length > 0 && cocReportData[0].totalCount
                  }
                  setPositionHandler={(pageNo, pageSize, values) =>
                    fetchCOCReportData({
                      values,
                      getCocReportData,
                      pageNo,
                      pageSize,
                    })
                  }
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
