import React, { useEffect } from 'react'
import { shallowEqual, useSelector } from 'react-redux';
import { _dateFormatter, _dateTimeFormatter } from '../../../../_helper/_dateFormate';

const RfqViewPdf = ({ pdfData, itemList, supplierList, title, status }) => {
    useEffect(() => {
        if (pdfData) {
            console.log("pdfData", pdfData)
        }
    })
    const { selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    return (
        <div className="rfq-pdf">
            <div className="businessUnitDetails text-center">
                <h3>{selectedBusinessUnit?.label}</h3>
                <h5>{selectedBusinessUnit?.businessUnitAddress}</h5>
                <br /><br />
                <h5>Request For Quotation</h5>
                <br /><br />
            </div>
            <div className="rfqDetails" style={{
                border: "3px solid #ddd",
                padding: "5px",
            }}>
                <div className="row">
                    {/* l1 */}
                    <div className="col-lg-4">
                        <span className='font-weight-bold'> RFQ Title:</span> {pdfData?.rfqTitle}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>RFQ Type:</span> {pdfData?.rfqType?.label}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>RFQ Date:</span> {pdfData?.deliveryDate}
                    </div>
                    {/* l2 */}
                    <div className="col-lg-4">
                        <span className='font-weight-bold'> RFQ Code:</span> {title}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>Quotation Start Date-Date:</span> {_dateTimeFormatter(pdfData?.quotationEntryStart)}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>Quotation End Date-Date:</span> {_dateTimeFormatter(pdfData?.validTillDate)}
                    </div>
                    {/* l3 */}
                    <div className="col-lg-4">
                        <span className='font-weight-bold'> Purchase Organization:</span> {pdfData?.purchaseOrganization?.label}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>Plant:</span> {pdfData?.plant?.label}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>Warehouse:</span> {pdfData?.warehouse?.label}
                    </div>
                    {/* l4 */}
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>VAT/AIT:</span> {pdfData?.vatOrAit?.label}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>Transport Cost:</span> {pdfData?.transportCost?.label}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>TDS:</span> {pdfData?.tds?.label}
                    </div>
                    {/* l5 */}
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>VDS:</span> {pdfData?.vds?.label}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>Delivery Date:</span> {_dateFormatter(pdfData?.deliveryDate)}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>Delivery Address:</span> {pdfData?.deliveryAddress}
                    </div>
                    {/* l6 */}
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>Status:</span> {status}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>Currency:</span> {pdfData?.currency?.label}
                    </div>
                    <div className="col-lg-4">
                        <span className='font-weight-bold'>Payment Terms:</span> {pdfData?.paymentTerms?.label}
                    </div>
                </div >
            </div >
            <div className="itemDetails">
                <h6 className="mt-2">Item Details: </h6>
                <div className="mt-2">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                            <tr>
                                <th style={{
                                    width: "30px",
                                }}>Sl</th>
                                {pdfData?.referenceType?.value === "with reference" && <th>RFQ No</th>}
                                <th>Item Name</th>
                                <th>Uom</th>
                                <th>Description</th>
                                <th>Ref Quantity</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                itemList?.length > 0 && itemList?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        {pdfData?.referenceType?.value === "with reference" && <td className="text-center">{item?.referenceCode}</td>}
                                        <td>{item?.itemName}</td>
                                        <td>{item?.uoMname}</td>
                                        <td>{item?.description}</td>
                                        <td className="text-center">{item?.referenceQuantity}</td>
                                        <td className="text-center">{item?.reqquantity}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="supplierDetails">
                <h6 className="mt-2">Supplier List</h6>
                <div className="mt-2">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                            <tr>
                                <th style={{
                                    width: "30px",
                                }
                                }>Sl</th>
                                <th>Supplier Name</th>
                                <th>Supplier Address</th>
                                <th>Contact No</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                supplierList?.length > 0 && supplierList?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item?.businessPartnerName}</td>
                                        <td>{item?.businessPartnerAddress}</td>
                                        <td>{item?.contactNumber}</td>
                                        <td>{item?.email}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="termsAndConditions">
                <h6 className="mt-2">Terms & Conditions</h6>
                <div className="row">
                    <div className="col-lg-12">
                        <p>{pdfData?.termsAndConditions}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RfqViewPdf