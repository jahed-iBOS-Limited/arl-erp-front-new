import React, { useEffect, useState } from "react";
import { GetTreasuryDepositLogAllDetails_api } from "../../helper";

import Loading from "./../../../../../_helper/_loading";
import moment from "moment";
import TresuaryDepositViewModal from "./../../../../transaction/tresuaryDeposit/View/viewForm";
function MultipleViewTreasuryDeposit({ parentRowClickData }) {
  const [loading, setLoading] = useState(false);
  const [viewData, setViewData] = useState([]);
  useEffect(() => {
    if (parentRowClickData?.treasuryId) {
      GetTreasuryDepositLogAllDetails_api(
        parentRowClickData?.treasuryId,
        setViewData,
        setLoading
      );
    }
  }, [parentRowClickData]);

  return (
    <div>
      {loading && <Loading />}
      {viewData?.map((itm) => (
        <>
          <div className="mt-8">
            <p className="p-0 m-0">
              <b>Activity</b>: {itm?.activity}{" "}
            </p>
            <p className="p-0 m-0">
              <b>Action Date/Time</b>:{" "}
              {moment(itm?.activityTime).format("DD-MMM-YY, LTS")}
            </p>
          </div>

          <div className="mt-1">
            <TresuaryDepositViewModal id={true} singleData={itm} />
          </div>
        </>
      ))}
    </div>
  );
}

export default MultipleViewTreasuryDeposit;
