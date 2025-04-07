import { Formik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { shallowEqual, useSelector } from 'react-redux';
import NewSelect from '../../../../_helper/_select';
import { TableAction } from '../../../../_helper/columnFormatter';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { useUIContext } from '../../../../_helper/uiContextHelper';
import { getBusinessUnitGridData } from '../helper';
import Loading from './../../../../_helper/_loading';
import PaginationTable from './../../../../_helper/_tablePagination';

export function TableRow() {
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [loding, setLoding] = useState(false);
  const [
    generalLedger,
    getGeneralLedger,
    loadingGeneralLegger,
    setGeneralLedger,
  ] = useAxiosGet();
  //const dispatch = useDispatch();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    getBusinessUnitGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoding,
      pageNo,
      pageSize,
      ''
    );
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (
    pageNo,
    pageSize,
    searchValue,
    generalLedgerId
  ) => {
    getBusinessUnitGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoding,
      pageNo,
      pageSize,
      searchValue,
      generalLedgerId
    );
  };

  const paginationSearchHandler = (searchValue, setFieldValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
    setFieldValue('generalLedger', { label: 'All', value: 0 });
  };

  const filterGeneralLedgerHandler = (generalLedgerId) => {
    setPositionHandler(pageNo, pageSize, '', generalLedgerId);
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
    // {
    //   dataField: "businessTransactionCode",
    //   text: "Code",
    //   style: {
    //     textAlign: "center",
    //   },
    // },
    {
      dataField: 'businessTransactionName',
      text: 'Business Transaction',
    },
    {
      dataField: 'generalLedgerName',
      text: 'General Ledger',
    },

    {
      dataField: 'businessTransactionId',
      text: 'Actions',
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: 'businessTransactionId',
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

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getGeneralLedger(
        `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&AccountGroupId=0`,
        (data) => {
          if (data?.length > 0) {
            const newData = data?.map((item) => ({
              value: item?.generalLedgerId,
              label: item?.generalLedgerName,
            }));
            setGeneralLedger(newData);
          }
        }
      );
    }
  }, [selectedBusinessUnit, profileData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          generalLedger: { label: 'All', value: 0 },
          searchValue: '',
        }}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            {loding || loadingGeneralLegger ? <Loading /> : null}
            <div className="row ml-0 mt-2 mb-2 align-items-center">
              <div style={{ width: '25%' }}>
                <div className={'input-group'}>
                  <input
                    type="text"
                    name="searchValue"
                    className="form-control"
                    value={values?.searchValue}
                    placeholder="Code Search"
                    aria-describedby="basic-addon2"
                    onChange={(e) => {
                      setFieldValue('searchValue', e.target.value);
                      if (!e?.target?.value) {
                        paginationSearchHandler(e.target.value, setFieldValue);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        setFieldValue('searchValue', e.target.value);
                        paginationSearchHandler(e.target.value, setFieldValue);
                      }
                    }}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => {
                        paginationSearchHandler(
                          values?.searchValue,
                          setFieldValue
                        );
                      }}
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="row ml-4 mr-1">
                <div>
                  <label htmlFor="">General Ledger:</label>
                </div>
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="generalLedger"
                  value={values?.generalLedger}
                  options={generalLedger || []}
                  // label="General Ledger"
                  onChange={(valueOption) => {
                    setFieldValue('generalLedger', valueOption);
                    setFieldValue('searchValue', '');
                    valueOption?.value !== 0 &&
                      filterGeneralLedgerHandler(valueOption?.value);
                  }}
                />
              </div>
            </div>

            <BootstrapTable
              wrapperClasses="table-responsive"
              classes="table table-head-custom table-vertical-center"
              bootstrap4
              bordered={false}
              remote
              keyField="controllingUnitId"
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
        )}
      </Formik>
    </>
  );
}
