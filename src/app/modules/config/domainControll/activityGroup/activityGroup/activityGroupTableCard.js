/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Axios from "axios";
import { useSelector, shallowEqual } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { TableAction } from "../../../../_helper/columnFormatter";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

// useUIContext
export function ActivityGroupTable() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

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
        `/domain/CreateActivityGroup/GetActivityGroupInformationPasignation?AccountId=${accId}&businessUnitId=${buId}&Status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      setProducts(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
     
    }
  };

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatchProduct(profileData.accountId, selectedBusinessUnit.value, pageNo, pageSize);
    }
  }, [selectedBusinessUnit, profileData]);

  //setPagination Handler
  const setPositionHandler =  (pageNo, pageSize) => {
    dispatchProduct(profileData?.accountId,selectedBusinessUnit.value,pageNo, pageSize)
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
      classes: "text-center",
    },
    {
      dataField: "activityGroupName",
      text: "Activity Group Name",
    },
    {
      dataField: "activityGroupCode",
      text: "Activity Group Code",
    },
    {
      dataField: "moduleName",
      text: "Module Name",
    },

    {
      dataField: "activityGroupId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: "activityGroupId",
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
        keyField="activityGroupId"
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
