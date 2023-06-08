import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import GridData from './grid'
import { useSelector } from 'react-redux'
import { shallowEqual } from 'react-redux'
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../../_metronic/_partials/controls'
import Loading from '../../../../_helper/_loading'
import { businessPartner_api } from '../helper'
import { businessPartnerLocation_api } from './../helper'
import NewSelect from './../../../../_helper/_select'

const initData = {
  id: undefined,
  pusinessPartner: '',
}

export default function HeaderForm({ createHandler }) {
  const [gridData, setGirdData] = useState([])
  const [loading, setLoading] = useState(false)
  const [businessPartnerDDL, setBusinessPartnerDDL] = useState([])
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    }
  }, shallowEqual)

  const { profileData, selectedBusinessUnit } = storeData
  useEffect(() => {
    if (profileData?.userId) {
      businessPartner_api(profileData?.userId, setBusinessPartnerDDL)
    }
  }, [profileData])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={'Customer Location Setup'}>
                <CardHeaderToolbar>
                  {/* <button onClick={createHandler} className="btn btn-primary">
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <Form className="form form-label-right">
                  <div className="row global-form">
                    {/* <div className="col-lg-3">
                      <label>Business Partner</label>
                      <SearchAsyncSelect
                        selectedValue={values?.pusinessPartner}
                        handleChange={(valueOption) => {
                          setFieldValue('pusinessPartner', valueOption)
                        }}
                        loadOptions={loadUserList}
                      />
                      <FormikError
                        errors={errors}
                        name="pusinessPartner"
                        touched={touched}
                      />
                    </div> */}
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
                    <div className="col-lg-3">
                      <button
                        onClick={() => {
                          // onClickHandler(values)
                          businessPartnerLocation_api(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.pusinessPartner?.value,
                            setGirdData,
                            setLoading
                          )
                        }}
                        className="btn btn-primary mt-5"
                      >
                        Show
                      </button>
                    </div>
                  </div>
                  <GridData rowDto={gridData} values={values} />
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  )
}
