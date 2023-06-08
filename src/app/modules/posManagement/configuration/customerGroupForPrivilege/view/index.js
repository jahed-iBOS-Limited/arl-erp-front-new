import React, { useEffect, useState } from "react";
import Form from "./form";
import Loading from "./../../../../_helper/_loading";
import { getCustomerGroupById } from "../helper";

function CustomerGroupForPrivilegeView({ rowClickData }) {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rowClickData?.customerGroupId) {
      getCustomerGroupById(rowClickData?.customerGroupId, setRowDto, setLoading);
    }
  }, [rowClickData]);
  
  return (
    <div>
      {loading && <Loading />}
      <Form rowDto={rowDto} />
    </div>
  );
}

export default CustomerGroupForPrivilegeView;
