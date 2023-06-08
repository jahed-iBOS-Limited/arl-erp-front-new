import React from "react";
import IViewModal from "../../../../_helper/_viewModal";
import DeliveryReportTable from "./Table/table";

export default function ViewForm({ id, show, onHide }) {
  return (
    <div>
      <IViewModal show={show} onHide={onHide}>
        <DeliveryReportTable id={id} />
      </IViewModal>
    </div>
  );
}
