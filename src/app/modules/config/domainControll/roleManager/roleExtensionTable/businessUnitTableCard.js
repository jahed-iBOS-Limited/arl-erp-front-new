/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Axios from "axios";
import { useSelector } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { TableAction } from "../../../../_helper/columnFormatter";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

export function RoleExtensionTable() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);

  const dispatchProduct = async (accId, buId, pageNo, pageSize) => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `/domain/CreateRoleManager/GetActivityPermissionInformationPasignation?AccountId=${accId}&BusinessUnitId=${buId}&Status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      setLoading(false);
      setProducts(res?.data);
    } catch (error) {
      setLoading(false);
     
    }
  };

  useEffect(() => {
    dispatchProduct(profileData.accountId, selectedBusinessUnit.value, pageNo, pageSize);
  }, [selectedBusinessUnit, profileData]);

  //setPagination Handler
  const setPositionHandler =  (pageNo, pageSize, searchValue) => {
    dispatchProduct(profileData?.accountId,selectedBusinessUnit.value,pageNo, pageSize, searchValue)
  };
  const paginationSearchHandler =(searchValue)=>{
    setPositionHandler(pageNo, pageSize, searchValue)
  }

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
      dataField: "businessUnitName",
      text: "BusinessUnit Name",
    },
    {
      dataField: "userReferenceName",
      text: "User Reference",
    },

    {
      dataField: "userId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: "userId",
        isView: true,
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
      <PaginationSearch
        placeholder="Item Name & Code Search"
        paginationSearchHandler={paginationSearchHandler}
      />
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center"
        bootstrap4
        bordered={false}
        remote
        keyField="userId"
        data={products?.data || []}
        columns={columns}
      ></BootstrapTable>
      {products?.data?.length > 0 && (
        <PaginationTable
          count={products?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{
            pageNo,
            setPageNo,
            pageSize,
            setPageSize,
          }}
        />
      )}
    </>
  );
}
