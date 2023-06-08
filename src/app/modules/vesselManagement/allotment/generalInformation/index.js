import React from 'react'
import { UiProvider } from '../../../_helper/uiContextHelper'
import GeneralInformation from './landingPage/tableHeader'

function GeneralLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/vessel-management/allotment/generalinformation/edit/${id}`)
    },
    openViewDialog: (id) =>{
      history.push(`/vessel-management/allotment/generalinformation/view/${id}`);
    }
  }

  return (
    <UiProvider uIEvents={uIEvents}>
    <GeneralInformation/>
    </UiProvider>
  )
}
export default GeneralLanding