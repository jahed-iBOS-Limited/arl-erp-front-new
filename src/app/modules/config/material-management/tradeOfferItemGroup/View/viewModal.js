/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getTradeItemGroupById } from "../_redux/Actions";

export default function ViewForm({ id, show, onHide }) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    if (id && selectedBusinessUnit.value && profileData.accountId) {
      dispatch(getTradeItemGroupById(id));
    }
  }, [selectedBusinessUnit, profileData, id]);

  // get single data from store
  const singleData = useSelector((state) => {
    return state?.tradeOfferItemGroup?.singleData;
  }, shallowEqual);

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={singleData?.objHeaderDTO?.tradeOfferItemGroupName || ""}
        isShow={singleData && false}
      >
        {singleData ? (
          <div className="mt-3">
            {singleData?.objListRowDTO?.length ? (
             <div className="table-responsive">
               <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Group Name</th>
                    <th>#Of Items</th>
                  </tr>
                </thead>
                <tbody>
                  {singleData?.objListRowDTO?.map((itm, idx) => (
                    <tr key={itm?.itemId}>
                      <td>
                        {singleData?.objHeaderDTO?.tradeOfferItemGroupName}
                      </td>
                      <td>{itm?.itemName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
            ) : (
              <h5>No data found</h5>
            )}
          </div>
        ) : (
          <h5>Loading.....</h5>
        )}
      </IViewModal>
    </div>
  );
}
