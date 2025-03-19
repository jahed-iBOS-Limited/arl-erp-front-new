import React from "react";
import IViewModal from "../../../../../_helper/_viewModal";

const TradeLicenceModal = ({ show, onHide, tradeLicenceImg }) => {
  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={"Trade Licence"}
        btnText="Close"
      >
        <img src={tradeLicenceImg ?? ""} alt="Trade Licence" />
      </IViewModal>
    </div>
  );
};

export default TradeLicenceModal;
