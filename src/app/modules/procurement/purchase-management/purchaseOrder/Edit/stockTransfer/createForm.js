/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { ISelect } from '../../../../../_helper/_inputDropDown'
import { validationSchema, initData, getSupplyingWhDDL } from './helper'
import { shallowEqual, useSelector } from 'react-redux'
import RowDtoTable from './rowDtoTable'
import { toast } from 'react-toastify'
import InputField from '../../../../../_helper/_inputField'
import NewSelect from '../../../../../_helper/_select'
import { _dateFormatter } from '../../../../../_helper/_dateFormate'
import TotalNetAmount from '../../TotalNetAmount'
import { getUniQueItems } from '../../helper'
import SearchAsyncSelect from './../../../../../_helper/SearchAsyncSelect'
import FormikError from './../../../../../_helper/_formikError'
import axios from "axios";



export default function StockTransferPOCreateForm({
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  singleData,
  viewPage,
}) {
  const [rowDto, setRowDto] = useState([])
  const [wh, setWh] = useState([])

  // redux store data
  const storeData = useSelector((state) => {
    return {
      supplierNameDDL: state.purchaseOrder.supplierNameDDL,
      currencyDDL: state.purchaseOrder.currencyDDL,
      paymentTermsDDL: state.purchaseOrder.paymentTermsDDL,
      incoTermsDDL: state.purchaseOrder.incoTermsDDL,
      poReferenceNoDDL: state.purchaseOrder.poReferenceNoDDL,
      poItemsDDL: state.purchaseOrder.poItemsDDL,
      itemListWithoutRef: state.purchaseOrder.itemListWithoutRef,
      uomDDL: state.commonDDL.uomDDL,
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    }
  }, shallowEqual)

  const {
    poReferenceNoDDL,
    poItemsDDL,
    uomDDL,
    profileData,
    selectedBusinessUnit,
  } = storeData

  // add single item to row or add all item to row
  const addRowDtoData = (data, values) => {
    if (values?.isAllItem) {
      // get new items that not exit in rowdto
      const refferenceItems = getUniQueItems(data, rowDto, values);

      // show error if no new item found
      if (refferenceItems?.length === 0) {
        return toast.warn("Not allowed to duplicate items");
      }

      const newData = refferenceItems?.map((item, index) => ({
        ...values,
        newItem:true,
        item: { ...item },
        desc: item?.label,
        selectedUom: { value: item?.uoMId, label: item?.uoMName },
        orderQty: '',
        basicPrice: '',
        restofQty: item?.restofQty,
        netValue: 0,
      }))
      setRowDto([...newData,...rowDto])
    } else {
      // if reference, can't add same reference and same item multiple
      // if not reference, can't add multiple item
      let arr

      if (values?.referenceNo) {
        arr = rowDto?.filter(
          (item) =>
            item.referenceNo?.value === values?.referenceNo?.value &&
            item?.item?.value === values?.item?.value
        )
      } else {
        arr = rowDto?.filter(
          (item) => item?.item?.value === values?.item?.value
        )
      }

      if (arr?.length > 0) {
        toast.warn('Not allowed to duplicate items')
      } else {
        const newData = {
          ...values,
          newItem:true,
          item: { ...values?.item },
          desc: values?.item?.label,
          selectedUom: { value: values?.item?.uoMId, label: values?.item?.uoMName },
          orderQty: '',
          basicPrice: '',
          restofQty: values?.item?.restofQty,
          netValue: 0,
        }
        setRowDto([...rowDto, newData])
      }
    }
  }

  // remove single data from rowDto
  const remover = (payload) => {
    // const filterArr = rowDto.filter((itm) => itm?.item?.value !== payload)

    const filterArr = rowDto.filter((itm) => {
      // don't filter other refference items
      if (itm?.referenceNo?.value !== payload?.referenceNo?.value) {
        return true;
      }
      // flter refference items via item id
      if (
        itm?.item?.value !== payload?.item?.value &&
        itm?.referenceNo?.value === payload?.referenceNo?.value
      ) {
        return true;
      } else {
        return false;
      }
    });
    
    setRowDto([...filterArr])
  }

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto]
    let _sl = data[sl]
    _sl[name] = value
    setRowDto(data)
  }

  const loadUserList = (v) => {
    //  if (v?.length < 3) return []
      return axios.get(
       `/procurement/PurchaseOrder/GetPOReferenceNoWiseItemDDLWithoutRefItemSearch?searchTerm=${v}&OrderTypeId=${4}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SbuId=${singleData?.objHeaderDTO?.sbuId}&PurchaseOrgId=${singleData?.objHeaderDTO?.purchaseOrganizationId}&PlantId=${singleData?.objHeaderDTO?.plantId}&WearhouseId=${singleData?.objHeaderDTO?.warehouseId}&PartnerId=0&RefTypeId=${3}&RefNoId=0`
      ).then((res) => {
        const updateList = res?.data.map(item => ({
          ...item,
        }))
        return updateList
      })
    }

  useEffect(() => {
    // dispatch(
    //   getPOItemDDLAction(
    //     profileData?.accountId,
    //     selectedBusinessUnit?.value,
    //     singleData?.objHeaderDTO?.purchaseOrganizationId,
    //     singleData?.objHeaderDTO?.plantId,
    //     singleData?.objHeaderDTO?.warehouseId,
    //     0,
    //     3,
    //     0
    //   )
    // )
    getSupplyingWhDDL(
      profileData?.accountId,
      profileData?.userId,
      singleData?.objHeaderDTO?.warehouseId,
      setWh
    )
  }, [profileData, selectedBusinessUnit, singleData])

  useEffect(() => {
    const newData = singleData?.objRowListDTO?.map((item, index) => ({
      ...item,
      item: {
        label: item?.itemName,
        value: item?.itemId,
        code: item?.itemCode,
        refQty: item?.referenceQty
      },
      referenceNo: { value: item?.referenceId, label: item?.referenceCode },
      desc: item?.purchaseDescription || '',
      selectedUom: { label: item?.uomName, value: item?.uomId },
      orderQty: item?.orderQty,
      basicPrice: item?.basePrice,
      refQty: item?.referenceQty,
      restofQty: item?.restofQty,
      netValue: item?.totalValue,
    }))
    setRowDto([...newData])

    // get item initially
    // getItemDDL(
    //   singleData?.objHeaderDTO?.businessPartnerId,
    //   singleData?.objHeaderDTO?.referenceTypeId,
    //   0
    // );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData])

  const {
    supplyingWarehouseId,
    supplyingWarehouseName,
    deliveryAddress,
    purchaseOrderDate,
    lastShipmentDate,
    validityDate,
    otherTerms,
  } = singleData?.objHeaderDTO

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          supplyingWh: {
            value: supplyingWarehouseId,
            label: supplyingWarehouseName,
          },
          deliveryAddress: deliveryAddress,
          orderDate: _dateFormatter(purchaseOrderDate),
          lastShipmentDate: _dateFormatter(lastShipmentDate),
          validity: _dateFormatter(validityDate),
          otherTerms: otherTerms,

          // row
          referenceNo: '',
          item: '',
          deliveryDate: '',
          isAllItem: false,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, rowDto, () => {
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
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="supplyingWh"
                      options={wh}
                      value={values?.supplyingWh}
                      onChange={(valueOption) => {
                        setFieldValue('supplyingWh', valueOption)
                      }}
                      label="Supplying WH"
                      placeholder="Supplying WH"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewPage || isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Delivery Address</label>
                    <InputField
                      value={values?.deliveryAddress}
                      name="deliveryAddress"
                      placeholder="Delivery Address"
                      type="text"
                      disabled={viewPage || isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Order Date</label>
                    <InputField
                      value={values?.orderDate}
                      name="orderDate"
                      placeholder="Order Date"
                      type="date"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Last Shipment Date</label>
                    <InputField
                      value={values?.lastShipmentDate}
                      name="lastShipmentDate"
                      placeholder="Last Shipment Date"
                      type="date"
                      disabled={viewPage || isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Validity</label>
                    <InputField
                      value={values?.validity}
                      name="validity"
                      placeholder="Validity"
                      type="date"
                      disabled={viewPage || isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Other Terms</label>
                    <InputField
                      value={values?.otherTerms}
                      name="otherTerms"
                      placeholder="Other Terms"
                      type="text"
                      disabled={viewPage || isEdit}
                    />
                  </div>
                </div>
                {!viewPage && (
                  <div className="form-group row">
                    <div className="col-lg-3">
                      <ISelect
                        label="Reference No"
                        options={poReferenceNoDDL}
                        defaultValue={values.referenceNo}
                        isDisabled={
                          singleData?.objHeaderDTO?.referenceTypeId === 3
                        }
                        name="referenceNo"
                        dependencyFunc={(value, allValues, setFieldValue) => {
                          setFieldValue('item', '')
                        }}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                        <label>Item Name</label>
                        <SearchAsyncSelect
                          selectedValue={values.item}
                          handleChange={(valueOption) => {
                            setFieldValue('item', valueOption)
                          }}
                          loadOptions={loadUserList}
                          disabled={true}
                        />
                        <FormikError errors={errors} name="itemName" touched={touched} />
                      </div>

                    {/* <div className="col-lg-3">
                      <ISelect
                        label="Item"
                        isDisabled={
                          singleData?.objHeaderDTO?.referenceTypeId === 3
                            ? values.isAllItem
                            : !values.referenceNo || values.isAllItem
                        }
                        options={poItemsDDL}
                        defaultValue={values.item}
                        name="item"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}

                    <div className="col-lg">
                      {/* <Field
                    name={values.isAllItem}
                    component={() => (
                      <input
                        style={{
                          position: "absolute",
                          top: "36px",
                          left: "65px",
                        }}
                        id="poIsAllItem"
                        type="checkbox"
                        className="ml-2"
                        value={values.isAllItem || ""}
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
                  </label> */}

                      <button
                        type="button"
                        style={{
                          marginTop: '30px',
                          transform: 'translateX(95px)',
                        }}
                        disabled={
                          values?.isAllItem ? false : !values?.item && true
                        }
                        className="btn btn-primary ml-2"
                        onClick={() => {
                          addRowDtoData(poItemsDDL, values)
                          setFieldValue('referenceNo', '')
                          setFieldValue('item', '')
                          if (singleData?.objHeaderDTO?.referenceTypeId === 3) {
                            setFieldValue('isAllItem', false)
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <div style={{ paddingTop: '32px' }} className="col-lg">
                      {/* <b className="ml-1">Order Total : 0</b> */}
                    </div>
                  </div>
                )}
              </div>

              <TotalNetAmount 
              rowDto={rowDto}
              />

              {/* RowDto table */}
              <RowDtoTable
                // detect user is selected without refference or not
                isWithoutRef={singleData?.objHeaderDTO?.referenceTypeId !== 3}
                rowDtoHandler={rowDtoHandler}
                remover={remover}
                rowDto={rowDto}
                setRowDto={setRowDto}
                uomDDL={uomDDL}
                values={values}
                viewPage={viewPage}
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
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  )
}
