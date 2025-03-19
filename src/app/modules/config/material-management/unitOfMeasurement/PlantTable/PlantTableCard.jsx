/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Axios from "axios";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

export function PlantTable() {
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

  const dispatchProduct = async (accId, buId, pageNo, pageSize,search) => {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    try {
      const res = await Axios.get(
        `/item/ItemUOM/GetItemUOMByAccountIdBusinessUnitIdSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      setProducts(res?.data);
      setLoading(false);
    } catch (error) {
     
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatchProduct(
        profileData.accountId,
        selectedBusinessUnit.value,
        pageNo,
        pageSize
      );
    }
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

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "uomName",
      text: "Unit Of Measurement",
    },
    {
      dataField: "uomCode",
      text: "Unit Of Measurement Code",
    },
  ];

  const paginationSearchHandler =(searchValue)=>{
    setPositionHandler(pageNo, pageSize, searchValue)
  }

  return (
    <>
      {loading && <Loading />}
      <PaginationSearch
        placeholder=" Name & Code Search"
        paginationSearchHandler={paginationSearchHandler}
      />
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center"
        bootstrap4
        bordered={false}
        remote
        keyField="uomid"
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
