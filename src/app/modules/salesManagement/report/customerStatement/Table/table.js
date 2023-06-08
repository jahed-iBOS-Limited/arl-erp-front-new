import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";

import {
  getCustomerNameDDL,
  GetCustomerStatementLanding,
  GetSalesOrganizationDDL_api,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import {
  dateFormatWithMonthName,
  _dateFormatter,
} from "../../../../_helper/_dateFormate";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { CreateCustomerStatementExcel } from "../excel/excel";

const ths = [
  "Sl",
  "Date",
  "SO Number",
  "Challan No",
  "Product Name",
  "UoM",
  "Quantity",
  "Rate",
  "Amount",
];
const thsWithShippointAll = [
  "Sl",
  "Date",
  "SO Number",
  "Challan No",
  "Product Name",
  "Shippoint",
  "UoM",
  "Quantity",
  "Rate",
  "Amount",
];
const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  shippointDDL: "",
  customerNameDDL: "",
  salesOrg: "",
};

export default function CustomerStatementReportTable() {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [salesOrgDDl, setSalesOrgDDl] = useState([]);
  const [customerNameDDL, setCustomerNameDDL] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId, label: buName, address: buAddress },
  } = useSelector((state) => state?.authData, shallowEqual);

  const shippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      GetSalesOrganizationDDL_api(accId, buId, setSalesOrgDDl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId]);
  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Customer Statement"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <Formik enableReinitialize={true} initialValues={initData}>
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-2">
                          <InputField
                            value={values?.fromDate}
                            label="From date"
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e?.target?.value);
                              setRowDto([]);
                            }}
                          />
                        </div>

                        <div className="col-lg-2">
                          <InputField
                            value={values?.toDate}
                            label="To date"
                            name="toDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("toDate", e?.target?.value);
                              setRowDto([]);
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="salesOrg"
                            options={salesOrgDDl || []}
                            value={values?.salesOrg}
                            label="Sales Org"
                            onChange={(valueOption) => {
                              setFieldValue("salesOrg", valueOption);
                              setFieldValue("customerNameDDL", "");
                              setRowDto([]);
                              getCustomerNameDDL(
                                accId,
                                buId,
                                valueOption?.value,
                                setCustomerNameDDL
                              );
                            }}
                            placeholder="Sales Org"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="shippointDDL"
                            options={
                              [{ value: 0, label: "All" }, ...shippointDDL] ||
                              []
                            }
                            value={values?.shippointDDL}
                            label="Shippoint"
                            onChange={(valueOption) => {
                              setFieldValue("shippointDDL", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Ship Point"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              values?.reportDDL?.label === "All" ||
                              values?.reportDDL?.label === "Customer Name"
                            }
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="customerNameDDL"
                            options={customerNameDDL || []}
                            value={values?.customerNameDDL}
                            label="Customer Name"
                            onChange={(valueOption) => {
                              setFieldValue("customerNameDDL", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Customer name"
                            errors={errors}
                            touched={touched}
                            isDisabled={!values?.salesOrg}
                          />
                        </div>
                        <div className="mt-5">
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              GetCustomerStatementLanding(
                                accId,
                                buId,
                                values,
                                setLoading,
                                setRowDto
                              )
                            }
                            disabled={
                              !values?.salesOrg ||
                              !values?.shippointDDL ||
                              !values?.customerNameDDL
                            }
                          >
                            View
                          </button>
                        </div>
                        <div className="mt-5 ml-1">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              CreateCustomerStatementExcel(
                                values,
                                rowDto,
                                buName,
                                buAddress,
                                "Customer Statement",
                                "Customer Statement"
                                // 100,
                                // "taka"
                              );
                            }}
                            disabled={rowDto?.length < 1}
                          >
                            Export Excel
                          </button>
                        </div>
                      </div>
                    </Form>
                    {loading && <Loading />}
                    {rowDto?.length > 0 && (
                      <div className="my-5">
                        <div className="text-center my-2">
                          <h3>
                            <b> {buName} </b>
                          </h3>
                          <h5>
                            <b> {buAddress} </b>
                          </h5>
                          <h3>
                            <b>Customer Statement</b>
                          </h3>
                          <div className="d-flex justify-content-center">
                            <h5>
                              From Date:
                              {dateFormatWithMonthName(values?.fromDate)}
                            </h5>
                            <h5 className="ml-5">
                              To Date: {dateFormatWithMonthName(values?.toDate)}
                            </h5>
                          </div>
                        </div>
                        <ICustomTable
                          ths={
                            values?.shippointDDL?.label === "All"
                              ? thsWithShippointAll
                              : ths
                          }
                        >
                          {rowDto.map((itmOne) => {
                            return (
                              <>
                                <tr style={{ background: "#f1dbdb" }}>
                                  <td
                                    colSpan={
                                      values?.shippointDDL?.label === "All"
                                        ? thsWithShippointAll.length
                                        : ths.length
                                    }
                                    className="text-left"
                                  >
                                    <b>{itmOne?.customerName}</b>
                                  </td>
                                </tr>

                                {itmOne?.objList?.map((itm, i) => {
                                  return (
                                    <tr key={i}>
                                      <td>{i + 1}</td>
                                      <td>
                                        {_dateFormatter(itm?.deliveryDate)}
                                      </td>
                                      <td>{itm?.so}</td>
                                      <td>{itm.deliveryCode}</td>
                                      <td> {itm.itemName}</td>
                                      {values?.shippointDDL?.label ===
                                        "All" && <td>{itm.shipPointName}</td>}
                                      <td className="text-center">
                                        {itm.uomName}
                                      </td>
                                      <td className="text-center">
                                        {numberWithCommas(itm.deliveryQty)}
                                      </td>
                                      <td className="text-right">
                                        {numberWithCommas(
                                          itm.itemRate.toFixed(2)
                                        )}
                                      </td>
                                      <td className="text-right">
                                        {numberWithCommas(
                                          itm.deliveryValue.toFixed(2)
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr>
                                  <td
                                    colSpan={
                                      values?.shippointDDL?.label === "All"
                                        ? "7"
                                        : "6"
                                    }
                                    className="text-right"
                                  >
                                    <b> Total </b>
                                  </td>
                                  <td className="text-center">
                                    <b>
                                      {numberWithCommas(
                                        itmOne?.objList
                                          ?.reduce(
                                            (acc, cur) =>
                                              (acc += cur?.deliveryQty),
                                            0
                                          )
                                          .toFixed(2)
                                      )}
                                    </b>
                                  </td>
                                  <td></td>
                                  <td className="text-right">
                                    <b>
                                      {numberWithCommas(
                                        itmOne?.objList
                                          ?.reduce(
                                            (acc, cur) =>
                                              (acc += cur?.deliveryValue),
                                            0
                                          )
                                          .toFixed(2)
                                      )}
                                    </b>
                                  </td>
                                </tr>
                              </>
                            );
                          })}

                          {/* {rowDto.map((itm, i) => {
                            totalAmount += +itm?.deliveryValue;
                            totalProductQTY += +itm?.deliveryQty;
                            return (
                              <tr key={i}>
                                <td>{i+ 1}</td>
                                <td>{_dateFormatter(itm?.deliveryDate)}</td>
                                <td>{itm.deliveryCode}</td>
                                <td> {itm.itemName}</td>
                                {values?.shippointDDL?.label === "All" && (
                                  <td>{itm.shipPointName}</td>
                                )}
                                <td className="text-center">{itm.uomName}</td>
                                <td className="text-center">{numberWithCommas(itm.deliveryQty)}</td>
                                <td className="text-right">{numberWithCommas(itm.itemRate.toFixed(2))}</td>
                                <td className="text-right">{numberWithCommas(itm.deliveryValue.toFixed(2))}</td>
                              </tr>
                            );
                          })} */}
                          {/* <tr>
                            <td
                              colSpan={
                                values?.shippointDDL?.label === "All"
                                  ? "6"
                                  : "5"
                              }
                            >
                              <b> Total </b>
                            </td>
                            <td className="text-center">
                              <b>
                                {numberWithCommas(Math.round(totalProductQTY))}
                              </b>
                            </td>
                            <td></td>
                            <td className="text-right">
                              <b> {numberWithCommas(totalAmount.toFixed(2))}</b>
                            </td>
                          </tr> */}
                        </ICustomTable>
                      </div>
                    )}
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
