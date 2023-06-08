import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import * as Yup from "yup";

import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";
import { getTafsilData, getScheduleTypeDDL, getFiscalYearDDL } from "../helper";
import NewSelect from "../../../../_helper/_select";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";

const initData = {
  scheduleType: { value: "All", label: "All" },
  fiscalYear: "",
};
const validationSchema = Yup.object().shape({});

export function TafsilTable() {
  const [loading, setLoading] = useState(false);

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [scheduleTypeDDL, setScheduleTypeDDL] = React.useState([]);
  const [gridData, setGridData] = React.useState({});
  const [yearDDL, setYearDDL] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getScheduleTypeDDL(setScheduleTypeDDL);
    getFiscalYearDDL(setYearDDL);
  }, []);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getTafsilData("All", 2021, pageNo, pageSize, setLoading, setGridData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const getGridData = (values, searchValue) => {
    getTafsilData(
      values?.scheduleType?.value || "",
      values?.fiscalYear?.value || 0,
      pageNo,
      pageSize,
      setLoading,
      setGridData,
      searchValue
    );
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values, searchValue) => {
    getTafsilData(
      values?.scheduleType?.value || "",
      values?.fiscalYear?.value || 0,
      pageNo,
      pageSize,
      setLoading,
      setGridData,
      searchValue || ""
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    getGridData(values, searchValue);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          getGridData(values, "");
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Tafsil"></CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="scheduleType"
                        options={scheduleTypeDDL}
                        value={values?.scheduleType}
                        label="Schedule Type"
                        onChange={(valueOption) => {
                          // setScheduleType(valueOption);
                          setGridData({})
                          setFieldValue("scheduleType", valueOption);
                        }}
                        placeholder="Schedule Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="fiscalYear"
                        options={yearDDL || []}
                        value={values?.fiscalYear}
                        label="Fiscal Year"
                        onChange={(valueOption) => {
                          setGridData({})
                          setFieldValue("fiscalYear", valueOption);
                        }}
                        placeholder="Year"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-1 mt-5">
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={!values?.scheduleType || !values?.fiscalYear}
                      >
                        View
                      </button>
                    </div>

                    <div className="col-lg text-right">
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="btn btn-primary mt-5"
                        table="table-to-xls"
                        filename="Tafsil"
                        sheet="tablexls"
                        buttonText="Export Excel"
                      />
                    </div>
                  </div>
                </Form>
                <div className="row cash_journal">
                  {loading && <Loading />}
                  <div className="col-lg-12 mt-2">
                    <PaginationSearch
                      placeholder="HS Code/Item Name Search"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                    <div className="react-bootstrap-table table-responsive">
                      {gridData?.data?.length > 0 && (
                        <table
                          id="table-to-xls"
                          className="table table-striped table-bordered mt-3 bj-table bj-table-landing"
                        >
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>HS Code</th>
                              <th>Description</th>
                              <th>SD</th>
                              <th>VAT</th>
                              <th>Schedule Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gridData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{item.sl}</td>
                                <td className="text-center">{item.hscode}</td>
                                <td>
                                  <p className="pl-2 mb-0">
                                    {item.description}
                                  </p>
                                </td>
                                <td className="text-right">
                                  <p className="mb-0 pr-1">{item.sd}</p>
                                </td>
                                <td className="text-right">
                                  <p className="mb-0 pr-1">{item.vat}</p>
                                </td>
                                <td>
                                  <p className="mb-0 pl-2">
                                    {item.scheduleType}
                                  </p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                  {gridData?.data?.length > 0 && (
                    <PaginationTable
                      count={gridData?.totalCount}
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
