/* eslint-disable no-useless-concat */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../_helper/_card";
import ICustomTable from "../../../_helper/_customTable";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../_helper/_todayDate";
import NewSelect from "../../../_helper/_select";
import * as Yup from "yup";
import { IInput } from "../../../_helper/_input";
import {
  getSalesProfitReportData,
  getWareHouseDDL
} from "../helper";
import Loading from "../../../_helper/_loading";
//import numberWithCommas from "../../../_helper/_numberWithCommas";
import PaginationTable from "../../../_helper/_tablePagination";
import { _dateFormatter } from "../../../_helper/_dateFormate";

const challanBaseHeader = ["Sl", "Item", "Challan", "Date", "Total Quantity", "Total Amount", "Cost Amount", "Profit Amount"];
const itemBaseHeader = ["Sl", "Item", "Total Quantity", "Total Amount", "Cost Amount", "Profit Amount"];
const reportDDL = [
  { value: 1, label: "Challan Base" },
  { value: 2, label: "Item Base" }
];

// Validation schema
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required("From Date is required"),
  toDate: Yup.date().required("To Date is required"),
  reportType: Yup.object().shape({
    label: Yup.string().required("Report Type is required"),
    value: Yup.string().required("Report Type is required"),
  })
});

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: ""
};

export default function SalesProfit() {
  const printRef = useRef();

  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15)
  const [whNameDDL, setWhNameDDL] = useState([])


  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if(profileData?.accountId && selectedBusinessUnit?.value){
      getWareHouseDDL(profileData?.accountId, selectedBusinessUnit?.value, setWhNameDDL)
    }
  }, [profileData, selectedBusinessUnit])

  const setPositionHandler = (pageNo, pageSize, values) => {
    getSalesProfitReportData(
      values?.whName?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      values?.reportType?.value,
      setLoading,
      setRowDto
    )
  };
  
  let totalAmount = 0;
  let totalCostAmount = 0;
  let totalProfitAmount = 0;
  
  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title=""
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <div className="text-center my-2">
                <h3>
                  <b className=""> SALES PROFIT REPORT </b>
                </h3>
                <h4>
                  <b className=""> {selectedBusinessUnit?.label} </b>
                </h4>
              </div>

              <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // saveHandler(values, () => {
                  //   resetForm(initData);
                  // });
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-2">
                          <NewSelect
                            name="whName"
                            options={whNameDDL}
                            value={values?.whName}
                            label="Outlet Name"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("whName", valueOption)
                            }}
                            placeholder="Outlet Name"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <IInput
                            value={values?.fromDate}
                            label="From date"
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e?.target?.value);
                            }}
                          />
                        </div>

                        <div className="col-lg-2">
                          <IInput
                            value={values?.toDate}
                            label="To date"
                            name="toDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("toDate", e?.target?.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="reportType"
                            options={reportDDL}
                            value={values?.reportType}
                            label="Report Type"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("reportType", valueOption)
                            }}
                            placeholder="Report Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div style={{ marginTop: "18px" }} className="col-lg-1">
                          <button
                            disabled={!values?.fromDate || !values?.toDate || !values?.reportType || !values?.whName}
                            className="btn btn-primary"
                            onClick={() => {
                              setPositionHandler(pageNo, pageSize, values)
                            }}
                            type="button"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>
                    {loading && <Loading />}
                    <div className=" my-5">
                    {values?.reportType?.value===1 && 
                        <ICustomTable ths={challanBaseHeader}>
                          {rowDto.map((itm, i) => {
                            totalAmount += +itm?.totalAmount;
                            totalCostAmount +=itm?.costAmount;
                            totalProfitAmount +=itm?.profit;

                            return (
                              <tr key={i}>
                                <td className="text-center"> {i+1}</td>
                                <td className="text-left"> {itm.itemName}</td>
                                <td> {itm.deliveryCode}</td>
                                <td className="text-center"> {_dateFormatter(itm.deliveryDate)}</td>
                                <td className="text-right"> {itm.totalQuantity}</td>
                                <td className="text-right"> {itm.totalAmount.toFixed(2)}</td>
                                <td className="text-right"> {itm.costAmount.toFixed(2)}</td>
                                <td className="text-right"> {itm.profit.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="text-center" colSpan={5}>Total</td>
                            <td className="text-right" style={{fontWeight: "bold"}}> {totalAmount.toFixed(2)}</td>
                            <td className="text-right" style={{fontWeight: "bold"}}> {totalCostAmount.toFixed(2)}</td>
                            <td className="text-right" style={{fontWeight: "bold"}}> {totalProfitAmount.toFixed(2)}</td>
                          </tr>
                        </ICustomTable>
                      }
                      {values?.reportType?.value===2 && 
                        <ICustomTable ths={itemBaseHeader}>
                          {rowDto.map((itm, i) => {
                            totalAmount += +itm?.totalAmount;
                            totalCostAmount +=itm?.costAmount;
                            totalProfitAmount +=itm?.profit;

                            return (
                              <tr key={i}>
                                <td className="text-center"> {i+1}</td>
                                <td className="text-center"> {itm.itemName}</td>
                                <td className="text-right"> {itm.totalQuantity}</td>
                                <td className="text-right"> {itm.totalAmount}</td>
                                <td className="text-right"> {itm.costAmount}</td>
                                <td className="text-right"> {itm.profit}</td>
                              </tr>
                            );
                          })}
                           <tr>
                            <td className="text-center" colSpan={3}>Total</td>
                            <td className="text-right" style={{fontWeight: "bold"}}>{totalAmount.toFixed(2)}</td>
                            <td className="text-right" style={{fontWeight: "bold"}}> {totalCostAmount.toFixed(2)}</td>
                            <td className="text-right" style={{fontWeight: "bold"}}> {totalProfitAmount.toFixed(2)}</td>
                          </tr>
                        </ICustomTable>
                      }
                    </div>
                  </>
                )}
              </Formik>
              
              {rowDto?.data?.length > 0 && (
                <PaginationTable
                  count={rowDto?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                />
              )}
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
