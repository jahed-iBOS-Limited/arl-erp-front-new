import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Form from './form'

import IForm from '../../../../_helper/_form'
import Loading from './../../../../_helper/_loading'
import { CreateBankBranch_api } from '../helper'

const initData = {
  id: undefined,
  bankDDL: '',
  branchName: '',
  branchCode: '',
  routingNo: '',
  branchAddress: '',
}

export default function BankBranchForm() {
  const [isDisabled, setDisabled] = useState(false)
  const [objProps, setObjprops] = useState({})
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData])

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        bankBranchCode: values?.branchCode,
        bankBranchName: values?.branchName?.toUpperCase(),
        bankBranchAddress: values?.branchAddress?.label?.toUpperCase(),
        bankId: values?.bankDDL?.value,
        bankName: values?.bankDDL?.name,
        bankShortName: values?.bankDDL?.bankShortName,
        bankCode: values?.bankDDL?.code,
        actionBy: profileData?.userId,
        routingNo: values?.routingNo,
      }
      CreateBankBranch_api({ data: payload, cb, setDisabled })
    } else {
      console.log(values)
    }
  }

  return (
    <IForm
      title="Create Bank Branch"
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
      />
    </IForm>
  )
}
