import moment from 'moment';
import React, { useEffect } from 'react';
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';

export default function ShippingExpenseIncomeDetails({ bookingId }) {
    const [data, getShippingExpenseIncomeDetails, isloading,] = useAxiosGet();
    useEffect(() => {
        if (bookingId) {
            getShippingExpenseIncomeDetails(`${imarineBaseUrl}/domain/ShippingService/ShippingExpenseIncomeDetails?bookingId=${bookingId}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingId]);
    return (
        <div>
            {isloading && <Loading />}
            <div className="col-lg-12">
                <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th
                                    style={{
                                        minWidth: "150px",
                                    }}
                                >
                                    Billing Id
                                </th>
                                <th
                                    style={{
                                        minWidth: "100px",
                                    }}
                                >
                                    Booking Request Id
                                </th>
                                <th
                                    style={{
                                        minWidth: "100px",
                                    }}
                                >
                                    Head Of Charge Id
                                </th>
                                <th style={{
                                    minWidth: "100px",
                                }}>
                                    Head Of Charges
                                </th>
                                <th>Charge Amount</th>
                                <th>Actual Expense</th>
                                <th>Billing Date</th>

                            </tr>
                        </thead>
                        <tbody>
                            {data?.length > 0 &&
                                data?.map((item, i) => (
                                    <tr key={i + 1}>
                                        <td className="text-center">{i + 1}</td>
                                        <td className="text-left">
                                            {item?.billingId}
                                        </td>
                                        <td className="text-left">
                                            {item?.bookingRequestId}
                                        </td>
                                        <td className="text-left">
                                            {item?.headOfChargeId}
                                        </td>
                                        <td className="text-center">
                                            {item?.headOfCharges}
                                        </td>
                                        <td className="text-right">
                                            {item?.chargeAmount}
                                        </td>
                                        <td className="text-right">
                                            {item?.actualExpense}
                                        </td>
                                        <td className="text-center">
                                            {moment(item?.billingDate).format("DD MMM YYYY HH:mm:ss")}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
