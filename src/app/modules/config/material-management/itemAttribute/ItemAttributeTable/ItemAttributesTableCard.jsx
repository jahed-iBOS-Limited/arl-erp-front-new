
import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Axios from "axios";
import { useSelector } from "react-redux";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

export function ItemAttributesTable() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);

  const dispatchProduct = async (accId, buId, pageNo, pageSize,search) => {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    try {
      const res = await Axios.get(
        `/item/ItemAttriute/GetItemAttributeByAccountIdBusinessUnitIdSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
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

  // Table Property
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "itemAttributeName",
      text: "Item Attribute Name",
    },
    {
      dataField: "itemCategoryName",
      text: "Item Category Name",
    },
    {
      dataField: "uomName",
      text: "UoM Name",
    },
  ];
  const paginationSearchHandler =(searchValue)=>{
    setPositionHandler(pageNo, pageSize, searchValue)
  }
  return (
    <>
      {loading && <Loading />}
      <PaginationSearch
        placeholder="Attribute Name & Category Name Search"
        paginationSearchHandler={paginationSearchHandler}
      />
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center"
        bootstrap4
        bordered={false}
        remote
        keyField="itemAttributeId"
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
