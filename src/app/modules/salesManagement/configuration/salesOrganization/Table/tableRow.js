import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { TableAction } from "../../../../_helper/columnFormatter";
import { getSOGridData } from "../_redux/Actions";
import Loading from "../../../../_helper/_loading";
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

  const [loading, setLoading] = useState(false);

  // get salesOrganization grid data  from store
  const gridData = useSelector((state) => {
    return state.salesOrganization?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getSOGridData(
          profileData.accountId,
          setLoading,
          selectedBusinessUnit.value,
          pageNo,
          pageSize
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  // UI Context
  const uIContext = useUIContext();
  const uIProps = useMemo(() => {
    return {
      ids: uIContext.ids,
      setIds: uIContext.setIds,
      queryParams: uIContext.queryParams,
      setQueryParams: uIContext.setQueryParams,
      // openEditPage: uIContext.openEditPage,
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
      dataField: "soCode",
      text: "Code",
    },
    {
      dataField: "soName",
      text: "Organization Name",
    },

    {
      dataField: "soId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openExtendPage: uIProps.openExtendPage,
        key: "soId",
        isView: 0,
        isEdit: 0,
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
      getSOGridData(
        profileData.accountId,
        setLoading,
        selectedBusinessUnit.value,
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
        className="table table-striped table-bordered global-table"
      >
        <BootstrapTable
          bootstrap4
          bordered={false}
          remote
          keyField="soId"
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
