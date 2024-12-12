import React from 'react';
import { useHistory } from 'react-router-dom';
import { imarineBaseUrl } from '../../../../../App';
import ICustomCard from '../../../../_helper/_customCard';
import PaginationSearch from '../../../../_helper/_search';
import PaginationTable from '../../../../_helper/_tablePagination';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';


export default function MasterBlList() {
    const [deliveryAgentList, setMasterBLLandingList] = useAxiosGet();
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
        setMasterBLLandingList(
            `${imarineBaseUrl}/domain/ShippingService/GetParticipantsLanding?PageNo=${PageNo}&PageSize=${PageSize}&search=${searchValue ??
            ''}`,
        );
    };

    return (
        <ICustomCard
            title="Master BL Configuration"
            createHandler={() => {
                history.push('/cargoManagement/configuration/masterbl/create');
            }}

        >
            <PaginationSearch
                placeholder="Search Master BL"
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
                                <th>Shipping Line</th>
                                <th>Master BL</th>
                                <th>GSA</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveryAgentList?.participant?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.shippingLineName}</td>
                                    <td>{item?.masterBL}</td>
                                    <td>{item?.gsaName}</td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    history.push(
                                                        `/cargoManagement/configuration/masterbl/edit/${item?.mblConfigId}`,
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
