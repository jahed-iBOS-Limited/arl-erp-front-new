/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Axios from "axios";
import { useSelector, shallowEqual } from "react-redux";
import { TableAction } from "../../../../_helper/columnFormatter";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

export function UserGroupTable() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const dispatchProduct = async (accId, buId, pageNo, pageSize) => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `/domain/CreateUserGroup/GetUserGroupInformationPasignation?AccountId=${accId}&businessUnitId=${buId}&Status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      setProducts(res?.data);
      setLoading(false);
    } catch (error) {
     
      setLoading(false);
    }
  };

  //setPagination Handler
  const setPositionHandler =  (pageNo, pageSize) => {
    dispatchProduct(profileData?.accountId,selectedBusinessUnit.value,pageNo, pageSize)
  };

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatchProduct(profileData.accountId, selectedBusinessUnit.value,pageNo, pageSize);
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
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
      classes: "text-center",
    },
    {
      dataField: "userGroupName",
      text: "User Group Name",
    },
    {
      dataField: "userGroupCode",
      text: "User Group Code",
    },

    {
      dataField: "userGroupId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: "userGroupId",
        isView: true,
        isEdit: true,
      },
      classes: "text-center pr-0",
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
        keyField="userGroupId"
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
