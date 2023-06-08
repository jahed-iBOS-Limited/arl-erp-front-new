/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import ICustomTable from "../../../../_helper/_customTable";

export function PlantWarehouseTable() {
  const [products, setProducts] = useState(null);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const [loading, setLoading] = useState(false);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const dispatchProduct = async (accId, buId, pageNo, pageSize) => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `/wms/ConfigPlantWearHouse/GetConfigPlantWHLandingDataListPaging?accountId=${accId}&businessUnitId=${buId}&status=true&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
      );
      if (res.status === 200) {
        setLoading(false);
        setProducts(res?.data);
      }
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
  const setPositionHandler = (pageNo, pageSize) => {
    dispatchProduct(
      profileData.accountId,
      selectedBusinessUnit.value,
      pageNo,
      pageSize
    );
  };

  // Table columns
  const columns = ["SL", "Plant", "Warehouse", "Business Unit"];
  return (
    <>
      {loading && <Loading />}

      <ICustomTable ths={columns}>
        {products?.data?.map((td, index) => {
          return (
            <tr>
              <td> {index + 1} </td>
              <td> {td?.plantName} </td>
              <td> {td?.warehouseName} </td>
              <td> {td?.businessUnitName} </td>
            </tr>
          );
        })}
      </ICustomTable>
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
