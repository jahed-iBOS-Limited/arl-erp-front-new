import { EyeOutlined } from '@ant-design/icons';
import { IconButton } from '@material-ui/core';
import React from 'react';
import ICustomCard from "../../../_helper/_customCard";
import IViewModal from "../../../_helper/_viewModal";
import Details from '../bookingList/bookingDetails';

const data = [
    {
        bookingRequestCode: "123",
        income: "1000",
        expense: "500"
    },
    {
        bookingRequestCode: "124",
        income: "2000",
        expense: "5000"
    }
]
export default function ExpenseReport() {
    const [isModalShowObj, setIsModalShowObj] = React.useState({});
    const [rowClickData, setRowClickData] = React.useState({});

    return (
        <>
            <ICustomCard title="Expense Report">
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
                                        Booking No
                                    </th>
                                    <th
                                        style={{
                                            minWidth: "100px",
                                        }}
                                    >
                                        Income
                                    </th>
                                    <th
                                        style={{
                                            minWidth: "100px",
                                        }}
                                    >
                                        Expense
                                    </th>
                                    <th style={{
                                        minWidth: "100px",
                                    }}>
                                        Revenue
                                    </th>
                                    <th>Action</th>

                                </tr>
                            </thead>
                            <tbody>
                                {data?.length > 0 &&
                                    data?.map((item, i) => (
                                        <tr key={i + 1}>
                                            <td className="text-center">{i + 1}</td>
                                            <td className="text-left">
                                                {item?.bookingRequestCode}
                                            </td>
                                            <td className="text-right">
                                                {item?.income}
                                            </td>
                                            <td className="text-right">
                                                {item?.expense}
                                            </td>
                                            <td className="text-right"
                                                style={{
                                                    ...(item?.income - item?.expense) < 0 && {
                                                        color: "red"
                                                    }
                                                }}
                                            >
                                                {item?.income - item?.expense}
                                            </td>
                                            <td className="text-center">
                                                <IconButton
                                                    size='small'
                                                    onClick={() => {
                                                        setRowClickData(item);
                                                        setIsModalShowObj({
                                                            ...isModalShowObj,
                                                            isViewDetails: true,
                                                        });
                                                    }}
                                                >
                                                    <EyeOutlined />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </ICustomCard>
            {isModalShowObj?.isViewDetails && (
                <>
                    <IViewModal
                        title="Details"
                        show={isModalShowObj?.isViewDetails}
                        onHide={() => {
                            setIsModalShowObj({
                                ...isModalShowObj,
                                isViewDetails: false,
                            });
                        }}
                    >
                        <Details rowClickData={rowClickData} />

                    </IViewModal>
                </>
            )}
        </>

    )
}
