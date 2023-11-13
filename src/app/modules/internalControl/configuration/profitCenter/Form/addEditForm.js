/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import IForm from '../../../../_helper/_form'
import { getControllingUnitDDLAction } from '../../../../_helper/_redux/Actions'
import {
  getEmpDDLAction,
  getGroupNameDDLAction,
  getProfitCenterById,
  saveEditedProfitCenter,
  saveProfitCenter,
  setProfitCenterSingleEmpty,
} from '../_redux/Actions'
import Loading from './../../../../_helper/_loading'
import Form from './form'

const initData = {
  id: undefined,
  cuid: undefined,
  controllingUnitCode: '',
  controllingUnitName: '',
  responsiblePerson: '',
  controllingUnit: '',
  groupName: '',
}

export default function ProfitCenterForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false)
  const [responsiblePerson, setResponsiblePerson] = useState('')
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  // get emplist ddl from store
  const empDDL = useSelector((state) => {
    return state?.profitCenter?.empDDL
  }, shallowEqual)

  // get cuDDL ddl from store
  const cuDDL = useSelector((state) => {
    return state?.commonDDL?.controllingDDL
  }, shallowEqual)

  const groupNameDDL = useSelector((state) => {
    return state?.profitCenter?.groupNameDDL
  }, shallowEqual)


  // get single profitCenter from store
  const singleData = useSelector((state) => {
    return state.profitCenter?.singleData
  }, shallowEqual)

  const dispatch = useDispatch()
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getProfitCenterById(id))
    } else {
      dispatch(setProfitCenterSingleEmpty())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getEmpDDLAction(profileData.accountId, selectedBusinessUnit.value)
      )
      dispatch(
        getControllingUnitDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData])

  const saveHandler = async (values, cb) => {
    setDisabled(true)
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          profitCenterId: values.profitCenterId,
          profitCenterGroupId: values?.groupName?.value,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          controllingUnitId: values?.controllingUnit?.value,
          responsiblePersonId: values?.responsiblePerson?.value || 0,
          actionBy: profileData.userId,
        }
        dispatch(saveEditedProfitCenter(payload, setDisabled))
      } else {
        const payload = {
          profitCenterName: values.profitCenterName,
          profitCenterCode: values.profitCenterCode,
          profitCenterGroupId: values?.groupName?.value,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          controllingUnitId: values?.controllingUnit?.value,
          responsiblePersonId: values?.responsiblePerson?.value || 0,
          actionBy: profileData.userId,
        }
        dispatch(saveProfitCenter({ data: payload, cb, setDisabled }))
      }
    } else {
      setDisabled(false)
      console.log(values)
    }
  }

  const groupDDLDispatch = (payload) => {
    dispatch(
      getGroupNameDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        payload
      )
    )
  }
  const [objProps, setObjprops] = useState({})

  return (
    <IForm
      title="Create Profit Center"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        empDDL={empDDL}
        cuDDL={cuDDL}
        groupNameDDL={groupNameDDL}
        isEdit={id || false}
        groupDDLDispatch={groupDDLDispatch}
        setResponsiblePerson={setResponsiblePerson}
        responsiblePerson={responsiblePerson}
      />
    </IForm>
  )
}
