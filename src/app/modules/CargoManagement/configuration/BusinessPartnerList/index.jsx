import React, { useState } from 'react';
import ICustomCard from '../../../_helper/_customCard';
import AssigneeModal from './AssigneeModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { imarineBaseUrl } from '../../../../../App';
import PaginationSearch from '../../../_helper/_search';
import PaginationTable from '../../../_helper/_tablePagination';
import Loading from '../../../_helper/_loading';
import IView from '../../../_helper/_helperIcons/_view';
import { Form, Formik } from 'formik';
import ShipperCreateModalOpen from './ShipperCreateModalOpen';
const initialValues = {
  tradeType: 1,
};
export default function BusinessPartnerList() {
  const formikRef = React.useRef(null);
  const [isViewMoadal, setIsViewModal] = useState(false);
  const [clickRowData, setClickRowData] = useState('');
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [
    isShipperCreateModalOpen,
    setIsShipperCreateModalOpen,
  ] = React.useState(false);
  const [
    participntLanding,
    getParticipntLanding,
    isLoading,
    setParticipntLanding,
  ] = useAxiosGet();

  React.useEffect(() => {
    commonLandingApi();

  }, []);
  const commonLandingApi = (
    searchValue,
    PageNo = pageNo,
    PageSize = pageSize,
    tradeTypeId = 1,
  ) => {
    setParticipntLanding([]);
    if (tradeTypeId === 1) {
      // export
      getParticipntLanding(
        `${imarineBaseUrl}/domain/ShippingService/GetParticipntLandingByShipper?viewOrder=desc&PageNo=${PageNo}&PageSize=${PageSize}&search=${
          searchValue ?? ''
        }`,
      );
    }
    if (tradeTypeId === 2) {
      getParticipntLanding(
        `${imarineBaseUrl}/domain/ShippingService/GetParticipntLandingByConsignee?viewOrder=desc&PageNo=${PageNo}&PageSize=${PageSize}&search=${
          searchValue ?? ''
        }`,
      );
    }
  };

  const tradeTypeHandler = ({ values }) => {
    // if trade type = 1 then export
    // if trade type = 2 then import
    commonLandingApi(null, 1, 100, values.tradeType);
  };

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <Form className="form form-label-right">
            <ICustomCard
              title="Consignee’s/Buyer Assign"
              renderProps={() => {
                return (
                  <>
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                      className="ml-2 btn btn-primary"
                      title="Assignee"
                    >
                      <i class="fa fa-user-plus" aria-hidden="true"></i>
                    </button>

                    <button
                      onClick={() => {
                        setIsShipperCreateModalOpen(true);
                      }}
                      className="ml-2 btn btn-primary"
                      title="Assignee"
                    >
                      <i class="fa fa-plus-circle" aria-hidden="true"></i>{' '}
                      Shipper Create
                    </button>
                  </>
                );
              }}
            >
              <div className="form-group row global-form">
                <div className="col-lg-12">
                  <label className="mr-3 pointer">
                    <input
                      type="radio"
                      name="tradeType"
                      checked={values?.tradeType === 1}
                      className="mr-1 pointer"
                      style={{ position: 'relative', top: '2px' }}
                      onChange={(e) => {
                        setFieldValue('tradeType', 1);
                        tradeTypeHandler({
                          values: {
                            ...values,
                            tradeType: 1,
                          },
                        });
                      }}
                    />
                    Export
                  </label>
                  <label className="pointer">
                    <input
                      type="radio"
                      name="tradeType"
                      checked={values?.tradeType === 2}
                      className="mr-1 pointer"
                      style={{ position: 'relative', top: '2px' }}
                      onChange={(e) => {
                        setFieldValue('tradeType', 2);
                        tradeTypeHandler({
                          values: {
                            ...values,
                            tradeType: 2,
                          },
                        });
                      }}
                    />
                    Import
                  </label>
                </div>
              </div>

              {isLoading && <Loading />}
              <PaginationSearch
                placeholder={`${
                  values?.tradeType === 1 ? 'Shipper Name' : 'Consignee Name'
                } search`}
                paginationSearchHandler={(searchValue) => {
                  commonLandingApi(searchValue, 1, 100, values?.tradeType);
                }}
              />
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      {values?.tradeType === 1 ? (
                        <th>Shipper Name</th>
                      ) : (
                        <th>Consignee Name</th>
                      )}
                      <th>Email</th>
                      <th>Contact No </th>
                      <th
                        style={{
                          width: '100px',
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {participntLanding?.participant?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.shipperName || item?.consigneeName}</td>
                        <td>{item?.email}</td>
                        <td>{item?.contactNumber}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <span
                              onClick={() => {
                                setIsViewModal(true);
                                setClickRowData(item);
                              }}
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

              {participntLanding?.participant?.length > 0 && (
                <PaginationTable
                  count={participntLanding?.totalCount}
                  setPositionHandler={(pageNo, pageSize) => {
                    commonLandingApi(null, pageNo, pageSize);
                  }}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                />
              )}
              {isModalOpen && (
                <AssigneeModal
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              )}

              {isViewMoadal && (
                <AssigneeModal
                  isModalOpen={isViewMoadal}
                  setIsModalOpen={() => {
                    setIsViewModal(false);
                  }}
                  isViewMoadal
                  clickRowData={{
                    ...clickRowData,
                    tradeType: values?.tradeType,
                  }}
                />
              )}

              {isShipperCreateModalOpen && (
                <ShipperCreateModalOpen
                  isModalOpen={isShipperCreateModalOpen}
                  setIsModalOpen={() => {
                    setIsShipperCreateModalOpen(false);
                  }}
                />
              )}
            </ICustomCard>
          </Form>
        )}
      </Formik>
    </div>
  );
}
