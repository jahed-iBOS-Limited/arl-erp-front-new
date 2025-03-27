import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import Table from "./table";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";

const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
const reportId = "3b28ad18-c237-49fe-97e2-7480d3482e1a";

const initData = {
  reportType: "",
  customer: "",
  SONo: "",
  shipPoint: "",
  channel: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const reportTypes = [
  { value: 1, label: "SO Base" },
  { value: 2, label: "Party Base" },
  { value: 3, label: "Channel Base" },
  { value: 4, label: "Shipping Point Base" },
  { value: 5, label: "Unit Base" },
  { value: 6, label: "Customer Configuration Status" },
];

function SalesOrderSupport() {
  const [, getData, getDataLoading] = useAxiosGet();
  const [gridData, setGridData] = useState([]);
  const [channelDDL, getChannelDDL, getChannelDDLLoading] = useAxiosGet();
  const [customerDDL, getCustomerDDL, getCustomerDDLLoading] = useAxiosGet();
  const [salesDDL, getSalesDDL, getSalesDDLLoading] = useAxiosGet();
  const [showReport, setShowReport] = useState(false);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  // use effect
  useEffect(() => {
    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    getSalesDDL(
      `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

  }, []);

  // parameter values
  function parameterValues(values) {
    return [
      { name: "intpartid", value: `${values?.reportType?.value}` },
      { name: "intcustomerid", value: `${values?.customer?.value}` },
      { name: "intUnitid", value: `${buId}` },
    ];
  }

  // function customer configuration status form field
  function CustomerConfigStatusFormField({ obj }) {
    const { values, setFieldValue } = obj;

    return (
      <>
        <div className="col-lg-3">
          <NewSelect
            name="channel"
            label="Channel"
            options={channelDDL}
            value={values?.channel}
            onChange={(valueOption) => {
              getCustomerDDL(
                `/partner/PManagementCommonDDL/GetCustomerNameBySalesOrgDDL?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrganization=${values
                  ?.sale?.value || 0}&DistribuitionChannelId=${
                  valueOption?.value
                }`
              );
              setFieldValue("channel", valueOption);
              setShowReport(false);
            }}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            name="sale"
            label="Sale"
            options={salesDDL}
            value={values?.sale}
            onChange={(valueOption) => {
              getCustomerDDL(
                `/partner/PManagementCommonDDL/GetCustomerNameBySalesOrgDDL?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrganization=${valueOption?.value}&DistribuitionChannelId=${values?.channel?.value}`
              );
              setFieldValue("sale", valueOption);
              setShowReport(false);
            }}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            name="customer"
            label="Customer"
            options={[{ value: 0, label: "All" }, ...customerDDL]}
            value={values?.customer}
            onChange={(valueOption) => {
              setFieldValue("customer", valueOption);
              setShowReport(false);
            }}
          />
        </div>
      </>
    );
  }

  const getGridData = (values) => {
    const id = values?.reportType?.value || 0;
    const partnerId = id === 2 ? values?.customer?.value : 0;
    const channelId = [2, 3].includes(values?.reportType?.value)
      ? values?.channel?.value || 0
      : 0;
    const shipPointId = id === 4 ? values?.shipPoint?.value : 0;
    const fromDate = id === 3 ? values?.fromDate : _todayDate();
    const toDate = id === 3 ? values?.toDate : _todayDate();
    getData(
      // `/oms/SalesInformation/GetOrderChallanNPending?intpartid=${id}&SOCode=${values?.SONo ||
      //   ""}${partnerId}${channelId}${shipPointId}&intUnitId=${buId || 0}`,
      `/oms/SalesInformation/GetOrderChallanNPending?intpartid=${id}&SOCode=${values?.SONo ||
        0}&intpartnerid=${partnerId || 0}&intChannelid=${channelId ||
        0}&intshippingPoint=${shipPointId || 0}&intUnitId=${buId ||
        0}&FromDate=${fromDate}&ToDate=${toDate}`,
      (resData) => {
        setGridData(resData);
      }
    );
  };

  const isDisabled = (values) => {
    const id = values?.reportType?.value;
    return (
      !values?.reportType ||
      // (id === 1 && !values?.SONo) ||
      (id === 2 && !values?.customer) ||
      (id === 3 && !values?.channel) ||
      (id === 4 && !values?.shipPoint)
    );
  };

  // is loading
  const isLoading =
    getDataLoading ||
    getChannelDDLLoading ||
    getCustomerDDLLoading ||
    getSalesDDLLoading;

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Form>
              <ICustomCard title="Sales Order Support">
                {isLoading && <Loading />}
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="reportType"
                      options={reportTypes}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                        if (valueOption.value !== 1) {
                          setFieldValue("SONo", "");
                        } else if (valueOption.value !== 3) {
                          setFieldValue("fromDate", _todayDate());
                          setFieldValue("toDate", _todayDate());
                        }
                        setShowReport(false);
                        setGridData([]);
                      }}
                      placeholder="Report Type"
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>

                  {[6].includes(values?.reportType?.value) && (
                    <CustomerConfigStatusFormField
                      obj={{ setFieldValue, values }}
                    />
                  )}

                  {values?.reportType?.value === 1 && (
                    <div className="col-lg-3">
                      <InputField
                        value={values?.SONo}
                        name="SONo"
                        placeholder="SO Code"
                        label="SO Code"
                        type="text"
                      />
                    </div>
                  )}

                  {[2, 3].includes(values?.reportType?.value) && (
                    <RATForm
                      obj={{
                        values,
                        setFieldValue,
                        region: false,
                        area: false,
                        territory: false,
                      }}
                    />
                  )}

                  {[2].includes(values?.reportType?.value) && (
                    <div className="col-lg-3">
                      <label>Customer</label>
                      <SearchAsyncSelect
                        selectedValue={values?.customer}
                        handleChange={(valueOption) => {
                          setFieldValue("customer", valueOption);
                          setGridData([]);
                        }}
                        isDisabled={!values?.channel}
                        placeholder="Search Customer"
                        loadOptions={(v) => {
                          const searchValue = v.trim();
                          if (searchValue?.length < 3) return [];
                          return axios
                            .get(
                              `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                            )
                            .then((res) => res?.data);
                        }}
                      />
                    </div>
                  )}
                  {[4].includes(values?.reportType?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={shipPointDDL}
                        value={values?.shipPoint}
                        label="Shipping Point"
                        onChange={(valueOption) => {
                          setFieldValue("shipPoint", valueOption);
                        }}
                        placeholder="Shipping Point"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  {values?.reportType?.value === 3 && (
                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                  )}

                  <IButton
                    onClick={() => {
                      if (values?.reportType?.value === 6) {
                        setShowReport(true);
                      } else {
                        getGridData(values);
                      }
                    }}
                    disabled={isDisabled(values)}
                  />
                </div>

                {/* Table */}
                {gridData?.length > 0 && <Table gridData={gridData} />}

                {/* PowerBI Report */}
                {showReport && (
                  <PowerBIReport
                    reportId={reportId}
                    groupId={groupId}
                    parameterValues={parameterValues(values)}
                    parameterPanel={false}
                  />
                )}
              </ICustomCard>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default SalesOrderSupport;
