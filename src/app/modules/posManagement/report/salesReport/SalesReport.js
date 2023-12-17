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
import { getSalesReportData, getWareHouseDDL } from "../helper";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";

const challanBaseHeader = [
  "Sl",
  "Challan",
  "Customer Name",
  "Date",
  "Item",
  "MRP",
  "item Price",
  "Total Quantity",
  "Total Net Amount",
];
const partnerBaseHeader = [
  "Sl",
  "Customer Name",
  "Total Quantity",
  "Cash Amount",
  "Credit Amount",
  "Total Net Amount"
];
const dateBaseHeader = [
  "Sl",
  "Date",
  "Item Price",
  "Quantity",
  "Total Net Amount",
];
const itemBaseHeader = [
  "Sl",
  "Item Name",
  "Item Code",
  "Item Price",
  "Quantity",
  "Total Net Amount",
];
const itemandDateBaseHeader = [
  "Sl",
  "Date",
  "Item Name",
  "Item Code",
  "Item Price",
  "Quantity",
  "Total Net Amount",
];
const salesandDeliveryHeader = [
  "Sl",
  "Date",
  "Quantity",
  "Delivery Value",
  "Net Value",
  "Cash Amount",
  "Credit Amount",
  "Grand Collection",
];
const reportDDL = [
  { value: 1, label: "Challan Base Detaills" },
  { value: 2, label: "Partner Base Detaills" },
  { value: 3, label: "Day Base Detaills" },
  { value: 4, label: "Item Base Detaills" },
  { value: 5, label: "Item and Date Base Detaills" },
  { value: 6, label: "Sales and Delivery Detaills" },
];

// Validation schema
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required("From Date is required"),
  toDate: Yup.date().required("To Date is required"),
  reportType: Yup.object().shape({
    label: Yup.string().required("Report Type is required"),
    value: Yup.string().required("Report Type is required"),
  }),
});

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: "",
};

