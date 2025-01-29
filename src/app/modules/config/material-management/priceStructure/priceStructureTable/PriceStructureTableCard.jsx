/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { useUIContext } from '../../../../_helper/uiContextHelper';
import { TableAction } from '../../../../_helper/columnFormatter';
import Loading from './../../../../_helper/_loading';
import PaginationTable from './../../../../_helper/_tablePagination';

export function PriceStructureTableCard() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit,
  );

  const profileData = useSelector((state) => state.authData.profileData);

  const dispatchProduct = async (accId, buId, pageNo, pageSize) => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `/item/PriceStructure/GetPriceStructureLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&Status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`,
      );
      setProducts(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatchProduct(
        profileData.accountId,
        selectedBusinessUnit.value,
        pageNo,
        pageSize,
      );
    }
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatchProduct(
      profileData.accountId,
      selectedBusinessUnit.value,
      pageNo,
      pageSize,
    );
  };

  // UI Context
  const uIContext = useUIContext();
  const uIProps = useMemo(() => {
    return {
      ids: uIContext?.ids,
      setIds: uIContext?.setIds,
      queryParams: uIContext?.queryParams,
      setQueryParams: uIContext?.setQueryParams,
      openEditPage: uIContext?.openEditPage,
      openViewDialog: uIContext?.openViewDialog,
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    {
      dataField: 'sl',
      text: 'SL',
    },
    {
      dataField: 'strPriceStructureName',
      text: 'Structure Name',
    },
    {
      dataField: 'actionBy',
      text: 'Insert By',
    },
    {
      dataField: 'priceStructureId',
      text: 'Actions',
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: 'priceStructureId',
        isView: true,
        isEdit: false,
      },
      classes: 'text-right pr-0',
      headerClasses: 'text-right pr-3',
      style: {
        minWidth: '100px',
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
