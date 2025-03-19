/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Form from './form'
import {
  saveCanceInvRequest
} from '../helper'
import IForm from '../../../../_helper/_form'
import { _todayDate } from '../../../../_helper/_todayDate'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../../../../_helper/_loading'

const initData = {
  transType: "",
  refNo: "",
  reftype: ''
}

export default function CancelInventoryForm({
  history,
  match: {
    params: { id },
  },
}) {
  const location = useLocation()

  const [isDisabled, setDisabled] = useState(false)

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  const [rowDto,setRowDto] = useState("")

  

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
        let payload = {
           accId : profileData?.accountId,
           buId: selectedBusinessUnit?.value,
           code: values?.refNo
        }
        saveCanceInvRequest(payload, cb, setDisabled)    
    } else {

    }
  }
  const [objProps, setObjprops] = useState({})


  return (
    <div className="itemRequest">
      <IForm
        title="Create Cancel Inventory Transaction"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          isEdit={id || false}
          id={id}
          location={location}
          rowDto={rowDto}
          setRowDto={setRowDto}
        />
      </IForm>
    </div>
  )
}
