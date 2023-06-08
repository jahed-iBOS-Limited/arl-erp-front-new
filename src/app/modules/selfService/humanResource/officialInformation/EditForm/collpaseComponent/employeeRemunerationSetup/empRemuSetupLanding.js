import React from "react";
import { _dateFormatter } from "./../../../../../../_helper/_dateFormate";
import ViewModalEmpRemuSetup from "./viewModal";

function EmpRemuSetupLanding({ landingData }) {
  const [show, setShow] = React.useState(false);
  const [employeeRemSetupId, setEmployeeRemSetupId] = React.useState(0);
  return (
    <>
      <table className="global-table w-100 table-bordered border-secondary">
        <thead>
          <tr>
            <th className="text-center">SL</th>
            <th className="text-center">Valid From</th>
            <th className="text-center">Valid To</th>
            <th className="text-center">Basic Salary</th>
            <th className="text-center">Net Payable</th>
            <th className="text-center">Gross Amount</th>
            <th className="text-center">Benefits & Allowance</th>
            <th className="text-center">Created Date </th>
            <th className="text-center">Created By </th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {landingData.length > 0 &&
            landingData.map((item, index) => {
              return (
                <>
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center">
                      {_dateFormatter(item?.startDate)}
                    </td>
                    <td className="text-center">
                      {_dateFormatter(item?.endDate)}
                    </td>
                    <td>
                      <div className="text-right pr-2">{item?.basicSalary}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{item?.netPayable}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{item?.grossAmount}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{item?.otherAllowance}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{ _dateFormatter(item?.createdTime)}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{item?.actionByName}</div>
                    </td>
                    <td
                      onClick={() => {
                        setShow(true);
                        setEmployeeRemSetupId(item?.employeeRemSetupId);
                      }}
                      className="text-center"
                    >
                      <i className={`fa pointer fa-eye`} aria-hidden="true"></i>
                    </td>
                  </tr>
                  <ViewModalEmpRemuSetup
                    show={show}
                    onHide={() => setShow(false)}
                    employeeRemSetupId={employeeRemSetupId}
                  />
                </>
              );
            })}
        </tbody>
      </table>
    </>
  );
}

export default EmpRemuSetupLanding;
