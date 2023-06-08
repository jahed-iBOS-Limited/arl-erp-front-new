/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getDistributionChannelDDL_api } from "../../../../salesManagement/report/customerSalesTargetReport/helper";
import ICustomCard from "../../../../_helper/_customCard";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { monthDDL } from "../form/addEditForm";
import {
  getAllDates,
  getAreaList,
  GetEmployeeLoginInfo_api,
  getItemList,
  getLiftingEntryList,
  getLiftingEntryLists,
  getRegionList,
  getSalesOrgList,
} from "../helper";
import "./style.css";
const initData = {
  liftingPlanType: { value: 1, label: "Lifting Entry" },
  date: _todayDate(),
  salesOrg: "",
  channel: "",
  item: "",
  area: "",
  region: "",
};

function LiftingEntry({ title, viewType }) {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const history = useHistory();
  const [gridData, setGridData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salesOrgs, setSalesOrgs] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [area, setArea] = useState([]);
  const [filteredArea, setFilteredArea] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState({});

  useEffect(() => {
    getDistributionChannelDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setChannelList
    );
    getSalesOrgList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSalesOrgs,
      setLoading
    );
    GetEmployeeLoginInfo_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setEmployeeInfo
    );
  }, [profileData, selectedBusinessUnit]);

  const getLandingData = (values) => {
    // getLiftingEntryList(
    //   values?.date,
    //   selectedBusinessUnit?.value,
    //   values?.channel?.value,
    //   values?.area?.value,
    //   values?.item?.value,
    //   values?.liftingPlanType?.value,
    //   setGridData,
    //   setLoading
    // );
    // const ratId =
    //     resData?.empLevelId === 7
    //       ? +resData?.empTerritoryId
    //       : +resData?.levelId === 6
    //       ? +resData?.areaId
    //       : +resData?.levelId === 5
    //       ? +resData?.regionId
    //       : +resData?.empTerritoryId;

    const ratId =
      employeeInfo?.empLevelId === 7
        ? +employeeInfo?.empTerritoryId || 0
        : +employeeInfo?.levelId === 6
        ? +employeeInfo?.areaId || 0
        : +employeeInfo?.levelId === 5
        ? +employeeInfo?.regionId || 0
        : +employeeInfo?.empTerritoryId || 0;

    getLiftingEntryLists(
      values?.date,
      selectedBusinessUnit?.value,
      values?.channel?.value,
      employeeInfo?.empLevelId,
      ratId,
      values?.item?.value,
      values?.liftingPlanType?.value,
      setGridData,
      setLoading
    );
    setFilteredArea([]);
  };

  useEffect(() => {
    gridData.forEach((itm, i) => {
      if (filteredArea?.filter((item) => itm?.stnl6 === item).length) {
        gridData[i].rowSpan = 0;
      } else {
        filteredArea.push(itm?.stnl6);
        console.log(filteredArea);
        gridData[i].rowSpan = gridData?.filter(
          (item) => itm?.stnl6 === item?.stnl6
        ).length;
      }
    });
    setRowDto([...gridData]);
  }, [gridData]);

  useEffect(() => {
    console.log("area", area);
  }, [area]);

  return (
    <>
      {loading && <Loading />}
      <ICustomCard
        title={title ? title : "Lifting Entry"}
        createHandler={
          viewType
            ? false
            : () =>
                history.push(
                  `/inventory-management/warehouse-management/liftingplanentry/entry`
                )
        }
        renderProps={() => (
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button btn btn-primary ml-2"
            table="table-to-xlsx"
            filename="liftingplanreport"
            sheet="Lifting Plan Report"
            buttonText="Export Excel"
          />
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{ ...initData, salesOrg: salesOrgs[0] }}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>Date</label>
                    <InputField
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setGridData([]);
                        setFieldValue("date", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="liftingPlanType"
                      options={[
                        { value: 1, label: "Lifting Entry" },
                        { value: 2, label: "Bag Production" },
                      ]}
                      value={values?.liftingPlanType}
                      label="Lifting Plan Type"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("liftingPlanType", valueOption);
                      }}
                      placeholder="Lifting Plan Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="salesOrg"
                      options={salesOrgs || []}
                      value={values?.salesOrg}
                      label="Sales Organization"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("salesOrg", valueOption);
                      }}
                      placeholder="Sales Organization"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="channel"
                      options={channelList || []}
                      value={values?.channel}
                      label="Distribution Channel"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("channel", valueOption);
                        getItemList(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          values?.salesOrg?.value,
                          setItemList,
                          setLoading
                        );
                        getRegionList(
                          valueOption?.value,
                          setRegionList,
                          setLoading
                        );
                      }}
                      placeholder="Distribution Channel"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.salesOrg}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="item"
                      options={[{ label: "All", value: 0 }, ...itemList] || []}
                      value={values?.item}
                      label="Item"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("item", valueOption);
                      }}
                      placeholder="Item"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.channel || !values?.salesOrg}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="region"
                      options={
                        [{ value: 0, label: "All" }, ...regionList] || []
                      }
                      value={values?.region}
                      label="Region"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("region", valueOption);
                        getAreaList(
                          values?.channel?.value,
                          valueOption?.value,
                          setAreaList,
                          setLoading
                        );
                        if (valueOption?.label === "All") {
                          setFieldValue("area", { value: 0, label: "All" });
                        } else {
                          setFieldValue("area", "");
                        }
                      }}
                      placeholder="Region"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.channel || !values?.salesOrg}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="area"
                      options={[{ value: 0, label: "All" }, ...areaList] || []}
                      value={values?.area}
                      label="Area"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("area", valueOption);
                      }}
                      placeholder="Area"
                      errors={errors}
                      touched={touched}
                      isDisabled={
                        !values?.channel ||
                        !values?.salesOrg ||
                        !values?.region ||
                        values?.region?.label === "All"
                      }
                    />
                  </div> */}
                  <div className="col-lg-3 d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-primary mt-4 mr-4"
                      disabled={!values?.liftingPlanType || !values?.item}
                      onClick={() => {
                        setGridData([]);
                        getLandingData(values);
                        setDateList(
                          getAllDates(
                            new Date(values?.date)?.getMonth(),
                            new Date(values?.date)?.getFullYear()
                          )
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                {rowDto?.length > 0 && (
                  <div className="sales-details-scrollable-table">
                    <div className="scroll-table _table">
                      <table
                        className="table bj-table bj-table-landing"
                        id="table-to-xlsx"
                      >
                        <thead>
                          <tr>
                            <th
                              rowSpan={3}
                              className="sl"
                              style={{ width: "50px" }}
                            >
                              SL
                            </th>
                            <th rowSpan={3}>Area</th>
                            <th rowSpan={3}>Item Name</th>
                            <th rowSpan={3}>
                              Target For{" "}
                              {
                                monthDDL[new Date(values?.date).getMonth()]
                                  ?.label
                              }
                              , {new Date(values?.date).getFullYear()}
                            </th>
                            <th rowSpan={3}>Target ADS</th>
                            {dateList?.map((item) => {
                              return (
                                <th colSpan={1}>{moment(item).format("ll")}</th>
                              );
                            })}
                            <th colSpan={1} rowSpan={2}>
                              Grand Total
                            </th>
                          </tr>
                          <tr>
                            {dateList?.map((item) => {
                              return (
                                <th style={{}} colSpan={1} rowSpan={2}>
                                  {moment(item).format("dddd")}
                                </th>
                              );
                            })}
                            {/* <th colSpan={1}></th> */}
                          </tr>
                          {/* <tr>
                            {dateList?.map((item,index) => {
                              return (
                                <>
                                  <th>OPC</th>
                                  <th>PCC</th>
                                  <th>d{index+1}</th>
                                </>
                              );
                            })}
                            <th>OPC</th>
                            <th>PCC</th>  
                            <th>Total</th>
                          </tr> */}
                        </thead>
                        <tbody>
                          {rowDto?.map((td, index) => {
                            let totalPCC = 0;
                            let totalOPC = 0;
                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                {td?.rowSpan ? (
                                  <td rowSpan={td?.rowSpan}>
                                    <div className="pl-1">{td?.stnl6}</div>
                                  </td>
                                ) : (
                                  ""
                                )}
                                <td>
                                  <div className="pl-1">{td?.strItemname}</div>
                                </td>
                                <td className="text-right">
                                  <div className="pl-1">
                                    {_fixedPoint(td?.numTargetQuantity, true)}
                                  </div>
                                </td>
                                <td className="text-right">
                                  <div className="pl-1">
                                    {_fixedPoint(td?.TADS)}
                                  </div>
                                </td>
                                {dateList?.map((_, index) => {
                                  // totalOPC += td[`d${index + 1}opc`]
                                  //   ? td[`d${index + 1}opc`]
                                  //   : 0;
                                  // totalPCC += td[`d${index + 1}pcc`]
                                  //   ? td[`d${index + 1}pcc`]
                                  //   : 0;
                                  return (
                                    <>
                                      {/* <td className="text-right">
                                        {`${
                                          td[`d${index + 1}opc`]
                                            ? td[`d${index + 1}opc`]
                                            : ""
                                        }`}
                                      </td>
                                      <td className="text-right">{`${
                                        td[`d${index + 1}pcc`]
                                          ? td[`d${index + 1}pcc`]
                                          : ""
                                      }`}</td> */}
                                      <td className="text-right">{`${td[
                                        `d${index + 1}`
                                      ] || 0}`}</td>
                                    </>
                                  );
                                })}
                                <td>{td?.numTargetQuantity}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default LiftingEntry;
