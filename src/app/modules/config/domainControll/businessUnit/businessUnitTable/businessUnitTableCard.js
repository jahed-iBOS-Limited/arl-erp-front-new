/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import Axios from "axios";
import { isObject } from "lodash";
import { TableAction } from "../../../../_helper/columnFormatter";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

export function BusinessUnitTable() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const dispatchBusinessUnit = async (accountId, pageNo, pageSize) => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `/domain/BusinessUnitDomain/GetBusinessunitDomainInfobyAccountId?AccountId=${accountId}&status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
     
      setLoading(false);
    }
  };

  //setPagination Handler
  const setPositionHandler =  (pageNo, pageSize) => {
    dispatchBusinessUnit(profileData?.accountId, pageNo, pageSize);
  };

  useEffect(() => {
    if (isObject(profileData) && Object.keys(profileData).length) {
      const { accountId } = profileData;
      dispatchBusinessUnit(accountId,pageNo, pageSize);
    }
  }, [profileData]);

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
      text: "Business Unit",
    },
    {
      dataField: "businessUnitCode",
      text: "Code",
    },
    {
      dataField: "businessUnitAddress",
      text: "Address",
    },
    {
      dataField: "businessUnitLanguage",
      text: "Language",
    },
    {
      dataField: "businessUnitBaseCurrency",
      text: "Base Cur.",
    },

    {
      dataField: "businessUnitId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: "businessUnitId",
        isView: true,
        isEdit: false,
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
        keyField="businessUnitId"
        data={ products?.data|| [] }
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
