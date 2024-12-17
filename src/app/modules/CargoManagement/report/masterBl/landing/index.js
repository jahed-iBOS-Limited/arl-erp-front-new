import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import ICustomCard from '../../../../_helper/_customCard';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import IView from '../../../../_helper/_helperIcons/_view';
import Loading from '../../../../_helper/_loading';
import PaginationSearch from '../../../../_helper/_search';
import NewSelect from '../../../../_helper/_select';
import PaginationTable from '../../../../_helper/_tablePagination';
import { _todayDate } from '../../../../_helper/_todayDate';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { imarineBaseUrl } from '../../../../../App';
import IViewModal from '../../../../_helper/_viewModal';
import MasterHBLModal from '../../../operation/bookingList/masterHBLModal';
// import { getBusinessPartnerDDL, getLandingPaginationData } from '../helper';

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  modeOfTransport: {
    value: 1,
    label: 'Air',
  },
};

function MasterBLLanding() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [isMasterBLViewModal, setIsMasterBLViewModal] = useState(false);
  const [clickRowDto, setClickRowDto] = useState(null);
  const [
    masterBlLanding,
    GetMasterBlLanding,
    masterBlLandingLoading,
  ] = useAxiosGet();
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    getLandingData(initData, pageNo, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const getLandingData = (values, pageNo, pageSize, searchValue = '') => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetMasterBlLanding(
        `${imarineBaseUrl}/domain/ShippingService/GetMasterBlLanding?typeId=${values?.modeOfTransport?.value}&search=${searchValue}&PageNo=${pageNo}&PageSize=${pageSize}`,
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = '') => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };
  return (
    <>
      <ICustomCard title="Master BL">
        {masterBlLandingLoading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="modeOfTransport"
                      options={[
                        {
                          value: 1,
                          label: 'Air',
                        },
                        {
                          value: 2,
                          label: 'Sea',
                        },
                      ]}
                      value={values?.modeOfTransport || ''}
                      label="Booking Type"
                      onChange={(valueOption) => {
                        setFieldValue('modeOfTransport', valueOption);
                        getLandingData(
                          {
                            ...values,
                            modeOfTransport: valueOption,
                          },
                          pageNo,
                          pageSize,
                        );
                      }}
                      placeholder="Booking Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {masterBlLanding?.masterBL?.length > 0 && (
                  <PaginationSearch
                    placeholder="Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                )}
                {masterBlLanding?.masterBL?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Master BL No</th>
                          {/* <th>Shipper</th>
                          <th>Consignee</th>
                          <th>Notify Party</th> */}
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {masterBlLanding?.masterBL?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="text-center">{index + 1}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.masterBlNo}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {_dateFormatter(item?.createdAt)}
                              </div>
                            </td>

                            <td style={{ maxWidth: '100px' }}>
                              <div className="d-flex justify-content-center">
                                <span
                                  onClick={() => {
                                    setIsMasterBLViewModal(true);
                                    setClickRowDto(item);
                                  }}
                                  className="ml-2 mr-3"
                                >
                                  <IView />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {masterBlLanding?.masterBL?.length > 0 && (
                  <PaginationTable
                    count={masterBlLanding?.totalCount}
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

                {isMasterBLViewModal && (
                  <>
                    <IViewModal
                      title={'Master BL'}
                      show={isMasterBLViewModal}
                      onHide={() => {
                        setIsMasterBLViewModal(false);
                      }}
                    >
                      <MasterHBLModal
                        isPrintView={true}
                        sipMasterBlid={clickRowDto?.sipMasterBlid}
                      />
                    </IViewModal>
                  </>
                )}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default MasterBLLanding;
