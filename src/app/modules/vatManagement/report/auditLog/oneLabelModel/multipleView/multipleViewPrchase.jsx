import React, { useEffect, useState } from "react";
import { GetPurchaseLogAllDetails_api } from "../../helper";
import FormView from "../../../../operation/purchase/parchase/view/form";
import moment from "moment";
import { useSelector, shallowEqual } from "react-redux";
import Loading from './../../../../../_helper/_loading';
function MultipleViewPrchase({ parentRowClickData }) {
  const [purchaseLogAllDetails, setPurchaseLogAllDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (parentRowClickData?.taxPurchaseId) {
      GetPurchaseLogAllDetails_api(
        parentRowClickData?.taxPurchaseId,
        setPurchaseLogAllDetails,
        setLoading
      );
    }
  }, [parentRowClickData]);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  return (
    <div>
      {loading && <Loading />}
      {purchaseLogAllDetails?.map((itm) => (
        <>
          <div className="mt-8">
            <p className="p-0 m-0">
              <b>Activity</b>: {itm?.auditLog?.activity}{" "}
            </p>
            <p className="p-0 m-0">
              <b>Action Date/Time</b>:{" "}
              {moment(itm?.auditLog?.activityTime).format("DD-MMM-YY, LTS")}
            </p>
          </div>

          <div className="mt-1">
            <FormView
              isEdit={true}
              initData={itm?.objHeaderDTO}
              rowDto={itm?.objListRowDTO}
              profileData={profileData}
              selectedBusinessUnit={selectedBusinessUnit}
            />
          </div>
        </>
      ))}
    </div>
  );
}

export default MultipleViewPrchase;
