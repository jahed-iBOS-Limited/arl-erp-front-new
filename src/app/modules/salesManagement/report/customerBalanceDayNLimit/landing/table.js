import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getDistributionChannelDDL, getUserLoginInfo } from "../helper";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import {
  groupId,
  parameterValues,
  parameterValuesTwo,
  reportId,
} from "./helper";

// Table Header
const dayThs = [
  "Sl",
  "Partner Code",
  "Partner Name",
  "Ledger Balance",
  "Credit Days",
  "Permanent Credit Limit",
  "Short Time Credit Limit",
  "Total Credit Limit",
  "Sales Amount",
  "Deposit Amount",
  "Limit Base Overdue",
  "Days Base Overdue",
  "Region",
  "Area",
  "Territory",
  "Last Delivery Date",
  "Last Payment Date",
  "Product Delivery Gap",
  "Payment Gap",
  // "Delivery Date Difference",
  // "Collection Date Difference",
];

// Validation schema
const validationSchema = Yup.object().shape({
  date: Yup.date().required("From Date is required"),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel is required"),
    value: Yup.string().required("Distribution Channel is required"),
  }),
});

const initData = {
  date: _todayDate(),
  distributionChannel: "",
  reportType: { value: 1, label: "Days And Amount Base Balance" },
};

