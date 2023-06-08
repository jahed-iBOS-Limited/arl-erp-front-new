/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Axios from "axios";
import { useSelector, shallowEqual } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { TableAction } from "../../../../_helper/columnFormatter";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

export function RoleExtensionTable() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const { accountId } = profileData;
  const dispatchProduct = async (accountId, pageNo, pageSize, search) => {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    try {
      const res = await Axios.get(
        `/domain/RoleExtension/GetRoleExtensionSearchInformationPagination?${searchPath}AccountId=${accountId}&Status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      if (res.status === 200 && res?.data) {
        const newData = res?.data?.data?.map((item) => ({
          ...item,
          employeeNamewithid: item?.employeeName + "  " + [`[${item?.userId}]`],
        }));

        let newDta = {
          ...res.data,
          data: newData,
        };

        setProducts(newDta);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      dispatchProduct(accountId, pageNo, pageSize);
    }
  }, [accountId]);

  //setPagination Handler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    dispatchProduct(accountId, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  // Products UI Context
  const uIContext = useUIContext();
  const uIProps = useMemo(() => {
    return {
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
      dataField: "userId",
      text: "User ID",
      classes:"text-center"
    },
    {
      dataField: "employeeNamewithid",
      text: "Employee Name",
    },
    {
      dataField: "businessUnitName",
      text: "Business Unit",
    },

    {
      dataField: "userId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: "userId",
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
      <PaginationSearch
        placeholder="Employee Name Search"
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
