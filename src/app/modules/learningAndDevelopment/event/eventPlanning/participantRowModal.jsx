import React from 'react'
const ParticipantRowModal = ({participantData}) =>{
    const {sl,participantName, occupation,organaizationName, phone, email,address, cardNumber} = participantData || {}
    return (
        <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Name</th>
                        <th>Occupation</th>
                        <th>Organization</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Code</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr >
                            <td>{sl}</td>
                            <td>{participantName}</td>
                            <td>{occupation}</td>
                            <td>{organaizationName}</td>
                            <td>{phone}</td>
                            <td>{email}</td>
                            <td>{address}</td>
                            <td>{cardNumber}</td>
                          </tr>


                    </tbody>
                  </table>
    )
}


export default ParticipantRowModal