import React from 'react'
import { _dateFormatterTwo } from '../../../../_helper/_dateFormate';
import { convertToText } from '../helper';

const PrintBADCTender = ({ tenderDetails }) => {
    return (
        <div className="print-only">
            <div style={{ textAlign: "center", padding: "10px 0" }}>
                <h2>SCHEDULE OF PRICE</h2>
                <small>
                    Quotation Enquiry No: {tenderDetails?.enquiryNo}, Dated:{" "}
                    {_dateFormatterTwo(tenderDetails?.submissionDate)}
                </small>
                <small style={{ display: 'block' }}>
                    Due for submission at{" "}{tenderDetails?.dueTime} (BST) ON{" "}
                    {_dateFormatterTwo(tenderDetails?.dueDate)}
                </small>
            </div>
            <table style={{ margin: "20px 0" }} className='badc-tender-table'>
                <thead style={{ padding: "10px 0" }}>
                    <tr style={{ textAlign: "center" }}>
                        <th colSpan={1}></th>
                        <th colSpan={1} >
                            PART A
                            <strong className='d-block'>(Foreign Part)</strong>
                        </th>
                        <th colSpan={1}>Part-B ( Local TRANSPORTATION)</th>
                        <th colSpan={2}>QUOTED PRICE (INCLUDING VAT &
                            <strong className='d-block'>
                                OTHER APPLICABLE TAX).</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ width: "100%" }}>
                        <td rowSpan={2} style={{width: '80px'}}></td>
                        <td rowSpan={2} className='foreign-local-td'>
                            TRANSPORTATION OF {tenderDetails?.lotqty}TH LOT (CONTRACT {_dateFormatterTwo(tenderDetails?.contractDate)}) OF{" "}{tenderDetails?.foreignQty}{" "} {tenderDetails?.uomname} (+/-10%) {tenderDetails?.itemName} IN BULK FROM {" "}{tenderDetails?.loadPortName}{" "} TO CHATTOGRAM & {tenderDetails?.ghat1} VIA OUTER ANCHORAGE OF CHATTOGRAM PORT, BANGLADESH AND/OR {tenderDetails?.ghat2}, MONGLA PORT, BANGLADESH (RATIO: {tenderDetails?.dischargeRatio}). LAY CAN {_dateFormatterTwo(tenderDetails?.laycandate)}
                        </td>
                        <td rowSpan={2} className='foreign-local-td'>
                            ITEM-1: QUOTED PRICE FOR TRANSPORTATION OF {tenderDetails?.itemName} FROM OUTER ANCHORAGE OF CHATTOGRAM PORT TO THE GHATS OF {tenderDetails?.ghat1} PORT/PRIVATE GHAT AFTER COMPLETION OF NECESSARY WORKS./ QUOTED PRICE FOR FROM OUTER ANCHORAGE OF {tenderDetails?.ghat2} PORT TO THE GHATS OF KHULNA/ AFTER COMPLETION OF NECESSARY WORKS:
                        </td>
                        <td colSpan={1} rowSpan={1}>
                            IN FUGURE :</td>
                        <td colSpan={1} rowSpan={1} className='qoutedPriceNumber'>{tenderDetails?.pricePerQty} {" "}TK/MT</td>

                    </tr>
                    <tr>
                        <td rowSpan={1}>IN WORD:</td>
                        <td rowSpan={1} className='qoutedPriceString'>{convertToText(tenderDetails?.pricePerQty)}</td>
                    </tr>
                    <tr>
                        <td rowSpan={2} style={{width: '80px'}}><strong>Price Per M.Ton in USD</strong></td>
                        <td rowSpan={2} className='foreign-local-td text-right'><strong>{tenderDetails?.foreignPriceUsd} {" "} $</strong></td>
                        <td rowSpan={2} className='foreign-local-td text-center'>ITEM-2: QUOTED PRICE FOR BAG SUPPLY AND BAGGING:</td>
                        <td colSpan={1} rowSpan={1}>IN FUGURE :</td>
                        <td colSpan={1} rowSpan={1} className='qoutedPriceNumber'>{tenderDetails?.pricePerQty}{" "}TK/MT</td>
                    </tr>
                    <tr>
                        <td colSpan={1} rowSpan={1}>IN WORD:</td>
                        <td colSpan={1} rowSpan={1} className='qoutedPriceString'>{convertToText(tenderDetails?.pricePerQty)}</td>
                    </tr>
                    <tr>
                        <td rowSpan={2} style={{width: '80px'}}><strong>Price Per M.Ton in USD (in words)</strong></td>
                        <td rowSpan={2} className='foreign-local-td text-center'><strong>{convertToText(tenderDetails?.foreignPriceUsd)}</strong></td>
                        <td rowSpan={2} className='foreign-local-td text-center'><strong>Total Price:</strong></td>
                        <td colSpan={1} rowSpan={1}>IN FUGURE :</td>
                        <td colSpan={1} rowSpan={1} className='qoutedPriceNumber'>{tenderDetails?.pricePerQty}{" "}TK/MT</td>
                    </tr>
                    <tr>
                        <td colSpan={1} rowSpan={1}>IN WORD:</td>
                        <td colSpan={1} rowSpan={1} className='qoutedPriceString'>{convertToText(tenderDetails?.pricePerQty)}</td>
                    </tr>



                    <tr height={350}>
                        <td colSpan={3}>
                            <span style={{ display: "block", marginBottom: "30px" }}>
                                Quotation no.
                            </span>
                            {tenderDetails?.enquiryNo} Dated:{" "}
                            {_dateFormatterTwo(tenderDetails?.submissionDate)}
                        </td>
                        <td
                            colSpan={3}
                            style={{
                                verticalAlign: "bottom",
                                textAlign: "center",
                            }}
                        >
                            <strong>Signature name, address and official seal of the quotationer</strong>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default PrintBADCTender