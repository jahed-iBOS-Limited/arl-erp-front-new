import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import ICard from '../../../../_helper/_card';
import IConfirmModal from '../../../../_helper/_confirmModal';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import Loading from '../../../../_helper/_loading';
import PaginationTable from '../../../../_helper/_tablePagination';
import IViewModal from '../../../../_helper/_viewModal';
import StevedoreCreateForm from '../form/form';
import { deleteLighterDestination } from '../helper';

const initData = { search: '' };

const headers = ['SL', 'Lighter Destination Name', 'Action'];

const LighterDestination = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState('');
  // const [singleData, setSingleData] = useState({});

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (search, pageNo, pageSize) => {
    // const SearchTerm = search ? `SearchTerm=${search}&` : "";
    const url = `/wms/FertilizerOperation/GetLighterDestinationPagination?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}`;
    getRowData(url);
  };

  useEffect(() => {
    getData('', pageNo, pageSize);
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getData('', pageNo, pageSize);
  };

  // const paginationSearchHandler = (search) => {
  //   getData(search, pageNo, pageSize);
  // };

  const deleteHandler = (id) => {
    const objProps = {
      title: 'Are You Sure?',
      message: 'Are you sure you want to delete this Lighter Destination?',
      yesAlertFunc: () => {
        deleteLighterDestination(id, userId, setLoading, () => {
          getData('', pageNo, pageSize);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(objProps);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <ICard
            title="Lighter Destination"
            isCreteBtn={true}
            createHandler={() => {
              setFormType('create');
              setShow(true);
            }}
          >
            {(isLoading || loading) && <Loading />}
            {/* <div className="col-lg-3 mt-5">
              <PaginationSearch
                placeholder="Lighter Destination Name"
                paginationSearchHandler={paginationSearchHandler}
                values={values}
              />
            </div> */}
            <form className="form form-label-right">
              {rowData?.data?.length > 0 && (
                <div className="table-responsive">
                  <table
                    id="table-to-xlsx"
                    className={
                      'table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm'
                    }
                  >
                    <thead>
                      <tr className="cursor-pointer">
                        {headers?.map((th, index) => {
                          return <th key={index}> {th} </th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: '40px' }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.destinationName}</td>
                            <td
                              style={{ width: '80px' }}
                              className="text-center"
                            >
                              <div className="d-flex justify-content-around">
                                {/* <span>
                                <IEdit
                                  onClick={() => {
                                    setSingleData(item);
                                    setFormType("edit");
                                    setShow(true);
                                  }}
                                />
                              </span> */}
                                <span>
                                  <IDelete
                                    remover={deleteHandler}
                                    id={item?.destinationId}
                                  />
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {rowData?.data?.length > 0 && (
                <PaginationTable
                  count={rowData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              )}
            </form>
            <IViewModal
              modelSize="md"
              show={show}
              onHide={() => setShow(false)}
            >
              <StevedoreCreateForm
                setShow={setShow}
                getData={getData}
                formType={formType}
                singleData={{}}
              />
            </IViewModal>
          </ICard>
        )}
      </Formik>
    </>
  );
};

export default LighterDestination;
