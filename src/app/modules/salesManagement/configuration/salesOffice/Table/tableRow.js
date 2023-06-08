import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { TableAction } from "../../../../_helper/columnFormatter";
import { getSalesOfficeGridData } from "../_redux/Actions";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

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

  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get salesOffice list  from store
  const gridData = useSelector((state) => {
    return state.salesOffice?.gridData;
  }, shallowEqual);
  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getSalesOfficeGridData(
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
      dataField: "salesOfficeName",
      text: "Sales Office Name",
    },
    {
      dataField: "salesOrganizationName",
      text: "Sales Organization",
    },
    {
      dataField: "salesOfficeId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        key: "salesOfficeId",
        isEdit: 1,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        width: "100px",
      },
    },
  ];
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    dispatch(
      getSalesOfficeGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize,
        searchValue
      )
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="mt-2">
        <PaginationSearch
          placeholder="Sales Office Name Search"
          paginationSearchHandler={paginationSearchHandler}
        />
      </div>
      <div
        style={{ lineHeight: "1rem" }}
        className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table"
      >
        <BootstrapTable
          bootstrap4
          bordered={false}
          remote
          keyField="controllingUnitId"
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
