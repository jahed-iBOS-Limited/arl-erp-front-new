import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";

function DelearsBenefotsViewModal({ intDealerRegistrationId }) {
    const [viewData, getViewData, loader] = useAxiosGet();

    useEffect(() => {
        getViewData(
            `/partner/PartnerBenefitPolicy/GetPartnerBenefitPolicyById?DealerRegistrationId=${intDealerRegistrationId}`
        );

    }, [intDealerRegistrationId]);

    const renderHeader = () => {
        const data = viewData?.result || {};

        return (
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="card p-3">
                        <h5 className="card-title">Dealer Information</h5>
                        <p><strong>Dealer Name:</strong> {data?.dealerBusinessName || ""}</p>
                        <p><strong>Address:</strong> {data?.dealerAddress || ""}</p>
                        <p><strong>Mobile No:</strong> {data?.mobileNo || ""}</p>
                        <p><strong>Present Depo:</strong> {data?.presentDepo || ""}</p>
                        <p><strong>Monthly Existing Business:</strong> {data?.monthlyExistingBusinessTotal || 0} MT</p>
                        <p><strong>Nearest Depot:</strong> {data?.ourNearestDepot || ""} ({data?.ourDepotDistancekm || 0} KM)</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3">
                        <h5 className="card-title">Region and Zone</h5>
                        <p><strong>Zone:</strong> {data?.zoneName || ""}</p>
                        <p><strong>Region:</strong> {data?.regionName || ""}</p>
                        <p><strong>RSM Name:</strong> {data?.rsmname || ""}</p>
                        <p><strong>Party Status:</strong> {data?.partyStatus || ""}</p>
                        <p><strong>Credit Limit:</strong> {data?.presentCreditLimitAmount || 0} TK</p>
                        <p><strong>Credit Pay System:</strong> {data?.creditPaySys || ""}</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderTable = () => {
        const rows = viewData?.result?.row || [];

        // Calculate totals for numeric fields
        const total = rows.reduce(
            (acc, row) => {
                acc.ourStdSlubRate += parseFloat(row?.ourStdSlubRate || 0);
                acc.dealerPresentBenefit += parseFloat(row?.dealerPresentBenefit || 0);
                acc.salesProposal += parseFloat(row?.salesProposal || 0);
                acc.approval += parseFloat(row?.approval || 0);
                return acc;
            },
            {
                ourStdSlubRate: 0,
                dealerPresentBenefit: 0,
                salesProposal: 0,
                approval: 0,
            }
        );

        return (
            <table className="table table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th>Sl #</th>
                        <th>Benefit Details</th>
                        <th className="text-center">Our Std/MT as per Slub</th>
                        <th className="text-center">Dealer's Present Benefit</th>
                        <th className="text-center">Sales Proposal/MT</th>
                        <th className="text-center">Approval/MT</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row?.intId || index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{row?.benefitDetails || ""}</td>
                            <td className="text-center">{row?.ourStdSlubRate || 0}</td>
                            <td className="text-center">{row?.dealerPresentBenefit || 0}</td>
                            <td className="text-center">{row?.salesProposal || 0}</td>
                            <td className="text-center">{row?.approval || 0}</td>
                            <td>{row?.remarks || ""}</td>
                        </tr>
                    ))}
                    <tr className="font-weight-bold">
                        <td colSpan="2" className="text-right">Total:</td>
                        <td className="text-center">{total?.ourStdSlubRate?.toFixed(2)}</td>
                        <td className="text-center">{total?.dealerPresentBenefit?.toFixed(2)}</td>
                        <td className="text-center">{total?.salesProposal?.toFixed(2)}</td>
                        <td className="text-center">{total?.approval?.toFixed(2)}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        );
    };

    return (
        <div>
            {loader && <Loading />}
            {!loader && (
                <div className="container mt-5">
                    {renderHeader()}
                    {renderTable()}
                </div>
            )}
        </div>
    );
}

export default DelearsBenefotsViewModal;
