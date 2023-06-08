/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import { _todayDate } from "./../../../_helper/_todayDate";

import {
  getWareHouseDDL,
  saveSalesDamage,
  editSalesDamage,
  getDamageItemById
} from "../helper";
import { isUniq } from "../../../_helper/uniqChecker";

const initData = {
  whName: '',
  narration: '',
  dteDamageEntryDate: _todayDate(),
};

const DamageEntryForm = () => {
  const { id } = useParams();
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [whNameDDL, setWhNameDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([])
  const [objProps, setObjprops] = useState({});
  const [editQuantity, setEditQuantity] = useState(false);


  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if(profileData?.accountId && selectedBusinessUnit?.value){
      getWareHouseDDL(profileData?.accountId, selectedBusinessUnit?.value, setWhNameDDL)
    }
  }, [profileData, selectedBusinessUnit])

  useEffect(() => {
    if(id){
      getDamageItemById(id, setSingleData, setRowDto)
    }
  }, [id])
  const saveHandler=(values)=>{
    if(profileData?.accountId && selectedBusinessUnit?.value && values){
      if(id){
        const payload={
          "objheader": {
            "damageEntryId": singleData?.damageEntryId,
            "warehouseId": values?.whName?.value,
            "dteDamageEntryDate": values?.dteDamageEntryDate,
            "narration": values?.narration
          },
          "objrow": rowDto
        }
        editSalesDamage(payload)
      }else{
        const payload={
          "objheader": {
            "accountId": profileData.accountId,
            "businessUnitId": selectedBusinessUnit.value,
            "warehouseId": values?.whName?.value,
            "dteDamageEntryDate": values?.dteDamageEntryDate,
            "narration": values?.narration,
            "actionBy": profileData.actionBy,
            "dteLastActionDateTime": "2021-08-21T08:39:19.363Z",
            "isActive": true
          },
          "objrow": rowDto
        }
        saveSalesDamage(payload)
      }
    }

  }
  
  const setter = (payload) => {
    if (isUniq("itemName", payload.itemName, rowDto)) {
      setRowDto([...rowDto, payload]);
    }
  };

  const remover = (itemName) => {
    const filterData= rowDto.filter(item => item.itemName !== itemName)
    setRowDto(filterData);
  };

  const updateQuantity = (value, index) => {
    const rowData=rowDto
    rowData[index].numDamageQty = parseInt(value)
    setRowDto(rowData)
  }  

  return (
    <>
      <IForm
        title={!id ? "Create Sales Damage" : "Edit Sales Damage"}
        getProps={setObjprops}
      >
       <Form
          {...objProps}
          initData={singleData || initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          actionBy={profileData?.userId}
          bussinessUnitId={selectedBusinessUnit?.value}
          whNameDDL={whNameDDL}
          setItemDDL={setItemDDL}
          itemDDL={itemDDL}
          rowDto={rowDto}
          setter={setter}
          remover={remover}
          isEdit={id}
          updateQuantity={updateQuantity}
          editQuantity={editQuantity}
          setEditQuantity={setEditQuantity}
        />
      </IForm>
    </>
  );
};

export default DamageEntryForm;
