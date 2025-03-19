import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { GetPreviledgeSchemeById_api } from "./../helper";
import Loading from './../../../../_helper/_loading';
function CustomerPrivilegeSchemeView({ rowClickData }) {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      rowClickData?.customersPrivilegeSchemeId
    ) {
      GetPreviledgeSchemeById_api(
        rowClickData?.customersPrivilegeSchemeId,
        setRowDto,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);
  return (
    <>
    { loading && <Loading />}
      <Form rowDto={rowDto}/>
    </>
  );
}

export default CustomerPrivilegeSchemeView;
