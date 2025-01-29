import React from 'react'
import { ITable } from '../../../../_helper/_table'
import { LandingTableRow } from './tableRow'

function GeneralInformation() {
  return (
    <ITable
    link="/vessel-management/allotment/generalinformation/Create"
    title="General Information"
  >
   <LandingTableRow/>
  </ITable>
  )
}

export default GeneralInformation