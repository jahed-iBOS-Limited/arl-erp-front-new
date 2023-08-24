import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import IForm from './../../../_helper/_form';
import Loading from './../../../_helper/_loading';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { shallowEqual, useSelector } from 'react-redux';
import IView from '../../../_helper/_helperIcons/_view';
import PaginationTable from '../../../_helper/_tablePagination';
import IViewModal from '../../../_helper/_viewModal';
import DetailsDistributionView from './detailsView';
import IEdit from '../../../_helper/_helperIcons/_edit';

const initData = {};

export default function DistributionPlanLanding() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [isShowModel, setIsShowModel] = useState(false);
  const [detailsView, setDetailsView] = useState([]);
  const [rowDto, getRowDto, rowDtoLoading] = useAxiosGet();

  // get user data from store
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {};

  const setPositionHandler = (pageNo, pageSize) => {
    getRowDto(
      `/oms/DistributionChannel/GetDistributionPlanningLanding?buisnessUnitId=${buId}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };

  // get landing data on mount
  useEffect(() => {
    getRowDto(
      `/oms/DistributionChannel/GetDistributionPlanningLanding?buisnessUnitId=${buId}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({ handleSubmit, resetForm, values, setFieldValue, isValid, errors, touched }) => (
        <>
          {rowDtoLoading && <Loading />}
          <IForm
            title="Distribution Plan"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        '/internal-control/budget/DistributionPlanning/create'
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="row">
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Distribution Channel Name</th>
                        <th>Region Name</th>
                        <th>Area Name</th>
                        <th>Territory Name</th>
                        <th>Plant</th>
                        <th>Warehouse</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.data?.length > 0 &&
                        rowDto?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.sl}</td>
                            <td>{item?.distributionChannelName}</td>
                            <td>{item?.regionName}</td>
                            <td>{item?.areaName}</td>
                            <td>{item?.territoryName}</td>
                            <td>{item?.plantHouseName}</td>
                            <td>{item?.wareHouseName}</td>
                            <td className="text-center">
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-around',
                                }}
                              >
                                <IView
                                  styles={{ fontSize: '16px' }}
                                  clickHandler={(e) => {
                                    setDetailsView(item?.distributionRowList);
                                    setIsShowModel(true);
                                  }}
                                />
                                <IEdit
                                  onClick={() => {
                                    history.push({
                                      pathname:
                                        '/internal-control/budget/DistributionPlanning/create',
                                      state: {
                                        isEdit: true,
                                        item,
                                      },
                                    });
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {rowDto?.data?.length > 0 && (
                    <PaginationTable
                      count={rowDto?.totalCount}
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
                </div>
              </div>
            </Form>
          </IForm>
          <IViewModal
            title="Distribution details view"
            modelSize="xl"
            show={isShowModel}
            onHide={() => {
              setIsShowModel(false);
            }}
          >
            <DetailsDistributionView rowData={detailsView} />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}
