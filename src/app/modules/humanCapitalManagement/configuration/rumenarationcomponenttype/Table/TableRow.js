import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { getHRRumenarationComponentTypePagination} from "../helper";


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
    getHRRumenarationComponentTypePagination(
        profileData?.accountId,
        setRowData
      );
  }, [profileData.accountId]);

  const headers = [
    "SL",
    "Component Type",
    "Code",
    "Action"
    
  ];

  const Table = () => {
   return rowData.map((item) => {
      return (
        <tr>
          <td>{item.sl}</td>
          
          <td>{item.remunerationComponentType}</td>
          <td>{item.remunerationComponentTypeCode}</td>
          <td
            style={{ textAlign: "center" }}
            onClick={() =>
              history.push(
                `/human-capital-management/hcmconfig/hrrumenarationcmptype/edit/${item.remunerationComponentTypeId}`
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
