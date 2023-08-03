import React from 'react'

function WIPTable({ tableData }) {
    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <table className="table table-striped table-bordered global-table">
                        <>
                            <thead>
                                <tr>
                                    <th>SL</th>
                                    <th>Item Id</th>
                                    <th>Item Name</th>
                                    {/* <th>Con Quantity</th>
                                    <th>Issue</th> */}
                                    <th>WIP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className="text-center">{item?.mitemid}</td>
                                        <td>{item?.stritemname}</td>
                                        {/* <td className="text-right">{item?.conqty}</td>
                                        <td className="text-right">{item?.issue}</td> */}
                                        <td className="text-right">{item?.wip}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    </table>
                </div>
            </div>
        </>

    )
}

export default WIPTable