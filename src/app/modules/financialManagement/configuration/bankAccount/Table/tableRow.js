import React, { useEffect, useMemo } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { useUIContext } from '../../../../_helper/uiContextHelper'
import { TableAction } from '../../../../_helper/columnFormatter'
import { getBankAccountGridData } from '../_redux/Actions'
import PaginationTable from './../../../../_helper/_tablePagination'
import Loading from './../../../../_helper/_loading'

export function TableRow() {
  //paginationState
  const [pageNo, setPageNo] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(15)
  const [loading, setLoading] = React.useState(false)
  const dispatch = useDispatch()
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );
  const bankAccount = userRole[7];

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.bankAccount?.gridData
  }, shallowEqual)

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getBankAccountGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          setLoading,
          pageNo,
          pageSize
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData])

  // UI Context
  const uIContext = useUIContext()
  const uIProps = useMemo(() => {
    return {
      ids: uIContext.ids,
      setIds: uIContext.setIds,
      queryParams: uIContext.queryParams,
      setQueryParams: uIContext.setQueryParams,
      openEditPage: uIContext.openEditPage,
      openViewDialog: uIContext.openViewDialog,
    }
  }, [uIContext])

  // Table columns
  const columns = [
    {
      dataField: 'sl',
      text: 'SL',
    },
    {
      dataField: 'bankName',
      text: 'Bank Name',
    },
    {
      dataField: 'bankBranchName',
      text: 'Branch',
    },
    {
      dataField: 'bankACTypeName',
      text: 'Account Type',
    },
    {
      dataField: 'generalLedgerName',
      text: 'General Ledger',
    },
    {
      dataField: 'bankACId',
      text: 'Actions',
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: 'bankACId',
        isView: bankAccount?.isView,
        isEdit: true,
      },
      classes: 'text-right pr-0',
      headerClasses: 'text-right pr-3',
      style: {
        minWidth: '100px',
      },
    },
  ]

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatch(
      getBankAccountGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize
      )
    )
  }

  return (
    <>
      {loading && <Loading />}
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center"
        bootstrap4
        bordered={false}
        remote
        keyField="bankACId"
        data={gridData?.data || []}
        columns={columns}
      ></BootstrapTable>
      {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  )
}
