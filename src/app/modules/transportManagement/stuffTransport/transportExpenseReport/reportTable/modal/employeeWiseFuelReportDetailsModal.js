import React from "react";

const EmployeeWiseFuelReportDetailsModal = ({ clickedItem, landingValues }) => {
  return (
    <div>
      <header>
        <button className="btn btn-primary">Print</button>
      </header>
      <div id="print-section">
        <header className="text-center">
          <h1>iBOS Limited</h1>
          <h6 className="text-secondary">address</h6>
          <h1>Fuel Log</h1>
        </header>
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-secondary">Employee Name</h6>
            <h6>{clickedItem?.employeeName}</h6>
          </div>
          <div className="col-md-6">
            <h6 className="text-secondary">Employee ID</h6>
            <h6>{clickedItem?.employeeId}</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeWiseFuelReportDetailsModal;
