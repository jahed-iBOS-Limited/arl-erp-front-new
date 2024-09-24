/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function ItemSubCategoryTable() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const history = useHistory();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const dispatchProduct = async (accId, pageNo, pageSize,search) => {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    try {
      const res = await axios.get(
        `/item/MasterCategory/GetItemMasterSubCategoryPasignation?${searchPath}AccountId=${accId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      setProducts(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
     
    }
  };

  ///item/MasterCategory/GetItemMasterSubCategoryPasignation?
  //AccountId=1&viewOrder=asc&PageNo=1&PageSize=100&searchTerm=asc

  useEffect(() => {
      dispatchProduct(
        profileData.accountId,
        pageNo,
        pageSize
      );
  }, [profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    dispatchProduct(
      profileData.accountId,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler =(searchValue)=>{
    setPositionHandler(pageNo, pageSize, searchValue)
  }

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "itemMasterSubCategoryName",
      text: "Item Sub-Category",
    },
    {
      dataField: "itemMasterTypeName",
      text: "Item Type",
    },
    {
      dataField: "itemMasterCategoryName",
      text: "Item Category",
    },
    {
      dataField: "",
      text: "Action",
      formatter: (cellContent, row) => {
        return (
          <span
            className="d-flex align-items-center justify-content-center"           
          >
            <OverlayTrigger
              overlay={
                <Tooltip id="cs-icon">
                  Business Unit Expand
                </Tooltip>
              }
            >
              <span
                style={{ cursor: "pointer"}}
                onClick={() => {
                  history.push({
                    pathname: `/config/material-management/item-category/itemSubCategoryExpend/${row.itemMasterSubCategoryId}`,
                    state: { ...row },
                  });
                }}
              >
                <i
                  className={`fa fa-arrows-alt`}
                  onClick={() => {}}
                ></i>
              </span>
            </OverlayTrigger>
          </span>
        );
      },
    },
  ];

  return (
    <>
      {loading && <Loading />}
      <PaginationSearch
        placeholder="Name & Type Search"
        paginationSearchHandler={paginationSearchHandler}
      />
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center"
        bootstrap4
        bordered={false}
        remote
        keyField="id"
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
