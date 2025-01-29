import React, { useEffect, useState } from "react";
import Form from "./form";
import { GetItemGroupById_api } from "../helper";
import Loading from "./../../../../_helper/_loading";

function ItemGroupForPrivilegeView({ rowClickData }) {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (rowClickData?.id) {
      GetItemGroupById_api(rowClickData?.id, setRowDto, setLoading);
    }
  }, [rowClickData]);
  return (
    <div>
      {loading && <Loading />}
      <Form rowDto={rowDto} />
    </div>
  );
}

export default ItemGroupForPrivilegeView;
