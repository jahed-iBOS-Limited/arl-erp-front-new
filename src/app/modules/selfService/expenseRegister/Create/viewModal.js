import React from "react";

import IViewModal from "../../../_helper/_viewModal";

export default function ViewForm({ id, show, onHide, createSaveData, URL }) {
  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={"Attachment File View"}
        btnText="Close"
      >
        <div className="image-model">
          <img alt="" src={URL} style={{ width: "100%" }}></img>
        </div>
      </IViewModal>
    </div>
  );
}
