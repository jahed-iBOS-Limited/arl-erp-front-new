import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { imarineBaseUrl } from '../../../../../../App';
import ICustomCard from '../../../../_helper/_customCard';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import PaginationTable from '../../../../_helper/_tablePagination';
export default function MasterBlList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [masterBLLandingList, setMasterBLLandingList] = useAxiosGet();
  let history = useHistory();

  React.useEffect(() => {
    commonGetData('', pageNo, pageSize);

  }, []);

  const commonGetData = (search, pageNo, pageSize) => {
    setMasterBLLandingList(
      `${imarineBaseUrl}/domain/ShippingService/GetMasterBLConfigurations?viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`,
    );
  };
  return (
    <ICustomCard
      title="Master BL Entry"
      createHandler={() => {
        history.push('/cargoManagement/configuration/masterbl/create');
      }}
    >
      <div className="col-lg-12">
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>IMP/EXP</th>
                <th>Master BL</th>
                <th>Shipping Line/Air Line</th>
                <th>GSA</th>
                <th>Is Bl Genarate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {masterBLLandingList?.data?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.tradeTypeId === 2 ? 'Import ' : 'Export'}</td>
                  <td>{item?.masterBL}</td>
                  <td>
                    {item?.shippingLineName}
                    {item?.airLineName}
                  </td>

                  <td>{item?.gsaName}</td>
                  <td>{item?.isMasterBlGenarate ? 'True' : 'False'}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          history.push(
                            `/cargoManagement/configuration/masterbl/edit/${item?.mblConfigId}`,
                            { data: item },
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

        {masterBLLandingList?.data?.length > 0 && (
          <PaginationTable
            count={masterBLLandingList?.totalCount}
            setPositionHandler={(pageNo, pageSize) => {
              commonGetData('', pageNo, pageSize);
            }}
            paginationState={{
              pageNo,
              setPageNo,
              pageSize,
              setPageSize,
            }}
          />
        )}
      </div>
    </ICustomCard>
  );
}
