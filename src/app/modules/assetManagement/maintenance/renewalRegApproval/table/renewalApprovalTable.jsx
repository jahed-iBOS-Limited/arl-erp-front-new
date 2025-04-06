import React from 'react'
import { _formatMoney } from '../../../../_helper/_formatMoney';
import IView from '../../../../_helper/_helperIcons/_view';

export default function RenewalApprovalTable({ gridData, setGridData, setCode, setIsShowModal }) {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-bordered global-table mt-0">
                <thead>
                    <tr>
                        <th style={{ width: "30px" }}>
                            <input
                                disabled={!gridData?.length}
                                type="checkbox"
                                checked={
                                    gridData?.length > 0
                                        ? gridData?.every((item) => item?.checked)
                                        : false
                                }
                                onChange={(e) => {
                                    setGridData(
                                        gridData?.map((item) => {
                                            return {
                                                ...item,
                                                checked: e?.target?.checked,
                                            };
                                        })
                                    );
                                }}
                            />
                        </th>
                        <th>Sl</th>
                        <th>Code</th>
                        <th>Total Amount</th>
                        <th className="text-right pr-1" style={{ width: 80 }}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {gridData?.length
                        ? gridData.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="text-center align-middle">
                                        <input
                                            type="checkbox"
                                            checked={item?.checked}
                                            onChange={(e) => {
                                                item["checked"] = e.target.checked;
                                                setGridData([...gridData]);
                                            }}
                                        />
                                    </td>
                                    <td className="text-center">
                                        {index + 1}
                                    </td>
                                    <td className="text-center">
                                        {item?.renewalCode}
                                    </td>
                                    <td className="text-center">
                                        {_formatMoney(item?.totalAmount)}
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="mx-1">
                                                <IView
                                                    clickHandler={(e) => {
                                                        setCode({
                                                            renewalCode: item.renewalCode,
                                                            statusTypeId: item.statusTypeId,
                                                        });
                                                        setIsShowModal(true);
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                        : null}
                </tbody>
            </table>
        </div>
    )
}
