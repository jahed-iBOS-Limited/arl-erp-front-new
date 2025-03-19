import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import NewSelect from "../../../../_helper/_select";
import { getSoldToPartnerDDL } from "../../../configuration/partnerThanaRate/helper";
import {
  getCategoryBaseInfo,
  getCustomerNameDDL,
  getHeaders,
  getReportID,
  getSalesmanWiseMtd,
  GetSalesOrganizationDDL_api,
  getSalesReport,
  getUserLoginInfo,
  groupId,
  hasParamsPanel,
  initData,
  itemSizes,
  parameterValues,
  PBIReport,
  reportTypeList,
  viewTypeList,
} from "../helper";

const ths = ["SL", "Product Code", "Product Name", "UoM", "QTY", "Amount"];

export default function SalesReportEssentialTable() {
  const printRef = useRef();
  const shippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const [rowDto, setRowDto] = useState([]);
  const [salesOrgDDl, setSalesOrgDDl] = useState([]);
  const [customerNameDDL, setCustomerNameDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [biReport, setBIReport] = useState(false);
  const [salesManMtdData, setSalesmanMtdData] = useState([]);
  const [soldToPartnerDDL, setSoldToPartnerDDL] = useState([]);

  // get user data from store
  const {
    profileData: { accountId: accId, employeeId: empId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      GetSalesOrganizationDDL_api(accId, buId, setSalesOrgDDl);
      getSoldToPartnerDDL(accId, buId, setSoldToPartnerDDL);
    }
  }, [accId, buId]);

  const getLandingData = (values) => {
    const {
      fromDate,
      fromTime,
      toDate,
      toTime,
      customerName,
      shippoint,
      reportType,
      salesOrg,
      channel,
      region,
      area,
      territory,
    } = values;
    if ([2, 3].includes(reportType?.value)) {
      if (!reportType || !salesOrg) return;
      getSalesReport(
        accId,
        buId,
        fromDate,
        fromTime,
        toDate,
        toTime,
        reportType?.value,
        shippoint?.value || 0,
        customerName?.value || 0,
        salesOrg?.value,
        setRowDto,
        setLoading
      );
    }
    if ([4, 5].includes(reportType?.value)) {
      getUserLoginInfo(accId, buId, empId, setLoading, (resData) => {
        getCategoryBaseInfo({
          buId,
          channelId: channel?.value,
          shipPointId: shippoint?.value,
          regionId: region?.value || 0,
          areaId: area?.value || 0,
          territoryId: territory?.value || 0,
          partnerId: customerName?.value,
          setter: setRowDto,
          setLoading,
          type: reportType?.value,
          empId,
          ratId:
            resData?.empLevelId === 7
              ? +resData?.empTerritoryId
              : +resData?.levelId === 6
              ? +resData?.areaId
              : +resData?.levelId === 5
              ? +resData?.regionId
              : +resData?.empTerritoryId,
          levelId: resData?.empLevelId,
          partId: 1,
        });
      });
    }
  };

  let totalAmount = 0;
  let totalProductQTY = 0;

  const getRow = (itm, i, type) => {
    if (type === 5) {
      return (
        <tr key={i}>
          <td className="text-center"> {i + 1}</td>
          <td>{itm?.cpstrBusinessPartnerName}</td>
          <td>{itm?.cpstrBusinessPartnerCode}</td>
          <td>{itm?.ohstrSalesOrderCode}</td>
          <td>{_dateFormatter(itm?.dteSODate)}</td>
          <td>{itm?.strProductType}</td>
          <td className="text-right">{itm?.MM08}</td>
          <td className="text-right">{itm?.MM10}</td>
          <td className="text-right">{itm?.MM12}</td>
          <td className="text-right">{itm?.MM16}</td>
          <td className="text-right">{itm?.MM20}</td>
          <td className="text-right">{itm?.MM22}</td>
          <td className="text-right">{itm?.MM25}</td>
          <td className="text-right">
            {_fixedPoint(itm?.monTotalSOAmount, true)}
          </td>
        </tr>
      );
    }
    if (type === 4) {
      return (
        <tr key={i}>
          <td className="text-center"> {i + 1}</td>
          <td>{itm?.cpstrBusinessPartnerName}</td>
          <td>{itm?.cpstrBusinessPartnerCode}</td>
          <td>{itm?.strProductType}</td>
          <td className="text-right">{itm?.MM08}</td>
          <td className="text-right">{itm?.MM10}</td>
          <td className="text-right">{itm?.MM12}</td>
          <td className="text-right">{itm?.MM16}</td>
          <td className="text-right">{itm?.MM20}</td>
          <td className="text-right">{itm?.MM22}</td>
          <td className="text-right">{itm?.MM25}</td>
        </tr>
      );
    }
  };

  return (
    <ICard
      printTitle="Print"
      title="Analytics Report"
      isPrint={true}
      isShowPrintBtn={true}
      componentRef={printRef}
      pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
    >
      <div ref={printRef}>
        <div className="mx-auto">
          <Formik
            enableReinitialize={true}
            initialValues={initData}
            onSubmit={() => {}}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <>
                <Form className="form form-label-right">
                  <div className="form-group row global-form printSectionNone">
                    <div className="col-lg-2">
                      <NewSelect
                        name="reportType"
                        options={reportTypeList}
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setSalesmanMtdData([]);
                          setBIReport(false);
                          setFieldValue("shippoint", {
                            value: 0,
                            label: "All",
                          });
                          setFieldValue("customerName", "");
                          setFieldValue("reportType", valueOption);
                          if (valueOption?.value === 3)
                            setFieldValue("shippoint", "");
                        }}
                        placeholder="Report Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {(!PBIReport(values) ||
                      [21].includes(values?.reportType?.value)) && (
                      <>
                        <div className="col-lg-2">
                          <NewSelect
                            name="salesOrg"
                            options={
                              [{ value: 0, label: "All" }, ...salesOrgDDl] || []
                            }
                            value={values?.salesOrg}
                            label="Sales Org"
                            onChange={(valueOption) => {
                              setFieldValue("salesOrg", valueOption);
                              setFieldValue("customerName", "");
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
                            name="customerName"
                            options={
                              [
                                { value: 0, label: "All" },
                                ...customerNameDDL,
                              ] || []
                            }
                            value={values?.customerName}
                            label="Customer Name"
                            onChange={(valueOption) => {
                              setFieldValue("customerName", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Customer name"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              values?.reportType?.label === "Shippoint" ||
                              !values?.salesOrg
                            }
                          />
                        </div>
                      </>
                    )}
                    {[21].includes(values?.reportType?.value) && (
                      <>
                        <RATForm
                          obj={{
                            values,
                            setFieldValue,
                            region: false,
                            area: false,
                            territory: false,
                            columnSize: "col-lg-2",
                          }}
                        />
                        <div className="col-lg-2">
                          <NewSelect
                            name="productType"
                            options={[
                              { value: "Straight", label: "Straight" },
                              { value: "Bend", label: "Bend" },
                              { value: "Wastage", label: "Wastage" },
                            ]}
                            value={values?.productType}
                            label="Product Type"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setBIReport(false);
                              setFieldValue("productType", valueOption);
                            }}
                            placeholder="Product Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="itemGrade"
                            options={[
                              { value: "400", label: "400" },
                              { value: "500W", label: "500W" },
                              { value: "Wastage", label: "Wastage" },
                            ]}
                            value={values?.itemGrade}
                            label="Item Grade"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setBIReport(false);
                              setFieldValue("itemGrade", valueOption);
                            }}
                            placeholder="Item Grade"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="itemSize"
                            options={itemSizes}
                            value={values?.itemSize}
                            label="Item Size"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setBIReport(false);
                              setFieldValue("itemSize", valueOption);
                            }}
                            placeholder="Item Size"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </>
                    )}
                    {[20].includes(values?.reportType?.value) && (
                      <>
                        <div className="col-lg-2">
                          <NewSelect
                            name="viewType"
                            options={viewTypeList}
                            value={values?.viewType}
                            label="View Type"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setBIReport(false);
                              setFieldValue("viewType", valueOption);
                            }}
                            placeholder="View Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>

                        <div className="col-lg-2">
                          <NewSelect
                            name="soldToPartner"
                            options={[
                              { value: 0, label: "All" },
                              ...soldToPartnerDDL,
                            ]}
                            value={values?.soldToPartner}
                            label="Sold To Partner"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setBIReport(false);
                              setFieldValue("soldToPartner", valueOption);
                            }}
                            placeholder="Sold to Partner"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </>
                    )}

                    {[14, 20, 21]?.includes(values?.reportType?.value) ? (
                      <>
                        <FromDateToDateForm
                          obj={{
                            values,
                            setFieldValue,
                            onChange: () => {
                              setRowDto([]);
                            },
                            colSize: "col-lg-2",
                          }}
                        />
                        {[14].includes(values?.reportType?.value) && (
                          <div className="col-lg-2">
                            <InputField
                              value={values?.certainDate}
                              label="Certain date"
                              name="certainDate"
                              type="date"
                              onChange={(e) => {
                                setFieldValue("certainDate", e?.target?.value);
                                setRowDto([]);
                              }}
                            />
                          </div>
                        )}
                      </>
                    ) : null}

                    {!PBIReport(values) && (
                      <>
                        {[2, 3].includes(values?.reportType?.value) && (
                          <FromDateToDateForm
                            obj={{
                              values,
                              setFieldValue,
                              onChange: () => {
                                setRowDto([]);
                              },
                              colSize: "col-lg-2",
                              time: true,
                            }}
                          />
                        )}

                        <div className="col-lg-2">
                          <NewSelect
                            name="shippoint"
                            options={[
                              { value: 0, label: "All" },
                              ...shippointDDL,
                            ]}
                            value={values?.shippoint}
                            label="Ship point"
                            onChange={(valueOption) => {
                              setFieldValue("shippoint", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Ship Point"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              values?.reportType?.label === "Customer Name"
                            }
                          />
                        </div>

                        {/* This is a common form for Channel, Region, Area, Territory */}
                        {[4, 5].includes(values?.reportType?.value) && (
                          <RATForm
                            obj={{
                              values,
                              setFieldValue,
                              columnSize: "col-lg-2",
                            }}
                          />
                        )}
                      </>
                    )}
                    <div className="col-lg-2 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          if (values?.reportType?.value === 14) {
                            getSalesmanWiseMtd(
                              buId,
                              values,
                              setSalesmanMtdData,
                              setLoading
                            );
                          } else {
                            if (PBIReport(values)) {
                              setBIReport(true);
                            } else {
                              getLandingData(values);
                            }
                          }
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </Form>
                {loading && <Loading />}
                {rowDto?.length > 0 && !PBIReport(values) && (
                  <div className=" my-5">
                    {[2, 3].includes(values?.reportType?.value) && (
                      <ICustomTable ths={ths}>
                        {rowDto?.map((itm, i) => {
                          totalAmount += +itm.amount;
                          totalProductQTY += +itm.productQTY;
                          return (
                            <tr key={i}>
                              <td className="text-center"> {i + 1}</td>
                              <td> {itm.productCode}</td>
                              <td> {itm.productName}</td>
                              <td> {itm.uom}</td>
                              <td className="text-right">
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
                          <td colspan="4" className="text-right">
                            <b>Grand Total </b>
                          </td>
                          <td className="text-right">
                            <b>
                              {numberWithCommas(Math.round(totalProductQTY))}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>{numberWithCommas(totalAmount.toFixed(2))}</b>
                          </td>
                        </tr>
                      </ICustomTable>
                    )}
                    {[4, 5].includes(values?.reportType?.value) && (
                      <ICustomTable ths={getHeaders(values?.reportType?.value)}>
                        {rowDto?.map((itm, i) => {
                          return getRow(itm, i, values.reportType?.value);
                        })}
                        <tr>
                          <td></td>
                        </tr>
                      </ICustomTable>
                    )}
                  </div>
                )}

                {/* show power BI reports */}
                {PBIReport(values) && biReport ? (
                  <PowerBIReport
                    groupId={groupId}
                    reportId={getReportID(values?.reportType?.value)}
                    parameterPanel={hasParamsPanel(values)}
                    parameterValues={parameterValues(values, buId)}
                  />
                ) : null}

                {salesManMtdData?.length > 0 &&
                [14]?.includes(values?.reportType?.value) ? (
                  <>
                    <div
                      style={{ maxHeight: "500px" }}
                      className="scroll-table _table scroll-table-auto"
                    >
                      <table
                        id="table-to-xlsx"
                        ref={printRef}
                        className="table table-striped table-bordered global-table table-font-size-sm"
                      >
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Region</th>
                            <th>Area</th>
                            <th>Territory</th>
                            <th style={{ width: "60px" }}>Emp. ID</th>
                            <th style={{ width: "120px" }}>Salesman Name</th>
                            <th style={{ width: "120px" }}>Designation</th>
                            <th style={{ width: "50px" }}>Sales Target</th>
                            <th>MTD Sales Target</th>
                            <th>MTD Achievement</th>
                            <th>%</th>
                            <th>Collection Target</th>
                            <th>MTD Collection Target</th>
                            <th>MTD Achievement</th>
                            <th>%</th>
                            <th>MTD Outstanding</th>
                            <th>Over Due</th>
                            <th>%</th>
                            <th>MTD Sales/Day</th>
                            <th>Required Sales/Day</th>
                            <th>MTD Sales in Last Month</th>
                            <th>M to M Sales Growth %</th>
                            <th>
                              Month End Projected Sales Volume in Current Trend
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesManMtdData?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.nl5}</td>
                                <td>{item?.nl6}</td>
                                <td>{item?.nl7}</td>
                                <td>{item?.intEmployeeId}</td>
                                <td>{item?.strEmployeeName}</td>
                                <td>{item?.strDesignationName}</td>
                                <td className="text-right">
                                  {_fixedPoint(item?.numTargetQuantity, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.decMTDSalesTarget, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(
                                    item?.decMTDSalesTargetAchivement,
                                    true
                                  )}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(
                                    item?.decMTDSalesTargetAchPerc,
                                    true
                                  )}
                                  %
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.decCollectionTarget, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(
                                    item?.decMTDCollectionTarget,
                                    true
                                  )}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(
                                    item?.decMTDCollectionTargetAchivement,
                                    true
                                  )}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(
                                    item?.decMTDCollectionTargetAchPerc,
                                    true
                                  )}
                                  %
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.decOutstanding, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.decOverDue, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(
                                    item?.decOutstndingOverduePerc,
                                    true
                                  )}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.MTDSalesPerDay, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.RequiredSalesPerDay, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.decMTDSalesInLM, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(
                                    item?.MToMSalesGrowthPercnt,
                                    true
                                  )}
                                  %
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.MonthEndProjected, true)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : null}
              </>
            )}
          </Formik>
        </div>
      </div>
    </ICard>
  );
}
