/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useSelector, shallowEqual } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import { cashJournalSbuApi } from "../cashJournal/helper";
import {
  getAdjustmentJournalGridData,
  getBankJournalGridData,
  getCashJournalGridData,
  getJournalTypeDDL,
  transferJournal,
} from "./helper";
import Table from "./table/table";
import { _todayDate } from "../../../_helper/_todayDate";
import PaginationTable from "../../../_helper/_tablePagination";
import Loading from "../../../_helper/_loading";
import { IInput } from "../../../_helper/_input";
import "./transferJournal.css";

const initData = {
  sbu: "",
  journalType: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  code: "",
};

const TransferJournalToTax = () => {
  const [loading, setLoading] = useState(false);
  const [journalTypeDDL, setJournalTypeDDL] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [totalCount, setTotalCount] = useState(0);

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

  const rowDataHandler = (index, key, value) => {
    let _data = [...rowData];
    _data[index][key] = value;
    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return { ...item, isSelected: value };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.filter((item) => item.isSelected)?.length ===
      rowData?.length && rowData?.length > 0
      ? true
      : false;
  };

  const getGridData = (values, pageNo, pageSize) => {
    if ([1, 2, 3].includes(values?.journalType?.value)) {
      getCashJournalGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.journalType?.value,
        // true,
        // true,
        values?.fromDate,
        values?.toDate,
        pageNo,
        pageSize,
        setRowData,
        setLoading,
        setTotalCount,
        values?.code
      );
    } else if ([4, 5, 6].includes(values?.journalType?.value)) {
      getBankJournalGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.journalType?.value,
        true,
        true,
        values?.fromDate,
        values?.toDate,
        pageNo,
        pageSize,
        setRowData,
        setLoading,
        setTotalCount,
        values?.code
      );
    } else {
      getAdjustmentJournalGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.journalType?.value,
        true,
        true,
        values?.fromDate,
        values?.toDate,
        pageNo,
        pageSize,
        setRowData,
        setLoading,
        setTotalCount,
        values?.code
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(values, pageNo, pageSize);
  };

  const saveHandler = (values, cb) => {
    
    const data = rowData
      ?.filter((item) => item.isSelected)
      ?.map((item) => ({
        journalCode: [1, 2, 3].includes(values?.journalType?.value)
          ? item.cashJournalCode
          : [4, 5, 6].includes(values?.journalType?.value)
          ? item.bankJournalCode
          : item.adjustmentJournalCode,
      }));

    transferJournal(
      selectedBusinessUnit?.value,
      profileData?.userId,
      data,
      setLoading,
      () => {
        getGridData(values, pageNo, pageSize);
      }
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values);
        }}
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
              <CardHeader title={"Transfer Journal To Tax Account"}>
                <CardHeaderToolbar>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled={
                      !rowData?.filter((item) => item?.isSelected)?.length
                    }
                  >
                    Transfer
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
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
                        placeholder="Type"
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
                    <div className="d-flex align-items-end pt-1 ">
                      <div
                        className="mr-2 pl-4 "
                        style={{ width: "175px", position: "relative" }}
                      >
                        <span style={{ paddingRight: "10px" }}>
                          Journal Code
                        </span>
                        <IInput value={values?.code} name="code" />

                        <i
                          class="fas fa-search"
                          style={{
                            position: "absolute",
                            right: "4px",
                            top: "21px",
                            fontSize: "13px",
                          }}
                        ></i>
                      </div>
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
                {rowData?.length > 0 && (
                  <div>
                    <Table
                      values={values}
                      rowData={rowData}
                      rowDataHandler={rowDataHandler}
                      allSelect={allSelect}
                      selectedAll={selectedAll}
                    ></Table>
                  </div>
                )}
                {rowData?.length > 0 && (
                  <PaginationTable
                    count={totalCount}
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

export default TransferJournalToTax;
