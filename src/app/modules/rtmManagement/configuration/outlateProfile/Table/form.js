import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import NewSelect from '../../../../_helper/_select'
import InputField from '../../../../_helper/_inputField'
import { getVatBranches } from '../helper'
import { _todayDate } from '../../../../_helper/_todayDate'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { shallowEqual } from 'react-redux'

const initData = {
  taxBranch: {},
  fromDate: _todayDate(),
  toDate: _todayDate(),
}

export function SearchForm({ onSubmit }) {
  const [taxBranchDDL, setTaxBranchDDL] = useState([])
  const history = useHistory()

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    }
  }, shallowEqual)

  const { profileData, selectedBusinessUnit } = storeData

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit?.value) {
      getVatBranches(
        profileData.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      )
    }
  }, [profileData, selectedBusinessUnit])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, taxBranch: taxBranchDDL[0] }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit(values)
        }}
      >
        {({
          errors,
          touched,
          setFieldValue,
          isValid,
          values,
          handleSubmit,
        }) => (
          <Form>
            <div
              className="text-right"
              style={{
                paddingBottom: '19px',
                marginTop: '-41px',
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                // ref={btnRef}
                onClick={() =>
                  history.push({
                    pathname: '/mngVat/purchase/6.4/create',
                    state: { taxBranch: values.taxBranch },
                  })
                }
              >
                Create
              </button>
            </div>
            <div className="row">
              <div className="col-lg-3">
                <NewSelect
                  name="taxBranch"
                  options={taxBranchDDL}
                  value={values?.taxBranch}
                  label="Select Branch"
                  onChange={(valueOption) => {
                    setFieldValue('taxBranch', valueOption)
                  }}
                  placeholder=" Branch"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values?.fromDate}
                  label="From Date"
                  // disabled={id ? true : false}
                  type="date"
                  name="fromDate"
                  placeholder="From Date"
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values?.toDate}
                  label="To Date"
                  // disabled={id ? true : false}
                  type="date"
                  name="toDate"
                  placeholder="To Date"
                />
              </div>

              <div className="col-lg-3">
                <button
                  type="submit"
                  class="btn btn-primary"
                  style={{ marginTop: '16px' }}
                  // ref={btnRef}
                  onSubmit={() => handleSubmit()}
                >
                  View
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}
