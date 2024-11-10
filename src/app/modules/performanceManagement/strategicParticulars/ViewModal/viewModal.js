import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ICustomTable from "../../../_helper/_customTable";
import IViewModal from "../../../_helper/_viewModal";
import { getStrObjListAction } from "../_redux/Actions";

export default function ViewModal({ show, onHide, history }) {
  const dispatch = useDispatch();
  const params = useParams();
  const { strId, strTypeId } = params;

  const data = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        strObjList: state.strategicParticularsTwo.strObjList,
      };
    },
    { shallowEqual }
  );

  const { profileData, selectedBusinessUnit, strObjList } = data;

  useEffect(() => {
    dispatch(getStrObjListAction(strTypeId, strId));
  }, [strTypeId, strId]);

  return (
    <div className="viewModal">
      <IViewModal title="VIEW" show={show} onHide={onHide}>
        {strObjList.length > 0 && (
          <ICustomTable ths={["SL", "Strategic Particulars Name"]}>
            {strObjList?.map((itm, index) => (
              <tr key={index}>
                <td className="text-center"> {index + 1} </td>
                <td>
                  <span className="pl-3">{itm.strategicParticularName}</span>
                </td>
              </tr>
            ))}
          </ICustomTable>
        )}
      </IViewModal>
    </div>
  );
}
