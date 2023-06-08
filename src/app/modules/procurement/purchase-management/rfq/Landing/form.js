/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ISelect } from '../../../../_helper/_inputDropDown'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import {
  getSbuDDLAction,
  getPurchaseOrgDDLAction,
  getWareHouseDDLAction,
  getPlantDDLAction,
} from '../../../../_helper/_redux/Actions'
import { getRfqGridData, setGridDataEmptyAction } from '../_redux/Actions'
import { useHistory } from 'react-router-dom'

// Validation schema
const validationSchema = Yup.object().shape({
  requestType: Yup.object().shape({
    label: Yup.string().required('Request type is required'),
    value: Yup.string().required('Request type is required'),
  }),
  sbu: Yup.object().shape({
    label: Yup.string().required('SBU is required'),
    value: Yup.string().required('SBU is required'),
  }),
  purchaseOrg: Yup.object().shape({
    label: Yup.string().required('Purchase organization is required'),
    value: Yup.string().required('Purchase organization is required'),
  }),
  plant: Yup.object().shape({
    label: Yup.string().required('Plant is required'),
    value: Yup.string().required('Plant is required'),
  }),
  wareHouse: Yup.object().shape({
    label: Yup.string().required('WareHouse is required'),
    value: Yup.string().required('WareHouse is required'),
  }),
})

const initData = {
  id: undefined,
  requestType: '',
  sbu: '',
  purchaseOrg: '',
  plant: '',
  wareHouse: '',
}

export default function HeaderForm({ setUsersDDLdata }) {
  let [datas, setData] = useState([])
  let [plantId, setPlantId] = useState('')

  let history = useHistory()

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  // sbu ddl
  const sbuDDL = useSelector((state) => {
    return state.commonDDL.sbuDDL
  }, shallowEqual)

  // purchaseOrg ddl
  const purchaseOrgDDL = useSelector((state) => {
    return state.commonDDL.purchaseOrgDDL
  }, shallowEqual)

  // wareHouse ddl
  const wareHouseDDL = useSelector((state) => {
    return state.commonDDL.wareHouseDDL
  }, shallowEqual)

  // plant ddl
  const plantDDL = useSelector((state) => {
    return state.commonDDL.plantDDL
  }, shallowEqual)

  let dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(setGridDataEmptyAction())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(getSbuDDLAction(profileData.accountId, selectedBusinessUnit.value))
    dispatch(
      getPurchaseOrgDDLAction(profileData.accountId, selectedBusinessUnit.value)
    )

    dispatch(
      getPlantDDLAction(profileData.userId, profileData.accountId,selectedBusinessUnit.value)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value])

  useEffect(() => {
    if (plantId) {
      dispatch(
        getWareHouseDDLAction(
          `accountId=${profileData.accountId}&businessUnitId=${selectedBusinessUnit.value}&PlantId=${plantId}`
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value, plantId])

  useEffect(() => {
    setData([
      {
        label: 'Request Type',
        name: 'requestType',
        options: [
          { value: 1, label: 'Request for quotation' },
          {
            value: 2,
            label: 'Request for Information',
          },
          { value: 3, label: 'Request for Proposal' },
        ],
      },
      {
        label: 'SBU',
        name: 'sbu',
        options: sbuDDL,
      },
      {
        label: 'Purchase Organization',
        name: 'purchaseOrg',
        options: purchaseOrgDDL,
      },
      {
        label: 'Plant',
        name: 'plant',
        options: plantDDL,
        dependencyFunc: setPlantId,
      },
      {
        label: 'Warehouse',
        name: 'wareHouse',
        options: wareHouseDDL,
        isDisabled: ['plant'],
      },
    ])
  }, [sbuDDL, purchaseOrgDDL, wareHouseDDL, plantDDL, plantId])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // saveHandler(values, () => {
          // });
          // resetForm(initData);
          setUsersDDLdata(values)
          dispatch(
            getRfqGridData(
              profileData.accountId,
              selectedBusinessUnit.value,
              values?.plant?.value,
              values?.wareHouse?.value,
              values?.sbu?.value,
              values?.purchaseOrg?.value,
              values?.requestType?.value
            )
          )
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div
                style={{ marginTop: '-70px', paddingBottom: '38px' }}
                className="text-right"
              >
                <button
                  disabled={
                    !values.wareHouse ||
                    !values.plant ||
                    !values.purchaseOrg ||
                    !values.sbu ||
                    !values.requestType
                  }
                  type="submit"
                  style={{ transform: 'translateY(24px)' }}
                  className="btn btn-primary"
                >
                  View
                </button>
                <button
                  disabled={
                    !values.wareHouse ||
                    !values.plant ||
                    !values.purchaseOrg ||
                    !values.sbu ||
                    !values.requestType
                  }
                  type="button"
                  style={{ transform: 'translateY(24px)' }}
                  className="btn btn-primary ml-3"
                  onClick={() => {
                    history.push({
                      pathname:
                        '/mngProcurement/purchase-management/rfq/add',
                      state: values,
                    })
                  }}
                >
                  Create
                </button>
              </div>
              <div className="form-group row global-form">
                {datas.map((data, index) => {
                  return (
                    <div key={index} className="col-lg-3">
                      <ISelect
                        label={data.label}
                        placeholder={data.label}
                        options={data?.options || []}
                        disabledFields={data.isDisabled || []}
                        defaultValue={values[data.name]}
                        values={values}
                        name={data.name}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        dependencyFunc={data.dependencyFunc}
                      />
                    </div>
                  )
                })}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  )
}
