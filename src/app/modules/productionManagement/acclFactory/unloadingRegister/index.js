/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { _monthLastDate } from "../../../_helper/_monthLastDate";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";
import { _timeFormatter } from "../../../_helper/_timeFormatter";

const initData = {
  fromDate: _monthFirstDate(),
  toDate: _monthLastDate(),
};

function UnloadingRegister() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landigData, getlandingData, lodar] = useAxiosGet();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const history = useHistory();

  useEffect(() => {
    getlandingData(
      `/mes/MSIL/GetUnloadingRegisterLanding?intAccountId=${profileData?.accountId}&intBusinessUnitId=${selectedBusinessUnit?.value}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getlandingData(
      `/mes/MSIL/GetUnloadingRegisterLanding?fromDate=${values?.fromDate}&toDate=${values?.toDate}&intAccountId=${profileData?.accountId}&intBusinessUnitId=${selectedBusinessUnit?.value}&pageNo=${pageNo}&pageSize=${pageSize}&search=${searchValue}`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Unloading Register"}>
                {/* <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/ACCLFactory/Unloading-Register/create`,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button>
                </CardHeaderToolbar> */}
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form row">
                  <div className="col-md-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-md-3">
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      className="btn btn-primary ml-3"
                      disabled={!values?.fromDate || !values?.toDate}
                      onClick={() => {
                        getlandingData(
                          `/mes/MSIL/GetUnloadingRegisterLanding?fromDate=${values?.fromDate}&toDate=${values?.toDate}&intAccountId=${profileData?.accountId}&intBusinessUnitId=${selectedBusinessUnit?.value}&pageNo=${pageNo}&pageSize=${pageSize}`
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      className="btn btn-primary float-right"
                      onClick={() => {
                        history.push({
                          pathname:
                            "/production-management/ACCLFactory/Unloading-Register/createCranStopage",
                        });
                      }}
                    >
                      Crane Stoppage
                    </button>
                  </div>
                </div>
                <div className="row mt-1">
                  <div className="col-lg-12">
                    <PaginationSearch
                      placeholder="Search Here...."
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                    <div className="loan-scrollable-table">
                      <div className="scroll-table _table">
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th style={{ minWidth: "30px" }}>Sl</th>
                              <th style={{ minWidth: "120px" }}>
                                Lighter Vessel Name
                              </th>
                              <th style={{ minWidth: "85px" }}>Recieve Date</th>
                              <th style={{ minWidth: "85px" }}>Recieve Time</th>
                              <th style={{ minWidth: "85px" }}>Start Date</th>
                              <th style={{ minWidth: "85px" }}>Start Time</th>
                              <th style={{ minWidth: "85px" }}>End Date</th>
                              <th style={{ minWidth: "85px" }}>End Time</th>
                              {/* <th style={{ minWidth: "85px" }}>Item</th>
                              <th style={{ minWidth: "85px" }}>Quantity</th> */}
                              <th style={{ minWidth: "85px" }}>Crane</th>
                              {/* <th style={{ minWidth: "85px" }}>BN QTY</th>
                              <th style={{ minWidth: "85px" }}>Survey QTY</th>
                              <th style={{ minWidth: "85px" }}>Survey No</th> */}
                              <th style={{ minWidth: "85px" }}>
                                Mobile Number
                              </th>
                              {/* <th style={{ minWidth: "120px" }}>PO Number</th>
                              <th style={{ minWidth: "85px" }}>LC Number</th> */}
                              {/* <th style={{ minWidth: "85px" }}>Unload Point</th> */}
                              {/* <th style={{ minWidth: "120px" }}>
                                Number of Hatch
                              </th> */}
                              {/* <th style={{ minWidth: "85px" }}>C.O.O</th> */}
                              {/* <th style={{ minWidth: "85px" }}>
                                Mother Vessel
                              </th> */}
                              {/* <th style={{ minWidth: "120px" }}>
                                Raw Material Name
                              </th>
                              <th style={{ minWidth: "85px" }}>UoM</th>
                              <th style={{ minWidth: "85px" }}>Remarks</th>
                              <th style={{ minWidth: "85px" }}>Status</th> */}
                              <th style={{ minWidth: "50px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {landigData?.data?.length > 0 &&
                              landigData?.data?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item?.strLighterVesselName}</td>
                                  <td className="text-center">
                                    {_dateFormatter(item?.dteReceiveDate)}
                                  </td>
                                  <td className="text-center">
                                    {_timeFormatter(item?.tmReceiveTime || "")}
                                  </td>
                                  <td className="text-center">
                                    {_dateFormatter(item?.dteStartDate)}
                                  </td>
                                  <td className="text-center">
                                    {_timeFormatter(item?.tmStartTime || "")}
                                  </td>
                                  <td className="text-center">
                                    {_dateFormatter(item?.dteEndDate)}
                                  </td>
                                  <td className="text-center">
                                    {_timeFormatter(item?.tmEndTime || "")}
                                  </td>
                                  {/* <td>{item?.strRawMaterialName}</td>
                                  <td className="text-center">
                                    {item?.numBnquantity}
                                  </td> */}
                                  <td>{item?.strUnloadingPointName}</td>
                                  {/* <td className="text-center">
                                    {item?.numBnquantity}
                                  </td> */}
                                  {/* <td className="text-center">
                                    {item?.numSurveyQuantity}
                                  </td>
                                  <td className="text-center">
                                    {item?.strSurveyNumber}
                                  </td> */}
                                  <td>{item?.strMobileNumber}</td>
                                  {/* <td>{item?.strPonumber}</td>
                                  <td>{item?.strLcnumber}</td> */}
                                  {/* <td>{item?.strUnloadingPointName}</td> */}
                                  {/* <td>{item?.intNumberOfHatch}</td> */}
                                  {/* <td>{item?.strCountryOfOrigin}</td> */}
                                  {/* <td>{item?.strVesselName}</td> */}
                                  {/* <td>{item?.strRawMaterialName}</td> */}
                                  {/* <td>{item?.strUoM}</td> */}
                                  {/* <td>{item?.strRemarks}</td> */}
                                  {/* <td 
                                    style={{
                                      backgroundColor: item.status === 'Released' ? '#FF0000' : item.status === 'Waiting' ? '#E26B0A' : item.status === 'Work in Progress' ? '#F3FF00' : item.status === 'Stop/Problem' ? '#FF0000' : '',
                                    }}
                                  >{item?.status}</td> */}
                                  <td className="text-center">
                                    <IEdit
                                      onClick={(e) => {
                                        history.push({
                                          pathname: `/production-management/ACCLFactory/Unloading-Register/edit/${item?.intCargoUnloadingStatementId}`,
                                          state: item,
                                        });
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {landigData?.data?.length > 0 && (
                      <PaginationTable
                        count={landigData.totalCount}
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

export default UnloadingRegister;
