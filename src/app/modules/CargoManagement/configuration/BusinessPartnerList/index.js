import React from 'react';
import { useHistory } from "react-router-dom";
import { imarineBaseUrl } from '../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import PaginationSearch from '../../../_helper/_search';
import PaginationTable from '../../../_helper/_tablePagination';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import AssigneeModal from './AssigneeModal';

export default function BusinessPartnerList() {
    const [deliveryAgentList, setDeliveryAgentList] = useAxiosGet();
    let history = useHistory()
    const [pageNo, setPageNo] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(15);

    React.useEffect(() => {
        commonLandingApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const commonLandingApi = (
        searchValue,
        PageNo = pageNo,
        PageSize = pageSize
    ) => {
        setDeliveryAgentList(
            `${imarineBaseUrl}/domain/ShippingService/GetDeliveryAgentLanding?PageNo=${PageNo}&PageSize=${PageSize}&search=${searchValue ?? ""}`
        );
    };
    return (
        <ICustomCard title="Business Partner Basic Info"
            createHandler={() => {
                history.push("/cargoManagement/configuration/business-partner-create")
            }}
            renderProps={() => {
                return (
                    <AssigneeModal />

                )
            }
            }

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
                                <th>Business Partner Name</th>
                                <th>Business Partner Type</th>
                                <th>Country</th>
                                <th>Contact Number</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveryAgentList?.dAgentdata?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>N/A</td>
                                    <td>N/A</td>
                                    <td>N/A</td>
                                    <td>N/A</td>
                                    <td>{item?.email}</td>
                                    <td >
                                        <div className="d-flex justify-content-center">
                                            <button className="btn btn-primary"
                                                onClick={() => {
                                                    history.push(`/cargoManagement/configuration/delivery-agent-edit/${item?.agentId}`)
                                                }}
                                            ><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
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
    )
}
