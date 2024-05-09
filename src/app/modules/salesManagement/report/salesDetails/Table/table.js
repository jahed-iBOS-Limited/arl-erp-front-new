import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { getItemCategoryDDLByTypeId_api } from "../../../../config/material-management/itemBasicInfo/helper";
import {
  getItemTypeListDDL_api,
  ItemSubCategory_api,
} from "../../../../inventoryManagement/reports/inventoryStock/helper";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import ICard from "../../../../_helper/_card";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import ICustomTable from "../../../../_helper/_customTable";
import Loading from "../../../../_helper/_loading";

const reports = [
  { value: 1, label: "Sales Details Report" },
  { value: 2, label: "Item Category Base Report" },
  { value: 3, label: "Item Price Rate Analysis Report" },
  { value: 4, label: "Item Rate Top Sheet" },
  // { value: 5, label: "Daily Delivery Challan for Consumer Group" },
  // { value: 6, label: "Daily Sales Order for Consumer Group" },
  { value: 7, label: "Sales Order and Delivery Challan" },
  { value: 8, label: "Delivery Challan and Sales Order Pending" },
  { value: 9, label: "Order Vs Challan Duration Gap" },
  { value: 10, label: "Item Pending" },
  { value: 11, label: "Market Basket Analysis" },
  { value: 12, label: "Order vs Delivery vs Collection Date Wise" },
];

const getTypes = (values) => {
  const reportId = values?.report?.value;
  if (reportId === 2) {
    return [
      { value: 1, label: "Item Category Base" },
      { value: 2, label: "Item Base" },
    ];
  } else if (reportId === 7) {
    return [
      { value: 1, label: "Top Sheet for Delivery Challan" },
      { value: 2, label: "Top Sheet for Sales Order" },
      { value: 3, label: "Delivery Challan Details" },
      { value: 4, label: "Sales Order Details" },
    ];
  } else if (reportId === 10) {
    return [
      { value: 1, label: "Summary" },
      { value: 2, label: "Pending" },
    ];
  } else {
    return [];
  }
};

// Validation schema
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required("From Date is required"),

  toDate: Yup.date().required("To Date is required"),

  reportDDL: Yup.object().shape({
    label: Yup.string().required("Report Type is required"),
    value: Yup.string().required("Report Type is required"),
  }),
  shipPoint: Yup.object().shape({
    label: Yup.string().required("Ship Point is required"),
    value: Yup.string().required("Ship Point is required"),
  }),
});

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  report: "",
  shipPoint: "",
  channel: "",
  region: "",
  area: "",
  territory: "",
  reportType: "",
  partner: "",
  productType: "",
  itemGroup: "",
  subGroup: "",
  salesOrg: "",
  item: "",
};

const headers = [
  "SL",
  "Antecedents",
  "Consequence",
  "Antecedent Support",
  "Consequent Support",
  "Support",
  "confidence",
  "lift",
  "leverage",
  "conviction",
  "Hangs Metric",
];

