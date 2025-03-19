import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import InputField from './../../../../_helper/_inputField'
import { useSelector } from 'react-redux'
import GridData from './grid'
import { shallowEqual } from 'react-redux'

import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from './../../../../../../_metronic/_partials/controls'

import NewSelect from './../../../../_helper/_select'
import {
  GetItemTypeDDL_api,
  GetItemNameDDL_api,
  getVatBranches_api,
  SalesRegister_Report_api,
} from '../helper'
import { _todayDate } from './../../../../_helper/_todayDate'
import { getHeaderData_api } from './../../purchaseReg/helper';

// Validation schema
const validationSchema = Yup.object().shape({})

const initData = {
  id: undefined,
  fromDate: _todayDate(),
  toDate: _todayDate(),
  itemType: '',
  branch: '',
  itemName: '',
}

export default function HeaderForm() {
  const [rowDto, setRowDto] = useState([])
  const [loading, ] = useState(false)
  const [itemName, setItemName] = useState([])
  const [, setOrdertableRow] = React.useState('')
  const [, setModelshow] = React.useState(false)
  const [itemTypeDDL, setitemType] = useState([])
  const [branchDDL, setBranchDDL] = useState([])
  const [headerData, setHeaderData] = useState("")
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getVatBranches_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBranchDDL
      )
      GetItemTypeDDL_api(setitemType)
      getHeaderData_api(  profileData?.accountId, selectedBusinessUnit?.value,setHeaderData )
    }
  }, [selectedBusinessUnit, profileData])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={'Sales Register (6.2)'}>
                <CardHeaderToolbar>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="itemType"
                        options={itemTypeDDL || []}
                        value={values?.itemType}
                        label="Item Type"
                        onChange={(valueOption) => {
                          setFieldValue('itemType', valueOption)
                          setFieldValue('itemName', '')
                          GetItemNameDDL_api(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.value,
                            setItemName
                          )
                        }}
                        placeholder="Item Type"
                        errors={errors}
                        touched={touched}
                        // isDisabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="itemName"
                        options={itemName || []}
                        value={values?.itemName}
                        label="Item"
                        onChange={(valueOption) => {
                          setFieldValue('itemName', valueOption)
                        }}
                        placeholder="Item Name"
                        errors={errors}
                        touched={touched}
                        // isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="branch"
                        options={branchDDL || []}
                        value={values?.branch}
                        label="Branch"
                        onChange={(valueOption) => {
                          setFieldValue('branch', valueOption)
                        }}
                        placeholder="Branch"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Top Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="Top Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          SalesRegister_Report_api(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.fromDate,
                            values?.toDate,
                            values?.itemName?.value,
                            values?.branch?.value,
                            setRowDto
                          )
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <GridData
                    rowDto={rowDto}
                    loading={loading}
                    setModelshow={setModelshow}
                    setOrdertableRow={setOrdertableRow}
                    headerData={headerData}
                  />
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  )
}
