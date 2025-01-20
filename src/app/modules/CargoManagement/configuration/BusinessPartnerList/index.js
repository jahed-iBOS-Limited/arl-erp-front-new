import React, { useState } from 'react';
import ICustomCard from '../../../_helper/_customCard';
import AssigneeModal from './AssigneeModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { imarineBaseUrl } from '../../../../App';
import PaginationSearch from '../../../_helper/_search';
import PaginationTable from '../../../_helper/_tablePagination';
import Loading from '../../../_helper/_loading';
import IView from '../../../_helper/_helperIcons/_view';
export default function BusinessPartnerList() {
  const [isViewMoadal, setIsViewModal] = useState(false);
  const [clickRowData, setClickRowData] = useState('');
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [participntLanding, getParticipntLanding, isLoading] = useAxiosGet();

  React.useEffect(() => {
    commonLandingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const commonLandingApi = (
    searchValue,
    PageNo = pageNo,
    PageSize = pageSize,
  ) => {
    getParticipntLanding(
      `${imarineBaseUrl}/domain/ShippingService/GetParticipntLandingByShipper?viewOrder=desc&PageNo=${PageNo}&PageSize=${PageSize}&search=${searchValue ??
        ''}`,
    );
  };
  return (
    <ICustomCard
      title="Consignee’s/Buyer Assign"
      renderProps={() => {
        return (
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="ml-2 btn btn-primary"
            title="Assignee"
            // startIcon={<i class="fa fa-user-plus" aria-hidden="true"></i>}
          >
            <i class="fa fa-user-plus" aria-hidden="true"></i>
          </button>
        );
      }}
    >
      {isLoading && <Loading />}
      <PaginationSearch
        placeholder="Search Bank"
        paginationSearchHandler={(searchValue) => {
          commonLandingApi(searchValue, 1, 100);
        }}
      />
      <div className="col-lg-12">
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Shipper Name</th>
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
                  <td>{item?.shipperName}</td>
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
          clickRowData={clickRowData}
        />
      )}
    </ICustomCard>
  );
}
