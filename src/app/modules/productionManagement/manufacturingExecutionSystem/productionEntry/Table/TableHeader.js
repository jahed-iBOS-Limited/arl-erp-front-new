import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import { GetMESConfigurationBusinessUnitWiseByAccountId } from "../helper";
import { TableRow } from "./TableRow";
import { shallowEqual, useSelector } from "react-redux";

export default function ProductionEntryTable() {
  const history = useHistory();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [data, setData] = useState({})

  useEffect(() => {
    GetMESConfigurationBusinessUnitWiseByAccountId(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setData
    );
  }, [profileData, selectedBusinessUnit]);
  const location = {
    pathname: "/production-management/mes/productionentry/create",
    state: {
      data: data,
    },
  };
  return (
    <ICustomCard
      renderProps={() => (
        <button
          className="btn btn-primary"
          onClick={() => history.push(location)}
        >
          Create New
        </button>
      )}
      title="Production Entry Basic Information"
    >
      <TableRow dataForBackCalculationCheck={data}></TableRow>
    </ICustomCard>
  );
}
