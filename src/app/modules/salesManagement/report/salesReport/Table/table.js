import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import {
  getCustomerNameDDL,
  GetSalesOrganizationDDL_api,
} from "../helper";
import Axios from "axios";
import Loading from "../../../../_helper/_loading";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import QtyClickModel from "./model/qtyClickModel";
import IViewModal from "../../../../_helper/_viewModal";
const reportDDL = [
  // { value: 1, label: "All" },
  { value: 2, label: "Shippoint" },
  { value: 3, label: "Customer Name" },
];

// Validation schema
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required("From Date is required"),

  toDate: Yup.date().required("To Date is required"),

  reportDDL: Yup.object().shape({
    label: Yup.string().required("Report Type is required"),
    value: Yup.string().required("Report Type is required"),
  }),
  shippointDDL: Yup.object().shape({
    label: Yup.string().required("Ship Point is required"),
    value: Yup.string().required("Ship Point is required"),
  }),
  customerNameDDL: Yup.object().shape({
    label: Yup.string().required("Customer Name is required"),
    value: Yup.string().required("Customer Name is required"),
  }),
});

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportDDL: "",
  shippointDDL: "",
  customerNameDDL: "",
  salesOrg: "",
};

export default function SalesReportTable({
  btnRef,
  saveHandler,
  resetBtnRef,
  empDDL,
  isEdit,
}) {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [salesOrgDDl, setSalesOrgDDl] = useState([]);
  const [customerNameDDL, setCustomerNameDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isQtyClickModel, setIsQtyClickModel] = useState(false);
  const [viewClickRowData, setViewClickRowData] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const shippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetSalesOrganizationDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSalesOrgDDl
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const getSalesReportData = async (values, setter) => {
    const { fromDate, toDate, reportDDL } = values;

    if (!fromDate || !toDate || !reportDDL) return;

    try {
      setLoading(true);
      const res = await Axios.get(
        `/oms/OManagementReport/GetSalesReportInDateRange?AccountId=${
          profileData?.accountId
        }&BusinessunitId=${selectedBusinessUnit?.value}&FromDate=${
          values?.fromDate
        }&ToDate=${values?.toDate}&ReportTypeId=${
          values?.reportDDL?.value
        }&ShippointId=${values?.shippointDDL?.value || 0}&CustomerId=${values
          ?.customerNameDDL?.value ||
          0}&PageNo=0&PageSize=100000000&viewOrder=desc&SalesOrganizationId=${
          values?.salesOrg?.value
        }`
      );
      if (res.status === 200 && res?.data) {
        setLoading(false);
        setter(res?.data?.data);
      }
    } catch (error) {
      //
      setLoading(false);
    }
  };
  let totalAmount = 0;
  let totalProductQTY = 0;
  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title=""
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
          pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <div className="text-center my-2">
                <h3>
                  <b className=""> DELIVERY REPORT </b>
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
                  saveHandler(values, () => {
                    resetForm(initData);
                  });
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-2">
                          <IInput
                            value={values?.fromDate}
                            label="From date"
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e?.target?.value);
                              setRowDto([]);
                              const value = {
                                ...values,
                                fromDate: e?.target?.value,
                              };
                              getSalesReportData(value, setRowDto);
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
                              setRowDto([]);
                              const value = {
                                ...values,
                                toDate: e?.target?.value,
                              };
                              getSalesReportData(value, setRowDto);
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
                              const value = {
                                ...values,
                                salesOrg: valueOption,
                              };
                              getSalesReportData(value, setRowDto);
                              getCustomerNameDDL(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
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
                            name="reportDDL"
                            options={reportDDL}
                            value={values?.reportDDL}
                            label="Report Type"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("shippointDDL", {
                                value: 0,
                                label: "All",
                              });

                              setFieldValue("customerNameDDL", "");
                              setFieldValue("reportDDL", valueOption);
                              const value = {
                                ...values,
                                shippointDDL: "",
                                customerNameDDL: "",
                                reportDDL: valueOption,
                              };
                              getSalesReportData(value, setRowDto);
                              if (valueOption?.value === 3)
                                setFieldValue("shippointDDL", "");
                            }}
                            placeholder="Report Type"
                            errors={errors}
                            touched={touched}
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
                              const value = {
                                ...values,
                                customerNameDDL: valueOption,
                              };
                              getSalesReportData(value, setRowDto);
                            }}
                            placeholder="Customer name"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              values?.reportDDL?.label === "Shippoint" ||
                              !values?.salesOrg
                            }
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
                              const value = {
                                ...values,
                                shippointDDL: valueOption,
                              };
                              getSalesReportData(value, setRowDto);
                            }}
                            placeholder="Ship Point"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              values?.reportDDL?.label === "Customer Name"
                            }
                          />
                        </div>
                      </div>
                      {loading && <Loading />}
                      <div className=" my-5 salesReportTableWrapper">
                        <div className="react-bootstrap-table table-responsive">
                          <table
                            className={
                              "table table-striped table-bordered global-table "
                            }
                          >
                            <thead>
                              <tr>
                                <th> Sl </th>
                                <th> Product Code </th>
                                <th> Product Name </th>
                                {values?.reportDDL?.value === 2 && (
                                  <th> Shippoint Name </th>
                                )}
                                <th> UoM </th>
                                <th> QTY </th>
                                <th> Amount </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto.map((itm, i) => {
                                totalAmount += +itm.amount;
                                totalProductQTY += +itm.productQTY;
                                return (
                                  <tr key={i}>
                                    <td className="text-center"> {i + 1}</td>
                                    <td> {itm.productCode}</td>
                                    <td> {itm.productName}</td>
                                    {values?.reportDDL?.value === 2 && (
                                      <td> {itm.shipPointName}</td>
                                    )}
                                    <td> {itm.uom}</td>
                                    <td
                                      className="text-center pointer salesReportQtyModel"
                                      onClick={() => {
                                        setIsQtyClickModel(true);
                                        setViewClickRowData(itm);
                                      }}
                                    >
                                      {" "}
                                      {numberWithCommas(itm.productQTY)}
                                    </td>
                                    <td className="text-right">
                                      {numberWithCommas(itm.amount.toFixed(2))}
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr>
                                <td
                                  colspan={
                                    values?.reportDDL?.value === 2 ? 5 : 4
                                  }
                                >
                                  <b>Grand Total </b>
                                </td>
                                <td className="text-center">
                                  <b>
                                    {numberWithCommas(
                                      totalProductQTY.toFixed(2)
                                    )}
                                  </b>
                                </td>
                                <td className="text-right">
                                  <b>
                                    {numberWithCommas(totalAmount.toFixed(2))}
                                  </b>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {/*QtyClickModel  */}
                      <IViewModal
                        show={isQtyClickModel}
                        onHide={() => setIsQtyClickModel(false)}
                        title="Delivery Details"
                      >
                        <QtyClickModel viewClickRowData={viewClickRowData} />
                      </IViewModal>
                      {/*  */}
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
