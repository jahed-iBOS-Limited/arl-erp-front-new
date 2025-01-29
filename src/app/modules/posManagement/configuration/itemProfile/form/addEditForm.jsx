/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import IForm from "./../../../../_helper/_form";
import { _todayDate } from './../../../../_helper/_todayDate';


import {
  getWareHouseDDL,
  updateItemProfile,
} from "../../helper";

const initData = {
  whName: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const ItemProfileForm = () => {
  const { id } = useParams();
  const [rowDto, setRowDto] = useState([]);
  const [whNameDDL, setWhNameDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([])
  const [objProps, setObjprops] = useState({});


  // get user profile data from store
  const {profileData,selectedBusinessUnit} = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  useEffect(() => {
    if(profileData?.accountId && selectedBusinessUnit?.value){
      getWareHouseDDL(profileData?.accountId, selectedBusinessUnit?.value, setWhNameDDL)
    }
  }, [profileData, selectedBusinessUnit])

  const saveHandler= async (values)=>{
    const updatedRowDto=rowDto.filter(data=>data.isUpdated===true && data.mrp>0)
    if(profileData?.accountId && selectedBusinessUnit?.value && values){
      await updateItemProfile(updatedRowDto)
      setRowDto([])
    }
  }
  

  const remover = (itemName) => {
    const filterData= rowDto.filter(item => item.itemName !== itemName)
    setRowDto(filterData);
  };

  const updateMRP = (value, index) => {
    const rowData=[...rowDto]
    rowData[index].mrp = parseFloat(value)
    rowData[index].isUpdated = true
    setRowDto(rowData)
  }  

  const updateRate = (value, index) => {
    const rowData=[...rowDto]
    rowData[index].salesRate = parseFloat(value)
    rowData[index].isUpdated = true
    setRowDto(rowData)
  }

  const updateBarCode = (value, index) => {
    const rowData=[...rowDto]
    rowData[index].barCode = value
    rowData[index].isUpdated = true
    setRowDto(rowData)
  }  

  const updateExpiredDate = (value, index) => {
    const rowData=[...rowDto]
    rowData[index].expiredDate = value
    rowData[index].isUpdated = true
    setRowDto(rowData)
  }  

  return (
    <>
      <IForm
        title={"Update Sales Rate"}
        getProps={setObjprops}
      >
       <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          actionBy={profileData?.userId}
          bussinessUnitId={selectedBusinessUnit?.value}
          whNameDDL={whNameDDL}
          setItemDDL={setItemDDL}
          itemDDL={itemDDL}
          rowDto={rowDto}
          setRowDto={setRowDto}
          remover={remover}
          isEdit={id}
          updateMRP={updateMRP}
          updateBarCode={updateBarCode}
          updateRate={updateRate}
          updateExpiredDate={updateExpiredDate}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
        />
      </IForm>
    </>
  );
};

export default ItemProfileForm;