export default function SalesDetailsTable({ saveHandler }) {
  const [showReport, setShowReport] = useState(false);
  const [soldToPartnerDDL, getSoldToPartnerDDL] = useAxiosGet();
  const [productTypes, setProductTypes] = useState([]);
  const [itemGroups, setItemGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [salesOrgs, getSalesOrgs] = useAxiosGet();
  const [items, getItems] = useAxiosGet();
  const [rows, getRows, loading] = useAxiosGet();

  const shippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  // get selected business unit from store
  const {
    selectedBusinessUnit: { value: buId },
    profileData: { accountId: accId, userId },
  } = useSelector((state) => state.authData, shallowEqual);

  useEffect(() => {
    if (buId !== 144) {
      getSoldToPartnerDDL(
        `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
      );
    }
    getItemTypeListDDL_api(setProductTypes);
    getSalesOrgs(
      `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const reportId = (values) => {
    const id = values?.report?.value;
    return id === 1
      ? `14d2263a-c732-48f9-9b6c-ce80556f8e85`
      : id === 2
      ? `9797b99a-9d50-4ed8-91ff-ee5e93558c6b`
      : id === 3
      ? `e4f0b500-db98-41e9-a932-eb4ad1f9ad8e`
      : id === 4
      ? `39ced584-8519-4e78-aa2b-0e6a37886992`
      : id === 5
      ? `2da2a02d-bc20-46a1-86fe-9b2aae43a50f`
      : id === 6
      ? `1258397d-84f6-4079-b9ef-35ce50a501c6`
      : id === 7
      ? `bbabf651-9f58-41cb-91c8-c6524256b404`
      : id === 8
      ? `0fdc584e-859d-44e2-9066-b675c6fa61f6`
      : id === 9
      ? `709ccf52-b436-4d88-ad5f-992b86e7357d`
      : id === 10
      ? `4e8c5f91-f84f-4b10-bf10-8304e395c2af`
      : id === 12
      ? `ca8d1e8f-90f4-4cc2-8c99-e1ca9f290f8d`
      : "";
  };
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;

  const parameterValues = (values) => {
    const id = values?.report?.value;
    const paramsForSalesDetails = [
      { name: "BusinessUnitId", value: `${buId}` },
      { name: "intChannelid", value: `${values?.channel?.value}` },
      { name: "ShipPointId", value: `${values?.shipPoint?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "LoginUser", value: `${userId}` },
    ];

    const paramsForCategoryBaseItem = [
      { name: "IntBusinessUnitId", value: `${buId}` },
      { name: "intSoldToPartnerId", value: `${values?.partner?.value}` },
      {
        name: "strProductType",
        value: `${
          values?.productType?.value === 0 ? "All" : values?.productType?.value
        }`,
      },
      {
        name: "subGroup",
        value: `${
          values?.subGroup?.value === 0 ? "All" : values?.subGroup?.value
        }`,
      },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "ReportType", value: `${values?.reportType?.value}` },
    ];

    const paramsForPriceRate = [
      { name: "IntBusinessUnitId", value: `${buId}` },
      { name: "intSoldToPartnerId", value: `${values?.partner?.value}` },
      { name: "item", value: `${values?.item?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ];

    const fourthParams = [
      { name: "BusinessUnitId", value: `${buId}` },
      { name: "intChannelid", value: `${values?.channel?.value}` },
      { name: "ShipPointId", value: `${values?.shipPoint?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ];

    const fifthParams = [
      { name: "BusinessUnitId", value: `${buId}` },
      { name: "ShipPointId", value: `${values?.shipPoint?.value}` },
      { name: "Regionid", value: `${values?.region?.value}` },
      { name: "AreaId", value: `${values?.area?.value}` },
      { name: "TerritoryId", value: `${values?.territory?.value}` },
      { name: "intChannelid", value: `${values?.channel?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ];

    const sixthParams = [
      { name: "BusinessUnitId", value: `${buId}` },
      { name: "intShippointId", value: `${values?.shipPoint?.value}` },
      { name: "Regionid", value: `${values?.region?.value}` },
      { name: "AreaId", value: `${values?.area?.value}` },
      { name: "TerritoryId", value: `${values?.territory?.value}` },
      { name: "intChannelid", value: `${values?.channel?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ];

    const seventhParams = [
      { name: "BusinessUnitId", value: `${buId}` },
      { name: "Regionid", value: `${values?.region?.value}` },
      { name: "AreaId", value: `${values?.area?.value}` },
      { name: "TerritoryId", value: `${values?.territory?.value}` },
      { name: "intChannelid", value: `${values?.channel?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "ReportType", value: `${values?.reportType?.value}` },
      // { name: "ShipPointId", value: `${values?.shipPoint?.value}` },
    ];

    const eightParams = [
      { name: "intBusinessUnitId", value: `${buId}` },
      { name: "intShippointId", value: `${values?.shipPoint?.value}` },
      { name: "intcustomerid", value: `${values?.partner?.value}` },
      { name: "intDistributionChannelId", value: `${values?.channel?.value}` },
      { name: "Regionid", value: `${values?.region?.value}` },
      { name: "AreaId", value: `${values?.area?.value}` },
      { name: "TerritoryId", value: `${values?.territory?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ];

    const nineParams = [
      { name: "intbusinessunitid", value: `${buId}` },
      { name: "intshippointid", value: `${values?.shipPoint?.value}` },
      { name: "intchannelid", value: `${values?.channel?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "intsoldtopartnerid", value: `${values?.partner?.value}` },
    ];

    const tenParams = [
      { name: "intbusinessunitid", value: `${buId}` },
      { name: "intshippointid", value: `${values?.shipPoint?.value}` },
      { name: "intDistributionChannelId", value: `${values?.channel?.value}` },
      { name: "sDate", value: `${values?.fromDate}` },
      { name: "eDate", value: `${values?.toDate}` },
      { name: "intsoldtopartnerid", value: `${values?.partner?.value}` },
      { name: "intshippointid", value: `${values?.shipPoint?.value}` },
      { name: "intItemId", value: `${values?.item?.value}` },
      { name: "intpartid", value: `${values?.reportType?.value}` },
    ];

    const twelveParams = [
      { name: "UnitId", value: `${buId}` },
      { name: "intchannelid", value: `${values?.channel?.value}` },
      { name: "fromDate", value: `${values?.fromDate}` },
      { name: "toDate", value: `${values?.toDate}` },
    ];

    return id === 1
      ? paramsForSalesDetails
      : id === 2
      ? paramsForCategoryBaseItem
      : id === 3
      ? paramsForPriceRate
      : id === 4
      ? fourthParams
      : id === 5
      ? fifthParams
      : id === 6
      ? sixthParams
      : id === 7
      ? [1, 3].includes(values?.reportType?.value)
        ? [
            ...seventhParams,
            { name: "ShipPointId", value: `${values?.shipPoint?.value}` },
          ]
        : seventhParams
      : id === 8
      ? eightParams
      : id === 9
      ? nineParams
      : id === 10
      ? tenParams
      : id === 12
      ? twelveParams
      : [];
  };

  const getLandingData = (values) => {
    getRows(
      `/wms/InventoryTransaction/GetMBAitemByItem?businessUnitId=${buId}&itemName=${values?.item?.label}`
    );
  };

  return (
    <Formik>
      <>
        {loading && <Loading />}
        <ICard title="Sales Details">
          <div>
            <div className="mx-auto">
              <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                  saveHandler(values, () => {
                    resetForm(initData);
                  });
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form">
                        <div className="col-lg-2">
                          <NewSelect
                            name="report"
                            options={reports}
                            value={values?.report}
                            label="Report Name"
                            onChange={(valueOption) => {
                              if (valueOption?.value !== 1) {
                                setFieldValue("shipPoint", "");
                                setFieldValue("channel", "");
                              }
                              setFieldValue("report", valueOption);
                              setFieldValue("reportType", "");
                              setShowReport(false);
                            }}
                            placeholder="Report Name"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        {[2, 7, 10].includes(values?.report?.value) && (
                          <div className="col-lg-2">
                            <NewSelect
                              name="reportType"
                              options={getTypes(values)}
                              value={values?.reportType}
                              label="Report Type"
                              onChange={(valueOption) => {
                                setFieldValue("reportType", valueOption);
                                setShowReport(false);
                              }}
                              placeholder="Report Type"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        )}
                        {[1, 4, 5, 6, 7, 8, 9, 10].includes(
                          values?.report?.value
                        ) &&
                          ![2, 4].includes(values?.reportType?.value) && (
                            <div className="col-lg-2">
                              <NewSelect
                                name="shipPoint"
                                options={[
                                  { value: 0, label: "All" },
                                  ...shippointDDL,
                                ]}
                                value={values?.shipPoint}
                                label="Select ShipPoint"
                                onChange={(valueOption) => {
                                  setFieldValue("shipPoint", valueOption);
                                  setShowReport(false);
                                }}
                                placeholder="Ship Point"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          )}

                        {[1, 3, 4, 5, 6, 7, 8, 9, 10, 11,12].includes(
                          values?.report?.value
                        ) && (
                          <RATForm
                            obj={{
                              values,
                              setFieldValue,
                              region: [5, 6, 7, 8].includes(
                                values?.report?.value
                              ),
                              area: [5, 6, 7, 8].includes(
                                values?.report?.value
                              ),
                              territory: [5, 6, 7, 8].includes(
                                values?.report?.value
                              ),
                              columnSize: "col-lg-2",
                              onChange: (allValues, keyName) => {
                                setShowReport(false);
                                if (keyName === "channel" && buId === 144) {
                                  getSoldToPartnerDDL(
                                    `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}&channelId=${allValues?.channel?.value}`
                                  );
                                }
                              },
                            }}
                          />
                        )}
                        {[2, 3, 8, 9, 10].includes(values?.report?.value) && (
                          <div className="col-lg-2">
                            <NewSelect
                              name="partner"
                              options={[
                                { value: 0, label: "All" },
                                ...soldToPartnerDDL,
                              ]}
                              value={values?.partner}
                              label="Sold to Partner"
                              onChange={(valueOption) => {
                                setFieldValue("partner", valueOption);
                                setShowReport(false);
                              }}
                              placeholder="Sold to Partner"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        )}
                        {[2].includes(values?.report?.value) && (
                          <>
                            <div className="col-lg-2">
                              <NewSelect
                                name="productType"
                                options={productTypes || []}
                                value={values?.productType}
                                label="Product Type"
                                onChange={(valueOption) => {
                                  setFieldValue("productType", valueOption);
                                  valueOption?.value !== 0 &&
                                    setFieldValue("itemCategory", "");
                                  setShowReport(false);
                                  getItemCategoryDDLByTypeId_api(
                                    accId,
                                    buId,
                                    valueOption?.value,
                                    setItemGroups
                                  );
                                }}
                                placeholder="Product Type"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-2">
                              <NewSelect
                                name="itemGroup"
                                options={itemGroups || []}
                                value={values?.itemGroup}
                                label="Item Group"
                                onChange={(valueOption) => {
                                  setFieldValue("itemGroup", valueOption);
                                  setFieldValue("subGroup", "");
                                  ItemSubCategory_api(
                                    accId,
                                    buId,
                                    valueOption?.value,
                                    setSubGroups
                                  );
                                  setShowReport(false);
                                }}
                                placeholder="Item Group"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-2">
                              <NewSelect
                                name="subGroup"
                                options={subGroups}
                                value={values?.subGroup}
                                label="Item Sub Group"
                                onChange={(valueOption) => {
                                  setFieldValue("subGroup", valueOption);
                                  setShowReport(false);
                                }}
                                placeholder="Item Sub Group"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </>
                        )}

                        {[3, 10, 11].includes(values?.report?.value) && (
                          <>
                            <div className="col-lg-2">
                              <NewSelect
                                name="salesOrg"
                                options={salesOrgs || []}
                                value={values?.salesOrg}
                                label="Sales Organization"
                                onChange={(valueOption) => {
                                  setFieldValue("salesOrg", valueOption);
                                  getItems(
                                    `/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${accId}&BUnitId=${buId}&DistributionChannelId=${values?.channel?.value}&SalesOrgId=${valueOption?.value}`
                                  );
                                  setShowReport(false);
                                }}
                                placeholder="Sales Organization"
                                errors={errors}
                                touched={touched}
                                isDisabled={!values?.channel}
                              />
                            </div>
                          </>
                        )}
                        {[3, 10, 11].includes(values?.report?.value) && (
                          <>
                            <div className="col-lg-2">
                              <NewSelect
                                name="item"
                                options={
                                  [{ value: 0, label: "All" }, ...items] || []
                                }
                                value={values?.item}
                                label="Item"
                                onChange={(valueOption) => {
                                  setFieldValue("item", valueOption);
                                  setShowReport(false);
                                }}
                                placeholder="Item"
                                errors={errors}
                                touched={touched}
                                isDisabled={!values?.salesOrg}
                              />
                            </div>
                          </>
                        )}
                        {![11].includes(values?.report?.value) && (
                          <FromDateToDateForm
                            obj={{
                              values,
                              setFieldValue,
                              onChange: () => {
                                setShowReport(false);
                              },
                              colSize: `col-lg-2`,
                            }}
                          />
                        )}

                        <IButton
                          // colSize={"col-lg-2"}
                          onClick={() => {
                            if (values?.report?.value === 11) {
                              getLandingData(values);
                            } else {
                              setShowReport(true);
                            }
                          }}
                        />
                      </div>
                    </Form>
                    {rows?.length > 0 && [11].includes(values?.report?.value) && (
                      <ICustomTable ths={headers}>
                        {rows?.map((item, index) => {
                          return (
                            <tr>
                              <td>{index + 1}</td>

                              <td>{item?.antecedents}</td>
                              <td>{item?.consequents}</td>
                              <td className="text-center">
                                {item?.antecedent_support}
                              </td>
                              <td className="text-center">
                                {item?.consequent_support}
                              </td>
                              <td className="text-center">{item?.support}</td>
                              <td className="text-center">
                                {item?.confidence}
                              </td>
                              <td className="text-center">{item?.lift}</td>
                              <td className="text-center">{item?.leverage}</td>
                              <td className="text-center">
                                {item?.conviction}
                              </td>
                              <td className="text-center">
                                {item?.zhangs_metric}
                              </td>
                            </tr>
                          );
                        })}
                        {/* <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                        <td colSpan={3}>Total</td>
                        <td>
                          {rows?.reduce((a, b) => (a += +b?.truckToDumpQnt), 0)}
                        </td>
                        <td> </td>
                        <td>{rows?.reduce((a, b) => (a += +b?.amount), 0)}</td>
                        <td>
                          {rows?.reduce((a, b) => (a += +b?.othersCostRate), 0)}
                        </td>
                        <td> {rows?.reduce((a, b) => (a += +b?.total), 0)} </td>

                        <td></td>
                      </tr> */}
                      </ICustomTable>
                    )}
                    {showReport && (
                      <PowerBIReport
                        reportId={reportId(values)}
                        groupId={groupId}
                        parameterValues={parameterValues(values)}
                        parameterPanel={false}
                      />
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
