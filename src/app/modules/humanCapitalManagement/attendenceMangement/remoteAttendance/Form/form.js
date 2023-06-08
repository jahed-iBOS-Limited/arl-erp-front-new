import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import RemoteAttendanceMap from './../map'
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from './../../../../../../_metronic/_partials/controls'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { shallowEqual } from 'react-redux'
import NewSelect from './../../../../_helper/_select'
import { businessPartner_api } from '../helper'
// Validation schema
const validationSchema = Yup.object().shape({})

export default function _Form({
  initData,
  saveHandler,
  edit,
  isDisabled,
  setMapData,
  mapData,
}) {
  const [businessPartnerDDL, setBusinessPartnerDDL] = useState([])
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    }
  }, shallowEqual)

  const { profileData } = storeData
  const history = useHistory()
  const handleRefresh = () => {
    window.location.reload()
  }
  const backHandler = () => {
    history.goBack()
  }
  useEffect(() => {
    if (profileData?.userId) {
      businessPartner_api(profileData?.userId, setBusinessPartnerDDL)
    }
  }, [profileData])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData)
          })
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
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={'Create Remote Attendance'}>
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={backHandler}
                    className={'btn btn-light'}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled={isDisabled}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody className="">
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="pusinessPartner"
                        options={businessPartnerDDL || []}
                        value={values?.pusinessPartner}
                        label="Business Partner"
                        onChange={(valueOption) => {
                          setFieldValue('pusinessPartner', valueOption)
                        }}
                        placeholder="Business Partner"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="mt-5 d-flex justify-content-between">
                    <h5 className="">Name: {profileData?.userName}</h5>
                    <button
                      onClick={handleRefresh}
                      className="btn btn-primary ml-2"
                      type="button"
                      disabled={isDisabled}
                    >
                      Location Refresh
                    </button>
                  </div>

                  <RemoteAttendanceMap
                    setMapData={setMapData}
                    mapData={mapData}
                  />
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  )
}
