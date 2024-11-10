import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import IViewModal from "../../../../_helper/_viewModal";
import { setTargetEmptyAction } from "../_redux/Actions";
import Form from "./mainForm";
export default function ViewModal({ id, show, onHide }) {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setTargetEmptyAction());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <IViewModal
        isShow={false}
        show={show}
        onHide={onHide}
        title="CORPORATE KPI RESULT"
        dialogClassName="kpi-achievement-modal"
      >
        <Form />
      </IViewModal>
    </>
  );
}
