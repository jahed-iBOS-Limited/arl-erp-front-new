/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import { shallowEqual, useSelector } from "react-redux";
import IView from "../../../../_helper/_helperIcons/_view";
import PaginationTable from "../../../../_helper/_tablePagination";

const initData = {
  port: "",
  motherVessel: "",
  year: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const ServiceChargeAndIncomeElementLanding = () => {
  const history = useHistory();
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // get user profile data from store
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, _pageNo, _pageSize) => {
    const url = `/costmgmt/CostElement/GetServiceChargeAndIncomeElementLanding?businessUnitId=${buId}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&PageNo=${_pageNo}&PageSize=${_pageSize}
`;

    getRowData(url, (resData) => {});
  };

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
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
            <ICustomCard
              title={"Service Charge and Income Element"}
              createHandler={() => {
                history.push(
                  "/vessel-management/configuration/ServiceChargeAndIncomeElement/config"
                );
              }}
            >
              {isLoading && <Loading />}

              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <FromDateToDateForm
                      obj={{
                        values,
                        setFieldValue,
                      }}
                    />
                    {/* <PortAndMotherVessel obj={{ values, setFieldValue }} />
                    <YearMonthForm
                      obj={{ values, setFieldValue, month: false }}
                    /> */}
                    <IButton
                      onClick={() => {
                        getData(values, pageNo, pageSize);
                      }}
                    />
                  </div>
                </div>
              </form>
              <div className="react-bootstrap-table table-responsive">
                <table
                  className={"table table-striped table-bordered global-table "}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          minWidth: "30px",
                        }}
                        rowSpan={2}
                      >
                        SL
                      </th>
                      <th>Warehouse</th>
                      <th>Item</th>
                      <th
                        style={{
                          minWidth: "70px",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.data?.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td className="text-center">{i + 1}</td>
                          <td className="text-center">{item?.warehouseName}</td>
                          <td className="text-center">{item?.itemName}</td>
                          <td className="text-right">
                            <IView />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {rowData?.data?.length > 0 && (
                <PaginationTable
                  count={rowData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              )}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default ServiceChargeAndIncomeElementLanding;
