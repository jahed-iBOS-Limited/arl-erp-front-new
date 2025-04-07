import React, { useEffect, useMemo, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useUIContext } from '../../../../_helper/uiContextHelper';
import { TableAction } from '../../../../_helper/columnFormatter';
import { getTransportZoneGridData } from '../_redux/Actions';
import Loading from '../../../../_helper/_loading';
import PaginationTable from './../../../../_helper/_tablePagination';
export function TableRow() {
  const dispatch = useDispatch();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.transportZone?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getTransportZoneGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          setLoading,
          pageNo,
          pageSize
        )
      );
    }
  }, [selectedBusinessUnit, profileData]);

  // UI Context
  const uIContext = useUIContext();
  const uIProps = useMemo(() => {
    return {
      ids: uIContext?.ids,
      setIds: uIContext?.setIds,
      queryParams: uIContext?.queryParams,
      setQueryParams: uIContext?.setQueryParams,
      openEditPage: uIContext?.openEditPage,
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    {
      dataField: 'sl',
      text: 'SL',
    },
    {
      dataField: 'transportZoneName',
      text: 'Zone Name',
    },
    {
      dataField: 'districtName',
      text: 'District Name',
    },
    {
      dataField: 'transportZoneId',
      text: 'Actions',
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        key: 'transportZoneId',
        isView: 0,
        isEdit: true,
      },
      classes: 'text-right pr-0',
      headerClasses: 'text-right pr-3',
      style: {
        minWidth: '100px',
      },
    },
  ];
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatch(
      getTransportZoneGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };
  return (
    <>
      {loading && <Loading />}
      <div
        style={{ lineHeight: '1rem' }}
        className="table table-responsive table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table"
      >
        <BootstrapTable
          wrapperClasses="table-responsive"
          classes="table global-table"
          bootstrap4
          bordered={false}
          remote
          keyField="transportZoneId"
          data={gridData?.data || []}
          columns={columns}
        ></BootstrapTable>
      </div>
      {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  );
}
