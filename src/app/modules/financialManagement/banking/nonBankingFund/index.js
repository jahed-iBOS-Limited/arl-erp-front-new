import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import PaginationTable from "../../../_helper/_tablePagination";
const initData = {
  partner: "",
  depositeType: "",
  status: "",
};
export default function NonBankingFund() {
  const saveHandler = (values, cb) => {};
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [tableData, geTableData, tableDataLoader, setTableData] = useAxiosGet();
  const history = useHistory();
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const getLandingData = (values, pageNo, pageSize) => {
    // geTableData()
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {tableDataLoader && <Loading />}
          <IForm
            title="Non Banking Fund"
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
                        "/financial-management/banking/NonBankingFund/create"
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
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="partner"
                      options={[
                        { value: 1, label: "partner-1" },
                        { value: 2, label: "partner-2" },
                      ]}
                      value={values?.partner}
                      label="Partner"
                      onChange={(valueOption) => {
                        setFieldValue("partner", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="depositeType"
                      options={[
                        { value: 1, label: "depositeType-1" },
                        { value: 2, label: "depositeType-2" },
                      ]}
                      value={values?.depositeType}
                      label="Deposite Type"
                      onChange={(valueOption) => {
                        setFieldValue("depositeType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 1, label: "Active" },
                        { value: 2, label: "Close" },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      className="btn btn-primary mt-5"
                      type="button"
                      onClick={() => {
                        console.log("clicked");
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                {/* table */}
                <div className="mt-3">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Partner Name</th>
                        <th>Deposite Type</th>
                        <th>Security Number</th>
                        <th>Issue Date</th>
                        <th>End Date</th>
                        <th>T Days</th>
                        <th>Purpose</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                  {tableData?.data?.length > 0 && (
                    <PaginationTable
                      count={tableData?.totalCount}
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
          </IForm>
        </>
      )}
    </Formik>
  );
}
