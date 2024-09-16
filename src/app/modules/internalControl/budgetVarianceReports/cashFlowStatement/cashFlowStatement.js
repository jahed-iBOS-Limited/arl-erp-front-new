/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { fromDateFromApiNew } from "../../../_helper/_formDateFromApi";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { SetFinancialManagementReportCashFlowStatementAction } from "../../../_helper/reduxForLocalStorage/Actions";
import { getBusinessDDLByED, getEnterpriseDivisionDDL } from "./helper";

const initDataFuction = (financialManagementReportCashFlowStatement) => {
  const initData = {
    enterpriseDivision:
      financialManagementReportCashFlowStatement?.enterpriseDivision || "",
    viewType: financialManagementReportCashFlowStatement?.viewType || "",
    subDivision: financialManagementReportCashFlowStatement?.subDivision || "",
    businessUnit:
      financialManagementReportCashFlowStatement?.businessUnit || "",
    convertionRate:
      financialManagementReportCashFlowStatement?.convertionRate || 1,
    fromDate: "",
    toDate: _todayDate(),
  };

  return initData;
};
export function CashFlowStatement() {
  const {
    authData: {
      profileData: { accountId },
      selectedBusinessUnit,
    },
    localStorage: {
      registerReport,
      financialManagementReportCashFlowStatement,
    },
  } = useSelector((store) => store, shallowEqual);
  const dispatch = useDispatch();

  const [enterpriseDivisionDDL, setEnterpriseDivisionDDL] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const formikRef = React.useRef(null);
  const [
    subDivisionDDL,
    getSubDivisionDDL,
    loadingOnSubDivisionDDL,
    setSubDivisionDDL,
  ] = useAxiosGet();

  useEffect(() => {
    fromDateFromApiNew(selectedBusinessUnit?.value, (date) => {
      if (formikRef.current) {
        const apiFormDate = date ? _dateFormatter(date) : "";
        const modifyInitData = initDataFuction(
          financialManagementReportCashFlowStatement
        );
        formikRef.current.setValues({
          ...modifyInitData,
          ...registerReport,
          fromDate: apiFormDate,
        });
      }
    });
    getEnterpriseDivisionDDL(accountId, (enterpriseDivisionData) => {
      setEnterpriseDivisionDDL(enterpriseDivisionData);
      let initData = initDataFuction(
        financialManagementReportCashFlowStatement
      );
      let initialEntepriceDivision = initData?.enterpriseDivision;
      let initialEntepriceSubDivision = initData?.subDivision;
      if (!initData?.enterpriseDivision) {
        initialEntepriceDivision = enterpriseDivisionData?.[0];
        dispatch(
          SetFinancialManagementReportCashFlowStatementAction({
            ...initData,
            enterpriseDivision: enterpriseDivisionData?.[0] || "",
            businessUnit: "",
          })
        );
      }
      if (initialEntepriceDivision) {
        getSubDivisionDDL(
          `/hcm/HCMDDL/GetBusinessUnitSubGroup?AccountId=${accountId}&BusinessUnitGroup=${initialEntepriceDivision?.label}`
        );
        if (!initData?.subDivision) {
          dispatch(
            SetFinancialManagementReportCashFlowStatementAction({
              ...initData,
              subDivision: subDivisionDDL?.[0] || "",
            })
          );
        }
      }
      if (initialEntepriceDivision && initialEntepriceSubDivision) {
        getBusinessDDLByED(
          accountId,
          initialEntepriceDivision?.value,
          (businessUnitDDLData) => {
            setBusinessUnitDDL(businessUnitDDLData);
            if (!initData?.businessUnit) {
              dispatch(
                SetFinancialManagementReportCashFlowStatementAction({
                  ...initData,
                  businessUnit: businessUnitDDLData?.[0] || "",
                })
              );
            }
          },
          initialEntepriceSubDivision
        );
      }
    });
  }, [accountId]);

  const [showRDLC, setShowRDLC] = useState(false);
  const groupId = "218e3d7e-f3ea-4f66-8150-bb16eb6fc606";
  const reportId = "ed848d77-22ce-4690-be11-cb39ce5f332f";
  const parameterValues = (values) => {
    console.log({ values });
    const agingParameters = [
      { name: "strUnitGroup", value: `${values?.enterpriseDivision?.value}` },
      { name: "strSubGroup", value: `${values?.subDivision?.label}` },
      { name: "isForecast", value: `${values?.isForecast?.value}` },
      { name: "intUnit", value: `${values?.businessUnit?.value}` },
      { name: "dteFromDate", value: `${values?.fromDate}` },
      { name: "dteToDate", value: `${values?.toDate}` },
      { name: "ConvertionRate", value: `${values?.convertionRate}` },
      {
        name: "intType",
        value: `${values?.viewType?.value}`,
      },
    ];
    return agingParameters;
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={{}} innerRef={formikRef}>
        {({ setFieldValue, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Cash Flow Statement">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loadingOnSubDivisionDDL && <Loading />}
                  <div className="row global-form align-items-end">
                    <div className="col-md-3">
                      <NewSelect
                        name="viewType"
                        options={[
                          {
                            value: 0,
                            label: "All",
                          },
                          {
                            value: 1,
                            label: "Group by Unit",
                          },
                          {
                            value: 2,
                            label: "Group by Month",
                          },
                        ]}
                        value={values?.viewType}
                        label="View Type"
                        onChange={(valueOption) => {
                          setFieldValue("viewType", valueOption);
                        }}
                        placeholder="View Type"
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="enterpriseDivision"
                        options={enterpriseDivisionDDL || []}
                        value={values?.enterpriseDivision}
                        label="Enterprise Division"
                        onChange={(valueOption) => {
                          setShowRDLC(false);
                          setFieldValue("enterpriseDivision", valueOption);
                          setFieldValue("businessUnit", "");
                          setFieldValue("subDivision", "");
                          setSubDivisionDDL([]);
                          setBusinessUnitDDL([]);
                          if (valueOption?.value) {
                            if (valueOption?.value) {
                              getSubDivisionDDL(
                                `/hcm/HCMDDL/GetBusinessUnitSubGroup?AccountId=${accountId}&BusinessUnitGroup=${valueOption?.label}`
                              );
                            }
                          }
                        }}
                        placeholder="Enterprise Division"
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="subDivision"
                        options={subDivisionDDL || []}
                        value={values?.subDivision}
                        label="Sub Division"
                        onChange={(valueOption) => {
                          setFieldValue("subDivision", valueOption);
                          setFieldValue("businessUnit", "");
                          setBusinessUnitDDL([]);
                          if (valueOption) {
                            getBusinessDDLByED(
                              accountId,
                              values?.enterpriseDivision?.value,
                              setBusinessUnitDDL,
                              valueOption
                            );
                          }
                        }}
                        placeholder="Sub Division"
                        isDisabled={!values?.enterpriseDivision}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL || []}
                        value={values?.businessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          setShowRDLC(false);
                          setFieldValue("businessUnit", valueOption);
                        }}
                        placeholder="Business Unit"
                        isDisabled={!values?.subDivision}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="isForecast"
                        options={[
                          {
                            value: 0,
                            label: "Budget",
                          },
                          {
                            value: 1,
                            label: "Forecast",
                          },
                        ]}
                        value={values?.isForecast}
                        label="Budget/Forecast"
                        onChange={(valueOption) => {
                          setFieldValue("isForecast", valueOption);
                        }}
                        placeholder="Budget/Forecast"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Conversion Rate</label>
                      <InputField
                        value={values?.convertionRate}
                        name="convertionRate"
                        placeholder="Convertion Rate"
                        type="number"
                        onChange={(e) => {
                          setShowRDLC(false);
                          setFieldValue("convertionRate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setShowRDLC(false);
                          setFieldValue("fromDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          setShowRDLC(false);
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-lg-1">
                      <ButtonStyleOne
                        label="Show"
                        onClick={() => {
                          dispatch(
                            SetFinancialManagementReportCashFlowStatementAction(
                              {
                                ...values,
                              }
                            )
                          );
                          setShowRDLC(false);
                          setTimeout(() => {
                            setShowRDLC(true);
                          }, 1000);
                        }}
                        style={{ marginTop: "19px" }}
                      />
                    </div>
                  </div>
                  {showRDLC && (
                    <div>
                      <PowerBIReport
                        reportId={reportId}
                        groupId={groupId}
                        parameterValues={parameterValues(values)}
                        parameterPanel={false}
                      />
                    </div>
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
