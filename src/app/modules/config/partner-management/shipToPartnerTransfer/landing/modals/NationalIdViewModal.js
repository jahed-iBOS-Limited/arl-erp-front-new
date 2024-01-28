import React from 'react'
import IViewModal from '../../../../../_helper/_viewModal'

const NationalIdViewModal = ({show, onHide, nationalIdImg}) => {
  return (
    <div>
        <IViewModal
        show={show}
        onHide={onHide}
        title={"National ID"}
        btnText="Close"
      >
       <img
          src={nationalIdImg ?? ""}
          alt="National Id"
        />
      </IViewModal>
    </div>
  )
}

export default NationalIdViewModal