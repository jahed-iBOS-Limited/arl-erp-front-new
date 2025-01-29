/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { GetSalesOrganizationDDL_api } from "../../../../salesManagement/report/shipToPartyDelivery/helper";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  SO: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  channel: "",
  region: "",
  area: "",
  employee: "",
  month: "",
  year: "",
};

const BulkKPIEntryLanding = () => {
  const history = useHistory();
  const [, getKPIList, isLoading] = useAxiosGet();
  const [soDDL, setSoDDL] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [tempRows, setTempRows] = useState([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetSalesOrganizationDDL_api(accId, buId, setSoDDL);
  }, [accId, buId]);

  const getPendingKPI = (values) => {
    getKPIList(
      `/oms/SalesInformation/GetSalesForceKPIAchivementInfo?intPartid=2&intunitid=${buId}&intSalesOrganizationId=${
        values?.SO?.value
      }&fromdate=${values?.fromDate}&todate=${values?.toDate}&intAreaid=${
        values?.area?.value
      }&intemployeeid=${0}`,
      (resData) => {
        setRowData(resData);
        setTempRows(resData);
      }
    );
  };

  const paginationSearchHandler = (v) => {
    if (!v) {
      setRowData(tempRows);
    } else {
      const value = v?.toString();
      setRowData(
        tempRows?.filter(
          (item) =>
            item?.intEmployeeId?.toString()?.substring(0, value?.length) ===
            value
        )
      );
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICard
              title={"Bulk KPI"}
              createHandler={() => {
                history.push(
                  "/performance-management/report/bulkkpientry/entry"
                );
              }}
            >
              {isLoading && <Loading />}
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="SO"
                        options={soDDL || []}
                        value={values?.SO}
                        label="Sales Organization"
                        onChange={(e) => {
                          setFieldValue("SO", e);
                        }}
                        placeholder="Sales Organization"
                        isDisabled={false}
                      />
                    </div>
                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                    <RATForm
                      obj={{ values, setFieldValue, territory: false }}
                    />

                    <IButton
                      onClick={() => {
                        getPendingKPI(values);
                      }}
                      disabled={!values?.SO || !values?.area}
                    />
                  </div>
                </div>
              </form>
              <div className="col-lg-3 mt-3">
                <PaginationSearch
                  placeholder="Search by Enroll"
                  paginationSearchHandler={paginationSearchHandler}
                />
              </div>
              {rowData?.length > 0 && (
                <table
                  id="table-to-xlsx"
                  className={
                    "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                  }
                >
                  <thead>
                    <tr className="cursor-pointer">
                      {[
                        "SL",
                        "Employee Name",
                        "Enroll",
                        "Department",
                        "Designation",
                        "BSC Perspective",
                        "KPI Master Name",
                        "KPI Master Code",
                        "Month",
                        "Target",
                        "Achievement",
                      ]?.map((th, index) => {
                        return <th key={index}> {th} </th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: "40px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>{item?.strEmployeeName}</td>
                          <td>{item?.intEmployeeId}</td>
                          <td>{item?.strDepartment}</td>
                          <td>{item?.strDesignation}</td>
                          <td>{item?.strBscPerspectiveName}</td>
                          <td>{item?.strKpiMasterName}</td>
                          <td>{item?.strKpiMasterCode}</td>
                          <td>{item?.strMonthName}</td>
                          <td className="text-right">{item?.numTarget}</td>
                          <td className="text-right">{item?.numAchivement}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default BulkKPIEntryLanding;
