import React from 'react'

function Schedule() {
  return (
    <div className="mt-5">
    <div>
      {[1]?.length > 0 && (
        <table className="table table-striped table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Uom</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Vat %</th>
              <th>Nate Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[1]?.map((item, index) => (
              <tr key={index}>
               
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
  )
}

export default Schedule
