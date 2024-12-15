import React from 'react';
import { useHistory } from 'react-router-dom';
import { imarineBaseUrl } from '../../../../../App';
import ICustomCard from '../../../../_helper/_customCard';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';

export default function MasterBlList() {
  const [masterBLLandingList, setMasterBLLandingList] = useAxiosGet();
  let history = useHistory();

  React.useEffect(() => {
    setMasterBLLandingList(
      `${imarineBaseUrl}/domain/ShippingService/GetMasterBLConfigurations`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <th>Shipping Line/Air Line</th>
                <th>Master BL</th>
                <th>GSA</th>
                <th>Is Bl Genarate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {masterBLLandingList?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {item?.shippingLineName}
                    {item?.airLineName}
                  </td>
                  <td>{item?.masterBL}</td>
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
      </div>
    </ICustomCard>
  );
}
