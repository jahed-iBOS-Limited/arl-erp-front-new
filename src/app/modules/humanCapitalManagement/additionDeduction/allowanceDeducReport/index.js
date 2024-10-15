import React, { useState } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import NewSelect from "../../../_helper/_select";
import Loading from "../../../_helper/_loading";
import "./allowDeduc.css";
import { allowanceDeducReportAction } from "./helper";

const initData = {
  businessUnit: "",
};

const AllowanceDeducReport = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableSize, setTableSize] = useState("Small");

  const { businessUnitList } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  console.log("heading", rowDto);

  return (
    <>
      {loading && <Loading />}
      <ICustomCard title="Allowance and Deduction Report">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              
              <Form
                className={
                  process.env.NODE_ENV === "production"
                    ? "form form-label-right react-select-custom-margin"
                    : "form form-label-right"
                }
              >
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form">
                      <div className="row">
                        <div className="col-lg-4">
                          <NewSelect
                            name="businessUnit"
                            options={businessUnitList}
                            value={values?.businessUnit}
                            onChange={(valueOption) => {
                              setFieldValue("businessUnit", valueOption);
                            }}
                            label="Business Unit"
                            placeholder="Business Unit"
                            errors={errors}
                            touched={touched}
                          />
                        </div>

                        <div style={{ marginTop: "14px" }} className="col-lg">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                              allowanceDeducReportAction(
                                setLoading,
                                setRowDto,
                                values?.businessUnit?.value
                              )
                            }
                            disabled={!values?.businessUnit}
                          >
                            View
                          </button>
                          {rowDto.tableRow?.length > 0 && (
                            <button
                              style={{
                                lineHeight: "14px",
                                padding: "4px 16px",
                              }}
                              type="button"
                              className="btn btn-primary ml-2"
                              onClick={() =>
                                setTableSize(
                                  tableSize === "Small" ? "Large" : "Small"
                                )
                              }
                            >
                              {tableSize === "Small" ? "Large" : "Small"} View
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {rowDto.tableRow?.length > 0 && (
                  <div className="text-right mb-1">
                    {/* <button
                      style={{ lineHeight: "14px", padding: "4px 16px" }}
                      className="btn btn-primary ml-1"
                      type="button"
                      onClick={(e) => {
                        let str = "";
                        for (let i = 0; i < values?.department?.length; i++) {
                          str = `${str}${str && ","}${
                            values?.department[i]?.value
                          }`;
                        }
                        downloadFile(
                          `/hcm/HCMRosterReport/GetRosterReportDetailsDownload?monthId=${values?.month?.value}&workplaceGroupId=${values?.workplaceGroup?.value}&yearId=${values?.year?.value}&businessUnitId=${selectedBusinessUnit?.value}&deptList=${str}&employmentTypeId=${values?.employmentType?.value}`,
                          "Roster Details Report",
                          "xlsx"
                        );
                      }}
                    >
                      Export Excel
                    </button> */}
                  </div>
                )}
                {/* Table Start */}
                {rowDto.tableRow?.length > 0 && (
                  <div className="loan-scrollable-table employee-overall-status">
                    <div
                      style={
                        tableSize === "Small"
                          ? { maxHeight: "400px" }
                          : { maxHeight: "800px" }
                      }
                      className="scroll-table _table"
                    >
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ minWidth: "50px" }}>SL</th>
                            {rowDto?.headingNames?.map((item, index) => (
                              <th
                                style={
                                  index === 0
                                    ? { minWidth: "60px" }
                                    : index > 2
                                    ? { minWidth: "100px" }
                                    : {}
                                }
                              >
                                {/* {index === 0
                                  ? "Employee Id"
                                  : index === 1
                                  ? "ERP Emp. Id"
                                  : index === 2
                                  ? "Employee Name"
                                  : index === 3
                                  ? "Cost Center"
                                  : } */}
                                {item}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.tableRow?.length > 0 &&
                            rowDto.tableRow?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                {item?.tableData?.map((item, idx) => (
                                  <td
                                    style={
                                      idx === 0
                                        ? { minWidth: "50px" }
                                        : idx > 2
                                        ? { minWidth: "100px" }
                                        : {}
                                    }
                                    className={
                                      idx === 0
                                        ? "text-center"
                                        : idx > 7 && "text-right"
                                    }
                                  >
                                    {item || 0}
                                  </td>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default AllowanceDeducReport;
