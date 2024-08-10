import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import IEdit from '../../../../_helper/_helperIcons/_edit'
import { fetchTenderDetailsCallbackForPrintAndCreateEditPage } from '../helper'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions'
import ICon from '../../../../chartering/_chartinghelper/icons/_icon'


const BADCTendersTable = ({ accountId, buUnId, values, submittedTenderLists, handleTenderPrint, getTenderDetails }) => {
    const dispatch = useDispatch()
    const history = useHistory()


    return (
        <div className="table-responsive">
            <table
                id="table-to-xlsx"
                className={
                    "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table"
                }
            >
                <thead>
                    <tr className="cursor-pointer">
                        <th>SL</th>
                        <th style={{ width: "150px" }}>Business Partner</th>
                        <th>Enquiry No</th>
                        <th>Item Name</th>
                        <th>Load Port</th>
                        <th>Ghat (Mongla)</th>
                        <th>Ghat (Chittagong)</th>
                        <th style={{ width: "150px" }}>Foreign Qty</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {submittedTenderLists?.data?.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td style={{ width: "40px" }} className="text-center">
                                    {index + 1}
                                </td>
                                <td>{item?.businessPartnerName}</td>
                                <td>{item?.enquiryNo}</td>
                                <td>{item?.itemName}</td>
                                <td style={{ width: "200px" }}>
                                    {item?.loadPortName}
                                </td>
                                <td style={{ width: "200px" }}>
                                    {item?.ghat1}
                                </td>
                                <td style={{ width: "200px" }}>
                                    {item?.ghat2}
                                </td>
                                <td className="text-right" style={{ width: "70px" }}>
                                    {item?.foreignQty}
                                </td>
                                <td style={{ width: "70px" }}>
                                    {item?.isAccept === null || item?.isAccept === false
                                        ? "No"
                                        : "Approved"}
                                </td>
                                <td style={{ width: "80px" }} className="text-center">
                                    <div className="d-flex justify-content-around">
                                        <span>
                                            <IEdit
                                                onClick={() => {
                                                    history.push({
                                                        pathname: `/vessel-management/allotment/tendersubmission/edit/${item?.tenderId}`,
                                                        state: item,
                                                    });
                                                    // setShow(true);
                                                }}
                                            // id={item?.shiptoPartnerId}
                                            />
                                        </span>
                                        <span
                                            // 1st approch
                                            // onClick={() => {
                                            //     fetchTenderDetails(item?.tenderId)
                                            //     handleTenderPrint()
                                            // }}
                                            // 2nd approch
                                            onClick={() => {
                                                fetchTenderDetailsCallbackForPrintAndCreateEditPage(
                                                    accountId,
                                                    buUnId,
                                                    values,
                                                    item?.tenderId,
                                                    getTenderDetails,
                                                    handleTenderPrint
                                                );
                                            }}
                                        >
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip id="cs-icon">Print</Tooltip>
                                                }
                                            >
                                                <i
                                                    style={{ fontSize: "16px" }}
                                                    class="fa fa-print cursor-pointer"
                                                    aria-hidden="true"
                                                ></i>
                                            </OverlayTrigger>
                                        </span>
                                        {item?.attachment && (
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(
                                                        getDownlloadFileView_Action(
                                                            item?.attachment
                                                        )
                                                    );
                                                }}
                                            >
                                                <ICon title={`View Attachment`}>
                                                    <i class="far fa-file-image"></i>
                                                </ICon>
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default BADCTendersTable