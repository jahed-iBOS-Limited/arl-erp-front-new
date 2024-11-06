import React from 'react';
import { useHistory } from "react-router-dom";
import { imarineBaseUrl } from '../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';

export default function DeliveryAgentList() {
    const [deliveryAgentList, setDeliveryAgentList] = useAxiosGet();
    let history = useHistory()

    React.useEffect(() => {
        setDeliveryAgentList(
            `${imarineBaseUrl}/domain/ShippingService/GetDeliveryAgentLanding?PageNo=1&PageSize=1000000`
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    console.log(deliveryAgentList)
    return (
        <ICustomCard title="Delivery Agent List"
            createHandler={() => {
                history.push("/cargoManagement/configuration/delivery-agent-create")
            }}
        >
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
        </ICustomCard>
    )
}
