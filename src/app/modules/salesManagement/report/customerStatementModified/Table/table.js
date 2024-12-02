import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
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
import { YearDDL } from "../../../../_helper/_yearDDL";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { CreateCustomerStatementExcel } from "../../customerStatement/excel/excel";
import {
  GetCustomerStatementLanding,
  GetSalesOrganizationDDL_api,
  getCustomerNameDDL,
  getCustomerStatementItemBasis,
  getCustomerStatementTopSheet,
  getDistributionDDL,
  getRegionAreaTerritory,
} from "../helper";
import G2GSalesDetailsTable from "./g2gSalesDetails";
import TableGird from "./gird";
import TopSheetTable from "./topSheetTable";
import ItemBasisTable from "./ItemBasisTable";

const ALL = { value: 0, label: "All" };

const initData = {
  fromDate: _firstDateofMonth(),
  fromTime: _todaysStartTime(),
  toDate: _todayDate(),
  toTime: _todaysEndTime(),
  shippointDDL: ALL,
  customerNameDDL: "",
  salesOrg: "",
  businessPartner: ALL,
  port: ALL,
  motherVessel: ALL,
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
  const [portDDL, getPortDDL] = useAxiosGet();
  const [motherVesselDDL, getMotherVesselDDL] = useAxiosGet();
  const [showRDLC, setShowRDLC] = useState(false);
  const [regionDDL, setRegionDDL] = useState();
  const [areaDDL, setAreaDDL] = useState();
  const [territtoryDDL, setTeritroyDDL] = useState();
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId, label: buName, address: buAddress },
  } = useSelector((state) => state?.authData, shallowEqual);

  const shippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  useEffect(() => {
    getPortDDL(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    if (accId && buId) {
      GetSalesOrganizationDDL_api(accId, buId, setSalesOrgDDl);
      getDistributionDDL(accId, buId, setDistributionChannelDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const getGridData = (values) => {
    if (values?.reportType?.value === 4) {
      setShowRDLC(true);
    }
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
    if (values?.reportType?.value === 6) {
      getCustomerStatementItemBasis(
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
        }&motherVesselId=${values?.motherVessel?.value || 0}&portid=${
          values?.port?.value
        }`
      );
    }
  };

  const reportTypes = () => {
    const reports = [
      { value: 1, label: "Details" },
      { value: 2, label: "Top Sheet" },
      { value: 4, label: "Moth Basis Sales" },
    ];
    if ([94, 178].includes(buId)) {
      return [...reports, { value: 3, label: "G2G Sales Details" }];
    }
    if ([4].includes(buId)) {
      return [...reports, { value: 6, label: "Item Basis" }];
    }
    return reports;
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
                {({ values, errors, touched, setFieldValue }) => {
                  return (
                    <>
                      <Form className="form form-label-right">
                        <div className="form-group row global-form printSectionNone">
                          <div className="col-lg-3">
                            <NewSelect
                              name="reportType"
                              options={reportTypes()}
                              value={values?.reportType}
                              label="Report Type"
                              onChange={(valueOption) => {
                                setFieldValue("reportType", valueOption);
                                setRowDto([]);
                                setShowRDLC(false);
                              }}
                              placeholder="Select Report Type"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {[3].includes(values?.reportType?.value) && (
                            <>
                              <div className="col-lg-3">
                                <NewSelect
                                  name="port"
                                  options={[ALL, ...portDDL] || []}
                                  value={values?.port}
                                  label="Loading Port"
                                  onChange={(valueOption) => {
                                    setFieldValue("port", valueOption);
                                    setFieldValue("motherVessel", "");
                                    getMotherVesselDDL(
                                      `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}&PortId=${valueOption?.value ||
                                        0}`
                                    );
                                  }}
                                  placeholder="Loading Port"
                                />
                              </div>
                              <div className="col-lg-3">
                                <NewSelect
                                  name="motherVessel"
                                  options={[
                                    { value: 0, label: "All" },
                                    ...motherVesselDDL,
                                  ]}
                                  value={values?.motherVessel}
                                  label="Mother Vessel"
                                  onChange={(valueOption) => {
                                    setFieldValue("motherVessel", valueOption);
                                  }}
                                  placeholder="Mother Vessel"
                                />
                              </div>
                            </>
                          )}
                          {![4].includes(values?.reportType?.value) && (
                            <FromDateToDateForm
                              obj={{ values, setFieldValue }}
                            />
                          )}
                          {[1, 2, 4, 6].includes(values?.reportType?.value) && (
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
                          {[1, 2, 3, 6].includes(values?.reportType?.value) && (
                            <div className="col-lg-3">
                              <NewSelect
                                name="shippointDDL"
                                options={
                                  [
                                    { value: 0, label: "All" },
                                    ...shippointDDL,
                                  ] || []
                                }
                                value={values?.shippointDDL}
                                label="Shippoint"
                                onChange={(valueOption) => {
                                  setFieldValue("shippointDDL", valueOption);
                                  setRowDto([]);
                                  setShowRDLC(false);
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
                          )}
                          {[1, 2, 4, 6].includes(values?.reportType?.value) && (
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
                                  setShowRDLC(false);
                                  setFieldValue("region", "");
                                  setFieldValue("area", "");
                                  setFieldValue("territory", "");
                                  setFieldValue("customerNameDDL", "");
                                  setFieldValue(
                                    "distributionChannel",
                                    valueOption
                                  );
                                  setRowDto([]);

                                  getRegionAreaTerritory({
                                    channelId: valueOption?.value,
                                    setter: setRegionDDL,
                                    setLoading: setDisabled,
                                    value: "regionId",
                                    label: "regionName",
                                  });
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

                          {[4].includes(values?.reportType?.value) && (
                            <>
                              <div className="col-lg-3">
                                <NewSelect
                                  name="region"
                                  options={regionDDL || []}
                                  value={values?.region}
                                  label="Region"
                                  onChange={(valueOption) => {
                                    setFieldValue("region", valueOption);
                                    setFieldValue("area", "");
                                    setFieldValue("territory", "");
                                    setRowDto([]);
                                    setShowRDLC(false);
                                    if (!valueOption) return;
                                    getRegionAreaTerritory({
                                      channelId:
                                        values?.distributionChannel?.value,
                                      regionId: valueOption?.value,
                                      setter: setAreaDDL,
                                      setLoading: setDisabled,
                                      value: "areaId",
                                      label: "areaName",
                                    });
                                  }}
                                  placeholder="Region"
                                  errors={errors}
                                  touched={touched}
                                  isDisabled={!values?.distributionChannel}
                                />
                              </div>
                              <div className="col-lg-3">
                                <NewSelect
                                  name="area"
                                  options={areaDDL}
                                  value={values?.area}
                                  label="Area"
                                  onChange={(valueOption) => {
                                    setFieldValue("area", valueOption);
                                    setFieldValue("territory", "");
                                    setShowRDLC(false);
                                    if (!valueOption) return;
                                    getRegionAreaTerritory({
                                      channelId:
                                        values?.distributionChannel?.value,
                                      regionId: values?.region?.value,
                                      areaId: valueOption?.value,
                                      setter: setTeritroyDDL,
                                      setLoading: setDisabled,
                                      value: "territoryId",
                                      label: "territoryName",
                                    });
                                  }}
                                  placeholder="Area"
                                  errors={errors}
                                  touched={touched}
                                  isDisabled={!values?.region}
                                />
                              </div>
                              <div className="col-lg-3">
                                <NewSelect
                                  name="territory"
                                  options={territtoryDDL}
                                  value={values?.territory}
                                  label="Territory"
                                  onChange={(valueOption) => {
                                    setFieldValue("territory", valueOption);
                                    setShowRDLC(false);
                                    setRowDto([]);
                                  }}
                                  placeholder="Territory"
                                  errors={errors}
                                  touched={touched}
                                  isDisabled={
                                    !values?.region ||
                                    !values?.area ||
                                    values?.region?.value === 0
                                  }
                                />
                              </div>
                              <div className="col-lg-3">
                                <NewSelect
                                  name="year"
                                  options={YearDDL()}
                                  value={values?.year}
                                  label="Year"
                                  onChange={(valueOption) => {
                                    setFieldValue("year", valueOption);
                                    setShowRDLC(false);
                                  }}
                                  placeholder="Year"
                                />
                              </div>
                            </>
                          )}
                          {(values?.reportType?.value === 1 || 4) && (
                            <div className="col-lg-3">
                              <NewSelect
                                name="customerNameDDL"
                                options={customerNameDDL}
                                value={values?.customerNameDDL}
                                label="Customer Name"
                                onChange={(valueOption) => {
                                  setFieldValue("customerNameDDL", valueOption);
                                  setShowRDLC(false);
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
                                  { value: 0, label: "ALL" },
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
                                ([1, 2, 6].includes(
                                  values?.reportType?.value
                                ) &&
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
                                To Date:{" "}
                                {dateFormatWithMonthName(values?.toDate)}
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
                            <TopSheetTable
                              rowData={rowDto}
                              excelRef={excelRef}
                            />
                          )}
                          {values?.reportType?.value === 3 && (
                            <G2GSalesDetailsTable
                              rowData={G2GSalesGrid}
                              excelRef={excelRef}
                            />
                          )}
                          {values?.reportType?.value === 6 && (
                            <ItemBasisTable
                              rowData={rowDto}
                              excelRef={excelRef}
                            />
                          )}
                        </div>
                      )}
                      {[4].includes(values?.reportType?.value) && showRDLC && (
                        <PowerBIReport
                          reportId={`d56a6e9d-dac7-4335-a793-8dfbc8881acd`}
                          groupId={`e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`}
                          parameterValues={[
                            {
                              name: "IntShipPointId",
                              value: `${values?.shipPoint?.value || 0}`,
                            },
                            {
                              name: "IntBusinessUnitId",
                              value: `${buId || 0}`,
                            },
                            {
                              name: "intDistributionChannel",
                              value: `${values?.distributionChannel?.value ||
                                0}`,
                            },
                            {
                              name: "intregion",
                              value: `${values?.region?.value || 0}`,
                            },
                            {
                              name: "intarea",
                              value: `${values?.area?.value || 0}`,
                            },
                            {
                              name: "intTerritory",
                              value: `${values?.territory?.value || 0}`,
                            },
                            {
                              name: "intCustomer",
                              value: `${values?.customerNameDDL?.value || 0}`,
                            },
                            {
                              name: "intYear",
                              value: `${values?.year?.value ||
                                new Date().getFullYear()}`,
                            },
                          ]}
                          parameterPanel={false}
                        />
                      )}
                    </>
                  );
                }}
              </Formik>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
