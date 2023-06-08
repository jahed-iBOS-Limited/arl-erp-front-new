/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
export function ItemCategoryTable() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  });
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  });

  const dispatchProduct = async (accId, buId, pageNo, pageSize) => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `/item/PriceComponent/GetPriceInfoLandingPasignation?AccountId=${accId}&BusniessUnitId=${buId}&viewOrder=desc&Status=true&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      console.log(res?.data)
      const updatedData = res?.data?.data.map(item => {
        let numFactor;

        if(item?.numFactor === 1){
          numFactor = "positive"
        }
        if(item?.numFactor === -1){
          numFactor = "negative"
        }
        return {
          ...item,
          numFactor
        }
      })
      setProducts({...res?.data,data:updatedData});
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileData && selectedBusinessUnit && selectedBusinessUnit.value) {
      dispatchProduct(
        profileData.accountId,
        selectedBusinessUnit.value,
        pageNo,
        pageSize
      );
    }
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatchProduct(
      profileData.accountId,
      selectedBusinessUnit.value,
      pageNo,
      pageSize
    );
  };

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "priceComponentCode",
      text: "Code",
    },
    {
      dataField: "priceComponentName",
      text: "Component",
    },
    {
      dataField: "priceComponentTypeName",
      text: "Type",
    },
    {
      dataField: "numFactor",
      text: "Factor",
    },
    {
      dataField: "roundingTypeName",
      text: "rounding Type",
    },
    {
      dataField: "generalLedgerName",
      text: "General Ledger",
    },
    {
      dataField: "priceStructureTypeName",
      text: "Price Structure",
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
        keyField="priceComponentId"
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
