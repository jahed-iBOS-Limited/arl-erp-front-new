/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Axios from "axios";
import { useSelector, shallowEqual } from "react-redux";
import { TableAction } from "../../../../_helper/columnFormatter";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function WarehouseTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const dispatchProduct = async (accId, pageNo, pageSize) => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `/wms/Warehouse/GetWarehouseInfoPagination?accountId=${accId}&status=true&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
      );
      if (res.status === 200) {
        setLoading(false);
        setProducts(res?.data);
      }
    } catch (error) {
     
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileData) {
      dispatchProduct(profileData.accountId, pageNo, pageSize);
    }
  }, [profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatchProduct(profileData.accountId, pageNo, pageSize);
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
      dataField: "warehouseName",
      text: "Warehouse",
    },
    {
      dataField: "warehouseCode",
      text: "Code",
      style: {
        textAlign: "center",
      },
    },
    {
      dataField: "warehouseAddress",
      text: "Address",
    },

    {
      dataField: "warehouseId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: "warehouseId",
        isView: false,
        isEdit: true,
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
        keyField="warehouseId"
        data={products?.data || []}
        columns={columns}
      ></BootstrapTable>
      {/* Pagination Code */}
      {products?.data?.length > 0 && (
        <PaginationTable
          count={products?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  );
}
