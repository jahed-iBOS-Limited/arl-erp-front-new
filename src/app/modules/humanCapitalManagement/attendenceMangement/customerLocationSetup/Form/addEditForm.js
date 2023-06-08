import React, { useState } from 'react'
import '../style.css'
import Form from './form'
import { useSelector } from 'react-redux'
import { shallowEqual } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { creatPartnerLocationRegister_api } from '../helper'

const initData = {
  id: undefined,
}
export default function CustomerLocaitonAttendanceingForm() {
  const { state } = useLocation()
  const [mapData, setMapData] = useState({ latitude: '', longitude: '' })
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    }
  }, shallowEqual)

  const { profileData, selectedBusinessUnit } = storeData

  const saveHandler = async (values, cb) => {
    const payload = {
      accountId: profileData.accountId,
      businessUnitId: selectedBusinessUnit.value,
      businessPartnerId: state?.partnerId,
      businessPartnerCode: state?.partnerCode,
      numLatitude: mapData?.latitude,
      numLongitude: mapData?.longitude,
      actionBy: profileData?.userId,
    }
    creatPartnerLocationRegister_api(payload)
  }

  return (
    <Form
      initData={initData}
      saveHandler={saveHandler}
      profileData={profileData}
      selectedBusinessUnit={selectedBusinessUnit}
      state={state}
      setMapData={setMapData}
      mapData={mapData}
    />
  )
}
