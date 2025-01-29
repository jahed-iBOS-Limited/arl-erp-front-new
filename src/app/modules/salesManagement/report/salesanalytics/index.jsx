import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../_helper/_card";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import {
  getCommissionCalculationData,
  getNeedToCompany_api,
  getSalesDelivaryCost_api,
  getTargetVSSaelsAchievement_api,
} from "./helper";
import "./style.css";
import NewSelect from "./../../../_helper/_select";
import { YearDDL } from "./../../../_helper/_yearDDL";
import { monthDDL } from "./utils";
import TargetVSSaelsAchievementTable from "./targetVSSaelsAchievement/table";
import SalesforcePerformanceAnalysisTable from "./salesforcePerformanceAnalysis/table";
import CustomerLedgerTable from "./customerLedger/table";
import NetToCompanyTable from "./netToCompany/table";
import PaginationTable from "./../../../_helper/_tablePagination";
import SalesReportTable from "./salesReport/table";
import LiftingPlanVsActualDeliveryTable from "./liftingPlanVsActualDelivery/table";
import DeliveryReportTable from "./deliveryReport/table";
import SalesContactReportTable from "./salesContactReport/table";
import FactoryProductionVsDeliveryTable from "./factoryProductionVsDelivery/table";
import CommissionCalculationForm from "./commissionCalculation";
import CommissionCalculationTable from "./commissionCalculation/table";
import RATForm from "../../../_helper/commonInputFieldsGroups/ratForm";
import YearMonthForm from "../../../_helper/commonInputFieldsGroups/yearMonthForm";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";

const newDate = new Date();

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  year: "",
  month: "",
  channel: "",
  customer: "",
  shipPoint: "",
  region: "",
  area: "",
  territory: "",
};

const reportTypes = [
  { value: 1, label: "Target VS Sales Achievement" },
  { value: 2, label: "Salesforce Performance Analysis" },
  { value: 3, label: "Customer Ledger" },
  // { value: 4, label: "Net to Company" }, commented according to ikbal vi
  { value: 5, label: "Sales Report" },
  { value: 6, label: "Lifting Plan Vs Actual Delivery" },
  { value: 7, label: "Delivery Report" },
  { value: 8, label: "Sales Contact Report" },
  { value: 9, label: "Factory Production Vs Delivery" },
  // { value: 10, label: "Commission Calculation" },
];

