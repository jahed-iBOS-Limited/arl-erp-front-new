import React from 'react';
import { _formatMoney } from '../../../../_helper/_formatMoney';

const YearClosingTable = ({ closingData }) => {
    return (
        <>
            <h4 className='mt-2'>Closing Journal Preview of Income/Expense</h4>
            <div className="table-responsive">
            <table
                id={'yearClosingJournalPreview'}
                className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5"
            >
                <thead className="bg-secondary">
                    <tr>
                        <th className='positionSticky'>SL</th>
                        <th style={{ width: '200px' }}>General Ledger Code</th>
                        <th>General Ledger Name</th>
                        <th style={{ width: '200px' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        closingData?.closingJournalPreview?.map((data, index) => (
                            <tr key={index}>
                                <td className='positionSticky'>{index + 1}</td>
                                <td className='text-center'>{data?.strGeneralLedgerCode}</td>
                                <td>{data?.strGeneralLedgerName}</td>
                                <td className='text-right'>{_formatMoney(data?.numAmount)}</td>
                            </tr>
                        ))
                    }
                    {closingData?.closingJournalPreview?.length > 0 && (
                        <tr>
                            <td colSpan='3' className='text-right'>Total</td>
                            <td className='text-right'>{_formatMoney(closingData?.closingJournalPreview?.reduce((a, b) => a + (b['numAmount'] || 0), 0))}</td>
                        </tr>
                    )}
                </tbody>
            </table>
      </div>
            <h4 className='mt-2'>Closing Balance Preview of Asset/Liabilities</h4>
            <div className="table-responsive">
            <table
                id={'yearClosingBalancePreview'}
                className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5"
            >
                <thead className="bg-secondary">
                    <tr>
                        <th>SL</th>
                        <th style={{ width: '200px' }}>General Ledger Code</th>
                        <th>General Ledger Name</th>
                        <th style={{ width: '200px' }}>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        closingData?.closingBalancePreview?.map((data, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td className='text-center'>{data?.strGeneralLedgerCode}</td>
                                <td>{data?.strGeneralLedgerName}</td>
                                <td className='text-right'>{_formatMoney(data?.numBalance)}</td>
                            </tr>
                        ))
                    }
                    {closingData?.closingBalancePreview?.length > 0 && (
                        <tr>
                            <td colSpan='3' className='text-right'>Total</td>
                            <td className='text-right'>{_formatMoney(closingData?.closingBalancePreview?.reduce((a, b) => a + (b['numBalance'] || 0), 0))}</td>
                        </tr>
                    )}
                </tbody>
            </table>
      </div>
        </>
    );
};
export default YearClosingTable;
