import React from 'react'
import { ITableTwo } from '../../../_helper/_tableTwo'
import HeaderForm from './landing/form'


export default function MRRCancel() {
  return (
    <div className="purchase-order">
      <ITableTwo
        renderProps={() => <HeaderForm />}
        title="MRR Cancel"
        viewLink=""
        isHidden={true}
      ></ITableTwo>
    </div>
  )
}