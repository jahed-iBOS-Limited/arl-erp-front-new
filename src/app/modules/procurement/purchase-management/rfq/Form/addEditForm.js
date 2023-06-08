/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import Form from './form'
import IForm from '../../../../_helper/_form'
import { isUniq } from '../../../../_helper/uniqChecker'
import {
  getCurrencyDDLAction,
} from '../../../../_helper/_redux/Actions'

import {
  getRefNoDDLAction,
  getUomDDLAction,
  getItemDDLAction,
  getItemDDLWithRefAction,
  saveRfq,
  getDataById,
  setControllingUnitSingleEmpty,
  saveEditedRFQ,
} from '../_redux/Actions'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import { _dateFormatter } from '../../../../_helper/_dateFormate'
import { _todayDate } from '../../../../_helper/_todayDate'



//getSupplierNameDDLAction

const initData = {
  id: undefined,
  requestDate: _todayDate(),
  validityDate: _todayDate(),
  currency: {
    value: 141,
    label: "Taka",
    code: "BDT",
  },
  refType: "",
  refNo: '',
  item: '',
  isAllItem: false,
  supplierName: '',
  email: '',
}

export default function RFQForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true)
  const [ref, setRef] = useState('')
  const [refNo, setRefNo] = useState('')
  const [rowDto, setRowDto] = useState([])
  const [rowDtoTwo, setRowDtoTwo] = useState([])

  // get reftype by this func, and destroy rowDto if user change reference type
  const refFunc = (value, values, setFieldValue) => {
    setFieldValue('refNo', '')
    setFieldValue('item', '')
    setFieldValue('isAllItem', false)
    setRef(value)
    if (rowDto.length) {
      var isConfirm = window.confirm(
        'If you changed this, all added row will be destroyed'
      )
      if (isConfirm === true) {
        setRowDto([])
      } else {
        setRowDto([...rowDto])
        values?.refType?.value === 'with reference'
          ? setFieldValue('refType', {
            value: 'without reference',
            label: 'Without reference',
          })
          : setFieldValue('refType', {
            value: 'with reference',
            label: 'With reference',
          })
      }
    }
  }

  const dispatch = useDispatch()
  // user selected ddl data from previous page
  const { state: usersDDLdata } = useLocation()

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  // currency ddl
  const currencyDDL = useSelector((state) => {
    return state.commonDDL.currencyDDL
  }, shallowEqual)

  // supplier ddl
  const supplierDDL = useSelector((state) => {
    return state.commonDDL.supplierDDL
  }, shallowEqual)

  // ref no ddl
  const refNoDDL = useSelector((state) => {
    return state.rfq.refNoDDL
  }, shallowEqual)

  // item ddl
  const itemDDL = useSelector((state) => {
    return state.rfq.itemDDL
  }, shallowEqual)


  // get objrow from redux store
  const objRow = useSelector((state) => {
    return state?.rfq?.singleData[0]?.objRow
  }, shallowEqual)

  const singleData = useSelector((state) => {
    return {
      requestDate: _dateFormatter(
        state?.rfq?.singleData[0]?.objHeader?.dteRfqdate
      ),
      validityDate: _dateFormatter(
        state?.rfq?.singleData[0]?.objHeader?.validTillDate
      ),
      currency: {
        value: state?.rfq?.singleData[0]?.objHeader.currencyId,
        label: state?.rfq?.singleData[0]?.objHeader.currencyCode,
      },
      refType:
        (state?.rfq?.singleData[0]?.objHeader?.referenceTypeName ===
          'with reference' && {
          value: 'with reference',
          label: 'With reference',
        }) ||
        (state?.rfq?.singleData[0]?.objHeader?.referenceTypeName ===
          'without reference' && {
          value: 'without reference',
          label: 'Without reference',
        }),
      refNo: '',
      item: '',
      isAllItem: false,
      supplierName: '',
      email: '',
      requestTypeId: state?.rfq?.singleData[0]?.objHeader?.requestTypeId,
      requestTypeName: state?.rfq?.singleData[0]?.objHeader?.requestTypeName,
    }
  }, shallowEqual)

  // get objSupplier from redux store
  const objSuplier = useSelector((state) => {
    return state?.rfq?.singleData[0]?.objSuplier
  }, shallowEqual)

  useEffect(() => {
    if (id) {
      setRef(singleData?.refType?.value)
    }
  }, [singleData, id])


  useEffect(() => {
    if (id) {
      let data = objRow?.map((itm, index) => {
        return {
          itemCode: itm?.itemCode,
          itemId: itm?.itemId,
          itemName: itm?.itemName,
          itemtypeName: itm?.itemtypeName,
          purchaseRequestCode: itm?.purchaseRequestCode,
          selectedUom: { label: itm?.uoMname, value: itm?.uoMid },
          uomDDL: { label: itm?.uoMname, value: itm?.uoMid },
          description: itm?.description,
          refNo: itm?.referenceId,
          refQty: itm?.referenceQuantity,
          reqQty: itm?.reqquantity,
          rowId: itm?.rowId,
        }
      })
      data?.length && setRowDto([...data])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objRow, id])

  useEffect(() => {
    if (id) {
      let data = objSuplier?.map((itm, index) => {
        return {
          supplierName: itm?.businessPartnerName,
          supplierId: itm?.businessPartnerId,
          address: itm?.businessPartnerAddress,
          email: itm?.email,
          contact: itm?.contactNumber,
          partnerRFQId: itm?.partnerRFQId,
        }
      })
      data?.length && setRowDtoTwo([...data])
    }
  }, [objSuplier, id])

  // item ddl based on reference type
  useEffect(() => {
    if (ref === 'with reference') {
      if (refNo) {
        dispatch(
          getItemDDLWithRefAction(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            usersDDLdata?.sbu?.value,
            usersDDLdata?.purchaseOrg?.value,
            usersDDLdata?.plant?.value,
            usersDDLdata?.wareHouse?.value,
            refNo?.value,
            refNo?.label
          )
        )
      }
    }
    if (ref === 'without reference') {
      dispatch(
        getItemDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          usersDDLdata?.plant?.value,
          usersDDLdata?.wareHouse?.value
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, usersDDLdata, ref, refNo])

  // Dispatch action
  useEffect(() => {
    if (id) {
      dispatch(getDataById(id))
    }

    if (!id) {
      dispatch(setControllingUnitSingleEmpty())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {

    if ((selectedBusinessUnit && profileData && usersDDLdata)) {
      dispatch(
        getRefNoDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          usersDDLdata?.sbu?.value,
          usersDDLdata?.purchaseOrg?.value,
          usersDDLdata?.plant?.value,
          usersDDLdata?.wareHouse?.value
        )
      )
    }
    // if user not come from previous page i will redirect him to previous page, because we need some data from previous page, this is only for create page, not for edit page,
    if (!usersDDLdata) {
      history.push('/mngProcurement/purchase-management/rfq')
    }
    dispatch(getCurrencyDDLAction())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, usersDDLdata])

  const saveHandler = async (values, cb) => {
    setDisabled(true)
    if (
      values &&
      rowDto.length &&
      rowDtoTwo.length &&
      profileData?.accountId &&
      selectedBusinessUnit?.value
    ) {
      if (id) {
        const objRow = rowDto.map((itm) => {
          return {
            rowId: itm?.rowId || 0,
            requestForQuotationId: +id,
            itemId: +itm?.itemId,
            itemCode: itm?.itemCode,
            itemName: itm?.itemName,
            itemtypeName: itm?.itemtypeName,
            purchaseRequestCode: itm?.purchaseRequestCode,
            uoMid: +itm?.uomDDL?.value,
            uoMname: itm?.uomDDL?.label,
            numRfqquantity: +itm?.reqQty,
            referenceId: +itm?.refNo || 0,
            referenceCode: null,
            numReferenceQuantity: +itm?.refQty || 0,
            description: itm?.description,
            isActive: true,

          }
        })

        const supplierRow = rowDtoTwo.map((itm) => {
          return {
            partnerRfqid: itm?.partnerRFQId,
            businessPartnerId: +itm?.supplierId,
            businessPartnerName: itm?.supplierName,
            businessPartnerAddress: itm?.address,
            email: itm?.email,
            contactNumber: itm?.contact,
            isEmailSend: false,
          }
        })

        let payload = {
          objHeader: {
            requestForQuotationId: +id,
            accountId: +profileData?.accountId,
            accountName: profileData?.accountName,
            businessUnitId: +selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            requestTypeId: +singleData?.requestTypeId,
            requestTypeName: singleData?.requestTypeName,
            actionBy: +profileData.userId,
          },
          objRow: objRow,
          objSuppliers: supplierRow,
        }
        dispatch(saveEditedRFQ({ data: payload, cb }))
      } else {
        // if (rowDto.length && !rowDto[rowDto.length - 1]?.selectedUom) {
        //   toast.warning('Please select uom')
        // } else {

        // }
        const objRow = rowDto.map((itm) => {
          return {
            itemId: +itm?.itemId,
            itemCode: itm?.itemCode,
            itemName: itm?.itemName,
            uoMid: +itm?.uomDDL?.value,
            uoMname: itm?.uomDDL?.label,
            reqquantity: +itm?.reqQty,
            referenceId: +itm?.refNo || 0,
            referenceCode: null,
            referenceQuantity: +itm?.refQty || 0,
            description: itm?.description,
            itemtypeName: itm?.itemtypeName || null,
            purchaseRequestCode: itm?.purchaseRequestCode || null,
          }
        })

        const supplierRow = rowDtoTwo.map((itm) => {
          return {
            businessPartnerId: +itm?.supplierId,
            businessPartnerName: itm?.supplierName,
            businessPartnerAddress: itm?.address,
            email: itm?.email,
            contactNumber: itm?.contact,
            isEmailSend: false,
          }
        })

        let payload = {
          objHeader: {
            accountId: +profileData?.accountId,
            accountName: profileData?.accountName,
            businessUnitId: +selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            sbuid: +usersDDLdata?.sbu?.value,
            sbuname: usersDDLdata?.sbu?.label,
            purchaseOrganizationId: +usersDDLdata?.purchaseOrg?.value,
            purchaseOrganizationName: usersDDLdata?.purchaseOrg?.label,
            plantId: +usersDDLdata?.plant?.value,
            plantName: usersDDLdata?.plant?.label,
            warehouseId: +usersDDLdata?.wareHouse?.value,
            warehouseName: usersDDLdata?.wareHouse?.label,
            requestTypeId: usersDDLdata?.requestType?.value,
            requestTypeName: usersDDLdata?.requestType?.label,
            currencyId: +values?.currency?.value,
            validTillDate: values?.validityDate,
            rfqdate: values?.requestDate,
            actionBy: +profileData.userId,
            lastActionDateTime: '2020-09-09T04:49:04.191Z',
            referenceTypeName: values?.refType?.value,
          },
          objRow: objRow,
          supplierRow: supplierRow,
        }

        dispatch(saveRfq({ data: payload, cb }))
      }
    } else {
      setDisabled(false)
      toast.warning('Please add all field')
    }
  }

  const disableHandler = (cond) => {
    setDisabled(cond)
  }

  const setter = (values) => {
    // if isAllItem === true,  dont need to check uniq checker
    if (values?.isAllItem) {
      const newData = itemDDL.map(item => {
        return ({
          itemCode: item?.code,
          purchaseRequestCode: values?.refNo?.label,
          itemId: item?.value,
          itemName: item?.label,
          itemtypeName: item?.itemtypeName,
          selectedUom: '',
          uomDDL: { label: item?.uoMName, value: item?.uoMId },
          description: item.description || "",
          refNo: values?.refNo?.value,
          refQty: item?.refQty,
          reqQty: '',
          uoMId: item.uoMId,
          uoMname: item.uoMName,
        })
      }).filter(item => {
        if (rowDto.find(a => a.purchaseRequestCode === item.purchaseRequestCode && a.itemId === item.itemId)) {
          return false;
        }
        return true;
      })
      newData.length > 0 && setRowDto([...newData, ...rowDto])

    } else {
      let obj = {
        itemCode: values.item?.code,
        purchaseRequestCode: values?.refNo?.label,
        itemId: values.item?.value,
        itemName: values.item?.label,
        itemtypeName: values.item.itemtypeName,
        selectedUom: '',
        uomDDL: { label: values?.item?.uoMName, value: values?.item?.uoMId },
        description: values?.item.description || "",
        refNo: values?.refNo?.value,
        refQty: values?.item?.refQty,
        reqQty: '',
      }
      if (rowDto.find(a => a.purchaseRequestCode === obj.purchaseRequestCode && a.itemId === obj.itemId)) {
        return;
      }
      setRowDto([...rowDto, obj])

    }
  }

  const setterTwo = (values) => {
    if (isUniq('supplierId', values?.supplierName?.value, rowDtoTwo)) {
      let obj = {
        supplierName: values.supplierName?.label,
        supplierId: values?.supplierName?.value,
        address: values.supplierName?.supplierAddress,
        email: values?.email,
        contact: values?.supplierName?.supplierContact || '',
      }
      setRowDtoTwo([...rowDtoTwo, obj])
    }
  }

  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto]
    let _sl = data[sl]
    _sl[name] = value
    setRowDto(data)
  }

  const remover = (itemId) => {
    const filterArr = rowDto.filter((itm) => itm.itemId !== itemId)
    setRowDto(filterArr)
  }

  const removerTwo = (supplierId) => {
    const filterArr = rowDtoTwo.filter((itm) => itm.supplierId !== supplierId)
    setRowDtoTwo(filterArr)
  }

  const dependencyFunc = (itemId) => {
    dispatch(
      getUomDDLAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        itemId
      )
    )
  }

  const emailHandler = () => {
    alert('email handler')
  }

  const [objProps, setObjprops] = useState({})

  return (
    <IForm
      title={id ? 'Edit Request for Quotation' : 'Create Request for Quotation'}
      getProps={setObjprops}
      isDisabled={isDisabled}
      emailHandler={emailHandler}
      isShow={true}
    >
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        rowDto={rowDto}
        rowDtoTwo={rowDtoTwo}
        setter={setter}
        remover={remover}
        removerTwo={removerTwo}
        id={id}
        currencyDDL={currencyDDL}
        supplierDDL={supplierDDL}
        refNoDDL={refNoDDL}
        itemDDL={itemDDL}
        refFunc={refFunc}
        dependencyFunc={dependencyFunc}
        rowDtoHandler={rowDtoHandler}
        usersDDLdata={usersDDLdata}
        setterTwo={setterTwo}
        setRefNo={setRefNo}
      />
    </IForm>
  )
}
