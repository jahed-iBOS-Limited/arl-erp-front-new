import React from 'react';
import { useHistory } from 'react-router-dom';
import { imarineBaseUrl } from '../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import PaginationSearch from '../../../_helper/_search';
import PaginationTable from '../../../_helper/_tablePagination';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import AssigneeModal from './AssigneeModal';

export default function BusinessPartnerList() {
  const [deliveryAgentList, setDeliveryAgentList] = useAxiosGet();
  let history = useHistory();
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  React.useEffect(() => {
    commonLandingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commonLandingApi = (
    searchValue,
    PageNo = pageNo,
    PageSize = pageSize,
  ) => {
    setDeliveryAgentList(
      `${imarineBaseUrl}/domain/ShippingService/GetParticipantsLanding?PageNo=${PageNo}&PageSize=${PageSize}&search=${searchValue ??
        ''}`,
    );
  };

  //   {
  //     "participantId": 7,
  //     "participantCode": "",
  //     "participantTypeId": 3,
  //     "participantType": "Notify Party",
  //     "participantsName": "Ibos Ltd",
  //     "companyName": "",
  //     "contactPerson": "Md Abdul Kader",
  //     "contactNumber": "01700000000",
  //     "email": "kader@ibos.io",
  //     "countryId": 18,
  //     "country": "Bangladesh",
  //     "stateId": 0,
  //     "state": "Dhaka",
  //     "cityId": 0,
  //     "city": "md",
  //     "address": "Lalmatia mohammad pur",
  //     "zipCode": "1216",
  //     "isActive": true,
  //     "createdBy": 521235,
  //     "createdAt": "2024-11-28T12:38:08.86"
  // },
  return (
    <ICustomCard
      title="Consignee’s/Buyer Assign"
      createHandler={() => {
        history.push('/cargoManagement/configuration/assign/create');
      }}
      renderProps={() => {
        return <AssigneeModal />;
      }}
    >
      <PaginationSearch
        placeholder="Search Business Partner"
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
                <th>Type</th>
                <th>Name</th>
                <th>Country</th>
                <th>Contact Number</th>
                <th>State/Province/Region</th>
                <th>City</th>
                <th>Zip/Postal Code</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deliveryAgentList?.participant?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.participantType}</td>
                  <td>{item?.participantsName}</td>
                  <td>{item?.country}</td>
                  <td>{item?.contactNumber}</td>
                  <td>{item?.state}</td>
                  <td>{item?.city}</td>
                  <td>{item?.zipCode}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          history.push(
                            `/cargoManagement/configuration/assign/edit/${item?.participantId}`,
                          );
                        }}
                      >
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {deliveryAgentList?.dAgentdata?.length > 0 && (
        <PaginationTable
          count={deliveryAgentList?.totalCount}
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
    </ICustomCard>
  );
}
