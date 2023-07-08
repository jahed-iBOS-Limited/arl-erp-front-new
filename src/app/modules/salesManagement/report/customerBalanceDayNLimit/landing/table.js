import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import { getDistributionChannelDDL, getUserLoginInfo } from "../helper";
import { dayThs, getReportId, groupId, parameterValues } from "./helper";

// Validation schema
// const validationSchema = Yup.object().shape({
//   date: Yup.date().required("From Date is required"),
//   distributionChannel: Yup.object().shape({
//     label: Yup.string().required("Distribution Channel is required"),
//     value: Yup.string().required("Distribution Channel is required"),
//   }),
// });

const initData = {
  date: _todayDate(),
  distributionChannel: "",
  reportType: { value: 1, label: "Days And Amount Base Balance" },
  viewType: "",
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

  // get user data from store
  const {
    profileData: { accountId: accId, employeeId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      getDistributionChannelDDL(accId, buId, setDistributionChannelDDL);
    }
    getUserLoginInfo(accId, buId, employeeId, setLoading, (resData) => {
      setData(resData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  useEffect(() => {
    if (rowData?.length > 0) {
      setRowDto(rowData);
    }
  }, [rowData]);

  const viewHandler = async (values) => {
    setRowDto([]);
    const channelId = values?.distributionChannel?.value;

    const customerId = values?.customer?.value || 0;
    const empId = employeeId;
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
        `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${v}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}`
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

  const disableHandler = (values) => {
    return (
      ([1, 2, 3].includes(values?.reportType?.value) &&
        !values?.distributionChannel) ||
      !values?.reportType ||
      ([4].includes(values?.reportType?.value) && !values?.viewType)
    );
  };

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="CUSTOMER BALANCE DAYS & LIMIT"
          isExcelBtn={true}
          // isPrint={true}
          // isShowPrintBtn={true}
          componentRef={printRef}
          pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
        >
          <div ref={printRef}>
            <div className="mx-auto">
              {/* <div className="text-center my-2">
                <h3>
                  <b>CUSTOMER BALANCE DAYS & LIMIT</b>
                </h3>
                <h4>
                  <b>{selectedBusinessUnit?.label}</b>
                </h4>
              </div> */}

              <Formik
                enableReinitialize={true}
                initialValues={initData}
                // validationSchema={validationSchema}
                onSubmit={() => {}}
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
                              {
                                value: 4,
                                label: "Receivable Report",
                              },
                              {
                                value: 2,
                                label: "Regular Irregular Party",
                              },
                              {
                                value: 3,
                                label: "Sister Concern Overdue",
                              },
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
                            label={`${
                              values?.reportType?.value === 4
                                ? "Transaction"
                                : ""
                            } Date`}
                            name="date"
                            type="date"
                            onChange={(e) => {
                              setIsShow(false);
                              setFieldValue("date", e?.target?.value);
                              setRowDto([]);
                            }}
                          />
                        </div>
                        {[4].includes(values?.reportType?.value) && (
                          <div className="col-lg-3">
                            <NewSelect
                              name="viewType"
                              options={[
                                { value: 1, label: "Details" },
                                { value: 5, label: "Top Sheet" },
                              ]}
                              value={values?.viewType}
                              label="View Type"
                              onChange={(valueOption) => {
                                setIsShow(false);
                                setFieldValue("viewType", valueOption);
                              }}
                              placeholder="View Type"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        )}

                        {[1, 2, 3].includes(values?.reportType?.value) && (
                          <>
                            <div className="col-lg-3">
                              <NewSelect
                                name="distributionChannel"
                                options={[
                                  {
                                    value: 0,
                                    label: "All",
                                  },
                                  ...distributionChannelDDL,
                                ]}
                                value={values?.distributionChannel}
                                label="Distribution Channel"
                                onChange={(valueOption) => {
                                  setIsShow(false);
                                  setFieldValue(
                                    "distributionChannel",
                                    valueOption
                                  );
                                  setChannelId(valueOption?.value);
                                  setRowDto([]);
                                }}
                                placeholder="Distribution Channel"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3">
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
                          </>
                        )}

                        <IButton
                          onClick={() => {
                            if ([1].includes(values?.reportType?.value)) {
                              viewHandler(values);
                            } else if (
                              [2, 3, 4].includes(values?.reportType?.value)
                            ) {
                              setIsShow(true);
                            }
                          }}
                          disabled={disableHandler(values)}
                        />
                        {/* <div className="col d-flex justify-content-end align-content-center mt-2">
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
                        </div> */}
                      </div>

                      {(isLoading || loading) && <Loading />}
                      {values?.reportType?.value === 1 && (
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
                      )}

                      {isShow &&
                        [2, 3, 4].includes(values?.reportType?.value) && (
                          <PowerBIReport
                            reportId={getReportId(values)}
                            groupId={groupId}
                            parameterValues={parameterValues(
                              values,
                              buId,
                              employeeId
                            )}
                            parameterPanel={false}
                          />
                        )}

                      <div>
                        {/* <PowerBIReport
                            reportId={reportId?.second}
                            groupId={groupId?.second}
                            parameterValues={parameterValuesTwo(
                              values,
                              selectedBusinessUnit
                            )}
                            parameterPanel={false}
                          /> */}
                      </div>
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
