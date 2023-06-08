import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { TableAction } from "../../../../_helper/columnFormatter";
import { getSalesTerritoryTypeGridData } from "../_redux/Actions";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
export function TableRow() {
  const dispatch = useDispatch();
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
    return state.salesTerritoryType?.gridData;
  }, shallowEqual);

  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getSalesTerritoryTypeGridData(
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

  // UI Context
  const uIContext = useUIContext();
  const uIProps = useMemo(() => {
    return {
      ids: uIContext.ids,
      setIds: uIContext.setIds,
      queryParams: uIContext.queryParams,
      setQueryParams: uIContext.setQueryParams,
      openEditPage: uIContext.openEditPage,
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "territoryTypeName",
      text: "Type Name",
    },
    {
      dataField: "levelPosition",
      text: "Level Position",
    },
    {
      dataField: "levelCode",
      text: "Level Code",
    },

    {
      dataField: "territoryTypeId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        key: "territoryTypeId",
        isView: 0,
        isEdit: true,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        with: "100px",
      },
    },
  ];
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatch(
      getSalesTerritoryTypeGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };
  return (
    <>
      {loading && <Loading />}
      <div
        style={{ lineHeight: "1rem" }}
        className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table"
      >
        <BootstrapTable
          bootstrap4
          bordered={false}
          remote
          keyField="territoryTypeId"
          data={gridData?.data || []}
          columns={columns}
        ></BootstrapTable>
      </div>
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
