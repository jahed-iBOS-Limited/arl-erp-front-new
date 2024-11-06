import React from 'react';
import { useHistory } from "react-router-dom";
import { imarineBaseUrl } from '../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import PaginationSearch from '../../../_helper/_search';
import PaginationTable from '../../../_helper/_tablePagination';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';

export default function DeliveryAgentList() {
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
        <ICustomCard title="Delivery Agent List"
            createHandler={() => {
                history.push("/cargoManagement/configuration/delivery-agent-create")
            }}
        >
            <PaginationSearch
                placeholder="Search Delivery Agent"
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
                                <th>Agent Name</th>
                                <th>Email</th>
                                <th>Contact Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveryAgentList?.dAgentdata?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.agentName}</td>
                                    <td>{item?.email}</td>
                                    <td>{item?.contact}</td>
                                    <td
                                        style={{ display: "flex", justifyContent: "center" }}
                                    >
                                        <button className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                history.push(`/cargoManagement/configuration/delivery-agent-edit/${item?.agentId}`)
                                            }}
                                        >Edit</button>
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
