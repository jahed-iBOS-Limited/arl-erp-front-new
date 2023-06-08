import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import IViewModal from "../../../_helper/_viewModal";
import ICustomTable from "../../../_helper/_customTable";
import { getCoreValuesById, setCoreValuesEmpty } from "../_redux/Actions";

let ths = ["SL", "Demonstrated behaviour", "Type"];

export default function ViewForm({ id, show, onHide }) {
  const storeData = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      singleData: state.coreValuesTwo?.singleData,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit, singleData } = storeData;

  const dispatch = useDispatch();

  useEffect(() => {
    if (id && selectedBusinessUnit.value && profileData.accountId) {
      dispatch(getCoreValuesById(id));
    }
    return () => {
      dispatch(setCoreValuesEmpty());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, id]);

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={singleData?.objHeader?.coreValueName || "Modal"}
        isShow={singleData ? false : true}
      >
        {/* Modal Header */}
        <p className="my-1 mt-6 mb-6" style={{ fontSize: "1.35rem" }}>
          <b>Core value definition :</b>{" "}
          {singleData?.objHeader?.coreValueDefinition}
        </p>
        <ICustomTable ths={ths}>
          {singleData?.objListRow?.map((itm, index) => {
            return (
              <tr key={index}>
                <td className="align-middle text-center"> {index + 1} </td>
                <td> {itm?.demonstratedBehaviour} </td>
                <td> {itm?.isPositive ? "Positive" : "Negative"} </td>
              </tr>
            );
          })}
        </ICustomTable>
      </IViewModal>
    </div>
  );
}
