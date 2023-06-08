import React, { useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getPriceSetupGridData } from "../_redux/Actions";
import IDate from "../../../../_helper/_date";
import { useState } from "react";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function TableRow() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.priceSetup?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getPriceSetupGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          setLoading,
          pageNo,
          pageSize
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatch(
      getPriceSetupGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "conditionTypeName",
      text: "Condition type",
    },
    {
      dataField: "itemName",
      text: "Item Name",
    },
    {
      dataField: "price",
      text: "Price",
    },

    {
      dataField: "startDate",
      text: "Start Date",
      formatter: IDate,
      formatExtraData: {
        key: "startDate",
      },
    },
    {
      dataField: "endDate",
      text: "End Date",
      formatter: IDate,
      formatExtraData: {
        key: "endDate",
      },
    },
  ];

  return (
    <>
      {loading && <Loading />}
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center"
        bootstrap4
        bordered={false}
        remote
        keyField="controllingUnitId"
        data={gridData?.data || []}
        columns={columns}
      ></BootstrapTable>

      {/* Pagination Code */}
      {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  );
}
