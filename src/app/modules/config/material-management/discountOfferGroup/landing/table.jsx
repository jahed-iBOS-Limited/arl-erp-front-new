/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { useHistory } from "react-router-dom";
import PaginationSearch from "../../../../_helper/_search";

const initData = {};
const headers = [
  "SL",
  "Discount Group Name",
  "Item Name",
  "Previous Group Name",
];

const DiscountOfferGroupLandingTable = () => {
  const history = useHistory();
  const [gridData, setGridData] = useState([]);
  const [, getGridData, loading] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const setLandingData = (values, _pageNo = 0, _pageSize = 15, searchTerm) => {
    const search = searchTerm ? `&searchTerm=${searchTerm}` : "";
    getGridData(
      `/oms/TradeOffer/GetItemAndOfferGroupPagination?businessUnitId=${buId}&pageNo=${_pageNo}&pageSize=${_pageSize}${search}`,
      (resData) => {
        setGridData(resData?.data);
      }
    );
  };

  useEffect(() => {
    setLandingData(initData, pageNo, pageSize, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const setPositionHandler = (pageNo, pageSize) => {
    setLandingData(initData, pageNo, pageSize, "");
  };

  const paginationSearchHandler = (searchTerm) => {
    setLandingData(initData, pageNo, pageSize, searchTerm);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {() => (
          <>
            <ICustomCard
              title="Discount Offer Group And Item"
              createHandler={() => {
                history.push(
                  `/config/material-management/discountoffergroupanditem/create`
                );
              }}
            >
              {loading && <Loading />}
              <div className="col-lg-3 mt-5">
                <PaginationSearch
                  placeholder="Discount Group Name"
                  paginationSearchHandler={paginationSearchHandler}
                />
              </div>
              <form className="form form-label-right">
                {/* <div className="global-form row"></div> */}
                {gridData?.data?.length > 0 && (
                 <div className="table-responsive">
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
                            <td> {index + 1}</td>
                            <td> {item?.discountGroupName}</td>
                            <td> {item?.itemName}</td>
                            <td> {item?.previousGroupName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                 </div>
                )}
              </form>
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
                />
              )}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default DiscountOfferGroupLandingTable;
