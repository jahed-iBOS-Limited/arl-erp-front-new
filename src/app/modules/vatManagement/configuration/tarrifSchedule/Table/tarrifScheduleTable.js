import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import moment from "moment";
import * as Yup from "yup";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";
import { getTarrifScheduleData, getFiscalYearDDL } from "../helper";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../_helper/_select";

const initData = {
  year: "",
};
const validationSchema = Yup.object().shape({});

export function TarrifScheduleTable() {
  const [loading, setLoading] = useState(false);

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = React.useState({});
  const [yearDDL, setYearDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getFiscalYearDDL(setYearDDL);
    if (selectedBusinessUnit && profileData) {
      getTarrifScheduleData("", 0, pageNo, pageSize, setLoading, setGridData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const getGridData = (values, searchValue) => {
    setGridData([])
    getTarrifScheduleData(
      "",
      values?.year?.value || 0,
      pageNo,
      pageSize,
      setLoading,
      setGridData,
      searchValue
    );
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values, searchValue) => {
    getTarrifScheduleData(
      "",
      values?.year?.value || 0,
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
        onSubmit={(values) => {}}
      >
        {({ values, touched, errors, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Tarrif Schedule">
                <CardHeaderToolbar>
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-primary mt-5"
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Export Excel"
                  />
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <form className="form form-label-right">
                  <div className="row global-form">
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="scheduleType"
                        options={scheduleTypeDDL}
                        value={values?.scheduleType}
                        label="Schedule Type"
                        onChange={(valueOption) => {
                          setScheduleType(valueOption);
                          setFieldValue("scheduleType", valueOption);
                        }}
                        placeholder="Schedule Type"
                        errors={errors}
                        touched={touched}
                      />
                      <p
                        className="mb-0 mt-1 ml-1"
                        style={{
                          color: "#000",
                        }}
                      >
                        <b>{`${
                          values?.scheduleType?.label === "1st Schedule"
                            ? "VAT, SD = 0%"
                            : values?.scheduleType?.label === "2nd Schedule"
                            ? "SD > 0% & VAT < 15%"
                            : values?.scheduleType?.label === "3rd Schedule"
                            ? "0 < VAT < 15%"
                            : ""
                        } `}</b>
                      </p>
                    </div> */}

                    <div className="col-lg-3">
                      <NewSelect
                        name="year"
                        options={yearDDL}
                        value={values?.year}
                        label="Fiscal Year"
                        onChange={(valueOption) => {
                          setFieldValue("year", valueOption);
                          setGridData([])
                        }}
                        placeholder="Fiscal Year"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-1 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
      
                          getGridData(values, "");
                        }}
                        disabled={!values?.year}
                      >
                        View
                      </button>
                    </div>

                    {/* <div className="col-lg text-right">
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="btn btn-primary mt-5"
                        table="table-to-xls"
                        filename="tablexls"
                        sheet="tablexls"
                        buttonText="Export Excel"
                      />
                    </div> */}
                  </div>
                </form>
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
                              <th>Fiscal Year</th>
                              <th>Unit</th>
                              <th>CD</th>
                              <th>RD</th>
                              <th>SD</th>
                              <th>VAT</th>
                              <th>AIT</th>
                              <th>AT</th>
                              <th>TTI</th>
                              <th>EXD</th>
                              {/* <th>PSI</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {gridData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{item.sl}</td>
                                <td>
                                  <div className="text-center">
                                    {item.hscode}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">{item.description}</div>
                                </td>
                                <td>
                                  <div className="pl-2">{`${item.fiscalyear}-${+item.fiscalyear + 1}`}</div>
                                </td>
                            
                                <td>
                                  <div className="pl-2">{item.unit}</div>
                                </td>
                                <td>
                                  <div className="text-center">{item.cd}</div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {item.rd}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {item.sd}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {item.vat}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {item.ait}
                                  </div>
                                </td>
                               
                                <td>
                                  <div className="text-right pr-2">
                                    {item.atv}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {item.tti}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {item.exd}
                                  </div>
                                </td>
                                {/* <td>
                                  <div className="text-right pr-2">
                                    {item.psi}
                                  </div>
                                </td> */}
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
