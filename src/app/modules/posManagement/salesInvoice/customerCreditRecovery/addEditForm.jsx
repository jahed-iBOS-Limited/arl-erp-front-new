/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import IForm from "./../../../_helper/_form";

import {
  getWareHouseDDL,
  customerCreditRecovery,
} from "../helper";

const initData = {
  whName: ''
};

const CustomerCreditRecoveryForm = () => {
  const { id } = useParams();
  const [rowDto, setRowDto] = useState([]);
  const [whNameDDL, setWhNameDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([])
  const [objProps, setObjprops] = useState({});


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
      getWareHouseDDL(profileData?.accountId, selectedBusinessUnit?.value, profileData?.userId, setWhNameDDL)
    }
  }, [profileData, selectedBusinessUnit])

  const saveHandler= async ()=>{
    await customerCreditRecovery(rowDto)
    setRowDto([])
  }
  
  const remover = (itemName) => {
    const filterData= rowDto.filter(item => item.itemName !== itemName)
    setRowDto(filterData);
  };

  const updateRecoverAmount = (value, index) => {
    const rowData=rowDto
    rowData[index].recoverAmount = parseInt(value)
    setRowDto(rowData)
  }  

  return (
    <>
      <IForm
        title={"Customer Credit Recovery"}
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
          updateRecoverAmount={updateRecoverAmount}
        />
      </IForm>
    </>
  );
};

export default CustomerCreditRecoveryForm;
