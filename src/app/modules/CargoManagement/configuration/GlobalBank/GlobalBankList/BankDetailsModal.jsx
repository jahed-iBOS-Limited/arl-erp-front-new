import React from 'react'
import IViewModal from '../../../../_helper/_viewModal';
import ICustomCard from '../../../../_helper/_customCard';
// "gbankAddress": [
//     {
//         "bankName": "DDBL",
//         "address": "Dhaka",
//         "createdBy": 521235
//     },
//     {
//         "bankName": "2w",
//         "address": "23",
//         "createdBy": 521235
//     }
// ]
export default function BankDetailsModal({ isModalOpen, setIsModalOpen }) {
    return (
        <IViewModal
            title="Bank Details Modal"
            show={isModalOpen}
            onHide={() => {
                setIsModalOpen(false);
            }}
        >
            <ICustomCard
                title={'Bank Details'}
                backHandler={() => {
                    setIsModalOpen(false);
                }}
            >
                <p>
                    Bank Name: <span>Bank Name</span>
                    <br />
                    Primary Address: <span>Primary Address</span>
                    <br />
                    Country: <span>Country</span>
                    <br />
                    City: <span>City</span>
                    <br />
                    Phone Number: <span>Phone Number</span>
                    <br />
                    Email: <span>Email</span>
                    <br />
                    Website: <span>Website</span>
                    <br />
                    Swift Code: <span>Swift Code</span>
                    <br />
                    Currency: <span>Currency</span>
                    <br />

                </p>
                <hr />
                {/* gbankAddress table */}
                <div className="table-responsive">
                    <table className="table table-bordered global-table">
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Bank Name</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>N/A</td>
                                <td>N/A</td>
                            </tr>
                        </tbody>
                    </table>
                </div>




            </ICustomCard>
        </IViewModal>
    )
}
