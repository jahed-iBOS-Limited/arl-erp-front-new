/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { TableAction } from "../../../../_helper/columnFormatter";
import { getPurchaseOrgData } from "../_redux/Actions";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function TableRow() {
  const dispatch = useDispatch();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [loading, setLoading] = useState(false);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const gridData = useSelector((state) => {
    return state.purchaseOrg?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getPurchaseOrgData(
          profileData.accountId,
          selectedBusinessUnit.value,
          setLoading,
          pageNo,
          pageSize
        )
      );
    }
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
      dataField: "purchaseOrganization",
      text: "Organization Name",
    },
    {
      dataField: "purchaseOrganizationid",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        openExtendPage: uIProps.openExtendPage,
        key: "purchaseOrganizationid",
        isView: 0,
        isExtend: 1,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        width: "100px",
      },
    },
  ];

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatch(
      getPurchaseOrgData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };

  return (
    <div className="global-table">
      {!loading && (
        <BootstrapTable
          wrapperClasses="table-responsive"
          classes="table table-head-custom table-vertical-center"
          bootstrap4
          bordered={false}
          remote
          keyField="purchaseOrganizationid"
          data={gridData?.data || []}
          columns={columns}
        ></BootstrapTable>
      )}
      {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </div>
  );
}
