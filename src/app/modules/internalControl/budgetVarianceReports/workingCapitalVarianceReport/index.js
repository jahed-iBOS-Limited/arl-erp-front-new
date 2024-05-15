import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import Loading from "../../../_helper/_loading";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
  currentBusinessUnit: "",
  fiscalYear: "",
};
const WorkingCapitalVarianceReport = () => {
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [fiscalYearDDL, getFiscalYearDDL] = useAxiosGet();

  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  //   const getMonth = (monthNumber) => {
  //     return new Date(2021, monthNumber, 0).toLocaleString("default", {
  //       month: "long",
  //     });
  //   };
  useEffect(() => {
    getFiscalYearDDL(`/vat/TaxDDL/FiscalYearDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader
                title={"Working Capital Variance Report"}
              ></CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="currentBusinessUnit"
                        options={businessUnitList}
                        value={values?.currentBusinessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("currentBusinessUnit", valueOption);
                            setRowData([]);
                          } else {
                            setFieldValue("currentBusinessUnit", "");
                            setRowData([]);
                          }
                        }}
                        placeholder="Business Unit"
                        errors={errors}
                        touched={touched}
                        required={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="fiscalYear"
                        options={fiscalYearDDL || []}
                        value={values?.fiscalYear}
                        label="Year"
                        disabled={!values?.plant}
                        onChange={(valueOption) => {
                          setFieldValue("fiscalYear", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div>
                      <button
                        style={{ marginTop: "20px" }}
                        className="btn btn-primary ml-2"
                        disabled={
                          !values?.currentBusinessUnit || !values?.fiscalYear
                        }
                        onClick={() => {
                          getRowData(
                            `/fino/Report/GetWorkingCapitalVarianceReport?businessUnitId=${values?.currentBusinessUnit?.value}&strYear=${values?.fiscalYear?.label}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                {rowData?.length > 0 && (
                  <div className="row mt-5">
                    <div className="col-lg-12 cost-of-production">
                      <div className="table-responsive">
                        <table
                          id="table-to-xlsx"
                          className="table table-striped table-bordered bj-table bj-table-landing"
                        >
                          <thead>
                            <tr>
                              <th>General Laser Code</th>
                              <th>General Laser Name</th>
                              <th>Planned</th>
                              <th>Actual</th>
                              <th>Variance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowData?.length > 0 &&
                              rowData?.map((item, index) => (
                                <tr key={index}>
                                  <td
                                    className="text-start"
                                    // rowSpan={item?.intSectionCount}
                                  >
                                    {item?.strGlCode}
                                  </td>
                                  <td
                                    className="text-start"
                                    style={
                                      item?.intGlId === 0
                                        ? {
                                            fontWeight: "bold",
                                            fontSize: "13px",
                                            textAlign: "end",
                                          }
                                        : {}
                                    }
                                    // rowSpan={item?.intSectionCount}
                                  >
                                    {item?.strGlName}
                                  </td>
                                  <td
                                    className="text-end"
                                    // rowSpan={item?.intSectionCount}
                                    style={
                                      item?.intGlId === 0
                                        ? {
                                            fontWeight: "bold",
                                            fontSize: "13px",
                                            textAlign: "end",
                                          }
                                        : { textAlign: "end" }
                                    }
                                  >
                                    {numberWithCommas(
                                      Math.round(item?.numPlanned) || 0
                                    )}
                                  </td>
                                  <td
                                    className="text-end"
                                    style={
                                      item?.intGlId === 0
                                        ? {
                                            fontWeight: "bold",
                                            fontSize: "13px",
                                            textAlign: "end",
                                          }
                                        : { textAlign: "end" }
                                    }
                                    // rowSpan={item?.intSectionCount}
                                  >
                                    {numberWithCommas(
                                      Math.round(item?.numActual) || 0
                                    )}
                                  </td>
                                  <td
                                    className="text-end text-bold"
                                    style={
                                      item?.intGlId === 0
                                        ? {
                                            fontWeight: "bold",
                                            fontSize: "13px",
                                            textAlign: "end",
                                          }
                                        : { textAlign: "end" }
                                    }
                                    // rowSpan={item?.intSectionCount}
                                  >
                                    {numberWithCommas(
                                      Math.round(
                                        +item?.numPlanned - +item?.numActual
                                      ) || 0
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default WorkingCapitalVarianceReport;
