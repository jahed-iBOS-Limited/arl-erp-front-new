import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { TableAction } from "../../../../_helper/columnFormatter";
import { getProfitCenterGridData } from "../_redux/Actions";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function TableRow() {
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
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
    return state.profitCenter?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getProfitCenterGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
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
      dataField: "profitCenterName",
      text: "Profit Center Name",
    },
    {
      dataField: "profitCenterCode",
      text: "Profit Center Code",
    },
    {
      dataField: "controllingUnitName",
      text: "Controlling Unit Name",
    },
    {
      dataField: "profitCenterGroupName",
      text: "Profit Center Group Name",
    },
    {
      dataField: "responsiblePersonName",
      text: "Responsible Person",
    },

    {
      dataField: "profitCenterId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: "profitCenterId",
        isView: 0,
        isEdit: true,
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
      getProfitCenterGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        pageNo,
        pageSize
      )
    );
  };
  return (
    <>
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center"
        bootstrap4
        bordered={false}
        remote
        keyField="profitCenterId"
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
