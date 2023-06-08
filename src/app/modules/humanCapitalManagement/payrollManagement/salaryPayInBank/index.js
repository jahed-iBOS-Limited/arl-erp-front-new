import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../_metronic/_partials/controls/Card";
import Loading from "./../../../_helper/_loading";
import { getPayInBankLandingAction } from "./helper";

export default function SalaryPayInBank() {
  const history = useHistory();
  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getPayInBankLandingAction(
      selectedBusinessUnit?.value,
      setGridData,
      setIsLoading
    );
  }, [selectedBusinessUnit]);

  return (
    <>
      <Card>
        <CardHeader title="Salary Pay In Bank">
          <CardHeaderToolbar>
            <button
              onClick={() =>
                history.push(
                  "/human-capital-management/payrollmanagement/SalaryPayInBank/create"
                )
              }
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {isloading && <Loading />}
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>Employee Id</th>
                <th>Employee</th>
                <th>Position</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Workplace Group</th>
                <th>Pay In Amount</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.length > 0 &&
                gridData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ width: "30px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td className="text-center">{item?.intEmployeeId}</td>
                      <td>{item?.strEmployeeFullName}</td>
                      <td>{item?.strPositionName}</td>
                      <td>{item?.strDesignationName}</td>
                      <td>{item?.strDepartmentName}</td>
                      <td>{item?.strWorkplaceGroupName}</td>
                      <td className="text-right">
                        {(item?.numPayInBank || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
  );
}
