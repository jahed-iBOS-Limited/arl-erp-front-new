import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import ICard from "../../../../_helper/_card";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../../_helper/_currentTime";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { CreateCustomerStatementExcel } from "../../customerStatement/excel/excel";
import {
  getCustomerNameDDL,
  GetCustomerStatementLanding,
  getCustomerStatementTopSheet,
  getDistributionDDL,
  GetSalesOrganizationDDL_api,
} from "../helper";
import TableGird from "./gird";
import TopSheetTable from "./topSheetTable";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import G2GSalesDetailsTable from "./g2gSalesDetails";

const initData = {
  fromDate: _firstDateofMonth(),
  fromTime: _todaysStartTime(),
  toDate: _todayDate(),
  toTime: _todaysEndTime(),
  shippointDDL: "",
  customerNameDDL: "",
  salesOrg: "",
  businessPartner: "",
};

export default function CustomerStatementModifiedReportTable() {
  const printRef = useRef();
  const excelRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [salesOrgDDl, setSalesOrgDDl] = useState([]);
  const [customerNameDDL, setCustomerNameDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [G2GSalesGrid, getG2GSalesGrid, loader] = useAxiosGet();

  // get user profile data from store
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
      getDistributionDDL(accId, buId, setDistributionChannelDDL);
    }
  }, [accId, buId]);

  const getGridData = (values) => {
    if (values?.reportType?.value === 1) {
      GetCustomerStatementLanding(accId, buId, values, setLoading, setRowDto);
    }
    if (values?.reportType?.value === 2) {
      getCustomerStatementTopSheet(
        accId,
        buId,
        values?.fromDate,
        values?.toDate,
        values?.customerNameDDL?.value || 0,
        values?.shippointDDL?.value,
        values?.salesOrg?.value,
        values?.distributionChannel?.value,
        setRowDto,
        setLoading
      );
    }
    if (values?.reportType?.value === 3) {
      getG2GSalesGrid(
        `/tms/LigterLoadUnload/G2GSalesStatement?accountId=${accId}&businessUnitId=${buId}&shippointId=${values
          ?.shippointDDL?.value || 0}&businessPartnerId=${values
          ?.businessPartner?.value || 0}&fromDate=${values?.fromDate}&toDate=${
          values?.toDate
        }`
      );
    }
  };

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
                        <div className="col-lg-3">
                          <NewSelect
                            name="reportType"
                            options={[
                              { value: 1, label: "Details" },
                              { value: 2, label: "Top Sheet" },
                              { value: 3, label: "G2G Sales Details" },
                            ]}
                            value={values?.reportType}
                            label="Report Type"
                            onChange={(valueOption) => {
                              setFieldValue("reportType", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Select Report Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <FromDateToDateForm obj={{ values, setFieldValue }} />
                        {[1, 2].includes(values?.reportType?.value) && (
                          <div className="col-lg-3">
                            <NewSelect
                              name="salesOrg"
                              options={salesOrgDDl || []}
                              value={values?.salesOrg}
                              label="Sales Org"
                              onChange={(valueOption) => {
                                setFieldValue("customerNameDDL", "");
                                setFieldValue("distributionChannel", "");
                                setFieldValue("salesOrg", valueOption);
                                setRowDto([]);
                              }}
                              placeholder="Sales Org"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        )}
                        <div className="col-lg-3">
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
                        {[1, 2].includes(values?.reportType?.value) && (
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
                                setFieldValue("customerNameDDL", "");
                                setFieldValue(
                                  "distributionChannel",
                                  valueOption
                                );
                                setRowDto([]);
                                getCustomerNameDDL(
                                  accId,
                                  buId,
                                  values?.salesOrg?.value,
                                  valueOption?.value,
                                  setCustomerNameDDL
                                );
                              }}
                              placeholder="Distribution Channel"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        )}
                        {values?.reportType?.value === 1 && (
                          <div className="col-lg-3">
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
                              isDisabled={!values?.distributionChannel}
                            />
                          </div>
                        )}
                        {values?.reportType?.value === 3 && (
                          <div className="col-lg-3">
                            <NewSelect
                              name="businessPartner"
                              options={[
                                { value: 73244, label: "BADC" },
                                { value: 73245, label: "BCIC" },
                              ]}
                              value={values?.businessPartner}
                              label="Business Partner"
                              onChange={(e) => {
                                setFieldValue("businessPartner", e);
                              }}
                              placeholder="Business Partner"
                            />
                          </div>
                        )}

                        <div className="mt-5">
                          <button
                            className="btn btn-primary"
                            onClick={() => getGridData(values)}
                            disabled={
                              ([1, 2].includes(values?.reportType?.value) &&
                                !values?.salesOrg &&
                                !values?.shippointDDL &&
                                !values?.distributionChannel) ||
                              (values?.reportType?.value === 1 &&
                                !values?.customerNameDDL) ||
                              (values?.reportType?.value === 3 &&
                                !values?.businessPartner) ||
                              !values?.reportType
                            }
                          >
                            View
                          </button>
                        </div>
                        <div className="mt-5 ml-1">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              if ([2, 3].includes(values.reportType.value)) {
                                excelRef.current.handleDownload();
                              } else {
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
                              }
                            }}
                            disabled={
                              rowDto?.length < 1 && G2GSalesGrid?.length < 1
                            }
                          >
                            Export Excel
                          </button>
                        </div>
                      </div>
                    </Form>
                    {(loading || loader) && <Loading />}
                    {(rowDto?.length > 0 || G2GSalesGrid?.length > 0) && (
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
                        {values?.reportType?.value === 1 && (
                          <TableGird
                            rowDto={rowDto}
                            values={values}
                            buId={buId}
                          />
                        )}
                        {values?.reportType?.value === 2 && (
                          <TopSheetTable rowData={rowDto} excelRef={excelRef} />
                        )}
                        {values?.reportType?.value === 3 && (
                          <G2GSalesDetailsTable
                            rowData={G2GSalesGrid}
                            excelRef={excelRef}
                          />
                        )}
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
