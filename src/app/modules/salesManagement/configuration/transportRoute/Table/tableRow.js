import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { TableAction } from "../../../../_helper/columnFormatter";
import { getTransportRouteData } from "../_redux/Actions";
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
    return state.transportRoute?.gridData;
  }, shallowEqual);

  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getTransportRouteData(
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
      openViewDialog: uIContext.openViewDialog,
      openExtendPage: uIContext.openExtendPage,
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "routeName",
      text: "Route Name",
    },
    {
      dataField: "routeAddress",
      text: "Address",
    },
    {
      dataField: "routeId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openViewDialog: uIProps.openViewDialog,
        openExtendPage: uIProps.openExtendPage,
        key: "routeId",
        isView: 1,
        isEdit: 0,
        isExtend: 1,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatch(
      getTransportRouteData(
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
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-striped global-table table-bordered"
        bootstrap4
        bordered={false}
        remote
        keyField="routeId"
        data={gridData?.data || []}
        columns={columns}
      ></BootstrapTable>
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
