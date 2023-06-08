import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { getHRRumenarationTypePagination } from "../helper";


export function TableRow() {
  const history = useHistory();

  const [rowData, setRowData] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  console.log(profileData);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  console.log(selectedBusinessUnit);

  useEffect(() => {
    if ((profileData?.accountId))
    getHRRumenarationTypePagination(
        profileData?.accountId,
        setRowData
      );
  }, [profileData.accountId]);

  const headers = [
    "SL",
    "Remuneration Type",
    "Paid By",
    "Action"
  ];

  // get controlling unit list  from store

  // UI Context
  const Table = () => {
    console.log(rowData);
    return rowData.map((item) => {
      return (
        <tr>
          <td>{item.sl}</td>
          
          <td>{item.remunerationType}</td>
          <td>{item.monthlyPaid ? "Monthly": "Daily"}</td>
          <td
            style={{ textAlign: "center" }}
            onClick={() =>
              history.push(
                `/human-capital-management/hcmconfig/hrrumenarationtype/edit/${item.remunerationTypeId}`
              )
            }
          >
            <IEdit />
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <ICustomTable ths={headers}>
        <Table />
      </ICustomTable>
    </>
  );
}
