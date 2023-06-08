import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { validationSchema, initData } from './helper'
import InputField from '../../../../../_helper/_inputField'
import RowDtoTable from './rowDtoTable'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import {
  getreferenceTypeDDLAction,
  getreferenceNoDDLAction,
  getTransactionTypeDDLAction,
  getBusinessPartnerDDLAction,
  getpersonnelDDLAction,
  saveInventoryTransactionForAdjustInv,
  getStockDDLAction,
  getLocationTypeDDLAction,
  getItemforReftypeAction,
} from '../../_redux/Actions'
import SearchAsyncSelect from './../../../../../_helper/SearchAsyncSelect'
import FormikError from './../../../../../_helper/_formikError'
import { ISelect } from '../../../../../_helper/_inputDropDown'
import { toast } from 'react-toastify'
import axios from 'axios'
import { empAttachment_action } from '../../helper'
import { DropzoneDialogBase } from 'material-ui-dropzone'
import { invTransactionSlice } from '../../_redux/Slice'
import Loading from '../../../../../_helper/_loading'
const { actions: slice } = invTransactionSlice

export default function CreateForm({
  btnRef,
  resetBtnRef,
  disableHandler,
  landingData,
}) {
  const [rowDto, setRowDto] = useState([])
  const dispatch = useDispatch()
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false)
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  const [fileObjects, setFileObjects] = useState([])
  const [open, setOpen] = useState(false)

  // redux store data
  const {
    referenceTypeDDL,
    referenceNoDDL,
    transactionTypeDDL,
    stockDDL,
    locationTypeDDL,
  } = useSelector((state) => state?.invTransa)

  //dispatch action creators
  useEffect(() => {
    dispatch(getreferenceTypeDDLAction(landingData?.transGrup?.value))
    dispatch(
      getBusinessPartnerDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value
      )
    )
    dispatch(
      getpersonnelDDLAction(profileData.accountId, selectedBusinessUnit.value)
    )
    // dispatch(
    //   getItemDDLAction(
    //     profileData.accountId,
    //     selectedBusinessUnit.value,
    //     landingData?.plant?.value,
    //     landingData?.warehouse?.value
    //   )
    // );
    dispatch(getStockDDLAction())
    dispatch(
      getLocationTypeDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.plant?.value,
        landingData?.warehouse?.value
      )
    )
    return () => {
      dispatch(slice.setItemDDL([]))
      dispatch(slice.setreferenceTypeDDL([]))
      dispatch(slice.setreferenceNoDDL([]));
      dispatch(slice.setTransactionTypeDDL([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value])

  const onChaneForRefType = (refTyp) => {
    if (refTyp.label !== 'NA (Without Reference)') {
      dispatch(
        getreferenceNoDDLAction(
          refTyp.label,
          profileData.accountId,
          selectedBusinessUnit.value,
          landingData?.sbu?.value,
          landingData?.plant?.value,
          landingData?.warehouse?.value
        )
      )
    }
    dispatch(
      getTransactionTypeDDLAction(landingData?.transGrup?.value, refTyp.value)
    )
    // if (refTyp.label === 'NA (Without Reference)') {
    //   dispatch(
    //     getItemAdjustInvDDLAction(
    //       profileData.accountId,
    //       selectedBusinessUnit.value,
    //       landingData?.plant?.value,
    //       landingData?.warehouse?.value
    //     )
    //   )
    // }
  }

  const onChangeForRefNo = (refNo, values) => {
    dispatch(getItemforReftypeAction(values.refType.label, refNo.value))
  }

  //add row Dto Data
  const addRowDtoData = (values) => {
    let data = rowDto?.find((data) => data?.itemName === values?.item?.label)
    if (data) {
     toast.warning('Item Already added')
    } else {
      setRowDto([
        ...rowDto,
        {
          itemId: values.item.value,
          itemName: values.item.itemName,
          itemCode: values.item.code,
          uoMid: values.item.baseUoMId,
          uoMname: values.item.baseUoMName,
          refQty: 0,
          restQty: 0,
          baseValue: values.item.baseValue || 0,
          location: {
            value: values.item.currenctLocationId,
            label: values.item.currenctLocationName,
            binNumber: values.item.binNo
          },
          stockType: { value: 1, label: "Open Stock" },
          quantity: 0,
          blockStockQty: values.item.blockStock || 0,
          openStockQty: values.item.availableStock || 0
        },
      ])
    }
  }

  // remove single data from rowDto
  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => index !== payload)
    setRowDto([...filterArr])
  }

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto]
    let _sl = data[sl]
    // if (name === 'quantity') {
    //   _sl[name] = value
    // } else {
    //   _sl[name] = value
    // }
    _sl[name] = value
    setRowDto(data)
  }

  const saveHandler = async (values, cb) => {
    if (rowDto.length === 0) {
      toast.error('Please Add Item')
    } else {
      if (values && profileData?.accountId && selectedBusinessUnit?.value) {
        let rowDataformet = rowDto
          .map((data) => {
            return {
              itemId: data?.itemId,
              itemName: data?.itemName,
              uoMid: data.uoMid,
              uoMname: data.uoMname,
              numTransactionQuantity: data.quantity,
              monTransactionValue: data.quantity * data.baseValue,
              inventoryLocationId: data.location.value,
              inventoryLocationName: data.location.label,
              batchId: 0,
              batchNumber: '',
              inventoryStockTypeId: data.stockType.value,
              inventoryStockTypeName: data.stockType.label,
              strBinNo: data?.location?.binNumber || ""
            }
          })
          // .filter((data) => data.numTransactionQuantity > 0)
        const payload = {
          objHeader: {
            transactionGroupId: landingData?.transGrup?.value,
            transactionGroupName: landingData?.transGrup?.label,
            transactionTypeId: values.transType.value,
            transactionTypeName: values.transType.label,
            referenceTypeId: values.refType.value,
            referenceTypeName: values.refType.label,
            referenceId: values.refNo.value || 1,
            referenceCode: values.refNo.label || 'NA',
            accountId: profileData?.accountId,
            accountName: profileData?.accountName,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            sbuId: landingData?.sbu?.value,
            sbuName: landingData?.sbu?.label,
            plantId: landingData?.plant?.value,
            plantName: landingData?.plant?.label,
            warehouseId: landingData?.warehouse?.value,
            warehouseName: landingData?.warehouse?.label,
            businessPartnerId: values.busiPartner.value,
            parsonnelId: values.personnel.value || 0,
            costCenterId: values?.costCenter?.value || -1,
            costCenterCode: values?.costCenter?.code || '',
            costCenterName: values?.costCenter?.label || '',
            projectId: values?.projName?.value || -1,
            projectCode: values?.projName?.code || '',
            projectName: values?.projName?.label || '',
            comments: values?.remarks || '',
            actionBy: profileData.userId,
            documentId: '',
            businessPartnerName: values?.busiPartner?.label || "N/A",
            gateEntryNo: values?.getEntryn || '',
          },
          objRow: rowDataformet,
          objtransfer: {},
        }
        if (fileObjects.length > 0) {
          empAttachment_action(fileObjects).then((data) => {
            const modifyPlyload = {
              objHeader: {
                ...payload?.objHeader,
                documentId: data[0]?.id || '',
              },
              objRow: payload.objRow,
              objtransfer: {},
            }
            dispatch(
              saveInventoryTransactionForAdjustInv(
                { data: modifyPlyload, cb },
                setRowDto,
                setDisabled
              )
            )
          })
        } else {
          dispatch(
            saveInventoryTransactionForAdjustInv(
              { data: payload, cb },
              setRowDto,
              setDisabled
            )
          )
        }
      }
    }
  }

  // const modifiedItemDDL = itemDDL?.map(item => ({
  //   ...item,
  //   label: item?.itemDetails
  // }))
  return (
    <>
      {isDisabled && <Loading />}
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
          <>
            {disableHandler && disableHandler(!isValid)}
            <Form className="form form-label-right po-label">
              <div className="form-group row global-form">
                <div className="col-lg-2">
                  <ISelect
                    label="Select Reference Type"
                    options={referenceTypeDDL}
                    value={values?.refType}
                    name="refType"
                    onChange={(value) => {
                      setFieldValue('refType', value)
                      onChaneForRefType(value)
                      setFieldValue('refNo', '')
                      setFieldValue('item', '')
                      setRowDto([])
                      //setFieldValue("transType", "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    label="Select Reference No"
                    options={referenceNoDDL}
                    value={values?.refNo}
                    name="refNo"
                    onChange={(data) => {
                      setFieldValue('refNo', data)
                      onChangeForRefNo(data, values)
                    }}
                    //setFieldValue={setFieldValue}
                    isDisabled={
                      values.refType.label === 'NA (Without Reference)' || true
                    }
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    label="Select Transaction Type"
                    options={transactionTypeDDL}
                    value={values?.transType}
                    name="transType"
                    setFieldValue={setFieldValue}
                    isDisabled={values.refType === ''}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <ISelect
                    label="Select Business Partner"
                    options={busiPartnerDDL}
                    defaultValue={values?.busiPartner}
      || "N/A"               name="busiPartner"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                {/* <div className="col-lg-3">
                  <ISelect
                    label="Select Personnel"
                    options={personelDDL}
                    defaultValue={values?.personnel}
                    name="personnel"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-2">
                  <InputField
                    value={values?.remarks}
                    label="Comments"
                    placeholder="Comments"
                    name="remarks"
                  />
                </div>
                <div className="col-lg-3 mt-6">
                  <button
                    className="btn btn-primary mr-2"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button>
                </div>
              </div>
              <div className="form-group row global-form">
                {/* <div className="col-lg-3">
                  <ISelect
                    label="Select Item"
                    options={modifiedItemDDL || itemDDL}
                    isOptionSelected={(option, selectValue) => selectValue.some(i => i === option)}
                    value={values.item}
                    name="item"
                    setFieldValue={setFieldValue}
                    isDisabled={values.refType === ''}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}

                <div className="col-lg-3">
                  <label>Item</label>
                  <SearchAsyncSelect
                    selectedValue={values.item}
                    handleChange={(valueOption) => {
                      setFieldValue('item', valueOption)
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 3) return []
                      return axios.get(                      
                        `/wms/InventoryTransaction/GetItemForAdjustInventory?accountId=${profileData.accountId}&businessUnitId=${selectedBusinessUnit?.value}&plantId=${landingData?.plant?.value}&whId=${landingData?.warehouse?.value}&searchTerm=${v}`
                      ).then((res) => {
                        const updateList = res?.data.map(item => ({
                          ...item,
                          label: item?.itemDetails
                        }))
                        return updateList
                      })
                    }}
                    isOptionSelected={(option, selectValue) => selectValue.some(i => i === option)}
                    disabled={true}
                  />
                  <FormikError errors={errors} name="item" touched={touched} />
                </div>

                <div className="col-lg-3">
                  <button
                    style={{marginTop: "23px"}}
                    type="button"
                    className="btn btn-primary mt-7 mb-3"
                    onClick={() =>{
                      addRowDtoData(values)
                      setFieldValue('item', "")
                    } }
                    disabled={values.item === ''}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* RowDto table */}
              <RowDtoTable
                rowDtoHandler={rowDtoHandler}
                remover={remover}
                rowDto={rowDto}
                setRowDto={setRowDto}
                values={values}
                stockDDL={stockDDL}
                locationTypeDDL={locationTypeDDL}
                landingData={landingData}
              />

              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={['image/*', 'application/pdf']}
                fileObjects={fileObjects}
                cancelButtonText={'cancel'}
                submitButtonText={'submit'}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs))
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  )
                  setFileObjects(newData)
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  setOpen(false)
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />

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
                onClick={() => {
                  setRowDto([])
                }}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  )
}
