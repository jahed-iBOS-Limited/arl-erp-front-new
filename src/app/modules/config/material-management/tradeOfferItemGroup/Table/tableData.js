import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { TableAction } from "../../../../_helper/columnFormatter";
import { getTradeOfferItemGroupGridData } from "../_redux/Actions";
import Loading from "./../../../../_helper/_loading";
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

  // get grid data  from store
  const gridData = useSelector((state) => {
    return state.tradeOfferItemGroup?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getTradeOfferItemGroupGridData(
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
      getTradeOfferItemGroupGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };

  // UI Context
  const uIContext = useUIContext();
  const uIProps = useMemo(() => {
    return {
      ids: uIContext.ids,
      setIds: uIContext.setIds,
      queryParams: uIContext.queryParams,
      setQueryParams: uIContext.setQueryParams,
      openEditPage: uIContext.openEditPage,
      openViewDialog: uIContext.openViewDialog,
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "tradeOfferItemGroupName",
      text: "Trade Offer Item Group",
    },
    {
      dataField: "businessUnitName",
      text: "Business Unit",
    },
    {
      dataField: "tradeOfferItemGroupId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: "tradeOfferItemGroupId",
        isView: 0,
        isEdit: 1,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
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
        keyField="tradeOfferItemGroupId"
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