export default function CustomerBalanceDaysNLimit() {
  const printRef = useRef();

  const [rowDto, setRowDto] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [channelId, setChannelId] = useState(0);
  const [data, setData] = useState([]);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [isShow, setIsShow] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
    getUserLoginInfo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setLoading,
      (resData) => {
        setData(resData);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  useEffect(() => {
    if (rowData?.length > 0) {
      setRowDto(rowData);
    }
  }, [rowData]);

  const viewHandler = async (values, setter) => {
    setRowDto([]);
    const channelId = values?.distributionChannel?.value;
    const buId = selectedBusinessUnit?.value;
    const customerId = values?.customer?.value || 0;
    const empId = profileData?.employeeId;
    const RATId =
      data?.empLevelId === 7
        ? +data?.empTerritoryId
        : +data?.levelId === 6
        ? +data?.areaId
        : +data?.levelId === 5
        ? +data?.regionId
        : +data?.empTerritoryId;
    const intLevelId = data?.empLevelId;
    const url = `/oms/SalesInformation/PartnerBalnceByDaysNLimitAmount?intunit=${buId}&TransactionDate=${values?.date}&customerId=${customerId}&intchannelid=${channelId}&intEmployeeid=${empId}&RATId=${RATId}&intLevelId=${intLevelId}`;
    getRowData(url);
  };

  const loadCustomerList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${v}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ChannelId=${channelId}`
      )
      .then((res) => res?.data);
  };

  const getRowStyle = (value) => {
    return value < 0
      ? {
          color: "Green",
          fontWeight: 900,
        }
      : value > 0
      ? {
          color: "Red",
          fontWeight: 900,
        }
      : { fontWeight: 900 };
  };

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title=""
          isExcelBtn={true}
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
          pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <div className="text-center my-2">
                <h3>
                  <b>CUSTOMER BALANCE DAYS & LIMIT</b>
                </h3>
                <h4>
                  <b>{selectedBusinessUnit?.label}</b>
                </h4>
              </div>

              <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  viewHandler(values, setRowDto);
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-3">
                          <NewSelect
                            name="reportType"
                            options={[
                              {
                                value: 1,
                                label: "Days And Amount Base Balance",
                              },
                              { value: 2, label: "Regular Irregular Party" },
                              { value: 3, label: "Sister Concern Overdue" },
                            ]}
                            value={values?.reportType}
                            label="Report Type"
                            onChange={(valueOption) => {
                              setIsShow(false);
                              setFieldValue("reportType", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.date}
                            label="Date"
                            name="date"
                            type="date"
                            onChange={(e) => {
                              setIsShow(false);
                              setFieldValue("date", e?.target?.value);
                              setRowDto([]);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="distributionChannel"
                            options={[
                              { value: 0, label: "All" },
                              ...distributionChannelDDL,
                            ]}
                            value={values?.distributionChannel}
                            label="Distribution Channel"
                            onChange={(valueOption) => {
                              setIsShow(false);
                              setFieldValue("distributionChannel", valueOption);
                              setChannelId(valueOption?.value);
                              setRowDto([]);
                            }}
                            placeholder="Distribution Channel"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <div>
                            <label>Customer</label>
                            <SearchAsyncSelect
                              selectedValue={values?.customer}
                              handleChange={(valueOption) => {
                                setIsShow(false);
                                setFieldValue("customer", valueOption);
                                setRowDto([]);
                              }}
                              placeholder="Search Customer"
                              loadOptions={loadCustomerList}
                            />
                          </div>
                        </div>
                        <div className="col d-flex justify-content-end align-content-center mt-2">
                          <button
                            type="submit"
                            className="btn btn-primary mt-5"
                            style={{ marginLeft: "13px" }}
                            disabled={values?.reportType?.value !== 1}
                          >
                            View
                          </button>
                          {values?.reportType?.value === 2 ||
                          values?.reportType?.value === 3 ? (
                            <button
                              type="button"
                              className="btn btn-primary mt-5"
                              style={{ marginLeft: "13px" }}
                              onClick={() => {
                                setIsShow(true);
                              }}
                            >
                              Show PowerBI Report
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {(isLoading || loading) && <Loading />}
                      {values?.reportType?.value === 1 ? (
                        <div>
                          <ICustomTable
                            ths={dayThs}
                            id="table-to-xlsx"
                            className="creditLimitReport"
                          >
                            {rowDto?.map((data, index) => {
                              return (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>{data?.strPartnerCode}</td>
                                  <td>{data?.strPartnerName}</td>
                                  <td className="text-right">
                                    {data?.numLedgerBalance}
                                  </td>
                                  <td className="text-right">
                                    {data?.INTLIMITDAYS}
                                  </td>
                                  <td className="text-right">
                                    {data?.numPermanentCreditLimit}
                                  </td>
                                  <td className="text-right">
                                    {data?.numShortTimeCreditLimit}
                                  </td>
                                  <td className="text-right">
                                    {data?.numTotalCreditLimit}
                                  </td>
                                  <td className="text-right">
                                    {data?.totalSalesAmount}
                                  </td>
                                  <td className="text-right">
                                    {(data?.totalDepositAmount || 0).toFixed(0)}
                                  </td>
                                  <td
                                    className="text-right"
                                    style={getRowStyle(data?.AmountBaseBalance)}
                                  >
                                    {data?.AmountBaseBalance < 0
                                      ? `(${(
                                          data?.AmountBaseBalance || 0
                                        ).toFixed(0)})`
                                      : (data?.AmountBaseBalance || 0).toFixed(
                                          0
                                        )}
                                  </td>
                                  <td
                                    className="text-right"
                                    style={getRowStyle(data?.DayBaseBalance)}
                                  >
                                    {data?.DayBaseBalance < 0
                                      ? `(${(data?.DayBaseBalance || 0).toFixed(
                                          0
                                        )})`
                                      : (data?.DayBaseBalance || 0).toFixed(0)}
                                  </td>
                                  <td>{data?.strRegion}</td>
                                  <td>{data?.strArea}</td>
                                  <td>{data?.strTerritory}</td>
                                  <td>
                                    {_dateFormatter(data?.LastDeliveryDate)}
                                  </td>
                                  <td>
                                    {_dateFormatter(data?.LastCollectiondate)}
                                  </td>
                                  <td>{data?.DeliveryDateDiffrance}</td>
                                  <td>{data?.CollectionDateDiffrance}</td>
                                </tr>
                              );
                            })}
                          </ICustomTable>
                        </div>
                      ) : values?.reportType?.value === 2 && isShow ? (
                        <div>
                          <PowerBIReport
                            reportId={reportId?.first}
                            groupId={groupId?.first}
                            parameterValues={parameterValues(
                              values,
                              selectedBusinessUnit,
                              profileData
                            )}
                            parameterPanel={false}
                          />
                        </div>
                      ) : values?.reportType?.value === 3 && isShow ? (
                        <div>
                          <PowerBIReport
                            reportId={reportId?.second}
                            groupId={groupId?.second}
                            parameterValues={parameterValuesTwo(
                              values,
                              selectedBusinessUnit
                            )}
                            parameterPanel={false}
                          />
                        </div>
                      ) : null}
                    </Form>
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
