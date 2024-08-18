import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _firstDateOfCurrentFiscalYear } from "../../../_helper/_firstDateOfCurrentFiscalYear";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _monthLastDate } from "../../../_helper/_monthLastDate";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import {
  getIncomeStatement_api,
  getProfitCenterDDL,
  getReportId,
  groupId,
  parameterValues,
} from "./helper";
import ProjectedIncomeStatement from "./projectedIncomeStatement";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import { getBusinessDDLByED } from "../incomeStatement/helper";
import DivisionSubDivisionAndBusinessUnit from "./commonDivSubDivToBuN";
import { _lastDateOfMonth } from "../../../_helper/_todayDate";

const initData = {
  reportType: "",
  enterpriseDivision: "",
  subDivision: "",
  businessUnit: "",
  profitCenter: "",
  fromDate: _firstDateOfCurrentFiscalYear(),
  toDate: _monthLastDate(),
  conversionRate: 1,
  date: _monthLastDate(),
  viewType: "",
  productDivision: "",
  tradeType: "",
  reportTypeCashFlowIndirect: { value: 0, label: "All" },
};
export default function IncomestatementNew() {
  const [buDDL, getBuDDL, buDDLloader, setBuDDL] = useAxiosGet();
  const saveHandler = (values, cb) => {};
  const [show, setShow] = useState(false);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [enterpriseDivisionDDL, getEnterpriseDivisionDDL] = useAxiosGet();
  const [incomeStatement, setIncomeStatement] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buddl, getbuddl, buddlLoader, setbuddl] = useAxiosGet();
  const [
    subDivisionDDL,
    getSubDivisionDDL,
    loadingOnSubDivisionDDL,
    setSubDivisionDDL,
  ] = useAxiosGet();

  const [profitCenterDDL, setProfitCenterDDL] = useState([]);

  const [
    tradeAndDivisionDDL,
    getTradeAndDivisionDDL,
    ,
    setTradeAndDivisionDDL,
  ] = useAxiosGet();

  useEffect(() => {
    getEnterpriseDivisionDDL(
      `/hcm/HCMDDL/GetBusinessUnitGroupByAccountDDL?AccountId=${profileData?.accountId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    getBuDDL(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${profileData?.userId}&ClientId=${profileData?.accountId}`,
      (data) => {
        const newData = data?.map((item) => {
          return {
            value: item?.organizationUnitReffId,
            label: item?.organizationUnitReffName,
          };
        });
        setBuDDL(newData);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        setValues,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(loading ||
            buddlLoader ||
            buDDLloader ||
            loadingOnSubDivisionDDL) && <Loading />}
          <IForm
            title="Income Statement"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="row global-form">
                <>
                  <DivisionSubDivisionAndBusinessUnit
                    values={values}
                    setFieldValue={setFieldValue}
                    setSubDivisionDDL={setSubDivisionDDL}
                    setbuddl={setbuddl}
                    getSubDivisionDDL={getSubDivisionDDL}
                    subDivisionDDL={subDivisionDDL}
                    getBusinessDDLByED={getBusinessDDLByED}
                    enterpriseDivisionDDL={enterpriseDivisionDDL}
                    profileData={profileData}
                    buddl={buddl}
                  />
                  <div className="col-md-3">
                    <NewSelect
                      name="viewType"
                      options={[
                        { value: "profitCenter", label: "Profit Center" },
                        {
                          value: "unitColumn",
                          label: "Unit Column",
                        },
                        { value: "monthColumn", label: "Month Column" },
                      ]}
                      value={values?.viewType}
                      label="View Type"
                      onChange={(valueOption) => {
                        setFieldValue("viewType", valueOption);
                        setShow(false);
                        if (valueOption?.value === "profitCenter") {
                          getProfitCenterDDL(
                            values?.businessUnit?.value,
                            (profitCenterDDLData) => {
                              setProfitCenterDDL(profitCenterDDLData);
                              setFieldValue(
                                "profitCenter",
                                profitCenterDDLData?.[0] || ""
                              );
                            }
                          );
                        }
                        if (
                          valueOption?.value &&
                          valueOption?.value !== "profitCenter"
                        ) {
                          getTradeAndDivisionDDL(
                            `/fino/CostSheet/ProfitCenterDivisionChannelDDL?BUId=${values?.businessUnit?.value}&Type=${valueOption?.value}`
                          );
                        }

                        setIncomeStatement([]);
                      }}
                      placeholder="View Type"
                    />
                  </div>
                  {values?.viewType?.value === "profitCenter" && (
                    <div className="col-md-3">
                      <NewSelect
                        name="profitCenter"
                        options={profitCenterDDL || []}
                        value={values?.profitCenter}
                        label="Profit Center"
                        onChange={(valueOption) => {
                          setFieldValue("profitCenter", valueOption);
                          setIncomeStatement([]);
                        }}
                        placeholder="Profit Center"
                      />
                    </div>
                  )}
                  {values?.viewType?.value === "Product Division" && (
                    <div className="col-md-3">
                      <NewSelect
                        name="productDivision"
                        options={tradeAndDivisionDDL || []}
                        value={values?.productDivision}
                        label="Product Division"
                        onChange={(valueOption) => {
                          setFieldValue("productDivision", valueOption);
                          setIncomeStatement([]);
                        }}
                        placeholder="Product Division"
                      />
                    </div>
                  )}
                  {values?.viewType?.value === "Trade Type" && (
                    <div className="col-md-3">
                      <NewSelect
                        isDisabled={!values?.viewType}
                        name="tradeType"
                        options={tradeAndDivisionDDL || []}
                        value={values?.tradeType}
                        label="Trade Type"
                        onChange={(valueOption) => {
                          setFieldValue("tradeType", valueOption);
                          setIncomeStatement([]);
                        }}
                        placeholder="Product Division"
                      />
                    </div>
                  )}
                  <div className="col-md-2">
                    <label>Conversion Rate</label>
                    <InputField
                      value={values?.conversionRate}
                      name="conversionRate"
                      placeholder="Conversion Rate"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("conversionRate", e.target.value);
                      }}
                      min={0}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      min={values?.fromDate}
                      name="toDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                </>

                <div style={{ marginTop: "17px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (values?.viewType?.value === "profitCenter") {
                        getIncomeStatement_api(
                          values?.fromDate,
                          values?.toDate,
                          values?.fromDate,
                          values?.toDate,
                          values?.businessUnit?.value,
                          0,
                          setIncomeStatement,
                          "all",
                          setLoading,
                          "IncomeStatement",
                          values?.enterpriseDivision?.value,
                          values?.conversionRate,
                          values?.subDivision,
                          2,
                          values?.profitCenter?.value,
                          values?.viewType?.value,
                          values?.productDivision?.value
                            ? values?.productDivision?.value
                            : values?.profitCenter?.value
                            ? values?.profitCenter?.label
                            : values?.tradeType?.value,
                          values?.subDivision?.label
                        );
                      } else {
                        setShow(false);
                        setTimeout(() => {
                          setShow(true);
                        }, 1000);
                      }
                    }}
                    className="btn btn-primary"
                  >
                    Show
                  </button>
                </div>
              </div>
              {console.log("parameterValues(values)", parameterValues(values))}
              <div>
                {values?.viewType?.value === "profitCenter" ? (
                  <ProjectedIncomeStatement
                    incomeStatement={incomeStatement}
                    values={values}
                  />
                ) : show ? (
                  <PowerBIReport
                    reportId={`e05ac8cd-afc4-4fdb-b6b3-1669e79720b7`}
                    groupId={groupId}
                    parameterValues={parameterValues(values)}
                    parameterPanel={false}
                  />
                ) : null}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
