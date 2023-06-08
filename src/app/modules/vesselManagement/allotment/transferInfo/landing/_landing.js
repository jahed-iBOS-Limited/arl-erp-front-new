/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";

const initData = {
  shipPoint: "",
  transactionType: "",
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};
const headers = ["SL", "Date", "Item Name", "Warehouse", "Quantity", "Action"];

const TransferInfoLanding = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, isLoading] = useAxiosGet();

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const setLandingData = (_pageNo, _pageSize, values) => {
    getGridData(
      `/wms/FertilizerOperation/GetG2GInventoryTransferPagination?AccountId=${accId}&BusinessUnitId=${buId}&TransactionType=${values?.transactionType?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=${_pageNo}&PageSize=${_pageSize}`
    );
  };

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    setLandingData(pageNo, pageSize, values);
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
              title="Transfer Info"
              createHandler={() => {
                history.push(
                  `/vessel-management/allotment/transferInfo/create`
                );
              }}
            >
              {isLoading && <Loading />}
              <form className="form form-label-right">
                <div className="global-form row">
                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="shipPoint"
                      options={[]}
                      value={values?.shipPoint}
                      label="ShipPoint"
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                      }}
                      placeholder="ShipPoint"
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <NewSelect
                      name="transactionType"
                      options={[
                        { value: 5, label: "Transfer In" },
                        { value: 19, label: "Transfer Out" },
                      ]}
                      value={values?.transactionType}
                      label="Transaction Type"
                      onChange={(valueOption) => {
                        setFieldValue("transactionType", valueOption);
                      }}
                      placeholder="Transaction Type"
                    />
                  </div>
                  <FromDateToDateForm obj={{ values, setFieldValue }} />
                  <IButton
                    onClick={() => {
                      setLandingData(pageNo, pageSize, values);
                    }}
                    disabled={
                      !values?.transactionType ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                  />
                </div>
                {gridData?.data?.length > 0 && (
                  <table
                    id="table-to-xlsx"
                    className={
                      "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                    }
                  >
                    <thead>
                      <tr className="cursor-pointer">
                        {headers?.map((th, index) => {
                          return <th key={index}> {th} </th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td> {item?.sl}</td>
                            <td>{_dateFormatter(item?.transactionDate)}</td>
                            <td>{item?.itemName}</td>
                            <td>{item?.warehouseName}</td>
                            <td className="text-right">
                              {_fixedPoint(item?.transactionQuantity, true)}
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span className="text-center">
                                  <IView clickHandler={() => {}} />
                                </span>
                                <span className="edit" onClick={() => {}}>
                                  <IEdit title={"Rate Entry"} />
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
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
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default TransferInfoLanding;