export default function Salesanalytics() {
  const printRef = useRef();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const viewHandler = async (
    values,
    setter,
    _pageNo = pageNo,
    _pageSize = pageSize
  ) => {
    setGridData([]);
    const typeId = values?.reportType?.value;
    if ([1, 2, 3, 6, 8, 9].includes(typeId)) {
      getTargetVSSaelsAchievement_api({
        accId,
        buId,
        values,
        setLoading,
        setter,
      });
    } else if ([5, 7].includes(typeId)) {
      getSalesDelivaryCost_api({
        accId,
        buId,
        values,
        _pageNo,
        _pageSize,
        setLoading,
        setter,
      });
    } else if ([4].includes(typeId)) {
      getNeedToCompany_api({
        accId,
        buId,
        values,
        _pageNo,
        _pageSize,
        setLoading,
        setter,
      });
    } else if ([10].includes(typeId)) {
      getCommissionCalculationData(
        buId,
        values?.shipPoint?.value,
        values?.channel?.value,
        values?.customer?.value,
        values?.fromDate,
        values?.toDate,
        setter,
        setLoading
      );
    } else {
      return;
    }
  };

  const commonFormFunc = ({ values, setFieldValue }) => {
    const typeId = values?.reportType?.value;
    const obj = { values, setFieldValue, setGridData };

    if ([1, 2, 3, 6, 8].includes(typeId)) {
      return <YearMonthForm obj={obj} />;
    } else if ([4, 5, 7, 9].includes(typeId)) {
      return <FromDateToDateForm obj={obj} />;
    } else if ([10].includes(typeId)) {
      return <CommissionCalculationForm obj={obj} />;
    } else {
      return;
    }
  };

  const commonTableFunc = ({ values }) => {
    switch (values?.reportType?.value) {
      // Target VS Saels Achievement Table
      case 1:
        return (
          <TargetVSSaelsAchievementTable obj={{ gridData, printRef, values }} />
        );
      // Target VS Saels Achievement Table
      case 2:
        return (
          <SalesforcePerformanceAnalysisTable
            obj={{ gridData, printRef, values }}
          />
        );
      // Customer Ledger Table
      case 3:
        return <CustomerLedgerTable obj={{ gridData, printRef, values }} />;
      // Net to Company Table
      case 4:
        return <NetToCompanyTable obj={{ gridData, printRef, values }} />;

      case 5:
        //Sales Delivary Cost Table
        return <SalesReportTable obj={{ gridData, printRef, values }} />;

      case 6:
        //Lifting Plan Vs Actual Delivery Table
        return (
          <LiftingPlanVsActualDeliveryTable
            obj={{ gridData, printRef, values }}
          />
        );

      case 7:
        //Delivery Report Table
        return <DeliveryReportTable obj={{ gridData, printRef, values }} />;

      case 8:
        //Sales Contact Report Table
        return <SalesContactReportTable obj={{ gridData, printRef, values }} />;

      case 9:
        //Factory Production Vs Delivery Table
        return (
          <FactoryProductionVsDeliveryTable
            obj={{ gridData, printRef, values }}
          />
        );

      case 10:
        // Commission Calculation Table
        return (
          <CommissionCalculationTable obj={{ gridData, printRef, values }} />
        );
      default:
        break;
    }
  };

  const resetFormFunc = (setValues, currentValue) => {
    setValues({
      ...initData,
      reportType: currentValue,
      month:
        monthDDL.find((itm) => +itm?.value === newDate.getMonth() + 1) || "",
      year:
        YearDDL().find((itm) => +itm?.value === newDate.getFullYear()) || "",
    });
  };

  const isViewBtnDisabled = (values) => {
    const typeId = values?.reportType?.value;
    if ([1, 2, 3, 6, 8].includes(typeId)) {
      return !values?.month || !values?.year;
    } else if ([4, 5, 7, 9].includes(typeId)) {
      return !values?.fromDate || !values?.toDate;
    } else if ([10].includes(typeId)) {
      return !values?.shipPoint || !values?.customer;
    } else {
      return true;
    }
  };

  const isExcelBtn = () => {
    return gridData?.data?.length > 0 || gridData?.length > 0 ? true : false;
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {
          viewHandler(values, setGridData, pageNo, pageSize);
        }}
      >
        {({ values, errors, touched, setFieldValue, setValues }) => (
          <>
            <ICard
              printTitle="Print"
              title="Sales Analytics"
              isPrint={true}
              isShowPrintBtn={true}
              componentRef={printRef}
              isExcelBtn={isExcelBtn()}
              excelFileNameWillbe={values?.reportType?.label}
            >
              <div>
                <div className="mx-auto">
                  {loading && <Loading />}
                  <Form className="form form-label-right">
                    <div className="form-group row global-form printSectionNone">
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={reportTypes}
                          value={values?.reportType}
                          label="Report Type"
                          onChange={(valueOption) => {
                            setFieldValue("reportType", valueOption);
                            resetFormFunc(setValues, valueOption);
                            setGridData([]);
                          }}
                          placeholder="Report Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      {commonFormFunc({
                        values,
                        setFieldValue,
                      })}
                      {[1, 2, 3, 5, 6, 7, 8].includes(
                        values?.reportType?.value
                      ) && (
                        <RATForm
                          obj={{
                            setFieldValue,
                            values,
                            setGridData,
                          }}
                        />
                      )}
                      <div className="col-lg-3">
                        <button
                          type="submit"
                          className="btn btn-primary mt-5"
                          disabled={isViewBtnDisabled(values)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                    {commonTableFunc({ values })}

                    {gridData?.data?.length > 0 && (
                      <PaginationTable
                        count={gridData?.totalCount}
                        setPositionHandler={(pageNo, pageSize) => {
                          viewHandler(values, setGridData, pageNo, pageSize);
                        }}
                        paginationState={{
                          pageNo,
                          setPageNo,
                          pageSize,
                          setPageSize,
                        }}
                        values={values}
                      />
                    )}
                  </Form>
                </div>
              </div>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}
