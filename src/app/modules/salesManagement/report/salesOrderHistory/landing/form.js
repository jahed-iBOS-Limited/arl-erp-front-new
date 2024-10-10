import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";
import {
  getChallanHistory,
  getCustomerDDL,
  getSalesOrderDDL,
  getSalesOrderHistoryLanding,
} from "../helper";
import Table from "./table";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import CommonTable from "./detailsTable";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";

const initData = {
  date: _todayDate(),
  channel: "",
  customer: "",
  salesOrder: "",
  challanCode: "",
  isSlabBase: "",
  shipPointFP: "",
  dbChannelFP: "",
  customerFP: "",
  salesOrderFP: "",
  reasonFP: "",
  salesOrderCodeInput: "",
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

const reportNameList = [
  { value: 1, label: "Sales order history" },
  { value: 2, label: "Challan History" },
  { value: 3, label: "All sales order status" },
  { value: 4, label: "Un delivery qnt status" },
  { value: 5, label: "Sales order qnt negative" },
  { value: 6, label: "Pending qnt update" },
  // { value: 7, label: "Transport/Shipment Quantity (not completed)" },
];

export default function SalesOrderHistoryLanding() {
  const printRef = useRef();

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState();

  const [customerDDL, setCustomerDDL] = useState([]);
  const [salesOrderDDL, setSalesOrderDDL] = useState([]);
  const [
    salesOrderData,
    getSalesOrderData,
    loadingLan,
    setSalesOrderData,
  ] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const shippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const viewHandler = async (values) => {
    const typeId = values?.reportName?.value;
    if (typeId === 1) {
      getSalesOrderHistoryLanding(
        accId,
        buId,
        values?.channel?.value,
        values?.customer?.value,
        values?.date,
        values?.salesOrder?.value,
        setLoading,
        setRowDto
      );
    } else if (typeId === 2) {
      getChallanHistory(
        typeId,
        values?.isSlabBase?.value,
        values?.challanCode,
        values?.customer?.value,
        buId,
        0,
        setRowDto,
        setLoading
      );
    } else if ([3, 4, 5, 6].includes(typeId)) {
      getSalesOrderData(
        `/oms/SalesInformation/GetSalesOrderPendingInformation?intsoldtopartnerid=${values
          ?.customer?.value ||
          0}&intbusinessunitid=${buId}&SalesOrderCode=${values?.salesOrderCodeInput ||
          "'"}&intpartid=${typeId}&intChanneld=${
          values?.channel?.value
        }&intShippointid=${values?.shippoint?.value}&dteFromDate=${
          values?.fromDate
        }&dteToDate=${values?.toDate}`
      );
    } else if (typeId === 7) {
      getSalesOrderData(
        `/oms/OManagementReport/ShipmentNotCompletedInfo?accountId=${accId}&businessUnitId=${buId}&businessPartnerId=${values
          ?.customer?.value || 0}`
      );
    }
  };

  const reportNameModified = reportNameList?.filter((item) => {
    if (buId !== 184) {
      return item?.value !== 6;
    }
    return item;
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values) => {}}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <>
          <ICard
            printTitle="Print"
            title="Sales Order History"
            isPrint={true}
            isShowPrintBtn={true}
            componentRef={printRef}
            // pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
          >
            <div className="mx-auto">
              <Form className="form form-label-right">
                <div className="form-group row global-form printSectionNone">
                  <div className="col-lg-3">
                    <NewSelect
                      name="reportName"
                      options={reportNameModified}
                      value={values?.reportName}
                      label="Report Name"
                      onChange={(valueOption) => {
                        setFieldValue("reportName", valueOption);
                        setRowDto([]);
                        setSalesOrderData([]);
                      }}
                      placeholder="Report Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <>
                    {values?.reportName?.value === 2 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="isSlabBase"
                          options={[
                            { value: true, label: "Yes" },
                            { value: false, label: "No" },
                          ]}
                          value={values?.isSlabBase}
                          label="Is Slab Base"
                          onChange={(valueOption) => {
                            setFieldValue("isSlabBase", valueOption);
                            setRowDto([]);
                          }}
                          placeholder="Is Slab Base"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}
                    {values?.reportName?.value === 1 && (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.date}
                          label="Date"
                          name="date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("date", e?.target?.value);
                            if (values?.customer?.value) {
                              getSalesOrderDDL(
                                accId,
                                buId,
                                values?.customer?.value,
                                e?.target?.value,
                                setSalesOrderDDL
                              );
                            }

                            setFieldValue("salesOrder", "");
                            setRowDto([]);
                          }}
                        />
                      </div>
                    )}
                    {values?.reportName?.value === 2 && (
                      <div className="col-lg-3">
                        <InputField
                          label="Challan Code"
                          placeholder="Challan Code"
                          value={values?.challanCode}
                          name="challanCode"
                          type="text"
                        />
                      </div>
                    )}
                    <RATForm
                      obj={{
                        values,
                        setFieldValue,
                        onChange: (values) => {
                          getCustomerDDL(
                            accId,
                            buId,
                            values?.channel?.value,
                            setCustomerDDL
                          );
                          setFieldValue("customer", "");
                          setRowDto([]);
                        },
                        region: false,
                        area: false,
                        territory: false,
                      }}
                    />
                    <div className="col-lg-3">
                      <NewSelect
                        name="customer"
                        options={[{ value: 0, label: "All" }, ...customerDDL]}
                        value={values?.customer}
                        label="Customer"
                        onChange={(valueOption) => {
                          setFieldValue("customer", valueOption);
                          getSalesOrderDDL(
                            accId,
                            buId,
                            valueOption?.value,
                            values?.date,
                            setSalesOrderDDL
                          );
                          setRowDto([]);
                        }}
                        placeholder="Customer"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {[3, 4, 5, 6].includes(values?.reportName?.value) ? (
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="shippoint"
                            options={[
                              { value: 0, label: "All" },
                              ...shippointDDL,
                            ]}
                            value={values?.shippoint}
                            label="Ship Point"
                            onChange={(valueOption) => {
                              setFieldValue("shippoint", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Ship Point"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            label="From Date"
                            placeholder="From Date"
                            value={values?.fromDate}
                            name="fromDate"
                            type="date"
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            label="To Date"
                            placeholder="To Date"
                            value={values?.toDate}
                            name="toDate"
                            type="date"
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            label="Slase Order Code"
                            placeholder="Slase Order Code"
                            value={values?.salesOrderCodeInput}
                            name="salesOrderCodeInput"
                            type="text"
                          />
                        </div>
                      </>
                    ) : null}
                    {values?.reportName?.value === 1 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="salesOrder"
                          options={[
                            { value: 0, label: "All" },
                            ...salesOrderDDL,
                          ]}
                          value={values?.salesOrder}
                          label="Sales Order"
                          onChange={(valueOption) => {
                            setFieldValue("salesOrder", valueOption);
                            setRowDto([]);
                          }}
                          placeholder="Sales Order"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}
                  </>
                  <IButton
                    onClick={() => {
                      viewHandler(values);
                    }}
                  />
                </div>
              </Form>

              {(loading || loadingLan) && <Loading />}
              {[3, 4, 5, 6].includes(values?.reportName?.value) &&
              salesOrderData?.length ? (
                <CommonTable
                  salesOrderData={salesOrderData}
                  buId={buId}
                  values={values}
                />
              ) : null}
              <Table rowDto={rowDto} printRef={printRef} values={values} />
            </div>
          </ICard>
        </>
      )}
    </Formik>
  );
}
