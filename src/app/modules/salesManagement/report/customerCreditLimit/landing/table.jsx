import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import axios from "axios";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import {
  getDistributionChannelDDL,
  getChannelWiseSalesReportLandingData,
} from "../helper";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import numberWithCommas from "../../../../_helper/_numberWithCommas";

// Table Header
const dayThs = [
  "Sl",
  "Region",
  "Area",
  "Territory",
  "Partner Name",

  "Days",
  "Present BG",
  "Present Credit Limit",
  "Approved OD",
  "Total Present Credit Limit",
  "Debit As on Today",
  "Credit As On Today",
  "Outstanding As on Today",
  "Last Product Delivery Date",
  "Last Payment Date",
  "Product Delivery Gap",
  "Payment Gap",
];
const creditThs = [
  "Sl",
  "Region",
  "Area",
  "Territory",
  "Customer Name",
  "Present BG",
  "Present Credit Limit",
  "Approved OD",
  "Total Present Credit Limit",
  "Debit As on Today",
  "Credit As On Today",
  "Outstanding As on Today",
  "Last Product Delivery Date",
  "Last Payment Date",
  "Product Delivery Gap",
  "Payment Gap",
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
};

export default function CustomerCreditLimitReport() {
  const printRef = useRef();

  const [rowDto, setRowDto] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [channelId, setChannelId] = useState(0);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const viewHandler = async (values, setter) => {
    setRowDto([]);
    getChannelWiseSalesReportLandingData(
      selectedBusinessUnit?.value,
      values?.distributionChannel?.value,
      values?.date,
      values?.type?.value,
      values?.customer?.value || 0,
      setLoading,
      setter
    );
  };

  const loadCustomerList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${v}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ChannelId=${channelId}`
      )
      .then((res) => res?.data);
  };

  let totalCreditLimit = 0;
  let totalDebit = 0;
  let totalCollection = 0;
  let totalOutstanding = 0;

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
                  <b>CUSTOMER CREDIT LIMIT REPORT</b>
                </h3>
                <h4>
                  <b>{selectedBusinessUnit?.label}</b>
                </h4>
              </div>

              <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  viewHandler(values, setRowDto);
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-3">
                          <InputField
                            value={values?.date}
                            label="Date"
                            name="date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("date", e?.target?.value);
                              setRowDto([]);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="distributionChannel"
                            options={distributionChannelDDL}
                            value={values?.distributionChannel}
                            label="Distribution Channel"
                            onChange={(valueOption) => {
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
                          <NewSelect
                            name="type"
                            options={
                              values?.distributionChannel?.value === 46
                                ? [{ value: 2, label: "Credit Limit" }]
                                : [
                                    { value: 1, label: "Days Limit" },
                                    { value: 2, label: "Credit Limit" },
                                  ]
                            }
                            value={values?.type}
                            label="Type"
                            onChange={(valueOption) => {
                              setFieldValue("type", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Type"
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
                            disabled={
                              !values?.distributionChannel || !values?.type
                            }
                            type="submit"
                            className="btn btn-primary mt-5"
                            style={{ marginLeft: "13px" }}
                          >
                            View
                          </button>
                        </div>
                      </div>

                      {loading && <Loading />}
                      <div>
                        <ICustomTable
                          ths={values?.type?.value === 1 ? dayThs : creditThs}
                          id="table-to-xlsx"
                          className="creditLimitReport"
                        >
                          {rowDto?.map((data, index) => {
                            return (
                              <>
                                {data?.value.map((itm, i) => {
                                  totalCreditLimit += itm?.monCreditLimit || 0;
                                  totalDebit += itm?.monDebit || 0;
                                  totalCollection += itm?.monCollection || 0;
                                  totalOutstanding += itm?.monOutstanding || 0;

                                  // if (prvAreaName !== itm?.AreaName) {
                                  //   isTrue = true;
                                  //   prvAreaName = itm?.AreaName;

                                  // } else {
                                  //   isTrue = false;
                                  // }
                                  return (
                                    <>
                                      {itm?.grandTotal === true ? (
                                        <tr>
                                          <td
                                            colspan={
                                              values?.type?.value === 1 ? 9 : 8
                                            }
                                            className="text-right"
                                          >
                                            <b>
                                              {itm?.type === "area"
                                                ? (itm?.areaName || "") +
                                                  " Area"
                                                : (itm?.regionName || "") +
                                                  " Region"}{" "}
                                              Grand Total{" "}
                                            </b>
                                          </td>
                                          <td className="text-right">
                                            <b>
                                              {numberWithCommas(
                                                Math.round(
                                                  itm?.totalCreditLimit
                                                )
                                              )}
                                            </b>
                                          </td>
                                          <td className="text-right">
                                            <b>
                                              {numberWithCommas(
                                                Math.round(itm?.totalDebit)
                                              )}
                                            </b>
                                          </td>
                                          <td className="text-right">
                                            <b>
                                              {numberWithCommas(
                                                Math.round(itm?.totalCollection)
                                              )}
                                            </b>
                                          </td>
                                          <td className="text-right">
                                            <b>
                                              {numberWithCommas(
                                                Math.round(
                                                  itm?.totalOutstanding
                                                )
                                              )}
                                            </b>
                                          </td>
                                          <td
                                            className="text-right"
                                            colSpan="4"
                                          ></td>
                                        </tr>
                                      ) : (
                                        <tr key={index}>
                                          <td className="text-center">
                                            {" "}
                                            {i + 1}
                                          </td>
                                          <td> {data?.RegionName}</td>
                                          <td> {itm?.AreaName}</td>
                                          <td> {itm?.Territoryname}</td>
                                          <td> {itm?.strCustomerName}</td>
                                          {values?.type?.value === 1 ? (
                                            <td className="text-center">
                                              {" "}
                                              {itm?.DaysDuration}
                                            </td>
                                          ) : (
                                            ""
                                          )}
                                          <td className="text-right">
                                            {itm?.monbg}
                                          </td>
                                          <td className="text-right">
                                            {itm?.LCL}
                                          </td>
                                          <td className="text-right">
                                            {itm?.SCL}
                                          </td>
                                          <td className="text-right">
                                            {" "}
                                            {itm?.monCreditLimit}
                                          </td>
                                          <td className="text-right">
                                            {" "}
                                            {itm?.monDebit}
                                          </td>
                                          <td className="text-right">
                                            {itm?.monCollection}
                                          </td>

                                          {values?.type?.value === 2 ? (
                                            <td
                                              className="text-right"
                                              style={
                                                itm?.monOutstanding < 0
                                                  ? {
                                                      color: "Green",
                                                      fontWeight: 900,
                                                    }
                                                  : itm?.monOutstanding > 0
                                                  ? {
                                                      color: "Red",
                                                      fontWeight: 900,
                                                    }
                                                  : { fontWeight: 900 }
                                              }
                                            >
                                              {itm?.monOutstanding}
                                              {/* {Math.round(
                                            Math.abs(itm?.monOutstanding)
                                          )} */}
                                            </td>
                                          ) : (
                                            <td
                                              className="text-right"
                                              style={
                                                itm?.monOutstanding > 0
                                                  ? {
                                                      color: "red",
                                                      fontWeight: 900,
                                                    }
                                                  : {
                                                      color: "green",
                                                      fontWeight: 900,
                                                    }
                                              }
                                            >
                                              {/* {Math.round(
                                            Math.abs(itm?.monOutstanding)
                                          )} */}
                                              {itm?.monOutstanding}
                                            </td>
                                          )}
                                          <td>
                                            {_dateFormatter(
                                              itm?.LastDeliveryDate
                                            )}
                                          </td>
                                          <td>
                                            {_dateFormatter(
                                              itm?.LastCollectiondate
                                            )}
                                          </td>
                                          <td>{itm?.DeliveryDateDiffrance}</td>
                                          <td>
                                            {itm?.CollectionDateDiffrance}
                                          </td>
                                        </tr>
                                      )}

                                      {/* {isTrue&& (
                                        <tr>
                                          <td>Total : </td>
                                        </tr>
                                      )} */}
                                    </>
                                  );
                                })}
                              </>
                            );
                          })}
                          <tr>
                            <td
                              colspan={values?.type?.value === 1 ? 9 : 8}
                              className="text-right"
                            >
                              <b>Grand Total </b>
                            </td>
                            <td className="text-right">
                              <b>
                                {numberWithCommas(Math.round(totalCreditLimit))}
                              </b>
                            </td>
                            <td className="text-right">
                              <b>{numberWithCommas(Math.round(totalDebit))}</b>
                            </td>
                            <td className="text-right">
                              <b>
                                {numberWithCommas(Math.round(totalCollection))}
                              </b>
                            </td>
                            <td className="text-right">
                              <b>
                                {numberWithCommas(Math.round(totalOutstanding))}
                              </b>
                            </td>
                            <td className="text-right" colSpan="4"></td>
                          </tr>
                        </ICustomTable>
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
