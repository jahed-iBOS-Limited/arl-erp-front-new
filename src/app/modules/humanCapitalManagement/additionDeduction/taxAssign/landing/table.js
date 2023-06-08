import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ICustomCard from "../../../../_helper/_customCard";
import ICustomTable from "../../../../_helper/_customTable";
import { getTaxLandingAction } from "../helper.js";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";

const TaxAssignLanding = () => {
  const history = useHistory();

  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTaxLandingAction(selectedBusinessUnit?.value, setRowDto, setLoading);
  }, [selectedBusinessUnit]);

  return (
    <>
      {loading && <Loading />}
      <ICustomCard
        title="TAX Report"
        createHandler={() => {
          history.push(
            "/human-capital-management/additionanddeduction/TAXAmountAssign/create"
          );
        }}
      >
        <ICustomTable
          ths={[
            "SL",
            "Employee Id",
            "Employee",
            "Position",
            "Designation",
            "Department",
            "Workplace Group",
            "Amount",
          ]}
        >
          {rowDto.length > 0 &&
            rowDto.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td className="text-center">{item?.intEmployeeId}</td>
                <td>{item?.strEmployeeFullName}</td>
                <td>{item?.strPositionName}</td>
                <td>{item?.strDesignationName}</td>
                <td>{item?.strDepartmentName}</td>
                <td>{item?.strWorkplaceGroupName}</td>
                <td className="text-right">
                  {(item?.numAmount || 0).toFixed(2)}
                </td>
              </tr>
            ))}
        </ICustomTable>
      </ICustomCard>
    </>
  );
};

export default TaxAssignLanding;
