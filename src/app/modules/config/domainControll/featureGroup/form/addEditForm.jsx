/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Form from './form'
import { useSelector, shallowEqual } from 'react-redux'
import { useParams } from 'react-router-dom'
import Loading from '../../../../_helper/_loading'
import IForm from './../../../../_helper/_form'
import { toast } from 'react-toastify'
import {
  getModuleNameDDL,
  getModuleFeature,
  createFeatureGroup,
  editFeatureGroup,
  getSingleData,
} from '../helper'

const initData = {
  featureGroupName: '',
  module: '',
  feature: '',
}

const FutureGroupForm = () => {
  const { id, mId } = useParams()
  const [isDisabled, setDisabled] = useState(false)
  const [singleData, setSingleData] = useState('')
  const [rowData, setRowData] = useState([])
  // All Select Button Handler
  const [allSelect, setAllSelect] = useState(false)
  const [allActivities, setAllActivities] = useState(false)

  // All DDL
  const [moduleNameDDL, setModuleNameDDL] = useState([])
  const [featureDDL, setFeatureDDL] = useState([])

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  // Fetch All DDL
  useEffect(() => {
    getModuleNameDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setModuleNameDDL,
      setDisabled
    )
  }, [profileData?.accountId && selectedBusinessUnit?.value])

  // Get Single Data By Id
  useEffect(() => {
    if (id && mId) {
      getSingleData(id, mId, setDisabled, setSingleData, setRowData)
      getModuleFeature(mId, setFeatureDDL, false, setDisabled)
    }
  }, [id, mId])

  // Save Handler
  const saveHandler = (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      let checkAtLeastOneActivity = rowData?.filter(
        (item) =>
          item?.isCreate || item?.isEdit || item?.isView || item?.isClose
      )

      let checkAtLeastOneSelect = rowData?.filter((item) => item?.isSelect)

      if (
        rowData.length > 0 &&
        checkAtLeastOneActivity.length > 0 &&
        checkAtLeastOneSelect.length > 0
      ) {
        let filterIsSelect = rowData?.filter((item) => item?.isSelect)
        let newRowData = filterIsSelect?.map((item) => {
          return {
            ...item,
            isActive: true,
          }
        })
        let foundFilterSelectedOneActivityCheck = newRowData?.filter((item) => {
          return (
            !item?.isCreate && !item?.isEdit && !item?.isView && !item?.isClose
          )
        })
        if (foundFilterSelectedOneActivityCheck.length === 0) {
          // Create
          if (!id) {
            let payload = {
              objheader: {
                moduleId: values?.module?.value,
                featureGroupName: values?.featureGroupName,
                accountId: profileData?.accountId,
                intActionBy: profileData?.userId,
                isActive: true,
              },
              objRow: newRowData,
            }
            createFeatureGroup(payload, setDisabled, cb)
          }
          // Edit
          else {
            let payload = {
              objheader: {
                featureGroupId: +id,
              },
              objRow: newRowData,
            }
            editFeatureGroup(payload, setDisabled)
          }
        } else {
          toast.warning('Please select atleast one activity', {
            toastId: 'Psaoa',
          })
        }
      } else {
        toast.warning('Please select atleast one activity', {
          toastId: 'Psaoa2',
        })
      }
    }
  }

  const [objProps, setObjprops] = useState({})

  return (
    <>
      <IForm
        title={!id ? 'Create Feature Group' : 'Edit Feature Group'}
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
          // All DDL
          moduleNameDDL={moduleNameDDL}
          featureDDL={featureDDL}
          // Other
          rowData={rowData}
          setRowData={setRowData}
          isEdit={id}
          setDisabled={setDisabled}
          allSelect={allSelect}
          setAllSelect={setAllSelect}
          allActivities={allActivities}
          setAllActivities={setAllActivities}
        />
      </IForm>
    </>
  )
}

export default FutureGroupForm
