import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import GridTable from "./table";
import NewSelect from "./../../../../_helper/_select";
import { _dateFormatterTwo } from "./../../../../_helper/_dateFormate";

import "./style.css";
import {
  GetFartilizerSubsidy_api,
  GetFartilizerOutsideSubsidy_api,
  GetBusinessUnitName_api,
} from "./../helper";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  importersName: "",
  internalType: {
    value: 1,
    label: "Sales Center Wise Sales",
  },
};

export default function AllotmentSalesReport() {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [BusinessUnitName, setBusinessUnitName] = useState([]);
  const [loading, setLoading] = useState(false);

  // get selected business unit from store
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    GetBusinessUnitName_api(setBusinessUnitName);
  }, []);

  const curentBuid = BusinessUnitName.find(
    (itm) => itm?.value === selectedBusinessUnit?.value
  );

  const printTopTitleFunc = (type) => {
    return type === 1
      ? "Report of Fertilizers Under Govt. Subsidy"
      : "Report of Fertilizers Managed Outside Govt. Subsidy";
  };
  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Allotment Sales Report"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <Formik
                enableReinitialize={true}
                initialValues={{ ...initData, importersName: curentBuid || "" }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-3">
                          <NewSelect
                            name="importersName"
                            options={BusinessUnitName || []}
                            value={values?.importersName}
                            label="Importer's Name"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("importersName", valueOption);
                            }}
                            placeholder="Importer's Name"
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
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>To Date</label>
                          <InputField
                            value={values?.toDate}
                            name="toDate"
                            placeholder="To Date"
                            type="date"
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="internalType"
                            options={[
                              {
                                value: 1,
                                label: "Sales Center Wise Sales",
                              },
                              {
                                value: 2,
                                label: "Customer Wise Re-Sell",
                              },
                            ]}
                            value={values?.internalType}
                            label="Internal Report"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("internalType", valueOption);
                            }}
                            placeholder="Internal Report"
                            errors={errors}
                            touched={touched}
                          />
                        </div>

                        <div className="col d-flex align-items-end justify-content-end">
                          <button
                            className="btn btn-primary mt-2"
                            disabled={
                              !values?.internalType || !values.importersName
                            }
                            onClick={() => {
                              setRowDto([]);
                              if (values?.internalType?.value === 1) {
                                GetFartilizerSubsidy_api(
                                  profileData?.accountId,
                                  values?.importersName?.value,
                                  values?.fromDate,
                                  values?.toDate,
                                  setRowDto,
                                  setLoading
                                );
                              } else {
                                GetFartilizerOutsideSubsidy_api(
                                  profileData?.accountId,
                                  values?.importersName?.value,
                                  values?.fromDate,
                                  values?.toDate,
                                  setRowDto,
                                  setLoading
                                );
                              }
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>
                    {loading && <Loading />}
                    <div className="allotmentSalesReportTop">
                      <h2>{printTopTitleFunc(values?.internalType?.value)}</h2>
                      <h3>{values?.importersName?.label} </h3>
                      <div>
                        <b className="mr-3">
                          From Date : {_dateFormatterTwo(values?.fromDate)}
                        </b>
                        <b>To Date :{_dateFormatterTwo(values?.toDate)}</b>
                      </div>
                    </div>

                    {/* grid table */}
                    <GridTable rowDto={rowDto} values={values} />
                  </>
                )}
              </Formik>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
