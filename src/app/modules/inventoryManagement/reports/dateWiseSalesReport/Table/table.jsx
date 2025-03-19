import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../../_helper/_currentTime";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { GetDateWiseSalesReport, GetSalesOrganizationDDL_api } from "../helper";
export function DateWiseSalesReport() {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const initData = {
    shipPoint: "",
    fromDate: _todayDate(),
    toDate: _todayDate(),
    fromTime: _todaysStartTime(),
    toTime: _todaysEndTime(),
    salesOrg: "",
  };

  const [gridData, setGridData] = useState([]);
  const [salesOrgDDl, setSalesOrgDDl] = useState([]);
  const shipPintDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const GetReport = (values) => {
    setGridData([]);
    GetDateWiseSalesReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      values?.fromDate,
      values?.toDate,
      values?.fromTime,
      values?.toTime,
      setGridData,
      values?.salesOrg?.value
    );
  };

  const makeInt = (str) => {
    if (+str) {
      return Number(str).toFixed(2);
    } else {
      return str;
    }
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetSalesOrganizationDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSalesOrgDDl
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const printRef = useRef();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          GetReport(values);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <ICard
              printTitle="Print"
              isPrint={true}
              isShowPrintBtn={true}
              componentRef={printRef}
              isExcelBtn={true}
              excelFileNameWillbe={"Date Wise Sales Report"}
              title="Date Wise Sales Report"
            >
              <Form className="form form-label-right">
                <div className="form-group row global-form printSectionNone">
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <div className="d-flex">
                      <div className="flex-fill">
                        <InputField
                          value={values?.fromDate}
                          type="date"
                          name="fromDate"
                          onChange={(e) => {
                            setGridData([]);
                            setFieldValue("fromDate", e?.target?.value);
                          }}
                        />
                      </div>
                      {/* <div className="flex-fill">
                        <InputField
                          value={values?.fromTime}
                          type="time"
                          name="fromTime"
                        />
                      </div> */}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <div className="d-flex">
                      <div className="flex-fill">
                        <InputField
                          value={values?.toDate}
                          type="date"
                          name="toDate"
                          onChange={(e) => {
                            setGridData([]);
                            setFieldValue("toDate", e?.target?.value);
                          }}
                        />
                      </div>
                      {/* <div className="flex-fill">
                        <InputField
                          value={values?.toTime}
                          type="time"
                          name="toTime"
                        />
                      </div> */}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="salesOrg"
                      options={salesOrgDDl || []}
                      value={values?.salesOrg}
                      label="Sales Org"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("salesOrg", valueOption);
                      }}
                      placeholder="Sales Org"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shipPoint"
                      options={[{ value: 0, label: "All" }, ...shipPintDDL]}
                      value={values?.shipPoint}
                      label="ShipPoint"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("shipPoint", valueOption);
                      }}
                      placeholder="ShipPoint"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col d-flex justify-content-end align-items-center">
                    <button type="submit" className="btn btn-primary mt-5">
                      View
                    </button>
                  </div>
                </div>
              </Form>
              <div className="react-bootstrap-table table-responsive pendingDeliveryReport">
                <div className="product-wise-shipment-report">
                  <div className="loan-scrollable-table scroll-table-auto">
                    <div
                      style={{ maxHeight: "540px" }}
                      className="scroll-table _table scroll-table-auto"
                    >
                      <table
                        ref={printRef}
                        id="table-to-xlsx"
                        className="table table-striped table-bordered global-table table-font-size-sm"
                      >
                        <thead>
                          <tr>
                            {gridData?.head?.length && (
                              <th style={{ minWidth: "30px" }}>SL</th>
                            )}
                            {gridData?.head?.map((item, index) => (
                              <React.Fragment key={index}>
                                {index < 4 ? (
                                  <th style={{ minWidth: "100px" }}>{item}</th>
                                ) : (
                                  <th>{item}</th>
                                )}
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {gridData?.rows?.map((itm, i) => {
                            return (
                              <tr key={i}>
                                <td className="text-center"> {i + 1}</td>
                                {itm?.map((singleRow, index) => (
                                  <td
                                    className={`${
                                      index > 0 ? "text-right" : "text-center"
                                    }`}
                                    key={index}
                                  >
                                    {makeInt(singleRow)}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}
