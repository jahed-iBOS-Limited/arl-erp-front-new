/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useSelector, shallowEqual } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import Table from "./table/table";
import { _todayDate } from "../../../_helper/_todayDate";
import PaginationTable from "../../../_helper/_tablePagination";
import Loading from "../../../_helper/_loading";
import { getJournalTypeDDL } from "../../../financialManagement/financials/transferJournalToTax/helper";
import { cashJournalSbuApi } from "../../../financialManagement/financials/cashJournal/helper";
import { getAccountJournalLandingData } from "./helper";
import "../../../financialManagement/financials/adjustmentJournal/adjustmentJournal.css";

const initData = {
  sbu: "",
  journalType: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const AccountJournal = () => {
  const [loading, setLoading] = useState(false);
  const [journalTypeDDL, setJournalTypeDDL] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getJournalTypeDDL(setJournalTypeDDL);
    cashJournalSbuApi(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSbuDDL
    );
  }, []);

  const getGridData = (values, pageNo, pageSize) => {
    getAccountJournalLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.sbu?.value,
      values?.journalType?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      setRowData,
      setLoading
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(values, pageNo, pageSize);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={(values) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <div>
            {loading && <Loading />}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Account Journal"></CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="form-group row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        isSearchable={true}
                        options={sbuDDL || []}
                        name="sbu"
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                          setRowData([]);
                        }}
                        placeholder="SBU"
                        value={values?.sbu}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        isSearchable={true}
                        options={journalTypeDDL || []}
                        name="journalType"
                        placeholder="Journal Type"
                        onChange={(valueOption) => {
                          setFieldValue("journalType", valueOption);
                          setRowData([]);
                        }}
                        value={values?.journalType}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col d-flex justify-content-end align-items-center ">
                      <button
                        type="button"
                        onClick={() => getGridData(values, pageNo, pageSize)}
                        className="btn btn-primary mt-2"
                        disabled={!values?.sbu || !values?.journalType}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Form>
                {rowData?.data?.length > 0 && (
                  <div>
                    <Table values={values} rowData={rowData?.data}></Table>
                  </div>
                )}
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
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
};

export default AccountJournal;