export default function SalesReport() {
  const printRef = useRef();

  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [whNameDDL, setWhNameDDL] = useState([]);

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
      getWareHouseDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        setWhNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getSalesReportData(
      values?.whName?.value,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      values?.reportType?.value,
      setLoading,
      setRowDto
    );
  };

  let totalCreditAmount = 0;
  let totalCashAmount = 0;
  let grandTotalNetAmount=0;

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
                  <b className=""> SALES REPORT </b>
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
                              setFieldValue("whName", valueOption);
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
                              setFieldValue("reportType", valueOption);
                            }}
                            placeholder="Report Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div style={{ marginTop: "18px" }} className="col-lg-1">
                          <button
                            disabled={
                              !values?.fromDate ||
                              !values?.toDate ||
                              !values?.reportType ||
                              !values?.whName
                            }
                            className="btn btn-primary"
                            onClick={() => {
                              setPositionHandler(pageNo, pageSize, values);
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
                      {values?.reportType?.value === 1 && (
                        <ICustomTable ths={challanBaseHeader}>
                          {rowDto.map((itm, i) => {
                            grandTotalNetAmount+= +itm?.numTotalNetValue
                            return (
                              <tr key={i}>
                                <td className="text-center"> {i + 1}</td>
                                <td> {itm.strDeliveryCode}</td>
                                <td className="text-center">
                                  {" "}
                                  {itm.strShipToPartnerName}
                                </td>
                                <td className="text-center">
                                  {" "}
                                  {_dateFormatter(itm.dteDeliveryDate)}
                                </td>
                                <td className="text-left">
                                  {" "}
                                  {itm.itemname}&nbsp;
                                  {"[" + `${itm?.itemcode}` + "]"}
                                </td>
                                <td className="text-right"> {itm.numMRP}</td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numItemPrice}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numTotalDeliveryQuantity}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numTotalNetValue}
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="text-center" colspan="8" style={{fontWeight: "bold" }}>
                             Grand Total
                            </td>
                            <td className="text-right" style={{fontWeight: "bold" }}>
                              {grandTotalNetAmount.toFixed(2)}
                            </td>
                          </tr>
                        </ICustomTable>
                      )}
                      {values?.reportType?.value === 2 && (
                        <ICustomTable ths={partnerBaseHeader}>
                          {rowDto.map((itm, i) => {
                            grandTotalNetAmount+= +itm?.numTotalNetValue
                            return (
                              <tr key={i}>
                                <td className="text-center"> {i + 1}</td>
                                <td> {itm.strSoldToPartnerName}</td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numTotalDeliveryQuantity}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(itm?.numCashAmount)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(itm?.numCreditAmount)}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numTotalNetValue}
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="text-center" colspan="5" style={{fontWeight: "bold" }}>
                             Grand Total
                            </td>
                            <td className="text-right" style={{fontWeight: "bold" }}>
                              {grandTotalNetAmount.toFixed(2)}
                            </td>
                          </tr>
                        </ICustomTable>
                      )}
                      {values?.reportType?.value === 3 && (
                        <ICustomTable ths={dateBaseHeader}>
                          {rowDto.map((itm, i) => {
                            grandTotalNetAmount+= +itm?.numTotalNetValue
                            return (
                              <tr key={i}>
                                <td className="text-center"> {i + 1}</td>
                                <td className="text-center">
                                  {" "}
                                  {_dateFormatter(itm.dteDeliveryDate)}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numItemPrice}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numTotalDeliveryQuantity}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numTotalNetValue}
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="text-center" colspan="4" style={{fontWeight: "bold" }}>
                             Grand Total
                            </td>
                            <td className="text-right" style={{fontWeight: "bold" }}>
                              {grandTotalNetAmount.toFixed(2)}
                            </td>
                          </tr>
                        </ICustomTable>
                      )}
                      {values?.reportType?.value === 4 && (
                        <ICustomTable ths={itemBaseHeader}>
                          {rowDto.map((itm, i) => {
                            grandTotalNetAmount+= +itm?.numTotalNetValue
                            return (
                              <tr key={i}>
                                <td className="text-center"> {i + 1}</td>
                                <td className="text-left"> {itm.itemname}</td>
                                <td className="text-left"> {itm.itemcode}</td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numItemPrice}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numTotalDeliveryQuantity}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numTotalNetValue}
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="text-center" colspan="5" style={{fontWeight: "bold" }}>
                             Grand Total
                            </td>
                            <td className="text-right" style={{fontWeight: "bold" }}>
                              {grandTotalNetAmount.toFixed(2)}
                            </td>
                          </tr>
                        </ICustomTable>
                      )}
                      {values?.reportType?.value === 5 && (
                        <ICustomTable ths={itemandDateBaseHeader}>
                          {rowDto.map((itm, i) => {
                            grandTotalNetAmount+= +itm?.numTotalNetValue
                            return (
                              <tr key={i}>
                                <td className="text-center"> {i + 1}</td>
                                <td className="text-center">
                                  {" "}
                                  {_dateFormatter(itm.dteDeliveryDate)}
                                </td>
                                <td className="text-left"> {itm.itemname}</td>
                                <td className="text-left"> {itm.itemcode}</td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numItemPrice}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numTotalDeliveryQuantity}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numTotalNetValue}
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="text-center" colspan="6" style={{fontWeight: "bold" }}>
                             Grand Total
                            </td>
                            <td className="text-right" style={{fontWeight: "bold" }}>
                              {grandTotalNetAmount.toFixed(2)}
                            </td>
                          </tr>
                        </ICustomTable>
                      )}
                      {values?.reportType?.value === 6 && (
                        <ICustomTable ths={salesandDeliveryHeader}>
                          {rowDto.map((itm, i) => {
                            totalCreditAmount += +itm.numCreditAmount;
                            totalCashAmount += +itm.numCashAmount;
                            return (
                              <tr key={i}>
                                <td className="text-center"> {i + 1}</td>
                                <td> {_dateFormatter(itm.dteDeliveryDate)}</td>
                                <td className="text-center">
                                  {" "}
                                  {itm.numTotalDeliveryQuantity}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numDeliveryValue}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numTotalNetValue}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numCashAmount}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numCreditAmount}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {itm.numCreditAmount +
                                    itm.numCashAmount}
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td colspan="5">
                              <b>Grand Total </b>
                            </td>
                            <td className="text-right">
                              <b>{totalCashAmount.toFixed(2)}</b>
                            </td>
                            <td className="text-right">
                              <b>{totalCreditAmount.toFixed(2)}</b>
                            </td>
                            <td className="text-right">
                              <b>
                                {(totalCashAmount +
                                  totalCreditAmount
                                  ).toFixed(2)}
                              </b>
                            </td>
                          </tr>
                        </ICustomTable>
                      )}
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
