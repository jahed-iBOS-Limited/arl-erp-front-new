import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { validationSchema, initData } from './helper'
import InputField from '../../../../../_helper/_inputField'
import RowDtoTable from './rowDtoTable'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import {
  getreferenceTypeDDLAction,
  getreferenceNoDDLActionforCancelInv,
  getBusinessPartnerDDLAction,
  getpersonnelDDLAction,
  getItemDDLAction,
  saveInventoryTransactionForCancelInv,
  getLocationTypeDDLAction,
  getStockDDLAction,
  getTransactionTypeforCancelInv,
  getItemforCancelInvAction,
} from '../../_redux/Actions'
import { ISelect } from '../../../../../_helper/_inputDropDown'
import { toast } from 'react-toastify'
import { DropzoneDialogBase } from 'material-ui-dropzone'
import { empAttachment_action } from '../../helper'
import Loading from '../../../../../_helper/_loading'
import { invTransactionSlice } from '../../_redux/Slice'

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

  const [transType, setTransaType] = useState('')
  const [fileObjects, setFileObjects] = useState([])
  const [open, setOpen] = useState(false)

  // redux store data
  const {
    referenceTypeDDL,
    referenceNoDDL,
    transactionTypeDDL,
    itemDDL,
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
    // dispatch(getItemDDLAction(profileData.accountId,selectedBusinessUnit.value,landingData?.plant?.value,landingData?.warehouse?.value))
    dispatch(getStockDDLAction())
    dispatch(
      getLocationTypeDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.plant?.value,
        landingData?.warehouse?.value
      )
    )

    return () =>{
      dispatch(slice.setItemDDL([]))
      dispatch(slice.setreferenceTypeDDL([]))
      dispatch(slice.setreferenceNoDDL([]));
      dispatch(slice.setTransactionTypeDDL([]));
    } 
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value])

  const onChaneForRefType = (refTyp) => {
    dispatch(
      getreferenceNoDDLActionforCancelInv(
        refTyp.value,
        refTyp.label,
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.sbu?.value,
        landingData?.plant?.value,
        landingData?.warehouse?.value
      )
    )
    // dispatch(getTransactionTypeDDLAction(landingData?.transGrup?.value,refTyp.value))

    if (refTyp.label === 'NA (Without Reference)') {
      dispatch(
        getItemDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          landingData?.plant?.value,
          landingData?.warehouse?.value
        )
      )
    }
  }

  useEffect(() => {
    if (transactionTypeDDL) {
      setTransaType(transactionTypeDDL[0])
    }
  }, [transactionTypeDDL])

  const onChangeForRefNo = (refNo, values) => {
    dispatch(getItemforCancelInvAction(values.refType.value,values.refType.label, refNo.value))
    dispatch(getTransactionTypeforCancelInv(refNo.value))
    //    if(transactionTypeDDL){
    //     setTransaType(transactionTypeDDL[0])
    //  }
  }

  //add row Dto Data
  const addRowDtoData = (values) => {
    let data = itemDDL?.map((data) => {
      return {
        itemId: data?.value,
        itemName: data.label,
        uoMid: data.baseUoMId,
        uoMname: data.baseUoMName,
        itemCode: data.code,
        refQty: data.refQty,
        restQty: data.refQty,
        baseValue: data.baseValue,
        locationId: data.currenctLocationId,
        locationName: data.currenctLocationName,
        stockTypeId: data.currentStockId,
        stockTypeName: data.currentStockName,
        quantity: data.refQty,
      }
    })
    setRowDto(data)
  }

  const saveHandler = async (values, cb) => {
    if (rowDto.length === 0) {
      toast.error('Please Add Item')
    } else {
      if (values && profileData?.accountId && selectedBusinessUnit?.value) {
        let rowDataformet = rowDto.map((data) => {
          return {
            itemId: data?.itemId,
            itemName: data?.itemName,
            uoMid: data.uoMid,
            uoMname: data.uoMname,
            numTransactionQuantity: data.quantity,
            monTransactionValue: data.baseValue,
            inventoryLocationId: data.locationId,
            inventoryLocationName: data.locationName,
            batchId: 0,
            batchNumber: '',
            inventoryStockTypeId: data.stockTypeId,
            inventoryStockTypeName: data.stockTypeName,
          }
        })
        const payload = {
          objHeader: {
            transactionGroupId: landingData?.transGrup?.value,
            transactionGroupName: landingData?.transGrup?.label,
            transactionTypeId: transType.value,
            transactionTypeName: transType.label,
            referenceTypeId: values.refType.value,
            referenceTypeName: values.refType.label || "",
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
            businessPartnerId: values?.busiPartner.value || 0,
            parsonnelId: values?.personnel?.value || 0,
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
              saveInventoryTransactionForCancelInv(
                { data: modifyPlyload, cb },
                setRowDto,
                setTransaType,
                setDisabled
              )
            )
          })
        } else {
          dispatch(
            saveInventoryTransactionForCancelInv(
              { data: payload, cb },
              setRowDto,
              setTransaType,
              setDisabled
            )
          )
        }
      }
    }
  }

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
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <ISelect
                    label="Select Reference Type"
                    options={referenceTypeDDL}
                    value={values?.refType}
                    name="refType"
                    onChange={(value) => {
                      setFieldValue('refType', value)
                      onChaneForRefType(value)
                      setFieldValue('refNo', '')
                      setFieldValue('transType', '')
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Select Reference No"
                    options={referenceNoDDL}
                    value={values?.refNo}
                    name="refNo"
                    onChange={(data) => {
                      setFieldValue('refNo', data)
                      setFieldValue('item', '')
                      onChangeForRefNo(data, values)
                      setRowDto([])
                    }}
                    isDisabled={values.refType === ''}
                    //setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Select Transaction Type"
                    options={[]} //transactionTypeDDL
                    value={transType}
                    name="transType"
                    setFieldValue={setFieldValue}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <ISelect
                    label="Select Business Partner"
                    options={busiPartnerDDL}
                    defaultValue={values?.busiPartner}
                    name="busiPartner"
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
                <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Comments"
                    placeholder="Comments"
                    name="remarks"
                  />
                </div>
                <div className="col-lg-2 mt-7">
                  <button
                    type="button"
                    className="btn btn-primary ml-2 mb-5"
                    disabled={!values?.refNo}
                    onClick={() => addRowDtoData(values)}
                  >
                    Show
                  </button>
                </div>
                <div className="col-lg-2 mt-7">
                  <button
                    className="btn btn-primary mr-2"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button>
                </div>
              </div>
              {/* <div className="form-group row">
                <div className="col-lg-3">
                  <ISelect
                    label="Select Item"
                    options={itemDDL}
                    defaultValue={values.item}
                    name="item"
                    setFieldValue={setFieldValue}
                    isDisabled={values.isAllItem === true ||values.refNo === "" }
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg">
                  <Field
                    name={values.isAllItem}
                    component={() => (
                      <input
                        style={{
                          position: "absolute",
                          top: "36px",
                          left: "65px",
                        }}
                        disabled={
                          values.refType.label === "NA (Without Reference)"
                        }
                        id="poIsAllItem"
                        type="checkbox"
                        className="ml-2"
                        value={values.isAllItem}
                        checked={values.isAllItem}
                        name="isAllItem"
                        onChange={(e) => {
                          setFieldValue("isAllItem", e.target.checked);
                          setFieldValue("item", "");
                        }}
                      />
                    )}
                    label="isAllItem"
                  />
                  <label
                    style={{
                      position: "absolute",
                      top: "28px",
                    }}
                  >
                    All Item
                  </label>

                  <button
                    type="button"
                    style={{ marginTop: "25px", transform: "translateX(95px)" }}
                    className="btn btn-primary ml-2"
                    onClick={() => addRowDtoData(values)}
                    disabled={values.item === "" && values.isAllItem === false}
                  >
                    Add
                  </button>
                </div>
              </div> */}

              {/* RowDto table */}
              <RowDtoTable
                rowDto={rowDto}
                setRowDto={setRowDto}
                values={values}
                stockDDL={stockDDL}
                locationTypeDDL={locationTypeDDL}
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
