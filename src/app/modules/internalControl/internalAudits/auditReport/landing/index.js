import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getAuditReportDataHandler, initData, validation } from "../helper";
import AuditReportLandingTable from "./table";

const AuditReportPage = () => {
  // redux selector
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  // hook
  useEffect(() => {
    // get audit report data initially
    getAuditReportDataHandler(
      profileData,
      pageNo,
      pageSize,
      getAuditReportData,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // state
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // axios get
  const [
    auditReportData,
    getAuditReportData,
    getAuditReportDataLoading,
  ] = useAxiosGet();

  // save handler
  const saveHandler = (values, cb) => {
    // get audit report data on submit with from date & to date
    getAuditReportDataHandler(
      profileData,
      pageNo,
      pageSize,
      getAuditReportData,
      values
    );
  };

  // landing data position handler
  const setPositionHandler = (pageNo, pageSize, values) => {
    // get audit report data with pagination
    getAuditReportDataHandler(
      profileData,
      pageNo,
      pageSize,
      getAuditReportData,
      values
    );
  };

  //
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validation}
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
          {getAuditReportDataLoading && <Loading />}
          <IForm title="Audit Report" isHiddenReset isHiddenBack isHiddenSave>
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
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
                  <div>
                    <button
                      className="btn btn-primary mt-4"
                      type="submit"
                      onSubmit={() => handleSubmit()}
                    >
                      Show
                    </button>
                  </div>
                </div>

                {/* Audit Report Table */}
                {auditReportData?.length > 0 && (
                  <AuditReportLandingTable objProps={{ auditReportData }} />
                )}

                {auditReportData?.length > 0 && (
                  <PaginationTable
                    count={auditReportData?.length}
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
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default AuditReportPage;
