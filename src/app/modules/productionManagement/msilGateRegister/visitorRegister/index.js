import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

function VisitorRegisterLanding() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/mes/MSIL/GetAllVisitorRegisterLanding?intBusinessUnitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/mes/MSIL/GetAllVisitorRegisterLanding?intBusinessUnitId=${
        selectedBusinessUnit?.value
      }&PageNo=${pageNo}&PageSize=${pageSize}&search=${searchValue ||
        ""}&date=${values?.date || ""}`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        //validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Visitor Register"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/msil-gate-register/Visitor-Register/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {false && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        value={values?.date}
                        label="Date"
                        name="date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
                          //setDate(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary ml-2"
                        disabled={false}
                        onClick={() => {
                          getRowData(
                            `/mes/MSIL/GetAllVisitorRegisterLanding?intBusinessUnitId=${
                              selectedBusinessUnit?.value
                            }&PageNo=${pageNo}&PageSize=${pageSize}&search=${""}&date=${values?.date ||
                              ""}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                <div className="po_custom_search">
                  <PaginationSearch
                    isDisabledFiled={false}
                    placeholder="Search here..."
                    paginationSearchHandler={paginationSearchHandler}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th style={{ width: "70px" }}>তারিখ</th>
                            <th>পরিদর্শকের নাম</th>
                            <th>পরিদর্শকের প্রতিষ্ঠানের নাম </th>
                            <th>পরিদর্শকের মোবাইল নম্বর</th>
                            <th>পরিদর্শকের প্রতিষ্ঠানের ঠিকানা</th>
                            <th>গাড়ির নাম্বার</th>
                            <th>রেজি. নং</th>
                            <th>গাড়ি চালকের নাম</th>
                            <th>গাড়ি চালকের মোবাইল নম্বর</th>
                            <th>যে কারণে প্রবেশ করতে চান</th>
                            <th>যার সাথে দেখা করতে চান তার নাম </th>
                            <th>যার সাথে দেখা করতে চান তার পদবী</th>
                            <th>প্রবেশের সময়</th>
                            <th>বহির্গমনের সময়</th>
                            <th style={{ width: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.visitorRegisterList?.length > 0 &&
                            rowData?.visitorRegisterList?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteDate)}
                                </td>
                                <td>{item?.strVisitorName}</td>
                                <td>{item?.strVisitorCompany}</td>
                                <td>{item?.strVisitorMobileNo}</td>
                                <td>{item?.strAddress}</td>
                                <td>{item?.strCarNo}</td>
                                <td className="text-center">
                                  {item?.strEntryCode}
                                </td>
                                <td>{item?.strDriverName}</td>
                                <td>{item?.strDriverMobileNo}</td>
                                <td>{item?.strVisitingReason}</td>
                                <td>{item?.strOfficePersonName}</td>
                                <td>{item?.strOfficePersonDesignation}</td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmInTime || "")}
                                </td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmOutTime || "")}
                                </td>
                                <td className="text-center">
                                  <IEdit
                                    onClick={() =>
                                      history.push({
                                        pathname: `/production-management/msil-gate-register/Visitor-Register/edit/${item?.intGateVisitorRegisterId}`,
                                        state: { ...item },
                                      })
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.visitorRegisterList?.length > 0 && (
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default VisitorRegisterLanding;
