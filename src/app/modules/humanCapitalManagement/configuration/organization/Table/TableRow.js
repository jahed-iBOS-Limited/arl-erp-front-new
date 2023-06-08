import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { getOrganizationComponent } from "../helper";

export function TableRow() {
  const history = useHistory();

  const [rowData, setRowData] = useState([{
    sl:1,
    organizationcomponent:'akij cement',
    organizationcomponent_code:1
  }]);

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
    if ((profileData?.accountId && selectedBusinessUnit?.value))
    getOrganizationComponent(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setRowData
      );
  }, [profileData.accountId, selectedBusinessUnit]);

  useEffect(()=>{
    getOrganizationComponent(setRowData);
  },[])

  const headers = [
    "SL",
    "Organization Component",
    "Organization Component Code",
    "Action",
  ];

  // get controlling unit list  from store

  // UI Context
  const  Table = () => {
    
    return rowData.map((item) => {
      return (
        <tr>
          <td>{item.sl}</td>
          
          <td>{item.orgComponentName}</td>
          <td>{item.orgComponentCode}</td>
          <td
            style={{ textAlign: "center" }}
            onClick={() =>
              history.push(
                `/human-capital-management/hcmconfig/organizationcomponent/edit/${item.orgComponentId}`
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
