import axios from "axios";
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { generateJsonToExcel } from "../../../../_helper/excel/jsonToExcel";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICard from "../../../../_helper/_card";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  CreateSupplierBaseDeliveryExcel,
  CreateSupplierBaseDeliveryTransferExcel,
} from "../excel/excel";
import {
  getCustomerDeliveryStatementForShiptoPartner,
  getCustomerNameDDL,
  getCustomerTopSheet,
  getDistributionChannelDDL,
  GetDistributorCoverage_api,
  GetLabourBill_api,
  GetSalesOrganizationDDL_api,
  getShipToParty,
  getSupplierBaseDeliveryCustomerChallan,
  getSupplierBaseDeliveryTransferChallan,
} from "../helper";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import TableGird from "./gird";
import TableGirdFive from "./girdFive";
import TableGirdFour from "./girdFour";
import TableGirdThree from "./girdThree";
import TableGirdTwo from "./girdTwo";
import TableGirdEight from "./gridEight";
import TableGirdSeven from "./gridSeven";
import TableGirdSix from "./gridSix";

const initData = {
  fromDate: _firstDateofMonth(),
  // fromTime: _todaysStartTime(),
  fromTime: "00:00",
  toDate: _todayDate(),
  // toTime: _todaysEndTime(),
  toTime: "00:00",
  shippointDDL: "",
  customerNameDDL: "",
  salesOrg: "",
  distributionChannel: "",
  supplierName: "",
  reportType: {
    value: 1,
    label: "Top Sheet",
  },
};

