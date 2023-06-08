/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  getSingleDataForEdit,
  saveItemRequest,
  saveItemReqEdit,
  getItemDDL
} from "../helper";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const initData = {
  requestDate: _todayDate(),
  validTill: _todayDate(),
  dueDate: _todayDate(),
  referenceId: "",
  item: "",
  quantity: "",
  remarks: "",
  costCenter:"",
  projectName:""
};

export default function ItemRequestForm({
  history,
  match: {
    params: { id },
  },
}) {
  const location = useLocation()
  const [isDisabled, setDisabled] = useState(true);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);


  const [singleData, setSingleData] = useState([]);

  //item DDL
  const [itemDDL, setitemDDL] = useState([]);

  //row dataSourceDDL
  const [rowlebelData, setrowlebelData] = useState([])


  useEffect(() => {
    if(id){
      getItemDDL(profileData?.accountId, selectedBusinessUnit?.value,singleData?.objHeader?.intPlantId ,singleData?.objHeader?.intWarehouseId,setitemDDL)
      setrowlebelData(singleData.objRow)
    }else{
      getItemDDL(profileData.accountId, selectedBusinessUnit.value,location?.state.selectplant.value,location?.state.selectwarehouse.value,setitemDDL)
    }
  },[singleData])


  useEffect(() => {
    if (id) {
      getSingleDataForEdit(id, setSingleData);
    }
  }, [id]);






  const addItemtoTheGrid = (values) => { 
    if(!values.item  || !values.quantity || !values.remarks || !values.referenceId){
      toast.error('Please Fill All Data')
    }else{ 
      let data = rowlebelData.find(data => data.itemId === values.item.value)
      if(data){
        toast.error('Item already added')
      }else{
        let itemRow = {
          referenceId:values.referenceId,
          itemId:values.item.value,
          itemCode:values.item.code,
          itemName:values.item.label,
          uoMId:values.item.baseUoMId,
          uoMName:values.item.baseUoMName,
          requestQuantity:values.quantity,
          remarks:values.remarks
        }     
        setrowlebelData([...rowlebelData, itemRow])
      }
    }
  };

  const remover = (id) => {
    let data = rowlebelData.filter(data => data.itemId !== id)
    setrowlebelData(data)
  };

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
      
         let rowDatas = rowlebelData.map(data => {
           return {
            rowId:data.rowId || 0,
            referenceId:data.referenceId,
            itemId:data.itemId,
            itemCode:data.itemCode,
            itemName:data.itemName,
            uoMId:data.uoMId,
            uoMName:data.uoMName,
            requestQuantity:data.requestQuantity,
            remarks:data.remarks
           }
         })
        const payload = {
          itemRequestHeader: {
            itemRequestId: +id
          },
          itemRequestRow: rowDatas,
        };
       window.payload = payload
        saveItemReqEdit(payload, cb);
      } else {
        const payload = {
          objHeader: {
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            requestDate: values.requestDate,
            validTill: values.validTill,
            dueDate: values.dueDate,
            itemId: values.item.value,
            remarks: values.remarks,
            //itemRequestTypeId: 1,//location.state.selectrequestType.value,
            referenceTypeId: 1,
            sbuid: location.state.selectSBU.value,
            sbuname: location.state.selectSBU.label,
            plantId:location.state.selectplant.value,
            plantName: location.state.selectplant.label,
            warehouseId: location.state.selectwarehouse.value,
            actionBy: profileData.userId,
          },
          objRow: rowlebelData,
        };
        //window.payload = payload
        saveItemRequest(payload, cb, setrowlebelData);
      }
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});


  return (
    <div className="itemRequest">
      <IForm
        title="Create Item Request"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        <Form
          {...objProps}
          initData={id ? singleData?.objHeader : initData}
          saveHandler={saveHandler}
          disableHandler={disableHandler}
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
        />
      </IForm>
    </div>
  );
}
