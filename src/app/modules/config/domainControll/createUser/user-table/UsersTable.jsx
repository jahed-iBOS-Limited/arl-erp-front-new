import React, { useEffect, useMemo, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import * as actions from '../_redux/createUserActions'
import { sortCaret } from '../../../../../../_metronic/_helpers'
import * as columnFormatters from './column-formatters'
import { useUserUIContext } from '../UserUIContext'
import Loading from './../../../../_helper/_loading'
import PaginationTable from './../../../../_helper/_tablePagination'
import PaginationSearch from './../../../../_helper/_search'

export function UsersTable() {
  // user UI Context
  const userUIContext = useUserUIContext()
  const userUIProps = useMemo(() => {
    return {
      ids: userUIContext.ids,
      setIds: userUIContext.setIds,
      queryParams: userUIContext.queryParams,
      setQueryParams: userUIContext.setQueryParams,
      openEditUserPage: userUIContext.openEditUserPage,
      openDeleteUserDialog: userUIContext.openDeleteUserDialog,
      openViewPage: userUIContext.openViewPage,
    }
  }, [userUIContext])

  const [loading, setLoading] = useState(false)
  //paginationState
  const [pageNo, setPageNo] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(15)
  const [search, setSearch] = useState("")
  // Getting curret state of user list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({
      currentState: state.user,
    }),
    shallowEqual
  )
  const { profileData } = useSelector(
    (state) => ({
      userForEdit: state.user.edit,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      profileData: state.authData.profileData,
    }),
    shallowEqual
  )

  const { totalCount, entities } = currentState

  // user Redux state
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      actions.UserPageData(profileData.accountId, setLoading, pageNo, pageSize)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const columns = [
    {
      dataField: 'userReferenceId',
      text: 'EMPLOYEE ID',
    },
    {
      dataField: 'userId',
      text: 'User ID',
      sort: false,
      sortCaret: sortCaret,
      classes: "text-center",
    },
    {
      dataField: 'userName',
      text: 'User Name',
      sort: false,
      sortCaret: sortCaret,
    },
    {
      dataField: 'emailAddress',
      text: 'Email Address',
    },
    {
      dataField: 'countryName',
      text: 'Country Name',
      sort: false,
      sortCaret: sortCaret,
    },
    {
      dataField: 'userTypeName',
      text: 'User Type',
      sort: false,
      sortCaret: sortCaret,
    },
    {
      dataField: 'action',
      text: 'Actions',
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openViewPage: userUIProps.openViewPage,
      },
      classes: 'text-center pr-0',
      headerClasses: 'text-right pr-3',
      style: {
        minWidth: '100px',
      },
    },
  ]
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatch(
      actions.UserPageData(profileData.accountId, setLoading, pageNo, pageSize, search)
    )
  }

  const paginationSearchHandler = (searchV) => {
    dispatch(
      actions.UserPageData(
        profileData.accountId,
        setLoading,
        pageNo,
        pageSize,
        searchV
      )
    )
  }

  return (
    <>
      {loading && <Loading />}
      {/* <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center"
                bootstrap4
                bordered={false}
                cellEdit={cellEditFactory({
                  mode: "click",
                })}
                remote
                keyField="userId"
                data={entities === null ? [] : entities}
                columns={columns}
                onTableChange={getHandlerTableChange(
                  userUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: userUIProps.ids,
                  setIds: userUIProps.setIds,
                })}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider> */}
      <PaginationSearch
        placeholder="Item Name & Code Search"
        paginationSearchHandler={paginationSearchHandler}
        setter={setSearch}
      />
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center"
        bootstrap4
        bordered={false}
        remote
        keyField="userId"
        data={entities === null ? [] : entities}
        columns={columns}
        // onTableChange={getHandlerTableChange(userUIProps.setQueryParams)}
        // selectRow={getSelectRow({
        //   entities,
        //   ids: userUIProps.ids,
        //   setIds: userUIProps.setIds,
        // })}
      ></BootstrapTable>
      {entities?.length > 0 && (
        <PaginationTable
          count={totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  )
}
