/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Form from './form'
import {
  getSingleDataForEdit,
  saveItemRequest,
  saveItemReqEdit,
  getItemAssetDDL,
  getItemforServiceItemDDL,
  getItemForOthersDDL,
} from '../helper'
import IForm from '../../../../_helper/_form'
import { _todayDate } from '../../../../_helper/_todayDate'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../../../../_helper/_loading'

// console.log(_todayDate())

const initData = {
  requestDate: _todayDate(),
  validTill: "2021-05-08",
  dueDate: "2021-05-08",
  referenceId: '',
  item: '',
  quantity: '',
  remarks: '',
  costCenter: '',
  projectName: '',
  itemGroup: '',
  itemUom: "",
  // costElement:"",
  actionType:"",
  project: "",
  department: "",
  availableStockQty: "",
}

export default function ItemRequestForm({
  history,
  match: {
    params: { id },
  },
}) {
  const location = useLocation()
  const { profileData, selectedBusinessUnit } = useSelector(
    (store) => store?.authData,
    shallowEqual
  );
  const [isDisabled, setDisabled] = useState(false)

  const [singleData, setSingleData] = useState([])

  //item DDL
  const [itemDDL, setitemDDL] = useState([])

  //row dataSourceDDL
  const [rowlebelData, setrowlebelData] = useState([])

  useEffect(() => {
    if (id) {
      setrowlebelData(singleData.objRow)
    }
  }, [singleData])

  useEffect(() => {
    if (id) {
      getSingleDataForEdit(id, setSingleData)
    }
  }, [id])

  const addItemtoTheGrid = (values) => {
    if (values.quantity < 0) {
      return toast.warn("Quantity must be greater than 0");
    }

    let data = rowlebelData.find((data) => data.itemId === values.item.value)
    if (data) {
      toast.error('Item already added')
    } else {
      let itemRow = {
        referenceId: values?.referenceId || '',
        itemId: values?.item?.value,
        itemCode: values?.item?.code,
        itemName: values?.item?.itemName,
        uoMId: values?.itemUom?.value,
        uoMname: values?.itemUom?.label,
        requestQuantity: values?.quantity,
        remarks: values?.remarks,
      }
      setrowlebelData([...rowlebelData, itemRow])
    }
  }

  const remover = (id) => {
    let data = rowlebelData.filter((data) => data.itemId !== id)
    setrowlebelData(data)
  }

  const saveHandler = async (values, cb) => {
    if(values?.actionType?.value === 1 && !values?.project?.label){
      return toast.warn("Please Select a Project")
    }
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        let rowDatas = rowlebelData.map((data) => {
          return {
            rowId: data?.rowId || 0,
            referenceId: data?.referenceId,
            itemId: data?.itemId,
            itemCode: data?.itemCode,
            itemName: data?.itemName.split("[")[0].trim(),
            uoMId: data?.uoMId,
            uoMName: data?.uoMname,
            requestQuantity: data?.requestQuantity,
            remarks: data?.remarks,
          }
        })
        const payload = {
          itemRequestHeader: {
            itemRequestId: +id,
          },
          itemRequestRow: rowDatas,
        }

        if (rowDatas.length) {
          saveItemReqEdit(payload, cb, setDisabled)
        } else {
          toast.warning('You must have to add atleast one item')
        }
      } else {

        let rowDataForsave = rowlebelData?.map(data => {
          return {
            ...data,
            itemName: data?.itemName?.split("[")[0].trim(),
            uoMName: data?.uoMname
          }
        })

        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            requestDate: values?.requestDate,
            validTill: values?.validTill,
            dueDate: values?.dueDate,
            // itemId: values.item.value,
            purpose: values?.remarks,
            // remarks: values.remarks,
            //itemRequestTypeId: 1,//location.state.selectrequestType.value,
            referenceTypeId: 1,
            sbuid: location?.state?.sbu?.value,
            sbuname: location?.state?.sbu?.label,
            plantId: location?.state?.plant?.value,
            plantName: location?.state?.plant?.label,
            warehouseId: location?.state?.wh?.value,
            actionBy: profileData?.userId,
            ...(values?.actionType?.value === 1 && { intProjectId: values?.project?.value }),
          },
          objRow: rowDataForsave,
        };
        //window.payload = payload

        if (rowlebelData.length) {
          saveItemRequest(payload, cb, setrowlebelData, setDisabled)
        } else {
          toast.warning('You must have to add atleast one item')
        }
      }
    } else {

    }
  }



  const [objProps, setObjprops] = useState({})

  const onChangeForItemGroup = (valueOption) => {
    if (valueOption?.label === 'Assets Item') {
      if (id) {
        getItemAssetDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          singleData?.objHeader?.intPlantId,
          singleData?.objHeader?.intWarehouseId,
          setitemDDL
        )
      } else {
        getItemAssetDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          location?.state?.plant?.value,
          location?.state?.wh?.value,
          setitemDDL
        )
      }
    } else if (valueOption?.label === 'Service Item') {
      if (id) {
        getItemforServiceItemDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          singleData?.objHeader?.intPlantId,
          singleData?.objHeader?.intWarehouseId,
          setitemDDL
        )
      } else {
        getItemforServiceItemDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          location?.state?.plant?.value,
          location?.state?.wh?.value,
          setitemDDL
        )
      }
    } else {
      if (id) {
        getItemForOthersDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          singleData?.objHeader?.intPlantId,
          singleData?.objHeader?.intWarehouseId,
          setitemDDL
        )
      } else {
        getItemForOthersDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          location?.state?.plant?.value,
          location?.state?.wh?.value,
          setitemDDL
        )
      }
    }
  }

  return (
    <div className="itemRequest">
      <IForm
        title="Create Item Request"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={id ? singleData?.objHeader : initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          isEdit={id || false}
          addItemtoTheGrid={addItemtoTheGrid}
          remover={remover}
          id={id}
          singleData={singleData}
          rowlebelData={rowlebelData}
          location={location.state}
          itemDDL={itemDDL}
          onChangeForItemGroup={onChangeForItemGroup}
          plantId={location?.state?.plant?.value}
          whId={location?.state?.wh?.value}
          profileData={profileData}
        />
      </IForm>
    </div>
  )
}
