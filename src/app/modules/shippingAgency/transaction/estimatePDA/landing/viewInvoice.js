import React, { useEffect } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { getEstimatePDAById } from "../helper";
import Loading from "../../../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";

function ViewInvoice({ viewClickRowItem }) {
  const [loading, setLoading] = React.useState(false);
  const [singleData, setSingleData] = React.useState({});
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  useEffect(() => {
    if (viewClickRowItem?.estimatePdaid) {
      getEstimatePDAById(
        viewClickRowItem?.estimatePdaid,
        setLoading,
        (resData) => {
          setSingleData(resData);
        }
      );
    }
  }, [viewClickRowItem]);

  return (
    <>
      {loading && <Loading />}
      <ICustomCard title='Estimate PDA View'>
        <div>
          <div className='topBar'>
            <h1>{selectedBusinessUnit?.label}</h1>
            <h6>Final Port Disbursement Account</h6>
          </div>
        </div>
      </ICustomCard>
    </>
  );
}

export default ViewInvoice;
