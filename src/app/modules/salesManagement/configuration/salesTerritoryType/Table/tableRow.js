import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { shallowEqual, useSelector } from 'react-redux';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import { TableAction } from '../../../../_helper/columnFormatter';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { useUIContext } from '../../../../_helper/uiContextHelper';
import PaginationTable from './../../../../_helper/_tablePagination';
const initData = {
  ddlType: '',
};
export function TableRow() {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // const [loading, setLoading] = useState(false);
  const [gridData, getGridData, gridDataLoading] = useAxiosGet();
  const [
    firstLevelEntryData,
    getFirstLevelEntryData,
    firstLevelEntryDataLoading,
  ] = useAxiosGet();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // UI Context
  const uIContext = useUIContext();
  const uIProps = useMemo(() => {
    return {
      ids: uIContext.ids,
      setIds: uIContext.setIds,
      queryParams: uIContext.queryParams,
      setQueryParams: uIContext.setQueryParams,
      openEditPage: uIContext.openEditPage,
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    {
      dataField: 'sl',
      text: 'SL',
    },
    {
      dataField: 'territoryTypeName',
      text: 'Type Name',
    },
    {
      dataField: 'levelPosition',
      text: 'Level Position',
    },
    {
      dataField: 'levelCode',
      text: 'Level Code',
    },

    {
      dataField: 'territoryTypeId',
      text: 'Actions',
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        key: 'territoryTypeId',
        isView: 0,
        isEdit: true,
      },
      classes: 'text-right pr-0',
      headerClasses: 'text-right pr-3',
      style: {
        with: '100px',
      },
    },
  ];
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getGridData(
      `/oms/TerritoryTypeInfo/GetTerritoryTypeLandingPagination?AccountId=${profileData.accountId}&BUnitId=${selectedBusinessUnit.value}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`,
    );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
    >
      {({ setFieldValue, values }) => (
        <>
          {(gridDataLoading || firstLevelEntryDataLoading) && <Loading />}
          <Form className="form form-label-right">
            <div className="form-group row global-form">
              <div className="col-lg-3">
                <NewSelect
                  name="ddlType"
                  options={[
                    { value: 1, label: 'Seals Territory Type' },
                    { value: 2, label: 'Setup First Level Entry' },
                  ]}
                  label="Type DDL"
                  onChange={(valueOption) => {
                    setFieldValue('ddlType', valueOption);
                    if (valueOption?.value === 1) {
                      getGridData(
                        `/oms/TerritoryTypeInfo/GetTerritoryTypeLandingPagination?AccountId=${profileData.accountId}&BUnitId=${selectedBusinessUnit.value}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`,
                      );
                    }
                    if (valueOption?.value === 2) {
                      getFirstLevelEntryData(
                        // levelId 1 will be hardcoded ensure by Monirul Islam vai
                        `/oms/CustomerProfile/GetTeritory?businessUnitId=${selectedBusinessUnit.value}&levelId=1`,
                      );
                    }
                  }}
                />
              </div>
            </div>
            {[1]?.includes(values.ddlType?.value) && (
              <>
                <div
                  style={{ lineHeight: '1rem' }}
                  className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table"
                >
                  <BootstrapTable
                    bootstrap4
                    bordered={false}
                    remote
                    keyField="territoryTypeId"
                    data={gridData?.data || []}
                    columns={columns}
                  ></BootstrapTable>
                </div>
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                )}
              </>
            )}
            {[2]?.includes(values?.ddlType?.value) && (
              <>
                <div className="react-bootstrap-table table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Label Name</th>
                        <th>Insert By</th>
                        <th>Insert Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-center">1</td>
                        <td className="text-center">
                          {firstLevelEntryData?.level1}
                        </td>
                        <td className="text-center">
                          {firstLevelEntryData?.insertBy}
                        </td>
                        <td className="text-center">
                          {_dateFormatter(
                            firstLevelEntryData?.lastActionDateTime,
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Form>
        </>
      )}
    </Formik>
  );
}