export default function ShipToPartyDelivery() {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [salesOrgDDl, setSalesOrgDDl] = useState([]);
  const [customerNameDDL, setCustomerNameDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shipToPartyDDL, setShipToPartyDDL] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [reportTypeDDL] = useState([
    { value: 1, label: "Top Sheet" },
    { value: 2, label: "Detail" },
    { value: 3, label: "Distributor Coverage Report" },
    { value: 4, label: "Retailer Sales For All Distributor" },
    { value: 5, label: "Retailer Sales For Single Distributor" },
    { value: 6, label: "Retailer No Sales For Single Distributor" },
    { value: 7, label: "Labour Bill Details " },
    { value: 8, label: "Labour Bill Category basic" },
    { value: 9, label: "Vehicle Catg  & Day Basis" },
    { value: 10, label: "Only Day Basis" },
    { value: 11, label: "Supplier Base Delivery (Customer Challan - Details)" },
    { value: 12, label: "Supplier Base Delivery (Transfer Challan)" },
    {
      value: 13,
      label: "Supplier Base Delivery (Customer Challan - Top Sheet)",
    },
  ]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const shippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetSalesOrganizationDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSalesOrgDDl
      );
      getDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);
  const generateExcel = (values, row) => {
    let header = [
      {
        text: "SL",
        textFormat: "number",
        alignment: "center:middle",
        key: "sl",
      },
      {
        text: "Ship To Party",
        textFormat: "text",
        alignment: "center:middle",
        key: "shipToPartnerName",
      },
      {
        text: "Ship To Party Id",
        textFormat: "text",
        alignment: "center:middle",
        key: "shipToPartnerId",
      },
      {
        text: "Sold To Party",
        textFormat: "text",
        alignment: "center:middle",
        key: "customerName",
      },
      {
        text: "Region",
        textFormat: "text",
        alignment: "center:middle",
        key: "region",
      },
      {
        text: "Area",
        textFormat: "text",
        alignment: "center:middle",
        key: "area",
      },
      {
        text: "Territory",
        textFormat: "text",
        alignment: "center:middle",
        key: "territory",
      },
      {
        text: "Ship Point",
        textFormat: "text",
        alignment: "center:middle",
        key: "shipPointName",
      },
      {
        text: "UoM",
        textFormat: "text",
        alignment: "center:middle",
        key: "uomName",
      },
      {
        text: "Quantity",
        textFormat: "number",
        alignment: "center:middle",
        key: "deliveryQty",
      },
      {
        text: "Rate",
        textFormat: "money",
        alignment: "center:middle",
        key: "itemRate",
      },
      {
        text: "Amount",
        textFormat: "money",
        alignment: "center:middle",
        key: "deliveryValue",
      },
    ];
    if (values?.reportType?.value === 2) {
      header.push(
        {
          text: "Delivery Date",
          textFormat: "date",
          alignment: "center:middle",
          key: "deliveryDate",
        },
        {
          text: "Product Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "itemName",
        }
      );
    }
    const _data = row[0]?.objList?.map((item, index) => {
      return {
        ...item,
        sl: index + 1,
        customerName: row[0]?.customerName,
      };
    });
    if ([1, 2].includes(values?.reportType?.value)) {
      generateJsonToExcel(header, _data, values?.reportType?.label);
    }
    if ([3, 4, 5, 6].includes(values?.reportType?.value)) {
      header = [
        {
          text: "SL",
          textFormat: "number",
          alignment: "center:middle",
          key: "sl",
        },
        {
          text: "Partner Code",
          textFormat: "text",
          alignment: "center:middle",
          key: "strBusinessPartnerCode",
        },
        {
          text: "Partner Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strBusinessPartnerName",
        },
        {
          text: "Partner Address",
          textFormat: "text",
          alignment: "center:middle",
          key: "strBusinessPartnerAddress",
        },
        {
          text: "Ship To Partner Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strshiptopartnername",
        },
        {
          text: "Region",
          textFormat: "text",
          alignment: "center:middle",
          key: "nl5",
        },
        {
          text: "Area",
          textFormat: "text",
          alignment: "center:middle",
          key: "nl6",
        },
        {
          text: "Territory",
          textFormat: "text",
          alignment: "center:middle",
          key: "nl7",
        },
        {
          text: "Coverage Percentage",
          textFormat: "money",
          alignment: "center:middle",
          key: "coveragepercentage",
        },
        {
          text: "Total Shop",
          textFormat: "money",
          alignment: "center:middle",
          key: "totalSHop",
        },
        {
          text: "Sold Ship to Partner",
          textFormat: "money",
          alignment: "center:middle",
          key: "soldshiptopartner",
        },
        {
          text: "Sales Quantity",
          textFormat: "money",
          alignment: "center:middle",
          key: "numSalesQuantity",
        },
        {
          text: "Sales Amount",
          textFormat: "money",
          alignment: "center:middle",
          key: "Salesamount",
        },
      ];
      const _data = row?.map((item, index) => {
        return {
          ...item,
          sl: index + 1,
        };
      });
      generateJsonToExcel(header, _data, values?.reportType?.label);
    }
    if ([7].includes(values?.reportType?.value)) {
      header = [
        {
          text: "SL",
          textFormat: "number",
          alignment: "center:middle",
          key: "sl",
        },
        {
          text: "Delivery Code",
          textFormat: "text",
          alignment: "center:middle",
          key: "strDeliveryCode",
        },
        {
          text: "Shipment Code",
          textFormat: "text",
          alignment: "center:middle",
          key: "strShipmentCode",
        },
        {
          text: "Labor Supplier Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strLaborSupplierName",
        },
        {
          text: "ShipPoint Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strShipPointName",
        },
        {
          text: "Vehicle Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strVehicleName",
        },
        {
          text: "SoldToPartner Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strSoldToPartnerName",
        },
        {
          text: "ShipToPartner Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strShipToPartnerName",
        },
        {
          text: "Quantity",
          textFormat: "money",
          alignment: "center:middle",
          key: "numQuantity",
        },
        {
          text: "Labour Cost",
          textFormat: "money",
          alignment: "center:middle",
          key: "numLabourCost",
        },
        {
          text: "Labour Rate",
          textFormat: "money",
          alignment: "center:middle",
          key: "numLabourRate",
        },
      ];
      const _data = row?.map((item, index) => {
        return {
          ...item,
          sl: index + 1,
        };
      });
      generateJsonToExcel(header, _data, values?.reportType?.label);
    }

    if ([8].includes(values?.reportType?.value)) {
      header = [
        {
          text: "SL",
          textFormat: "number",
          alignment: "center:middle",
          key: "sl",
        },
        {
          text: "Vehicle Capacity Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strVehicleCapacityName",
        },

        {
          text: "Vehicle No",
          textFormat: "text",
          alignment: "center:middle",
          key: "strVehicleNo",
        },
        {
          text: "Driver Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strDriverName",
        },
        {
          text: "Driver Contact",
          textFormat: "text",
          alignment: "center:middle",
          key: "strDriverContact",
        },
        {
          text: "Seven Ton Labour Cost",
          textFormat: "money",
          alignment: "center:middle",
          key: "SeventonLabourCost",
        },
        {
          text: "Seven Ton Quantity",
          textFormat: "money",
          alignment: "center:middle",
          key: "SeventonnumQuantity",
        },
        {
          text: "Five Ton Labour Cost",
          textFormat: "money",
          alignment: "center:middle",
          key: "FivetonLabourCost",
        },
        {
          text: "Five Ton Quantity",
          textFormat: "money",
          alignment: "center:middle",
          key: "FivetonQuantity",
        },
        {
          text: "Three Ton Labour Cost",
          textFormat: "money",
          alignment: "center:middle",
          key: "ThreetonLabourCost",
        },
        {
          text: "Three Ton Quantity",
          textFormat: "money",
          alignment: "center:middle",
          key: "ThreetonQuantity",
        },
        {
          text: "OneHalf Labour Cost",
          textFormat: "money",
          alignment: "center:middle",
          key: "OneHalfLabourCost",
        },
        {
          text: "OneHalf Quantity",
          textFormat: "money",
          alignment: "center:middle",
          key: "OneHalfQuantity",
        },
        {
          text: "Fourteen Ton Labour Cost",
          textFormat: "money",
          alignment: "center:middle",
          key: "FourteenTonLabourCost",
        },
        {
          text: "Fourteen Ton Quantity",
          textFormat: "money",
          alignment: "center:middle",
          key: "FourteenTonQuantity",
        },
        {
          text: "Twenty Ton Labour Cost",
          textFormat: "money",
          alignment: "center:middle",
          key: "TwentyTonLabourCost",
        },
        {
          text: "Twenty Ton Quantity",
          textFormat: "money",
          alignment: "center:middle",
          key: "TwentyTonQuantity",
        },
      ];
      const _data = row?.map((item, index) => {
        return {
          ...item,
          sl: index + 1,
        };
      });
      generateJsonToExcel(header, _data, values?.reportType?.label);
    }
    if ([9, 10].includes(values?.reportType?.value)) {
      header = [
        {
          text: "SL",
          textFormat: "number",
          alignment: "center:middle",
          key: "sl",
        },
        {
          text: "Date",
          textFormat: "text",
          alignment: "center:middle",
          key: "dteServerDateTime",
        },

        {
          text: "Vehicle Capacity Name",
          textFormat: "text",
          alignment: "center:middle",
          key: "strVehicleCapacityName",
        },
        {
          text: "Labour Cost",
          textFormat: "money",
          alignment: "center:middle",
          key: "numLabourCost",
        },
        {
          text: "Quantity",
          textFormat: "money",
          alignment: "center:middle",
          key: "numQuantity",
        },
      ];
      const _data = row?.map((item, index) => {
        return {
          ...item,
          sl: index + 1,
          dteServerDateTime: _dateFormatter(item?.dteServerDateTime),
        };
      });
      generateJsonToExcel(header, _data, values?.reportType?.label);
    }
    if ([11].includes(values?.reportType?.value)) {
      CreateSupplierBaseDeliveryExcel(
        values,
        rowDto,
        selectedBusinessUnit,
        "Supplier Base Delivery (Customer Challan)",
        "Supplier Base Delivery (Customer Challan)"
      );
    }
    if ([12].includes(values?.reportType?.value)) {
      CreateSupplierBaseDeliveryTransferExcel(
        values,
        rowDto,
        selectedBusinessUnit,
        "Supplier Base Delivery (Transfer Challan)",
        "Supplier Base Delivery (Transfer Challan)"
      );
    }
  };

  const gridDataFunc = (values) => {
    setRowDto([]);
    const fromDateTime = moment(
      `${values?.fromDate} ${values?.fromTime}`
    ).format("YYYY-MM-DDTHH:mm:ss");
    const toDateTime = moment(`${values?.toDate} ${values?.toTime}`).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    const reportType = [1, 2].includes(values?.reportType?.value);
    const reportTypeTwo = [3, 4, 5, 6].includes(values?.reportType?.value);
    const reportTypeThree = [7, 8, 9, 10].includes(values?.reportType?.value);
    if (reportType) {
      getCustomerDeliveryStatementForShiptoPartner(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        fromDateTime,
        toDateTime,
        values?.customerNameDDL?.value,
        values?.shipToParty?.value,
        values?.shippointDDL?.value,
        values?.salesOrg?.value,
        setLoading,
        setRowDto
      );
    } else if (reportTypeTwo) {
      GetDistributorCoverage_api(
        values?.reportType?.value,
        selectedBusinessUnit?.value,
        fromDateTime,
        toDateTime,
        values?.distributionChannel?.value,
        values?.customerNameDDL?.value,
        values?.shipToParty?.value,
        setLoading,
        setRowDto
      );
    } else if (reportTypeThree) {
      GetLabourBill_api(
        values?.reportType?.value,
        selectedBusinessUnit?.value,
        fromDateTime,
        toDateTime,
        values?.shippointDDL?.value,
        setLoading,
        setRowDto
      );
    } else if (values?.reportType?.value === 11) {
      getSupplierBaseDeliveryCustomerChallan(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.supplierName?.value || 0,
        values?.shippointDDL?.value,
        values?.salesOrg?.value,
        setRowDto,
        setLoading
      );
    } else if (values?.reportType?.value === 13) {
      getCustomerTopSheet(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.supplierName?.value || 0,
        values?.shippointDDL?.value,
        values?.salesOrg?.value,
        setRowDto,
        setLoading
      );
    } else {
      getSupplierBaseDeliveryTransferChallan(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.supplierName?.value || 0,
        values?.shippointDDL?.value,
        values?.salesOrg?.value,
        setRowDto,
        setLoading
      );
    }
  };

  const excelRef = useRef();

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Ship to Party Delivery"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <Formik enableReinitialize={true} initialValues={initData}>
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-4">
                          <NewSelect
                            name="reportType"
                            options={reportTypeDDL || []}
                            value={values?.reportType}
                            label="Report Type"
                            onChange={(valueOption) => {
                              setFieldValue("reportType", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Report Type"
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                          />
                        </div>
                        <div className="col-lg-4">
                          <div>
                            {/* ${ ![11, 12, 13].includes(values?.reportType?.value)? "and Time"  : "" } */}
                            <label>{`From Date `}</label>
                            <div className="d-flex">
                              <div style={{ flex: 1 }}>
                                <InputField
                                  value={values?.fromDate}
                                  type="date"
                                  name="fromDate"
                                  onChange={(e) => {
                                    setFieldValue("fromDate", e?.target?.value);
                                    setRowDto([]);
                                  }}
                                />
                              </div>

                              {/* {![11, 12, 13].includes(
                                values?.reportType?.value
                              ) && (
                                <div style={{ flex: 1 }}>
                                  <InputField
                                    value={values?.fromTime}
                                    type="time"
                                    name="fromTime"
                                  />
                                </div>
                              )} */}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div>
                            {/* ${![11, 12, 13].includes(values?.reportType?.value) ? "and Time": ""} */}
                            <label>{`To Date`}</label>
                            <div className="d-flex">
                              <div style={{ flex: 1 }}>
                                <InputField
                                  value={values?.toDate}
                                  type="date"
                                  name="toDate"
                                  onChange={(e) => {
                                    setFieldValue("toDate", e?.target?.value);
                                    setRowDto([]);
                                  }}
                                />
                              </div>
                              {/* {![11, 12, 13].includes(
                                values?.reportType?.value
                              ) && (
                                <div style={{ flex: 1 }}>
                                  <InputField
                                    value={values?.toTime}
                                    type="time"
                                    name="toTime"
                                  />
                                </div>
                              )} */}
                            </div>
                          </div>
                        </div>

                        {[1, 2, 3, 4, 5, 6, 11, 12, 13].includes(
                          values?.reportType?.value
                        ) && (
                          <>
                            <div className="col-lg-4">
                              <NewSelect
                                name="salesOrg"
                                options={salesOrgDDl || []}
                                value={values?.salesOrg}
                                label="Sales Org"
                                onChange={(valueOption) => {
                                  setFieldValue("salesOrg", valueOption);
                                  setFieldValue("customerNameDDL", "");
                                  setRowDto([]);
                                  setCustomerNameDDL([]);
                                  getCustomerNameDDL(
                                    profileData?.accountId,
                                    selectedBusinessUnit?.value,
                                    valueOption?.value,
                                    setCustomerNameDDL
                                  );
                                }}
                                isDisabled={!values?.reportType}
                                placeholder="Sales Org"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            {[3, 4, 5, 6].includes(
                              values?.reportType?.value
                            ) && (
                              <div className="col-lg-4">
                                <NewSelect
                                  name="distributionChannel"
                                  options={distributionChannelDDL || []}
                                  value={values?.distributionChannel}
                                  label="Distribution Channel"
                                  onChange={(valueOption) => {
                                    setFieldValue(
                                      "distributionChannel",
                                      valueOption
                                    );
                                    setRowDto([]);
                                  }}
                                  placeholder="Distribution Channel"
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            )}
                            {![11, 12, 13].includes(
                              values?.reportType?.value
                            ) ? (
                              <div className="col-lg-4">
                                <NewSelect
                                  name="customerNameDDL"
                                  options={customerNameDDL || []}
                                  value={values?.customerNameDDL}
                                  label="Customer Name"
                                  onChange={(valueOption) => {
                                    setFieldValue(
                                      "customerNameDDL",
                                      valueOption
                                    );
                                    setFieldValue("shipToParty", "");
                                    setShipToPartyDDL([]);
                                    getShipToParty(
                                      profileData?.accountId,
                                      selectedBusinessUnit?.value,
                                      valueOption?.value,
                                      setShipToPartyDDL
                                    );
                                    setRowDto([]);
                                  }}
                                  placeholder="Customer name"
                                  errors={errors}
                                  touched={touched}
                                  isDisabled={
                                    !values?.reportType || !values?.salesOrg
                                  }
                                />
                              </div>
                            ) : (
                              <div className="col-lg-4">
                                <label>Supplier Name</label>
                                <SearchAsyncSelect
                                  selectedValue={values.supplierName}
                                  handleChange={(valueOption) => {
                                    // setGridData([]);
                                    setFieldValue("supplierName", valueOption);
                                  }}
                                  loadOptions={(v) => {
                                    if (v.length < 3) return [];
                                    return axios
                                      .get(
                                        `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${
                                          profileData?.accountId
                                        }&UnitId=${
                                          selectedBusinessUnit?.value
                                        }&SBUId=${0}`
                                      )
                                      .then((res) => {
                                        const updateList = res?.data.map(
                                          (item) => ({
                                            ...item,
                                          })
                                        );
                                        return updateList;
                                      });
                                  }}
                                />
                                <FormikError
                                  errors={errors}
                                  name="supplierName"
                                  touched={touched}
                                />
                              </div>
                            )}
                            {![11, 12, 13].includes(
                              values?.reportType?.value
                            ) && (
                              <div className="col-lg-4">
                                <NewSelect
                                  name="shipToParty"
                                  options={shipToPartyDDL || []}
                                  value={values?.shipToParty}
                                  label="Ship To Party"
                                  onChange={(valueOption) => {
                                    setFieldValue("shipToParty", valueOption);
                                  }}
                                  placeholder="Ship To Party"
                                  errors={errors}
                                  touched={touched}
                                  isDisabled={!values?.reportType}
                                />
                              </div>
                            )}
                          </>
                        )}

                        {[1, 2, 7, 8, 9, 10, 11, 12, 13].includes(
                          values?.reportType?.value
                        ) && (
                          <div className="col-lg-4">
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
                              placeholder="ShipPoint"
                              errors={errors}
                              touched={touched}
                              isDisabled={!values?.reportType}
                            />
                          </div>
                        )}

                        <div className="mt-5">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              gridDataFunc(values);
                            }}
                            disabled={
                              [7, 8, 9, 10, 11, 12, 13].includes(
                                values?.reportType?.value
                              )
                                ? !values?.reportType || !values?.shippointDDL
                                : // ||
                                  //   !values?.supplierName
                                  !values?.salesOrg ||
                                  !values?.customerNameDDL ||
                                  !values?.shipToParty ||
                                  !values?.reportType ||
                                  ([1, 2].includes(values?.reportType?.value)
                                    ? !values?.shippointDDL
                                    : !values?.distributionChannel)
                            }
                          >
                            View
                          </button>
                        </div>
                        <div className="mt-5 ml-1">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              if (values.reportType.value === 13) {
                                excelRef.current.handleDownload();
                              } else {
                                generateExcel(values, rowDto);
                              }
                            }}
                            disabled={rowDto?.length < 1}
                          >
                            Export Excel
                          </button>
                        </div>
                      </div>
                    </form>
                    {loading && <Loading />}
                    {rowDto?.length > 0 && (
                      <div className="my-5">
                        <div className="text-center my-2">
                          <h3>
                            <b> {selectedBusinessUnit?.label} </b>
                          </h3>
                          <h5>
                            <b> {selectedBusinessUnit?.address} </b>
                          </h5>
                          <h3>
                            <b>{values?.reportType?.label}</b>
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
                        {[1, 2].includes(values?.reportType?.value) ? (
                          <TableGird rowDto={rowDto} values={values} />
                        ) : [3, 4, 5, 6].includes(values?.reportType?.value) ? (
                          <TableGirdTwo rowDto={rowDto} values={values} />
                        ) : [7].includes(values?.reportType?.value) ? (
                          <TableGirdThree rowDto={rowDto} values={values} />
                        ) : [8].includes(values?.reportType?.value) ? (
                          <TableGirdFour rowDto={rowDto} values={values} />
                        ) : [11].includes(values?.reportType?.value) ? (
                          <TableGirdSix rowDto={rowDto} values={values} />
                        ) : [12].includes(values?.reportType?.value) ? (
                          <TableGirdSeven rowDto={rowDto} values={values} />
                        ) : [13].includes(values?.reportType?.value) ? (
                          <TableGirdEight
                            rowDto={rowDto}
                            excelRef={excelRef}
                            values={values}
                          />
                        ) : (
                          <TableGirdFive rowDto={rowDto} values={values} />
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
