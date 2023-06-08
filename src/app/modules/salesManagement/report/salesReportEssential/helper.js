import Axios from "axios";
import { toast } from "react-toastify";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../_helper/_currentTime";
import { _todayDate } from "../../../_helper/_todayDate";

export const GetCustomerNameDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data.map((itm) => {
        return {
          value: itm?.organizationUnitReffId,
          label: itm?.organizationUnitReffName,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};

export const getCustomerNameDDL = async (accId, buId, orgId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerNameBySalesOrgDDL?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrganization=${orgId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetSalesOrganizationDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSalesReport = async (
  accId,
  buId,
  fromDate,
  fromTime,
  toDate,
  toTime,
  typeId,
  shipmentId,
  customerId,
  orgId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetSalesReportInDateRangeModified?AccountId=${accId}&BusinessunitId=${buId}&SalesOrganizationId=${orgId}&FromDate=${fromDate}&ToDate=${toDate}&ReportTypeId=${typeId}&ShippointId=${shipmentId}&CustomerId=${customerId}&FromTime=${fromTime}&ToTime=${toTime}&PageNo=1&PageSize=123&viewOrder=desc`
    );
    setter(res?.data?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getCategoryBaseInfo = async ({
  buId,
  channelId,
  shipPointId,
  regionId,
  areaId,
  territoryId,
  partnerId,
  setter,
  setLoading,
  type,
  empId,
  ratId,
  levelId,
  partId,
}) => {
  setLoading && setLoading(true);

  const challanUrl = `/oms/SalesInformation/GetCategoryBaseChallan?intChannelId=${channelId}&intUnitid=${buId}&intshippingPointid=${shipPointId}&intRegionId=${regionId}&intAreaId=${areaId}&intTerritoryId=${territoryId}&intBusinessPartnerId=${partnerId}&intEmployeeid=${empId}&RATId=${ratId}&intLevelId=${levelId}&intpartid=${partId ||
    0}`;

  const salesOrderUrl = `/oms/SalesInformation/CategoryBaseSalesOrder?intChannelId=${channelId}&intUnitid=${buId}&intshippingPointid=${shipPointId}&intRegionId=${regionId}&intAreaId=${areaId}&intTerritoryId=${territoryId}&intBusinessPartnerId=${partnerId}&intEmployeeid=${empId}&RATId=${ratId}&intLevelId=${levelId}&intpartid=${partId ||
    0}`;

  const url = type === 4 ? challanUrl : type === 5 ? salesOrderUrl : "";
  try {
    const res = await Axios.get(url);
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getUserLoginInfo = async (accId, buId, empId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/hcm/RemoteAttendance/GetEmployeeLoginInfo?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`
    );
    setLoading && setLoading(false);
    cb(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getSalesmanWiseMtd = async (buId, values, setter, setLoading) => {
  const { reportType, fromDate, toDate, certainDate } = values;
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/SalesInformation/GetOperationalSalesManpowerBaseMTD?intPartId=${reportType?.value}&fromdate=${fromDate}&todate=${toDate}&intunitid=${buId}&certaindate=${certainDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const initData = {
  fromDate: _todayDate(),
  fromTime: _todaysStartTime(),
  toDate: _todayDate(),
  certainDate: _todayDate(),
  toTime: _todaysEndTime(),
  reportType: "",
  shippoint: "",
  customerName: "",
  salesOrg: "",
  channel: "",
  region: "",
  area: "",
  territory: "",
  soldToPartner: "",
  viewType: "",
  productType: "",
  itemGrade: "",
  itemSize: "",
};

export const getHeaders = (type) => {
  if (type === 4) {
    return [
      "SL",
      "Partner Name",
      "Partner Code",
      // "Challan Date",
      "Product Type",
      "MM08",
      "MM10",
      "MM12",
      "MM16",
      "MM20",
      "MM22",
      "MM25",
      // "Avg Amount",
      // "Challan Amount",
    ];
  }
  if (type === 5) {
    return [
      "SL",
      "Partner Name",
      "Partner Code",
      "SO Code",
      "SO Date",
      "Product Type",
      "MM08",
      "MM10",
      "MM12",
      "MM16",
      "MM20",
      "MM22",
      "MM25",
      // "Avg Price",
      "Total SO Amount",
    ];
  }
};

export const reportTypeList = [
  { value: 4, label: "SKU VS Delivery (pdd)" },
  // { value: 4, label: "Delivery Program" },
  { value: 5, label: "SO Statement" },
  { value: 2, label: "Shippoint" },
  { value: 3, label: "Customer Name" },
  { value: 6, label: "Customer Ledger" },
  { value: 7, label: "Employee Target Sheet" },
  { value: 8, label: "Delivery and UnDelivery Report" },
  { value: 9, label: "Customer Target Sheet" },
  { value: 10, label: "Delivery Program (BI)" },
  { value: 11, label: "SO Statement (BI)" },
  // { value: 10, label: "Category Based Challan" },
  // { value: 11, label: "Category Based Sales" },
  { value: 12, label: "Aging Report" },
  { value: 13, label: "Customer Based MTD Sales" },
  { value: 14, label: "Salesman Wise MTD" },
  { value: 15, label: "Collection Plan vs Collection" },
  { value: 16, label: "Sales Order vs Stock Status" },
  { value: 17, label: "Salesforce KPI" },
  { value: 18, label: "Date Wise Delivery Report" },
  { value: 19, label: "Collection Schedule Report" },
  { value: 20, label: "Sku Base Detail Report" },
  { value: 21, label: "Delivery Summary Report" },
];

export const viewTypeList = [
  { value: 1, label: "Sku Base Details" },
  { value: 2, label: "Channel Base Details" },
  { value: 3, label: "Item Type Base Details" },
];

export const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
export const getReportID = (typeId) => {
  return typeId === 6 //customer ledger
    ? "af6886a9-2afd-4f19-bfe7-6ad37612b620"
    : typeId === 7 // Employee Target Sheet
    ? "b022fb7e-684d-442d-b502-ebfb060f3d56"
    : typeId === 8 // Delivery and Undelivery Report
    ? "8e87de93-2fea-4882-9981-c8b0d1965265"
    : typeId === 9 // Customer Target Sheet
    ? "619ca755-9ec8-4a8d-b462-890274b2d79d"
    : typeId === 10 //Delivery Program (Bl)
    ? "fd212457-2482-45df-8c0b-c0cb59e0daae"
    : typeId === 11 //SO Statement (Bl)
    ? "ff54cfbb-1dc2-4d20-a816-3a9f183fd8ba"
    : typeId === 12 // Aging Report
    ? "9693bdbb-2ff7-4157-a046-147d0cd08cb3"
    : typeId === 13 // Customer Based MTD Sales
    ? "ddaeb9b8-e43d-425e-84d5-47c2da96e733"
    : typeId === 15 // Collection Plan vs Collection
    ? "5a93aed9-9db5-4807-9d89-d58efea03d28"
    : typeId === 16 // Sales Oder vs Stock Status
    ? "e12f4835-2b70-494c-a354-b1d6a02d6edb"
    : typeId === 17 // Salesforce KPI
    ? "d70d26a4-a2f0-41e7-910f-9d3ce2377fc9"
    : typeId === 18 // Date Wise Delivery Report
    ? "e7847bc2-8267-431d-a3cb-75c681bd981e"
    : typeId === 19 // Collection Schedule Report
    ? "9901cdff-efd3-47d7-8fe0-7650ebdcc04a"
    : typeId === 20 // Sku Base Detail Report
    ? "5d30c54b-25de-4fef-b7d3-479aa66f4e73"
    : typeId === 21 // Delivery Summary Report
    ? "819784e7-ac86-4173-8b56-67c68cab9ec3"
    : "";
};

export const parameterValues = (values, buId) => {
  const typeId = values?.reportType?.value;
  if (typeId === 20) {
    return [
      { name: "ReportType", value: `${values?.viewType?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "intSoldToPartnerId", value: `${values?.soldToPartner?.value}` },
    ];
  } else if (typeId === 21) {
    return [
      { name: "Bunit", value: `${buId}` },
      { name: "Customer", value: `${values?.customerName?.value}` },
      { name: "ChannelName", value: `${values?.channel?.value}` },
      {
        name: "SalesOrganization",
        value: `${values?.salesOrg?.value}`,
      },
      { name: "ProductType", value: `${values?.productType?.value}` },
      { name: "ItemGrade", value: `${values?.itemGrade?.value}` },
      { name: "ItemSize", value: `${values?.itemSize?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ];
  } else {
    return [];
  }
};

export const hasParamsPanel = (values) => {
  return [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].includes(
    values?.reportType?.value
  );
};

export const PBIReport = (values) => {
  return [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].includes(
    values?.reportType?.value
  );
};

export const itemSizes = [
  { value: "8 MM", label: "8 MM" },
  { value: "10 MM", label: "10 MM" },
  { value: "12 MM", label: "12 MM" },
  { value: "16 MM", label: "16 MM" },
  { value: "20 MM", label: "20 MM" },
  { value: "22 MM", label: "22 MM" },
  { value: "25 MM", label: "25 MM" },
  { value: "28 MM", label: "28 MM" },
  { value: "32 MM", label: "32 MM" },
  { value: "40 MM", label: "40 MM" },
  { value: "Wastage Item", label: "Wastage Item" },
];
