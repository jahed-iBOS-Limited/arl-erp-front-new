import React, { useEffect } from 'react';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import Loading from '../../../_helper/_loading';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import { _formatMoney } from '../../../_helper/_formatMoney';

function GlDetailsModal({ singleData, values, selectedBusinessUnit }) {
    const [glDetails, getGLDetails, loading] = useAxiosGet();

    useEffect(() => {
        if (singleData) {
            getGLDetails(`/fino/Report/GetIncomeStatementComponentDetailsJournal?BusinessUnitId=${selectedBusinessUnit?.value || 0}&ProfitCenter=${values?.profitCenter?.value || 0}&GlId=${singleData?.intGeneralLedgerId}&SubGlId=${singleData?.intSubGlId}&SubGlTypeId=${singleData?.intSubGlTypeId || 0}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [singleData]);

    return (
        <div>
            {loading && <Loading />}
            {glDetails?.length > 0 ? (
                <div className='row'>
                    <div className='col-12'>
                        <div className="table-responsive mt-3">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>Transaction Date</th>
                                        <th>Sub GL Name</th>
                                        <th>Sub GL Code</th>
                                        <th>Journal Code</th>
                                        <th>Amount</th>
                                        <th>Narration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {glDetails.map((detail, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td style={{ minWidth: "150px" }} className='text-center'>{_dateFormatter(detail?.dteTransactionDate)}</td>
                                            <td style={{ minWidth: "150px" }}>{detail?.strSubGLName}</td>
                                            <td style={{ minWidth: "150px" }} className='text-center'>{detail?.strSubGlCode}</td>
                                            <td style={{ minWidth: "150px" }} className='text-center'>{detail?.strAccountingJournalCode}</td>
                                            <td className='text-right' style={{ minWidth: "150px" }}>{_formatMoney(detail?.numAmount)}</td>
                                            <td>{detail?.strNarration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                !loading && <p>No GL details available.</p>
            )}
        </div>
    );
}

export default GlDetailsModal;
