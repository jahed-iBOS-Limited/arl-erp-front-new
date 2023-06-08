import React, { useState } from 'react'
import Form from './form'
import { useSelector } from 'react-redux'
import { shallowEqual } from 'react-redux'
import { remoteAttendance_api } from '../helper'
import { _todayDate } from './../../../../_helper/_todayDate'
import { toast } from 'react-toastify'

const initData = {
  id: undefined,
  pusinessPartner: '',
}
export default function RemoteAttendanceingForm() {
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
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (
        values?.pusinessPartner?.latitude &&
        values?.pusinessPartner?.longitude
      ) {
        const payload = {
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          intBusinessPartnerId: values?.pusinessPartner?.value,
          strBusinessPartnerCode: values?.pusinessPartner?.code,
          numPartnerLatitude: values?.pusinessPartner?.latitude,
          numPartnerLongitude: values?.pusinessPartner?.longitude,
          intEmployeeId: profileData?.userId,
          numAttendanceLatitude: mapData?.latitude,
          dtAttendanceDate: _todayDate(),
          numAttendanceLongitude: mapData?.longitude,
          intActionBy: profileData?.userId,
        }
        remoteAttendance_api(payload)
      } else {
        toast.error('Error! Customer location is not registered.')
      }
    } else {
      console.log(values)
    }
  }

  return (
    <Form
      initData={initData}
      saveHandler={saveHandler}
      profileData={profileData}
      selectedBusinessUnit={selectedBusinessUnit}
      setMapData={setMapData}
      mapData={mapData}
    />
  )
}
