import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import Select from 'react-select'
import customStyles from '../../../../selectCustomStyle'

// Validation schema
const ProductEditSchema = Yup.object().shape({
  itemCategoryName: Yup.object().shape({
    label: Yup.string().required('Item Type is required'),
    value: Yup.string().required('Item Type is required'),
  }),
  generalLedgerName: Yup.object().shape({
    label: Yup.string().required('General Ledger is required'),
    value: Yup.string().required('General Ledger is required'),
  }),
})

export default function _Form({
  product,
  btnRef,
  saveBusinessUnit,
  resetBtnRef,
  isDisabled,
  accountId,
  selectedBusinessUnit,
}) {
  const [lngList, setLng] = useState([])
  const [generalLedgerDDL, setGeneralLedgerDDL] = useState([])

  useEffect(() => {
    if (selectedBusinessUnit && accountId) {
      getInfoData(accountId, selectedBusinessUnit.value)
    }
  }, [selectedBusinessUnit, accountId])

  const getInfoData = async (accid, businessUnitId) => {
    try {
      const [lng] = await Promise.all([
        Axios.get(
          `/item/ItemCategoryGL/GetItemCategoryDDLForConfig?AccountId=${accid}&BusinessUnitId=${businessUnitId}`
        ),
        Axios.get(`/item/ItemCategoryGL/GeneralLedgerDDL?AccountId=${accid}`),
      ])
      const { data, status } = lng
      if (status === 200 && data) {
        const languageList = []
        data &&
          data.forEach((item) => {
            let items = {
              value: item.value,
              label: item.label,
              itemtypeId: item?.itemtypeId,
            }
            languageList.push(items)
          })
        setLng(languageList)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getGeneralLedgerDDL_api = async (groupId) => {
    const id = groupId === 10 ? 1 : groupId === 9 ? 12 : 16
    try {
      const res = await Axios.get(
        `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit.value}&AccountGroupId=${id}`
      )
      if (res.status === 200 && res?.data) {
        const newData = res?.data?.map((itm) => ({
          value: itm.generalLedgerId,
          label: itm.generalLedgerName,
        }))
        setGeneralLedgerDDL(newData)
      }
    } catch (error) {
      
    }
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveBusinessUnit(values, () => {
            resetForm(product)
          })
          // setSubmitting(false)
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <label>Item Category</label>
                  <Field
                    name="itemCategoryName"
                    component={() => (
                      <Select
                        options={lngList}
                        placeholder="Select Item Category"
                        value={values.itemCategoryName}
                        onChange={(valueOption) => {
                          setFieldValue('itemCategoryName', valueOption)
                          getGeneralLedgerDDL_api(valueOption?.itemtypeId)
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        isDisabled={isDisabled}
                      />
                    )}
                    placeholder="Item Type"
                    label="Item Type"
                  />
                  <p
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 400,
                      width: '100%',
                      marginTop: '0.25rem',
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.itemCategoryName &&
                    touched &&
                    touched.itemCategoryName
                      ? errors.itemCategoryName.value
                      : ''}
                  </p>
                </div>

                <div className="col-lg-4">
                  <label>General Ledger</label>
                  <Field
                    name="generalLedgerName"
                    component={() => (
                      <Select
                        value={values.generalLedgerName}
                        options={generalLedgerDDL}
                        placeholder="Select General Ledger"
                        onChange={(valueOption) => {
                          setFieldValue('generalLedgerName', valueOption)
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        name="generalLedgerName"
                      />
                    )}
                    placeholder="General Ledger"
                    label="General Ledger"
                  />
                  <p
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 400,
                      marginTop: '0.25rem',
                      width: '100%',
                    }}
                    className="text-danger"
                  >
                    {touched &&
                    touched.generalLedgerName &&
                    errors &&
                    errors.generalLedgerName
                      ? errors.generalLedgerName.value
                      : ''}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: 'none' }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(product)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  )
}
