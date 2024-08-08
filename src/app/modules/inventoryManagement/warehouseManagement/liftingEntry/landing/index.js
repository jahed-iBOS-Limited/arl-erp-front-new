import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";
import { monthDDL } from "../form/addEditForm";
import {
  getAllDates,
  GetEmployeeLoginInfo_api,
  getItemList,
  getLiftingEntryLists,
  getSalesOrgList,
} from "../helper";
import "./style.css";
const initData = {
  liftingPlanType: { value: 1, label: "Lifting Entry" },
  date: _todayDate(),
  salesOrg: "",
  channel: "",
  region: "",
  area: "",
  territory: "",
  item: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
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
  const [dateList, setDateList] = useState([]);
  const [filteredArea, setFilteredArea] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState({});
  const [showReport, setShowReport] = useState(false);

  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `9e9f68fe-fb6e-4c2a-b8c2-b6199d60fc8c`;

  const parameterValues = (values) => {
    const params = [
      { name: "BusinessUnitId", value: `${selectedBusinessUnit?.value}` },
      { name: "EmployeeId", value: `${profileData?.employeeId}` },
      { name: "intLevelId", value: `${employeeInfo?.empLevelId}` },
      { name: "channelid", value: `${values?.channel?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "intPartid", value: `${values?.reportType?.value}` },
      { name: "intTerritoryid", value: `${values?.territory?.value}` },
    ];

    return params || [];
  };

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridData]);

  const disableHandler = (values) => {
    const reportTypeId = values?.reportType?.value;
    return (
      !values?.reportType ||
      (reportTypeId === 1
        ? !values?.liftingPlanType || !values?.item
        : !values?.territory)
    );
  };

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
              <form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="reportType"
                      options={[
                        { value: 1, label: "Manual Entry" },
                        { value: 2, label: "Auto Entry" },
                      ]}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setShowReport(false);
                        setGridData([]);
                        setFieldValue("reportType", valueOption);
                      }}
                      placeholder="Report Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {[1].includes(values?.reportType?.value) && (
                    <>
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
                    </>
                  )}

                  <RATForm
                    obj={{
                      values,
                      setFieldValue,
                      region: [2].includes(values?.reportType?.value),
                      area: [2].includes(values?.reportType?.value),
                      territory: [2].includes(values?.reportType?.value),
                      onChange: (allValues, fieldName) => {
                        setShowReport(false);
                        setGridData([]);
                        if (fieldName === "channel") {
                          getItemList(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            allValues?.channel?.value,
                            values?.salesOrg?.value,
                            setItemList,
                            setLoading
                          );
                        }
                      },
                    }}
                  />

                  {[1].includes(values?.reportType?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="item"
                        options={
                          [{ label: "All", value: 0 }, ...itemList] || []
                        }
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
                  )}
                  {[2].includes(values?.reportType?.value) && (
                    <FromDateToDateForm
                      obj={{
                        values,
                        setFieldValue,
                        onChange: () => {
                          setShowReport(false);
                        },
                      }}
                    />
                  )}

                  <IButton
                    disabled={disableHandler(values)}
                    onClick={() => {
                      setGridData([]);
                      if (values?.reportType?.value === 1) {
                        getLandingData(values);
                        setDateList(
                          getAllDates(
                            new Date(values?.date)?.getMonth(),
                            new Date(values?.date)?.getFullYear()
                          )
                        );
                      } else if (values?.reportType?.value === 2) {
                        setShowReport(true);
                      }
                    }}
                  />
                </div>
                {!showReport && rowDto?.length > 0 && (
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
              </form>
              {showReport && [2].includes(values?.reportType?.value) && (
                <PowerBIReport
                  reportId={reportId}
                  groupId={groupId}
                  parameterValues={parameterValues(values)}
                  parameterPanel={false}
                />
              )}
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default LiftingEntry;
