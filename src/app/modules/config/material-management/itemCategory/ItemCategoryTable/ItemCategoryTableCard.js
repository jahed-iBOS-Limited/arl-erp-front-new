/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory} from "react-router-dom";

export function ItemCategoryTable() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const history = useHistory();

  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);

  const dispatchProduct = async (accId, buId, pageNo, pageSize, search) => {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    try {
      const res = await Axios.get(
        `/item/MasterCategory/GetItemMasterCategoryPasignation?${searchPath}AccountId=${accId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      setProducts(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // /item/MasterCategory/GetItemMasterCategoryPasignation?
  // AccountId=1&viewOrder=asc&PageNo=1&PageSize=100

  useEffect(() => {
    dispatchProduct(
      profileData.accountId,
      selectedBusinessUnit.value,
      pageNo,
      pageSize
    );
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    dispatchProduct(
      profileData.accountId,
      selectedBusinessUnit.value,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "itemMasterCategoryName",
      text: "Category Name",
    },
    {
      dataField: "itemMasterTypeName",
      text: "Item Type",
    },
    {
      dataField: "",
      text: "Action",
      formatter: (cellContent, row) => {
        return (
          <span className="d-flex align-items-center justify-content-center">
            <OverlayTrigger
              overlay={
                <Tooltip id="cs-icon">
                  Business Unit and General Ledger Expand
                </Tooltip>
              }
            >
              <span 
                style={{ cursor: "pointer"}}
                onClick={() => {
                  history.push({
                    pathname: `/config/material-management/item-category/itemCategoryExpend/${row.itemMasterCategoryId}`,
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
  // <i class="fa fa-arrows-alt" aria-hidden="true"></i>

  return (
    <>
      {loading && <Loading />}
      <PaginationSearch
        placeholder="Category Name & Item Type"
        paginationSearchHandler={paginationSearchHandler}
      />
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center"
        bootstrap4
        bordered={false}
        remote
        keyField="itemCategoryId"
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
