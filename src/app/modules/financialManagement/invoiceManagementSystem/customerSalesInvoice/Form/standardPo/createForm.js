/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { ISelect } from '../../../../../_helper/_inputDropDown'
import { IInput } from '../../../../../_helper/_input'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  getPOItemDDLAction,
  getPOReferenceNoDDLAction,
} from '../../_redux/Actions'
import CommonHeaderForm from '../commonHeaderForm'
import CommonGrid from '../commonGrid'
import { isUniq } from '../../../../../_helper/uniqChecker'
import { toArray } from 'lodash'
import Axios from 'axios'

const initData = {
  referenceNo: '',
  item: '',
  deliveryDate: '',
}
export default function SPOCreateForm({
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  empDDL,
  isEdit,
  ty,
}) {
  const [rowDto, setRowDto] = useState({})
  const poReferenceNoDDL = useSelector(
    (state) => state.purchaseOrder.poReferenceNoDDL
  )
  const poItemsDDL = useSelector((state) => state.purchaseOrder.poItemsDDL)
  const { state: location } = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      getPOReferenceNoDDLAction(
        location?.refType?.value,
        location?.warehouse?.value
      )
    )
  }, [location])

  // Set and get value in rowdto
  const rowDtoHandler = (name, value, sl) => {
    setRowDto({
      ...rowDto,
      [sl]: {
        ...rowDto[sl],
        [name]: value,
      },
    })
  }

  const addHandler = async (isAllItem, poItemId) => {
    if (isAllItem) {
      const { data } = await Axios.get(
        '/mngProcurement/PurchaseOrder/getPRItemList?PurRequestId=4&ReferanceTypeId=1'
      )
      const tempObj = {}
      data.forEach((itm, idx) => {
        tempObj[idx] = itm
      })
      setRowDto(tempObj)
    } else {
      const {
        refType: { value },
      } = location
      const { data } = await Axios.get(
        `/mngProcurement/PurchaseOrder/getPRItemByItemId?RequestId=4&ReferanceTypeId=${value}&ItemId=${poItemId}`
      )
      const payload = data[0]
      if (isUniq('poItemId', poItemId, toArray(rowDto))) {
        setRowDto({
          ...rowDto,
          [toArray(rowDto).length]: payload,
        })
      }
    }
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
          <>
            <Form className="form form-label-right">
              <CommonHeaderForm
                values={values}
                setFieldValue={setFieldValue}
                touched={touched}
                errors={errors}
              />

              <div className="form-group row">
                <div className="col-lg-3">
                  <ISelect
                    label="Select Reference No"
                    options={poReferenceNoDDL}
                    value={values.referenceNo}
                    name="referenceNo"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    dependencyFunc={(currentValue) =>
                      dispatch(
                        getPOItemDDLAction(location.refType.value, currentValue)
                      )
                    }
                  />
                </div>

                <div className="col-lg-3">
                  <ISelect
                    label="Select Item"
                    options={poItemsDDL}
                    value={values.poItem}
                    name="poItem"
                    isDisabled={!values.referenceNo?.value}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    dependencyFunc={(cv) => setFieldValue('poItemId', cv)}
                  />
                </div>

                <div className="col-lg-1 text-center">
                  <label className="text-center ml-5">All Item</label> <br />
                  <input
                    type="checkbox"
                    className="form-check-input ml-3"
                    name="isAllItem"
                    disabled={!poItemsDDL.length}
                    onChange={(e) =>
                      setFieldValue('isAllItem', e.target.checked)
                    }
                  />
                </div>

                <div className="col-lg-3">
                  <button
                    onClick={() => {
                      if (values.isAllItem) {
                        addHandler(true)
                      } else {
                        addHandler(false, values.poItem.value)
                      }
                    }}
                    type="button"
                    disabled={
                      toArray(rowDto).length === poItemsDDL.length ||
                      (!values.isAllItem && !values.poItem)
                    }
                    className="btn btn-primary addBtn"
                  >
                    ADD
                  </button>
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
      <div>
        <CommonGrid rowDtoHandler={rowDtoHandler} data={rowDto} />
      </div>
    </>
  )
}
